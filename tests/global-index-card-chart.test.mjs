import assert from "node:assert/strict";
import test from "node:test";
import WebSocket from "ws";

const cdpPort = process.env.TEST_CDP_PORT;

test("global index cards keep quote text clear and expose chart hover data", { skip: !cdpPort }, async (t) => {
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
      width: 1369,
      height: 850,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", { url: "http://127.0.0.1:3000/markets" });

    let cardReady = false;
    for (let attempt = 0; attempt < 150 && !cardReady; attempt += 1) {
      cardReady = await evaluate(`document.querySelectorAll('#global-markets [data-series-points]')[1]?.dataset.seriesPoints > 5`);
      if (!cardReady) await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.equal(cardReady, true, "Global index chart data did not load");

    const geometry = await evaluate(`(() => {
      const chart = document.querySelectorAll('#global-markets [data-series-points]')[1];
      const card = chart.closest('article');
      card.scrollIntoView({ block: 'center', inline: 'center' });
      const change = card.querySelector(':scope > span');
      const chartRect = chart.getBoundingClientRect();
      const changeRect = change.getBoundingClientRect();
      return {
        changeBottom: changeRect.bottom,
        chartTop: chartRect.top,
        hover: {
          x: chartRect.left + chartRect.width * 0.72,
          y: chartRect.top + chartRect.height * 0.5,
        },
      };
    })()`);

    await t.test("percentage label stays above the sparkline", () => {
      assert.ok(
        geometry.changeBottom + 4 <= geometry.chartTop,
        `Change label ends at ${geometry.changeBottom}, chart starts at ${geometry.chartTop}`,
      );
    });

    await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...geometry.hover });
    await new Promise((resolve) => setTimeout(resolve, 250));
    const hover = await evaluate(`(() => {
      const chart = document.querySelectorAll('#global-markets [data-series-points]')[1];
      const tooltip = chart.querySelector('.recharts-tooltip-wrapper');
      return {
        exists: Boolean(tooltip),
        visible: tooltip ? getComputedStyle(tooltip).visibility === 'visible' : false,
        text: tooltip?.textContent?.trim() || '',
        activeDot: Boolean(chart.querySelector('.recharts-active-dot')),
      };
    })()`);

    await t.test("hover reveals a visible value and active point", () => {
      assert.equal(hover.exists, true);
      assert.equal(hover.visible, true);
      assert.match(hover.text, /\d/);
      assert.equal(hover.activeDot, true);
    });
  } finally {
    socket.close();
    await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`);
  }
});
