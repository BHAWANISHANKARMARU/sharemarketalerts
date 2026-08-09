# Markets Icon Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every icon on `/markets` a clear white surface, slightly larger artwork, and precise responsive alignment without changing cards, layout, data, or other routes.

**Architecture:** Keep the existing React components and shared `InstrumentMark` renderer. Apply route-scoped overrides from `TradingWorkspace.module.css` for shared marks, then update the page-specific hero, calendar, and news icon holders in their existing CSS modules. A real-browser CDP regression test measures computed backgrounds and optical centering at desktop and mobile widths.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, CSS Modules, `next/image`, Node test runner, Chrome DevTools Protocol.

## Global Constraints

- Scope is only the `/markets` route.
- Preserve every existing component, card dimension, page layout, market data source, and business rule.
- Use `#FFFFFF` icon surfaces with subtle neutral or semantic-tinted borders and restrained shadows.
- Preserve original company/index logo colors and green, red, and purple semantic foreground colors.
- Increase icon artwork approximately 15–20 percent while keeping three context-aware surface sizes: prominent, standard, and compact.
- Use fixed square surfaces, `flex: 0 0 auto`, grid centering, and `object-fit: contain` for logos.
- Do not alter typography, navigation, or icons on other routes.

---

### Task 1: Core markets and overview icon surfaces

**Files:**
- Create: `tests/markets-icon-surfaces.test.mjs`
- Modify: `src/app/components/platform/TradingWorkspace.module.css:123-143,297-346,395-551,598-628,1123-1237,1406-1423`
- Modify: `src/app/components/platform/MarketsOverviewHero.module.css:107-137,440-505,681-701,943-960,1296-1316,1670-1694,1748-1758`

**Interfaces:**
- Consumes: Existing `.marketsWorkspace`, `.instrumentMark`, `.instrumentLogo`, `.metricStrip`, `.indexMark`, `.sectorIcon`, `.marketBoardIcon`, `.marketHeatMark`, `.globalMarketGlobe`, and global-market row classes.
- Produces: Route-scoped white icon surfaces with centered SVG/image artwork and no behavior changes.

- [ ] **Step 1: Write the failing desktop and mobile browser test**

Create `tests/markets-icon-surfaces.test.mjs` with a CDP connection patterned after `tests/sector-tooltip-position.test.mjs`. The test must navigate to `/markets`, wait for `#sector-heatmap [data-series-points]` to contain more than five points, and measure these real DOM groups:

```js
const CORE_ICON_GROUPS = [
  ['overview metrics', '[data-markets-overview-hero] [class*="metricStrip"] article > span'],
  ['overview index marks', '[data-markets-overview-hero] [data-instrument-logo]'],
  ['overview sectors', '[data-markets-overview-hero] [class*="sectorIcon"]'],
  ['market boards', '[data-market-board] [data-instrument-logo]'],
  ['board headings', '[data-market-board-icon]'],
  ['heatmap heading', '#sector-heatmap [class*="marketHeatMark"]'],
  ['heatmap sectors', '#sector-heatmap [class*="sectorIcon"]'],
  ['global heading', '#global-markets [class*="globalMarketGlobe"]'],
  ['global instruments', '#global-markets [data-instrument-logo]'],
];

async function readIconGroup(evaluate, [name, selector]) {
  const result = await evaluate(`(() => {
    const nodes = [...document.querySelectorAll(${JSON.stringify(selector)})];
    return nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const child = node.querySelector('img, svg');
      const childRect = child?.getBoundingClientRect();
      return {
        background: getComputedStyle(node).backgroundColor,
        width: rect.width,
        height: rect.height,
        centerDeltaX: childRect ? Math.abs((childRect.left + childRect.width / 2) - (rect.left + rect.width / 2)) : 0,
        centerDeltaY: childRect ? Math.abs((childRect.top + childRect.height / 2) - (rect.top + rect.height / 2)) : 0,
        artworkRatio: childRect ? Math.min(childRect.width / rect.width, childRect.height / rect.height) : 0,
      };
    });
  })()`);
  assert.ok(result.length > 0, `${name} icons were not rendered`);
  return result;
}
```

For each result, assert literal expected behavior:

```js
assert.equal(icon.background, 'rgb(255, 255, 255)', `${name} lacks a white surface`);
assert.ok(Math.abs(icon.width - icon.height) <= 1, `${name} is not square`);
assert.ok(icon.centerDeltaX <= 1.5, `${name} is horizontally misaligned`);
assert.ok(icon.centerDeltaY <= 1.5, `${name} is vertically misaligned`);
assert.ok(icon.artworkRatio >= 0.52, `${name} artwork is too small`);
```

