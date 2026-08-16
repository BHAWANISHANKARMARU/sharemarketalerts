# Insights Market Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce the approved market-stories reference on `/insights` using the supplied five stories and a responsive subscription strip.

**Architecture:** Keep the content in `InsightsExperience.js` and isolate all section styling in a new Insights-only CSS module. Reuse `ResearchGlyph` for line icons and validate the rendered route rather than testing internal implementation details.

**Tech Stack:** Next.js App Router, React, CSS Modules, Node test runner.

## Global Constraints

- Preserve every Insights section outside `Top market stories`.
- Keep the supplied story order and copy exact.
- Render five rows and one subscription strip.
- Support 390px, 768px, and desktop widths without horizontal overflow.
- Do not perform Git operations.

---

### Task 1: Market stories route contract

**Files:**
- Modify: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: live `http://localhost:3000/insights` route.
- Produces: a contract for `data-insights-market-stories`, five `data-market-story` rows, and `data-market-stories-subscribe`.

- [ ] Add a focused route test that asserts the landmark, exact row count, supplied first and fifth headlines, and subscription message.
- [ ] Run the focused test and confirm it fails because the new landmarks are absent.

### Task 2: Reference section implementation

**Files:**
- Modify: `src/app/components/platform/InsightsExperience.js`
- Create: `src/app/components/platform/InsightsMarketStories.module.css`

**Interfaces:**
- Consumes: `NEWS_DESK`, `ResearchGlyph`, and Next.js `Link`.
- Produces: the complete responsive market-stories panel.

- [ ] Expand each `NEWS_DESK` item with a glyph name and tone identifier.
- [ ] Replace the current shared `newsDesk` markup with the dedicated header, five-row list, and subscription form.
- [ ] Add desktop, tablet, and mobile CSS matching the supplied geometry and palette.
- [ ] Run the focused route test and confirm it passes.

### Task 3: Visual and toolchain verification

**Files:**
- Verify: `src/app/components/platform/InsightsExperience.js`
- Verify: `src/app/components/platform/InsightsMarketStories.module.css`

**Interfaces:**
- Consumes: the running `/insights` route.
- Produces: desktop/mobile captures and verification evidence.

- [ ] Capture desktop and true 390px emulated screenshots scrolled to the section.
- [ ] Confirm no horizontal overflow at 390px, 768px, and desktop widths.
- [ ] Run the focused route tests, ESLint, and HTTP 200 check.
