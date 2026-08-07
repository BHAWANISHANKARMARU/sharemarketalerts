# Trading Workspace Inner Pages — Design Specification

## Objective

Redesign the six inner routes as a cohesive, utility-first market platform using the information density and interaction patterns found across TradingView's market overview, stock collections, screener, calendar, ideas, and alerts surfaces. The implementation must remain recognizably ShareMarketAlerts: use the existing logo, navigation destinations, semantic market colours, data providers, and original product copy.

The homepage is explicitly out of scope and must not receive visual or structural changes.

## Design language

Inner routes use a bright working canvas with near-black text, cool grey controls, fine neutral dividers, compact 8–12px radii, and blue-violet only for active or primary states. Large decorative marketing heroes are removed from inner pages. Information starts close to the shared header and follows this hierarchy:

1. Breadcrumb or product selector
2. Compact page title and supporting sentence
3. Route-specific tabs, filters, or date controls
4. Primary working surface: chart, table, calendar, feed, or rule editor
5. Supporting market context and education below the tool

Typography remains Manrope. Data uses tabular numerals. Green and red remain reserved for positive and negative market state, with an icon or label where state would otherwise depend on colour alone.

## Shared inner-page shell

- Keep the existing ShareMarketAlerts logo and seven navigation destinations.
- Restyle only the inner-route header into a compact utility header with search affordance, active route state, login, and start-free action.
- Use a maximum-width market canvas on overview/editorial pages and full-width workspaces on screener-style pages.
- Provide a mobile menu with at least 16px navigation text and 44px touch targets.
- Preserve Next.js `Link` navigation so route transitions remain client-side.
- Keep the current footer unless a full-screen workspace route intentionally places it after the complete tool.

## Route designs

### Markets

Model the route after a market overview, not a campaign page. It contains a breadcrumb, India market selector, `Overview` heading, a tab strip, a two-column market summary with the live NIFTY chart and sector-performance panel, compact index cards, earnings watch, most-active and unusual-volume lists, market movers, and a sector heat map. Existing live market data supplies indices, chart, gainers, losers, and coverage. Deterministic fallback data fills unsupported sector and calendar fields.

### IPO

Use a calendar-and-screener composition. A compact `IPO Calendar` heading is followed by date/status filters, summary metrics, a chronological issue calendar, and a wide comparison table. The table includes company, status, issue size, price band, GMP, estimated listing, and signal quality. A lower guide explains how to interpret demand, proceeds, valuation, and GMP without presenting GMP as investment advice.

### Products

Use a product directory rather than a marketing hero. A compact product selector introduces four working tools: Market Lens, Signal Engine, IPO Desk, and Alert Router. The page shows a left category rail, a large selected-tool preview, workflow details, capability comparison, and delivery/integration surfaces. Each product links to the relevant live route.

### Insights

Use an ideas-and-news research feed. The route includes topic tabs, a featured research card, a responsive feed of actionable notes, market themes, authorship/read-time metadata, and a week-ahead event rail. Content remains original ShareMarketAlerts research copy and avoids importing TradingView community content.

### Stock Alerts

Use a chart-workspace composition: instrument toolbar, large live chart, compact right-side alert composer, active-rule table, recent triggers, and delivery-state controls. Existing live instruments populate the selector. Rule composition remains local and non-destructive; the existing mail action remains the final handoff because no alert persistence backend exists.

### Live Markets

Use the densest screener-style layout. Place market selector, filter chips, column-set tabs, refresh state, and a sortable-looking full-width market table above compact breadth, movers, opportunities, and risk panels. Existing provider data refreshes every 60 seconds. Unsupported fundamental columns use clearly deterministic demonstration values and must not be labelled as live exchange fundamentals.

## Data and interaction

- Preserve `getHomeMarketData()` and `MarketDataProvider` on Markets, IPO, Stock Alerts, and Live Markets.
- Preserve the current 60-second refresh interval and fallback behavior.
- Keep Recharts and the existing premium chart rules: monotone curve, 2.75px rounded stroke, 18% to 0% area gradient, no point markers except hover, subtle horizontal grid, glass tooltip, and 700ms draw animation.
- Filters, tabs, period selectors, IPO search, mover modes, and the alert composer must respond locally.
- Never invent a successful server write. Buttons requiring unavailable persistence use a clearly scoped email handoff or local preview.

## Responsive behavior

- At mobile widths, overview grids stack and tables scroll inside their own containers without increasing document width.
- Filter rows become horizontally scrollable chip rails.
- Form controls use at least 16px text to prevent browser zoom and improve readability.
- Dense utility labels use at least 10px; primary table values use at least 12px.
- Chart and composer surfaces keep their information hierarchy rather than shrinking desktop dimensions proportionally.
- The document width must equal the viewport at 390px across every route.

## Accessibility and quality

- Preserve semantic headings, tables, labels, `aria-pressed`, `aria-current`, and accessible tooltips.
- Interactive controls must have visible focus states and at least 44px mobile targets.
- Respect `prefers-reduced-motion`.
- Do not ship TradingView trademarks, logos, copied articles, or proprietary page text.
- Use the reference for layout density, control anatomy, hierarchy, and workflow patterns only.

## Verification

- Add route contracts for utility headers, route-specific working surfaces, live-provider wiring, and homepage exclusion.
- Run all Node tests, ESLint, and a Next.js production build.
- Capture desktop and 390px mobile screenshots for all six routes.
- Verify active navigation, local interactions, chart rendering, mobile control size, table containment, and zero document-level horizontal overflow.
- Compare the result against the reference patterns: compact page opening, dense but readable controls, tables that dominate analytical routes, restrained rounding, fine dividers, and no repeated marketing hero template.
