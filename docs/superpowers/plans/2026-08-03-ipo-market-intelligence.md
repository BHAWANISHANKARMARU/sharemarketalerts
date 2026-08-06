# IPO Market Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build the approved static desktop/laptop IPO Market Intelligence dashboard directly after Hero with reference-level visual fidelity.

**Architecture:** Add one isolated server component and one CSS Module. The component owns static data and small local presentational helpers; page.js only inserts it after Hero. A rendered homepage test protects all visible data and section order, while screenshot passes calibrate the 1136-coordinate CSS canvas.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4 server components, CSS Modules, inline SVG, Node 22 test runner.

## Global Constraints

- Follow docs/superpowers/specs/2026-08-03-ipo-market-intelligence-design.md exactly.
- Read the installed Next.js guides before implementation:
  - node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md
  - node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
  - node_modules/next/dist/docs/01-app/01-getting-started/11-css.md
- Insert after Hero and before HowItWorks.
- Do not edit Hero, HowItWorks, WhatYouReceive, or MarketIntelligence component files.
- Desktop/laptop only; mobile and interactions are deferred.
- All controls are non-focusable visual elements.
- Do not use Git or GitHub commands.
- Use apply_patch for text-file changes.

---

### Task 1: Establish the rendered contract and clean the superseded experiment

**Files:**
- Create: tests/ipo-market-intelligence-render.test.mjs
- Delete: tests/market-intelligence-radar-browser.test.mjs

**Interfaces:**
- Consumes: the homepage served at http://127.0.0.1:3000
- Produces: a failing content/order test that becomes the acceptance gate for IpoMarketIntelligence

- [ ] **Step 1: Remove only the superseded unfinished radar browser test**

Delete tests/market-intelligence-radar-browser.test.mjs with apply_patch. Do not change MarketIntelligence.js or MarketIntelligence.module.css.

- [ ] **Step 2: Add the failing homepage render test**

Create tests/ipo-market-intelligence-render.test.mjs with this structure:

~~~js
import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "LIVE MARKET INTELLIGENCE",
  "IPO Market Intelligence.",
  "Stronger Decisions.",
  "Track live IPOs, GMP trends, subscription insights and market sentiment — everything you need in one intelligent dashboard.",
  "LIVE IPOS", "32", "Active in Market",
  "WITH +VE GMP", "26", "81% of total",
  "AVERAGE GMP", "28.45%", "↑ 4.32% vs last month",
  "MARKET SENTIMENT", "72%", "Bullish",
  "Live IPOs", "All (32)", "Open (12)", "Upcoming (8)", "Closed (12)",
  "Company", "Price Band (₹)", "GMP (₹)", "GMP %", "Subs (x)",
  "Est. Listing Gain (₹)", "Status",
  "HDB Financial Services", "₹700 – ₹740", "₹162", "21.89%", "45.62x", "₹309 (41.76%)",
  "Tata Capital Limited", "₹310 – ₹326", "₹68", "20.86%", "28.34x", "₹128 (39.26%)",
  "LG Electronics India", "₹1,080 – ₹1,140", "₹190", "16.67%", "12.78x", "₹260 (22.81%)",
  "Borana Weaves", "₹205 – ₹216", "₹32", "15.69%", "56.11x", "₹59 (27.31%)",
  "Hyundai Motor India", "₹1,865 – ₹1,960", "₹265", "13.78%", "8.92x", "₹265 (13.78%)",
  "NTPC Green Energy", "₹102 – ₹108", "₹12", "11.11%", "35.21x", "₹12 (11.11%)",
  "Waaree Energies", "₹1,427 – ₹1,503", "₹150", "9.97%", "6.34x", "₹150 (9.97%)",
  "View All IPOs", "GMP Spotlight", "Highest GMP", "GMP Trend (7D)",
  "₹200", "₹120", "₹40", "May 17", "May 20", "May 23",
  "Market Sentiment", "View details", "Neutral", "24%", "Bearish", "18%",
  "Real-Time Updates", "Smart Signals", "Reliable Data", "Instant Alerts", "Market Edge",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

