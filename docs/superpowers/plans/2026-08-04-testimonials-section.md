# Testimonials Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pixel-matched desktop testimonial section directly after Market Coverage using the approved local artwork without cropping or degrading it.

**Architecture:** Create one static Server Component and one colocated CSS Module, then register the component in the App Router home page. The component renders sharp semantic heading/statistic copy in HTML and layers five approved transparent PNG assets at reference-derived coordinates.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4 Server Components, `next/image`, CSS Modules, Node test runner, headless Chrome.

## Global Constraints

- Work only in `/home/gaurav/Downloads/sharemarketalerts`.
- Read the installed Next.js 16.2.12 guides for App Router pages, Server Components, CSS Modules, and images before production code.
- Render `Testimonials` immediately after `MarketCoverage`; do not modify `Hero` or any existing section.
- Target laptop and desktop in this pass; preserve the reference's 1383 × 797 composition through proportional scaling.
- Preserve every selected PNG's intrinsic aspect ratio and alpha channel; do not crop, stretch, blur, or replace the supplied assets.
- Keep the component static and server-rendered; do not add `"use client"`, animation, dependencies, or interactions.
- Perform no Git operations.

---

## File map

- Create `src/app/components/Testimonials.js`: semantic section, image layers, SVG metric icons, and statistic content.
- Create `src/app/components/Testimonials.module.css`: reference coordinate system, typography, layer positions, and bottom rail.
- Create `tests/testimonials-render.test.mjs`: rendered-page contract for placement, copy, images, and accessible structure.
- Modify `src/app/page.js`: import and render `Testimonials` after `MarketCoverage`.

### Task 1: Establish the rendered testimonial contract

**Files:**
- Create: `tests/testimonials-render.test.mjs`
- Read: `tests/market-coverage-render.test.mjs`

**Interfaces:**
- Consumes: the live home page at `http://127.0.0.1:3000/`.
- Produces: a failing integration test that requires a `data-section="testimonials"` section immediately after Market Coverage.

- [ ] **Step 1: Start or confirm the development server**

Run:

```bash
npm run dev
```

Expected: Next.js reports the home page ready on port 3000. If an existing server already owns the port, confirm `curl -I http://127.0.0.1:3000/` returns HTTP 200 and reuse it.

- [ ] **Step 2: Write the failing rendered-page test**

The production break this test catches is removing, reordering, or incompletely rendering the approved testimonial section. Create:

```js
import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "TESTIMONIALS",
  "Why serious traders stay with ShareMarketAlerts.",
  "Traders rely on us for IPO GMP clarity, real-time alerts, and the confidence to act before the market moves.",
  "4.9/5",
  "average rating",
  "25,000+",
  "active traders",
  "1.2M+",
  "alerts delivered",
  "92%",
  "users continue trading with us",
];

const REQUIRED_IMAGES = [
  "ChatGPT Image Aug 4, 2026, 12_48_36 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_48_25 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_48_53 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_48_09 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_47_43 AM.png",
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

test("Testimonials renders after Market Coverage with the approved content and artwork", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sectionMatch = html.match(
    /<section[^>]*data-section="testimonials"[\s\S]*?<\/section>/,
  );
  assert.ok(sectionMatch, "Testimonials section is missing");
  assert.match(sectionMatch[0], /id="testimonials"/);
  assert.match(sectionMatch[0], /aria-labelledby="testimonials-title"/);

  const sectionText = visibleText(sectionMatch[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(sectionText.includes(copy), `Missing from Testimonials: ${copy}`);
  }

  const decodedSection = decodeURIComponent(sectionMatch[0]);
  for (const filename of REQUIRED_IMAGES) {
    assert.ok(
      decodedSection.includes(`/images/${filename}`),
      `Missing testimonial artwork: ${filename}`,
    );
  }

  const metrics = sectionMatch[0].match(
    /<ul[^>]*aria-label="Trader trust statistics"[\s\S]*?<\/ul>/,
  );
  assert.ok(metrics, "Trader trust statistics must be a named list");
  assert.equal(metrics[0].match(/<li\b/g)?.length ?? 0, 4);

  assert.ok(
    html.indexOf('data-section="testimonials"') >
      html.indexOf('data-section="market-coverage"'),
    "Testimonials must render after Market Coverage",
  );
});
```

- [ ] **Step 3: Run the test and verify the correct RED failure**

Run:

```bash
node --test tests/testimonials-render.test.mjs
```

