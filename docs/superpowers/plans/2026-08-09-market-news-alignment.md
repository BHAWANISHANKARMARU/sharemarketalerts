# Market News & Research Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the Market News & Research section on the same responsive axis as Market Calendar without changing its internal design.

**Architecture:** Mirror the active `MarketCalendarDashboard.module.css` width and centering formula in `.newsSection`. Remove `.newsSection` from the legacy 1500px shared selector and add matching tablet/mobile widths.

**Tech Stack:** Next.js 16.2.12, React, CSS Modules, Node test runner.

## Global Constraints

- Preserve all visible content and component markup.
- Preserve the visible Calendar's 1360px desktop, 960px tablet, and viewport-minus-24px mobile widths.
- Use TDD: the source contract must fail before CSS changes.
- Do not perform Git operations.

---

### Task 1: Lock the shared alignment contract

**Files:**
- Modify: `tests/markets-reference-sections-render.test.mjs`
- Modify: `src/app/components/platform/MarketReferenceSections.module.css`

**Interfaces:**
- Consumes: `.calendarSection`, `.newsSection`, and the existing wide/mobile media rules.
- Produces: a single shared horizontal centering model for both sections.

- [ ] **Step 1: Write the failing test**

Assert that News contains the visible Calendar's desktop centering formula, uses its tablet/mobile widths, and is absent from the legacy 1500px selector.

- [ ] **Step 2: Verify the test fails**

Run: `node --test tests/markets-reference-sections-render.test.mjs`

Expected: FAIL because News does not yet contain the measured Calendar width formula.

- [ ] **Step 3: Implement the minimal CSS repair**

Add the visible Calendar's width and centering declarations to News, exclude News from the legacy 1500px selector, and add the matching tablet/mobile width rules. Retain News spacing and internal padding.

- [ ] **Step 4: Verify behavior**

Run the focused test, capture the rendered section at 1920px, 1240px, 768px, and 390px, and compare its outer edges and overflow against the Calendar section.

- [ ] **Step 5: Verify toolchain**

Run the complete Node test suite, scoped ESLint, and `npm run build`.
