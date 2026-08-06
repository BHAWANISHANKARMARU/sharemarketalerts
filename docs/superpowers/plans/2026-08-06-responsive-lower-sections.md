# Responsive Lower Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reflow every homepage section below the hero into readable phone and tablet layouts without changing approved desktop pixels.

**Architecture:** Keep the existing Server Components and desktop CSS intact. Add explicit section hooks and IPO data labels, then append isolated `@media (max-width: 900px)` and `@media (max-width: 640px)` overrides to each CSS Module so fixed desktop canvases become natural-flow responsive sections. Add a Chrome geometry helper to prove viewport containment and a rendered-page contract to preserve content and order.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4 Server Components, JavaScript, CSS Modules, Node test runner, Chrome DevTools Protocol, FFmpeg.

## Global Constraints

- Apply responsive lower-section changes only at viewport widths of 900px and below.
- Keep the mobile hero unchanged.
- Preserve every existing content item.
- Preserve the 1920px desktop page exactly.
- Use 20px phone gutters and 28–36px tablet gutters.
- Create no page-level horizontal scrolling.
- Add no dependencies.
- Perform no Git or GitHub operations.

---

### Task 1: Establish the responsive regression contract and visual baseline

**Files:**
- Create: `tests/responsive-lower-sections-render.test.mjs`
- Create: `.artifacts/lower-sections-desktop-before.png`
- Inspect: `src/app/page.js`
- Inspect: `src/app/template.js`

**Interfaces:**
- Consumes: rendered homepage HTML from `http://127.0.0.1:3000/`.
- Produces: an ordered section contract and a desktop reference image used by Task 8.

- [x] **Step 1: Capture the desktop baseline**

Run:

```bash
google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1920,1080 \
  --screenshot=.artifacts/lower-sections-desktop-before.png \
  http://127.0.0.1:3000/
```

- [x] **Step 2: Write the failing rendered-page test**

Create `tests/responsive-lower-sections-render.test.mjs` with:

```js
import assert from "node:assert/strict";
import test from "node:test";

const LOWER_SECTIONS = [
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

test("homepage exposes every responsive lower section in order", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);
  const html = await response.text();

  let previous = -1;
  for (const section of LOWER_SECTIONS) {
    const position = html.indexOf(`data-section="${section}"`);
    assert.ok(position > previous, `Missing or out-of-order section: ${section}`);
    previous = position;
  }

  for (const label of [
    "IPO Size (₹ Cr)",
    "Issue Price (₹)",
    "GMP (₹)",
    "GMP (%)",
    "Estimated Listing Price (₹)",
    "Expected Listing Gain (%)",
    "Last Updated",
  ]) {
    assert.ok(html.includes(`data-label="${label}"`), `Missing mobile IPO label: ${label}`);
  }
});
```

- [x] **Step 3: Run the focused test and confirm RED**

Run:

```bash
node --test tests/responsive-lower-sections-render.test.mjs
```

Expected: FAIL because `what-you-receive`, `how-it-works`, and `market-intelligence` do not yet expose every required `data-section`, and the IPO cells lack `data-label` attributes.

---

### Task 2: Add semantic hooks and make IPO GMP Tracker responsive

**Files:**
- Modify: `src/app/components/IpoMarketIntelligence.js`
- Modify: `src/app/components/IpoMarketIntelligence.module.css`
- Modify: `src/app/components/HowItWorks.js`
- Modify: `src/app/components/WhatYouReceive.js`
- Modify: `src/app/components/MarketIntelligence.js`
- Test: `tests/responsive-lower-sections-render.test.mjs`

**Interfaces:**
- Consumes: `LOWER_SECTIONS` and IPO label requirements from Task 1.
- Produces: stable `data-section` hooks and table cells that can render as labeled mobile cards.

- [x] **Step 1: Add the missing section hooks**

Add these exact attributes to the existing root sections:

```jsx
data-section="how-it-works"
data-section="what-you-receive"
data-section="market-intelligence"
```

- [x] **Step 2: Add IPO mobile labels to every body cell**

Change each row to use the following attributes:

```jsx
<td data-label="Company Name"><strong>{row.company}</strong></td>
<td data-label="IPO Size (₹ Cr)">{row.size}</td>
<td data-label="Issue Price (₹)">{row.issue}</td>
<td data-label="GMP (₹)" className={resultClass}>{row.gmp}</td>
<td data-label="GMP (%)" className={resultClass}>{row.percent}</td>
<td data-label="Estimated Listing Price (₹)" className={resultClass}>{row.listing}</td>
<td data-label="Expected Listing Gain (%)" className={resultClass}>{row.gain}</td>
<td data-label="Last Updated" className={s.updated}>20 May 2025<br />10:30 AM</td>
```

- [x] **Step 3: Append the tablet IPO layout**

