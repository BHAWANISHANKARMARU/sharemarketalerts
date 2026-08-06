# Market Coverage Section Design

**Date:** 2026-08-03  
**Status:** Implemented and verified  
**Reference:** `/tmp/codex-clipboard-LFZ6Ch.png`

## Objective

Reproduce the supplied Market Coverage reference as a native Next.js section and append it after the existing `MarketIntelligence` section. Existing page sections must remain visually and structurally unchanged. The current scope is desktop and laptop rendering; mobile adaptation is intentionally deferred.

## Reference Boundary

The black area around the supplied image is external screenshot framing and is not part of the component. The implementation reproduces the rounded, near-white Market Coverage panel beginning inside that frame.

## Architecture

- Add one isolated React Server Component: `src/app/components/MarketCoverage.js`.
- Add one isolated CSS Module: `src/app/components/MarketCoverage.module.css`.
- Import and render the component after `MarketIntelligence` in `src/app/page.js`.
- Use no client-side JavaScript, animation, network requests, or third-party UI packages.
- Use the exact reference-derived central globe crop requested in the final revision; keep market sparklines and interface icons as inline SVG.
- Use the existing Figtree sans-serif and Playfair Display serif variables from the application layout.

## Layout and Visual Treatment

The section is a fixed reference-coordinate composition that scales proportionally from laptop to large desktop widths. It uses a pale white/lavender canvas with soft radial glows, rounded cards, thin lavender borders, subtle purple shadows, and the existing ink/purple/mint palette.

The composition contains:

1. A centered header with the `MARKET COVERAGE` eyebrow, the title `Every market. One intelligence.`, and the exact two-line supporting copy from the reference.
2. A four-item statistic rail on the left for exchanges, instruments, market scanning, and uptime.
3. A central luminous dotted globe with latitude/longitude structure, orbital arcs, connection nodes, and six floating market cards for NSE, NASDAQ, BSE, FOREX, COMMODITIES, and GLOBAL MARKETS.
4. A right-side `What we cover` card containing six rows with exact labels, supporting copy, icons, separators, and chevrons.
5. A six-column bottom summary strip for Indices, Stocks, Sectors, Commodities, Forex, and Global Markets.
6. The centered footer statement `One platform. Every market. Endless opportunities.` with `Every market.` in the purple italic serif treatment.

## Content Fidelity

All visible labels, numeric values, percentage changes, capitalization, punctuation, and ordering match the reference. The interface remains native; only the central globe uses the user-approved reference-derived local image asset.

## Responsive Scope

- Desktop and laptop only for this pass.
- The component scales proportionally and preserves the reference composition without rearranging its columns.
- At narrower widths outside the approved desktop/laptop scope, the same proportional canvas remains intact rather than introducing an unapproved mobile redesign.

## Verification

- Add a focused render test that asserts section placement, required copy, all six market cards, all six coverage rows, all six summary items, accessible SVG treatment, and absence of client-only behavior.
- Run the focused test, lint, and production build.
- Render the section locally at reference-width, 1366px, and 1920px desktop viewports.
- Compare screenshots against the reference and iteratively calibrate geometry, typography, colors, shadows, and SVG details.
- Recalculate the previously recorded hashes for every existing component to verify that only the new component and its page insertion changed.

## Non-Goals

- No changes to the hero or any existing section.
- No Git operations.
- No interactions or live market data.
- No mobile-specific rearrangement in this pass.
