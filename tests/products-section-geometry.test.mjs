import assert from "node:assert/strict";
import test from "node:test";
import WebSocket from "ws";

const cdpPort = process.env.TEST_CDP_PORT;

async function measure(width, height) {
  const target = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
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
  await send("Page.navigate", { url: "http://127.0.0.1:3000/products" });
  const result = await send("Runtime.evaluate", {
    expression: `(async () => {
      await document.fonts.ready;
      for (let i = 0; i < 100 && !document.querySelector('[data-platform-products]'); i++) await new Promise(r => setTimeout(r, 50));
      const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        decisionHeight: rect('[data-product-decision-tools]').height,
        platformHeight: rect('[data-platform-products]').height,
        platformWidth: rect('[data-platform-products]').width,
        cardHeight: rect('[data-platform-product-card]').height,
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  socket.close();
  await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`).catch(() => {});
  return result.result.value;
}

test("products reference sections preserve readable desktop geometry", { skip: !cdpPort }, async () => {
  for (const width of [1275, 1920]) {
    const result = await measure(width, 900);
    assert.ok(result.decisionHeight >= 680 && result.decisionHeight <= 705, `${width}px decision height: ${result.decisionHeight}`);
    assert.ok(result.platformHeight >= 860 && result.platformHeight <= 900, `${width}px platform height: ${result.platformHeight}`);
    assert.ok(result.platformWidth <= 1180, `${width}px platform width: ${result.platformWidth}`);
    assert.ok(result.cardHeight >= 245 && result.cardHeight <= 270, `${width}px card height: ${result.cardHeight}`);
  }
});

test("products reference sections never create mobile viewport overflow", { skip: !cdpPort }, async () => {
  const result = await measure(390, 844);
  assert.ok(result.overflow <= 1, `mobile overflow: ${result.overflow}`);
  assert.ok(result.platformWidth <= 358, `mobile platform width: ${result.platformWidth}`);
});
