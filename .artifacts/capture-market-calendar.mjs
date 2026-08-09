import { writeFile } from "node:fs/promises";

const tabs = await fetch("http://127.0.0.1:9235/json").then((response) => response.json());
const socket = new WebSocket(tabs[0].webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function command(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function capture(width, output) {
  await command("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width <= 760,
  });
  await command("Page.navigate", { url: "http://127.0.0.1:3000/markets" });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const result = await command("Runtime.evaluate", {
    expression: `(() => {
      const element = document.querySelector('[data-market-calendar]');
      element.scrollIntoView({ block: 'start' });
      const rect = element.getBoundingClientRect();
      return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
    })()`,
    returnByValue: true,
  });
  const rect = result.result.value;
  const screenshot = await command("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { ...rect, scale: 1 },
  });
  await writeFile(output, Buffer.from(screenshot.data, "base64"));
  return rect;
}

await command("Page.enable");
const desktop = await capture(1030, ".artifacts/market-calendar-1030.png");
const tablet = await capture(768, ".artifacts/market-calendar-768.png");
const mobile = await capture(390, ".artifacts/market-calendar-390.png");
const interactionResult = await command("Runtime.evaluate", {
  expression: `(async () => {
    const root = document.querySelector('[data-market-calendar]');
    const countRows = () => root.querySelectorAll('article[role="row"]').length;
    const beforeFilter = countRows();
    root.querySelector('[aria-label="Show high-impact events only"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const afterFilter = countRows();
    root.querySelector('[aria-label="Show all impact levels"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    root.querySelector('[aria-label="Next calendar day"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const selectedDay = [...root.querySelectorAll('[aria-label="Calendar week"] button')].find((button) => button.getAttribute('aria-pressed') === 'true')?.innerText.replaceAll('\\n', ' ');
    root.querySelector('[aria-label^="Show details for"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const expanded = Boolean(root.querySelector('[aria-label^="Hide details for"]'));
    return { beforeFilter, afterFilter, selectedDay, expanded };
  })()`,
  awaitPromise: true,
  returnByValue: true,
});
console.log(JSON.stringify({ desktop, tablet, mobile, interactions: interactionResult.result.value }, null, 2));
socket.close();
