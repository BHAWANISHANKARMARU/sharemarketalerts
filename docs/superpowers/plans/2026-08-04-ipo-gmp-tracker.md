# IPO GMP Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the IPO Market Intelligence dashboard directly beneath Hero with a desktop/laptop Next.js reproduction of the approved 1404 × 843 IPO GMP Tracker reference.

**Architecture:** Keep the existing server-component boundary and page placement, replace only the component markup and its CSS Module, and retain the current render-test seam. A static data array drives one semantic eight-column table; reusable SVG icon helpers provide the decorative artwork without adding dependencies.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, JavaScript, CSS Modules, Node test runner, Chrome DevTools Protocol, ImageMagick/FFmpeg visual comparison.

## Global Constraints

- Replace only the current `IpoMarketIntelligence` component and its isolated styling.
- Preserve its existing position directly after Hero and leave all other sections unchanged.
- Desktop and laptop presentation only for this pass.
- Keep every table value and the date `20 May 2025` static exactly as approved.
- Keep the component a Server Component; no client state or browser API is needed.
- Use no external dependencies and perform no Git operations.
- Scale geometry from the 1404px reference width and preserve readable behavior at 1024px.

---

### Task 1: Replace the render contract

**Files:**
- Modify: `tests/ipo-market-intelligence-render.test.mjs`

**Interfaces:**
- Consumes: server-rendered HTML from `http://127.0.0.1:3000/`.
- Produces: a regression contract for `#ipo-gmp-tracker`, the exact content, three KPI articles, one eight-column table, and seven ordered data rows.

- [x] **Step 1: Replace old dashboard fixtures with the approved tracker data**

```js
const EXPECTED_ROWS = [
  ["Ather Energy Ltd", "2,981.06", "321 – 321", "45", "14.02%", "366", "14.02%"],
  ["LG Electronics India Ltd", "11,607.01", "1,080 – 1,140", "120", "10.53%", "1,200 – 1,260", "10.53%"],
  ["Hero FinCorp Ltd", "3,668.00", "334 – 352", "38", "11.08%", "372 – 390", "11.08%"],
  ["Bajaj Housing Finance Ltd", "6,560.00", "66 – 70", "7", "10.61%", "73 – 77", "10.61%"],
  ["NTPC Green Energy Ltd", "10,000.00", "102 – 108", "12", "11.11%", "114 – 120", "11.11%"],
  ["OLA Electric Mobility Ltd", "6,145.56", "72 – 76", "6", "7.89%", "78 – 82", "7.89%"],
  ["Swiggy Ltd", "11,327.43", "371 – 390", "25", "6.76%", "396 – 415", "6.76%"],
];
```

Assert exact header, KPI, information-card, and source copy; assert Hero → tracker → How It Works ordering; assert eight `<th scope="col">` cells, seven `<tbody>` rows, and ordered values per row.

- [x] **Step 2: Run the focused contract and confirm the intentional failure**

Run: `node --test tests/ipo-market-intelligence-render.test.mjs`

Expected: FAIL with `Missing: IPO GMP Tracker`, proving the old dashboard does not satisfy the new contract.

---

### Task 2: Implement semantic tracker markup

**Files:**
- Modify: `src/app/components/IpoMarketIntelligence.js`
- Test: `tests/ipo-market-intelligence-render.test.mjs`

**Interfaces:**
- Consumes: no props and no browser APIs.
- Produces: default export `IpoMarketIntelligence()` with section ID `ipo-gmp-tracker` and title ID `ipo-market-intelligence-title`.

- [x] **Step 1: Define the exact static data model**

```js
const KPI_CARDS = [
  { icon: "building", label: "TOTAL IPOS TRACKED", value: "7", detail: "Companies", tone: "mint" },
  { icon: "trend", label: "HIGHEST GMP %", value: "14.02%", detail: "Ather Energy Ltd", tone: "mint" },
  { icon: "clock", label: "LAST UPDATE", value: "20 May 2025, 10:30 AM", detail: "Tuesday", tone: "blue" },
];

const IPO_ROWS = [
  { company: "Ather Energy Ltd", size: "2,981.06", issue: "321 – 321", gmp: "45", percent: "14.02%", listing: "366", gain: "14.02%" },
  { company: "LG Electronics India Ltd", size: "11,607.01", issue: "1,080 – 1,140", gmp: "120", percent: "10.53%", listing: "1,200 – 1,260", gain: "10.53%" },
  { company: "Hero FinCorp Ltd", size: "3,668.00", issue: "334 – 352", gmp: "38", percent: "11.08%", listing: "372 – 390", gain: "11.08%" },
  { company: "Bajaj Housing Finance Ltd", size: "6,560.00", issue: "66 – 70", gmp: "7", percent: "10.61%", listing: "73 – 77", gain: "10.61%" },
  { company: "NTPC Green Energy Ltd", size: "10,000.00", issue: "102 – 108", gmp: "12", percent: "11.11%", listing: "114 – 120", gain: "11.11%" },
  { company: "OLA Electric Mobility Ltd", size: "6,145.56", issue: "72 – 76", gmp: "6", percent: "7.89%", listing: "78 – 82", gain: "7.89%", negative: true },
  { company: "Swiggy Ltd", size: "11,327.43", issue: "371 – 390", gmp: "25", percent: "6.76%", listing: "396 – 415", gain: "6.76%" },
];
```

