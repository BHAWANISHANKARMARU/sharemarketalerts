# Markets Hero Live Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the `/markets` hero heading hierarchy and make its visible controls and live-data state functional without changing the approved desktop geometry.

**Architecture:** Keep `MarketsOverviewHero` as the hero orchestrator, reuse the existing `MarketDataProvider` Yahoo payload, and pass the provider mode from `MarketsExperience`. Add two local accessible popovers, derive the displayed chart instead of synchronizing it through an effect, and express live/loading/fallback states through stable data attributes and compact status UI.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, Recharts, Yahoo-backed internal API routes, Node test runner, ESLint.

## Global Constraints

- Keep Manrope as the sans-serif font and preserve the italic serif treatment elsewhere.
- Preserve the validated 1240px and 1920px markets hero geometry.
- Reuse `/api/market/chart` and the existing Yahoo provider; add no dependency or provider.
- Never fabricate changing market values; retain last successful values on provider failure.
- Respect `prefers-reduced-motion`.
- Do not commit or push Git changes.

---

### Task 1: Lock the live-control contract with focused tests

**Files:**
- Modify: `tests/markets-overview-render.test.mjs`

**Interfaces:**
- Consumes: `MarketsOverviewHero({ market, updatedAt, sourceMode, view, onViewChange })`
- Produces: Static contract assertions for accessible menus, live mode, chart feedback, and preserved geometry.

- [ ] **Step 1: Add failing assertions**

```js
assert.match(hero, /sourceMode/);
assert.match(hero, /aria-expanded/);
assert.match(hero, /role="menu"/);
assert.match(hero, /data-source-mode/);
assert.match(hero, /aria-live="polite"/);
assert.match(hero, /const displayedChart/);
assert.doesNotMatch(hero, /if \(period === "1D"\) setChart/);
assert.match(experience, /sourceMode=\{sources\.yahoo\.mode\}/);
assert.match(styles, /\.headerPopover/);
assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node --test tests/markets-overview-render.test.mjs`

Expected: FAIL because `sourceMode`, popover markup, and live feedback are not implemented.

---

### Task 2: Wire source mode and accessible header selectors

**Files:**
- Modify: `src/app/components/platform/MarketsExperience.js`
- Modify: `src/app/components/platform/MarketsOverviewHero.js`

**Interfaces:**
- Consumes: `sources.yahoo.mode`, `model.indices`, `view`, `onViewChange`
- Produces: `sourceMode` prop, `openMenu` state, market/view menu buttons, Escape/outside-click behavior.

- [ ] **Step 1: Pass provider mode into the hero**

```jsx
<MarketsOverviewHero
  market={market}
  updatedAt={updatedAt}
  sourceMode={sources.yahoo.mode}
  view={view}
  onViewChange={setView}
/>
```

- [ ] **Step 2: Add one coordinated menu state and dismissal effect**

```js
const controlsRef = useRef(null);
const [openMenu, setOpenMenu] = useState(null);

useEffect(() => {
  function dismiss(event) {
    if (event.type === "keydown" && event.key !== "Escape") return;
    if (event.type === "pointerdown" && controlsRef.current?.contains(event.target)) return;
    setOpenMenu(null);
  }
  document.addEventListener("keydown", dismiss);
  document.addEventListener("pointerdown", dismiss);
  return () => {
    document.removeEventListener("keydown", dismiss);
    document.removeEventListener("pointerdown", dismiss);
  };
}, []);
```

- [ ] **Step 3: Replace the static headings with accessible selectors**

Use `aria-expanded`, `aria-controls`, `aria-haspopup="menu"`, `role="menu"`, and `role="menuitem"`. The market popover lists the active Indian market plus `model.indices`; the view popover lists `VIEWS`, calls `onViewChange(item)`, and closes itself.

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/markets-overview-render.test.mjs`

Expected: It may still fail only on styling/live feedback assertions.

---

### Task 3: Make chart and provider states visibly live and resilient

**Files:**
- Modify: `src/app/components/platform/MarketsOverviewHero.js`

**Interfaces:**
- Consumes: `model.chart`, `period`, `/api/market/chart`, `sourceMode`
- Produces: `remoteChart: { period: string, points: Array } | null`, `chartState: "idle" | "loading" | "ready" | "error"`, derived `displayedChart`.

- [ ] **Step 1: Remove synchronous chart state synchronization**

```js
const [remoteChart, setRemoteChart] = useState(null);
const [chartState, setChartState] = useState("idle");
const displayedChart = period === "1D"
  ? model.chart
  : remoteChart?.period === period
    ? remoteChart.points
    : model.chart;
```

- [ ] **Step 2: Update the range request lifecycle**

Set `chartState` to `loading`, fetch the selected range with an `AbortController`, save `{ period, points }` only for a non-empty successful payload, set `ready`, and set `error` for non-abort failures while retaining `displayedChart`.

- [ ] **Step 3: Render live state without layout shift**

Add `data-source-mode={sourceMode}`, `data-live={sourceMode === "live"}`, an `aria-live="polite"` status message, a loading marker on the selected range, and provider state text inside the existing status card. Continue rendering `<MarketChart data={displayedChart} />`.

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/markets-overview-render.test.mjs`

Expected: PASS for component behavior contracts.

---

### Task 4: Improve hierarchy, popovers, and live icon motion

**Files:**
- Modify: `src/app/components/platform/MarketsOverviewHero.module.css`

**Interfaces:**
- Consumes: `.marketSelector`, `.overviewSelector`, `.headerPopover`, `[data-live]`, `[data-state]`, `[aria-expanded]`
- Produces: Refined header typography and stable overlays that do not affect layout.

- [ ] **Step 1: Refine both selectors**

Give “Indian stocks” Manrope 700–760, `letter-spacing: -0.035em`, a soft transparent hover surface, and a clear focus ring. Give “Overview” a 710-weight compact line height and make its button inherit the heading size. Rotate chevrons through `[aria-expanded="true"]`.

- [ ] **Step 2: Style both popovers**

Use absolute positioning, 14px radius, white/glass background, subtle border/shadow, 8px internal gaps, clear selected rows, and a z-index above the artwork and tabs. Keep all popovers out of document flow.

- [ ] **Step 3: Add restrained live and interaction motion**

Pulse only the live status dot, rotate the loading glyph, and lift icon tiles by at most 1px on hover/focus. Disable transforms and animations inside the existing reduced-motion media query.

- [ ] **Step 4: Run the focused test and touched-file lint**

Run: `node --test tests/markets-overview-render.test.mjs`

Run: `npx eslint src/app/components/platform/MarketsOverviewHero.js src/app/components/platform/MarketsExperience.js tests/markets-overview-render.test.mjs`

Expected: Both commands PASS.

---

### Task 5: Visual and production verification

**Files:**
- Verify: `src/app/components/platform/MarketsOverviewHero.js`
- Verify: `src/app/components/platform/MarketsOverviewHero.module.css`

**Interfaces:**
- Consumes: Running `/markets` route.
- Produces: Desktop screenshots and successful production compilation.

- [ ] **Step 1: Capture 1240px and 1920px screenshots**

Run headless Chrome against `http://localhost:3000/markets` with 1240×900 and 1920×1200 viewports. Confirm the header, artwork, tabs, cards, and metrics retain their approved coordinates.

- [ ] **Step 2: Exercise interactions**

Open both selectors, change views, change chart periods, follow an index link target, and confirm Escape/outside click closes each popover. Confirm the live/fallback label matches `sources.yahoo.mode`.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: Next.js build exits 0 and `/markets` is generated successfully.

