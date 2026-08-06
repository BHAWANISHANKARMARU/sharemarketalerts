# Mobile and Tablet Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-calibrated 397 × 870 mobile hero with a generated market-momentum image, center the same flat page composition on tablets, and preserve the existing desktop hero exactly.

**Architecture:** Add a dedicated `MobileHero` Server Component and CSS Module beside the existing desktop hero. The desktop `.root` remains active at 901px and above; the mobile root is active at 900px and below, scales from the 397px reference up to a 430px cap, and is centered at tablet widths. The reference phone is presentation context only: the page renders no device frame, buttons, or dynamic island. A new static, project-owned bitmap supplies only the decorative momentum artwork.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4 Server Components, JavaScript, CSS Modules, `next/image`, built-in image generation, Node test runner, headless Chrome, FFmpeg.

## Global Constraints

- Use `/tmp/codex-clipboard-Xeho3T.png` as the 397 × 870 mobile visual reference.
- Use `/tmp/codex-clipboard-XlQ3P8.png` as the generated momentum-artwork style and composition reference.
- Apply the new composition only at viewport widths of 900px and below.
- Cap the phone composition at exactly 430px and center it from 431px through 900px.
- Preserve the existing desktop hero pixels at 901px and above.
- Change no section below the hero.
- Keep all visible text as real HTML and treat the generated market image as decorative.
- Add no dependencies.
- Perform no Git or GitHub operations.

## File structure

- Create `src/app/components/MobileHero.js`: static mobile/tablet Server Component, content constants, semantic cards, and local inline gauge markup.
- Create `src/app/components/MobileHero.module.css`: 397 × 870 flat page coordinate system, cards, breakpoint visibility, and tablet centering.
- Modify `src/app/components/Hero.js`: import and render `MobileHero` beside the unchanged desktop root.
- Modify `src/app/components/Hero.module.css`: hide the existing desktop root at 900px and below.
- Create `public/images/mobile-market-momentum-v1.png`: generated decorative world-map and chart asset.
- Create `tests/mobile-hero-render.test.mjs`: server-rendered content, ordering, structure, image, and feature-strip contract.
- Create `.artifacts/capture-mobile-hero.mjs`: repeatable viewport capture and geometry report.

---

### Task 1: Establish the mobile-hero regression contract

**Files:**
- Create: `tests/mobile-hero-render.test.mjs`
- Inspect: `src/app/components/Hero.js`
- Inspect: `src/app/components/Hero.module.css`

**Interfaces:**
- Consumes: server-rendered homepage HTML from `http://127.0.0.1:3000/`.
- Produces: a failing contract requiring `data-mobile-hero="true"`, the exact mobile content inventory, ordered cards, a dedicated momentum image, and exactly three mobile feature items.

- [x] **Step 1: Record the desktop visual baseline**

Capture the existing hero before production edits:

```bash
google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1920,1080 \
  --screenshot=.artifacts/hero-desktop-before-mobile-work.png \
  http://127.0.0.1:3000/
```

Expected: a 1920 × 1080 baseline image containing the current desktop hero.

- [x] **Step 2: Write the failing rendered-page test**

Create `tests/mobile-hero-render.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

const MOBILE_COPY = [
  "SHAREMARKETALERTS",
  "Free Trial",
  "LIVE",
  "Market Pulse",
  "AI-POWERED MARKET INTELLIGENCE",
  "Intelligence",
  "that moves first.",
  "Real-time AI scans uncover high-probability opportunities before the crowd sees them.",
  "Start Free Trial",
  "See It In Action",
  "Market Momentum",
  "BULLISH",
  "68%",
  "Momentum Score",
  "Breakout Signal",
  "NIFTY 26 JUN 24600 CE",
  "247.85",
  "+18.65%",
  "High Probability",
  "Strength",
  "92%",
  "Top Movers",
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "Risk Level",
  "LOW",
  "Well Balanced",
  "28/100",
  "Risk Score",
  "AI Real-Time Scanning",
  "Never miss a move.",
  "Instant Alerts",
  "Delivered in real-time.",
  "High Accuracy",
  "Backtested & proven.",
];

test("homepage renders the approved mobile and tablet hero contract", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const section = html.match(
    /<section[^>]+data-mobile-hero="true"[\s\S]*?<\/section>/,
  );
  assert.ok(section, "Missing dedicated mobile hero");

  const text = visibleText(section[0]);
  for (const copy of MOBILE_COPY) {
    assert.ok(text.includes(copy), `Missing mobile copy: ${copy}`);
  }

  const momentum = section[0].indexOf('data-mobile-card="momentum"');
  const breakout = section[0].indexOf('data-mobile-card="breakout"');
  const movers = section[0].indexOf('data-mobile-card="movers"');
  const risk = section[0].indexOf('data-mobile-card="risk"');
  assert.ok(
    momentum >= 0 && momentum < breakout && breakout < movers && movers < risk,
    "Mobile cards must follow the approved order",
  );

  assert.ok(
    section[0].includes("mobile-market-momentum-v1"),
    "Mobile hero must use the generated momentum asset",
  );
  assert.equal(
    (section[0].match(/data-mobile-feature="true"/g) ?? []).length,
    3,
  );
});
```