Expected: FAIL only with `Testimonials section is missing`. A connection error is not the required RED state; restore the development server and rerun.

### Task 2: Implement the semantic component and page placement

**Files:**
- Create: `src/app/components/Testimonials.js`
- Modify: `src/app/page.js`
- Test: `tests/testimonials-render.test.mjs`

**Interfaces:**
- Consumes: five PNG URLs under `/images/` and CSS classes exported by `Testimonials.module.css`.
- Produces: default export `Testimonials()`, a static Server Component with `id="testimonials"`.

- [ ] **Step 1: Create the component markup**

Create `src/app/components/Testimonials.js` with the following structure and exact content:

```jsx
import Image from "next/image";
import styles from "./Testimonials.module.css";

const metrics = [
  { icon: "star", value: "4.9/5", label: <>average rating</> },
  { icon: "people", value: "25,000+", label: <>active traders</> },
  { icon: "bell", value: "1.2M+", label: <>alerts delivered</> },
  {
    icon: "repeat",
    value: "92%",
    label: (
      <>
        users continue
        <br />
        trading with us
      </>
    ),
  },
];

function MetricIcon({ name }) {
  if (name === "star") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="m16 3.6 3.8 7.7 8.5 1.2-6.1 6 1.4 8.4-7.6-4-7.6 4 1.4-8.4-6.1-6 8.5-1.2L16 3.6Z" />
      </svg>
    );
  }

  if (name === "people") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="12" cy="10.5" r="4" />
        <circle cx="22.5" cy="12" r="3.2" />
        <path d="M4.5 26v-2.2c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6V26H4.5Zm15-7.7c.9-.6 2-.9 3.2-.9 3.3 0 5.9 2.6 5.9 5.9V26h-5.7" />
      </svg>
    );
  }

  if (name === "bell") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M7.2 23.4h17.6l-2.3-3.1V14a6.5 6.5 0 0 0-13 0v6.3l-2.3 3.1Z" />
        <path d="M13.2 26.2a3 3 0 0 0 5.6 0M16 4.4V2.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M25.7 11.2A10.4 10.4 0 0 0 7.2 8.8L5 11.1" />
      <path d="M5.1 5.8v5.5h5.5M6.3 20.8a10.4 10.4 0 0 0 18.5 2.4l2.2-2.3" />
      <path d="M26.9 26.2v-5.5h-5.5" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className={styles.section}
      data-section="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className={styles.canvas}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>TESTIMONIALS</p>
          <h2 id="testimonials-title">
            <span>Why serious traders</span>
            <em>stay with ShareMarketAlerts.</em>
          </h2>
          <p className={styles.intro}>
            Traders rely on us for IPO GMP clarity, real-time alerts,
            <br />
            and the confidence to act before the market moves.
          </p>
        </header>

        <div className={styles.artwork}>
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_09 AM.png"
            alt=""
            width={1024}
            height={1536}
            className={styles.arch}
            aria-hidden="true"
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_47_43 AM.png"
            alt=""
            width={1536}
            height={1024}
            className={styles.platform}
            aria-hidden="true"
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_36 AM.png"
            alt="Rohit Mehta says ShareMarketAlerts makes IPO GMP easy to understand and helps him catch strong listing gains."
            width={1536}
            height={1024}
            className={styles.rohitCard}
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_25 AM.png"
            alt="Anjali Desai says the real-time alerts are incredibly fast and accurate."
            width={1024}
            height={1536}
            className={styles.anjaliCard}
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_53 AM.png"
            alt="Testimonials from Karan Malhotra and Vivek Narayan about accurate GMP updates and reliable IPO research."
            width={1024}
            height={1536}
            className={styles.noteCards}
            unoptimized
          />
        </div>

        <ul className={styles.metrics} aria-label="Trader trust statistics">
          {metrics.map((metric) => (
            <li key={metric.value}>
              <span className={styles.metricIcon}>
                <MetricIcon name={metric.icon} />
              </span>
              <span className={styles.metricCopy}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Register the section directly after Market Coverage**

Modify `src/app/page.js`:

```jsx
import MarketCoverage from "./components/MarketCoverage";
import Testimonials from "./components/Testimonials";

// existing imports remain unchanged

