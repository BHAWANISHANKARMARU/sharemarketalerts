# How It Works Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. The user explicitly prohibited Git/GitHub operations, so all Git commit steps are omitted.

**Goal:** Add a native Next.js laptop/desktop section directly below the existing hero that reproduces the supplied 994 × 553 “How signals become conviction.” reference exactly while leaving the hero untouched.

**Architecture:** Implement a static React Server Component with semantic JSX, local data constants for repeated cards, inline SVG for exact icons/charts/connectors, and a colocated CSS Module using a 994 × 553 reference coordinate system. Wire it into the App Router homepage after `Hero`, then validate text, build output, hero isolation, and visual fidelity with desktop screenshots and overlays.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4 Server Components, JavaScript, CSS Modules, inline SVG, Node 22 test runner, headless Chrome, FFmpeg.

## Global Constraints

- Do not run Git or GitHub write operations.
- Do not edit `src/app/components/Hero.js` or `src/app/components/Hero.module.css`.
- Do not edit or replace the hero artwork or any existing hero copy.
- Render the new section immediately after `<Hero />` at `/`.
- Implement the reference natively; do not display the reference screenshot as page content.
- Preserve the 994 × 553 reference geometry and approximately 1.797:1 aspect ratio on laptop and desktop.
- Do not invent mobile reflow behavior; mobile is deferred.
- Reuse `--font-sans`, `--font-serif`, and the existing violet/navy theme.
- Read the installed Next.js 16 App Router, Server Component, and CSS Module guides before implementation.

## File Map

- Create `src/app/components/HowItWorks.js`: semantic section markup, reference copy, repeated card data, and inline SVG artwork.
- Create `src/app/components/HowItWorks.module.css`: section-local coordinate system, card styling, typography, glows, and scaling.
- Modify `src/app/page.js`: import and render `HowItWorks` after `Hero`.
- Create `tests/how-it-works-render.test.mjs`: rendered-page contract tests for exact copy and section order.
- Create `.artifacts/how-it-works-before.png`, `.artifacts/how-it-works-pass-*.png`, and comparison images during verification only.

---

### Task 1: Lock the rendered copy and isolation contract

**Files:**

- Create: `tests/how-it-works-render.test.mjs`
- Inspect only: `src/app/page.js`
- Inspect only: `src/app/components/Hero.js`
- Inspect only: `src/app/components/Hero.module.css`

**Interfaces:**

- Consumes: the approved strings and immutable hero boundary from the design spec.
- Produces: a Node integration test that fails until the running Next.js page renders the complete section below the hero.

- [ ] **Step 1: Record immutable hero hashes**

Run:

```bash
sha256sum src/app/components/Hero.js src/app/components/Hero.module.css
```

Expected: two hashes saved in the work log and reused in Task 5 to prove the hero did not change.

- [ ] **Step 2: Start the unmodified Next.js development server**

Run:

```bash
npm run dev
```

Expected: the existing page is available at `http://127.0.0.1:3000` before any production change.

- [ ] **Step 3: Write the failing rendered-page test**

Create `tests/how-it-works-render.test.mjs` with Node's built-in test runner. It must fetch the real Next.js page, reduce the returned HTML to normalized visible text, assert the complete visible copy inventory, and assert the new section's eyebrow occurs after the hero trust-strip copy.

Core test shape:

```js
import assert from "node:assert/strict";
import test from "node:test";

function toVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

const copy = [
  "HOW IT WORKS",
  "How signals become conviction.",
  "We combine real-time market data, advanced AI, and risk-aware validation",
  "to surface high-probability opportunities you can act on with confidence.",
  "MARKET INPUTS",
  "Always on. Always learning.",
  "Price Action",
  "Real-time charts, patterns",
  "and momentum shifts",
  "Volume & Flow",
  "Smart money activity",
  "and volume anomalies",
  "Sector Moves",
  "Relative strength across",
  "sectors and industries",
  "Macro & News",
  "Economic indicators",
  "and event-driven signals",
  "AI DECISION ENGINE",
  "Analyze. Validate. Prioritize.",
  "PROBABILITY",
  "24/7 AI models",
  "ensemble scoring",
  "TREND STRENGTH",
  "Momentum & regime",
  "confirmation",
  "RISK CALIBRATION",
  "Volatility, liquidity &",
  "drawdown control",
  "ShareMarketAlerts",
  "Intelligence Core",
  "Backtested. Stress Tested. Continuously Learning.",
  "Every signal is tested across thousands of market scenarios.",
  "ACTIONABLE OUTCOME",
  "Clarity you can act on.",
  "AI SIGNAL ALERT",
  "High Conviction",
  "NIFTY 26 JUN 24600 CE",
  "247.85",
  "+18.65%",
  "2m ago",
  "Breakout",
  "High Probability",
  "CONFIDENCE SCORE",
  "Model agreement",
  "across 247+ signals",
  "87%",
  "OPPORTUNITY QUALITY",
  "Risk-adjusted edge",
  "vs. market baseline",
  "WHAT YOU RECEIVE",
  "Clear setups, levels,",
  "timing & risk guidance",
  "Entry",
  "Target",
  "SL",
  "R:R",
  "Speed to Edge",
  "From market signal to alert",
  "in under 1 second.",
  "Precision First",
  "High-probability only.",
  "No noise. No guesswork.",
  "Risk Aware",
  "Every signal is scored,",
  "sized, and stress-tested.",
  "Always Improving",
  "Models adapt in real-time",
  "as markets evolve.",
];

test("the homepage renders the complete How It Works section below the hero", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);
  const visible = toVisibleText(await response.text());
  for (const text of copy) assert.ok(visible.includes(text), `Missing: ${text}`);
  assert.ok(
    visible.indexOf("HOW IT WORKS") >
      visible.indexOf("TRUSTED BY TRADERS ACROSS THE GLOBE"),
    "How It Works must render below the complete hero",
  );
});
```