- [x] **Step 3: Run the test and confirm RED**

Run:

```bash
node --test tests/mobile-hero-render.test.mjs
```

Expected: FAIL with `Missing dedicated mobile hero` because `MobileHero` does not exist yet.

---

### Task 2: Generate and persist the mobile momentum asset

**Files:**
- Create: `public/images/mobile-market-momentum-v1.png`
- Reference: `/tmp/codex-clipboard-XlQ3P8.png`

**Interfaces:**
- Consumes: Image #2 as a style and composition reference, not as an edit target.
- Produces: one project-owned decorative PNG imported by `MobileHero.js` as `momentumImage`.

- [x] **Step 1: Generate the landscape bitmap with the built-in image tool**

Use this normalized prompt and include `/tmp/codex-clipboard-XlQ3P8.png` as the reference image:

```text
Use case: productivity-visual
Asset type: mobile financial-dashboard momentum card background
Primary request: create a close visual match to the supplied reference artwork
Input images: Image 1 is the composition, palette, and lighting reference
Scene/backdrop: deep midnight-navy rectangular background
Subject: a wide dotted world map in the upper two-thirds with exactly four bright violet market nodes and concentric radar rings; a luminous jagged violet price line spans the lower third with a subtle violet area fill beneath it
Style/medium: premium high-resolution digital financial data visualization
Composition/framing: landscape, approximately 2.25:1, with important nodes away from the extreme edges so a 330 × 144 card crop preserves them
Lighting/mood: crisp neon-violet glow, restrained bloom, deep contrast
Color palette: navy, indigo, electric violet, white node cores
Constraints: no text, numbers, labels, logos, watermark, UI card border, people, devices, or extra objects
```

- [x] **Step 2: Inspect the generated output**

Verify all of the following before accepting it:

- four visible node cores;
- dotted map reads clearly at card size;
- line chart occupies the lower third;
- no accidental words, labels, logos, or watermark;
- no important content is clipped by a 2.25:1 crop.

If one item fails, make one targeted image-generation iteration changing only that item.

- [x] **Step 3: Save the selected output into the project**

Copy the selected built-in output from the generated-images location to:

```text
public/images/mobile-market-momentum-v1.png
```

Do not overwrite `public/hero-band.png`.

---

### Task 3: Build and wire the static MobileHero component

**Files:**
- Create: `src/app/components/MobileHero.js`
- Create: `src/app/components/MobileHero.module.css`
- Modify: `src/app/components/Hero.js`
- Modify: `src/app/components/Hero.module.css`
- Test: `tests/mobile-hero-render.test.mjs`

**Interfaces:**
- Consumes: `momentumImage` from `public/images/mobile-market-momentum-v1.png` and existing icon exports from `src/app/components/icons.js`.
- Produces: `export default function MobileHero()` with no props and a root `<section data-mobile-hero="true">`.

- [x] **Step 1: Create the content constants and component shell**

In `MobileHero.js`, import `Image` from `next/image`, the CSS Module, the static image, and these existing icons: `ArrowRight`, `BoltIcon`, `LogoMark`, `PlayGlyph`, `ScanIcon`, `ShieldCheck`, and `SignalIcon`.

Define:

```js
const MOBILE_TICKER = [
  ["NIFTY 50", "24,502.15", "+0.73%"],
  ["SENSEX", "80,243.18", "+0.62%"],
  ["NASDAQ", "17,928.14", "+0.38%"],
];

const MOBILE_MOVERS = [
  { symbol: "RELIANCE", price: "2,894.65", change: "+2.34%", colors: ["#1c1b18", "#e8b23a"] },
  { symbol: "TCS", price: "4,124.80", change: "+1.86%", colors: ["#1a70c8", "#e0453c"] },
  { symbol: "HDFCBANK", price: "1,657.40", change: "+1.52%", colors: ["#123a6e", "#e0453c"] },
];

const MOBILE_FEATURES = [
  { title: "AI Real-Time Scanning", body: "Never miss a move.", Icon: ScanIcon },
  { title: "Instant Alerts", body: "Delivered in real-time.", Icon: BoltIcon },
  { title: "High Accuracy", body: "Backtested & proven.", Icon: ShieldCheck },
];
```

