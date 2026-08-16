# IPO Reading Guide Design

## Scope

Restyle the existing “Read the issue, not only the premium” content at the bottom of `/ipo`. Keep all other IPO page content and behavior unchanged. The section remains immediately above the data-source note.

## Structure

Create a focused `IpoReadingGuide` component with its own CSS Module. The component renders a two-column desktop composition: an editorial introduction on the left and four cards in a 2×2 grid on the right. At narrow widths, the introduction and cards stack into one column.

## Visual specification

- White section with a faint grey top rule and generous vertical padding.
- Left column: short green eyebrow stroke and dot, a three-line 42–44px heading, a second green rule, and the supplied paragraph in muted slate.
- Decorative lower-left field: sparse green dots plus a translucent diagonal green wash; it must not obscure text.
- Cards: white-to-off-white surface, thin cool-grey border, subtle shadow, clipped top-right and bottom-right corners, and a solid green bottom-right fold.
- Card anatomy: green two-digit number, short green divider, black title, second green divider, muted body copy, and a pale green circular icon surface in the upper-right.
- Icons are inline, accessible-hidden SVG line drawings representing demand, valuation, proceeds, and risk.
- Exact text and order remain unchanged.

## Responsive behavior

Desktop uses the reference proportions with the card grid wider than the intro. Tablet keeps two card columns where space permits. Mobile stacks the introduction and all four cards, preserves clipped corners and icon placement, and introduces no horizontal overflow.

## Verification

Add a source-level rendering test for exact copy, item count, semantic structure, component placement, and icon labels. Run the focused test red before implementation and green afterward, then run the full test suite, lint, and production build. Capture `/ipo` at the 1252×711 reference viewport and at 390px, compare the target section against the supplied image, and iterate on measurable mismatches.
