const port = Number(process.argv[2] ?? 9237);
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
const events = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (["Runtime.exceptionThrown", "Runtime.consoleAPICalled", "Network.loadingFailed"].includes(message.method)) {
    events.push({ method: message.method, params: message.params });
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
  const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
  }
  return response.result.value;
}
async function trustedClick(expression) {
  const point = await evaluate(`(() => { const node = ${expression}; node.scrollIntoView({ block: 'center' }); const rect = node.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const freshPoint = await evaluate(`(() => { const node = ${expression}; const rect = node.getBoundingClientRect(); return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; })()`);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", clickCount: 1, ...freshPoint });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", clickCount: 1, ...freshPoint });
  return point;
}

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/" });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  await evaluate(`(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((resolve) => setTimeout(resolve, 40)); } scrollTo(0, 0); })()`);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const state = await evaluate(`(() => {
    const entries = {
      hero: [...document.querySelectorAll('[aria-label="Top mover category"] button')][1],
      market: [...document.querySelectorAll('[aria-label="Chart period"] button')][1],
      pricing: [...document.querySelectorAll('[data-section="pricing"] button')][0],
      growth: document.querySelector('[data-section="growth-cta"] button'),
      footer: document.querySelector('[data-section="site-footer"] button'),
    };
    return {
      ...Object.fromEntries(Object.entries(entries).map(([name, node]) => [name, {
        text: node?.textContent.trim(),
        reactProperties: node ? Object.getOwnPropertyNames(node).filter((key) => key.toLowerCase().includes('react')) : [],
        disabled: node?.disabled,
        pointerEvents: node ? getComputedStyle(node).pointerEvents : null,
        rect: node ? (() => { const rect = node.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; })() : null,
      }])),
      runtime: {
        reactElementCount: [...document.querySelectorAll('*')].filter((node) => Object.getOwnPropertyNames(node).some((key) => key.toLowerCase().includes('react'))).length,
        reactElements: [...document.querySelectorAll('*')].filter((node) => Object.getOwnPropertyNames(node).some((key) => key.toLowerCase().includes('react'))).map((node) => ({ tag: node.tagName, id: node.id, className: String(node.className), keys: Object.getOwnPropertyNames(node).filter((key) => key.toLowerCase().includes('react')) })),
        mountedCharts: document.querySelectorAll('[data-chart-mounted="true"]').length,
        unmountedCharts: document.querySelectorAll('[data-chart-mounted="false"]').length,
        nextFlightLength: window.__next_f?.length ?? null,
        scripts: [...document.scripts].filter((script) => script.src).length,
      },
    };
  })()`);

  const before = await evaluate(`({
    heroPressed: [...document.querySelectorAll('[aria-label="Top mover category"] button')][1]?.getAttribute('aria-selected'),
    marketPressed: [...document.querySelectorAll('[aria-label="Chart period"] button')][1]?.getAttribute('aria-pressed'),
    monthlyPressed: [...document.querySelectorAll('[data-section="pricing"] button')][0]?.getAttribute('aria-pressed'),
    price: document.querySelector('[data-section="pricing"] article')?.textContent,
  })`);
  await evaluate(`(() => {
    window.__nativeClickCount = 0;
    [...document.querySelectorAll('[aria-label="Top mover category"] button')][1]
      .addEventListener('click', () => { window.__nativeClickCount += 1; });
  })()`);
  await trustedClick(`[...document.querySelectorAll('[aria-label="Top mover category"] button')][1]`);
  await trustedClick(`[...document.querySelectorAll('[aria-label="Chart period"] button')][1]`);
  await trustedClick(`[...document.querySelectorAll('[data-section="pricing"] button')][0]`);
  await new Promise((resolve) => setTimeout(resolve, 800));
  const after = await evaluate(`({
    heroPressed: [...document.querySelectorAll('[aria-label="Top mover category"] button')][1]?.getAttribute('aria-selected'),
    marketPressed: [...document.querySelectorAll('[aria-label="Chart period"] button')][1]?.getAttribute('aria-pressed'),
    monthlyPressed: [...document.querySelectorAll('[data-section="pricing"] button')][0]?.getAttribute('aria-pressed'),
    price: document.querySelector('[data-section="pricing"] article')?.textContent,
    nativeClickCount: window.__nativeClickCount,
  })`);
  console.log(JSON.stringify({ state, before, after, events }, null, 2));
} finally {
  socket.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
}
