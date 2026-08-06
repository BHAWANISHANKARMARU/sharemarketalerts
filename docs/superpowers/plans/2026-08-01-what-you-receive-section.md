# What You Receive Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the supplied 994 x 553 `What You Receive` reference as a native Next.js section directly below `HowItWorks`.

**Architecture:** Add one focused server component and one CSS Module, then compose the component into the existing App Router page. Inline SVG supplies the reference's decorative connectors, icons, and charts; no raster reference is shipped.

**Tech Stack:** Next.js 16 App Router, React 19 server components, CSS Modules, inline SVG, Node test runner.

## Global Constraints

- Preserve `src/app/components/Hero.js`, `Hero.module.css`, `HowItWorks.js`, and `HowItWorks.module.css` byte-for-byte.
- Render `WhatYouReceive` after `HowItWorks` in `src/app/page.js`.
- Match the supplied 994 x 553 desktop composition and scale proportionally through 1920 px.
- Desktop/laptop only; mobile is deferred.
- Do not embed the supplied screenshot in the page.
- Do not run Git commands or create commits.

---

### Task 1: Rendered copy and placement contract

**Files:**
- Create: `tests/what-you-receive-render.test.mjs`

**Interfaces:**
- Consumes: the homepage served at `http://127.0.0.1:3000`
- Produces: a real-page integration contract for the new section's copy and placement

- [ ] **Step 1: Write the failing rendered integration test**

```js
import assert from "node:assert/strict";
import test from "node:test";

function toVisibleText(html) {
  return html
    .replace(/<script[\\s\\S]*?<\\/script>/g, " ")
    .replace(/<style[\\s\\S]*?<\\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\\s+/g, " ")
    .trim();
}

test("the homepage renders What You Receive after How It Works", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);
  const visible = toVisibleText(await response.text());
  assert.ok(visible.includes("Everything you need, in one decisive signal."));
  assert.ok(visible.includes("RELIANCE"));
  assert.ok(visible.includes("Clear setup"));
  assert.ok(
    visible.indexOf("Everything you need, in one decisive signal.") >
      visible.indexOf("How signals become conviction."),
  );
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npx -y node@22 --test tests/what-you-receive-render.test.mjs`

Expected: FAIL with `Everything you need, in one decisive signal.` missing.

### Task 2: Native section implementation

**Files:**
- Create: `src/app/components/WhatYouReceive.js`
- Create: `src/app/components/WhatYouReceive.module.css`
- Modify: `src/app/page.js`

**Interfaces:**
- Consumes: existing `--font-serif` and `--font-sans` CSS variables
- Produces: default export `WhatYouReceive()` rendered by `Home()`

- [ ] **Step 1: Build the semantic component**

Create one `<section aria-labelledby="what-you-receive-title">` containing:

```jsx
<header>
  <p>WHAT YOU RECEIVE</p>
  <h2 id="what-you-receive-title">
    Everything you need,<br />in one <em>decisive signal.</em>
  </h2>
  <p>A complete setup with entry, target, risk and confidence —<br />ready to act on in seconds.</p>
</header>
```

Add the two left cards, central RELIANCE dashboard, three right cards, and four benefit cells using the exact copy in the design specification and reference. Mark purely decorative SVGs `aria-hidden="true"`.

- [ ] **Step 2: Implement the reference coordinate system**

Use `--receive-u: calc(min(100vw, 1920px) / 994)` on the section, a canvas height of `calc(553 * var(--receive-u))`, and express all reference geometry as `calc(<reference-px> * var(--receive-u))`. Match the sampled tokens in the design specification, including the dark dashboard, colored semantic values, fine connectors, soft shadows, and dot grid.

- [ ] **Step 3: Insert the component after HowItWorks**

```jsx
import WhatYouReceive from "./components/WhatYouReceive";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhatYouReceive />
    </>
  );
}
```

- [ ] **Step 4: Run the new and existing rendered tests and verify GREEN**

Run: `npx -y node@22 --test tests/how-it-works-render.test.mjs tests/what-you-receive-render.test.mjs`

Expected: both tests PASS.

### Task 3: Pixel calibration and verification

**Files:**
- Modify: `src/app/components/WhatYouReceive.js`
- Modify: `src/app/components/WhatYouReceive.module.css`

**Interfaces:**
- Consumes: the native section from Task 2 and the supplied 994 x 553 reference
- Produces: calibrated desktop renders and a verified local build

- [ ] **Step 1: Capture the 994 px page and crop the third section**

Run headless Chrome at a viewport tall enough to include all three sections, then crop the 994 x 553 region beginning immediately after the Hero and `HowItWorks` sections.

- [ ] **Step 2: Compare and refine**

Compare reference and implementation side by side. Adjust only `WhatYouReceive.js` and `WhatYouReceive.module.css` until the geometry, type, colors, connector paths, dashboard density, and shadows align.

- [ ] **Step 3: Verify laptop and wide desktop scaling**

Capture 1366 px and 1920 px renders and confirm proportional scaling with no clipping or intrusion into adjacent sections.

- [ ] **Step 4: Run final checks**

```bash
npx -y node@22 --test tests/how-it-works-render.test.mjs tests/what-you-receive-render.test.mjs
npm run lint
npm run build
sha256sum src/app/components/Hero.js src/app/components/Hero.module.css src/app/components/HowItWorks.js src/app/components/HowItWorks.module.css
```

Expected: tests, lint, and build succeed; checksums match the recorded pre-change values.
