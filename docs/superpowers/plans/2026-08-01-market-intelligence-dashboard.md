# Market Intelligence Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete 822 x 543 market-intelligence dashboard reference as the fourth native Next.js homepage section.

**Architecture:** Add a focused server component and CSS Module, compose it after `WhatYouReceive`, and ship the user-supplied radar PNG as one static asset. All other visual content remains native HTML/CSS/inline SVG and scales from a single 822 x 543 reference coordinate system.

**Tech Stack:** Next.js 16 App Router, React 19 server components, CSS Modules, `next/image`, inline SVG, Node test runner.

## Global Constraints

- Preserve `Hero`, `HowItWorks`, and `WhatYouReceive` component and CSS files byte-for-byte.
- Render `MarketIntelligence` immediately after `WhatYouReceive`.
- Match the supplied 822 x 543 reference and scale proportionally through 1920 px.
- Laptop and desktop only; mobile remains deferred.
- Use `/home/gaurav/Downloads/ChatGPT Image Aug 1, 2026, 10_25_48 PM.png` only in the lower-left radar wedge.
- Keep all other content native; do not embed the complete reference screenshot.
- Do not run Git commands or create commits.

---

### Task 1: Rendered content and placement contract

**Files:**
- Create: `tests/market-intelligence-render.test.mjs`

**Interfaces:**
- Consumes: the homepage served at `http://127.0.0.1:3000`
- Produces: a real-page contract for the section's unique copy, data, and ordering

- [ ] **Step 1: Write the rendered integration test**

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

test("the homepage renders Market Intelligence after What You Receive", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);
  const visible = toVisibleText(await response.text());
  for (const copy of [
    "SEE IT BEFORE THE MARKET MOVES.",
    "MARKET STATUS:",
    "MARKETS OPEN",
    "MARKET PULSE",
    "TOP GAINERS",
    "TOP LOSERS",
    "LIVE HIGH PROBABILITY OPPORTUNITIES",
    "34 NEW",
    "25,350.00",
    "USD/INR",
  ]) assert.ok(visible.includes(copy), `Missing: ${copy}`);
  assert.ok(
    visible.indexOf("SEE IT BEFORE THE MARKET MOVES.") >
      visible.indexOf("Everything you need, in one decisive signal."),
  );
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run: `npx -y node@22 --test tests/market-intelligence-render.test.mjs`

Expected: FAIL with `Missing: SEE IT BEFORE THE MARKET MOVES.`

### Task 2: Static radar asset and native component

**Files:**
- Create: `public/images/market-intelligence-radar.png`
- Create: `src/app/components/MarketIntelligence.js`
- Create: `src/app/components/MarketIntelligence.module.css`
- Modify: `src/app/page.js`

**Interfaces:**
- Consumes: existing `--font-sans`, the approved design specification, and `/images/market-intelligence-radar.png`
- Produces: default export `MarketIntelligence()` for the homepage

- [ ] **Step 1: Copy the approved binary asset**

Copy the exact supplied PNG bytes to `public/images/market-intelligence-radar.png`; verify both files have the same SHA-256 digest.

- [ ] **Step 2: Build the semantic server component**

Define immutable arrays for the five market-strip cells, gainers, losers, and four opportunity cards. Render this fixed section structure:

```jsx
<section aria-label="Share Market Alerts market intelligence">
  <div className={s.canvas}>
    <aside className={s.editorial}>
      <BrandMark />
      <h2>SEE IT <em>BEFORE</em> THE MARKET MOVES.</h2>
      <p>Real-time intelligence that surfaces high-probability opportunities before everyone else.</p>
      <RadarWedge />
    </aside>
    <div className={s.dashboard}>
      <StatusRow />
      <MarketStrip />
      <div className={s.mainGrid}>
        <MarketPulse />
        <MoversPanel />
      </div>
      <Opportunities />
    </div>
  </div>
</section>
```

Implement `BrandMark`, `RadarWedge`, `StatusRow`, `MarketStrip`, `MarketPulse`, `MoversPanel`, and `Opportunities` as private functions in `MarketIntelligence.js`. Each helper renders the exact static strings and values listed in the approved specification and consumes only the immutable arrays declared in that file.

Use `next/image` only for the supplied radar PNG. Use `aria-hidden="true"` for decorative chart/icon SVGs and keep all values as visible text.

- [ ] **Step 3: Implement the 822 x 543 coordinate system**

Use `--market-u: calc(min(100vw, 1920px) / 822)` and `height: calc(543 * var(--market-u))`. Express every reference coordinate, radius, font size, line width, and spacing value through `var(--market-u)`. Reproduce the angled image wedge with `clip-path`, the dark five-cell strip, circular intraday chart, gainers/losers rows, four pulse statistics, and opportunity rail.

- [ ] **Step 4: Compose the section into the homepage**

```jsx
import MarketIntelligence from "./components/MarketIntelligence";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhatYouReceive />
      <MarketIntelligence />
    </>
  );
}
```

- [ ] **Step 5: Run rendered tests and verify GREEN**

Run: `npx -y node@22 --test tests/how-it-works-render.test.mjs tests/what-you-receive-render.test.mjs tests/market-intelligence-render.test.mjs`

Expected: all three tests PASS.

### Task 3: Pixel calibration and toolchain verification

**Files:**
- Modify: `src/app/components/MarketIntelligence.js`
- Modify: `src/app/components/MarketIntelligence.module.css`

**Interfaces:**
- Consumes: the native section, supplied 822 x 543 reference, and existing localhost development server
- Produces: pixel-calibrated 822 px, 1366 px, and 1920 px renders

- [ ] **Step 1: Capture and crop the fourth section at 822 px**

Use headless Chrome with a tall viewport, determine the exact fourth-section offset from the prior three section heights, and crop an 822 x 543 image.

- [ ] **Step 2: Compare and refine**

Create a side-by-side reference/build image. Adjust only the new component and CSS until the left editorial geometry, radar crop, headline, strip, chart, tables, metrics, opportunity cards, borders, and shadows align.

- [ ] **Step 3: Check desktop scaling**

Capture 1366 px and 1920 px versions and verify no clipping, overflow, or drift.

- [ ] **Step 4: Run fresh completion checks**

```bash
npx -y node@22 --test tests/how-it-works-render.test.mjs tests/what-you-receive-render.test.mjs tests/market-intelligence-render.test.mjs
npm run lint
npm run build
sha256sum src/app/components/Hero.js src/app/components/Hero.module.css src/app/components/HowItWorks.js src/app/components/HowItWorks.module.css src/app/components/WhatYouReceive.js src/app/components/WhatYouReceive.module.css
```

Expected: three tests, lint, and build succeed; all recorded existing-section checksums remain unchanged.