- [ ] **Step 4: Run the test and verify the expected failure**

Run:

```bash
npx -y node@22 --test tests/how-it-works-render.test.mjs
```

Expected: failure with `Missing: HOW IT WORKS` because the running homepage does not render the new section.

---

### Task 2: Build the static Next.js section markup and SVG artwork

**Files:**

- Create: `src/app/components/HowItWorks.js`

**Interfaces:**

- Consumes: `--font-sans`, `--font-serif`, and existing global brand tokens; no props and no browser APIs.
- Produces: `export default function HowItWorks()` returning one `<section aria-labelledby="how-it-works-title">`.

- [ ] **Step 1: Define exact repeated content constants**

Create `MARKET_INPUTS` and `VALUE_PROPS` arrays in the exact reference order. Each object includes exact title and line strings plus a stable `kind` used to select its inline SVG.

```js
const MARKET_INPUTS = [
  { kind: "price", title: "Price Action", lines: ["Real-time charts, patterns", "and momentum shifts"] },
  { kind: "volume", title: "Volume & Flow", lines: ["Smart money activity", "and volume anomalies"] },
  { kind: "sector", title: "Sector Moves", lines: ["Relative strength across", "sectors and industries"] },
  { kind: "macro", title: "Macro & News", lines: ["Economic indicators", "and event-driven signals"] },
];

const VALUE_PROPS = [
  { kind: "speed", title: "Speed to Edge", lines: ["From market signal to alert", "in under 1 second."] },
  { kind: "precision", title: "Precision First", lines: ["High-probability only.", "No noise. No guesswork."] },
  { kind: "risk", title: "Risk Aware", lines: ["Every signal is scored,", "sized, and stress-tested."] },
  { kind: "improve", title: "Always Improving", lines: ["Models adapt in real-time", "as markets evolve."] },
];
```

- [ ] **Step 2: Add focused SVG primitives**

Implement `InputIcon`, `InputVisual`, `ConnectorMap`, `CoreMark`, `OutcomeChart`, `ScoreRing`, `Stars`, `DeliveryIcons`, and `ValueIcon`. Every component accepts only `kind` or `className`, uses `viewBox`, and applies `aria-hidden="true"` because adjacent text provides meaning. Use SVG strokes with rounded caps and joins to match the soft reference artwork.

- [ ] **Step 3: Build the semantic three-column composition**

Return this stable hierarchy so CSS can position each unit precisely:

```jsx
<section className={s.section} aria-labelledby="how-it-works-title">
  <div className={s.canvas}>
    <header className={s.header}>...</header>
    <ConnectorMap className={s.connectors} />
    <div className={s.inputs}>...</div>
    <div className={s.engine}>...</div>
    <div className={s.outcomes}>...</div>
    <div className={s.values}>...</div>
  </div>
</section>
```

The heading uses real text with `<em>conviction.</em>`. The core, rings, three analysis nodes, validation strip, alert card, score card, quality card, delivery card, and four bottom values are separate elements so each can be aligned independently.

- [ ] **Step 4: Run the source-contract test**

Run:

```bash
npx -y node@22 --test tests/how-it-works-render.test.mjs
```

Expected: the render test still fails because `page.js` is not wired yet.

---

### Task 3: Reproduce the reference geometry and visual system

**Files:**

- Create: `src/app/components/HowItWorks.module.css`

**Interfaces:**

- Consumes: class names from `HowItWorks.js` and global theme/font variables.
- Produces: a laptop/desktop-only scaled canvas matching the 994 × 553 reference.

- [ ] **Step 1: Establish the reference coordinate system**

Use a local unit and aspect-ratio canvas:

```css
.section {
  --how-u: calc(min(100vw, 1920px) / 994);
  width: 100%;
  max-width: 1920px;
  margin-inline: auto;
  overflow: hidden;
  background: #f9f9ff;
}

.canvas {
  position: relative;
  width: 100%;
  height: calc(553 * var(--how-u));
  min-width: calc(994 * var(--how-u));
  background:
    radial-gradient(circle at 50% 56%, rgba(114, 55, 255, 0.09), transparent 29%),
    #fbfbff;
}
```

All reference lengths use `calc(<reference-pixel> * var(--how-u))`. Do not use hero class names or hero variables.

