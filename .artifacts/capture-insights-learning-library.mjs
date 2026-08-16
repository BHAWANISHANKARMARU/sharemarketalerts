import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const width = Number(process.argv[2]);
const height = Number(process.argv[3]);
const output = process.argv[4];
const target = await fetch(`http://127.0.0.1:9232/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then(response => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let id = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id;
  pending.set(requestId, { resolve, reject });
  socket.send(JSON.stringify({ id: requestId, method, params }));
});

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 600 });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/insights" });
  const result = await send("Runtime.evaluate", {
    expression: `(async () => {
      for (let i = 0; i < 120 && !document.querySelector('[data-insights-learning-library]'); i++) await new Promise(r => setTimeout(r, 50));
      await document.fonts.ready;
      const node = document.querySelector('[data-insights-learning-library]');
      node.scrollIntoView({ block: 'start' });
      await new Promise(r => setTimeout(r, 250));
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height, overflow: document.documentElement.scrollWidth - innerWidth };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const box = result.result.value;
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: Math.min(width, box.width + 16), height: box.height + 16, scale: 1 },
  });
  await writeFile(output, Buffer.from(screenshot.data, "base64"));
  process.stdout.write(`${JSON.stringify({ output, ...box })}\n`);
} finally {
  socket.close();
  await fetch(`http://127.0.0.1:9232/json/close/${target.id}`).catch(() => {});
}
