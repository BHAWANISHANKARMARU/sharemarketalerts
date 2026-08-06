import { writeFile } from "node:fs/promises";

const port = Number(process.argv[2] ?? 9231);
const width = Number(process.argv[3] ?? 1383);
const output = process.argv[4] ?? ".artifacts/testimonials-desktop-1383.png";
const url = "http://127.0.0.1:3000/";

const target = await fetch(
  `http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`,
  { method: "PUT" },
).then((response) => response.json());
console.log("target-created");

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
    setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), 15000);
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
console.log("domains-enabled");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const loaded = waitFor("Page.loadEventFired");
await send("Page.navigate", { url });
await loaded;
console.log("page-loaded");

const readyResult = await send("Runtime.evaluate", {
  expression: `(async () => {
    await document.fonts.ready;
    const section = document.querySelector("#testimonials");
    if (!section) throw new Error("Testimonials section not found");
    section.scrollIntoView({ block: "start" });
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    await Promise.all(
      [...section.querySelectorAll("img")].map(
        (image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve, reject) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", reject, { once: true });
              }),
      ),
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  })()`,
  awaitPromise: true,
  returnByValue: true,
});
if (readyResult.exceptionDetails) {
  throw new Error(readyResult.exceptionDetails.exception.description);
}
console.log("section-ready");

const boundsResult = await send("Runtime.evaluate", {
  expression: `(() => {
    const rect = document.querySelector("#testimonials").getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
      viewportTop: rect.top,
    };
  })()`,
  returnByValue: true,
});
const bounds = boundsResult.result.value;
console.log(JSON.stringify({ bounds }));

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
console.log(JSON.stringify({ output, width, bounds }));
socket.close();
