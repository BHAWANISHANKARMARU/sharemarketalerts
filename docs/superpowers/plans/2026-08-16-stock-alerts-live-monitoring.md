# Stock Alerts Unified Live Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the complete stock-alerts workspace with the approved unified monitoring dashboard.

**Architecture:** Keep `StockAlertsExperience` as the live-data adapter and render one isolated `LiveRuleMonitoring` client component. Use a scoped CSS module for the reference layout and Recharts for the featured price trend.

**Tech Stack:** Next.js 16 App Router, React client components, CSS Modules, Recharts, Node test runner.

## Global Constraints

- Keep Yahoo-backed quote values and local rule controls.
- Cap desktop width at 980px; match the 469px reference without horizontal overflow.
- Remove the previous page body instead of stacking the new design beneath it.
- Do not use Git.

---

### Task 1: Route-render contract

- [x] Update the stock-alert route test for the unified dashboard landmarks, four rules, and reference copy.
- [x] Verify the test fails against the previous page body.

### Task 2: Unified dashboard

- [x] Simplify `StockAlertsExperience.js` to a live-data adapter.
- [x] Build the live header, rule map, breakout card, Recharts trend, activity feed, rules card, and status footer.
- [x] Preserve actionable links and pause/resume controls.

### Task 3: Responsive reference match

- [x] Add a 980px desktop cap and compact 469px reference layout.
- [x] Add a narrow-mobile stacked layout below 380px.
- [x] Verify no horizontal overflow.

### Task 4: Verification

- [x] Run the focused route-render test.
- [x] Run ESLint on the modified components.
- [x] Confirm `/stock-alerts` returns HTTP 200.
- [x] Inspect 469px and desktop captures.
