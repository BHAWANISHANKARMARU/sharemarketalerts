# How It Works Section Design

## Objective

Add a native Next.js section immediately after the existing homepage hero that reproduces the supplied 994 × 553 desktop reference as precisely as possible. The existing hero must remain visually and structurally unchanged. Mobile behavior is explicitly outside this phase and will be designed later with the user.

## Project Context

- Framework: Next.js 16.2.12 App Router with React 19.2.4.
- Homepage entry: `src/app/page.js`.
- Existing hero: `src/app/components/Hero.js` and `Hero.module.css`.
- Styling: global CSS tokens plus colocated CSS Modules.
- Fonts: Figtree for interface text and Playfair Display for editorial serif text, loaded through `next/font/google` in `src/app/layout.js`.
- Existing brand palette: deep navy, violet/purple accents, pale lavender surfaces, white cards, and muted blue-gray copy.

## Chosen Approach

Build the reference as a standalone Next.js server component with semantic JSX, a colocated CSS Module, and inline SVG icons and connector artwork. Mount the component after `<Hero />` in `src/app/page.js`.

This approach is preferred over embedding the supplied screenshot because it produces a genuine, editable interface with crisp text. It is preferred over a monolithic SVG because HTML cards and labels remain maintainable while SVG is reserved for the orbital diagram, charts, icons, and connector paths that require exact geometry.

## Isolation Boundary

The hero is immutable for this task:

- Do not edit `src/app/components/Hero.js`.
- Do not edit `src/app/components/Hero.module.css`.
- Do not alter the hero's assets, spacing, height, breakpoints, typography, or colors.
- The only homepage wiring change is wrapping the existing `<Hero />` and adding `<HowItWorks />` immediately after it.

The new section owns all of its markup and styles in new component files. New icon definitions may be colocated with the section so existing hero icons are untouched.

## Visual Composition

The section uses the supplied 994 × 553 image as its desktop coordinate system and preserves its approximately 1.797:1 aspect ratio. At laptop and desktop widths, all geometry scales proportionally from that coordinate system so card placement, connector positions, text relationships, and negative space remain identical.

The visible section is a near-white canvas with a faint lavender cast and a restrained violet glow centered on the AI engine. The dark outer pixels around the supplied image are treated as screenshot framing rather than part of the page section.

### Header

- Centered eyebrow: `HOW IT WORKS`.
- Centered serif headline: `How signals become conviction.`
- Only `conviction.` is italic and violet.
- Centered two-line supporting copy:
  - `We combine real-time market data, advanced AI, and risk-aware validation`
  - `to surface high-probability opportunities you can act on with confidence.`

### Left Column: Market Inputs

- Heading: `MARKET INPUTS`.
- Supporting line: `Always on. Always learning.`
- Four vertically stacked white cards with subtle lavender shadows and rounded corners:
  1. `Price Action` — `Real-time charts, patterns` / `and momentum shifts`; line-chart visualization.
  2. `Volume & Flow` — `Smart money activity` / `and volume anomalies`; bar-chart visualization.
  3. `Sector Moves` — `Relative strength across` / `sectors and industries`; purple dot-matrix heatmap.
  4. `Macro & News` — `Economic indicators` / `and event-driven signals`; `24` badge and `High Impact` / `Events Today`.
- Each card begins with a circular purple icon and connects to the central engine with thin lavender paths and bright violet nodes.

### Center: AI Decision Engine

- Heading: `AI DECISION ENGINE`.
- Supporting line: `Analyze. Validate. Prioritize.`
- Multiple fine concentric lavender rings with a soft radial glow and violet nodes at cardinal points.
- Central dark navy circular core with a luminous triangular brand mark and the text `ShareMarketAlerts` / `Intelligence Core`.
- Three surrounding analysis nodes:
  - `PROBABILITY` — `24/7 AI models` / `ensemble scoring`.
  - `TREND STRENGTH` — `Momentum & regime` / `confirmation`.
  - `RISK CALIBRATION` — `Volatility, liquidity &` / `drawdown control`.
