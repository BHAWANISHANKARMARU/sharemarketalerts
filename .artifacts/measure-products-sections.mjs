import WebSocket from "ws";

const widths = [1920, 1440, 1275, 1024, 768, 390];
for (const width of widths) {
  const height = width <= 600 ? 844 : 900;
  const target = await fetch(`http://127.0.0.1:9232/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
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
      const rect = (selector) => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, width: r.width, height: r.height }; };
      return {
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        decision: rect('[data-product-decision-tools]'),
        decisionRow: rect('[data-decision-tool]'),
        platform: rect('[data-platform-products]'),
        platformCard: rect('[data-platform-product-card]'),
        trust: rect('[data-platform-trust-strip]'),
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  process.stdout.write(`${JSON.stringify(result.result.value)}\n`);
  socket.close();
  await fetch(`http://127.0.0.1:9232/json/close/${target.id}`).catch(() => {});
}
