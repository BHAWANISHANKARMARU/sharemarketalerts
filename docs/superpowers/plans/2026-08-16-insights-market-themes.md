# Insights Market Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce the supplied Market themes reference on `/insights` responsively.

**Architecture:** Extract the block into `MarketThemes` with a scoped CSS Module and replace the existing shared-style markup in `InsightsExperience`.

**Tech Stack:** Next.js 16, React 19, CSS Modules, Node test runner, CDP screenshots.

## Global Constraints

- Preserve unrelated page content and dirty-worktree changes.
- Use exact supplied copy and order.
- Do not invent a Global technology status.
- Add no dependencies.

### Task 1: Theme section

**Files:**
- Create: `src/app/components/platform/MarketThemes.js`
- Create: `src/app/components/platform/MarketThemes.module.css`
- Create: `tests/insights-market-themes-render.test.mjs`
- Modify: `src/app/components/platform/InsightsExperience.js`

- [ ] Write and run a failing rendered test for the landmark, four cells, three statuses, exact text, and order.
- [ ] Implement the component, inline icons, state controls, and responsive styles.
- [ ] Run the focused test green.
- [ ] Capture desktop, tablet, and mobile screenshots and verify dimensions and overflow.
- [ ] Run scoped lint and production build.
