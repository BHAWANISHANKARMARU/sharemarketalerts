# Market Command Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium, responsive Market Close Command Center footer after the existing Growth CTA.

**Architecture:** Build one semantic React Server Component with local content arrays and inline SVG/CSS artwork, style it through a colocated CSS Module, and mount it last in the existing root `template.js`. Keep the alert control visual-only so the footer ships no client-side JavaScript.

**Tech Stack:** Next.js 16.2 App Router, React 19 Server Components, JavaScript, CSS Modules, Node test runner, Chrome DevTools Protocol.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-05-market-command-footer-design.md` verbatim.
- Read the installed Next.js guides before editing: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`, and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/template.md`.
- Keep `Footer.js` a Server Component; do not add `"use client"`, state, event handlers, or browser APIs.
- Use only existing Figtree, Playfair Display, CSS Modules, and inline SVG. Add no package or external asset.
- Use exact approved footer copy and preserve all existing sections.
- Desktop, tablet, and mobile are in scope at 1920px, 1366px, 768px, and 390px.
- The email control is visual-only: `input` is `readOnly` and the button is `type="button"`.
- Every available homepage destination uses a real section anchor; unavailable Company/legal destinations render as `aria-disabled="true"` text, never `href="#"`.
- Perform no Git operations.

## File map

- Create `src/app/components/Footer.js`: semantic content, navigation data, inline SVG icons, trust items, signup control, and legal content.
- Create `src/app/components/Footer.module.css`: complete desktop/tablet/mobile visual system and accessibility states.
- Modify `src/app/template.js`: import and render `Footer` after `GrowthCta`.
- Modify `src/app/components/HowItWorks.js`: add `id="how-it-works"` for footer navigation.
- Modify `src/app/components/MarketIntelligence.js`: add `id="market-intelligence"` for footer navigation.
- Create `tests/footer-render.test.mjs`: server-rendered order, copy, structure, anchors, and non-submitting control contract.
- Create `.artifacts/assert-footer-layout.mjs`: real-browser responsive layout, stacking, target-size, and overflow contract.
- Create `.artifacts/footer-1920.png`, `.artifacts/footer-1366.png`, `.artifacts/footer-768.png`, and `.artifacts/footer-390.png`: visual verification captures.

---

### Task 1: Add the footer render contract

**Files:**
- Create: `tests/footer-render.test.mjs`

**Interfaces:**
- Consumes: server-rendered homepage HTML from `http://127.0.0.1:3000/`.
- Produces: a failing contract for `<footer data-section="site-footer">`, exact content, section order, navigation groups, trust items, and the visual-only alert control.

- [x] **Step 1: Write the failing render test**

