# Mobile and Tablet Hero Design

## Goal

Reproduce `/tmp/codex-clipboard-Xeho3T.png` as the homepage hero at mobile and tablet widths. Generate a new project-owned market-momentum bitmap that closely matches `/tmp/codex-clipboard-XlQ3P8.png` and use it inside the momentum card. Preserve the existing desktop hero exactly.

## Scope

- Apply the new composition only at viewport widths of 900px and below.
- Keep the current `Hero` markup and styling visually unchanged at 901px and above.
- At tablet widths, cap the flat mobile composition at exactly 430px wide and center it instead of stretching it across the tablet.
- Scale the 397 × 870 reference proportionally on narrower phones.
- Change no section below the hero.
- Add no dependencies and perform no Git or GitHub operations.

## Selected architecture

Create a dedicated static `MobileHero` Server Component and a colocated CSS Module. Render it alongside the existing desktop hero. The desktop hero remains visible above 900px, while the mobile component is visible at 900px and below. This isolates the new pixel-calibrated composition from the complex 1920px desktop coordinate system and avoids changing desktop geometry.

Use a 397 × 870 reference coordinate system driven by a mobile scale unit. At widths below 397px, every dimension scales down proportionally. From 397px through 430px, the complete composition scales proportionally from 397px to 430px. From 431px through 900px, it remains 430px wide and is centered on the page surface. The physical phone shown in the reference is presentation context only and is not part of the website UI.

## Visual system

### Palette

- Page surround: `#fbfbff`
- Screen surface: `#fbfbff`
- Primary ink: `#080d2b`
- Muted copy: `#68719a`
- Brand violet: `#6818f5`
- Violet highlight: `#8a15ff`
- Deep momentum navy: `#030829`
- Positive green: `#10b977`
- Card border: `#e6e7f1`

### Typography

- Continue using the existing Figtree sans-serif for navigation, labels, cards, and data.
- Continue using the existing Playfair Display serif for the hero headline.
- Preserve the reference’s two-line headline and italic treatment: `Intelligence` / `that moves first.` with `moves` and the period in violet.

## Reference inventory

### Presentation context

- Do not render a phone bezel, silver rim, dynamic island, side buttons, or black device surround.
- Render the dashboard directly on the white page surface.
- Preserve the content hierarchy and compact vertical rhythm shown inside the reference screen.

### Mobile navigation

- Left-aligned triangular ShareMarketAlerts mark and `SHAREMARKETALERTS` wordmark.
- Compact violet `Free Trial` button.
- Three-line hamburger icon at the right.
- No desktop navigation links or login link.

### Market ticker

- One compact single-line strip below the navigation.
- Purple live dot, `LIVE`, and `Market Pulse` at the left.
- Visible compact market cells for `NIFTY 50`, `SENSEX`, and `NASDAQ` with the existing values and positive green changes.
- Clip overflow at the right edge exactly like the reference.

### Hero copy and CTAs

- Eyebrow: `AI-POWERED MARKET INTELLIGENCE`.
- Headline: `Intelligence that moves first.`.
- Body: `Real-time AI scans uncover high-probability opportunities before the crowd sees them.`.
- Violet primary button: `Start Free Trial` with arrow.
- White secondary button: `See It In Action` with circular play icon.
- Hide the desktop `Markets Open` label.

### Market momentum card

- Full-width dark navy rounded card below the CTAs.
- Use the newly generated dotted world-map and violet line-chart bitmap as its background.
- The bitmap contains no words, numbers, badges, logos, or watermark.
- Overlay real HTML for `Market Momentum`, the green `BULLISH` pill, `68%`, `Momentum Score`, and the information icon.
- Keep all text readable over the image without obscuring its glowing geographic nodes.

### Breakout card

- White rounded card with the violet signal icon.
- `Breakout Signal`, `NIFTY 26 JUN 24600 CE`, `247.85`, `+18.65%`, and `High Probability`.
- Right-aligned strength label, `92%`, and violet progress bar.

### Top movers card

- White rounded card with a violet trend icon and right chevron.
- Exactly three rows: `RELIANCE`, `TCS`, and `HDFCBANK` with the existing prices and positive changes.
- Preserve current compact avatar colors and aligned numeric columns.

### Risk card

- White rounded card with violet shield icon.
- `Risk Level`, `LOW`, and `Well Balanced` on the left.
- Compact semicircular violet gauge on the right with `28/100` and `Risk Score`.

### Bottom feature strip

- Three equally sized feature cells with thin vertical dividers.
- `AI Real-Time Scanning` / `Never miss a move.`
- `Instant Alerts` / `Delivered in real-time.`
- `High Accuracy` / `Backtested & proven.`
- Use existing violet scan, bolt, and shield icon language.
- Hide the desktop fourth feature and complete trust/partner strip in this mobile hero.

## Generated momentum asset

Use the built-in image-generation path with `/tmp/codex-clipboard-XlQ3P8.png` as a composition and style reference. Generate one landscape website asset with:

- a deep navy background;
- a wide dotted world map centered in the upper two-thirds;
- four bright violet market nodes with concentric signal rings;
- a luminous jagged violet market line across the lower third;
- subtle violet area fill beneath the line;
- no text, numbers, labels, borders, logos, or watermark;
- sufficient edge detail for the 330 × 144px reference card crop.

Save the selected project asset under `public/images/` with a descriptive non-destructive filename. Use the framework’s supported local-image mechanism and preserve its intrinsic ratio.

## Responsive behavior

- `0–396px`: proportionally scale the complete 397px reference canvas to the viewport width.
- `397–430px`: scale the complete reference composition proportionally up to the 430px cap.
- `431–900px`: keep the flat composition at no more than 430px and center it on the light page surround.
- `901px and above`: show only the existing desktop hero with its current pixels and behavior.
- Respect `prefers-reduced-motion`; this pass adds no continuous animation.

## Accessibility and semantics

- Keep the headline as the page’s real `h1` within the active responsive hero.
- Use real text for all market data, card labels, and button labels.
- Treat the generated market image as decorative because its meaning is repeated by the HTML overlay.
- Preserve visible focus treatment for links.
- Ensure the hidden responsive variant is removed from layout and the accessibility tree with CSS `display: none` at its inactive breakpoint.

## Testing and verification

- Use test-driven development before production changes.
- Add a render contract for the mobile hero’s exact visible copy, card order, generated-image reference, and three-item feature strip.
- Capture and compare the top hero at 397 × 870 against `/tmp/codex-clipboard-Xeho3T.png`.
- Capture at 360px and 430px to verify proportional mobile scaling.
- Capture at 768px and 900px to verify the centered flat-page treatment.
- Capture at 1366px and 1920px to confirm the existing desktop hero remains unchanged.
- Iterate on spacing, card geometry, typography, image crop, and clipping until the mobile reference content is matched without device chrome.
- Run all Node tests, ESLint, and the Next.js production build before completion.

## Acceptance criteria

- At 397 × 870, the hero’s content order, copy, card count, proportions, and color treatment match the supplied mobile reference without a device frame.
- The generated momentum artwork matches the supplied dark-map reference closely and is used in the mobile momentum card.
- The flat mobile composition remains centered and un-stretched on iPad/tablet widths.
- The desktop hero is visually unchanged.
- No section below the hero is modified.
- Tests, lint, and production build pass.