Render one flat-page `section` with `aria-labelledby="mobile-hero-title"`, `data-mobile-hero="true"`, navigation, ticker, copy, CTAs, four ordered cards using `data-mobile-card`, and three feature items using `data-mobile-feature="true"`. Do not include any phone shell or device chrome.

- [x] **Step 2: Render the momentum image through Next Image**

Inside the momentum card, use:

```jsx
<Image
  src={momentumImage}
  alt=""
  fill
  sizes="(max-width: 900px) 430px, 1px"
  className={s.momentumImage}
  preload
/>
```

Place the real `Market Momentum`, `BULLISH`, `68%`, and `Momentum Score` HTML above the image with a higher stacking level.

- [x] **Step 3: Wire the new component without restructuring desktop markup**

Add to `Hero.js`:

```js
import MobileHero from "./MobileHero";
```

Change the return value to a fragment containing the current desktop root unchanged and `<MobileHero />` immediately after it:

```jsx
return (
  <>
    <div className={s.root}>
      {/* existing desktop hero markup remains unchanged */}
    </div>
    <MobileHero />
  </>
);
```

In the existing `@media (max-width: 900px)` block in `Hero.module.css`, add `display: none` to `.root`. Keep all desktop selectors outside that media block unchanged.

- [x] **Step 4: Add the minimal responsive visibility CSS**

Start `MobileHero.module.css` with:

```css
.mobileRoot {
  display: none;
}

@media (max-width: 900px) {
  .mobileRoot {
    --m: calc(min(100vw, 430px) / 397);
    display: block;
    position: relative;
    width: 100%;
    height: calc(870 * var(--m));
    overflow: hidden;
    background: #fbfbff;
  }

  .canvas {
    position: relative;
    width: calc(397 * var(--m));
    height: calc(870 * var(--m));
    margin-inline: auto;
    overflow: hidden;
  }
}
```

The complete visual styling is added in Task 4; this step only makes the structure render at the correct breakpoint and scale.

- [x] **Step 5: Run the focused test and confirm GREEN**

Run:

```bash
node --test tests/mobile-hero-render.test.mjs
```

Expected: PASS with all copy, order, image, and feature-count assertions.

---

### Task 4: Reproduce the 397 × 870 reference geometry

**Files:**
- Modify: `src/app/components/MobileHero.module.css`
- Create: `.artifacts/capture-mobile-hero.mjs`

**Interfaces:**
- Consumes: the semantic class names from Task 3 and the scale unit `--m`.
- Produces: a flat mobile composition matching the supplied reference content and a repeatable capture script that reports the canvas bounds.

- [x] **Step 1: Implement the flat page surface**

Use reference coordinates scaled by `--m`, with no phone shell, bezel, dynamic island, or side buttons:

```css
.screen {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #fbfbff;
}
```

The mobile content fills the browser page directly.

- [x] **Step 2: Position the navigation, ticker, and copy**

Match these 397px-reference anchors:

- navigation: screen y 34–89;
- ticker: y 90–129;
- eyebrow: x 43, y 151;
- headline: x 43, y 174, two lines;
- body: x 44, y 265, width 300;
- CTAs: x 44, y 306, height 32.

Use existing font variables, violet `#6818f5`, ink `#080d2b`, and card border `#e6e7f1`. Keep the wordmark, button, and menu on one line at every supported width because the entire canvas scales as a unit.

- [x] **Step 3: Position and style the four cards**

Use these reference rectangles:

| Card | Left | Top | Width | Height |
|---|---:|---:|---:|---:|
| Momentum | 20 | 337 | 357 | 144 |
| Breakout | 20 | 489 | 357 | 80 |
| Top Movers | 20 | 576 | 357 | 91 |
| Risk | 20 | 674 | 357 | 67 |

Apply `calc(<value> * var(--m))` to every coordinate, radius, font size, icon size, and gap. The momentum image fills its card with `object-fit: cover`; real HTML overlays remain above it. White cards use a 1px pale-violet border and restrained shadow.

