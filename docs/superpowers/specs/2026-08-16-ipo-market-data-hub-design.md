# IPO Market Data Hub Design

## Goal

Rebuild the existing “All IPO market data” content on `/ipo` as the reference-matched green intelligence hub and place it immediately below the IPO hero area. Preserve the current hero, filters, calendar, screener, live provider integration, and all lower-page content.

## Reference Anatomy

- One bordered white shell with a faint green wash and subtle wave lines.
- Header at the upper left: green eyebrow, two-line black headline, and research link.
- Decorative market-report illustration at the upper right, built as lightweight SVG/CSS so it remains crisp at every density.
- Five equal intelligence cards in one desktop row:
  1. Tracked issues
  2. Highest GMP
  3. Largest offers
  4. Recently listed
  5. Issue documents
- Each card has a green icon tile, title, description, circular arrow, and up to three compact numbered rows.
- One full-width investor workflow card beneath the data cards with three sequential stages: Review terms, Check demand, Plan listing.

## Visual System

- Color: ink `#071710`, deep green `#006b42`, action green `#00945b`, soft mint `#eaf7ef`, line `#dfe9e3`, white `#ffffff`.
- Type: existing site Manrope/sans variable for display, body, and utility text; tabular numerals for market values.
- Layout: use the route’s existing 1360px canvas. The hub has 42–48px desktop padding, 14px card gaps, 16px outer radius, and 12px card radii.
- Shadow: restrained green-gray shadow under the shell and cards, matching the supplied reference.
- Icons: custom inline SVG with round caps and joins. No emoji or external icon package.

## Data and Behavior

- Consume `ipo.rows` through the current `ipoCollections` derivations.
- Keep provider empty states visible as em dashes rather than inventing values.
- The research link routes to `/insights`.
- Card arrow controls are accessible links to the relevant in-page destination or existing route.
- The workflow is static explanatory content and remains semantic as an ordered list.

## Responsive Rules

- At widths above 1100px: five equal cards in one row.
- At 701–1100px: two-column card grid; the fifth card spans the available row when helpful; workflow remains three columns.
- At 700px and below: single-column cards, compact header illustration, and a vertically connected workflow. No page-level horizontal overflow.

## Acceptance Criteria

- The hub appears directly beneath the IPO hero and before the tabs, toolbar, and calendar content.
- All reference headings, labels, descriptions, document rows, and workflow stages are present.
- Live IPO collection data populates the first four cards.
- Desktop, tablet, and mobile screenshots preserve hierarchy and alignment without clipping.
- Focus states, semantic lists, and reduced-motion behavior remain accessible.
- Route tests, lint, and production build pass.
