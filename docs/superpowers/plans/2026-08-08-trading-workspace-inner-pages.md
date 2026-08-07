# Trading Workspace Inner Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the six inner routes into a cohesive TradingView-style analytical workspace while leaving the homepage unchanged.

**Architecture:** Keep the six independent route experiences and existing live-data provider, but replace their marketing-oriented composition with a compact shared workspace shell and route-specific tools. Shared primitives provide breadcrumbs, tabs, filter chips, panel anatomy, and market formatting; each route retains its own information architecture and interactive state.

**Tech Stack:** Next.js 16.2 App Router, React 19, CSS Modules, Recharts 3, existing Yahoo/IPO providers, Node test runner, ESLint.

## Global Constraints

- Do not modify the homepage structure or homepage component styling.
- Keep ShareMarketAlerts branding and never ship TradingView logos, trademarks, copied articles, or proprietary page text.
- Preserve `getHomeMarketData()`, `MarketDataProvider`, its 60-second refresh, and deterministic fallback behavior.
- Keep Recharts with monotone curves, 2.75px rounded strokes, 18% to 0% gradients, hover-only points, subtle horizontal grids, glass tooltips, and 700ms animation.
- Preserve client-side navigation through Next.js `Link`.
- At 390px, document width must equal viewport width; controls use at least 16px and touch targets use at least 44px.
- Green and red remain semantic status colours and are never the primary product accent.

---

### Task 1: Lock the utility-workspace contracts

**Files:**
- Modify: `tests/platform-routes-render.test.mjs`
- Modify: `tests/financial-chart-system.test.mjs`

**Interfaces:**
- Consumes: current route files and `data-*` landmarks.
- Produces: source contracts for `WorkspaceBreadcrumbs`, `WorkspaceTabs`, `FilterRail`, the six route-specific tools, homepage exclusion, and the premium chart specification.

- [ ] **Step 1: Replace marketing-page assertions with workspace assertions**

Require these exact route landmarks and copy signals:

```js
const WORKSPACES = [
  ["MarketsExperience", "data-market-dashboard", /Market summary/, /Sector performance/],
  ["IpoExperience", "data-ipo-explorer", /IPO Calendar/, /Issue screener/],
  ["ProductsExperience", "data-products-suite", /Product workspace/, /Tool preview/],
  ["InsightsExperience", "data-insights-hub", /Research ideas/, /Market themes/],
  ["StockAlertsExperience", "data-alert-builder", /Alert workspace/, /Active alerts/],
  ["LiveMarketsExperience", "data-live-terminal", /Market screener/, /Column set/],
];
```

Assert that all six experiences import at least one workspace primitive, that Markets/IPO/Stock Alerts/Live Markets still use `MarketDataProvider`, and that `src/app/page.js` does not import any workspace component.

- [ ] **Step 2: Add compact visual-system assertions**

Read `TradingWorkspace.module.css` and require:

```js
assert.match(styles, /--workspace-blue:\s*#2962ff/);
assert.match(styles, /border-radius:\s*12px/);
assert.match(styles, /overflow-x:\s*auto/);
assert.match(styles, /@media \(max-width:\s*700px\)/);
assert.match(styles, /font-size:\s*16px/);
assert.doesNotMatch(styles, /font-size:\s*[6-9]px/);
```

- [ ] **Step 3: Run the focused tests and confirm failure**

Run: `node --test tests/platform-routes-render.test.mjs tests/financial-chart-system.test.mjs`

Expected: FAIL because workspace primitives and new route copy do not exist.

- [ ] **Step 4: Commit the failing contracts**

```bash
git add tests/platform-routes-render.test.mjs tests/financial-chart-system.test.mjs
git commit -m "test: define analytical workspace routes"
```

---

### Task 2: Build the compact shared workspace shell

**Files:**
- Create: `src/app/components/platform/WorkspacePrimitives.js`
- Create: `src/app/components/platform/TradingWorkspace.module.css`
- Create: `src/app/components/platform/PremiumTrendChart.module.css`
- Modify: `src/app/components/platform/PremiumTrendChart.js`
- Modify: `src/app/components/SiteHeader.module.css`

**Interfaces:**
- Produces: `WorkspaceBreadcrumbs({ items })`, `WorkspaceTabs({ items, active, onChange, label })`, `FilterRail({ children, label })`, `PanelHeading({ title, action, subtitle })`, `ChangeValue({ value, direction, dark })`, and `formatIstTime(value)`.
- Consumes: `SiteHeader`, existing `NAV_ITEMS`, and Recharts.

- [ ] **Step 1: Create workspace primitives**

