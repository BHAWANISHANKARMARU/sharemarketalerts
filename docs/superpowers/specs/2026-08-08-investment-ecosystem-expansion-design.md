# Investment Ecosystem Expansion Design

**Date:** 2026-08-08
**Status:** Approved for planning
**Reference products:** Angel One and Groww public product surfaces
**Target:** ShareMarketAlerts inner application pages only

## Objective

Expand ShareMarketAlerts from a market-intelligence workspace into a broad research and investment-planning ecosystem. The result must cover the major product and utility categories users expect from modern Indian investing platforms while preserving ShareMarketAlerts branding, the existing premium analytical design language, and the current homepage.

This work translates product categories and interaction patterns. It does not copy competitor branding, proprietary text, account systems, private datasets, or real-money transaction flows.

## Non-negotiable constraints

- Do not change the homepage or its layout.
- Keep the existing primary navbar destinations unchanged.
- Preserve the existing Next.js App Router architecture, responsive behavior, live market provider, Recharts implementation, and business logic.
- New destinations are reached through the Products workspace and contextual links inside existing inner pages.
- Do not simulate account creation, KYC, deposits, withdrawals, broker connectivity, or real order placement.
- Do not present illustrative values as live market facts.
- Every non-live dataset must be labelled as illustrative, educational, or planning-only.
- Keep Manrope typography, compact borders, restrained blue accents, semantic green/red states, and the existing light analytical workspace.
- Mobile controls must remain readable: 16px form controls, at least 12px utility text, 44px minimum primary touch targets, and no document-level horizontal overflow.

## Information architecture

### Existing primary destinations

The primary navigation remains:

1. Home
2. Markets
3. IPO
4. Products
5. Insights
6. Stock Alerts
7. Live Markets

### New secondary destinations

The Products workspace and relevant market sections will link to five new App Router pages:

- `/mutual-funds`
- `/etfs-bonds`
- `/futures-options`
- `/calculators`
- `/portfolio`

These routes are secondary tools, not primary navbar items. This preserves the approved navigation while making the full ecosystem discoverable.

## Page designs

### Mutual Funds

Purpose: research, compare, and plan fund investments without implying recommendations.

Content and tools:

- Category navigation for equity, debt, hybrid, index, ELSS, and international funds.
- Fund screener with search, risk, category, horizon, and plan-type controls.
- Comparison table covering category, risk level, expense ratio, minimum investment, and illustrative return scenarios.
- SIP planner with monthly amount, horizon, and assumed annual-return controls.
- Goal projection with invested amount, estimated value, and gain decomposition.
- NFO education and tracker surface, clearly labelled when no live provider exists.
- AMC directory and fund-selection checklist.
- Risk, taxation, and direct-versus-regular educational notes.

### ETFs & Bonds

Purpose: combine exchange-traded diversification and fixed-income comparison in one workspace.

Content and tools:

- Tabs for index ETFs, gold ETFs, silver ETFs, international ETFs, debt ETFs, government bonds, and corporate bonds.
- ETF screener with asset class, tracking type, liquidity, and cost filters.
- Bond ladder planner with maturity buckets and illustrative yield inputs.
- Comparison table for price/NAV context, expense ratio, tracking difference, yield, maturity, and risk.
- Asset-allocation explainer and fixed-income risk checklist.
- Links to existing market, alert, and portfolio workflows.

### Futures & Options

Purpose: provide derivatives analysis and education without enabling real trades.

Content and tools:

- Underlying selector, expiry selector, spot context, and session state.
- Option-chain table with calls, strikes, puts, open-interest visualisation, and at-the-money emphasis.
- Payoff builder with long call, long put, bull call spread, bear put spread, and straddle templates.
- Position-leg editor and payoff summary.
- Futures overview with contract month, basis, lot-size context, and expiry.
- Commodity directory for gold, silver, crude oil, and natural gas.
- Margin estimator clearly labelled as illustrative.
- Risk disclosures covering leverage, expiry, assignment, and liquidity.

All chain and margin values that are not connected to a live derivatives provider must be deterministic interface examples and visibly labelled.

### Calculators

Purpose: provide transparent planning utilities rather than sales funnels.

Calculators:

- SIP
- Lump sum
- SWP
- CAGR
- Brokerage and transaction-cost estimate
- Margin estimate
- Goal planner
- Required monthly investment

Each calculator provides editable inputs, immediate computed output, a decomposition of assumptions, and an educational disclaimer. Calculations must be deterministic and tested as pure functions where practical.

### Portfolio

Purpose: demonstrate a coherent holdings and risk workspace without pretending to persist brokerage data.

Content and tools:

- Portfolio summary for invested value, current value, total return, and day movement.
- Holdings table with allocation, cost basis, current value, P&L, and contribution.
- Asset-allocation view across equities, funds, ETFs, bonds, and cash.
- Sector concentration, position concentration, and risk flags.
- Watchlist with existing market-provider quotes where available.
- Corporate-event queue for earnings, dividends, splits, bonuses, buybacks, and IPO events.
- Goal buckets and investment-plan reminders.
- Clear local-demo state notice; no claim of broker sync or persistence.

## Existing-page extensions

### Markets

Add contextual entry points for ETFs, bonds, mutual funds, derivatives, stock events, dividends, bonuses, and buybacks. Keep the existing broad TradingView-style market workspace and live Yahoo-backed data.

### IPO

Add subscription-status education, allotment workflow, issue-document checklist, and portfolio/watchlist handoff. Do not create a fake allotment result.

### Products

Become the complete ecosystem directory. Add the five new destinations to the existing tool catalogue and group all tools by Research, Investing, Trading, Automation, and Planning.

### Insights

Add beginner-to-advanced learning paths for mutual funds, ETFs, bonds, derivatives, portfolio construction, taxation basics, and risk management. Content remains educational and original.

### Stock Alerts

Add event-alert templates for earnings, dividends, splits, bonuses, buybacks, IPO milestones, mutual-fund plan reminders, and portfolio concentration warnings. Only existing price-based alerts are described as live.

### Live Markets

Add intraday monitor collections, ETF watch, derivatives entry points, stock-event queue, and watchlist handoff. Preserve the existing screener and market provider.

## Shared architecture

### Components

Create reusable investment-workspace primitives under `src/app/components/investing/`:

- `InvestmentWorkspaceHeader`
- `ProductCategoryTabs`
- `MetricStrip`
- `ScreenerToolbar`
- `ComparisonTable`
- `CalculatorField`
- `ResultBreakdown`
- `DisclosureNote`

Use the existing `WorkspacePrimitives` and `TradingWorkspace.module.css` tokens where they already solve the problem. Add a focused `InvestmentWorkspace.module.css` for new page-specific layouts rather than further enlarging unrelated homepage styles.

### Data contracts

- Existing stock, index, currency, commodity, and chart values continue through `MarketDataProvider`.
- Planning calculators use deterministic local functions.
- Product catalogues, educational checklists, and unavailable market datasets are explicit local content modules.
- Illustrative market tables carry a visible `Illustrative` or `Planning example` label.
- Do not add an external provider unless its reliability, attribution, cache behavior, and fallback are implemented and tested.

### State and interaction

- Screeners filter client-side content.
- Calculators update immediately from controlled inputs.
- Portfolio demo holdings use component state only and reset on refresh.
- Tabs and filters must have accessible names, pressed/selected states, and keyboard support.
- Tables scroll inside their own containers on mobile; the document itself never overflows horizontally.

## Visual design

- Background: white workspace with very light blue-grey control surfaces.
- Text: `#131722`; secondary text: `#6a6d78`.
- Accent: `#2962ff`; semantic positive: `#089981`; semantic negative: `#f23645`.
- Panels: 1px `#e0e3eb` borders, 12px radius, no heavy shadows.
- Data tables: sticky headers, tabular numerals, restrained row hover, internal horizontal scrolling.
- New analytical charts reuse the premium Recharts treatment: monotone curves, 2.75px rounded stroke, subtle area fill, no persistent markers, 700ms animation, and glass tooltip.
- Dense utilities use whitespace and alignment rather than decorative illustrations.

## Error handling and truthfulness

- Existing live-provider failures retain last-known fallback behavior and source labels.
- Invalid calculator inputs are clamped or produce a clear inline validation message.
- Empty screeners show an actionable empty state.
- Any illustrative dataset is labelled at the panel level and again in the page disclosure.
- No projected return is described as guaranteed.
- Derivatives pages include a prominent leverage-risk disclosure.

## Testing and acceptance criteria

Automated checks must confirm:

- All five new routes exist and render independent page components.
- The homepage does not import or render the new investment workspace.
- Products links to every new secondary route.
- All calculator functions produce expected deterministic results.
- Existing live-market routes retain `MarketDataProvider` and 60-second revalidation.
- Illustrative datasets display a disclosure label.
- Mobile CSS includes 16px controls and contained table overflow.
- Existing chart visual-system tests continue to pass.
- ESLint and the Next.js production build pass.

Visual QA must confirm:

- Desktop views at 1440px are information-dense without crowding.
- Mobile views at 390px have no document-level horizontal overflow.
- Form controls remain readable and at least 44px tall where primary.
- Each new page is visually part of the same workspace but has a distinct domain-specific information hierarchy.
- The homepage remains visually unchanged.

## Out of scope

- Real-money orders or investments
- Broker login or account linking
- KYC, payments, withdrawals, or bank mandates
- Live portfolio sync
- Real IPO applications or allotment lookup
- Recommendations, guaranteed returns, or personalised financial advice
- Copying Angel One/Groww trademarks, product copy, customer statistics, testimonials, or proprietary data
