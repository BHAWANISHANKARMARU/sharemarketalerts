# Markets Overview Dashboard Design

## Objective

Replace the complete top analytical dashboard on `/markets` with the supplied Indian-stocks reference while preserving the existing site header and every market section below the dashboard. The initial desktop composition must visually match the 1260×698 reference: title and copy at upper left, exchange artwork at upper right, a compact tab rail, the three-column overview board, and the six-card market-stat strip.

## Approved scope

- Route: `/markets` only.
- Replace the existing `marketTitle`, top `workspaceTabs`, `marketSummary`, and `indexSnapshot` composition.
- Keep `marketBoards`, sector heatmap, market directory, calendars, research, shared header, footer, and all other routes unchanged.
- Use the supplied 1536×1024 market-building image as the source for the right-side artwork. Preserve the full composition and aspect ratio; do not crop it.
- Use live Yahoo-backed server data already provided by `getHomeMarketData()`, refresh through the existing `MarketDataProvider`, and retain last-known fallback behavior.

## Visual system

### Canvas

- Near-white background with a restrained lavender cast: `#fcfbff` to `#f8f5ff`.
- Dashboard max width follows the existing 1360px workspace canvas and has approximately 42px desktop side insets.
- Primary cards use white backgrounds, `#e9e4f0` borders, 16–18px radii, and a soft cool-purple shadow.
- Use Manrope throughout; all numeric data uses tabular figures.

### Header artwork and copy

- Indian flag badge and “Indian stocks” appear in one bold 24px row.
- “Overview” is a separate 31–34px heading with a downward chevron.
- Supporting copy is two lines at 14px with muted `#6b6d7c` color.
- The supplied exchange image occupies the upper-right half, is aligned to the baseline above the tabs, and uses `object-fit: contain` with its complete bounds visible.
- A purple market path overlays or aligns with the artwork only when needed to match the reference. The market-status card sits at the far right with live open/closed text and the latest IST timestamp.

### Tabs

- One rounded rail contains Overview, Performance, and Technicals.
- The selected tab has purple text and a 2px purple underline; the remaining tabs are dark neutral.
- Buttons remain keyboard accessible and preserve the existing `view` state.

### Main board

- Desktop grid ratios: main chart `1.72fr`, sector card `0.98fr`, quote rail `0.86fr`.
- Main market-summary card includes title/status, a compact 1D/5D/1M/6M/1Y segmented control, live NIFTY 50 headline data, and a premium purple Recharts area line.
- The chart is monotone, 2.5–3px, marker-free at rest, softly filled, and uses four subtle horizontal grid lines with no vertical grid or visible axis line.
- Sector performance contains seven ranked rows with purple progress rules and green percentages matching the reference structure.
- The right rail contains four independent live quote cards for NIFTY 50, SENSEX, BANK NIFTY, and INDIA VIX, each with a tinted square mark, value/change, and a compact sparkline.

### Market-stat strip

- Six equal cards reproduce Advance / Decline, Market Breadth, FII Net Flow, Put / Call Ratio, New 52W High, and New 52W Low.
- Use available live/derived values where the Yahoo snapshot supports them. Use deterministic reference fallbacks for metrics Yahoo does not expose, so layout never collapses during provider failure.

## Data and interaction

- Initial prices, changes, chart points, market status, and update time come from the existing server-rendered Yahoo snapshot.
- The period selector calls `/api/market/chart` and replaces only the NIFTY chart after a successful response. The previous chart remains visible on failure.
- Add 6M support to the central range configuration and API allow-list.
- Refreshes from `MarketDataProvider` update headline values and quote cards without layout shift.
- Sector numbers remain deterministic reference values until a stable provider exists; they are not presented as direct Yahoo quotes.
- All external index quote cards remain links to their existing Yahoo destinations.

## Responsive behavior

- Desktop at 1260px and above mirrors the reference composition.
- Tablet collapses the quote rail beneath the chart/sector pair, retaining two columns where practical.
- Mobile uses a single-column flow: copy, contained artwork/status, scroll-safe tabs, main chart, sector list, quote cards, and two-column KPI cards. Text never drops below 12px.
- The artwork remains uncropped at every breakpoint.

## Verification

- Add behavioral tests for the shared period configuration and market overview model before implementation.
- Run the targeted Node tests, full test suite, lint, and production build.
- Capture `/markets` at the reference desktop width and a mobile width with headless Chrome.
- Compare the desktop capture with the supplied screenshot and adjust spacing, scale, typography, borders, and alignment in iterative passes.