Implement named exports with semantic markup. `WorkspaceTabs` renders buttons with `aria-pressed`; `FilterRail` renders a labelled horizontally scrollable region; `ChangeValue` includes `▲` or `▼` beside signed values so colour is not the only state signal.

```js
export function ChangeValue({ value, direction = "up" }) {
  return <span className={direction === "down" ? s.changeDown : s.changeUp}>
    <span aria-hidden="true">{direction === "down" ? "▼" : "▲"}</span>{value}
  </span>;
}
```

- [ ] **Step 2: Create the visual tokens and shell styles**

Use this token set at `.workspacePage`:

```css
--workspace-bg: #ffffff;
--workspace-text: #131722;
--workspace-muted: #6a6d78;
--workspace-line: #e0e3eb;
--workspace-control: #f0f3fa;
--workspace-blue: #2962ff;
--workspace-green: #089981;
--workspace-red: #f23645;
```

Define compact title rows, breadcrumbs, 36–44px chips, 12px panel radius, fine borders, table scrollers, sticky table headers, tabular numerals, visible focus states, and the 390px containment rules from the specification.

- [ ] **Step 3: Restyle only the inner-page header**

Keep `SiteHeader.js` behavior unchanged. Make its CSS a 64px white utility bar with a wider desktop search-like login affordance, compact navigation, blue active underline, 40px primary action, and the existing 44px mobile menu. Because the homepage does not render `SiteHeader`, this cannot change its visual system.

- [ ] **Step 4: Isolate chart styles**

Move chart wrapper and tooltip rules from `PlatformExperiences.module.css` into `PremiumTrendChart.module.css`. Keep the exact Recharts mark specification and give the light workspace a `#ffffff` glass tooltip with 16px radius.

- [ ] **Step 5: Run focused tests and lint**

Run: `node --test tests/platform-routes-render.test.mjs tests/financial-chart-system.test.mjs && npm run lint`

Expected: route tests still fail on route content; primitive/chart assertions pass; ESLint is clean.

- [ ] **Step 6: Commit the shared shell**

```bash
git add src/app/components/platform/WorkspacePrimitives.js src/app/components/platform/TradingWorkspace.module.css src/app/components/platform/PremiumTrendChart.js src/app/components/platform/PremiumTrendChart.module.css src/app/components/SiteHeader.module.css
git commit -m "feat: add compact market workspace shell"
```

---

### Task 3: Rebuild Markets and IPO as analytical overview pages

**Files:**
- Modify: `src/app/components/platform/MarketsExperience.js`
- Modify: `src/app/components/platform/IpoExperience.js`
- Test: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: `useMarketData()`, `PremiumTrendChart`, all workspace primitives.
- Produces: a live market overview and searchable IPO calendar/screener without changing route signatures.

- [ ] **Step 1: Implement Markets overview hierarchy**

Render `WorkspaceBreadcrumbs`, country selector line, `Overview` title, overview/performance/technicals tabs, and `Market summary`. The main grid uses the live NIFTY chart on the left and seven horizontal sector-performance rows on the right. Follow with four index summary cards, earnings watch, most-active and unusual-volume lists, movers, and a sector heat map. All market quotes and the chart come from `useMarketData()`.

- [ ] **Step 2: Implement Markets interactions**

Add local state for the visible collection (`Most active`, `Top gainers`, `Biggest losers`) and chart period. Buttons use `aria-pressed`; collection changes swap existing provider rows without fetching a second data source.

- [ ] **Step 3: Implement IPO calendar and screener**

Render `WorkspaceBreadcrumbs`, `IPO Calendar`, date/status chips, summary metrics, chronological issue events, and `Issue screener`. Preserve query and status state. The table keeps live provider fields and adds a deterministic `Signal` label computed only from GMP presence and issue status:

```js
const signal = row.gmpPercent >= 10 ? "High interest" : row.gmpPercent > 0 ? "Tracking" : "No premium";
```

Do not represent this label as investment advice.

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/platform-routes-render.test.mjs`

Expected: Markets and IPO contracts pass; remaining four route contracts fail.

- [ ] **Step 5: Commit the overview routes**

```bash
git add src/app/components/platform/MarketsExperience.js src/app/components/platform/IpoExperience.js tests/platform-routes-render.test.mjs
git commit -m "feat: rebuild markets and ipo workspaces"
```

---

### Task 4: Rebuild Products and Insights as tool and research directories

**Files:**
- Modify: `src/app/components/platform/ProductsExperience.js`
- Modify: `src/app/components/platform/InsightsExperience.js`
- Test: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: `WorkspaceBreadcrumbs`, `WorkspaceTabs`, `FilterRail`, `PanelHeading`.
- Produces: original product directory and research feed with client-side navigation links.

- [ ] **Step 1: Implement Products directory**

Use a compact `Products / Product workspace` opening. Add a left tool-category rail and a large right `Tool preview` for Market Lens, Signal Engine, IPO Desk, and Alert Router. Each tool row includes purpose, inputs, output, route link, and availability. Below, keep a compact capability comparison and delivery-channel panel.

- [ ] **Step 2: Implement Insights feed**

Use `Insights / Research ideas`, topic chips, a two-column featured note, and a card/list feed. Preserve original research titles and add original author, read-time, category, long/neutral/risk state, market theme summaries, and week-ahead events. Buttons may filter local content but must not imply unavailable article routes.

- [ ] **Step 3: Verify route semantics**

Confirm Products uses real `Link` destinations and Insights buttons use `aria-pressed`. Ensure no visible TradingView name or copied article content is present.

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/platform-routes-render.test.mjs`

