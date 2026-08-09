# Markets Overview Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the complete top `/markets` dashboard with the approved Indian-stocks reference composition while keeping lower sections intact and retaining live Yahoo-backed data.

**Architecture:** Keep `markets/page.js` as the server data boundary and `MarketsExperience` as the interactive client workspace. Extract the new top composition into a focused client component and CSS module, centralize chart range validation in a pure module shared by Yahoo and the route handler, and use a pure presentation model for resilient live/fallback dashboard values.

**Tech Stack:** Next.js 16 App Router, React 19, JavaScript, CSS Modules, Recharts 3, yahoo-finance2, Node test runner, headless Chrome.

## Global Constraints

- Preserve the shared header and every `/markets` section below the top dashboard.
- Use Manrope throughout the dashboard.
- Preserve the supplied 1536×1024 artwork without cropping.
- Keep Yahoo and API failures non-destructive by retaining the prior/last-known view.
- Do not modify unrelated dirty-worktree files.
- Implement in the current workspace because the user explicitly approved full inline execution.

---

### Task 1: Shared chart range contract

**Files:**
- Create: `src/lib/market-data/ranges.js`
- Modify: `src/lib/market-data/providers/yahoo.js`
- Modify: `src/app/api/market/chart/route.js`
- Test: `tests/market-ranges.test.mjs`

**Interfaces:**
- Produces: `MARKET_RANGE_CONFIG`, `MARKET_RANGES`, `getMarketRangeConfig(range)`.
- Consumes: Yahoo chart request range and route-handler validation.

- [ ] **Step 1: Write the failing range test**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { getMarketRangeConfig, MARKET_RANGES } from "../src/lib/market-data/ranges.js";

test("market chart ranges include the five overview periods", () => {
  assert.deepEqual(MARKET_RANGES, ["1D", "5D", "1M", "6M", "1Y"]);
  assert.deepEqual(getMarketRangeConfig("6M"), { days: 190, interval: "1d" });
  assert.equal(getMarketRangeConfig("invalid"), null);
});
```

- [ ] **Step 2: Run `node --test tests/market-ranges.test.mjs` and confirm it fails because `ranges.js` does not exist.**
- [ ] **Step 3: Implement the exported range map/validator and replace duplicated range sets in Yahoo and the API route.**
- [ ] **Step 4: Run `node --test tests/market-ranges.test.mjs` and confirm it passes.**

### Task 2: Resilient market overview presentation model

**Files:**
- Create: `src/lib/market-data/markets-overview.js`
- Test: `tests/markets-overview-model.test.mjs`

**Interfaces:**
- Produces: `buildMarketsOverview(market, updatedAt)` returning `{ lead, indices, metrics, updatedAt }`.
- Consumes: normalized `market` object from `getHomeMarketData()`.

- [ ] **Step 1: Write failing tests with hand-authored live and empty fixtures.**

```js
test("overview model orders the four reference indices and derives breadth", () => {
  const model = buildMarketsOverview(fixtureMarket, "2026-08-09T04:00:00.000Z");
  assert.deepEqual(model.indices.map((row) => row.label), ["NIFTY 50", "SENSEX", "BANK NIFTY", "INDIA VIX"]);
  assert.equal(model.metrics[0].primary, "2 / 1");
  assert.equal(model.metrics[1].primary, "2.00");
});

test("overview model supplies stable display fallbacks when feeds are empty", () => {
  const model = buildMarketsOverview({ indices: [], gainers: [], losers: [] }, null);
  assert.equal(model.indices.length, 4);
  assert.equal(model.lead.formattedValue, "24,570.65");
});
```

- [ ] **Step 2: Run `node --test tests/markets-overview-model.test.mjs` and confirm the missing module failure.**
- [ ] **Step 3: Implement ordering, live-value preference, breadth derivation, and deterministic fallback metrics.**
- [ ] **Step 4: Run the model test and confirm both behaviors pass.**

### Task 3: Pixel-matched dashboard component

**Files:**
- Create: `src/app/components/platform/MarketsOverviewHero.js`
- Create: `src/app/components/platform/MarketsOverviewHero.module.css`
- Modify: `src/app/components/platform/MarketsExperience.js`
- Add asset: `public/images/markets-indian-exchange.png`
- Test: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: `{ market, updatedAt }`, `view`, `onViewChange`; uses `buildMarketsOverview` and `/api/market/chart`.
- Produces: a `data-markets-overview-hero` landmark and preserves the lower `MarketsExperience` content.

- [ ] **Step 1: Extend the route-render test to require `MarketsOverviewHero`, the new landmark, and the retained lower-section copy.**
- [ ] **Step 2: Run `node --test tests/platform-routes-render.test.mjs` and confirm it fails because the component/landmark is missing.**
- [ ] **Step 3: Copy the approved source image to `public/images/markets-indian-exchange.png` without recompression.**
- [ ] **Step 4: Build the component markup for title, full contained artwork, status card, tabs, main chart, sector list, index rail, and KPI strip.**
- [ ] **Step 5: Implement period fetching with abort cleanup and prior-chart retention on errors.**
- [ ] **Step 6: Style desktop and responsive layouts in the dedicated CSS module using the approved dimensions and colors.**
- [ ] **Step 7: Replace only the old title/tabs/summary/index JSX in `MarketsExperience`, leaving `marketBoards` onward unchanged.**
- [ ] **Step 8: Run the route-render test and the two new unit tests; confirm all pass.**

### Task 4: Visual calibration and regression verification

**Files:**
- Modify as needed: `src/app/components/platform/MarketsOverviewHero.module.css`
- Create verification captures under `.artifacts/` only.

**Interfaces:**
- Consumes: running `/markets` page and supplied reference image.
- Produces: calibrated desktop and mobile screenshots.

- [ ] **Step 1: Run `npm run lint` and resolve only errors caused by this implementation.**
- [ ] **Step 2: Run `npm run build` and confirm a successful production build.**
- [ ] **Step 3: Start the app, capture `/markets` at 1260×698 and 390×844, and inspect both images.**
- [ ] **Step 4: Compare the desktop capture to `/tmp/codex-clipboard-D5eDL5.png`, adjust measurable geometry, then recapture.**
- [ ] **Step 5: Run `node --test tests/*.test.mjs`, `npm run lint`, and `npm run build` again with fresh output.**
- [ ] **Step 6: Review the final diff to confirm no lower `/markets` sections or unrelated files were removed.**

