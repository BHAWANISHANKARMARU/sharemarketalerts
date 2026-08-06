# Market Coverage Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add a native, pixel-calibrated Market Coverage section after Market Intelligence that reproduces the approved desktop/laptop reference without changing existing sections.

**Architecture:** Implement one React Server Component backed by one CSS Module. JSX data arrays provide the four left metrics, six floating market cards, six coverage rows, and six summary metrics; focused helpers render reusable inline SVG icons and sparklines, while a single inline SVG renders the globe, dot field, continents, orbital arcs, and connection nodes. The homepage imports the section last and a real HTTP render test protects placement and complete visible content.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4 Server Components, CSS Modules, inline SVG, Node.js built-in test runner.

**Execution Status:** Completed and verified on 2026-08-03. Evidence is recorded in `docs/superpowers/verification/2026-08-03-market-coverage-verification.md`.

## Global Constraints

- Work only in `/home/gaurav/Downloads/sharemarketalerts`.
- Preserve `Hero`, `IpoMarketIntelligence`, `HowItWorks`, `WhatYouReceive`, and `MarketIntelligence` byte-for-byte.
- Render Market Coverage after `MarketIntelligence`.
- Reproduce the white/lavender panel only; the black screenshot surround is not page content.
- Desktop/laptop composition only; do not invent a mobile rearrangement.
- Use no client component, animation, network request, new dependency, or third-party UI package.
- Use existing `--font-sans` (Figtree) and `--font-serif` (Playfair Display) variables.
- Perform no Git operations.

## Design Tokens and Composition

- **Color:** canvas `#fdfdff`; ink `#0b092c`; muted text `#68698f`; brand purple `#8518f5`; pale violet `#f4edff`; positive mint `#15ce91`.
- **Type:** Playfair Display for the main title and italic accent; Figtree for body copy, labels, metrics, and data.
- **Layout:** a 1364 × 750 reference-coordinate canvas scales proportionally through `--mc-u: calc(min(100vw, 1920px) / 1364)`. Header is centered above a three-zone body: 218-unit left rail, 720-unit globe field, 226-unit right card; the 1258-unit summary strip spans the lower canvas.
- **Charts:** each floating card contains one thin mint sparkline with rounded caps and a labeled percentage endpoint. These are static stat-tile trends, not interactive analytical charts.

## File Map

- Create `tests/market-coverage-render.test.mjs` — real homepage render contract for placement, content, and semantic section structure.
- Create `src/app/components/MarketCoverage.js` — all Market Coverage markup, exact content arrays, and inline SVG render helpers.
- Create `src/app/components/MarketCoverage.module.css` — isolated reference-coordinate layout and visual treatment.
- Modify `src/app/page.js` — import and append `MarketCoverage` only.
- Create visual artifacts under `.artifacts/` during calibration; these are verification outputs, not runtime assets.

---

### Task 1: Protect the complete server-rendered contract

**Files:**
- Create: `tests/market-coverage-render.test.mjs`

**Interfaces:**
- Consumes: the homepage at `http://127.0.0.1:3000`.
- Produces: a failing real-render test that requires `data-section="market-coverage"`, exact content, semantics, and placement below Market Intelligence.

- [x] **Step 1: Write the failing HTTP render test**

