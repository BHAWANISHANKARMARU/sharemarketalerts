import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const port = Number(process.argv[2] ?? 9231);
const width = Number(process.argv[3] ?? 1920);
const output = process.argv[4] ?? ".artifacts/how-it-works-circle-1920.png";
const url = "http://127.0.0.1:3000/";

const target = await fetch(
  "http://127.0.0.1:" + port + "/json/new?" + encodeURIComponent("about:blank"),
  { method: "PUT" },
).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const eventWaiters = new Map();

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

  const waiters = eventWaiters.get(message.method);
  if (!waiters) return;
  eventWaiters.delete(message.method);
  for (const resolve of waiters) resolve(message.params);
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitFor(method) {
  return new Promise((resolve, reject) => {
    const waiters = eventWaiters.get(method) ?? [];
    waiters.push(resolve);
    eventWaiters.set(method, waiters);
    setTimeout(() => reject(new Error("Timed out waiting for " + method)), 15000);
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});

const loaded = waitFor("Page.loadEventFired");
await send("Page.navigate", { url });
await loaded;

const ready = await send("Runtime.evaluate", {
  expression:
    '(async () => { await document.fonts.ready; const title = document.querySelector("#how-it-works-title"); const section = title?.closest("section"); if (!section) throw new Error("How It Works section not found"); section.scrollIntoView({ block: "start" }); await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))); })()',
  awaitPromise: true,
  returnByValue: true,
});

if (ready.exceptionDetails) {
  throw new Error(ready.exceptionDetails.exception.description);
}

const boundsResult = await send("Runtime.evaluate", {
  expression:
    '(() => { const rect = document.querySelector("#how-it-works-title").closest("section").getBoundingClientRect(); return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, width: rect.width, height: rect.height }; })()',
  returnByValue: true,
});
const bounds = boundsResult.result.value;

const circleBoundsResult = await send("Runtime.evaluate", {
  expression:
    '(() => { const rect = document.querySelector("[data-decision-circle=true]").getBoundingClientRect(); return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }; })()',
  returnByValue: true,
});
const circleBounds = circleBoundsResult.result.value;

const headingBoundsResult = await send("Runtime.evaluate", {
  expression:
    '(() => { const h3 = [...document.querySelectorAll("h3")].find((node) => node.textContent === "AI DECISION ENGINE"); const block = h3?.parentElement; const subtitle = h3?.nextElementSibling; if (!h3 || !block || !subtitle) throw new Error("AI Decision Engine heading not found"); const h = h3.getBoundingClientRect(); const b = block.getBoundingClientRect(); const p = subtitle.getBoundingClientRect(); return { block: { x: b.left, y: b.top, width: b.width, height: b.height }, title: { x: h.left, y: h.top, width: h.width, height: h.height }, subtitle: { x: p.left, y: p.top, width: p.width, height: p.height }, titleLineHeight: getComputedStyle(h3).lineHeight }; })()',
  returnByValue: true,
});
const headingBounds = headingBoundsResult.result.value;

const introBoundsResult = await send("Runtime.evaluate", {
  expression:
    '(() => { const intro = document.querySelector("#how-it-works-title")?.nextElementSibling; if (!intro) throw new Error("How It Works intro not found"); const rect = intro.getBoundingClientRect(); return { x: rect.left, y: rect.top, width: rect.width, height: rect.height, bottom: rect.bottom }; })()',
  returnByValue: true,
});
const introBounds = introBoundsResult.result.value;

const introToHeadingGap = headingBounds.block.y - introBounds.bottom;
const headingToCircleGap =
  circleBounds.y -
  (headingBounds.subtitle.y + headingBounds.subtitle.height);
const viewportScale = Math.min(width, 1920) / 1920;
const minimumIntroGap = 28 * viewportScale;
const minimumCircleGap = 20 * viewportScale;

assert.ok(
  introToHeadingGap >= minimumIntroGap,
  `Intro-to-engine gap must be at least ${minimumIntroGap.toFixed(2)}px; received ${introToHeadingGap.toFixed(2)}px`,
);
assert.ok(
  headingToCircleGap >= minimumCircleGap,
  `Engine-to-circle gap must be at least ${minimumCircleGap.toFixed(2)}px; received ${headingToCircleGap.toFixed(2)}px`,
);

const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
  captureBeyondViewport: true,
  clip: {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    scale: 1,
  },
});

await writeFile(output, Buffer.from(screenshot.data, "base64"));
console.log(JSON.stringify({
  output,
  width,
  bounds,
  introBounds,
  circleBounds,
  headingBounds,
  gaps: { introToHeadingGap, headingToCircleGap },
}));
socket.close();
