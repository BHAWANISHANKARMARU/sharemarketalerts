# Insights Research Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce the approved research ideas reference at the top of `/insights` with responsive, interactive category filtering.

**Architecture:** Keep `InsightsExperience` as the client-side state owner and extract the reference styling into a dedicated CSS Module. Replace only the existing intro-through-latest-research markup; all lower sections continue to use the shared workspace module.

**Tech Stack:** Next.js 16.2 App Router, React 19 client components, CSS Modules, Node test runner.

## Global Constraints

- Preserve the existing `SiteHeader`, breadcrumbs, route, lower Insights sections, and shared Manrope typography.
- Match the supplied desktop reference and prevent horizontal overflow at 390px and 768px.
- Do not add dependencies or perform Git operations.

---

### Task 1: Reference render contract

**Files:**
- Modify: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: rendered `http://localhost:3000/insights` HTML.
- Produces: a route contract for the featured research card and six latest-research rows.

- [ ] Add a test that fetches `/insights` and asserts the reference landmarks, default title, three evidence labels, and six latest-research items.
- [ ] Run `node --test tests/platform-routes-render.test.mjs` and confirm it fails because the new landmarks do not exist.

### Task 2: Featured research workspace

**Files:**
- Create: `src/app/components/platform/InsightsResearchHero.module.css`
- Modify: `src/app/components/platform/InsightsExperience.js`

**Interfaces:**
- Consumes: `STORIES`, `category`, `tab`, `feature`, and existing route links.
- Produces: `data-insights-reference-hero`, `data-featured-research`, and `data-latest-research` landmarks.

- [ ] Add the reference-specific markup and six compact latest-research records.
- [ ] Implement the desktop 40/60 featured-card composition, evidence grid, author footer, and two-column research list in the dedicated CSS Module.
- [ ] Add tablet and mobile breakpoints with one-column mobile stacking and overflow-safe filter rails.
- [ ] Run `node --test tests/platform-routes-render.test.mjs` and confirm the contract passes.

### Task 3: Verification

**Files:**
- Verify: `src/app/components/platform/InsightsExperience.js`
- Verify: `src/app/components/platform/InsightsResearchHero.module.css`

**Interfaces:**
- Consumes: running Next.js route.
- Produces: verified desktop and mobile screenshots and clean toolchain output.

- [ ] Run ESLint on the edited component.
- [ ] Capture `/insights` at the reference desktop width, 768px, and 390px; compare card geometry, typography, alignment, and overflow.
- [ ] Run the focused platform test and `npm run build`.
- [ ] Restart `npm run dev` and confirm `/insights` returns HTTP 200.
