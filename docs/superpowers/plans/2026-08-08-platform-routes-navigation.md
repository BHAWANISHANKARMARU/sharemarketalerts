# Platform Routes and Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old anchor-only navbar with seven real Next.js destinations and ship six polished, responsive platform pages.

**Architecture:** Keep the existing homepage hero intact while moving destination metadata into one shared module. A route-aware client header powers inner pages, while static Server Component route files feed dedicated content into a shared presentation shell. Pricing and the Growth CTA move into the homepage composition so inner routes receive only the global footer.

**Tech Stack:** Next.js 16.2 App Router, React 19, `next/link`, `usePathname`, CSS Modules, Node test runner.

## Global Constraints

- Preserve all existing homepage sections and market-data business logic.
- Use Next.js `Link` for internal navigation and prefetched client-side transitions.
- Create `/markets`, `/ipo`, `/products`, `/insights`, `/stock-alerts`, and `/live-markets`.
- Keep Home at `/` and expose all seven destinations in desktop and mobile navigation.
- Do not add dependencies or change existing APIs.
- Inner routes must not repeat the Pricing or Growth CTA sections.

---

### Task 1: Route and navigation contract

**Files:**
- Create: `tests/platform-routes-render.test.mjs`
- Create: `src/app/components/siteNavigation.js`

**Interfaces:**
- Produces: `NAV_ITEMS: Array<{ label: string, href: string }>` and route HTML contracts.

- [ ] **Step 1: Write the failing test** asserting the seven label/href pairs, six route files, `next/link`, `aria-current`, mobile-menu semantics, unique route headings, and homepage-only Pricing composition.
- [ ] **Step 2: Run** `node --test tests/platform-routes-render.test.mjs`; expect missing navigation module/routes.
- [ ] **Step 3: Add `NAV_ITEMS`** with Home, Markets, IPO, Products, Insights, Stock Alerts, Live Markets.
- [ ] **Step 4: Re-run the focused test**; expect only page/header assertions to remain failing.

### Task 2: Shared inner-page header

**Files:**
- Create: `src/app/components/SiteHeader.js`
- Create: `src/app/components/SiteHeader.module.css`

**Interfaces:**
- Consumes: `NAV_ITEMS`.
- Produces: `SiteHeader()` with `usePathname`, `aria-current="page"`, responsive menu, logo, login, and trial CTA.

- [ ] **Step 1: Implement the client header** using `Link`, `usePathname`, and local mobile-menu state.
- [ ] **Step 2: Add premium responsive styling** with a sticky glass surface, restrained active indicator, focus states, 16px mobile nav text, and reduced-motion handling.
- [ ] **Step 3: Run** `node --test tests/platform-routes-render.test.mjs`; header assertions pass.

### Task 3: Premium route presentation system

**Files:**
- Create: `src/app/components/PlatformPage.js`
- Create: `src/app/components/PlatformPage.module.css`
- Create: `src/app/components/platformPageData.js`

**Interfaces:**
- Produces: `PLATFORM_PAGES` keyed by `markets`, `ipo`, `products`, `insights`, `stockAlerts`, `liveMarkets`; `PlatformPage({ page })`.
- Consumes: `SiteHeader` and deterministic page configuration.

- [ ] **Step 1: Define route-specific content**: eyebrow, title, accent word, summary, proof metrics, capabilities, operational panel rows, and CTA for all six pages.
- [ ] **Step 2: Build semantic page markup** with one `h1`, route landmarks, metric lists, capability articles, operational table/feed, and contextual CTA.
- [ ] **Step 3: Add the shared visual system**: cool-white canvas, deep navy type, violet accent, editorial spacing, page-specific ambient color, responsive data composition, and accessible contrast.
- [ ] **Step 4: Run the focused test**; presentation assertions pass.

### Task 4: App Router pages and global composition

**Files:**
- Create: `src/app/markets/page.js`
- Create: `src/app/ipo/page.js`
- Create: `src/app/products/page.js`
- Create: `src/app/insights/page.js`
- Create: `src/app/stock-alerts/page.js`
- Create: `src/app/live-markets/page.js`
- Modify: `src/app/page.js`
- Modify: `src/app/template.js`

**Interfaces:**
- Each page exports route metadata and renders `PlatformPage` with one `PLATFORM_PAGES` entry.

- [ ] **Step 1: Add all six static route files** with distinct metadata and config keys.
- [ ] **Step 2: Move `Pricing` into the homepage** after existing landing sections.
- [ ] **Step 3: Remove `Pricing` from `template.js`** while retaining global Growth CTA and Footer.
- [ ] **Step 4: Run** `node --test tests/platform-routes-render.test.mjs`; all route/composition assertions pass.

### Task 5: Replace homepage and footer navigation

**Files:**
- Modify: `src/app/components/Hero.js`
- Modify: `src/app/components/MobileHero.js`
- Modify: `src/app/components/Hero.module.css`
- Modify: `src/app/components/MobileHero.module.css`
- Modify: `src/app/components/Footer.js`
- Modify: affected existing render tests.

**Interfaces:**
- Consumes: `NAV_ITEMS`.
- Produces: consistent seven-destination desktop, mobile, and footer navigation.

- [ ] **Step 1: Replace old Hero anchors** with `NAV_ITEMS` rendered as `Link`; remove Performance, Pricing, How It Works, Results/Features-style nav destinations.
- [ ] **Step 2: Replace MobileHero menu anchors** with the same route links and close-on-navigation behavior.
- [ ] **Step 3: Update footer groups** to real route destinations while preserving support and legal anchors.
- [ ] **Step 4: Update existing tests** to assert the new information architecture without weakening unrelated contracts.
- [ ] **Step 5: Run all Node tests** against a local server.

### Task 6: Verification

**Files:**
- Verify all modified/created files.

**Interfaces:** None.

- [ ] **Step 1: Run** `npm run lint`; expect zero errors.
- [ ] **Step 2: Run** `npm run build`; expect all seven routes statically generated.
- [ ] **Step 3: Start the production server** and run `node --test tests/*.test.mjs` with `TEST_BASE_URL` where supported.
- [ ] **Step 4: Capture 1440px and 390px screenshots** for each route and inspect overflow, hierarchy, active nav, menu, and readable type.
- [ ] **Step 5: Run `git diff --check`** and report changed files plus verification evidence.
