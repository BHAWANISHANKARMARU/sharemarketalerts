# Growth CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox ('- [ ]') syntax for tracking.

**Goal:** Build the approved 1404 × 843 growth CTA reference as a semantic, pixel-matched Next.js section directly after Pricing.

**Architecture:** Add one Server Component with a co-located CSS Module and dependency-free inline SVG artwork. Extend the existing root template so GrowthCta renders immediately after Pricing, then verify the result with a server-render contract and real browser captures.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4, CSS Modules, inline SVG, Node test runner, Chrome DevTools Protocol.

## Global Constraints

- Desktop and laptop presentation only for this pass.
- The email field and CTA button are visual-only.
- Replace the reference name SearchVector with ShareMarketAlerts.
- Keep all existing sections unchanged.
- Add no external dependencies.
- Perform no Git operations.

---

### Task 1: Define the CTA render contract

**Files:**
- Create: 'tests/growth-cta-render.test.mjs'

**Interfaces:**
- Consumes: the homepage at 'http://127.0.0.1:3000/'.
- Produces: assertions for 'section#growth-cta[data-section="growth-cta"]', required copy, four assurance items, six trust wordmarks, and placement after Pricing.

- [ ] **Step 1: Write the failing test**

~~~js
import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "READY TO GROW?",
  "Stop guessing. Start growing.",
  "Join thousands of marketers and businesses who use ShareMarketAlerts to get more visibility, traffic, and real results.",
  "Data-Backed Insights",
  "Make Smarter Decisions",
  "Proven SEO Strategies",
  "That Drive Results",
  "Unmatched Support",
  "We're with you all the way",
  "REAL DATA",
  "100%",
  "REAL RESULTS",
  "START YOUR JOURNEY TODAY",
  "Get Started in 60 Seconds",
  "No Credit Card Required",
  "7-Day Free Trial",
  "Cancel Anytime",
  "Setup in 1 Minute",
  "Start My Free Trial",
  "Trusted by 2,500+ businesses worldwide",
  "Trusted by industry leaders",
  "Powering growth for 2,500+ companies",
  "Razorpay",
  "CRED",
  "lenskart",
  "zomato",
  "upstox",
  "ZERODHA",
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

test("Growth CTA renders directly after Pricing with the approved content", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const match = html.match(
    /<section[^>]*data-section="growth-cta"[\s\S]*?<\/section>/,
  );
  assert.ok(match, "Growth CTA section is missing");
  assert.match(match[0], /id="growth-cta"/);
  assert.match(match[0], /aria-labelledby="growth-cta-title"/);

  const text = visibleText(match[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(text.includes(copy), "Missing from Growth CTA: " + copy);
  }

  assert.equal(match[0].match(/data-assurance=/g)?.length ?? 0, 4);
  assert.equal(match[0].match(/data-trust-brand=/g)?.length ?? 0, 6);
  assert.ok(
    html.indexOf('data-section="growth-cta"') >
      html.indexOf('data-section="pricing"'),
    "Growth CTA must render after Pricing",
  );
});
~~~

- [ ] **Step 2: Run the test and verify RED**

Run: 'node --test tests/growth-cta-render.test.mjs'

Expected: one failing test with 'Growth CTA section is missing'.

---

### Task 2: Build and place the semantic CTA component

**Files:**
- Create: 'src/app/components/GrowthCta.js'
- Create: 'src/app/components/GrowthCta.module.css'
- Modify: 'src/app/template.js'

**Interfaces:**
- Consumes: existing '--font-sans' and the current root Template children.
- Produces: default export 'GrowthCta()' rendering 'section#growth-cta[data-section="growth-cta"]'.

- [ ] **Step 1: Define exact content collections**

~~~js
const benefits = [
  { icon: "trend", title: "Data-Backed Insights", copy: "Make Smarter Decisions" },
  { icon: "shield", title: "Proven SEO Strategies", copy: "That Drive Results" },
  { icon: "rocket", title: "Unmatched Support", copy: "We're with you all the way" },
];

const assurances = [
  "No Credit Card Required",
  "7-Day Free Trial",
  "Cancel Anytime",
  "Setup in 1 Minute",
];

const trustBrands = ["Razorpay", "CRED", "lenskart", "zomato", "upstox", "ZERODHA"];
~~~

- [ ] **Step 2: Implement the section hierarchy**

Use a labelled section containing:

~~~jsx
<section
  id="growth-cta"
  data-section="growth-cta"
  aria-labelledby="growth-cta-title"
>
  <header>
    <p>READY TO GROW?</p>
    <h2 id="growth-cta-title">
      <span>Stop guessing.</span>
      <strong>Start growing.</strong>
    </h2>
    <p>
      Join thousands of marketers and businesses who use ShareMarketAlerts
      <br />
      to get more visibility, traffic, and real results.
    </p>
  </header>
  <ul aria-label="Growth advantages">
    {benefits.map((benefit) => (
      <li key={benefit.title}>
        <Icon name={benefit.icon} />
        <strong>{benefit.title}</strong>
        <span>{benefit.copy}</span>
      </li>
    ))}
  </ul>
  <div aria-label="100 percent real data and real results">REAL DATA 100% REAL RESULTS</div>
  <div>
    <div>START YOUR JOURNEY TODAY</div>
    <h3>Get Started in <strong>60</strong> Seconds</h3>
    <ul>
      {assurances.map((assurance) => (
        <li key={assurance} data-assurance={assurance}>
          <Icon name="check" />
          <span>{assurance}</span>
        </li>
      ))}
    </ul>
    <form>
      <label htmlFor="growth-work-email">Work email</label>
      <input id="growth-work-email" readOnly placeholder="Enter your work email" />
      <button type="button">Start My Free Trial</button>
    </form>
  </div>
  <div>
    <p>Trusted by industry leaders</p>
    <p>Powering growth for 2,500+ companies</p>
    <ul>
      {trustBrands.map((brand) => (
        <li key={brand} data-trust-brand={brand}>{brand}</li>
      ))}
    </ul>
  </div>
