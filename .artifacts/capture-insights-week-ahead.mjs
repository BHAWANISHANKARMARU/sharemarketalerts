import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const width = Number(process.argv[2] ?? 1321);
const height = Number(process.argv[3] ?? 760);
const output = process.argv[4] ?? `.artifacts/insights-week-ahead-${width}.png`;
const target = await fetch(`http://127.0.0.1:9232/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;
  const item = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) item.reject(new Error(message.error.message));
  else item.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const next = ++id;
  pending.set(next, { resolve, reject });
  socket.send(JSON.stringify({ id: next, method, params }));
});

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
await send("Page.navigate", { url: "http://127.0.0.1:3000/insights" });
const result = await send("Runtime.evaluate", {
  expression: `(async()=>{await document.fonts.ready;for(let i=0;i<120&&!document.querySelector('[data-insights-week-ahead]');i++)await new Promise(r=>setTimeout(r,50));const el=document.querySelector('[data-insights-week-ahead]');el.scrollIntoView({block:'start'});await Promise.all([...el.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():img.decode().catch(()=>{})));await new Promise(r=>setTimeout(r,500));const r=el.getBoundingClientRect();return{x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height,overflow:document.documentElement.scrollWidth-innerWidth}})()`,
  awaitPromise: true,
  returnByValue: true,
});
const rect = result.result.value;
const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
  captureBeyondViewport: true,
  clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 },
});
await writeFile(output, Buffer.from(screenshot.data, "base64"));
socket.close();
await fetch(`http://127.0.0.1:9232/json/close/${target.id}`).catch(() => {});
process.stdout.write(JSON.stringify({ output, ...rect }));
