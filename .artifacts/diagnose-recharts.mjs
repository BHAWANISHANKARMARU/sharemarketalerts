const port = Number(process.argv[2] ?? 9231);
const url = process.argv[3] ?? "http://127.0.0.1:3001/";

const target = await fetch(
  `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,
  { method: "PUT" },
).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const diagnostics = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") {
    diagnostics.push(message.params.exceptionDetails?.exception?.description ?? "Runtime exception");
  }
  if (message.method === "Runtime.consoleAPICalled") {
    diagnostics.push(message.params.args?.map((arg) => arg.value ?? arg.description).join(" "));
  }
  if (!message.id) return;
  const entry = pending.get(message.id);
  if (!entry) return;
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

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url });
await new Promise((resolve) => setTimeout(resolve, 10000));
const result = await send("Runtime.evaluate", {
  expression: `(() => [...document.querySelectorAll('[data-financial-chart="true"]')].map((root) => {
    const box = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height, display: getComputedStyle(node).display, opacity: getComputedStyle(node).opacity };
    };
    const wrapper = root.querySelector('.recharts-wrapper');
    const surface = root.querySelector('.recharts-surface');
    const curve = root.querySelector('.recharts-area-curve');
    return {
      label: root.getAttribute('aria-label'),
      mounted: root.getAttribute('data-chart-mounted'),
      root: box(root),
      wrapper: box(wrapper),
      surface: box(surface),
      curve: box(curve),
      curveD: curve?.getAttribute('d') ?? null,
      stroke: curve ? getComputedStyle(curve).stroke : null,
      htmlLength: root.innerHTML.length,
      reactKeys: Object.keys(root).filter((key) => key.startsWith('__react')),
      wrapperHtml: wrapper?.outerHTML ?? null,
    };
  }))()`,
  returnByValue: true,
});

console.log(JSON.stringify(result.result.value, null, 2));
const pageState = await send("Runtime.evaluate", {
  expression: `({
    readyState: document.readyState,
    scripts: [...document.scripts].map((script) => script.src).filter(Boolean),
    resources: performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => name.includes('_next')).slice(-20),
    nextRootKeys: Object.keys(document.documentElement).filter((key) => key.startsWith('__react')),
  })`,
  returnByValue: true,
});
console.log(JSON.stringify({ pageState: pageState.result.value }, null, 2));
console.log(JSON.stringify({ diagnostics }, null, 2));
socket.close();
await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
