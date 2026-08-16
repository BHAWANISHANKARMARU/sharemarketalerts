# IPO Market Data Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reference-matched IPO market data hub directly beneath the `/ipo` hero while retaining live provider data and all existing route functionality.

**Architecture:** Derive a focused hub view model from the existing `ipo.rows` provider data inside `IpoExperience.js`. Style it with dedicated `ipoDataHub*` classes in the route-specific `IpoExperience.module.css`, keeping the section isolated from every other platform route.

**Tech Stack:** Next.js 16 App Router, React 19 client component, CSS Modules, Node test runner, existing MarketDataProvider.

## Global Constraints

- Follow the installed Next.js 16.2.12 CSS Module and Client Component documentation.
- Preserve the existing `/ipo` hero and all live provider calculations.
- Do not add dependencies, generated raster assets, or Git operations.
- Match the supplied green/white reference at desktop and adapt it without overflow at tablet and mobile widths.

---

### Task 1: Protect the rendered hub contract

**Files:**
- Modify: `tests/platform-routes-render.test.mjs`
- Test: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: the rendered `/ipo` route on the running development server.
- Produces: assertions for `data-ipo-data-hub`, five `data-ipo-data-card` elements, `data-ipo-workflow`, and the required visible copy.

- [ ] Add a route-level test that fetches `/ipo` and asserts the hub landmark, five data cards, workflow landmark, research link, and the three workflow stages.
- [ ] Run `node --test tests/platform-routes-render.test.mjs` and confirm the new test fails because `data-ipo-data-hub` is absent.

### Task 2: Implement the semantic data hub

**Files:**
- Modify: `src/app/components/platform/IpoExperience.js`

**Interfaces:**
- Consumes: `ipoCollections`, `ipo.rows`, `byPremium`, `bySize`, and `listed` already derived by `IpoExperience`.
- Produces: `IpoHubIcon`, `IpoHubIllustration`, five semantic data cards, and the three-step workflow.

- [ ] Add small inline SVG helpers for the card icons and report illustration.
- [ ] Replace the old lower `marketDirectory` block with the new `data-ipo-data-hub` section immediately after `WorkspaceTabs`.
- [ ] Keep the first five collection entries in the data-card grid and render workflow content in its dedicated ordered list.
- [ ] Give every interactive arrow a real destination and accessible label.
- [ ] Run the focused route test and confirm it passes.

### Task 3: Match the reference and make it responsive

**Files:**
- Modify: `src/app/components/platform/IpoExperience.module.css`

**Interfaces:**
- Consumes: the new `ipoDataHub*` class names from `IpoExperience.js`.
- Produces: isolated desktop, tablet, mobile, focus, and reduced-motion styles.

- [ ] Add the reference shell, heading, illustration, five-card grid, card rows, status chips, and workflow connector styles.
- [ ] Add two-column tablet and single-column mobile rules without changing other platform pages.
- [ ] Add visible focus and reduced-motion rules.
- [ ] Capture `/ipo` at 1440px, 768px, and 390px and confirm zero horizontal overflow.

### Task 4: Verification

**Files:**
- Verify: `src/app/components/platform/IpoExperience.js`
- Verify: `src/app/components/platform/IpoExperience.module.css`
- Verify: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: completed hub and running route.
- Produces: verified implementation and retained development server.

- [ ] Run `npm exec eslint -- src/app/components/platform/IpoExperience.js`.
- [ ] Run `node --test tests/*.test.mjs` while the dev server is available.
- [ ] Stop the dev server, run `npm run build`, then restart `npm run dev`.
- [ ] Confirm `http://localhost:3000/ipo` returns HTTP 200 and the new section is visible.