export default function Home() {
  return (
    <>
      {/* existing sections remain unchanged */}
      <MarketCoverage />
      <Testimonials />
    </>
  );
}
```

Do not reorder or edit the existing component calls.

### Task 3: Reproduce the 1383 × 797 desktop composition

**Files:**
- Create: `src/app/components/Testimonials.module.css`
- Test: `tests/testimonials-render.test.mjs`

**Interfaces:**
- Consumes: class names used by `Testimonials.js`.
- Produces: proportional desktop/laptop rendering based on the reference coordinate unit `--tm-u`.

- [ ] **Step 1: Add the reference coordinate system and typography**

Create `src/app/components/Testimonials.module.css` with these baseline rules:

```css
.section {
  --tm-u: calc(min(100vw, 1920px) / 1383);
  width: 100%;
  height: calc(770 * var(--tm-u));
  max-height: 1068.69px;
  overflow: hidden;
  background: #fbfbff;
  color: #0c062c;
  font-family: var(--font-sans), Arial, sans-serif;
}

.canvas {
  position: relative;
  width: min(100%, 1920px);
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background:
    radial-gradient(circle at 48% 40%, rgba(153, 49, 244, .045), transparent 34%),
    linear-gradient(180deg, #fdfdff 0%, #fbfbff 100%);
}

.header {
  position: absolute;
  z-index: 8;
  top: calc(28 * var(--tm-u));
  left: 50%;
  width: calc(1020 * var(--tm-u));
  transform: translateX(-50%);
  text-align: center;
}

.eyebrow {
  color: #8a16f2;
  font-size: calc(13 * var(--tm-u));
  font-weight: 800;
  line-height: 1;
  letter-spacing: calc(5.7 * var(--tm-u));
}

.header h2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: calc(9 * var(--tm-u));
  font-family: var(--font-serif), Georgia, serif;
  font-size: calc(57 * var(--tm-u));
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: calc(-1.6 * var(--tm-u));
}

.header h2 span,
.header h2 em {
  display: block;
  white-space: nowrap;
}

.header h2 em {
  color: #8613ec;
  font-style: italic;
  font-weight: 520;
}

.intro {
  margin-top: calc(12 * var(--tm-u));
  color: #54536a;
  font-size: calc(18.5 * var(--tm-u));
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: calc(-.15 * var(--tm-u));
}
```

- [ ] **Step 2: Add the supplied artwork layers without cropping**

Continue the CSS module:

```css
.artwork {
  position: absolute;
  inset: 0;
}

.artwork img {
  position: absolute;
  display: block;
  height: auto;
  object-fit: contain;
}

.arch {
  z-index: 1;
  top: calc(10 * var(--tm-u));
  left: calc(1022 * var(--tm-u));
  width: calc(390 * var(--tm-u));
}

.platform {
  z-index: 2;
  top: calc(407 * var(--tm-u));
  left: calc(752 * var(--tm-u));
  width: calc(650 * var(--tm-u));
}

.rohitCard {
  z-index: 4;
  top: calc(174 * var(--tm-u));
  left: calc(0 * var(--tm-u));
  width: calc(608 * var(--tm-u));
}

.anjaliCard {
  z-index: 5;
  top: calc(199 * var(--tm-u));
  left: calc(560 * var(--tm-u));
  width: calc(278 * var(--tm-u));
}

.noteCards {
  z-index: 6;
  top: calc(151 * var(--tm-u));
  left: calc(805 * var(--tm-u));
  width: calc(500 * var(--tm-u));
}
```

These are the first-pass reference-derived coordinates. Keep `height: auto` and `object-fit: contain`; visual calibration may adjust only top/left/width, never the intrinsic ratio or crop.

- [ ] **Step 3: Add the bottom statistics rail**

Continue the CSS module:

```css
.metrics {
  position: absolute;
  z-index: 9;
  right: calc(66 * var(--tm-u));
  bottom: calc(14 * var(--tm-u));
  left: calc(66 * var(--tm-u));
  height: calc(91 * var(--tm-u));
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
  border: calc(.8 * var(--tm-u)) solid rgba(225, 221, 235, .88);
  border-radius: calc(18 * var(--tm-u));
  background: rgba(255, 255, 255, .93);
  box-shadow:
    0 calc(7 * var(--tm-u)) calc(15 * var(--tm-u)) rgba(45, 25, 94, .12),
    inset 0 calc(1 * var(--tm-u)) 0 rgba(255, 255, 255, .9);
}

.metrics li {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(23 * var(--tm-u));
}

.metrics li:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  width: calc(1 * var(--tm-u));
  height: calc(58 * var(--tm-u));
  transform: translateY(-50%);
  background: #dedce7;
}

