# Market Boards Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Most Active and Earnings Watch boards into a responsive premium fintech table and timeline while preserving their data and interactions.

**Architecture:** Keep the existing React data flow and semantic lists. Add board-specific class hooks in `MarketsExperience.js`, then implement the visual system entirely in `TradingWorkspace.module.css` so shared primitives used on other routes remain unchanged.

**Tech Stack:** Next.js 16.2.12, React, CSS Modules, Node test runner.

## Global Constraints

- Preserve the existing live collection switching, quote links, earnings data, and screener destination.
- Use Manrope and the page's purple/green market palette.
- Stack below 900px and avoid horizontal page overflow.
- Follow installed Next.js 16.2.12 documentation.
- Do not perform Git operations.

---

### Task 1: Premium market table and earnings timeline

**Files:**
- Modify: `src/app/components/platform/MarketsExperience.js:252-263`
- Modify: `src/app/components/platform/TradingWorkspace.module.css:245-265`
- Modify: `tests/markets-overview-render.test.mjs`

**Interfaces:**
- Consumes: `collection`, `collectionRows`, `setCollection`, `EARNINGS`, `QuoteRow`, `PanelHeading`, `FilterRail`, and `FilterChip`.
- Produces: `marketBoardIcon`, `marketBoardHeader`, `marketBoardFooter`, `earningsTimeline`, and `earningsNote` class hooks with unchanged data behavior.

- [ ] **Step 1: Write the failing source contract**

Add assertions that the Markets implementation exposes the new board class hooks and that the stylesheet includes the board shell, positive change pill, connected earnings timeline, mobile stacking, focus styling, and reduced-motion rule.

- [ ] **Step 2: Verify the test fails**

Run: `node --test tests/markets-overview-render.test.mjs`

Expected: FAIL because the new class hooks and board-specific CSS do not exist.

- [ ] **Step 3: Add the minimal semantic hooks**

Add decorative icon spans inside each board heading area, a timeline class on the earnings list, and specific footer/note classes. Do not change quote values, earnings entries, button handlers, or links.

- [ ] **Step 4: Implement the visual treatment**

In the CSS module, add:

```css
.marketBoards > article { border-radius: 16px; box-shadow: 0 18px 46px rgba(77, 34, 119, .08); }
.dataListPanel .changeUp { border-radius: 999px; background: #eafaf4; color: #009f72; }
.earningsTimeline li::before { /* connected vertical rail */ }
@media (max-width: 900px) { .marketBoards { grid-template-columns: 1fr; } }
```

Complete the header, row, footer, hover, focus, tablet, mobile, and reduced-motion rules described in the design spec.

- [ ] **Step 5: Verify the focused contract**

Run: `node --test tests/markets-overview-render.test.mjs`

Expected: PASS.

- [ ] **Step 6: Verify rendered behavior**

Capture the board at 1440px, 768px, and 390px. Confirm aligned columns, readable timeline, working filters, and zero horizontal overflow.

- [ ] **Step 7: Verify the toolchain**

Run the complete Node test suite with the dev server active, scoped ESLint, and `npm run build` after stopping the dev server. Restart the development server afterward.

