import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const port = Number(process.argv[2] ?? 9231);
const width = Number(process.argv[3] ?? 1264);
const output = process.argv[4] ?? ".artifacts/markets-hero-current.png";
const height = Number(process.argv[5] ?? (width < 700 ? 900 : 760));

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
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 700 });
const loaded = waitFor("Page.loadEventFired");
await send("Page.navigate", { url: "http://127.0.0.1:3000/markets" });
await loaded;
await send("Runtime.evaluate", {
  expression: `(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    document.querySelector('[data-markets-overview-hero]').scrollIntoView({ block: 'start' });
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  })()`,
  awaitPromise: true,
});
const result = await send("Runtime.evaluate", {
  expression: `(() => {
    const rect = document.querySelector('[data-markets-overview-hero]').getBoundingClientRect();
    return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
  })()`,
  returnByValue: true,
});
const bounds = result.result.value;
const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: true, clip: { ...bounds, scale: 1 } });
await writeFile(output, Buffer.from(screenshot.data, "base64"));
const portalResult = await send("Runtime.evaluate", {
  expression: `(() => [...document.querySelectorAll('nextjs-portal')].map((portal) => ({ text: portal.shadowRoot?.innerText || '', html: portal.shadowRoot?.innerHTML || '' })))()`,
  returnByValue: true,
});
socket.close();
process.stdout.write(JSON.stringify({ bounds, portals: portalResult.result.value }));
