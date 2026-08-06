import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const port = Number(process.argv[2] ?? 9231);
const width = Number(process.argv[3] ?? 397);
const height = Number(process.argv[4] ?? 870);
const output = process.argv[5] ?? ".artifacts/mobile-hero-397.png";

const target = await fetch(
  `http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`,
  { method: "PUT" },
).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();

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

});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: width,
  screenHeight: height,
});

await send("Page.navigate", { url: "http://127.0.0.1:3000/" });

let pageReady = false;
for (let attempt = 0; attempt < 150; attempt += 1) {
  const state = await send("Runtime.evaluate", {
    expression: `
      location.origin === "http://127.0.0.1:3000" &&
      document.readyState === "complete" &&
      Boolean(document.querySelector("[data-mobile-hero=true]"))
    `,
    returnByValue: true,
  });
  if (state.result.value === true) {
    pageReady = true;
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
}
assert.ok(pageReady, "Timed out waiting for the mobile hero page");

const ready = await send("Runtime.evaluate", {
  expression: `
    (async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll("[data-mobile-hero=true] img")].map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      window.scrollTo(0, 0);
    })()
  `,
  awaitPromise: true,
  returnByValue: true,
});

if (ready.exceptionDetails) {
  throw new Error(ready.exceptionDetails.exception.description);
}

const boundsResult = await send("Runtime.evaluate", {
  expression: `
    (() => {
      const mobile = document.querySelector("[data-mobile-hero=true]");
      const canvas = document.querySelector("[data-mobile-canvas=true]");
      if (!mobile || !canvas) throw new Error("Mobile hero geometry not found");
      const toBounds = (node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      };
      return {
        display: getComputedStyle(mobile).display,
        mobileBounds: toBounds(mobile),
        canvasBounds: toBounds(canvas),
      };
    })()
  `,
  returnByValue: true,
});

const geometry = boundsResult.result.value;
if (boundsResult.exceptionDetails) {
  throw new Error(boundsResult.exceptionDetails.exception.description);
}
assert.notEqual(geometry.display, "none", "Mobile hero must be visible at this width");

const expectedCanvasWidth = Math.min(width, 430);
assert.ok(
  Math.abs(geometry.canvasBounds.width - expectedCanvasWidth) <= 0.75,
  `Expected a ${expectedCanvasWidth}px canvas; received ${geometry.canvasBounds.width}px`,
);

const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
  captureBeyondViewport: false,
  clip: { x: 0, y: 0, width, height, scale: 1 },
});

await writeFile(output, Buffer.from(screenshot.data, "base64"));
console.log(JSON.stringify({ width, height, output, ...geometry }));
socket.close();
await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
