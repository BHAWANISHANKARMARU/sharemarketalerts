import assert from "node:assert/strict";

const port = Number(process.argv[2] ?? 9237);
const baseUrl = process.argv[3] ?? "http://127.0.0.1:3000/";
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
const errors = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") {
    errors.push(message.params.exceptionDetails?.exception?.description ?? "Runtime exception");
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    errors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(" "));
  }
  if (!message.id || !pending.has(message.id)) return;
  const entry = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) entry.reject(new Error(message.error.message));
  else entry.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${expression}`);
}

async function mouseClick(nodeExpression) {
  const point = await evaluate(`(() => {
    const node = ${nodeExpression};
    if (!node) throw new Error('Click target not found');
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", clickCount: 1, ...point });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", clickCount: 1, ...point });
}

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: baseUrl });
  await waitFor(`document.readyState === "complete" && Boolean(document.querySelector('[data-section="pricing"]'))`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const before = await evaluate(`(() => {
    const pricing = document.querySelector('[data-section="pricing"]');
    const opportunity = document.querySelector('[aria-label="Next opportunity"]');
    const firstOpportunity = opportunity.closest('section').querySelector('article a').getAttribute('aria-label');
    return {
      firstPrice: pricing.querySelector('article').textContent,
      firstOpportunity,
      emptyLinks: [...document.querySelectorAll('a')].filter((link) => !link.getAttribute('href')).length,
      liveCharts: document.querySelectorAll('[data-chart-engine="recharts"] .recharts-wrapper').length,
    };
  })()`);
  assert.equal(before.emptyLinks, 0);
  assert.ok(before.liveCharts >= 16);
  assert.match(before.firstPrice, /₹1,999/);

  await evaluate(`document.querySelector('[data-section="pricing"]').scrollIntoView({ block: 'center' })`);
  await new Promise((resolve) => setTimeout(resolve, 250));
  await mouseClick(`[...document.querySelectorAll('[data-section="pricing"] button')].find((button) => button.textContent.trim() === 'Monthly')`);
  await new Promise((resolve) => setTimeout(resolve, 400));
  const monthlyPrice = await evaluate(`document.querySelector('[data-section="pricing"] article').textContent`);
  assert.match(monthlyPrice, /₹2,499/);

  await evaluate(`document.querySelector('[data-section="market-intelligence"]').scrollIntoView({ block: 'center' })`);
  await new Promise((resolve) => setTimeout(resolve, 250));
  await mouseClick(`document.querySelector('[aria-label="Next opportunity"]')`);
  await mouseClick(`[...document.querySelectorAll('[aria-label="Chart period"] button')].find((button) => button.textContent.trim() === '5D')`);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const after = await evaluate(`(() => {
    const periods = document.querySelector('[aria-label="Chart period"]');
    return {
      firstPrice: ${JSON.stringify("monthly verified")},
      firstOpportunity: document.querySelector('[aria-label="Next opportunity"]').closest('section').querySelector('article a').getAttribute('aria-label'),
      rangePressed: [...periods.querySelectorAll('button')].find((button) => button.textContent.trim() === '5D').getAttribute('aria-pressed'),
    };
  })()`);
  assert.notEqual(after.firstOpportunity, before.firstOpportunity);
  assert.equal(after.rangePressed, "true");

  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: 390,
    screenHeight: 844,
  });
  await send("Page.navigate", { url: baseUrl });
  await waitFor(`document.readyState === "complete" && Boolean(document.querySelector('[data-mobile-hero="true"]'))`);
  await new Promise((resolve) => setTimeout(resolve, 350));
  await mouseClick(`document.querySelector('[data-mobile-hero="true"] button[aria-controls="mobile-navigation"]')`);
  await new Promise((resolve) => setTimeout(resolve, 250));
  const menu = await evaluate(`(() => {
    const button = document.querySelector('[data-mobile-hero="true"] button[aria-controls="mobile-navigation"]');
    return { expanded: button.getAttribute('aria-expanded'), visible: Boolean(document.querySelector('#mobile-navigation')) };
  })()`);
  assert.deepEqual(menu, { expanded: "true", visible: true });
  assert.deepEqual(errors, []);

  console.log(JSON.stringify({ desktop: { before, after }, mobile: { menu }, errors }, null, 2));
} finally {
  socket.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
}
