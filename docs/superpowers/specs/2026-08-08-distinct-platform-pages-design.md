# Distinct Platform Pages — Design Specification

## Goal

Replace the six repeated marketing-page bodies with six useful product experiences. Navigation, homepage layout, footer, business logic, and existing market providers remain intact. The pages share typography, spacing, color tokens, and navigation, but not a common hero/content template.

## Product direction

The visual language is editorial fintech: Manrope typography, ink and warm-white surfaces, restrained lilac accents, precise tables, generous spacing, and semantic green/red market states. Each page must have a different information hierarchy and interaction model while feeling like one product.

## Page compositions

- **Markets:** live session overview, index strip, NIFTY trend, market breadth, sector heat map, movers, and global-session handoff.
- **IPO:** primary-market desk, searchable live IPO table, issue calendar, demand-quality framework, and GMP guidance.
- **Products:** connected product-suite map, module details, end-to-end workflow, capability matrix, and delivery surfaces.
- **Insights:** editorial lead story, research feed, theme board, weekly event watch, and transparent research method.
- **Stock Alerts:** interactive rule builder, live rule preview, proven alert templates, recent triggers, routing, and noise controls.
- **Live Markets:** dark real-time command centre with index tape, trend chart, movers, ranked opportunities, breadth, and risk radar.

## Data and behavior

Markets, IPO, Stock Alerts, and Live Markets consume `getHomeMarketData()` and the existing `MarketDataProvider`, preserving the provider's 60-second refresh. Products and Insights use deterministic product/editorial content. No new external dependency or backend write is introduced.

## Responsive behavior

Desktop layouts collapse deliberately instead of scaling down. Tables remain horizontally scrollable, dense grids become stacked cards, controls retain a minimum 16px mobile font, and all touch targets remain usable. The shared header and footer keep current behavior.

## Scope boundaries

- Keep all existing homepage sections and visual layout.
- Keep the existing navigation destinations and footer.
- Remove the rejected `PlatformPage` and `platformPageData` abstraction after replacement.
- Do not create six cosmetic variants of one DOM structure.

## Verification

Source-contract tests require six independent experience components, live-data wiring on relevant routes, unique page landmarks, accessible controls, and shared navigation. Complete with lint, a production build, desktop route screenshots, and mobile overflow/font checks.