Run the same group assertions after emulating both `1440 × 900` and `390 × 844`. For icon rows that have a text sibling, measure both rectangles and enforce a literal six-pixel non-overlap gap:

```js
assert.ok(iconRect.right + 6 <= textRect.left, `${name} overlaps its label`);
assert.ok(iconRect.left >= cardRect.left, `${name} escapes the card`);
assert.ok(iconRect.right <= cardRect.right, `${name} escapes the card`);
```

- [ ] **Step 2: Run the desktop test and verify RED**

Run:

```bash
TEST_CDP_PORT=9231 node --test tests/markets-icon-surfaces.test.mjs
```

Expected: FAIL because current metric, sector, brand-logo, and global icon backgrounds are purple/green gradients or transparent instead of `rgb(255, 255, 255)`.

- [ ] **Step 3: Implement the route-scoped shared mark treatment**

In `TradingWorkspace.module.css`, add high-specificity `/markets` rules after the existing base `InstrumentMark` declarations:

```css
.marketsWorkspace .instrumentMark {
  overflow: hidden;
  border: 1px solid #e8e3ee;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 5px 14px rgb(40 25 65 / 7%);
}

.marketsWorkspace .instrumentMark[data-instrument-logo="brand"] {
  overflow: hidden !important;
  padding: 4px;
  border: 1px solid #e8e3ee !important;
  border-radius: 10px !important;
  background: #fff !important;
  box-shadow: 0 5px 14px rgb(40 25 65 / 7%) !important;
}

.marketsWorkspace .instrumentLogo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: none;
}
```

Update page-specific holders without changing their parent cards:

```css
.marketBoardIcon,
.marketHeatMark,
.sectorIcon,
.globalMarketGlobe {
  border: 1px solid #e8e3ee;
  background: #fff;
  box-shadow: 0 6px 18px rgb(40 25 65 / 7%);
}

.sectorIcon svg,
.marketBoardIcon svg,
.marketHeatMark svg,
.globalMarketGlobe svg {
  width: 60%;
  height: 60%;
}
```

Increase compact table icons from `22px` to `28px`, market-mover icons from `28px` to `34px`, standard quote/earnings icons by approximately 15 percent, and update their matching grid tracks and gaps so text alignment remains unchanged. Preserve the existing larger sizes inside the `min-width: 1600px` block by increasing both the surface and artwork proportionally.

- [ ] **Step 4: Implement overview hero icon treatment**

In `MarketsOverviewHero.module.css`, replace tinted icon fills with white surfaces while preserving semantic border and foreground color:

```css
.metricStrip > article > span,
.sectorIcon,
.indexMark {
  border: 1px solid #e8e3ee;
  background: #fff;
  box-shadow: 0 5px 14px rgb(40 25 65 / 7%);
}

.metricStrip article[data-tone="green"] > span { border-color: #ccefe3; background: #fff; }
.metricStrip article[data-tone="red"] > span { border-color: #ffd9e0; background: #fff; }

.leadQuote .indexMark {
  border: 1px solid #e5d2f8;
  background: #fff;
  color: var(--overview-purple);
}
```

Increase metric surfaces from `27px` to `31px`, default sector surfaces from `20px` to `24px`, and their SVGs from `11px` to `14px`. Update the existing wide-screen and mobile declarations proportionally so the surface remains square and row text keeps its current starting position.

- [ ] **Step 5: Run the desktop test and market regression tests**

Run:

```bash
TEST_CDP_PORT=9231 node --test tests/markets-icon-surfaces.test.mjs tests/markets-overview-render.test.mjs tests/instrument-icons-render.test.mjs
```

Expected: PASS with zero failures.

- [ ] **Step 6: Commit the core icon system**

```bash
git add tests/markets-icon-surfaces.test.mjs src/app/components/platform/TradingWorkspace.module.css src/app/components/platform/MarketsOverviewHero.module.css
git commit -m "style: clarify markets icon surfaces"
```

---

### Task 2: Calendar and research icon surfaces

**Files:**
- Modify: `tests/markets-icon-surfaces.test.mjs`
- Modify: `src/app/components/platform/MarketCalendarDashboard.module.css:27-44,83-84,140-163,207-223`
- Modify: `src/app/components/platform/MarketReferenceSections.module.css:45-63,338-358,437-441,474-484,512-513,543-571`

