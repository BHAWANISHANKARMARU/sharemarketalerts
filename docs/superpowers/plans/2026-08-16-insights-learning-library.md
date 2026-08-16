# Insights Learning Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compact `/insights` learning-library block with the supplied editorial introduction and responsive four-card reference design.

**Architecture:** Extract the section into a focused client-independent React component and CSS module, leaving `InsightsExperience.js` responsible only for page composition. Protect exact content, card count/order, responsive columns, readable text, and viewport fit with route and browser-computed regression tests.

**Tech Stack:** Next.js 16.2.12, React, Next.js Link, CSS Modules, Node test runner, Chrome DevTools Protocol.

## Global Constraints

- Preserve the four supplied titles, descriptions, destinations, and “Open guide ↗” labels in their existing order.
- Desktop uses a left editorial column and right 2×2 card grid; tablet uses an introduction above a 2×2 grid; mobile stacks all content in one column.
- Use green, purple, amber, and blue numbered/icon treatments in order.
- Body copy remains at least 13px and no viewport creates horizontal overflow.
- Do not modify unrelated Insights sections.

---

### Task 1: Content and component contract

**Files:**
- Create: `tests/insights-learning-library-render.test.mjs`
- Create: `src/app/components/platform/InsightsLearningLibrary.js`
- Create: `src/app/components/platform/InsightsLearningLibrary.module.css`
- Modify: `src/app/components/platform/InsightsExperience.js`

**Interfaces:**
- Produces: default-exported `InsightsLearningLibrary()` with `data-insights-learning-library="true"` and four `data-learning-guide="true"` articles.
- Consumes: Next.js `Link` and the existing routes `/markets`, `/stock-alerts`, `/ipo`, and `/live-markets`.

- [ ] **Step 1: Write the failing route test**

Fetch `/insights` and assert HTTP 200, the section landmark, exactly four guide landmarks, exact supplied copy, exact order, and four “Open guide ↗” labels.

- [ ] **Step 2: Run the route test and confirm RED**

Run: `node --test tests/insights-learning-library-render.test.mjs`

Expected: FAIL because the dedicated landmark and extracted component do not exist.

- [ ] **Step 3: Implement the component and wire it into the page**

Create the static four-guide data array, four small inline line icons, left introduction/callout markup, and 2×2 card markup. Replace only the existing `s.learningLibrary` section in `InsightsExperience.js` with `<InsightsLearningLibrary />` and remove the now-unused `LEARNING_PATHS` constant.

- [ ] **Step 4: Run the route test and confirm GREEN**

Run: `node --test tests/insights-learning-library-render.test.mjs`

Expected: PASS.

### Task 2: Responsive reference styling

**Files:**
- Create: `tests/insights-learning-library-responsive.test.mjs`
- Modify: `src/app/components/platform/InsightsLearningLibrary.module.css`

**Interfaces:**
- Consumes: the landmarks created in Task 1.
- Produces: computed 2-column section/2-column card grid on desktop, 1-column section/2-column grid on tablet, and 1-column section/card grid on mobile.

- [ ] **Step 1: Write the failing browser test**

Use the repository’s CDP helper pattern to inspect 1280×900, 768×900, and 390×844. Assert the requested column counts, at least 13px body text, four equal desktop card heights, and page overflow no greater than 1px.

- [ ] **Step 2: Run the browser test and confirm RED**

Run: `TEST_CDP_PORT=9232 node --test tests/insights-learning-library-responsive.test.mjs`

Expected: FAIL until the new CSS module defines the reference geometry.

- [ ] **Step 3: Implement the reference styling**

Use the page’s ink/muted neutrals, a subtle border and shadow, a 42–48px numbered square, matching line icon, purple action links, generous card padding, and breakpoints at 900px and 600px. Keep all sizing content-driven.

- [ ] **Step 4: Run both focused tests and confirm GREEN**

Run: `TEST_CDP_PORT=9232 node --test tests/insights-learning-library-render.test.mjs tests/insights-learning-library-responsive.test.mjs`

Expected: both tests PASS.

### Task 3: Visual and production verification

**Files:**
- Create: `.artifacts/capture-insights-learning-library.mjs`
- Modify if required by comparison: `src/app/components/platform/InsightsLearningLibrary.module.css`

**Interfaces:**
- Consumes: rendered `/insights` section landmark.
- Produces: desktop, tablet, and mobile screenshots plus final toolchain evidence.

- [ ] **Step 1: Capture three viewport renders**

Capture the section at 1280px, 768px, and 390px, including its complete bounds.

- [ ] **Step 2: Compare and correct**

Check composition, wrapping, card equality, colour sequence, spacing, and overflow against the supplied screenshot. Adjust only the dedicated CSS module and repeat captures until matched.

- [ ] **Step 3: Run final verification**

Run: `TEST_CDP_PORT=9232 node --test tests/insights-learning-library-render.test.mjs tests/insights-learning-library-responsive.test.mjs && npm run lint -- src tests && npm run build && git diff --check`

Expected: all commands exit 0.