Create `tests/footer-render.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "MARKETS SCANNING 24/7",
  "150+ exchanges",
  "120K+ instruments",
  "Signals updated in real time",
  "SHAREMARKETALERTS",
  "See the signal. Move before the market.",
  "AI-powered market intelligence, IPO GMP clarity, and risk-aware alerts—built for confident decisions.",
  "Platform",
  "Market Intelligence",
  "AI Signals",
  "How It Works",
  "Pricing",
  "Markets",
  "IPO GMP Tracker",
  "Stocks",
  "Indices",
  "Global Markets",
  "Resources",
  "Performance",
  "Trader Stories",
  "Market Coverage",
  "Support",
  "Company",
  "About",
  "Contact",
  "Privacy",
  "Terms",
  "The market won’t wait.",
  "Get high-conviction alerts and IPO updates delivered before the crowd moves.",
  "Get Market Alerts",
  "No spam. Unsubscribe anytime.",
  "Real-time scanning",
  "Markets monitored continuously",
  "Risk-aware intelligence",
  "Every signal is calibrated",
  "Built for clarity",
  "Actionable levels, not noise",
  "Market data and alerts are provided for informational purposes only and do not constitute investment advice. Trading and investing involve risk.",
  "© 2026 ShareMarketAlerts. All rights reserved.",
  "Privacy Policy",
  "Terms of Use",
  "Risk Disclosure",
  "Made for traders who move with conviction.",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&apos;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

test("Market Command footer renders last with approved content and semantics", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const match = html.match(
    /<footer[^>]*data-section="site-footer"[\s\S]*?<\/footer>/,
  );
  assert.ok(match, "Market Command footer is missing");
  assert.match(match[0], /id="site-footer"/);
  assert.match(match[0], /aria-labelledby="site-footer-title"/);

  const text = visibleText(match[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(text.includes(copy), "Missing from footer: " + copy);
  }

  assert.equal(match[0].match(/data-footer-nav-group=/g)?.length ?? 0, 4);
  assert.equal(match[0].match(/data-footer-trust=/g)?.length ?? 0, 3);
  assert.match(match[0], /aria-label="Footer navigation"/);
  assert.match(match[0], /type="email"/);
  assert.match(match[0], /readonly=""/i);
  assert.match(match[0], /<button[^>]*type="button"/);
  assert.doesNotMatch(match[0], /href="#"/);
  assert.match(match[0], /href="#how-it-works"/);
  assert.match(html, /<section[^>]*id="how-it-works"/);
  assert.match(match[0], /href="#market-intelligence"/);
  assert.match(html, /<section[^>]*id="market-intelligence"/);
  assert.ok(
    html.indexOf('data-section="site-footer"') >
      html.indexOf('data-section="growth-cta"'),
    "Footer must render after Growth CTA",
  );
});
```

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test tests/footer-render.test.mjs
```

Expected: FAIL with `Market Command footer is missing` because the footer component does not exist yet.

---

### Task 2: Build and integrate the semantic footer

**Files:**
- Create: `src/app/components/Footer.js`
- Create: `src/app/components/Footer.module.css`
- Modify: `src/app/template.js:1-12`
- Modify: `src/app/components/HowItWorks.js:343-346`
- Modify: `src/app/components/MarketIntelligence.js:212`
- Test: `tests/footer-render.test.mjs`

**Interfaces:**
- Consumes: existing `LogoMark` export from `src/app/components/icons.js` and existing font variables `--font-sans` / `--font-serif`.
- Produces: default export `Footer()`, `<footer id="site-footer" data-section="site-footer">`, four `data-footer-nav-group` blocks, and three `data-footer-trust` items.

- [x] **Step 1: Create the complete Server Component markup**

Create `src/app/components/Footer.js` with these data contracts:

```js
import styles from "./Footer.module.css";
import { LogoMark } from "./icons";

const NAV_GROUPS = [
  {
    title: "Platform",
    links: [
      ["Market Intelligence", "#market-intelligence"],
      ["AI Signals", "#how-it-works"],
      ["How It Works", "#how-it-works"],
      ["Pricing", "#pricing"],
    ],
  },
  {
    title: "Markets",
    links: [
      ["IPO GMP Tracker", "#ipo-gmp-tracker"],
      ["Stocks", "#market-coverage"],
      ["Indices", "#market-coverage"],
      ["Global Markets", "#market-coverage"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Performance", "#testimonials"],
      ["Trader Stories", "#testimonials"],
      ["Market Coverage", "#market-coverage"],
      ["Support", "mailto:support@sharemarketalerts.com"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", null],
      ["Contact", "mailto:support@sharemarketalerts.com"],
      ["Privacy", null],
      ["Terms", null],
    ],
  },
];

const TRUST_ITEMS = [
  ["scan", "Real-time scanning", "Markets monitored continuously"],
  ["shield", "Risk-aware intelligence", "Every signal is calibrated"],
  ["signal", "Built for clarity", "Actionable levels, not noise"],
];
```

In the same file, define the SVG helpers exactly as follows:

```jsx
function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
    </svg>
  );
}

function TrustIcon({ name }) {
  if (name === "scan") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
        <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M12 2.5 20 6v5.3c0 5.2-3.2 8.4-8 10.2-4.8-1.8-8-5-8-10.2V6l8-3.5Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3 13h3l2-5 4 10 3-8 2 3h4" />
    </svg>
  );
}

