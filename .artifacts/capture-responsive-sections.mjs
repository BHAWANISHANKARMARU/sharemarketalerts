import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const port = Number(process.argv[2] ?? 9231);
const width = Number(process.argv[3] ?? 390);
const height = Number(process.argv[4] ?? 844);
const output = process.argv[5] ?? ".artifacts/lower-sections-390.png";
const pageUrl = process.env.CAPTURE_URL ?? "http://127.0.0.1:3000/";
const pageOrigin = new URL(pageUrl).origin;

const sectionNames = [
  "ipo-gmp-tracker",
  "how-it-works",
  "what-you-receive",
  "market-intelligence",
  "market-coverage",
  "testimonials",
  "pricing",
  "growth-cta",
  "site-footer",
];

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

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
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

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception.description);
  }
  return result.result.value;
}

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: width,
    screenHeight: height,
  });

  await send("Page.navigate", { url: pageUrl });

  let pageReady = false;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    pageReady = await evaluate(`
      location.origin === ${JSON.stringify(pageOrigin)} &&
      document.readyState === "complete" &&
      ${JSON.stringify(sectionNames)}.every((name) =>
        Boolean(document.querySelector('[data-section="' + name + '"]'))
      )
    `);
    if (pageReady) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(pageReady, "Timed out waiting for all responsive sections");

  await evaluate(`
    (async () => {
      await document.fonts.ready;
      const step = Math.max(600, innerHeight * 0.8);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 45));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 250));
      await Promise.race([
        Promise.all([...document.images].map((image) => {
          if (image.complete) return Promise.resolve();
          return new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        })),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]);
      window.scrollTo(0, 0);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    })()
  `);

  const geometry = await evaluate(`
    (() => {
      const names = ${JSON.stringify(sectionNames)};
      const sections = names.map((name) => {
        const node = document.querySelector('[data-section="' + name + '"]');
        if (!node) throw new Error("Missing section: " + name);
        const rect = node.getBoundingClientRect();
        return {
          name,
          x: rect.x,
          y: rect.y + scrollY,
          width: rect.width,
          height: rect.height,
          right: rect.right,
        };
      });
      const toRect = (node) => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          className: String(node.className),
          x: rect.x,
          width: rect.width,
          right: rect.right,
          clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
        };
      };
      return {
        viewport: {
          width: innerWidth,
          height: innerHeight,
          clientWidth: document.documentElement.clientWidth,
        },
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        sections,
        diagnostics: {
          clippedElements: [...document.querySelectorAll("main *, footer *")]
            .filter((node) => {
              const rect = node.getBoundingClientRect();
              return node.scrollWidth > node.clientWidth + 1 || rect.left < -1 || rect.right > innerWidth + 1;
            })
            .slice(0, 60)
            .map(toRect),
          pricingButtons: [...document.querySelectorAll('[data-section="pricing"] button')]
            .map((button) => ({
              ...toRect(button),
              text: button.textContent.trim(),
              children: [...button.children].map(toRect),
            })),
        },
      };
    })()
  `);

  assert.ok(
    geometry.scrollWidth <= geometry.viewport.clientWidth + 1,
    `Page overflows horizontally: ${geometry.scrollWidth}px > ${geometry.viewport.clientWidth}px`,
  );
  for (const section of geometry.sections) {
    assert.ok(section.x >= -1, `${section.name} starts outside the viewport at ${section.x}px`);
    assert.ok(
      section.right <= geometry.viewport.clientWidth + 1,
      `${section.name} ends outside the viewport at ${section.right}px`,
    );
    assert.ok(section.height > 200, `${section.name} is unexpectedly short at ${section.height}px`);
  }

  const metrics = await send("Page.getLayoutMetrics");
  const content = metrics.cssContentSize ?? metrics.contentSize;
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(content.width),
      height: Math.ceil(content.height),
      scale: 1,
    },
  });

  await writeFile(output, Buffer.from(screenshot.data, "base64"));
  console.log(JSON.stringify({ output, ...geometry }, null, 2));
} finally {
  socket.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
}
