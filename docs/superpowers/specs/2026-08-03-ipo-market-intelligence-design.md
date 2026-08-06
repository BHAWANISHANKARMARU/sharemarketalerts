# IPO Market Intelligence Section Design

## Goal and Scope

Reproduce /tmp/codex-clipboard-HYqtrU.png as a desktop/laptop Next.js section immediately after Hero. Preserve Hero and all existing sections byte-for-byte. Build with native React markup, CSS Modules, and inline SVG; do not use the screenshot as a background. Controls are visual-only in this pass, mobile is deferred, and the black upper strip in the screenshot is treated as external framing. No Git or GitHub operations.

## Page Order

1. Hero
2. IpoMarketIntelligence
3. HowItWorks
4. WhatYouReceive
5. MarketIntelligence

Only the new import and insertion may change src/app/page.js.

## Visual System

- Surface #ffffff
- Primary ink #0b0d2c
- Secondary ink #5e668f
- Muted ink #858aa8
- Electric indigo #301cff
- Bright blue #4456ff
- Positive green #10c978
- Negative red #ff304f
- Indigo wash #edf0ff
- Positive wash #e9fff4
- Negative wash #fff0f3
- Border #e8eaf4
- Separator #eef0f7

Use the existing Figtree font. The two-line title is 800 weight; KPI values and table emphasis use 700–800; labels use 500–600. Table columns and axes use tabular numerals, while large standalone KPI figures remain proportional.

The layout uses the 1136 × 786 screenshot as its coordinate canvas and scales with:

--ipo-u: calc(min(100vw, 1920px) / 1136)

The section height is 786 × --ipo-u and caps at the 1920px equivalent. Reference coordinates, font sizes, strokes, radii, and spacing scale from the same unit.

## Header and KPI Row

The upper region is approximately 200 reference pixels tall.

Left:

- Blue dot plus LIVE MARKET INTELLIGENCE
- IPO Market Intelligence.
- Stronger Decisions. in electric indigo
- Track live IPOs, GMP trends, subscription insights and
- market sentiment — everything you need in one intelligent dashboard.

Upper right:

- Visual search box: Search IPO or company...
- Bell icon with blue notification badge 3

Four white bordered KPI cards:

1. LIVE IPOS / 32 / Active in Market / blue pulse icon
2. WITH +VE GMP / 26 / 81% of total / green upward arrow
3. AVERAGE GMP / 28.45% / ↑ 4.32% vs last month / violet columns
4. MARKET SENTIMENT / 72% / Bullish / blue pie icon

Cards use a subtle cool shadow and approximately 10px reference radius.

## Live IPO Table

The table card occupies the left 806 reference pixels below the header.

Header:

- Live IPOs
- Visual tabs: All (32) active, Open (12), Upcoming (8), Closed (12)
- Local visual search: Search IPO or company...
- Visual filter sliders icon

Columns:

1. Company
2. Price Band (₹)
3. GMP (₹)
4. GMP % plus info icon
5. Subs (x)
6. Est. Listing Gain (₹)
7. Status

GMP % uses a pale-blue highlighted column through the header and rows.

| Company | Price Band (₹) | GMP (₹) | GMP % | Subs (x) | Est. Listing Gain (₹) | Status |
|---|---:|---:|---:|---:|---:|---|
| HDB Financial Services | ₹700 – ₹740 | ₹162 | 21.89% | 45.62x | ₹309 (41.76%) | Upcoming |
| Tata Capital Limited | ₹310 – ₹326 | ₹68 | 20.86% | 28.34x | ₹128 (39.26%) | Upcoming |
| LG Electronics India | ₹1,080 – ₹1,140 | ₹190 | 16.67% | 12.78x | ₹260 (22.81%) | Upcoming |
| Borana Weaves | ₹205 – ₹216 | ₹32 | 15.69% | 56.11x | ₹59 (27.31%) | Upcoming |
| Hyundai Motor India | ₹1,865 – ₹1,960 | ₹265 | 13.78% | 8.92x | ₹265 (13.78%) | Open |
| NTPC Green Energy | ₹102 – ₹108 | ₹12 | 11.11% | 35.21x | ₹12 (11.11%) | Open |
| Waaree Energies | ₹1,427 – ₹1,503 | ₹150 | 9.97% | 6.34x | ₹150 (9.97%) | Open |

Company marks are native approximations using distinct brand colors and letter or shape treatments. GMP and estimated gains are green, GMP percentages are indigo, Upcoming is a pale-indigo pill, and Open is a pale-green pill. The footer centers View All IPOs with a right arrow.

## Right Rail

### GMP Spotlight

- GMP Spotlight plus info icon
- Large indigo ₹162
- Highest GMP
- HDB Financial Services
- 21.89% GMP and Upcoming pills
- Large pale rupee watermark on the right

### GMP Trend (7D)

- Title GMP Trend (7D), endpoint label ₹162
- One-series indigo line and 10% area wash
- Y labels ₹200, ₹120, ₹40
- X labels May 17, May 20, May 23
- 2px round line and 8px endpoint with a surface ring

Values remain visible without interaction; a tooltip is excluded because this pass is explicitly static.

### Market Sentiment

- Market Sentiment
- Visual View details plus arrow
- Semicircular segmented red → orange → yellow → green → blue gauge
- Navy needle
- Center 72% and Bullish
- Bottom values: Bullish 58%, Neutral 24%, Bearish 18%

## Benefit Strip

Five equal cells under the table, separated by vertical rules:

1. Real-Time Updates / Market changes / in real-time / blue lightning
2. Smart Signals / AI-powered insights / and alerts / green target
3. Reliable Data / Verified from multiple / trusted sources / violet shield
4. Instant Alerts / Never miss high potential / opportunities / blue bell
5. Market Edge / Make informed decisions / with confidence. / indigo analytics

## Architecture

Create src/app/components/IpoMarketIntelligence.js as a server component with static KPI, row, and benefit arrays plus local helper components for icons, company marks, cards, table, spotlight, trend chart, gauge, and benefit strip.

Create src/app/components/IpoMarketIntelligence.module.css for the reference-coordinate layout and styling.

Modify src/app/page.js only to import and render IpoMarketIntelligence immediately after Hero.

Create tests/ipo-market-intelligence-render.test.mjs to fetch the real homepage, assert the key copy and all seven rows, and verify placement after the hero heading and before How signals become conviction.

Remove the unfinished tests/market-intelligence-radar-browser.test.mjs experiment from the superseded request. That experiment made no production radar CSS change.

## Accessibility and Static Behavior

- Semantic labelled section and semantic IPO table
- Decorative SVGs use aria-hidden
- Searches, tabs, filters, and links are non-focusable visual elements
- Status is communicated with text and color
- Financial columns use tabular numerals

## Acceptance Criteria

- Section is directly after Hero and before HowItWorks.
- Hero and existing component files are unchanged.
- The 1136px screenshot matches the supplied hierarchy, proportions, density, KPI row, table, right rail, chart, gauge, and benefit strip.
- Proportions remain stable at 1366px and 1920px without horizontal overflow.
- All specified text and all seven IPO rows render.
- Existing sections remain below the new section.
- Render test, ESLint, and production build pass.
- Side-by-side visual comparisons are reviewed at 1136px, 1366px, and 1920px.
