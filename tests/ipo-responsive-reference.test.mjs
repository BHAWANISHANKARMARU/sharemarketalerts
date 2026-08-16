import assert from "node:assert/strict";
import test from "node:test";
import WebSocket from "ws";

const cdpPort = process.env.TEST_CDP_PORT;

async function openPage(width, height) {
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

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/ipo" });

  let ready = false;
  for (let attempt = 0; attempt < 180 && !ready; attempt += 1) {
    ready = await evaluate(`(async () => {
      await document.fonts.ready;
      const root = document.querySelector('[data-ipo-reference-page]');
      const hero = root?.querySelector('[data-ipo-hero]');
      return root?.dataset.ready === 'true' && hero && getComputedStyle(hero).backgroundImage !== 'none';
    })()`);
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { target, socket, send, evaluate, ready };
}

async function closePage(page) {
  page.socket.close();
  await fetch(`http://127.0.0.1:${cdpPort}/json/close/${page.target.id}`);
}

test("IPO calendar follows the supplied desktop composition", { skip: !cdpPort }, async () => {
  const page = await openPage(1078, 725);
  try {
    assert.equal(page.ready, true, "IPO reference layout did not render");
    const result = await page.evaluate(`(() => {
      const root = document.querySelector('[data-ipo-reference-page]');
      const hero = root.querySelector('[data-ipo-hero]');
      const metrics = root.querySelector('[data-ipo-metrics]');
      const board = root.querySelector('[data-ipo-calendar-board]');
      const heroStyle = getComputedStyle(hero);
      const metricStyle = getComputedStyle(metrics);
      return {
        title: hero.querySelector('h1')?.textContent?.trim(),
        heroHeight: hero.getBoundingClientRect().height,
        heroImage: heroStyle.backgroundImage,
        metricColumns: metricStyle.gridTemplateColumns.split(' ').length,
        boardVisible: board.getBoundingClientRect().bottom <= innerHeight + 8,
        filterCount: root.querySelectorAll('[data-ipo-status-filter]').length,
        eventCount: board.querySelectorAll('[data-ipo-calendar-event]').length,
      };
    })()`);

    assert.equal(result.title, "IPO Calendar");
    assert.match(result.heroImage, /ipo-calendar-hero/i);
    assert.ok(result.heroHeight >= 190 && result.heroHeight <= 255, `Unexpected hero height ${result.heroHeight}`);
    assert.equal(result.metricColumns, 4);
    assert.equal(result.filterCount, 5);
    assert.ok(result.eventCount >= 1);
    assert.equal(result.boardVisible, true, "Offer calendar should be visible in the reference viewport");
  } finally {
    await closePage(page);
  }
});

test("IPO calendar is usable without viewport overflow on mobile", { skip: !cdpPort }, async () => {
  const page = await openPage(390, 844);
  try {
    assert.equal(page.ready, true, "IPO mobile layout did not render");
    const result = await page.evaluate(`(() => {
      const root = document.querySelector('[data-ipo-reference-page]');
      const hero = root.querySelector('[data-ipo-hero]');
      const metrics = root.querySelector('[data-ipo-metrics]');
      const firstEvent = root.querySelector('[data-ipo-calendar-event]');
      return {
        viewportOverflow: document.documentElement.scrollWidth - innerWidth,
        titleSize: parseFloat(getComputedStyle(hero.querySelector('h1')).fontSize),
        metricColumns: getComputedStyle(metrics).gridTemplateColumns.split(' ').length,
        eventWidth: firstEvent?.getBoundingClientRect().width || 0,
        rootWidth: root.getBoundingClientRect().width,
      };
    })()`);

    assert.ok(result.viewportOverflow <= 1, `Page overflows by ${result.viewportOverflow}px`);
    assert.ok(result.titleSize >= 40, `Mobile title is too small at ${result.titleSize}px`);
    assert.ok(result.metricColumns <= 2);
    assert.ok(result.eventWidth <= result.rootWidth);
  } finally {
    await closePage(page);
  }
});