.metricIcon {
  width: calc(59 * var(--tm-u));
  height: calc(59 * var(--tm-u));
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 50%;
  background: #f5efff;
}

.metricIcon svg {
  width: calc(32 * var(--tm-u));
  height: calc(32 * var(--tm-u));
  fill: none;
  stroke: #8429ef;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.metricCopy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.metricCopy strong {
  font-family: var(--font-serif), Georgia, serif;
  font-size: calc(30 * var(--tm-u));
  font-weight: 600;
  line-height: .95;
  letter-spacing: calc(-.6 * var(--tm-u));
  white-space: nowrap;
}

.metricCopy > span {
  margin-top: calc(7 * var(--tm-u));
  color: #565469;
  font-size: calc(13.5 * var(--tm-u));
  font-weight: 500;
  line-height: 1.12;
  white-space: nowrap;
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/testimonials-render.test.mjs
```

Expected: 1 test, 1 pass, 0 failures.

### Task 4: Pixel-match the rendered section

**Files:**
- Modify: `src/app/components/Testimonials.module.css`
- Reference: `/tmp/codex-clipboard-HtTyb1.png`
- Output: `.artifacts/testimonials-desktop-1383.png`

**Interfaces:**
- Consumes: the live `#testimonials` element and the 1383 × 797 reference.
- Produces: a section screenshot whose layout, layer order, copy, and artwork bounds match the reference.

- [ ] **Step 1: Capture the complete section at the reference width**

Launch headless Chrome at `1383 × 900`, navigate to `http://127.0.0.1:3000/`, disable cache, wait for `document.fonts.ready` and all `#testimonials img` elements to report `complete`, scroll `#testimonials` into view, and capture its exact bounding box to `.artifacts/testimonials-desktop-1383.png`.

Expected section bounds at 1383 px viewport width: width `1383`, height approximately `770`.

- [ ] **Step 2: Compare against the reference in a side-by-side image**

Create a visual comparison:

```bash
ffmpeg -y \
  -i /tmp/codex-clipboard-HtTyb1.png \
  -i .artifacts/testimonials-desktop-1383.png \
  -filter_complex "[0:v]pad=1383:797:0:0:white[r];[1:v]pad=1383:797:0:0:white[b];[r][b]hstack=inputs=2" \
  -frames:v 1 .artifacts/testimonials-reference-vs-build.jpg
```

Inspect the comparison at original detail.

- [ ] **Step 3: Calibrate only measurable CSS values**

Iterate capture and comparison until all checks pass:

- Eyebrow baseline, letter spacing, headline line breaks, and subtitle occupy the same bounds.
- Rohit artwork spans the left third and does not collide with the center card.
- Anjali card is narrow, vertical, centered, and its portrait ends above the rail.
- Right note cards retain their supplied torn-paper edges and sit above both the arch and platform.
- The arch reaches the upper-right edge and the platform remains visible beneath the paper cards.
- Bottom rail has four equal groups, three dividers, matching icon circles, and the same vertical position.
- No supplied image is clipped by its own element box, stretched, or rendered above its intrinsic resolution.

After each CSS adjustment rerun:

```bash
node --test tests/testimonials-render.test.mjs
```

### Task 5: Full verification

**Files:**
- Verify: `src/app/components/Testimonials.js`
- Verify: `src/app/components/Testimonials.module.css`
- Verify: `src/app/page.js`
- Verify: `tests/testimonials-render.test.mjs`

**Interfaces:**
- Consumes: completed implementation.
- Produces: fresh evidence that the new section works and existing sections remain valid.

- [ ] **Step 1: Run all rendered-section tests**

Run each existing test against the active local server:

```bash
node --test tests/*.test.mjs
```

Expected: all test files pass with 0 failures.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: exit 0 with no ESLint errors.

- [ ] **Step 3: Run the production build**

```bash
npm run build
```

Expected: Next.js compiles, type-checks, and statically generates `/` successfully.

- [ ] **Step 4: Capture laptop evidence**

Repeat the section-only screenshot at a 1024 px viewport. Confirm proportional scaling, no horizontal overflow, no text/artwork collision, and no crop. Mobile restructuring is explicitly outside this pass.

- [ ] **Step 5: Report the exact deliverables**

Report the new component, CSS module, page placement, focused/full test counts, lint/build results, and link the final 1383 px and 1024 px screenshots. Do not claim completion unless all evidence is fresh.
