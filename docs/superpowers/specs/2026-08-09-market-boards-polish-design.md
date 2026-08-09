# Market Boards Polish Design

## Goal

Turn the existing Most Active and Earnings Watch boards into a cohesive premium fintech workspace without changing their data, ordering, or behavior.

## Visual system

- **Ink:** `#17142a` for titles and primary values.
- **Muted:** `#747087` for descriptions and timing.
- **Purple:** `#7900ff` for active controls, focus, and timeline accents.
- **Lavender:** `#f7efff` for selected/secondary surfaces.
- **Positive:** `#009f72` with a pale green background for gains.
- **Line:** `#ebe7f2` for quiet separators and borders.
- **Type:** Manrope throughout; tabular numerals for market values.

## Layout

- Retain the existing two-column desktop grid and one-column layout below 900px.
- Use equal-height white cards with 16px radii, soft violet-tinted shadows, and generous internal rhythm.
- Give each header a compact purple icon tile, a stronger title/subtitle hierarchy, and a lavender segmented filter rail.
- Present stock rows as clean, hoverable market records with a 40px instrument mark, aligned name/price/change columns, and a pale-green change pill.
- Turn the Earnings list into a connected vertical timeline. Day labels become compact uppercase pills; the instrument mark sits on the timeline; estimates remain right-aligned.
- Style the screener link and earnings disclaimer as clear card footers rather than loose text.

## Interaction and accessibility

- Keep the existing live collection switching and screener link.
- Preserve semantic ordered lists, buttons, links, and accessible pressed states.
- Add visible hover and focus states without moving layout.
- Respect `prefers-reduced-motion`.

## Responsive behavior

- At 900px and below, stack the cards with full-width headers.
- At 700px and below, keep filters horizontally scrollable, retain readable 44px controls, collapse the stock row to name/value/change, and keep the earnings timeline intact.
- Do not introduce page-level horizontal overflow.

## Acceptance criteria

- Both cards share the same visual system and aligned outer geometry.
- Prices, estimates, and changes line up consistently.
- Filters remain functional and clearly selected.
- Mobile and tablet layouts remain readable with zero horizontal overflow.
- Full tests, scoped lint, and production build pass.

## Constraints

- Follow installed Next.js 16.2.12 documentation.
- Do not change live Yahoo data wiring.
- Do not perform Git operations.