```js
import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "MARKET COVERAGE",
  "Every market. One intelligence.",
  "Comprehensive coverage across indices, stocks, sectors, commodities, forex and global markets.",
  "We scan millions of signals 24/7 so you never miss an opportunity.",
  "150+", "Exchanges", "Across 6 continents",
  "120K+", "Instruments", "Stocks, ETFs, futures & more",
  "24/7", "Market Scanning", "Real-time • Non-stop",
  "99.9%", "Uptime", "Reliable. Always on.",
  "NSE", "India", "+0.86%",
  "NASDAQ", "United States", "+1.32%",
  "BSE", "+0.74%",
  "FOREX", "Global", "+0.41%",
  "COMMODITIES", "+0.59%",
  "GLOBAL MARKETS", "Worldwide", "+0.67%",
  "What we cover",
  "Indices", "Global benchmarks",
  "Stocks", "Large, mid & small caps",
  "Sectors", "Sector-wise opportunities",
  "Commodities", "Metals, energy & agri",
  "Forex", "Major currency pairs",
  "Global Markets", "Worldwide exchanges",
  "50,000+", "Global indices",
  "100,000+", "Stocks tracked",
  "24+", "Major sectors",
  "100+", "180+", "Currency pairs",
  "70+", "Countries covered",
  "One platform. Every market. Endless opportunities.",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

test("Market Coverage renders after Market Intelligence with the complete approved content", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sectionMatch = html.match(
    /<section[^>]*data-section="market-coverage"[\s\S]*?<\/section>/,
  );
  assert.ok(sectionMatch, "Market Coverage section is missing");
  assert.match(sectionMatch[0], /aria-labelledby="market-coverage-title"/);

  const sectionText = visibleText(sectionMatch[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(sectionText.includes(copy), `Missing from Market Coverage: ${copy}`);
  }

  assert.ok(
    html.indexOf('data-section="market-coverage"') >
      html.indexOf("SEE IT BEFORE THE MARKET MOVES."),
    "Market Coverage must render below Market Intelligence",
  );
});
```

- [x] **Step 2: Start or reuse the local Next.js development server**

Run: `npm run dev`

Expected: Next.js reports the homepage ready on port 3000 without compilation errors.

- [x] **Step 3: Run the focused test and verify RED**

Run: `node --test tests/market-coverage-render.test.mjs`

Expected: FAIL with `Market Coverage section is missing` because production code does not exist yet.

---

### Task 2: Build the semantic Market Coverage server component

**Files:**
- Create: `src/app/components/MarketCoverage.js`
- Modify: `src/app/page.js`

**Interfaces:**
- Consumes: CSS classes from `MarketCoverage.module.css` and existing global font variables.
- Produces: default export `MarketCoverage()` and a homepage `<section data-section="market-coverage" aria-labelledby="market-coverage-title">`.

- [x] **Step 1: Create exact content data**

Define literal arrays in `MarketCoverage.js` with these shapes and values:

```js
const statistics = [
  { icon: "globe", value: "150+", label: "Exchanges", detail: "Across 6 continents" },
  { icon: "bars", value: "120K+", label: "Instruments", detail: "Stocks, ETFs, futures & more" },
  { icon: "scan", value: "24/7", label: "Market Scanning", detail: "Real-time • Non-stop" },
  { icon: "shield", value: "99.9%", label: "Uptime", detail: "Reliable. Always on." },
];

const marketCards = [
  { className: "nse", icon: "india", label: "NSE", detail: "India", change: "+0.86%", points: "2,24 12,19 20,21 28,12 37,16 47,8 55,12 64,4 70,9" },
  { className: "nasdaq", icon: "usa", label: "NASDAQ", detail: "United States", change: "+1.32%", points: "2,25 11,20 19,21 28,14 37,17 47,9 57,12 67,4 72,7" },
  { className: "bse", icon: "india", label: "BSE", detail: "India", change: "+0.74%", points: "2,22 11,18 20,20 29,12 38,15 47,8 56,11 65,5 72,8" },
  { className: "forex", icon: "globe", label: "FOREX", detail: "Global", change: "+0.41%", points: "2,24 12,21 20,22 29,15 38,17 47,11 56,14 65,7 72,10" },
  { className: "commodities", icon: "commodity", label: "COMMODITIES", detail: "Global", change: "+0.59%", points: "2,23 11,17 20,19 29,12 38,15 47,8 56,11 65,4 72,8" },
  { className: "globalMarkets", icon: "globe", label: "GLOBAL MARKETS", detail: "Worldwide", change: "+0.67%", points: "2,24 11,19 20,20 29,13 38,16 47,9 56,12 65,5 72,8" },
];

const coverageRows = [
  { icon: "bars", label: "Indices", detail: "Global benchmarks" },
  { icon: "candles", label: "Stocks", detail: "Large, mid & small caps" },
  { icon: "sectors", label: "Sectors", detail: "Sector-wise opportunities" },
  { icon: "commodity", label: "Commodities", detail: "Metals, energy & agri" },
  { icon: "currency", label: "Forex", detail: "Major currency pairs" },
  { icon: "globe", label: "Global Markets", detail: "Worldwide exchanges" },
];

const summaryItems = [
  { icon: "bars", label: "Indices", value: "50,000+", detail: "Global indices" },
  { icon: "candles", label: "Stocks", value: "100,000+", detail: "Stocks tracked" },
  { icon: "sectors", label: "Sectors", value: "24+", detail: "Major sectors" },
  { icon: "drop", label: "Commodities", value: "100+", detail: "Commodities" },
  { icon: "currency", label: "Forex", value: "180+", detail: "Currency pairs" },
  { icon: "globe", label: "Global Markets", value: "70+", detail: "Countries covered" },
];
```