- Bottom validation card: `Backtested. Stress Tested. Continuously Learning.` and `Every signal is tested across thousands of market scenarios.`

### Right Column: Actionable Outcome

- Heading: `ACTIONABLE OUTCOME`.
- Supporting line: `Clarity you can act on.`
- Dark navy alert card containing:
  - `AI SIGNAL ALERT` and pill `High Conviction`.
  - `NIFTY 26 JUN 24600 CE`.
  - `247.85` and `+18.65%`.
  - Violet price chart.
  - Footer metadata: `2m ago`, `Breakout`, and `High Probability`.
- White confidence card: `CONFIDENCE SCORE`, `Model agreement` / `across 247+ signals`, and a circular `87%` gauge.
- White quality card: `OPPORTUNITY QUALITY`, `Risk-adjusted edge` / `vs. market baseline`, with four filled violet stars and one outlined star.
- White delivery card: `WHAT YOU RECEIVE`, `Clear setups, levels,` / `timing & risk guidance`, plus `Entry`, `Target`, `SL`, and `R:R` icon labels.
- The outcome cards connect to the central engine through thin lavender paths and violet nodes.

### Bottom Value Row

Four evenly distributed icon-and-copy items:

1. `Speed to Edge` — `From market signal to alert` / `in under 1 second.`
2. `Precision First` — `High-probability only.` / `No noise. No guesswork.`
3. `Risk Aware` — `Every signal is scored,` / `sized, and stress-tested.`
4. `Always Improving` — `Models adapt in real-time` / `as markets evolve.`

## Styling and Scaling

- Use a section-scoped unit derived from the current viewport width and capped at a desktop maximum, mirroring the scaling strategy already used by the hero without sharing or modifying the hero's CSS variables.
- Preserve the 994 × 553 reference proportions at the reference width.
- Use absolute positioning within the reference-ratio canvas for laptop and desktop layouts.
- Reuse the project's existing font variables and closest existing theme colors, with section-local sampled values only where the reference requires a distinct shade.
- Recreate charts, symbols, rings, and connectors as SVG/CSS; do not use the supplied screenshot as page content.
- Keep shadows diffused, borders extremely light, and card corners consistent with the reference.

## Component Structure

- `src/app/components/HowItWorks.js`: section content, repeated card data, and SVG artwork.
- `src/app/components/HowItWorks.module.css`: coordinate system, typography, cards, connectors, glows, and desktop scaling.
- `src/app/page.js`: import and render `HowItWorks` after `Hero`.

The component has no client-side state, network calls, or browser-only APIs, so it remains a server component.

## Data Flow and Error Handling

All displayed values are static reference content. Small repeated structures are driven by local constants to prevent accidental order or text drift. Because there are no runtime inputs or asynchronous operations, no loading or error UI is required. SVG elements that are decorative are hidden from assistive technology; meaningful section headings and labels remain real text.

## Responsive Scope

This phase supports laptop and desktop widths only. The composition scales proportionally while retaining the reference layout. No speculative mobile stacking, hiding, or text changes will be added. Mobile design will be handled in a later phase after explicit user direction.

## Verification

1. Read the installed Next.js 16 documentation relevant to App Router pages, CSS Modules, fonts, and image/SVG usage before implementation.
2. Run ESLint and the production build.
3. Start the existing development server.
4. Capture the new section at 994 × 553-equivalent dimensions and at common laptop/desktop widths.
5. Compare build and reference side by side and with overlays.
6. Iterate until text, headline wrapping, card geometry, connector paths, rings, glows, colors, shadows, icons, and spacing show no visible mismatch.
7. Capture the hero before and after the change and confirm the hero pixels are unchanged.

## Acceptance Criteria

- The section is implemented natively in the existing Next.js application.
- It appears immediately below the current hero.
- The hero is untouched.
- Every visible reference string is present with identical capitalization and order.
- All cards, icons, diagrams, connector paths, rings, nodes, charts, badges, and footer items match the reference.
- The desktop/laptop composition preserves the reference proportions.
- No mobile design decisions are introduced in this phase.
- Lint and production build pass.
- Desktop screenshot comparison passes with no readily visible difference.
