import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const port = Number(process.argv[2] ?? 9232);
const width = Number(process.argv[3] ?? 1252);
const height = Number(process.argv[4] ?? 711);
const output = process.argv[5] ?? `.artifacts/products-page-${width}.png`;
const selector = process.argv[6] ?? null;
const pageUrl = process.argv[7] ?? "http://127.0.0.1:3000/products";
const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;
  const entry = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) entry.reject(new Error(message.error.message));
  else entry.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
await send("Page.navigate", { url: pageUrl });
await send("Runtime.evaluate", {
  expression: `(async () => {
    await document.fonts.ready;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      if (document.querySelector('[data-products-hero="true"], [data-insights-hub]')) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    const target = ${JSON.stringify(selector)} ? document.querySelector(${JSON.stringify(selector)}) : null;
    if (target) target.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 100));
  })()`,
  awaitPromise: true,
});
const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
await writeFile(output, Buffer.from(screenshot.data, "base64"));
socket.close();
await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
process.stdout.write(JSON.stringify({ output, width, height }));
