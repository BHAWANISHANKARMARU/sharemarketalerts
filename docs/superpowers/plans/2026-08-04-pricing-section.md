# Pricing Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-matched desktop/laptop pricing section from the supplied 1287 × 860 reference and render it immediately after Testimonials.

**Architecture:** Add one semantic Next.js Server Component with co-located CSS Module styling and dependency-free inline SVG icons. The section uses a 1287px reference coordinate system expressed through one responsive CSS unit so its geometry scales proportionally across laptop and desktop widths.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4, CSS Modules, Node test runner, inline SVG.

## Global Constraints

- Desktop and laptop presentation only for this pass.
- The billing selector is visual-only, with Yearly selected and `-20% OFF` visible.
- CTA controls are visual-only and do not navigate or submit.
- Reproduce all visible copy, prices, features, badges, and benefits from the reference verbatim.
- Insert the section after Testimonials and do not alter existing section implementations.
- Use no external dependencies and no raster screenshot as the implementation.
- Perform no Git operations.

## File Structure

- Create `src/app/components/Pricing.js`: pricing data, semantic section markup, and inline SVG icon renderer.
- Create `src/app/components/Pricing.module.css`: isolated pixel-matched desktop/laptop layout and styling.
- Modify `src/app/page.js`: import and render `Pricing` after `Testimonials`.
- Create `tests/pricing-render.test.mjs`: server-rendered content, structure, accessibility, and placement assertions.
- Create `.artifacts/capture-pricing.mjs`: local visual capture helper for the `#pricing` section.

---

### Task 1: Define the pricing contract with a failing render test

**Files:**
- Create: `tests/pricing-render.test.mjs`

**Interfaces:**
- Consumes: the development page at `http://127.0.0.1:3000/`.
- Produces: a test contract for `section[data-section="pricing"]`, `#pricing-title`, three named plan articles, the billing control, and the benefits list.

- [ ] **Step 1: Write the failing render test**

```js
import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "PLANS THAT GROW WITH YOU",
  "Simple pricing. Serious results.",
  "Choose the plan that fits your goals. Upgrade, pause or cancel anytime.",
  "Save up to 20%",
  "Monthly",
  "Yearly",
  "-20% OFF",
  "14-Day Money Back Guarantee",
  "STARTER",
  "Launch Smart",
  "₹2,499 /month",
  "GROWTH",
  "Grow Faster",
  "₹6,999 /month",
  "ENTERPRISE",
  "Dominate Market",
  "₹14,999 /month",
  "Unlimited Growth",
  "Enterprise Security",
  "Blazing Fast Platform",
  "Human Support",
  "Results That Matter",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

test("Pricing renders after Testimonials with the approved plans and benefits", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sectionMatch = html.match(
    /<section[^>]*data-section="pricing"[\s\S]*?<\/section>/,
  );
  assert.ok(sectionMatch, "Pricing section is missing");
  assert.match(sectionMatch[0], /id="pricing"/);
  assert.match(sectionMatch[0], /aria-labelledby="pricing-title"/);

  const sectionText = visibleText(sectionMatch[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(sectionText.includes(copy), `Missing from Pricing: ${copy}`);
  }

  assert.equal(sectionMatch[0].match(/<article\b/g)?.length ?? 0, 3);
  assert.match(sectionMatch[0], /aria-label="Billing period"/);
  assert.match(sectionMatch[0], /aria-pressed="true"/);
  assert.match(sectionMatch[0], /aria-label="Plan benefits"/);

  assert.ok(
    html.indexOf('data-section="pricing"') >
      html.indexOf('data-section="testimonials"'),
    "Pricing must render after Testimonials",
  );
});
```

- [ ] **Step 2: Run the pricing test to verify RED**

Run: `node --test tests/pricing-render.test.mjs`

Expected: FAIL with `Pricing section is missing` because the component is not implemented.

---

### Task 2: Implement the semantic pricing component and page placement

**Files:**
- Create: `src/app/components/Pricing.js`
- Create: `src/app/components/Pricing.module.css`
- Modify: `src/app/page.js`

**Interfaces:**
- Consumes: `styles` exported by `Pricing.module.css` and the existing `--font-sans`/`--font-serif` variables.
- Produces: default export `Pricing()` rendering `section#pricing[data-section="pricing"]`.

- [ ] **Step 1: Add data-driven plan and benefits markup**

Create `Pricing.js` with immutable plan arrays containing these exact values:

```js
const plans = [
  {
    key: "starter",
    label: "STARTER",
    title: "Launch Smart",
    price: "₹2,499",
    description: <>Everything you need to get started<br />with SEO the right way.</>,
    features: ["Track 500 Keywords", "1 Project", "Daily Rank Tracking", "AI-Powered Insights", "Email Support"],
    cta: "Start Your Journey",
  },
  {
    key: "growth",
    label: "GROWTH",
    title: "Grow Faster",
    price: "₹6,999",
    description: <>Advanced tools to scale your visibility<br />and beat the competition.</>,
    features: ["Track 5,000 Keywords", "10 Projects", "Hourly Rank Tracking", "Competitor Intelligence", "AI Content & Gap Analyzer", "Priority Support"],
    cta: "Start 7-Day Free Trial",
    popular: true,
  },
  {
    key: "enterprise",
    label: "ENTERPRISE",
    title: "Dominate Market",
    price: "₹14,999",
    description: <>For large teams and agencies that<br />need more power and control.</>,
    features: ["Track 50,000+ Keywords", "Unlimited Projects", "Real-time Rank Tracking", "Advanced AI Suite", "White-label Reports", "Dedicated Account Manager", "24/7 Priority Support"],
    cta: "Talk to Sales",
  },
];
```