- [x] **Step 4: Position the three-item feature strip**

Anchor the feature strip at x 17, y 758, width 363, height 63. Use three equal columns, vertical separators, violet icons, centered titles, and centered body copy. Do not render the desktop fourth feature or trust strip.

- [x] **Step 5: Add focus and reduced-motion rules**

Use:

```css
.mobileRoot a:focus-visible {
  outline: calc(2 * var(--m)) solid #8a15ff;
  outline-offset: calc(2 * var(--m));
}

@media (prefers-reduced-motion: reduce) {
  .mobileRoot *,
  .mobileRoot *::before,
  .mobileRoot *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [x] **Step 6: Create the repeatable capture helper**

Create `.artifacts/capture-mobile-hero.mjs` using Chrome DevTools Protocol. It must accept `port`, `width`, `height`, and `output` arguments, navigate to `http://127.0.0.1:3000/`, wait for `document.fonts.ready` and image completion, capture the viewport at device scale 1, and print:

```js
{
  width,
  height,
  output,
  mobileBounds: { x, y, width, height },
  canvasBounds: { x, y, width, height },
}
```

Assert that the mobile root is visible at widths up to 900px and the canvas is exactly 430px wide at 768px and 900px.

---

### Task 5: Pixel-match, responsive verification, and final quality gate

**Files:**
- Modify: `src/app/components/MobileHero.module.css` (pixel-calibration corrections only)
- Create: `.artifacts/mobile-hero-397.png`
- Create: `.artifacts/mobile-hero-reference-compare.jpg`
- Create: `.artifacts/mobile-hero-360.png`
- Create: `.artifacts/mobile-hero-430.png`
- Create: `.artifacts/mobile-hero-768.png`
- Create: `.artifacts/mobile-hero-900.png`
- Create: `.artifacts/hero-desktop-after-mobile-work.png`

**Interfaces:**
- Consumes: the capture helper from Task 4 and the mobile reference.
- Produces: verified mobile/tablet screenshots, a reference comparison, and fresh passing project checks.

- [x] **Step 1: Capture the exact reference viewport**

Run:

```bash
npx -y node@22 .artifacts/capture-mobile-hero.mjs \
  9231 397 870 .artifacts/mobile-hero-397.png
```

Expected: the complete flat mobile composition fills the 397 × 870 capture without horizontal clipping.

- [x] **Step 2: Create and inspect a side-by-side comparison**

Normalize both images to 397 × 870 without cropping, then place the reference on the left and build on the right:

```bash
ffmpeg -y \
  -i /tmp/codex-clipboard-Xeho3T.png \
  -i .artifacts/mobile-hero-397.png \
  -filter_complex "[0:v]scale=397:870:flags=lanczos[r];[1:v]scale=397:870:flags=lanczos[b];[r][b]hstack=inputs=2" \
  .artifacts/mobile-hero-reference-compare.jpg
```

Inspect navigation, ticker, headline wrapping, CTA geometry, image crop, four card rectangles, and feature strip. Treat the reference device outline, dynamic island, buttons, and bezels as excluded presentation context. Change one content mismatch at a time, recapture, and repeat.

- [x] **Step 3: Capture supported mobile and tablet widths**

Run the helper at:

```text
360 × 800
430 × 944
768 × 1024
900 × 1100
```

Save to the filenames listed above. Confirm proportional scaling below 397px and a centered 430px flat composition at 768px and 900px.

- [x] **Step 4: Prove desktop visual isolation**

Capture the 1920 × 1080 hero again as `.artifacts/hero-desktop-after-mobile-work.png`. Compare it with `.artifacts/hero-desktop-before-mobile-work.png` using an FFmpeg difference image or exact pixel comparison. Any desktop difference outside nondeterministic font rasterization must be corrected before continuing.

- [x] **Step 5: Run the full test suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [x] **Step 6: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code 0 with no ESLint errors.

- [x] **Step 7: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0 and the `/` route prerendered successfully. The existing multiple-lockfile workspace-root warning is non-blocking if no new build error appears.

- [x] **Step 8: Complete the acceptance checklist**

Confirm:

- 397 × 870 reference composition matched;
- generated momentum bitmap used and free of text/watermarks;
- flat composition scales correctly at 360px and 430px;
- flat composition is centered and capped at 430px at 768px and 900px;
- desktop hero unchanged at 1920px;
- no lower section changed;
- complete tests, lint, and build pass.