- [x] **Step 2: Replace the component tree**

Create the following server-rendered hierarchy:

```jsx
<section id="ipo-gmp-tracker" data-section="ipo-gmp-tracker" aria-labelledby="ipo-market-intelligence-title">
  <div className={s.canvas}>
    <header className={s.header}>...</header>
    <div className={s.datePanel}>...</div>
    <div className={s.kpiGrid}>{/* three <article> cards */}</div>
    <div className={s.tableShell}><table>{/* eight headers and seven rows */}</table></div>
    <div className={s.infoGrid}>{/* WHAT IS GMP? and DISCLAIMER articles */}</div>
    <footer className={s.sourceBar}>...</footer>
  </div>
</section>
```

Implement an `Icon({ name, className })` switch with inline SVG paths for `calendar`, `building`, `trend`, `clock`, `book`, `shield`, and `source`. Give decorative icons `aria-hidden="true"`. Render every last-update cell as `20 May 2025<br />10:30 AM`, and apply `s.negative` only to the four highlighted OLA result cells.

- [x] **Step 3: Run the focused contract**

Run: `node --test tests/ipo-market-intelligence-render.test.mjs`

Expected: PASS.

---

### Task 3: Reproduce the 1404px visual system

**Files:**
- Modify: `src/app/components/IpoMarketIntelligence.module.css`
- Test: `tests/ipo-market-intelligence-render.test.mjs`

**Interfaces:**
- Consumes: class names emitted by `IpoMarketIntelligence.js`.
- Produces: a reference-scaled 1404 × 843 desktop/laptop composition with isolated selectors.

- [x] **Step 1: Establish the reference coordinate system**

```css
.section {
  --ipo-u: calc(min(100vw, 1920px) / 1404);
  width: 100%;
  height: calc(843 * var(--ipo-u));
  overflow: hidden;
  color: #0b1947;
  background: #fff;
  font-family: var(--font-sans), system-ui, sans-serif;
}

.canvas {
  position: relative;
  width: min(100%, 1920px);
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #fafdff;
}
```

Add low-opacity contour artwork through `.canvas::before` and `.canvas::after`, with no image crop or bitmap stretching.

- [x] **Step 2: Position the reference regions**

Use the 1404px coordinates as CSS-unit measurements:

- Header starts at `(65, 75)`; title is Playfair Display at approximately `57px` and subtitle at `24px`.
- Navy date panel starts near `(989, 80)` with size `336 × 78`.
- KPI cards occupy `(63, 190, 416, 106)`, `(497, 190, 382, 106)`, and `(897, 190, 420, 106)`.
- Table shell occupies approximately `(62, 311, 1257, 337)` with a `54px` navy header.
- Information cards occupy `(63, 661, 623, 77)` and `(696, 661, 621, 77)`.
- Source footer occupies `(61, 749, 1258, 46)`.

Use the approved navy `#07174f`, teal-green `#00aa78`, pale mint `#dcfaf2`, pale blue `#e7f2ff`, red `#ff0b29`, and border `#dbe5ee`. Match rounded corners, subtle blue-grey shadows, alternating table rows, column dividers, and tabular number alignment.

- [x] **Step 3: Preserve laptop readability**

Add a laptop breakpoint that continues proportional scaling at `1024px` without stacking or hiding any reference content. Keep the full eight-column table visible and keep the section overflow clipped to its own scaled canvas.

- [x] **Step 4: Confirm markup and CSS remain valid**

Run: `node --test tests/ipo-market-intelligence-render.test.mjs && npm run lint`

Expected: both commands PASS.

---

### Task 4: Pixel comparison and final verification

**Files:**
- Create: `.artifacts/ipo-gmp-tracker-1404.png`
- Create: `.artifacts/ipo-gmp-tracker-1024.png`
- Create: `.artifacts/ipo-gmp-tracker-compare.jpg`
- Modify if needed: `src/app/components/IpoMarketIntelligence.module.css`

**Interfaces:**
- Consumes: running page at `http://127.0.0.1:3000/` and selector `#ipo-gmp-tracker`.
- Produces: verified captures at both approved viewport classes and a side-by-side reference comparison.

- [x] **Step 1: Capture the isolated section at 1404px**

Use the running Chrome DevTools endpoint on port `9231` to set a 1404px viewport, locate `#ipo-gmp-tracker`, and call `Page.captureScreenshot` with the element bounds. Save as `.artifacts/ipo-gmp-tracker-1404.png`.

- [x] **Step 2: Compare and tune**

Create `.artifacts/ipo-gmp-tracker-compare.jpg` by placing `/tmp/codex-clipboard-N4wwfs.png` and the 1404px capture side by side. Inspect title and date alignment, card edges, column widths, row density, information cards, and footer. Adjust only the component CSS/markup and repeat until the composition closely matches.

- [x] **Step 3: Capture the laptop viewport**

Capture `#ipo-gmp-tracker` at 1024px into `.artifacts/ipo-gmp-tracker-1024.png`. Confirm no clipping, overlap, wrapping drift, or spill into adjacent sections.

- [x] **Step 4: Run final verification**

Run:

```bash
node --test tests/*.test.mjs
npm run lint
npm run build
```

Expected: the full test suite, ESLint, and production build all PASS. Review the final 1404px and 1024px images before reporting completion.
