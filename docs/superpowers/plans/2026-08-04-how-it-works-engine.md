# How It Works Decision Circle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make only the circular AI Decision Engine artwork match the compact supplied target while preserving every surrounding How It Works element.

**Architecture:** Wrap the existing orbit, Probability/Trend/Risk nodes, and Intelligence Core in one isolated `decisionCircle` coordinate system. Give that wrapper a dedicated viewport-capped scale while leaving the engine heading, connector SVG, validation strip, cards, and value strip outside and unchanged.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, JavaScript, CSS Modules, Node test runner, Chrome DevTools Protocol, FFmpeg visual comparison.

## Global Constraints

- Modify only the concentric rings, four orbit dots, three analysis nodes, Intelligence Core, and their glow/shadow treatment.
- Do not change the section heading, introduction, connector map, validation strip, market-input cards, actionable-outcome cards, bottom value strip, copy, colours, or semantics.
- The only permitted non-circle correction is widening the AI Decision Engine heading block and moving the heading, circle, and validation strip together so both heading lines remain single-line, fully outside the orbit, and clearly separated from the introduction.
- Keep all existing visible text verbatim.
- Preserve desktop and laptop behavior; mobile remains outside this pass.
- Add no dependencies and perform no Git operations.

---

### Task 1: Add the decision-circle regression boundary

**Files:**
- Modify: `tests/how-it-works-render.test.mjs`

**Interfaces:**
- Consumes: server-rendered HTML from `http://127.0.0.1:3000/`.
- Produces: a structural contract proving the circular artwork has one isolated `data-decision-circle="true"` wrapper while the engine heading and validation strip remain outside it.

- [x] **Step 1: Add the failing structural assertion**

After the existing copy and placement checks, isolate the labelled How It Works section and assert:

```js
const section = html.match(
  /<section[^>]+aria-labelledby="how-it-works-title"[\s\S]*?<\/section>/,
);
assert.ok(section, "Missing labelled How It Works section");

const circleStart = section[0].indexOf('data-decision-circle="true"');
const validationStart = section[0].indexOf(
  "Backtested. Stress Tested. Continuously Learning.",
  circleStart,
);
assert.ok(circleStart >= 0, "Missing isolated AI decision circle");
assert.ok(validationStart > circleStart, "Validation strip must follow the decision circle");
const circleHtml = section[0].slice(circleStart, validationStart);

for (const text of ["PROBABILITY", "TREND STRENGTH", "RISK CALIBRATION", "ShareMarketAlerts", "Intelligence Core"]) {
  assert.ok(toVisibleText(circleHtml).includes(text), "Decision circle is missing: " + text);
}
assert.ok(!toVisibleText(circleHtml).includes("AI DECISION ENGINE"));
assert.ok(!toVisibleText(circleHtml).includes("Backtested. Stress Tested. Continuously Learning."));
```

Store the original response body in `html` before calling `toVisibleText(html)` so both the structural and visible-text assertions exercise the real rendered page.

- [x] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/how-it-works-render.test.mjs`

Expected: FAIL with `Missing isolated AI decision circle`, because the current siblings are not grouped.

---

### Task 2: Isolate the circular artwork

**Files:**
- Modify: `src/app/components/HowItWorks.js`
- Test: `tests/how-it-works-render.test.mjs`

**Interfaces:**
- Consumes: existing `AnalysisNode`, `BrainIcon`, `PulseIcon`, `ShieldIcon`, and `CoreMark` helpers.
- Produces: `<div className={s.decisionCircle} data-decision-circle="true">` containing only orbit artwork, three analysis nodes, and the core.

- [x] **Step 1: Wrap only the approved circular elements**

Keep the engine heading before the wrapper and validation strip after it:

```jsx
<div className={s.engine}>
  <div className={`${s.columnHeading} ${s.engineHeading}`}>...</div>

  <div className={s.decisionCircle} data-decision-circle="true">
    <div className={s.orbit} aria-hidden="true">...</div>
    <AnalysisNode className={s.probability} ... />
    <AnalysisNode className={s.trend} ... />
    <AnalysisNode className={s.riskCalibration} ... />
    <div className={s.core}>...</div>
  </div>

  <div className={s.validation}>...</div>