**Interfaces:**
- Consumes: The browser test harness from Task 1 and the existing `.titleIcon`, `.referenceIcon`, `.newsQuoteRail .instrumentMark`, and `.researchPanel article > span` contexts.
- Produces: The same white surface and centering contract for all lower `/markets` workspaces.

- [ ] **Step 1: Extend the browser test and verify RED**

Add these groups to the browser test:

```js
const LOWER_ICON_GROUPS = [
  ['calendar title', '[data-market-calendar] [class*="titleIcon"]'],
  ['calendar controls', '[data-market-calendar] [class*="filterButton"]'],
  ['news title', '[data-market-news-research] [class*="referenceIcon"]'],
  ['news quote logos', '[data-market-news-research] [class*="newsQuoteRail"] [data-instrument-logo]'],
  ['research insights', '[data-market-news-research] [class*="researchPanel"] article > span'],
];
```

Run:

```bash
TEST_CDP_PORT=9231 node --test tests/markets-icon-surfaces.test.mjs
```

Expected: FAIL because `.titleIcon` and `.referenceIcon` still use tinted gradients and their artwork remains at the old size.

- [ ] **Step 2: Implement lower-section surfaces**

Apply the approved system in the existing modules:

```css
.titleIcon,
.referenceIcon,
.researchPanel article > span {
  border: 1px solid #e8e3ee;
  background: #fff;
  box-shadow: 0 6px 18px rgb(40 25 65 / 7%);
}
```

Increase `.titleIcon` and `.referenceIcon` artwork by 15–20 percent, keep their fixed square dimensions, and preserve `flex: 0 0 auto`. Make quote-rail brand marks use the route-scoped `InstrumentMark` white surface rather than the existing purple background. Keep active calendar filter semantics legible by using a white surface with a purple border/foreground and an inset purple indicator instead of replacing the surface with solid purple.

- [ ] **Step 3: Run the lower-section and complete markets tests**

Run:

```bash
TEST_CDP_PORT=9231 node --test tests/markets-icon-surfaces.test.mjs tests/market-calendar-dashboard.test.mjs tests/markets-overview-render.test.mjs tests/markets-reference-sections-render.test.mjs
```

Expected: PASS with zero failures.

- [ ] **Step 4: Commit the lower-section icon system**

```bash
git add tests/markets-icon-surfaces.test.mjs src/app/components/platform/MarketCalendarDashboard.module.css src/app/components/platform/MarketReferenceSections.module.css
git commit -m "style: align markets reference icons"
```

---

### Task 3: Responsive visual and production verification

**Files:**
- Verify: `tests/markets-icon-surfaces.test.mjs`
- Verify: `src/app/components/platform/TradingWorkspace.module.css`
- Verify: `src/app/components/platform/MarketsOverviewHero.module.css`
- Verify: `src/app/components/platform/MarketCalendarDashboard.module.css`
- Verify: `src/app/components/platform/MarketReferenceSections.module.css`

**Interfaces:**
- Consumes: All icon surfaces completed in Tasks 1 and 2.
- Produces: Verified desktop and mobile icon alignment with no text overlap or layout regression.

- [ ] **Step 1: Re-run the desktop and mobile geometry test**

Run:

```bash
TEST_CDP_PORT=9231 node --test tests/markets-icon-surfaces.test.mjs
```

Expected: PASS at both `1440 × 900` and `390 × 844`, with every icon white, square, centered, contained, and separated from its text label.

- [ ] **Step 2: Capture desktop and mobile screenshots**

Run:

```bash
node .artifacts/capture-market-reference-sections.mjs overview,boards,heatmap,global,calendar,news 1920,390 9231 9000
```

Inspect every output for white surfaces, recognizable logos, optical centering, consistent gaps, clipping, and accidental card/layout changes.

- [ ] **Step 3: Run complete verification**

Run:

```bash
TEST_CDP_PORT=9231 node --test tests/markets-icon-surfaces.test.mjs tests/markets-overview-model.test.mjs tests/market-ranges.test.mjs tests/markets-overview-render.test.mjs tests/market-calendar-dashboard.test.mjs tests/markets-reference-sections-render.test.mjs tests/instrument-icons-render.test.mjs
npx eslint src/app/components/platform tests/markets-icon-surfaces.test.mjs
npm run build
```

Expected: every test passes, ESLint exits `0`, and the Next.js production build exits `0`.