At `max-width: 900px`, set `.section` and `.canvas` to `height:auto`, `max-height:none`, and `overflow:visible`; give `.canvas` `padding:72px 32px`; make `.header`, `.datePanel`, `.kpiGrid`, `.tableShell`, `.infoGrid`, and `.sourceBar` relative/static flow items. Use a three-column KPI grid, a block table body, and seven responsive row cards with `border-radius:16px`, `padding:18px`, and a two-column data grid.

Use this row-card foundation:

```css
.trackerTable,
.trackerTable tbody,
.trackerTable tr,
.trackerTable td { display: block; width: 100%; }
.trackerTable thead { display: none; }
.trackerTable tbody { display: grid; gap: 16px; }
.trackerTable tr {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 22px;
  padding: 20px;
  border: 1px solid #e3e9f3;
  border-radius: 16px;
  background: #fff;
}
.trackerTable td::before {
  content: attr(data-label);
  display: block;
  margin-bottom: 6px;
  color: #75809d;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .04em;
  text-transform: uppercase;
}
```

- [x] **Step 4: Append the phone IPO layout**

At `max-width: 640px`, use `padding:64px 20px`, stack the date panel and KPI cards, reduce the heading to `clamp(42px, 13vw, 54px)`, and keep each row as a two-column card with the company cell spanning both columns. Stack `.infoGrid`, and allow `.sourceBar` to wrap with 12px gaps.

- [x] **Step 5: Run the focused test and confirm GREEN**

Run:

```bash
node --test tests/responsive-lower-sections-render.test.mjs
```

Expected: PASS.

---

### Task 3: Reflow How It Works and What You Receive

**Files:**
- Modify: `src/app/components/HowItWorks.module.css`
- Modify: `src/app/components/WhatYouReceive.module.css`
- Test: `tests/how-it-works-render.test.mjs`
- Test: `tests/what-you-receive-render.test.mjs`

**Interfaces:**
- Consumes: existing semantic cards and `data-section` hooks.
- Produces: vertical decision-story and signal-package layouts at 900px and below.

- [x] **Step 1: Add the How It Works responsive foundation**

At `max-width: 900px`, set `.canvas` to normal flow with `height:auto`, `min-width:0`, and `padding:80px 32px`; change `.header`, `.inputs`, `.engine`, `.outcomes`, `.values`, `.columnHeading`, `.inputCards`, `.decisionCircle`, `.validation`, and all outcome cards from absolute positioning to relative/static positioning. Hide `.connectors` only.

Use:

```css
.inputs,
.engine,
.outcomes { position: relative; inset: auto; }
.inputCards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.outcomes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.alertCard,
.receiveCard { grid-column: 1 / -1; }
.values { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
```

Scale `.decisionCircle` to `min(520px, 78vw)` with `aspect-ratio:1`, keep the orbit/core/nodes proportional by defining `--how-u: calc(min(78vw, 520px) / 346)`, and center it with `margin-inline:auto`.

- [x] **Step 2: Add the How It Works phone layout**

At `max-width: 640px`, use 20px gutters, one-column `.inputCards` and `.outcomes`, a two-column `.values` grid, `clamp(38px, 12vw, 52px)` heading, 15px intro copy, and `min(340px, 94vw)` decision circle.

- [x] **Step 3: Add the What You Receive tablet layout**

At `max-width: 900px`, make `.canvas` normal flow with `padding:80px 32px`, hide `.connectors` and decorative dot grids, and place `.introHeader`, `.dashboard`, supporting cards, side cards, and `.benefitRail` in a grid. Use a full-width intro and dashboard, a two-column supporting-card grid, a three-column side-card grid, and a two-column benefits grid.

Use `--receive-u:1` inside responsive rules and override all desktop `position:absolute`, fixed `width`, and fixed `height` values on the moved blocks.

- [x] **Step 4: Add the What You Receive phone layout**

At `max-width: 640px`, set 20px gutters; stack intro, dashboard, confidence, timing, target, stop, and risk cards; make the dashboard `min-height:620px` and internally scale only its compact trading UI with `--receive-u:1.16`; render benefits as one column. Keep card body text at 13px minimum and headings at 15px minimum.

- [x] **Step 5: Run the existing section tests**

Run:

```bash
node --test tests/how-it-works-render.test.mjs tests/what-you-receive-render.test.mjs
```

Expected: both PASS.

---

### Task 4: Reflow Market Intelligence and Market Coverage

**Files:**
- Modify: `src/app/components/MarketIntelligence.module.css`
- Modify: `src/app/components/MarketCoverage.module.css`
- Test: `tests/market-intelligence-render.test.mjs`
- Test: `tests/market-coverage-render.test.mjs`

**Interfaces:**
- Consumes: existing editorial, dashboard, globe, market-card, and coverage-list markup.
- Produces: stacked dashboard and coverage layouts without scaled-page text.