Expected: Markets, IPO, Products, and Insights contracts pass; Stock Alerts and Live Markets remain failing.

- [ ] **Step 5: Commit the directory routes**

```bash
git add src/app/components/platform/ProductsExperience.js src/app/components/platform/InsightsExperience.js
git commit -m "feat: add product and research workspaces"
```

---

### Task 5: Rebuild Stock Alerts and Live Markets as full working tools

**Files:**
- Modify: `src/app/components/platform/StockAlertsExperience.js`
- Modify: `src/app/components/platform/LiveMarketsExperience.js`
- Test: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: `useMarketData()`, `PremiumTrendChart`, workspace primitives.
- Produces: local alert composition and a full-width live market screener.

- [ ] **Step 1: Implement the Alert workspace**

Render a symbol/timeframe toolbar, a large live chart, and a right composer containing instrument, condition, threshold, close-confirmation, frequency, expiry, and delivery channel. Beneath it, render `Active alerts` and recent live triggers. Keep the local preview and `mailto:` final handoff; do not add a fake persistence response.

- [ ] **Step 2: Implement the Market screener**

Render a full-width route with market selector, filters for price/change/volume/sector/signal, `Column set` tabs, refresh status, and a wide table. Rows combine current provider gainers and losers. Include symbol, price, change, relative volume, signal, confidence, market, and provider source. Use fixed demonstration values only for relative volume and label the column help text `derived demo`.

- [ ] **Step 3: Add screener interactions**

Local state filters by mover mode and signal, toggles column sets, and sorts by change when the header is pressed. Expose `aria-sort` on the active column and `aria-pressed` on chips.

- [ ] **Step 4: Run all route tests**

Run: `node --test tests/platform-routes-render.test.mjs`

Expected: PASS for all workspace contracts.

- [ ] **Step 5: Commit the working tools**

```bash
git add src/app/components/platform/StockAlertsExperience.js src/app/components/platform/LiveMarketsExperience.js
git commit -m "feat: add alerts and live screener workspaces"
```

---

### Task 6: Remove obsolete styles and complete responsive verification

**Files:**
- Delete: `src/app/components/platform/PlatformExperiences.module.css`
- Modify: `tests/platform-routes-render.test.mjs`
- Modify: `tests/financial-chart-system.test.mjs`

**Interfaces:**
- Consumes: completed workspace pages.
- Produces: clean source tree and evidence-backed final result.

- [ ] **Step 1: Remove the obsolete marketing stylesheet**

Confirm `rg -n "PlatformExperiences" src tests` returns no imports, then delete `PlatformExperiences.module.css`.

- [ ] **Step 2: Run all automated checks**

Run:

```bash
node --test tests/*.test.mjs
npm run lint
/home/gaurav/.npm/_npx/52027bd8fc0022aa/node_modules/node/bin/node node_modules/next/dist/bin/next build
```

Expected: all tests pass, ESLint has zero warnings/errors, production build lists all six inner routes.

- [ ] **Step 3: Capture desktop screenshots**

At 1440×1000, capture `/markets`, `/ipo`, `/products`, `/insights`, `/stock-alerts`, and `/live-markets`. Verify compact openings, fine dividers, working surfaces above the fold, readable tables, and no repeated marketing hero composition.

- [ ] **Step 4: Audit mobile layout**

At 390×844, verify every route reports:

```js
document.documentElement.scrollWidth === window.innerWidth
```

Verify mobile navigation is 16px, all input/select controls are at least 16px, all primary interactive controls are at least 44px high, and tables scroll inside `.tableScroller`.

- [ ] **Step 5: Verify homepage exclusion**

Capture `/` before and after or compare its source-controlled screenshot. Confirm `src/app/page.js`, homepage section modules, and homepage CSS have no changes from the state before this plan.

- [ ] **Step 6: Commit the completed redesign**

```bash
git add src/app/components/platform tests
git commit -m "feat: complete analytical inner-page redesign"
```
