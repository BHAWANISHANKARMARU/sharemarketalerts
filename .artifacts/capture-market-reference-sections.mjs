import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const port = Number(process.argv[4] || 9231);
const waitMs = Number(process.argv[5] || 2500);
const selectors = {
  overview: "[data-markets-overview-hero]",
  boards: "[aria-label='Indian equity activity and earnings']",
  heatmap: "#sector-heatmap",
  global: "#global-markets",
  calendar: "[data-market-calendar]",
  news: "[data-market-news-research]",
};

async function capture(name, width) {
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
  await send("Emulation.setDeviceMetricsOverride", { width, height: 980, deviceScaleFactor: 1, mobile: width <= 760 });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/markets" });
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  const selector = selectors[name];
  const evaluation = await send("Runtime.evaluate", {
    expression: `(async () => { await document.fonts.ready; const element = document.querySelector(${JSON.stringify(selector)}); element.scrollIntoView({ block: "start" }); await new Promise((resolve) => setTimeout(resolve, 500)); const rect = element.getBoundingClientRect(); return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height }; })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const rect = evaluation.result.value;
  const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: true, clip: { ...rect, scale: 1 } });
  const path = `.artifacts/${name}-reference-${width}.png`;
  await writeFile(path, Buffer.from(screenshot.data, "base64"));
  socket.close();
  return { path, rect };
}

const requestedNames = process.argv[2] ? process.argv[2].split(",") : Object.keys(selectors);
const requestedWidths = process.argv[3] ? process.argv[3].split(",").map(Number) : [1240, 768, 390];
for (const width of requestedWidths) {
  for (const name of requestedNames) console.log(await capture(name, width));
}
