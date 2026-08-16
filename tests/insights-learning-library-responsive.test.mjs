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
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 600 });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/insights" });
  const result = await send("Runtime.evaluate", {
    expression: `(async () => {
      for (let i = 0; i < 120 && !document.querySelector('[data-insights-learning-library]'); i++) await new Promise(r => setTimeout(r, 50));
      await document.fonts.ready;
      const section = document.querySelector('[data-insights-learning-library]');
      const grid = section.lastElementChild;
      const cards = [...section.querySelectorAll('[data-learning-guide]')];
      const columns = node => getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length;
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        sectionColumns: columns(section),
        cardColumns: columns(grid),
        cardCount: cards.length,
        cardHeights: cards.map(card => card.getBoundingClientRect().height),
        copySizes: cards.map(card => parseFloat(getComputedStyle(card.querySelector('p')).fontSize)),
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  socket.close();
  await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`).catch(() => {});
  return result.result.value;
}

test("learning library follows the reference grid at every breakpoint", { skip: !cdpPort }, async () => {
  const cases = [
    [1280, 900, 2, 2],
    [768, 900, 1, 2],
    [390, 844, 1, 1],
  ];
  for (const [width, height, sectionColumns, cardColumns] of cases) {
    const result = await inspect(width, height);
    assert.ok(result.overflow <= 1, `${width}px horizontal overflow: ${result.overflow}`);
    assert.equal(result.sectionColumns, sectionColumns, `${width}px section columns`);
    assert.equal(result.cardColumns, cardColumns, `${width}px card columns`);
    assert.equal(result.cardCount, 4, `${width}px guide count`);
    assert.ok(result.copySizes.every(size => size >= 13), `${width}px guide copy sizes: ${result.copySizes.join(", ")}`);
    if (width > 900) {
      assert.ok(result.cardHeights.every(size => size >= 288), `desktop card heights: ${result.cardHeights.join(", ")}`);
      assert.ok(Math.max(...result.cardHeights) - Math.min(...result.cardHeights) <= 1, `unequal desktop cards: ${result.cardHeights.join(", ")}`);
    }
  }
});
