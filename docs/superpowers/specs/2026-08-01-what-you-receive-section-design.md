# What You Receive Section Design

## Objective

Reproduce the supplied 994 x 553 desktop reference as a native Next.js section immediately after the existing `HowItWorks` section. The Hero and `HowItWorks` implementations must remain byte-for-byte unchanged.

## Visual contract

- The section uses the reference's white/lavender canvas, serif headline, violet italic phrase, fine lavender connectors, white information cards, dark navy signal dashboard, and four-part bottom benefit rail.
- The composition is authored against a 994 x 553 coordinate system and scales proportionally from laptop widths through 1920 px desktop widths.
- Desktop/laptop is the only responsive scope for this pass. Mobile behavior is deferred by user request.
- The dashboard, icons, confidence rings, price chart, risk/reward bar, connector paths, and dot-grid decoration are native HTML/CSS/inline SVG. The supplied screenshot is inspection material only and is not embedded in the page.

## Content contract

The implementation includes the exact visible labels and values from the reference: the `WHAT YOU RECEIVE` introduction, confidence and timing cards, RELIANCE breakout signal dashboard, target/stop-loss/risk-level cards, and the four bottom benefits.

## Component boundary

- `WhatYouReceive.js` owns semantic markup and decorative SVG primitives for this section.
- `WhatYouReceive.module.css` owns the fixed-reference coordinate system, typography, colors, shadows, and scaling.
- `page.js` only imports and renders `WhatYouReceive` after `HowItWorks`.
- `what-you-receive-render.test.mjs` fetches the real homepage and verifies unique copy plus ordering below `HowItWorks`.

## Design tokens

- Canvas: `#fbfbff`
- Primary ink: `#090d20`
- Secondary ink: `#555d83`
- Brand violet: `#7b19f2`
- Dashboard navy: `#080d32`
- Positive: `#08b779`
- Negative: `#ff3b6b`
- Warning: `#d69a2b`
- Display type: existing `--font-serif`
- UI/data type: existing `--font-sans`

## Verification

Render at 994 px, 1366 px, and 1920 px widths. Compare the new section crop against the supplied reference, refine geometry and type, then run the rendered integration tests, lint, build, and checksum checks for the two existing sections.