Render:

```jsx
<section id="pricing" data-section="pricing" aria-labelledby="pricing-title">
  <header>
    <p>PLANS THAT GROW WITH YOU</p>
    <h2 id="pricing-title"><span>Simple pricing.</span> <em>Serious results.</em></h2>
    <p>Choose the plan that fits your goals. Upgrade, pause or cancel anytime.</p>
  </header>
  <div aria-label="Billing period">
    <button type="button" aria-pressed="false">Monthly</button>
    <button type="button" aria-pressed="true">Yearly</button>
  </div>
  <aside aria-label="Money back guarantee">…</aside>
  <div>{plans.map((plan) => <article key={plan.key}>…</article>)}</div>
  <ul aria-label="Plan benefits">…</ul>
</section>
```

Use inline SVG components for the spark, rocket, trend, crown, check-circle, infinity, shield, lightning, headphones, bars, and arrow shapes. Mark decorative SVGs `aria-hidden="true"` and `focusable="false"`.

- [ ] **Step 2: Add reference-scaled CSS geometry**

Create `Pricing.module.css` around this sizing foundation:

```css
.section {
  --pr-u: calc(min(100vw, 1920px) / 1287);
  width: 100%;
  height: calc(860 * var(--pr-u));
  overflow: hidden;
  color: #09051f;
  background: #fdfdff;
  font-family: var(--font-sans), Arial, sans-serif;
}

.canvas {
  position: relative;
  width: min(100%, 1920px);
  height: 100%;
  margin: 0 auto;
  background:
    radial-gradient(circle at 50% 38%, rgba(122, 0, 255, .035), transparent 36%),
    #fdfdff;
}
```

Place the header at the top center, the billing controls at approximately reference y=177, the guarantee rail at x=80/y=242, cards at y=242 with widths matching the reference, and the benefits rail at y=720. Use proportional `calc(<reference-pixel> * var(--pr-u))` values for positions, sizes, gaps, radii, borders, shadows, and type.

Give the Growth card the visible `MOST POPULAR` ribbon, `2px`-equivalent dark border, low soft shadow, filled purple CTA, and centered no-credit-card note. Give Starter and Enterprise light borders and outlined CTAs.

- [ ] **Step 3: Insert Pricing after Testimonials**

Modify `src/app/page.js`:

```js
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";

// …
<Testimonials />
<Pricing />
```

- [ ] **Step 4: Run the pricing test to verify GREEN**

Run: `node --test tests/pricing-render.test.mjs`

Expected: PASS with one passing test.

---

### Task 3: Pixel-match through real browser captures

**Files:**
- Create: `.artifacts/capture-pricing.mjs`
- Modify: `src/app/components/Pricing.module.css`

**Interfaces:**
- Consumes: Chrome DevTools endpoint `http://127.0.0.1:9231/json/new?http://127.0.0.1:3000/` and `#pricing`.
- Produces: `.artifacts/pricing-reference-width.png`, `.artifacts/pricing-laptop.png`, and final comparison evidence.

- [ ] **Step 1: Add a pricing capture helper**

Create a CDP helper that opens the page, waits for `document.fonts.ready`, locates `#pricing`, scrolls it into view, and captures that element at 1287 × 900 and 1024 × 900 viewports as PNG files.

- [ ] **Step 2: Capture at the reference width**

Run: `node .artifacts/capture-pricing.mjs 1287 .artifacts/pricing-reference-width.png`

Expected: a 1287px-wide image showing the complete pricing section with no clipping.

- [ ] **Step 3: Compare and tune**

Inspect the captured image beside `/tmp/codex-clipboard-47WiT2.png`. Adjust only `Pricing.module.css` until the heading baseline, toggle, card tops/bottoms, guarantee rail, plan content, CTAs, and benefit rail align closely with the reference.

- [ ] **Step 4: Capture the laptop width**

Run: `node .artifacts/capture-pricing.mjs 1024 .artifacts/pricing-laptop.png`

Expected: the same proportional composition scaled to 1024px without horizontal overflow or cropped content.

---

### Task 4: Final verification

**Files:**
- Verify: `tests/pricing-render.test.mjs`
- Verify: `src/app/components/Pricing.js`
- Verify: `src/app/components/Pricing.module.css`
- Verify: `src/app/page.js`

**Interfaces:**
- Consumes: completed pricing implementation.
- Produces: test, lint, build, and screenshot evidence suitable for completion reporting.

- [ ] **Step 1: Run the entire test suite**

Run: `node --test tests/*.test.mjs`

Expected: every test passes, including pricing placement after Testimonials.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: exit code 0 and a successful Next.js production build.

- [ ] **Step 4: Inspect final images**

Open `.artifacts/pricing-reference-width.png` and `.artifacts/pricing-laptop.png` and verify no overflow, clipping, text collisions, or missing reference content.