function MarketPulse() {
  return (
    <svg
      className={styles.marketPulse}
      viewBox="0 0 1380 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="footer-pulse-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#8b23f7" stopOpacity=".24" />
          <stop offset="1" stopColor="#8b23f7" stopOpacity="0" />
        </linearGradient>
        <filter id="footer-pulse-glow" x="-10%" y="-100%" width="120%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d="M0 92 82 91 126 88 164 95 210 86 254 89 294 80 338 87 382 75 422 81 466 68 510 76 553 52 596 67 640 49 681 59 724 35 765 51 808 32 850 48 894 26 936 41 980 23 1022 37 1065 18 1108 34 1150 20 1192 31 1234 17 1278 27 1320 14 1380 23V120H0Z"
        fill="url(#footer-pulse-fill)"
      />
      <path
        d="M0 92 82 91 126 88 164 95 210 86 254 89 294 80 338 87 382 75 422 81 466 68 510 76 553 52 596 67 640 49 681 59 724 35 765 51 808 32 850 48 894 26 936 41 980 23 1022 37 1065 18 1108 34 1150 20 1192 31 1234 17 1278 27 1320 14 1380 23"
        fill="none"
        stroke="#9f24ff"
        strokeWidth="2"
        filter="url(#footer-pulse-glow)"
      />
      {[553, 724, 980, 1320].map((cx, index) => (
        <circle key={cx} cx={cx} cy={[52, 35, 23, 14][index]} r="4" fill="#d49aff" />
      ))}
    </svg>
  );
}
```

Use this exact semantic hierarchy:

```jsx
export default function Footer() {
  return (
    <footer
      id="site-footer"
      data-section="site-footer"
      className={styles.footer}
      aria-labelledby="site-footer-title"
    >
      <div className={styles.gridBackdrop} aria-hidden="true" />
      <MarketPulse />

      <div className={styles.inner}>
        <div className={styles.marketRail} aria-label="Live market coverage">
          <p className={styles.liveStatus}>
            <i aria-hidden="true" />
            <span>MARKETS SCANNING 24/7</span>
          </p>
          {["150+ exchanges", "120K+ instruments", "Signals updated in real time"].map((item) => (
            <p key={item} data-footer-stat="true">{item}</p>
          ))}
        </div>

        <div className={styles.commandPanel}>
          <section className={styles.brandBlock}>
            <a className={styles.brand} href="/" aria-label="ShareMarketAlerts home">
              <LogoMark className={styles.brandMark} />
              <span>SHAREMARKETALERTS</span>
            </a>
            <h2 id="site-footer-title">
              See the <em>signal.</em>
              <span>Move before the market.</span>
            </h2>
            <p>
              AI-powered market intelligence, IPO GMP clarity, and risk-aware
              alerts—built for confident decisions.
            </p>
          </section>

          <nav className={styles.navigation} aria-label="Footer navigation">
            {NAV_GROUPS.map((group) => (
              <section key={group.title} data-footer-nav-group={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      {href ? (
                        <a href={href}>{label}<ArrowIcon /></a>
                      ) : (
                        <span aria-disabled="true">{label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <section className={styles.signup} aria-labelledby="footer-signup-title">
            <p className={styles.signupEyebrow}>MARKET ALERTS</p>
            <h3 id="footer-signup-title">The market won’t wait.</h3>
            <p>
              Get high-conviction alerts and IPO updates delivered before the
              crowd moves.
            </p>
            <div className={styles.emailControl}>
              <label htmlFor="footer-alert-email">Email address</label>
              <input
                id="footer-alert-email"
                type="email"
                readOnly
                placeholder="you@example.com"
              />
              <button type="button">Get Market Alerts <ArrowIcon /></button>
            </div>
            <small>No spam. Unsubscribe anytime.</small>
          </section>
        </div>

        <ul className={styles.trustStrip} aria-label="Platform trust signals">
          {TRUST_ITEMS.map(([icon, title, copy]) => (
            <li key={title} data-footer-trust={title}>
              <span className={styles.trustIcon}><TrustIcon name={icon} /></span>
              <span><strong>{title}</strong><small>{copy}</small></span>
            </li>
          ))}
        </ul>

        <p className={styles.disclaimer}>
          Market data and alerts are provided for informational purposes only and
          do not constitute investment advice. Trading and investing involve risk.
        </p>

        <div className={styles.legalRow}>
          <p>© 2026 ShareMarketAlerts. All rights reserved.</p>
          <p className={styles.legalLinks}>
            <span aria-disabled="true">Privacy Policy</span>
            <span aria-disabled="true">Terms of Use</span>
            <span aria-disabled="true">Risk Disclosure</span>
          </p>
          <p>Made for traders who move with conviction.</p>
        </div>
      </div>
    </footer>
  );
}
```

Create `src/app/components/Footer.module.css` initially with only:

```css
.footer {
  color: #f7f5ff;
  background: #050817;
}
```

- [x] **Step 2: Integrate the footer last in the template**

Modify `src/app/template.js` to:

```jsx
import Footer from "./components/Footer";
import GrowthCta from "./components/GrowthCta";
import Pricing from "./components/Pricing";

export default function Template({ children }) {
  return (
    <>
      {children}
      <Pricing />
      <GrowthCta />
      <Footer />
    </>
  );
}
```

- [x] **Step 3: Add the missing section anchors**

Change the opening section in `src/app/components/HowItWorks.js` to:

```jsx
<section
  id="how-it-works"
  className={s.section}
  aria-labelledby="how-it-works-title"
>
```

Change the opening page section in `src/app/components/MarketIntelligence.js` to:

```jsx
<section
  id="market-intelligence"
  className={s.section}
  aria-labelledby="market-intelligence-title"
>
```

- [x] **Step 4: Run the focused render test and confirm GREEN**

Run:

```bash
node --test tests/footer-render.test.mjs
```

Expected: PASS with one footer test and no missing-copy or order failures.

---

### Task 3: Implement the responsive Market Command visual system

**Files:**
- Create: `.artifacts/assert-footer-layout.mjs`
- Modify: `src/app/components/Footer.module.css`

**Interfaces:**
- Consumes: the class names emitted by `Footer.js`.
- Produces: a real-browser regression check plus a 1380px desktop command layout, two tablet breakpoints, a stacked mobile layout, visible focus styles, and reduced-motion support.

- [x] **Step 1: Add the failing browser layout check**

Create `.artifacts/assert-footer-layout.mjs`. Connect to the existing Chrome DevTools endpoint on port `9231`, load `http://127.0.0.1:3000/`, and measure the real `#site-footer` at widths `1920`, `1366`, `768`, and `390` after `document.fonts.ready`.

The script must assert observable behavior rather than CSS source text: no page overflow at any width; a centered inner container no wider than `1380px`; three command columns at `1920` and `1366`; two command columns with a full-width signup row at `768`; one command column at `390`; signup before navigation on mobile; two mobile navigation columns; stacked email input/button on mobile; and input/button heights of at least `44px`.

- [x] **Step 2: Run the browser layout check and confirm RED**

Run:

```bash
npx -y node@22 .artifacts/assert-footer-layout.mjs
```

Expected: FAIL because the minimal footer renders the command content as a block instead of the required responsive grid.

- [x] **Step 3: Implement the desktop composition**

Replace the minimal CSS with a complete CSS Module using these exact layout values:

```css
.footer {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 570px;
  color: #f7f5ff;
  background:
    radial-gradient(circle at 78% 6%, rgba(139, 35, 247, 0.18), transparent 27%),
    radial-gradient(circle at 16% 62%, rgba(78, 34, 240, 0.11), transparent 30%),
    linear-gradient(180deg, #070b1d 0%, #050817 58%, #030511 100%);
  font-family: var(--font-sans), Arial, sans-serif;
}

.inner {
  position: relative;
  z-index: 2;
  width: min(calc(100% - 80px), 1380px);
  max-width: 1380px;
  margin-inline: auto;
  padding: 34px 0 24px;
}

.marketRail {
  min-height: 48px;
  display: flex;
  align-items: center;
  border-block: 1px solid rgba(122, 135, 184, 0.2);
  font-variant-numeric: tabular-nums;
}

.marketRail > * {
  padding-inline: 28px;
  color: #9fa8c7;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.025em;
  white-space: nowrap;
}

.marketRail > *:not(:last-child) {
  border-right: 1px solid rgba(122, 135, 184, 0.2);
}

.liveStatus {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-left: 0;
  color: #f7f5ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.liveStatus i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #20c48a;
  box-shadow: 0 0 0 5px rgba(32, 196, 138, 0.09), 0 0 18px rgba(32, 196, 138, 0.65);
}

.commandPanel {
  display: grid;
  grid-template-columns: minmax(280px, 1.15fr) minmax(470px, 1.75fr) minmax(280px, 0.95fr);
  gap: 42px;
  margin-top: 32px;
  padding: 42px;
  border: 1px solid rgba(101, 116, 171, 0.24);
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(11, 16, 39, 0.96), rgba(8, 12, 32, 0.9));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.035), 0 24px 70px rgba(0, 0, 0, 0.23);
}

.brandBlock,
.signup {
  min-width: 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: #f7f5ff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.brandMark {
  width: 27px;
  height: 24px;
}

.brandBlock h2 {
  margin-top: 28px;
  font-family: var(--font-serif), Georgia, serif;
  font-size: clamp(30px, 2.2vw, 42px);
  font-weight: 600;
  line-height: 1.03;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.brandBlock h2 em {
  color: #b052ff;
  font-weight: 500;
}

.brandBlock h2 span {
  display: block;
}

.brandBlock > p {
  max-width: 37ch;
  margin-top: 18px;
  color: #9fa8c7;
  font-size: 14px;
  line-height: 1.65;
}

.navigation {
  display: grid;
  grid-template-columns: repeat(2, minmax(130px, 1fr));
  gap: 34px 40px;
}

.navigation h3,
.signupEyebrow {
  color: #747faa;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.navigation ul {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  list-style: none;
}

.navigation a,
.navigation li > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #c6cce1;
  font-size: 13px;
  font-weight: 550;
}

.navigation a svg {
  width: 12px;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 180ms ease, transform 180ms ease;
}

.navigation a:hover,
.navigation a:focus-visible {
  color: #ffffff;
}

.navigation a:hover svg,
.navigation a:focus-visible svg {
  opacity: 1;
  transform: translateX(0);
}

.navigation li > span[aria-disabled="true"] {
  color: #737c9d;
}

.signup {
  padding: 26px;
  border: 1px solid rgba(139, 35, 247, 0.33);
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(139, 35, 247, 0.11), rgba(8, 12, 32, 0.84));
}

.signup h3 {
  margin-top: 13px;
  font-family: var(--font-serif), Georgia, serif;
  font-size: 27px;
  font-weight: 600;
  line-height: 1.08;
}

.signup > p:not(.signupEyebrow) {
  margin-top: 12px;
  color: #aab2cf;
  font-size: 13px;
  line-height: 1.55;
}

.emailControl {
  display: grid;
  grid-template-columns: 1fr;
  gap: 9px;
  margin-top: 20px;
}

.emailControl label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.emailControl input,
.emailControl button {
  width: 100%;
  min-height: 44px;
  border-radius: 9px;
}

.emailControl input {
  border: 1px solid rgba(135, 145, 184, 0.23);
  padding: 0 14px;
  color: #f7f5ff;
  background: rgba(3, 6, 20, 0.72);
  outline: none;
}

.emailControl button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding-inline: 16px;
  color: #fff;
  background: linear-gradient(100deg, #7917ef, #9f24ff);
  font-size: 13px;
  font-weight: 750;
  box-shadow: 0 12px 28px rgba(139, 35, 247, 0.22);
}

.emailControl button svg {
  width: 15px;
}

.signup small {
  display: block;
  margin-top: 11px;
  color: #737c9d;
  font-size: 10px;
}

.trustStrip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 22px;
  padding: 20px 0;
  border-block: 1px solid rgba(122, 135, 184, 0.18);
  list-style: none;
}

.trustStrip li {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
}

.trustStrip li:not(:last-child) {
  border-right: 1px solid rgba(122, 135, 184, 0.18);
}

.trustIcon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(139, 35, 247, 0.31);
  color: #b052ff;
  background: rgba(139, 35, 247, 0.08);
}

.trustIcon svg {
  width: 19px;
  height: 19px;
}

.trustStrip li > span:last-child {
  display: grid;
  gap: 4px;
}

.trustStrip strong {
  font-size: 12px;
}

.trustStrip small {
  color: #7f89ad;
  font-size: 10px;
}

.disclaimer {
  max-width: 1060px;
  margin: 18px auto 0;
  color: #687293;
  font-size: 10px;
  line-height: 1.6;
  text-align: center;
}

.legalRow {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  margin-top: 18px;
  color: #7882a3;
  font-size: 10px;
}

.legalRow > p:last-child {
  text-align: right;
}

.legalLinks {
  display: flex;
  gap: 18px;
}

.marketPulse {
  position: absolute;
  z-index: 0;
  top: -4px;
  left: 50%;
  width: min(1380px, 100%);
  height: 120px;
  transform: translateX(-50%);
  opacity: 0.42;
}

.gridBackdrop {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  background-image:
    linear-gradient(rgba(108, 119, 165, 0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108, 119, 165, 0.14) 1px, transparent 1px);
  background-size: 42px 42px;
  -webkit-mask-image: linear-gradient(to bottom, #000, transparent 72%);
  mask-image: linear-gradient(to bottom, #000, transparent 72%);
}

.footer a:focus-visible,
.footer button:focus-visible,
.footer input:focus-visible {
  outline: 2px solid #b052ff;
  outline-offset: 4px;
}
```

- [x] **Step 4: Add the approved responsive behavior**

Append these breakpoints:

```css
@media (max-width: 1100px) {
  .inner { width: min(calc(100% - 48px), 940px); }
  .marketRail { flex-wrap: wrap; padding-block: 10px; }
  .marketRail > * { min-height: 28px; display: flex; align-items: center; }
  .commandPanel { grid-template-columns: 1fr 1.35fr; }
  .signup { grid-column: 1 / -1; }
  .emailControl { grid-template-columns: minmax(0, 1fr) 220px; }
}

@media (max-width: 760px) {
  .footer { min-height: 0; }
  .inner { width: min(calc(100% - 32px), 620px); padding-top: 24px; }
  .marketRail { display: grid; grid-template-columns: 1fr 1fr; }
  .marketRail > * { padding-inline: 14px; border-right: 0; }
  .marketRail > *:not(:last-child) { border-right: 0; }
  .liveStatus { grid-column: 1 / -1; padding-left: 14px; }
  .commandPanel { grid-template-columns: 1fr; gap: 34px; padding: 30px; }
  .navigation { order: 3; }
  .signup { grid-column: auto; order: 2; }
  .emailControl { grid-template-columns: 1fr; }
  .trustStrip { grid-template-columns: 1fr; gap: 18px; }
  .trustStrip li { justify-content: flex-start; padding-inline: 18px; }
  .trustStrip li:not(:last-child) { border-right: 0; }
  .legalRow { grid-template-columns: 1fr; text-align: center; }
  .legalLinks { justify-content: center; flex-wrap: wrap; }
  .legalRow > p:last-child { text-align: center; }
}

@media (max-width: 480px) {
  .inner { width: min(calc(100% - 24px), 390px); }
  .marketRail { grid-template-columns: 1fr; }
  .liveStatus { grid-column: auto; }
  .commandPanel { padding: 24px 20px; border-radius: 14px; }
  .brandBlock h2 { font-size: 34px; }
  .navigation { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 20px; }
  .signup { padding: 22px 18px; }
  .trustStrip { padding: 22px 0; }
  .disclaimer { padding-inline: 8px; text-align: left; }
  .marketPulse { opacity: 0.24; }
  .gridBackdrop { opacity: 0.09; }
}

@media (prefers-reduced-motion: reduce) {
  .liveStatus i,
  .navigation a svg,
  .emailControl button {
    animation: none;
    transition: none;
  }
}
```

- [x] **Step 5: Run the focused tests and lint**

Run:

```bash
npx -y node@22 .artifacts/assert-footer-layout.mjs
node --test tests/footer-render.test.mjs
npm run lint
```

Expected: the browser layout check and footer render test PASS, and ESLint exits with code 0.

---

### Task 4: Perform the visual fidelity pass

**Files:**
- Create: `.artifacts/footer-1920.png`
- Create: `.artifacts/footer-1366.png`
- Create: `.artifacts/footer-768.png`
- Create: `.artifacts/footer-390.png`
- Modify: `src/app/components/Footer.module.css` during measured visual tuning

**Interfaces:**
- Consumes: the rendered `<footer id="site-footer">` on `http://127.0.0.1:3000/`.
- Produces: verified desktop, tablet, and mobile footer layouts with no overflow or overlapping content.

- [x] **Step 1: Capture the desktop footer**

Use Chrome DevTools Protocol on port `9231`, set the viewport to `1920x1000`, navigate to `http://127.0.0.1:3000/`, wait for `document.fonts.ready`, scroll `#site-footer` into view, and capture its `getBoundingClientRect()` to `.artifacts/footer-1920.png` without resampling.

Confirm:

- Footer follows Growth CTA with no white seam.
- Inner content width is 1380px and centered.
- Footer height is 570px within a 20px tolerance.
- Market pulse remains decorative and does not reduce text contrast.
- Brand, navigation, and alert panel form three readable columns.

- [x] **Step 2: Capture 1366px desktop/laptop**

Repeat at `1366x900` and save `.artifacts/footer-1366.png`. Confirm the 1100px breakpoint is not active, all three main columns fit, and the legal row remains on one line where space permits.

- [x] **Step 3: Capture 768px tablet**

Repeat at `768x1024` and save `.artifacts/footer-768.png`. Confirm the brand and navigation use the first two-column panel row, the signup spans beneath it, navigation remains a two-by-two group grid, and neither the live rail nor trust strip causes horizontal overflow.

- [x] **Step 4: Capture 390px mobile**

Repeat at `390x844` and save `.artifacts/footer-390.png`. Confirm brand, signup, navigation, trust, disclaimer, and legal content appear in that order; navigation remains two columns; input and button are stacked; interactive targets are at least 44px; and `document.documentElement.scrollWidth === window.innerWidth`.

- [x] **Step 5: Tune only footer CSS and re-capture**

If a checkpoint fails, adjust only `Footer.module.css`, rerun both footer tests, and repeat the affected capture. Do not edit existing section CSS or page content during the visual pass.

---

### Task 5: Run complete verification

**Files:**
- Verify: all changed and created files from Tasks 1–4.

**Interfaces:**
- Consumes: final footer implementation and artifacts.
- Produces: fresh evidence that the complete project still renders, lints, and builds.

- [x] **Step 1: Run every Node test**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [x] **Step 2: Run ESLint**

Run:

```bash
npm run lint
```

Expected: ESLint exits with code 0 and no errors.

- [x] **Step 3: Run the Next.js production build**

Run:

```bash
npm run build
```

Expected: Next.js compiles successfully, completes TypeScript checks, generates all static pages, and exits with code 0. The existing multiple-lockfile workspace-root warning is non-blocking.

- [x] **Step 4: Review the final acceptance checklist**

Confirm every approved string is present, the footer is last, there are four navigation groups and three trust items, unavailable destinations are non-interactive, the alert control cannot submit, all four screenshots are visually clean, and no Git command was run.
