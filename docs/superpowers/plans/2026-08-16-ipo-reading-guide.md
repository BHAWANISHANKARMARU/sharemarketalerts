# IPO Reading Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce the supplied IPO reading-guide reference at the bottom of `/ipo` with responsive, semantic markup.

**Architecture:** Extract the existing guide into a focused React component backed by a scoped CSS Module. Keep the current page data flow untouched and verify the new section through a browser-rendered behavior test plus visual screenshots.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, Node test runner, Chrome DevTools Protocol.

## Global Constraints

- Preserve all unrelated `/ipo` content and behavior.
- Keep the supplied copy and card order verbatim.
- Use the existing Manrope font and project green visual language.
- Add no dependencies and no raster replacement for the UI.
- Preserve the user's existing untracked files.

---

### Task 1: Rendered guide contract

**Files:**
- Create: `tests/ipo-reading-guide-render.test.mjs`
- Create: `src/app/components/platform/IpoReadingGuide.js`
- Create: `src/app/components/platform/IpoReadingGuide.module.css`
- Modify: `src/app/components/platform/IpoExperience.js`

**Interfaces:**
- Consumes: no props; static approved copy.
- Produces: `IpoReadingGuide()` and `[data-ipo-reading-guide]` with four `[data-ipo-reading-card]` articles.

- [ ] **Step 1: Write the failing browser-rendered test**

Assert that `/ipo` returns the guide landmark, exact heading/paragraph/card copy, four cards, four SVG icons, and that the guide appears above the data-source note.

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test tests/ipo-reading-guide-render.test.mjs`
Expected: FAIL because `[data-ipo-reading-guide]` does not exist.

- [ ] **Step 3: Add the component and wire it into the IPO page**

Create the static data array and inline SVG icon switch in `IpoReadingGuide.js`, import its CSS Module, and replace the existing `.ipoGuide` block in `IpoExperience.js` with `<IpoReadingGuide />`.

- [ ] **Step 4: Build the reference styling**

Implement the 1252px reference composition with a left intro and 2×2 clipped card grid. Add the green strokes, dot field, diagonal wash, fold corners, pale icon circles, precise typography, and responsive breakpoints for 390px.

- [ ] **Step 5: Run the focused test to verify GREEN**

Run: `node --test tests/ipo-reading-guide-render.test.mjs`
Expected: PASS.

### Task 2: Visual and toolchain verification

**Files:**
- Modify as needed: `src/app/components/platform/IpoReadingGuide.module.css`
- Output: `.artifacts/ipo-reading-guide-desktop.png`
- Output: `.artifacts/ipo-reading-guide-mobile.png`

**Interfaces:**
- Consumes: rendered `/ipo` page.
- Produces: desktop/mobile evidence with no overflow and reference-matching section geometry.

- [ ] **Step 1: Run regression checks**

Run: `node --test tests/*.test.mjs`
Expected: all enabled tests PASS.

- [ ] **Step 2: Run lint and production build**

Run: `npm run lint` and `npm run build`
Expected: both exit 0.

- [ ] **Step 3: Capture desktop and mobile screenshots**

Start the existing dev command, capture `/ipo` at 1252×711 and 390×844, scroll the guide into view, and save both artifacts.

- [ ] **Step 4: Compare and iterate**

Inspect heading wrap, overall proportions, card dimensions, spacing, folds, icons, decorative field, and mobile overflow. Correct mismatches and repeat focused test, lint, build, and screenshots after the final edit.