- [x] **Step 1: Build the Market Intelligence tablet layout**

At `max-width: 900px`, remove `.section { min-width:720px }`, set `.section`/`.canvas` to natural height, and use `padding:80px 32px`. Reflow `.editorial` and `.dashboard` as static blocks. Make `.editorial` a rounded feature panel with the headline/copy in normal horizontal writing, keep `.radarWedge` as a 260px-tall full-width image band, and hide only `.verticalCopy`, `.dotGrid`, and `.lowerDotGrid`.

Set `.dashboard` to full width. Reflow `.marketStrip` into a 2-column grid plus full-width `.scanned`, `.dashboardBody` into one column, and `.opportunities` into a two-column responsive opportunity grid.

- [x] **Step 2: Build the Market Intelligence phone layout**

At `max-width: 640px`, use 20px gutters, a 46px condensed editorial heading, one-column market metrics, one-column dashboard body, and one-column opportunities. Keep numeric text at 13px or larger and dashboard card titles at 14px or larger.

- [x] **Step 3: Build the Market Coverage tablet layout**

At `max-width: 900px`, make `.section` and `.canvas` natural-flow, use `padding:80px 32px`, and reset absolute positioning for `.header`, `.statistics`, `.globeStage`, `.marketCards`, `.coverageCard`, `.summaryStrip`, and `.footerStatement`.

Use this order and grid:

```css
.canvas { display: flex; flex-direction: column; }
.header { order: 1; }
.statistics { order: 2; display: grid; grid-template-columns: repeat(2, 1fr); }
.globeStage { order: 3; width: min(620px, 100%); aspect-ratio: 1.28; }
.marketCards { order: 4; display: grid; grid-template-columns: repeat(2, 1fr); }
.coverageCard { order: 5; }
.summaryStrip { order: 6; display: grid; grid-template-columns: repeat(3, 1fr); }
.footerStatement { order: 7; }
```

- [x] **Step 4: Build the Market Coverage phone layout**

At `max-width: 640px`, use 20px gutters, a two-column statistics grid, a single-column market-card list, a two-column summary grid, and a 340px maximum globe stage. Remove desktop-only no-wrap heading behavior and use balanced lines.

- [x] **Step 5: Run the existing section tests**

Run:

```bash
node --test tests/market-intelligence-render.test.mjs tests/market-coverage-render.test.mjs
```

Expected: both PASS.

---

### Task 5: Reflow Testimonials and Pricing

**Files:**
- Modify: `src/app/components/Testimonials.module.css`
- Modify: `src/app/components/Pricing.module.css`
- Test: `tests/testimonials-render.test.mjs`
- Test: `tests/pricing-render.test.mjs`

**Interfaces:**
- Consumes: existing testimonial images, metrics, plans, guarantee, and benefits.
- Produces: readable card stacks with the popular pricing plan promoted first.

- [x] **Step 1: Build the Testimonials tablet layout**

At `max-width: 900px`, set `.section`/`.canvas` to natural height with `padding:80px 32px`; make `.header`, `.artwork`, `.metrics`, and testimonial images normal-flow. Hide the decorative `.arch` and `.platform` images, but preserve `.rohitCard`, `.anjaliCard`, and `.noteCards`. Use a two-column artwork grid where Rohit and note cards span appropriate columns, and a four-column metrics grid.

- [x] **Step 2: Build the Testimonials phone layout**

At `max-width: 640px`, use 20px gutters, one-column testimonial images with intrinsic aspect ratios and no transforms/rotation, and a two-column metrics grid. Allow the heading lines to wrap and set the intro to 16px.

- [x] **Step 3: Build the Pricing tablet layout**

At `max-width: 900px`, remove the `min-width:800px` rule; make `.section`/`.canvas` natural-flow with `padding:80px 32px`. Reset `.header`, `.billingRow`, `.guarantee`, `.cards`, and `.benefits` to normal flow. Use a compact guarantee card, a two-column plan grid, and make `.growth` visually first with `order:-1`. Use a wrapping three-column benefits grid.

- [x] **Step 4: Build the Pricing phone layout**

At `max-width: 640px`, use 20px gutters, stack the heading spans, stack the billing/savings row, use one plan column, ensure every card CTA is at least 48px high, and use a one-column benefits list. Preserve all plan features and the popular ribbon.

- [x] **Step 5: Run the existing section tests**

Run:

```bash
node --test tests/testimonials-render.test.mjs tests/pricing-render.test.mjs
```

Expected: both PASS.

---

### Task 6: Reflow Growth CTA and refine Footer

**Files:**
- Modify: `src/app/components/GrowthCta.module.css`
- Modify: `src/app/components/Footer.module.css`
- Test: `tests/growth-cta-render.test.mjs`
- Test: `tests/footer-render.test.mjs`

