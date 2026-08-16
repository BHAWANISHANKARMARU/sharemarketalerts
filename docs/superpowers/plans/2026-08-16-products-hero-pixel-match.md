# Products Hero Pixel-Match Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce the supplied workspace reference in only the top `/products` hero while preserving every lower products section.

**Architecture:** Keep the existing `ProductsExperience` state and data model, wrap the top workspace in a dedicated hero shell, and move its visual rules into a route-specific CSS module. Shared lower-section classes remain in `TradingWorkspace.module.css` so other platform routes and the products content below the hero are unaffected.

**Tech Stack:** Next.js 16 App Router, React 19 client component, CSS Modules, Node test runner, headless Chrome.

## Global Constraints

- Match the supplied 1252 × 711 desktop reference exactly for the top workspace.
- Preserve tab filtering, tool selection, and all destination links.
- Preserve `Built around the decision`, toolkit, directory, matrix, and delivery sections below the hero.
- Follow installed Next.js 16.2.12 App Router and CSS Module conventions.
- At approximately 390px, avoid horizontal page overflow and keep controls usable.

---

### Task 1: Products Hero Contract

**Files:**
- Create: `tests/products-hero-reference.test.mjs`
- Modify: `src/app/components/platform/ProductsExperience.js`

**Interfaces:**
- Consumes: existing `TOOLS`, active tool state, and workspace primitives.
- Produces: `data-products-hero="true"` hero boundary and `ProductsHero.module.css` import.

- [ ] **Step 1: Write the failing test** asserting the dedicated module import, hero landmark, absence of `SiteHeader`, exact reference copy, tool interactions, and continued lower-section copy.
- [ ] **Step 2: Run `node --test tests/products-hero-reference.test.mjs`** and verify failure because the hero landmark/module do not exist.
- [ ] **Step 3: Add the hero boundary and route-specific class mapping** while retaining all lower sections and existing state behavior.
- [ ] **Step 4: Re-run the focused test** and verify it passes.

### Task 2: Reference Visual System

**Files:**
- Modify: `tests/products-hero-reference.test.mjs`
- Create: `src/app/components/platform/ProductsHero.module.css`
- Modify: `src/app/components/platform/ProductsExperience.js`

**Interfaces:**
- Consumes: the semantic hero structure from Task 1.
- Produces: isolated desktop/mobile CSS for the products hero.

- [ ] **Step 1: Extend the test first** with required emerald tokens, clipped-corner shell, reference-width canvas, dotted decision field, two-column workbench, and mobile breakpoint assertions.
- [ ] **Step 2: Run the focused test** and verify it fails on missing CSS rules.
- [ ] **Step 3: Implement the minimal CSS module and class bindings** for breadcrumbs, intro, tabs, rail, preview, toolbar, input cards, signal visualization, and footer.
- [ ] **Step 4: Run the focused and platform route tests** and verify both pass.

### Task 3: Pixel Comparison and Quality Gate

**Files:**
- Create: `.artifacts/capture-products-page.mjs`
- Modify as mismatches require: `src/app/components/platform/ProductsHero.module.css`

**Interfaces:**
- Consumes: running `/products` route at `http://127.0.0.1:3000/products`.
- Produces: 1252 × 711 and 390px comparison screenshots.

- [ ] **Step 1: Start the existing development command** and capture desktop/mobile screenshots with headless Chrome.
- [ ] **Step 2: Compare the desktop capture side-by-side with the supplied reference** and inventory geometry, typography, color, and wrapping mismatches.
- [ ] **Step 3: Tune only the dedicated hero CSS** and repeat capture/comparison until the hero matches while lower content remains present.
- [ ] **Step 4: Run `node --test tests/*.test.mjs`, `npm run lint`, and `npm run build`** and confirm clean results.
- [ ] **Step 5: Review `git diff --check` and the scoped diff** to confirm no unrelated user work was changed.
