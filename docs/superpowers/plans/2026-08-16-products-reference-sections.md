# Products Reference Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce both supplied reference sections on `/products` with exact content and responsive behavior.

**Architecture:** Extract each section into a focused React component with its own CSS Module. Reuse the page’s existing tool/category data where appropriate and keep all surrounding page behavior intact.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, Node test runner, Chrome DevTools Protocol.

## Global Constraints

- Preserve all unrelated `/products` content and dirty-worktree changes.
- Use exact supplied copy and item order.
- Add no dependencies or raster UI replacements.
- Use project typography and green theme.

---

### Task 1: Rendered section contracts

**Files:**
- Create: `tests/products-reference-sections-render.test.mjs`
- Create: `src/app/components/platform/ProductDecisionTools.js`
- Create: `src/app/components/platform/ProductDecisionTools.module.css`
- Create: `src/app/components/platform/PlatformProductsGrid.js`
- Create: `src/app/components/platform/PlatformProductsGrid.module.css`
- Modify: `src/app/components/platform/ProductsExperience.js`

**Interfaces:**
- `ProductDecisionTools({ tools })` renders `[data-product-decision-tools]` and four `[data-decision-tool]` rows.
- `PlatformProductsGrid({ categories })` renders `[data-platform-products]`, six `[data-platform-product-card]` cards, and `[data-platform-trust-strip]`.

- [ ] Write a rendered HTTP test for exact copy, counts, ordering, and section landmarks.
- [ ] Run `node --test tests/products-reference-sections-render.test.mjs`; expect missing-landmark failure.
- [ ] Implement both components, scoped styles, SVG icons, and page wiring.
- [ ] Re-run the focused test; expect PASS.

### Task 2: Visual and toolchain verification

**Files:**
- Output: `.artifacts/products-reference-sections-desktop.png`
- Output: `.artifacts/products-reference-sections-mobile.png`

**Interfaces:**
- Consumes the rendered `/products` page and produces desktop/mobile verification evidence.

- [ ] Run relevant products tests and the full test suite.
- [ ] Run `npm run lint` and `npm run build`; expect exit 0.
- [ ] Capture both sections at 1275×695 and 390×844.
- [ ] Compare layout, type, icons, pills, card grid, trust strip, and overflow; iterate until matched.
