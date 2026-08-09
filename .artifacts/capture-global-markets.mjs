import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const port = Number(process.argv[2] ?? 9231);
const width = Number(process.argv[3] ?? 1440);
const output = process.argv[4] ?? ".artifacts/global-markets-desktop.png";

const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const waiters = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
    return;
  }
  const listeners = waiters.get(message.method) || [];
  waiters.delete(message.method);
  listeners.forEach((resolve) => resolve(message.params));
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitFor(method) {
  return new Promise((resolve) => {
    const listeners = waiters.get(method) || [];
    listeners.push(resolve);
    waiters.set(method, listeners);
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height: 1100, deviceScaleFactor: 1, mobile: width < 700 });
const loaded = waitFor("Page.loadEventFired");
await send("Page.navigate", { url: "http://127.0.0.1:3000/markets" });
await loaded;
await send("Runtime.evaluate", {
  expression: '(async () => { await document.fonts.ready; const section = document.querySelector("#global-markets"); section.scrollIntoView({ block: "start" }); await new Promise((resolve) => setTimeout(resolve, 1200)); })()',
  awaitPromise: true,
});
const result = await send("Runtime.evaluate", {
  expression: '(() => { const rect = document.querySelector("#global-markets").getBoundingClientRect(); return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height }; })()',
  returnByValue: true,
});
const bounds = result.result.value;
const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: true, clip: { ...bounds, scale: 1 } });
await writeFile(output, Buffer.from(screenshot.data, "base64"));
socket.close();
