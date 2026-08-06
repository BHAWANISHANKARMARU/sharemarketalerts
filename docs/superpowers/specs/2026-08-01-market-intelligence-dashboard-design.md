# Market Intelligence Dashboard Section Design

## Objective

Reproduce the supplied 822 x 543 reference as a native Next.js section immediately after the existing `WhatYouReceive` section. `Hero`, `HowItWorks`, and `WhatYouReceive` must remain byte-for-byte unchanged.

## Scope

- Laptop and desktop only for this pass; mobile remains deferred by user request.
- The screenshot's exterior black margin is reference framing, not page content.
- The section is authored against an 822 x 543 coordinate system and scales proportionally through 1920 px.
- All dashboard text, cards, tables, meters, sparklines, icons, and chart geometry are native HTML/CSS/inline SVG.
- The supplied 1024 x 1536 image `/home/gaurav/Downloads/ChatGPT Image Aug 1, 2026, 10_25_48 PM.png` is copied into the app's static image directory and used only inside the lower-left angled radar artwork.
- No Git operations are permitted.

## Composition

### Left editorial panel

- Share Market Alerts compact wordmark at the upper left.
- Large condensed four-line headline: `SEE IT`, violet `BEFORE`, `THE MARKET`, `MOVES.` with a violet full stop.
- Thin violet underline and the supporting copy `Real-time intelligence that surfaces high-probability opportunities before everyone else.`
- Decorative vertical violet microcopy and dot fields along the outer edges.
- Lower-left dark polygon containing `MARKETS DON'T WAIT.` and `Neither should you.` over the supplied radar image. The image is clipped to the same angled wedge shown in the reference.

### Right dashboard

- Status row: `MARKET STATUS:`, green dot, `MARKETS OPEN`, `09:45:12 AM`, and a circular lightning action icon.
- Dark market strip with five cells:
  - `NIFTY 50` — `24,812.45` — `+0.63%`
  - `SENSEX` — `81,317.12` — `+0.17%`
  - `BANK NIFTY` — `54,261.80` — `+0.45%`
  - `INDIA VIX` — `12.48` — `-2.59%`
  - `MARKETS SCANNED` — `6` — `Asset Classes`
- Main white `MARKET PULSE` card with `1D`, `5D`, `1M`, `3M`, and `1Y` filters, the `NIFTY 50 INDEX` selector, a circular violet intraday chart, and these statistics:
  - `OPEN 24,798.45`
  - `HIGH 24,816.80`
  - `LOW 24,790.30`
  - `CLOSE 24,812.45`
  - `CHANGE +31.35 (+0.13%)`
  - `VOLUME 248.75 M`
- Four lower statistics inside the pulse card:
  - `MARKET BREADTH`: `1,892 ADVANCES`, `1,023 DECLINES`
  - `FII / DII ACTIVITY (₹ Cr)`: `+1,245.60 FII NET BUY`, `+892.30 DII NET BUY`
  - `VOLATILITY INDEX`: `India VIX`, `12.48`, `-2.35%`
  - `MARKET SENTIMENT`: `BULLISH`, `72%`
- Right-side `TOP GAINERS` and `TOP LOSERS` cards, each with `VIEW ALL →` and five rows in the reference order.
- Bottom `LIVE HIGH PROBABILITY OPPORTUNITIES` rail with a `34 NEW` badge, two circular arrow buttons, and four equal cards:
  - RELIANCE — NSE · Equity — BUY — entry `₹2,856.40`, target `₹2,980.00`, stop loss `₹2,760.00`, confidence `87%`, score `92`, time `2m ago`
  - NIFTY 50 — NSE · Index — BUY — entry `24,812.45`, target `25,350.00`, stop loss `24,350.00`, confidence `82%`, score `89`, time `3m ago`
  - TATA MOTORS — NSE · Equity — BUY — entry `₹1,082.00`, target `₹1,145.00`, stop loss `₹1,045.00`, confidence `79%`, score `80`, time `5m ago`
  - USD/INR — Forex · Major — SELL — entry `83.37`, target `82.75`, stop loss `83.85`, confidence `77%`, score `75`, time `8m ago`

## Gainers and losers

Gainers, in order:

1. RELIANCE — `₹2,856.40` — `+2.35%`
2. TATA MOTORS — `₹1,082.00` — `+1.92%`
3. HDFCBANK — `₹1,678.40` — `+1.32%`
4. INFY — `₹1,542.30` — `+1.21%`
5. ICICIBANK — `₹1,248.80` — `+1.05%`

Losers, in order:

1. ADANIENT — `₹2,156.20` — `-1.78%`
2. WIPRO — `₹468.25` — `-1.32%`
3. JSWSTEEL — `₹872.50` — `-1.12%`
4. BPCL — `₹315.20` — `-0.98%`
5. TITAN — `₹3,415.00` — `-0.78%`

## Visual system

- Canvas: cool white `#fbfbff`
- Primary ink: deep navy `#060a28`
- Dashboard navy: `#020326`
- Brand violet: `#8a0ff1`
- Positive: `#05b96f`
- Negative: `#ff4664`
- Muted text: `#747b9b`
- Borders: lavender-tinted hairlines with very soft shadows
- Editorial headline: condensed sans-serif treatment built from the existing font stack using width scaling and tight tracking
- Dashboard/data text: existing `--font-sans` with tabular figures where values align

## Component boundary

- `MarketIntelligence.js` owns all visible copy, data arrays, semantic markup, and inline SVG primitives.
- `MarketIntelligence.module.css` owns the 822 x 543 coordinate system, clipping, typography, palette, shadows, and proportional desktop scaling.
- `page.js` only imports and renders `MarketIntelligence` after `WhatYouReceive`.
- `market-intelligence-render.test.mjs` fetches the real homepage and verifies unique copy, all key values, and placement after `WhatYouReceive`.

## Verification

1. Add the rendered integration test first and verify it fails because the new section is absent.
2. Implement the component and static image.
3. Render at 822 px, 1366 px, and 1920 px widths.
4. Compare the 822 px crop side by side with the supplied reference and refine until geometry, typography, colors, tables, chart marks, and clipping align.
5. Run all rendered tests, ESLint, the production build, and checksum checks for every existing section file.