test("homepage renders the full IPO dashboard directly after Hero", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);
  const text = visibleText(await response.text());

  for (const copy of REQUIRED_COPY) {
    assert.ok(text.includes(copy), "Missing: " + copy);
  }

  const hero = text.indexOf("Intelligence that moves first.");
  const ipo = text.indexOf("IPO Market Intelligence.");
  const howItWorks = text.indexOf("How signals become conviction.");
  assert.ok(hero >= 0 && ipo > hero && howItWorks > ipo);
});
~~~

- [ ] **Step 3: Run the new test and verify RED**

Run:

~~~bash
npx -y node@22 --test tests/ipo-market-intelligence-render.test.mjs
~~~

Expected: FAIL with Missing: LIVE MARKET INTELLIGENCE or Missing: IPO Market Intelligence.

---

### Task 2: Build the complete semantic dashboard

**Files:**
- Create: src/app/components/IpoMarketIntelligence.js
- Create: src/app/components/IpoMarketIntelligence.module.css
- Modify: src/app/page.js
- Test: tests/ipo-market-intelligence-render.test.mjs

**Interfaces:**
- Consumes: existing var(--font-sans), homepage section order, static reference data
- Produces: default function IpoMarketIntelligence() with no props and no client boundary

- [ ] **Step 1: Create exact static data**

Define these arrays in IpoMarketIntelligence.js:

~~~js
const KPI_CARDS = [
  { icon: "pulse", label: "LIVE IPOS", value: "32", detail: "Active in Market", tone: "blue" },
  { icon: "trend", label: "WITH +VE GMP", value: "26", detail: "81% of total", tone: "green" },
  { icon: "bars", label: "AVERAGE GMP", value: "28.45%", detail: "↑ 4.32% vs last month", tone: "violet" },
  { icon: "pie", label: "MARKET SENTIMENT", value: "72%", detail: "Bullish", tone: "blue" },
];

const IPO_ROWS = [
  { mark: "HDB", company: "HDB Financial Services", band: "₹700 – ₹740", gmp: "₹162", percent: "21.89%", subs: "45.62x", gain: "₹309 (41.76%)", status: "Upcoming" },
  { mark: "TATA", company: "Tata Capital Limited", band: "₹310 – ₹326", gmp: "₹68", percent: "20.86%", subs: "28.34x", gain: "₹128 (39.26%)", status: "Upcoming" },
  { mark: "LG", company: "LG Electronics India", band: "₹1,080 – ₹1,140", gmp: "₹190", percent: "16.67%", subs: "12.78x", gain: "₹260 (22.81%)", status: "Upcoming" },
  { mark: "BORANA", company: "Borana Weaves", band: "₹205 – ₹216", gmp: "₹32", percent: "15.69%", subs: "56.11x", gain: "₹59 (27.31%)", status: "Upcoming" },
  { mark: "HYUNDAI", company: "Hyundai Motor India", band: "₹1,865 – ₹1,960", gmp: "₹265", percent: "13.78%", subs: "8.92x", gain: "₹265 (13.78%)", status: "Open" },
  { mark: "NTPC", company: "NTPC Green Energy", band: "₹102 – ₹108", gmp: "₹12", percent: "11.11%", subs: "35.21x", gain: "₹12 (11.11%)", status: "Open" },
  { mark: "WAAREE", company: "Waaree Energies", band: "₹1,427 – ₹1,503", gmp: "₹150", percent: "9.97%", subs: "6.34x", gain: "₹150 (9.97%)", status: "Open" },
];
~~~

Define BENEFITS with the five exact title and two-line descriptions from the spec.

- [ ] **Step 2: Implement focused local presentational helpers**

Implement Icon, CompanyMark, KpiCard, UtilitySearch, IpoTable, GmpSpotlight, GmpTrend, MarketSentiment, and BenefitStrip. Use inline SVG for every icon, line chart, and gauge. Use a semantic table with the seven specified columns. Use spans and divs for all static controls.

- [ ] **Step 3: Compose the exported server component**

IpoMarketIntelligence renders:

1. section and 1136-coordinate canvas
2. intro block and utility search
3. KPI grid
4. left table card
5. right rail with three cards
6. five-cell benefit strip

The section heading id is ipo-market-intelligence-title.