</div>
```

Do not edit `ConnectorMap`, `.engineHeading`, `.validation`, any market-input markup, any outcome markup, or any value-strip markup.

- [x] **Step 2: Run the focused test and confirm GREEN**

Run: `node --test tests/how-it-works-render.test.mjs`

Expected: PASS with all current content checks and the new wrapper boundary.

---

### Task 3: Match the compact circular composition

**Files:**
- Modify: `src/app/components/HowItWorks.module.css`
- Test: `tests/how-it-works-render.test.mjs`

**Interfaces:**
- Consumes: `decisionCircle` markup from Task 2 and the existing section unit `--how-u`.
- Produces: a centered circular coordinate system with a dedicated `--circle-u` that tracks 94% of the viewport scale and caps at 1805px, matching 94% of the section’s 1920px maximum.

- [x] **Step 1: Establish the isolated circle coordinate system**

```css
.decisionCircle {
  --circle-u: calc(min(94vw, 1805px) / 994);
  position: absolute;
  z-index: 2;
  left: 49.1%;
  top: calc(159 * var(--how-u));
  width: calc(264 * var(--circle-u));
  height: calc(264 * var(--circle-u));
  transform: translateX(-50%);
}
```

This yields an approximately 446px outer orbit at the supplied 1787px comparison width and approximately 340px at 1366px, matching the target after normalizing both screenshots to their white-content widths.

- [x] **Step 2: Convert orbit geometry from canvas coordinates to circle-local coordinates**

```css
.orbit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ringOne { width: 100%; height: 100%; }
.ringTwo { width: calc(244 * var(--circle-u)); height: calc(244 * var(--circle-u)); }
.ringThree { width: calc(196 * var(--circle-u)); height: calc(196 * var(--circle-u)); }
```

Update ring borders, glow, and dots to use `--circle-u`. Keep thin pale-violet rings; place dots at top-center, right-center, bottom-center, and left-center.

- [x] **Step 3: Convert the three nodes and core to local coordinates**

Use these target coordinates within the 264-unit circle:

- Probability: `left: 96`, `top: 18`, `width: 72`.
- Trend Strength: `left: 22`, `top: 156`, `width: 82`.
- Risk Calibration: `left: 164`, `top: 156`, `width: 82`.
- Intelligence Core: `left: 90`, `top: 90`, `width: 88`, `height: 88`.

Change only the circular descendants from `--how-u` to `--circle-u`: `.orbitGlow`, `.ring`, `.orbitDot`, `.analysisNode`, `.analysisIcon`, `.probability`, `.trend`, `.riskCalibration`, `.core`, `.coreMark`, and their descendant typography/icons. Tighten the core halo and shadow to the target while retaining the existing violet and navy palette.

- [x] **Step 4: Verify the focused contract and lint**

Run: `node --test tests/how-it-works-render.test.mjs && npm run lint`

Expected: both commands PASS.

---

### Task 4: Visual tuning and full verification

**Files:**
- Create: `.artifacts/how-it-works-circle-1920.png`
- Create: `.artifacts/how-it-works-circle-1366.png`
- Create: `.artifacts/how-it-works-circle-laptop.png`
- Create: `.artifacts/how-it-works-circle-compare.jpg`
- Modify if required: `src/app/components/HowItWorks.module.css`

**Interfaces:**
- Consumes: the running homepage and supplied target `/tmp/codex-clipboard-QLGOg5.png`.
- Produces: three responsive captures and a focused side-by-side comparison of the decision circle.

- [x] **Step 1: Capture the How It Works section at 1920px**

Use the Chrome DevTools endpoint on port `9231` to capture the labelled How It Works section. Crop the central engine region without resampling the pixels and save the full section as `.artifacts/how-it-works-circle-1920.png`.

- [x] **Step 2: Build and inspect the focused comparison**

Place `/tmp/codex-clipboard-QLGOg5.png` and the focused 1920px center crop side by side in `.artifacts/how-it-works-circle-compare.jpg`. Compare outer-ring diameter, core diameter, three node positions, icon sizes, label spacing, ring opacity, and glow strength. Adjust only circular-artwork selectors and repeat until they match closely.

- [x] **Step 3: Capture 1366px and laptop widths**

Save full-section captures at 1366px and 1024px. Confirm the circle remains centered and compact and that no heading, connector, validation, card, or value-strip geometry changed.

- [x] **Step 4: Run final verification**

Run:

```bash
node --test tests/*.test.mjs
npm run lint
npm run build
```

Expected: all tests, ESLint, and the production build PASS. Review all three captures before reporting completion.

---

### Task 5: Correct the introduction-to-engine spacing

**Files:**
- Modify: `src/app/components/HowItWorks.module.css`
- Modify: `.artifacts/capture-how-it-works-circle.mjs`

- [x] **Step 1: Reproduce the spacing mismatch**

Measure the rendered blocks at 1920px. Confirm the introduction-to-engine gap is only 4.27px and add a viewport-scaled assertion requiring at least 28px at the 1920px reference width.

- [x] **Step 2: Move the center stack as one unit**

Move `.engineHeading`, `.decisionCircle`, and `.validation` down by the same 14 section units. This adds the missing separation without changing the heading-to-circle or circle-to-validation relationships.

- [x] **Step 3: Re-capture desktop and laptop layouts**

Capture at 1920px, 1366px, and 1024px. Confirm the 1920px introduction-to-engine gap is at least 28px, the subtitle remains outside the orbit, and no center-stack elements overlap.

- [x] **Step 4: Run final verification**

Run all Node tests, ESLint, and the production build after the spacing correction.