- [x] **Step 2: Implement reusable native SVG helpers**

Implement `Icon({ name })` with a `switch` returning the exact purple line-art paths for `globe`, `bars`, `scan`, `shield`, `candles`, `sectors`, `commodity`, `drop`, and `currency`, plus circular India/USA flag treatments. Implement `Sparkline({ points })` as a `viewBox="0 0 74 30"` SVG containing a 2-unit round-capped mint polyline and endpoint. `MarketCard`, `Statistic`, `CoverageRow`, and `SummaryItem` consume one literal data object and render its icon, label, value/change, and detail without transforming the supplied strings. Every decorative SVG receives `aria-hidden="true"` and `focusable="false"`; visible text remains real HTML.

- [x] **Step 3: Implement the central globe visual**

Implement `CoverageGlobe()` as an `aria-hidden` SVG with:

- a clipped 320-unit sphere;
- soft lavender radial glow and bottom purple glow filters;
- dotted world texture patterns;
- recognizable Europe/Africa/Asia/India/Australia continent silhouettes filled with a denser purple dot pattern;
- latitude and longitude ellipses;
- three orbital ellipses and six purple connection nodes aligned to the floating cards.

- [x] **Step 4: Assemble the complete section markup**

Return one `<section className={styles.section} data-section="market-coverage" aria-labelledby="market-coverage-title">`. Its `.canvas` child contains, in DOM order: a `.header` with eyebrow, `h2#market-coverage-title`, and supporting paragraph; a `.statistics` aside mapping the four statistics; a decorative `.globeStage` containing `CoverageGlobe`; a `.marketCards` container mapping all six floating cards; a `.coverageCard` aside labelled by `h3#coverage-list-title` and mapping all six coverage rows; a `.summaryStrip` mapping all six summary items; and a `.footerStatement` paragraph. Use `<span className={styles.titleAccent}>intelligence.</span>` and `<em>Every market.</em>` for the two purple serif accents.

- [x] **Step 5: Append the section to the homepage**

Add:

```js
import MarketCoverage from "./components/MarketCoverage";
```

and render `<MarketCoverage />` immediately after `<MarketIntelligence />` in `src/app/page.js`.

---

### Task 3: Reproduce the reference geometry and styling

**Files:**
- Create: `src/app/components/MarketCoverage.module.css`

**Interfaces:**
- Consumes: class names emitted by `MarketCoverage.js`.
- Produces: isolated desktop/laptop layout with no selectors that target existing sections.

- [x] **Step 1: Establish the reference-coordinate canvas**

```css
.section {
  --mc-u: calc(min(100vw, 1920px) / 1364);
  width: 100%;
  height: calc(750 * var(--mc-u));
  max-height: 1055.72px;
  overflow: hidden;
  background: #fdfdff;
  color: #0b092c;
  font-family: var(--font-sans), Arial, sans-serif;
}

.canvas {
  position: relative;
  width: min(100%, 1920px);
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 47%, rgba(126, 41, 246, .105), transparent 27%),
    radial-gradient(circle at 48% 78%, rgba(129, 30, 244, .08), transparent 20%),
    linear-gradient(180deg, #fff 0%, #fdfdff 100%);
}
```

- [x] **Step 2: Position the header and typography**

Calibrate the eyebrow at reference y≈42, title baseline at y≈113, and supporting copy at y≈162. Use a title size of approximately `52 * var(--mc-u)`, Playfair weight 650, and a tighter italic purple accent. Keep the supporting copy to the same two centered lines.

- [x] **Step 3: Style the three-zone middle composition**

