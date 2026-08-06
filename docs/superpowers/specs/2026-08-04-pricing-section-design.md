# Pricing Section Design

## Goal

Reproduce the supplied 1287 × 860 desktop pricing reference as a real Next.js section directly after the existing Testimonials section, without changing any existing section.

## Approved scope

- Desktop and laptop presentation only for this pass.
- Billing selector is visual-only, with Yearly selected and the `-20% OFF` badge visible.
- CTA controls are visual-only and do not navigate or submit.
- No Git operations.

## Implementation

- Add a semantic server component at `src/app/components/Pricing.js`.
- Add isolated styles at `src/app/components/Pricing.module.css`.
- Use CSS and inline SVG icons so the result remains sharp at laptop and desktop widths.
- Import and render `Pricing` immediately after `Testimonials` in `src/app/page.js`.
- Match the reference hierarchy: eyebrow, mixed-font headline, subtitle, savings/toggle row, guarantee rail, three pricing cards, and five-column benefits rail.
- Use the existing project serif and sans-serif font variables for consistency with the established page.
- Scale the section proportionally from the 1287px reference width, preserving spacing, borders, shadows, typography, and card alignment.

## Content

All visible reference copy, prices, feature lists, labels, badges, and benefit captions will be reproduced verbatim. The middle Growth plan will carry the dark outline, purple `MOST POPULAR` ribbon, purple CTA, and no-credit-card note shown in the reference.

## Verification

- Add a render-structure test before implementation and confirm it initially fails.
- Run the pricing test, full test suite, lint, and production build.
- Capture the rendered section at the reference width and at a representative laptop width, compare it visually with the supplied screenshot, and tune CSS until the layout closely matches.

