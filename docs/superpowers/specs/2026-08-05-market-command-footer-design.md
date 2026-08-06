# ShareMarketAlerts Market Command Footer

## Goal

Create a distinctive, premium footer for the ShareMarketAlerts homepage that feels like the closing screen of a live market-intelligence terminal. It must follow the existing Growth CTA, reinforce trust, provide useful navigation, and end the page with a polished financial-product identity.

## Approved direction

Use a **Market Close Command Center** composition: a deep midnight footer with a restrained violet market pulse, a live-scanning status, a strong brand statement, compact navigation, an alert signup control, trust signals, and a complete legal strip.

The footer should feel confident and technical rather than decorative. One expressive market-pulse motif supplies the visual drama; the navigation and legal content remain quiet and highly readable.

## Visual system

### Colour

- Midnight canvas: `#050817`
- Elevated panel: `#0b1027`
- Recessed panel: `#080c20`
- Divider: `#20284a`
- Primary violet: `#8b23f7`
- Electric violet highlight: `#b052ff`
- Main text: `#f7f5ff`
- Muted text: `#9fa8c7`
- Live status green: `#20c48a`

Use a dark navy gradient instead of pure black. Violet glows must be localized around the pulse line, logo, and primary action so the whole footer does not become a generic purple gradient.

### Typography

- Use the existing Playfair Display face for the brand statement only.
- Use the existing Figtree face for navigation, controls, disclaimers, and utility text.
- Use uppercase utility labels with measured tracking for live status and column headings.
- Use tabular numerals for the market-scanning statistic.

### Shape and texture

- Use one large rounded inner command panel with a subtle border and inset highlight.
- Use a fine technical grid and a thin rising market-pulse line as decorative CSS/SVG artwork.
- Keep radii tighter than the white-page cards so the footer feels more infrastructural.
- Use shadows sparingly; depth should come from surface contrast and borders.

## Content and structure

Render a semantic `<footer>` directly after the existing Growth CTA.

### 1. Live market rail

Place a compact rail at the top of the footer containing:

- Green status dot
- `MARKETS SCANNING 24/7`
- `150+ exchanges`
- `120K+ instruments`
- `Signals updated in real time`

The items are separated by fine vertical dividers on desktop and wrap cleanly on smaller screens.

### 2. Brand statement

Render the existing ShareMarketAlerts mark and wordmark followed by:

`See the signal.`
`Move before the market.`

Accent only the word `signal` in violet italic Playfair Display. Add this supporting copy:

`AI-powered market intelligence, IPO GMP clarity, and risk-aware alerts—built for confident decisions.`

### 3. Navigation

Use four compact navigation groups.

**Platform**

- Market Intelligence
- AI Signals
- How It Works
- Pricing

**Markets**

- IPO GMP Tracker
- Stocks
- Indices
- Global Markets

**Resources**

- Performance
- Trader Stories
- Market Coverage
- Support

**Company**

- About
- Contact
- Privacy
- Terms

Existing homepage sections use real anchor targets. `Support` and `Contact` use `mailto:support@sharemarketalerts.com`. Company and legal destinations without an existing route render as visibly consistent, non-interactive text with `aria-disabled="true"`; they must not use empty `#` links or trigger page jumps.

### 4. Alert signup panel

Add a compact elevated panel titled:

`The market won’t wait.`

Supporting copy:

`Get high-conviction alerts and IPO updates delivered before the crowd moves.`

Include an email input labelled `Email address`, a violet `Get Market Alerts` button, and the reassurance `No spam. Unsubscribe anytime.` The control is visual-only in this pass and must not submit or navigate.

### 5. Trust strip

Add three short trust signals with restrained line icons:

- `Real-time scanning` / `Markets monitored continuously`
- `Risk-aware intelligence` / `Every signal is calibrated`
- `Built for clarity` / `Actionable levels, not noise`

### 6. Legal close

Include the disclaimer:

`Market data and alerts are provided for informational purposes only and do not constitute investment advice. Trading and investing involve risk.`

The final row contains:

- `© 2026 ShareMarketAlerts. All rights reserved.`
- `Privacy Policy`
- `Terms of Use`
- `Risk Disclosure`
- `Made for traders who move with conviction.`

## Layout

### Desktop

- Full-width midnight background with a centered inner `max-width` of 1380px.
- Live rail spans the top.
- Main grid uses a wide brand column, four compact navigation columns, and a right-side alert signup panel.
- Trust strip spans beneath the main grid.
- Disclaimer and copyright rows close the footer.
- Target visual height: 570px at a 1920px viewport, with content allowed to increase the height at narrower widths.

### Tablet

- Brand statement spans the first row.
- Navigation becomes a two-by-two grid.
- Signup panel sits beside or below the navigation according to available width.
- Live rail and trust strip wrap without horizontal scrolling.

### Mobile

- Stack brand, signup, navigation, trust, disclaimer, and legal rows in that order.
- Navigation remains visible as a two-column grid; do not hide core links in accordions.
- The email control becomes a vertical input/button stack.
- Decorative grid and pulse art are reduced to prevent visual noise.
- Maintain at least 44px interactive targets and 16px body text where practical.

## Component architecture

- Create `src/app/components/Footer.js` as a Server Component.
- Create `src/app/components/Footer.module.css` for all footer styling.
- Keep link groups and trust items in local data arrays for clear, auditable content.
- Use small inline SVG components for the logo, pulse, arrows, and trust icons; add no dependency.
- Render `<Footer />` after `<GrowthCta />` in `src/app/template.js` so it is always the final homepage section.
- Add `id="how-it-works"` to the How It Works section and `id="market-intelligence"` to the Market Intelligence section for their footer anchors.

## Interaction and accessibility

- Use semantic `<footer>`, `<nav aria-label="Footer navigation">`, lists, headings, labels, and links.
- Decorative grid, pulse line, and glow elements are hidden from assistive technology.
- Give all links and the signup button a visible violet focus treatment.
- The email control is explicitly non-submitting in this visual pass.
- Honour `prefers-reduced-motion`; any status or pulse animation is disabled when requested.
- Maintain readable contrast on every dark surface.

## Testing and verification

- Add a render test that proves the footer follows the Growth CTA and includes the approved copy, navigation groups, alert panel, trust strip, and legal disclaimer.
- Follow test-driven development: run the new test before adding the production component and confirm the expected failure.
- Capture footer screenshots at 1920px, 1366px, 768px, and 390px.
- Check wrapping, alignment, focus states, link density, legal readability, and absence of horizontal overflow.
- Run the complete Node test suite, ESLint, and the Next.js production build.
- Perform no Git operations.