- [ ] **Step 2: Place header and column headings**

Match the reference: eyebrow near y=35, headline near y=54, supporting copy near y=98; left and right labels near y=126; engine label near y=143. Use Playfair Display for the headline and Figtree elsewhere. Match reference weights, line heights, letter spacing, navy text, violet accent, and muted blue-gray support copy.

- [ ] **Step 3: Style the market input cards and connectors**

Place four cards from approximately x=81–285 and y=162–428 with matching 58–60px heights, 9–10px radii, faint border, and soft shadow. Align circular icons, copy, mini charts, heatmap, and macro badge. Position the connector SVG behind all cards and use pale lavender 1px paths with 3px violet node dots.

- [ ] **Step 4: Style the decision engine**

Place the engine around x=356–619 and y=170–411. Reproduce concentric rings, radial glow, four cardinal nodes, central dark core, luminous triangular mark, three surrounding analysis nodes, and the validation strip. Layering order is connector map, engine glow, rings, nodes, labels, then core.

- [ ] **Step 5: Style the outcome stack and bottom values**

Place the dark alert card around x=688–910 and y=162–265 and the three white cards beneath it. Match its navy gradient, violet chart, divider, metadata dots, confidence ring, four-filled/one-outline stars, and delivery icons. Place the four bottom value props at y≈480 with matching icon sizes and evenly distributed spacing.

- [ ] **Step 6: Run lint after JSX and CSS creation**

Run:

```bash
npm run lint
```

Expected: exit code 0 with no missing CSS Module exports, invalid JSX, or accessibility warnings.

---

### Task 4: Wire the section below the immutable hero

**Files:**

- Modify: `src/app/page.js`
- Test: `tests/how-it-works-render.test.mjs`

**Interfaces:**

- Consumes: default exports `Hero` and `HowItWorks`.
- Produces: the `/` page with `Hero` first and `HowItWorks` second.

- [ ] **Step 1: Update the App Router page**

Use a fragment so the existing hero component call is unchanged:

```jsx
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
    </>
  );
}
```

- [ ] **Step 2: Run the rendered-page test**

Run:

```bash
npx -y node@22 --test tests/how-it-works-render.test.mjs
```

Expected: all tests pass.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: successful Next.js 16 production compilation and static generation of `/`.

---

### Task 5: Prove hero isolation and iterate to a desktop pixel match

**Files:**

- Inspect: `src/app/components/Hero.js`
- Inspect: `src/app/components/Hero.module.css`
- Generate locally: `.artifacts/how-it-works-994.png`
- Generate locally: `.artifacts/how-it-works-1366.png`
- Generate locally: `.artifacts/how-it-works-1920.png`
- Generate locally: `.artifacts/how-it-works-compare.jpg`

**Interfaces:**

- Consumes: running application at `http://127.0.0.1:3000` and `/tmp/codex-clipboard-sP64Ss.png` reference.
- Produces: verified laptop/desktop screenshots and unchanged hero hashes.

- [ ] **Step 1: Start the existing development server**

Run:

```bash
npm run dev
```

Expected: Next.js reports a ready local server at `http://localhost:3000`.

- [ ] **Step 2: Capture the exact reference-width page and crop the new section**

At width 994, the current hero scales to approximately 559px high and the new section to 553px. Capture the full 1112px page, then crop the section:

```bash
/usr/bin/google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=994,1112 --screenshot=.artifacts/page-994.png http://127.0.0.1:3000
ffmpeg -y -i .artifacts/page-994.png -vf "crop=994:553:0:559" -frames:v 1 .artifacts/how-it-works-994.png
```

Expected: the crop contains only the new section and matches the 994 × 553 reference composition.

- [ ] **Step 3: Build a side-by-side comparison**

Run:

```bash
ffmpeg -y -i /tmp/codex-clipboard-sP64Ss.png -i .artifacts/how-it-works-994.png -filter_complex "[0:v][1:v]hstack=inputs=2" -frames:v 1 .artifacts/how-it-works-compare.jpg
```

Inspect at original resolution. Compare exact text, title wrapping, card bounds, connector bends and nodes, engine ring diameters, core position, all charts/icons, colors, shadows, and bottom-row alignment.

- [ ] **Step 4: Iterate until no visible mismatch remains**

For each observed mismatch, change only `HowItWorks.js` or `HowItWorks.module.css`, rerun lint, recapture, and compare again. Never adjust Hero files to compensate for section positioning.

- [ ] **Step 5: Capture common laptop and desktop widths**

Capture 1366px and 1920px widths with enough height to include the section. Verify proportional scaling without clipping, horizontal scroll, or gaps between the hero and new section.

- [ ] **Step 6: Recheck immutable hero hashes**

Run:

```bash
sha256sum src/app/components/Hero.js src/app/components/Hero.module.css
```

Expected: hashes are identical to Task 1.

- [ ] **Step 7: Run final verification**

Run:

```bash
npx -y node@22 --test tests/how-it-works-render.test.mjs
npm run lint
npm run build
```

Expected: the rendered-page integration test passes, ESLint exits 0, and the Next.js production build succeeds.
