import assert from "node:assert/strict";

const port = Number(process.argv[2] ?? 9231);
const url = "http://127.0.0.1:3000/";
const widths = [1920, 1366, 768, 390];

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
const eventWaiters = new Map();

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
    return;
  }

  const waiters = eventWaiters.get(message.method);
  if (!waiters) return;
  eventWaiters.delete(message.method);
  for (const resolve of waiters) resolve(message.params);
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitFor(method) {
  return new Promise((resolve, reject) => {
    const waiters = eventWaiters.get(method) ?? [];
    waiters.push(resolve);
    eventWaiters.set(method, waiters);
    setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), 15000);
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });

const results = [];

for (const width of widths) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const loaded = waitFor("Page.loadEventFired");
  await send("Page.navigate", { url });
  await loaded;

  const evaluation = await send("Runtime.evaluate", {
    expression: `
      (async () => {
        await document.fonts.ready;
        const footer = document.querySelector("#site-footer");
        if (!footer) throw new Error("Footer not found");
        footer.scrollIntoView({ block: "start" });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const inner = footer.querySelector(":scope > div:last-of-type");
        const command = inner.children[1];
        const brand = command.children[0];
        const nav = command.children[1];
        const signup = command.children[2];
        const emailControl = signup.querySelector("div");
        const input = signup.querySelector("input");
        const button = signup.querySelector("button");
        const rect = (node) => {
          const value = node.getBoundingClientRect();
          return {
            left: value.left,
            right: value.right,
            top: value.top,
            bottom: value.bottom,
            width: value.width,
            height: value.height,
          };
        };
        const columns = (node) => {
          const style = getComputedStyle(node);
          if (style.display !== "grid" || style.gridTemplateColumns === "none") return 0;
          return style.gridTemplateColumns.split(/\\s+/).filter(Boolean).length;
        };

        return {
          viewportWidth: window.innerWidth,
          layoutWidth: document.documentElement.clientWidth,
          pageScrollWidth: document.documentElement.scrollWidth,
          pageScrollHeight: document.documentElement.scrollHeight,
          footerDocumentTop: footer.getBoundingClientRect().top + window.scrollY,
          footer: rect(footer),
          inner: rect(inner),
          command: rect(command),
          brand: rect(brand),
          nav: rect(nav),
          signup: rect(signup),
          input: rect(input),
          button: rect(button),
          commandDisplay: getComputedStyle(command).display,
          commandColumns: columns(command),
          navColumns: columns(nav),
          emailColumns: columns(emailControl),
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true,
  });

  if (evaluation.exceptionDetails) {
    throw new Error(evaluation.exceptionDetails.exception.description);
  }

  const metrics = evaluation.result.value;
  results.push({ width, ...metrics });

  assert.ok(
    metrics.pageScrollWidth <= metrics.layoutWidth + 1,
    `${width}px footer causes horizontal overflow: ${metrics.pageScrollWidth}px page width`,
  );
  assert.ok(metrics.inner.width <= 1380.5, `${width}px inner footer exceeds 1380px`);
  assert.ok(
    Math.abs(
      metrics.inner.left + metrics.inner.width / 2 -
      (metrics.footer.left + metrics.footer.width / 2)
    ) <= 2,
    `${width}px inner footer is not centered`,
  );
  assert.ok(metrics.input.height >= 44, `${width}px email input is under 44px tall`);
  assert.ok(metrics.button.height >= 44, `${width}px alert button is under 44px tall`);

  if (width >= 1101) {
    assert.ok(
      metrics.footer.height >= 550 && metrics.footer.height <= 610,
      `${width}px footer height must remain between 550px and 610px; received ${metrics.footer.height.toFixed(2)}px`,
    );
    assert.equal(metrics.commandDisplay, "grid", `${width}px command panel is not a grid`);
    assert.equal(metrics.commandColumns, 3, `${width}px command panel must have 3 columns`);
  } else if (width > 760) {
    assert.equal(metrics.commandColumns, 2, `${width}px command panel must have 2 columns`);
    assert.equal(metrics.navColumns, 2, `${width}px navigation must have 2 columns`);
    assert.ok(
      metrics.signup.top >= Math.max(metrics.brand.bottom, metrics.nav.bottom),
      `${width}px signup must span below the brand and navigation`,
    );
  } else {
    assert.equal(metrics.commandColumns, 1, `${width}px command panel must have 1 column`);
    assert.equal(metrics.navColumns, 2, `${width}px navigation must remain 2 columns`);
    assert.ok(metrics.brand.top < metrics.signup.top, `${width}px brand must precede signup`);
    assert.ok(metrics.signup.top < metrics.nav.top, `${width}px signup must precede navigation`);
    assert.equal(metrics.emailColumns, 1, `${width}px email controls must stack`);
    assert.ok(metrics.button.top > metrics.input.top, `${width}px alert button must follow input`);
  }
}

console.log(JSON.stringify(results, null, 2));
socket.close();
