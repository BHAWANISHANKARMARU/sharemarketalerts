# Platform Products Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/products` platform-products panel clearly readable and visually separated at desktop, tablet, and mobile widths.

**Architecture:** Preserve `PlatformProductsGrid.js` as the semantic content component and make the treatment entirely within its CSS module. Add a focused source-level regression test for the typography floors, separate surfaces, and three responsive column modes, then validate the rendered page with viewport screenshots.

**Tech Stack:** Next.js 16.2.12, React, CSS Modules, Node test runner, Playwright screenshot helper already used by the repository.

## Global Constraints

- Preserve every supplied string, list order, route, icon, number, arrow, and “Included ✓” badge.
- Supporting copy is at least 12px at every viewport.
- Product cards and trust items use distinct surfaces from the white section canvas.
- Above 900px use three product columns and four trust columns; from 601px through 900px use two and two; at 600px and below use one and one.
- Section height remains content-driven and no viewport may introduce horizontal overflow.

---

### Task 1: Responsive readability contract

**Files:**
- Create: `tests/platform-products-readability.test.mjs`
- Modify: `src/app/components/platform/PlatformProductsGrid.module.css`

**Interfaces:**
- Consumes: existing `.section`, `.grid`, `.trust`, product-card, product-copy, list-row, and badge selectors.
- Produces: readable CSS typography and responsive grid behavior without changing component props or markup.

- [ ] **Step 1: Write the failing test**

Create a Node test that reads `PlatformProductsGrid.module.css` and asserts the following real styling contract: card and trust-item background declarations exist, product supporting text and trust supporting text are at least `12px`, desktop grid declarations remain three/four columns, the 900px media query declares two/two columns, and the 600px media query declares one/one columns with horizontal section padding.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/platform-products-readability.test.mjs`

Expected: FAIL because the current product and trust supporting copy uses `10px` and `9px`, trust items share one continuous background, and the mobile section has zero horizontal padding.

- [ ] **Step 3: Implement the minimal CSS treatment**

Update the CSS module with this treatment:

- Expand the section to a maximum width near 1180px with generous but responsive inline padding.
- Use a quiet green-neutral card surface, stronger border, and restrained shadow.
- Raise product-card copy to 12px, list labels to 13px, and badges to 10px or larger.
- Increase card header, row, icon, and badge spacing enough to prevent compression.
- Give `.trust > div` its own bordered, softly tinted, rounded mini-panel and set trust copy to at least 12px.
- Keep the 3/4, 2/2, and 1/1 responsive column transitions from the global constraints.
- On mobile, retain at least 16px horizontal section padding and remove any fixed/minimum sizing that can overflow 390px.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `node --test tests/platform-products-readability.test.mjs`

Expected: PASS.

- [ ] **Step 5: Run code-quality checks**

Run: `npm run lint -- src tests && npm run build && git diff --check`

Expected: all commands exit 0.

### Task 2: Multi-viewport visual verification

**Files:**
- Reuse: existing repository screenshot/capture helper under `.artifacts/`
- Modify if comparison reveals a mismatch: `src/app/components/platform/PlatformProductsGrid.module.css`

**Interfaces:**
- Consumes: the rendered `/products` route and the CSS contract completed in Task 1.
- Produces: verified screenshots at desktop, tablet, and mobile widths.

- [ ] **Step 1: Capture the section at three viewport widths**

Capture `/products` at the supplied desktop scale, approximately 768px tablet, and 390px mobile, scrolling the `data-platform-products="true"` landmark into view.

- [ ] **Step 2: Inspect the rendered output**

Confirm all supporting copy is readable, every product and trust surface is visibly distinct, no label or badge collides, the requested column counts are present, and `document.documentElement.scrollWidth <= window.innerWidth` at each viewport.

- [ ] **Step 3: Correct any measured mismatch and re-run checks**

Only adjust `PlatformProductsGrid.module.css`, then repeat the focused test, scoped lint, production build, and `git diff --check` until the contract and screenshots both pass.