</section>
~~~

Mark each assurance item with 'data-assurance' and each wordmark item with 'data-trust-brand'.

- [ ] **Step 3: Add inline SVG artwork**

Implement one 'Icon({ name })' switch covering lightning, trend, shield, rocket, check, sparkle, arrow, headline underline, sixty underline, and trust shield. Every SVG uses 'aria-hidden="true"' and 'focusable="false"'.

- [ ] **Step 4: Place GrowthCta after Pricing**

~~~jsx
import Pricing from "./components/Pricing";
import GrowthCta from "./components/GrowthCta";

export default function Template({ children }) {
  return (
    <>
      {children}
      <Pricing />
      <GrowthCta />
    </>
  );
}
~~~

- [ ] **Step 5: Run the contract test and verify GREEN**

Run: 'node --test tests/growth-cta-render.test.mjs'

Expected: one passing test.

---

### Task 3: Match the 1404px reference and laptop scaling

**Files:**
- Modify: 'src/app/components/GrowthCta.module.css'
- Create: '.artifacts/capture-growth-cta.mjs'

**Interfaces:**
- Consumes: the '#growth-cta' element and local Chrome CDP endpoint on port 9231.
- Produces: '.artifacts/growth-cta-1404.png', '.artifacts/growth-cta-1024.png', and '.artifacts/growth-cta-compare.jpg'.

- [ ] **Step 1: Establish reference-scaled geometry**

~~~css
.section {
  --gc-u: calc(min(100vw, 1920px) / 1404);
  width: 100%;
  height: calc(843 * var(--gc-u));
  overflow: hidden;
  color: #080411;
  background: #fdfdff;
  font-family: var(--font-sans), Arial, sans-serif;
}

.canvas {
  position: relative;
  width: min(100%, 1920px);
  height: 100%;
  margin: 0 auto;
}
~~~

Position the eyebrow at reference y=63, the two-line headline at y=112, supporting copy at y=322, benefit row at y=394, dark panel at x=118/y=475/w=1160/h=245, and trust rail at x=119/y=744/w=1157/h=89. All reference measurements use 'calc(<pixel> * var(--gc-u))'.

- [ ] **Step 2: Implement the decorative background and seal**

Use CSS pseudo-elements with repeated rounded borders to create the faint left and right contour arcs. Style the result seal as a rotated circular badge with double violet rings, curved-equivalent top/bottom labels, center '100%', and small diamond separators.

- [ ] **Step 3: Implement the dark panel**

Use a near-black gradient, 15px reference radius, thin violet edge, violet bottom glow, three-column internal layout, one vertical divider, dark email input, full violet button, and overlapping circular avatar chips.

- [ ] **Step 4: Implement the trust rail**

Use a pale bordered rail with a violet shield badge, two-line trust copy, and six evenly distributed monochrome wordmarks. Render the wordmarks as typographic/SVG marks so they remain crisp.

- [ ] **Step 5: Add the capture helper**

Copy the existing CDP capture structure, target '#growth-cta', wait for 'document.fonts.ready', scroll the section to the viewport start, read its bounding box, and capture exactly that rectangle.

- [ ] **Step 6: Capture and tune at the reference width**

Run: 'npx -y node@22 .artifacts/capture-growth-cta.mjs 9231 1404 .artifacts/growth-cta-1404.png'

Create the comparison with:

'ffmpeg -y -i /tmp/codex-clipboard-PPG6dp.png -i .artifacts/growth-cta-1404.png -filter_complex hstack=inputs=2 -q:v 5 .artifacts/growth-cta-compare.jpg'

Inspect the comparison and tune only GrowthCta files until headline scale, benefit row, seal, dark panel, form, trust bar, and decorative arcs align closely.

- [ ] **Step 7: Capture the laptop width**

Run: 'npx -y node@22 .artifacts/capture-growth-cta.mjs 9231 1024 .artifacts/growth-cta-1024.png'

Expected: a complete proportional section with no clipping or horizontal overflow.

---

### Task 4: Verify the complete application

**Files:**
- Verify: 'tests/growth-cta-render.test.mjs'
- Verify: 'src/app/components/GrowthCta.js'
- Verify: 'src/app/components/GrowthCta.module.css'
- Verify: 'src/app/template.js'

**Interfaces:**
- Consumes: the completed implementation.
- Produces: fresh test, lint, build, and visual evidence.

- [ ] **Step 1: Run all render tests**

Run: 'node --test tests/*.test.mjs'

Expected: every test passes.

- [ ] **Step 2: Run ESLint**

Run: 'npm run lint'

Expected: exit code 0 with no lint errors.

- [ ] **Step 3: Run the production build**

Run: 'npm run build'

Expected: exit code 0 and a successfully prerendered root route.

- [ ] **Step 4: Inspect final evidence**

Read the final 1404px comparison and 1024px capture. Confirm complete content, correct section order, no collisions, no clipping, and no overflow.