**Interfaces:**
- Consumes: existing benefits, assurance list, trial form, partners, and footer content.
- Produces: touch-friendly conversion sections at phone and tablet widths.

- [x] **Step 1: Build the Growth CTA tablet layout**

At `max-width: 900px`, remove the `min-width:800px` behavior and set `.section`/`.canvas` to natural height with `padding:80px 32px`. Reset `.header`, `.benefits`, `.resultSeal`, `.signupPanel`, and `.trustRail` to normal flow. Use a three-column benefits grid, a two-column signup panel with headline/assurances on the left and form/social proof on the right, and a wrapping partner grid.

- [x] **Step 2: Build the Growth CTA phone layout**

At `max-width: 640px`, use 20px gutters, one-column benefits, a compact normal-flow result seal, a one-column dark signup panel, a stacked email input/button, and a two-column brand grid. Keep all form controls at least 48px high.

- [x] **Step 3: Refine Footer tablet and phone rules**

At `max-width: 900px`, use `width:min(calc(100% - 64px), 820px)`. At `max-width:640px`, use 20px gutters, a two-column navigation grid, a single-column market rail, 20px command-panel padding, 48px email controls, a single-column trust strip, and wrapped centered legal content. Keep existing dark surfaces and market pulse artwork.

- [x] **Step 4: Run the existing section tests**

Run:

```bash
node --test tests/growth-cta-render.test.mjs tests/footer-render.test.mjs
```

Expected: both PASS.

---

### Task 7: Add responsive geometry verification and calibrate visuals

**Files:**
- Create: `.artifacts/capture-responsive-sections.mjs`
- Create: `.artifacts/lower-sections-390.png`
- Create: `.artifacts/lower-sections-768.png`
- Create: `.artifacts/lower-sections-900.png`
- Modify: responsive CSS Modules from Tasks 2–6 for calibration only

**Interfaces:**
- Consumes: root elements with `data-section` and browser port `9231`.
- Produces: viewport screenshots and a JSON geometry report for every lower section.

- [x] **Step 1: Create the Chrome DevTools capture helper**

The script accepts `port`, `width`, `height`, and `output`; navigates to the homepage; waits for `document.readyState === "complete"`, fonts, and images; then evaluates:

```js
const names = [
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
const geometry = names.map((name) => {
  const node = document.querySelector(`[data-section="${name}"]`);
  const rect = node.getBoundingClientRect();
  return { name, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
});
return {
  viewport: { width: innerWidth, clientWidth: document.documentElement.clientWidth },
  scrollWidth: document.documentElement.scrollWidth,
  geometry,
};
```

Assert `scrollWidth <= clientWidth + 1`, every section exists, every x coordinate is at least `-1`, every right edge is no more than `clientWidth + 1`, and every height is greater than 200px.

- [x] **Step 2: Capture 390px, 768px, and 900px pages**

Run the helper at:

```text
390 × 844
768 × 1024
900 × 1100
```

Use full-page capture metrics so each output contains all nine sections.

- [x] **Step 3: Inspect and calibrate one section at a time**

Check headline wrapping, minimum text size, card gaps, dashboard clipping, image cropping, table-card labels, pricing order, CTA form, and footer boundaries. Change only the CSS Module for the section being calibrated, then recapture the affected width.

---

### Task 8: Prove desktop isolation and run final quality gates

**Files:**
- Create: `.artifacts/lower-sections-desktop-after.png`
- Create: `.artifacts/lower-sections-desktop-difference.png`
- Test: `tests/*.test.mjs`

**Interfaces:**
- Consumes: completed responsive implementation and Task 1 desktop baseline.
- Produces: exact desktop comparison and fresh verification output.

- [x] **Step 1: Capture the desktop after image**

Use the same 1920 × 1080 Chrome command and save to `.artifacts/lower-sections-desktop-after.png`.

- [x] **Step 2: Compare desktop pixels exactly**

Run:

```bash
cmp -s .artifacts/lower-sections-desktop-before.png .artifacts/lower-sections-desktop-after.png
```

Expected: exit code 0. If capture rasterization is nondeterministic, create an FFmpeg difference image and require differences to be limited to font antialiasing rather than geometry.

- [x] **Step 3: Run the full test suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [x] **Step 4: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code 0.

- [x] **Step 5: Run the production build**

Run:

```bash
npm run build
```

Expected: compilation, type checks, static generation, and `/` prerendering succeed. The existing multiple-lockfile warning is non-blocking.

- [x] **Step 6: Complete the acceptance checklist**

Confirm all nine lower sections are readable at 390px, centered and balanced at 768px/900px, contain all original content, have no page-level horizontal overflow, preserve the mobile hero, and leave desktop pixels unchanged.