Position left metrics between x≈58–270 and y≈226–555, the globe field around x≈385–1055 and y≈203–581, and the coverage card at x≈1084, y≈208 with width≈226 and height≈350. Match reference borders, 14-unit card radii, circle icon washes, 1-unit dividers, and low-opacity purple shadows.

- [x] **Step 4: Style the six floating market cards**

Use absolute modifiers `.nse`, `.nasdaq`, `.bse`, `.forex`, `.commodities`, and `.globalMarkets` to match the reference anchors. Cards use white translucent surfaces, 12-unit radii, thin lavender borders, 10-unit internal gaps, and mint sparklines/changes.

- [x] **Step 5: Style the summary strip and footer statement**

Place the strip around x≈54, y≈605, width≈1258, height≈98. Use six equal columns with five hairline dividers, 54-unit circular icon washes, and reference-aligned label/value/detail hierarchy. Place the centered footer statement at y≈727 so it remains visible at the lower edge like the reference.

- [x] **Step 6: Verify GREEN after structural implementation**

Run: `node --test tests/market-coverage-render.test.mjs`

Expected: PASS with the complete content rendered below Market Intelligence.

Run: `node --test tests/market-intelligence-render.test.mjs`

Expected: PASS, proving the previous final section remains present and ordered.

---

### Task 4: Pixel-calibrate against the supplied reference

**Files:**
- Modify: `src/app/components/MarketCoverage.module.css`
- Modify only if necessary: `src/app/components/MarketCoverage.js`
- Create: `.artifacts/market-coverage-*.png` and `.artifacts/market-coverage-*.jpg`

**Interfaces:**
- Consumes: the running homepage and `/tmp/codex-clipboard-k7hSHC.png`.
- Produces: reference/build comparison images at the supplied and additional desktop widths.

- [x] **Step 1: Capture the whole homepage at 1441px width**

Use the installed Chromium binary in headless mode with a 1441px viewport and full-page screenshot. Keep the local dev server running throughout calibration.

- [x] **Step 2: Locate and crop the Market Coverage section**

Use the known proportional heights of the existing sections or a DOM bounding-box query to crop exactly from `[data-section="market-coverage"]` into `.artifacts/market-coverage-pass1.png`.

- [x] **Step 3: Create a side-by-side comparison**

Use `ffmpeg` to normalize the reference content frame and combine it with the build crop. Inspect header centering/wrap, rail alignment, globe scale, card anchors, right-card geometry, summary-strip baseline, and footer visibility.

- [x] **Step 4: Correct every visible mismatch**

Adjust only Market Coverage CSS/SVG values. Repeat screenshot and comparison passes until typography, spacing, colors, borders, shadows, globe density, orbital arcs, and card placement visually match.

- [x] **Step 5: Verify laptop and large-desktop scaling**

Capture the isolated section at 1366px and 1920px widths. Confirm proportional scaling, no overflow, no internal wrapping changes, and no overlap between cards, globe, rails, or footer.

---

### Task 5: Complete regression and quality verification

**Files:**
- Verify: all files in `src/app/components/`
- Verify: `src/app/page.js`

**Interfaces:**
- Consumes: completed implementation and baseline component hashes recorded before editing.
- Produces: clean tests, lint, production build, and evidence that existing components did not change.

- [x] **Step 1: Run focused and existing tests**

Run: `node --test tests/market-coverage-render.test.mjs tests/market-intelligence-render.test.mjs`

Expected: 2 tests pass, 0 fail.

- [x] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit 0 with no errors.

- [x] **Step 3: Run production build**

Run: `npm run build`

Expected: Next.js production build completes successfully.

- [x] **Step 4: Verify invariant component hashes**

Re-run SHA-256 over the five existing component JS/CSS pairs and compare with the recorded baseline. Every digest must match; `src/app/page.js`, the two new component files, the new test, and planning documentation are the only intended source changes.

- [x] **Step 5: Perform final pixel-match checklist**

Confirm: every string is identical; purple accent words match; all four left stats, six floating cards, six coverage rows, six summary items, and footer statement appear in order; globe/icon/sparkline geometry matches; existing sections remain unchanged; desktop/laptop screenshots pass visual comparison.

No commit step is included because the user explicitly prohibited Git operations.