- [ ] **Step 4: Add the reference-coordinate CSS Module**

Start with:

~~~css
.section {
  --ipo-u: calc(min(100vw, 1920px) / 1136);
  width: 100%;
  height: calc(786 * var(--ipo-u));
  max-height: 1328.45px;
  overflow: hidden;
  background: #fff;
  color: #0b0d2c;
  font-family: var(--font-sans), system-ui, sans-serif;
}

.canvas {
  position: relative;
  width: min(100%, 1920px);
  height: 100%;
  margin: 0 auto;
}
~~~

Use absolute positioning only at the major region level. Use grid and flex inside cards and table areas. Preserve these reference regions:

- intro x16 y54 width420
- utility search x823 y16 width239
- KPI grid x471 y71 width649 height108
- table card x0 y201 width806 height465
- right rail x823 y201 width297 height557
- benefit strip x0 y678 width806 height80

- [ ] **Step 5: Insert after Hero**

Update page.js:

~~~js
import IpoMarketIntelligence from "./components/IpoMarketIntelligence";
~~~

Render IpoMarketIntelligence immediately after Hero and before HowItWorks.

- [ ] **Step 6: Run the rendered test and verify GREEN**

Run:

~~~bash
npx -y node@22 --test tests/ipo-market-intelligence-render.test.mjs
~~~

Expected: 1 test passing, 0 failing.

---

### Task 3: Pixel-calibrate against the reference

**Files:**
- Modify: src/app/components/IpoMarketIntelligence.module.css
- Modify only if necessary for exact structure: src/app/components/IpoMarketIntelligence.js
- Create local artifacts under: .artifacts/

**Interfaces:**
- Consumes: live homepage at localhost:3000 and /tmp/codex-clipboard-HYqtrU.png
- Produces: visually calibrated desktop section at 1136px, 1366px, and 1920px

- [ ] **Step 1: Capture the 1136px reference-width page**

Use local headless Chrome with device scale 1 and a tall enough viewport to include Hero and the new section. Crop the new section beginning at the measured Hero height.

- [ ] **Step 2: Build a side-by-side comparison**

Use ffmpeg to scale the reference and rendered crop to equal 1136 × 786 panels, then hstack them into .artifacts/ipo-reference-vs-build.jpg.

- [ ] **Step 3: Correct visible mismatches one category at a time**

Calibrate in this order:

1. section boundary and macro columns
2. intro and KPI positions
3. table header, rows, and highlighted GMP column
4. right-rail card sizing
5. trend line and sentiment gauge geometry
6. typography, borders, shadows, icon sizing, and color

After each CSS change, recapture and compare. Do not modify existing section CSS.

- [ ] **Step 4: Verify desktop scaling**

Capture at 1366px and 1920px. Combine scaled section crops into .artifacts/ipo-desktop-widths.jpg and inspect for clipping, drift, and overflow.

---

### Task 4: Final verification and handoff

**Files:**
- Verify all files from Tasks 1–3

**Interfaces:**
- Consumes: completed component, tests, visual artifacts
- Produces: evidence-backed completion report

- [ ] **Step 1: Run all rendered tests**

~~~bash
npx -y node@22 --test tests/how-it-works-render.test.mjs tests/what-you-receive-render.test.mjs tests/market-intelligence-render.test.mjs tests/ipo-market-intelligence-render.test.mjs
~~~

- [ ] **Step 2: Run lint**

~~~bash
npm run lint
~~~

- [ ] **Step 3: Run the production build**

~~~bash
npm run build
~~~

- [ ] **Step 4: Prove preservation**

Hash Hero.js, Hero.module.css, HowItWorks.js, HowItWorks.module.css, WhatYouReceive.js, WhatYouReceive.module.css, MarketIntelligence.js, and MarketIntelligence.module.css and compare with their pre-task hashes.

- [ ] **Step 5: Request independent read-only review**

The review checks exact spec coverage, semantic table structure, server-component compatibility, static-control semantics, visual scaling risks, and test quality. Do not use Git during review.

- [ ] **Step 6: Re-run affected verification after any review fixes**

Only report completion after the final rendered tests, lint, build, hashes, and desktop screenshots all pass.
