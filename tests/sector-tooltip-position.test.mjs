import assert from "node:assert/strict";
import test from "node:test";
import WebSocket from "ws";

const cdpPort = process.env.TEST_CDP_PORT;

test("sector tooltip stays fully inside its heatmap card", { skip: !cdpPort }, async () => {
  const target = await fetch(
    `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`,
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
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result.value;
  };

  try {
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", { url: "http://127.0.0.1:3000/markets" });

    let chartReady = false;
    for (let attempt = 0; attempt < 120 && !chartReady; attempt += 1) {
      chartReady = await evaluate(`document.querySelector('#sector-heatmap [data-series-points]')?.dataset.seriesPoints > 5`);
      if (!chartReady) await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.equal(chartReady, true, "Sector chart data did not load");

    const chart = await evaluate(`(() => {
      const node = document.querySelectorAll('#sector-heatmap [data-chart-engine="recharts"]')[1];
      node.scrollIntoView({ block: 'center' });
      const rect = node.getBoundingClientRect();
      return { x: rect.left + rect.width * 0.88, y: rect.top + rect.height * 0.5 };
    })()`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...chart });
    await new Promise((resolve) => setTimeout(resolve, 250));

    const bounds = await evaluate(`(() => {
      const chart = document.querySelectorAll('#sector-heatmap [data-chart-engine="recharts"]')[1];
      const card = chart.closest('article');
      const tooltip = chart.querySelector('.recharts-tooltip-wrapper');
      const cardRect = card.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      return {
        visible: getComputedStyle(tooltip).visibility === 'visible',
        card: { top: cardRect.top, right: cardRect.right, bottom: cardRect.bottom, left: cardRect.left },
        tooltip: { top: tooltipRect.top, right: tooltipRect.right, bottom: tooltipRect.bottom, left: tooltipRect.left },
      };
    })()`);

    assert.equal(bounds.visible, true);
    assert.ok(bounds.tooltip.left >= bounds.card.left, JSON.stringify(bounds));
    assert.ok(bounds.tooltip.right <= bounds.card.right, JSON.stringify(bounds));
    assert.ok(bounds.tooltip.top >= bounds.card.top, JSON.stringify(bounds));
    assert.ok(bounds.tooltip.bottom <= bounds.card.bottom, JSON.stringify(bounds));
  } finally {
    socket.close();
    await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`);
  }
});
