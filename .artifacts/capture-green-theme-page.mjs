import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const page = process.argv[2] ?? "/";
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 1000);
const output = process.argv[5] ?? `.artifacts/green-theme-${page === "/" ? "home" : "markets"}-${width}.png`;
const selector = page === "/" ? "[data-home-emerald-theme]" : "[data-markets-emerald-theme]";

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

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
await send("Page.navigate", { url: `http://127.0.0.1:3000${page}` });

const result = await send("Runtime.evaluate", {
  expression: `(async () => {
    for (let attempt = 0; attempt < 160 && !document.querySelector(${JSON.stringify(selector)}); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await document.fonts.ready;
    await Promise.race([
      Promise.all([...document.images].map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      }))),
      new Promise((resolve) => setTimeout(resolve, 10000)),
    ]);
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const root = document.querySelector(${JSON.stringify(selector)});
    const style = getComputedStyle(root);
    const surfaceSelectors = ${JSON.stringify(page === "/" ? [
      '[data-section="ipo-gmp-tracker"]',
      '[data-section="how-it-works"]',
      '[data-section="what-you-receive"]',
      '[data-section="market-intelligence"]',
      '[data-section="market-coverage"]',
      '[data-section="testimonials"]',
      '[data-section="pricing"]',
      '[data-section="growth-cta"]',
    ] : [
      '[data-markets-overview-hero]',
      '[aria-label="Indian equity activity and earnings"]',
      '#sector-heatmap',
      '#global-markets',
      '[data-market-calendar]',
      '[data-market-news-research]',
    ])};
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      accent: style.getPropertyValue("--brand-2").trim(),
      heroImages: [...document.images].slice(0, 30).map((image) => image.currentSrc || image.src).filter((src) => src.includes("green")),
      surfaces: surfaceSelectors.map((surfaceSelector) => {
        const node = document.querySelector(surfaceSelector);
        const target = ${JSON.stringify(page === "/")} ? node?.firstElementChild || node : node;
        const nodeStyle = target ? getComputedStyle(target) : null;
        const beforeStyle = node ? getComputedStyle(node, "::before") : null;
        return {
          selector: surfaceSelector,
          background: nodeStyle?.backgroundImage || nodeStyle?.backgroundColor || "missing",
          before: beforeStyle?.backgroundImage || beforeStyle?.backgroundColor || "none",
        };
      }),
    };
  })()`,
  awaitPromise: true,
  returnByValue: true,
});

const metrics = result.result.value;
assert.equal(metrics.overflow, 0, `Horizontal overflow is ${metrics.overflow}px`);
assert.equal(metrics.accent, "#007a55");
const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
await writeFile(output, Buffer.from(screenshot.data, "base64"));
socket.close();
await fetch(`http://127.0.0.1:9232/json/close/${target.id}`).catch(() => {});
process.stdout.write(JSON.stringify({ output, ...metrics }));
