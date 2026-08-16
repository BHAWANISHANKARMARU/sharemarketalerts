import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const width = Number(process.argv[2] ?? 1252);
const height = Number(process.argv[3] ?? 711);
const output = process.argv[4] ?? `.artifacts/ipo-reading-guide-${width}.png`;
const target = await fetch(`http://127.0.0.1:9232/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
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
await send("Page.navigate", { url: "http://127.0.0.1:3000/ipo" });
const evaluation = await send("Runtime.evaluate", {
  expression: `(async () => {
    await document.fonts.ready;
    for (let attempt = 0; attempt < 120; attempt += 1) {
      const guide = document.querySelector('[data-ipo-reading-guide]');
      if (guide) {
        guide.scrollIntoView({ block: 'start' });
        await new Promise((resolve) => setTimeout(resolve, 400));
        const rect = guide.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, overflow: document.documentElement.scrollWidth - innerWidth };
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Guide did not render');
  })()`,
  awaitPromise: true,
  returnByValue: true,
});
const rect = evaluation.result.value;
const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
});
await writeFile(output, Buffer.from(screenshot.data, "base64"));
socket.close();
await fetch(`http://127.0.0.1:9232/json/close/${target.id}`).catch(() => {});
process.stdout.write(JSON.stringify({ output, ...rect }));
