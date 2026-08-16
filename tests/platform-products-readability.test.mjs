import assert from "node:assert/strict";
import test from "node:test";
import WebSocket from "ws";

const cdpPort = process.env.TEST_CDP_PORT;

async function inspect(width, height) {
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
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 600 });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/products" });
  const result = await send("Runtime.evaluate", {
    expression: `(async () => {
      for (let i = 0; i < 120 && !document.querySelector('[data-platform-product-card]'); i++) await new Promise(r => setTimeout(r, 50));
      await document.fonts.ready;
      const section = document.querySelector('[data-platform-products]');
      const card = document.querySelector('[data-platform-product-card]');
      const cardCopy = card.querySelector('header p');
      const listLabel = card.querySelector('li strong');
      const badge = card.querySelector('li em');
      const trust = document.querySelector('[data-platform-trust-item]');
      const trustCopy = trust.querySelector('p span');
      const grid = section.querySelector(':scope > div:not([data-platform-trust-strip])');
      const columns = (node) => getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length;
      const style = (node) => getComputedStyle(node);
      return {
        status: section ? 200 : 500,
        overflow: document.documentElement.scrollWidth - innerWidth,
        cardColumns: columns(grid),
        trustColumns: columns(document.querySelector('[data-platform-trust-strip]')),
        cardCopySize: parseFloat(style(cardCopy).fontSize),
        listLabelSize: parseFloat(style(listLabel).fontSize),
        badgeSize: parseFloat(style(badge).fontSize),
        trustCopySize: parseFloat(style(trustCopy).fontSize),
        sectionBackground: style(section).backgroundColor,
        cardBackground: style(card).backgroundColor,
        trustBackground: style(trust).backgroundColor,
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  socket.close();
  await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`).catch(() => {});
  return result.result.value;
}

test("platform products remain readable on desktop, tablet, and mobile", { skip: !cdpPort }, async () => {
  const cases = [
    [1280, 900, 3, 4],
    [768, 900, 2, 2],
    [390, 844, 1, 1],
  ];
  for (const [width, height, cardColumns, trustColumns] of cases) {
    const result = await inspect(width, height);
    assert.equal(result.status, 200, `${width}px route did not render`);
    assert.ok(result.overflow <= 1, `${width}px horizontal overflow: ${result.overflow}`);
    assert.equal(result.cardColumns, cardColumns, `${width}px product columns`);
    assert.equal(result.trustColumns, trustColumns, `${width}px trust columns`);
    assert.ok(result.cardCopySize >= 12, `${width}px product copy: ${result.cardCopySize}px`);
    assert.ok(result.listLabelSize >= 13, `${width}px list label: ${result.listLabelSize}px`);
    assert.ok(result.badgeSize >= 10, `${width}px badge: ${result.badgeSize}px`);
    assert.ok(result.trustCopySize >= 12, `${width}px trust copy: ${result.trustCopySize}px`);
    assert.notEqual(result.cardBackground, result.sectionBackground, `${width}px card surface is not distinct`);
    assert.notEqual(result.trustBackground, result.sectionBackground, `${width}px trust surface is not distinct`);
  }
});
