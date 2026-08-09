# Markets Hero Live Controls Design

## Objective

Improve the visual hierarchy of “Indian stocks” and “Overview” while preserving the approved pixel-matched desktop geometry. Make every visible control in the `/markets` overview hero clearly interactive and expose live-data state without causing layout shifts.

## Header treatment

- Keep Manrope as the sans-serif font.
- Style “Indian stocks” as a compact market selector with a clearer flag, stronger 700 weight, balanced letter spacing, and an animated chevron.
- Style “Overview” as the primary hero heading with cleaner weight, line height, spacing, hover/focus treatment, and an animated chevron.
- Preserve the current header, artwork, tabs, dashboard, and metric positions at the validated 1240px and 1920px desktop widths.

## Interactions

- The market selector opens an accessible popover showing Indian stocks as the active market and the four live indices already displayed by the dashboard.
- The Overview selector opens an accessible menu for Overview, Performance, and Technicals and stays synchronized with the existing tabs.
- Tabs remain keyboard-accessible and change the active view.
- Range buttons continue requesting `/api/market/chart`, visibly indicate loading, and keep the last successful chart if the provider fails.
- Index cards remain functional external quote links; the sector action continues scrolling to the heatmap.

## Live feedback

- Add a small live-status dot and pulse only when the market/API model is live.
- Animate the clock/status icon subtly and refresh the visible IST timestamp from the latest payload.
- Give metric and index icons restrained hover/focus motion so they visibly respond without distracting from the data.
- Surface loading, refreshed, fallback, and error states accessibly. Decorative motion must stop under `prefers-reduced-motion`.

## Data and failure behavior

- Reuse the existing Yahoo-backed market model and `/api/market/chart`; do not add another provider.
- Do not fabricate changing values. When live data is unavailable, preserve the last successful data and label the state as delayed/fallback.
- Abort superseded chart requests and prevent stale responses from replacing the active range.

## Verification

- Add focused tests for selector/menu behavior, live-state markup, chart loading/fallback behavior, and the approved geometry.
- Verify keyboard focus, escape/outside-click closing, reduced motion, 1240px and 1920px screenshots, lint for touched files, and a production build.

