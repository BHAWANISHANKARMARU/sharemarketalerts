# Insights Research Hero Design

## Scope

Rebuild the top research workspace on `/insights` to match the approved desktop reference while preserving the existing navigation and all lower Insights sections. The replacement includes the page introduction, research tabs, category filters, featured participation research card, and compact two-column latest-research list.

## Visual system

- **Palette:** white `#ffffff`, ink `#101725`, emerald `#00664c`, deep emerald `#003f34`, muted text `#5f6775`, line `#e2e6e4`, pale green `#eaf5ee`.
- **Typography:** the existing Manrope site font for headings, body, controls, and data. Use compact uppercase utility labels with restrained letter spacing.
- **Container:** reuse the current Insights canvas width and align every row to one shared left and right edge.
- **Surfaces:** subtle one-pixel green-grey borders, 10–12px radii, and a low-opacity shadow only on the featured card.

## Desktop composition

1. Breadcrumbs remain above the reference block.
2. The intro is left-aligned with the eyebrow, `Research ideas` title, and two-line description. A solid emerald `Open market overview` action sits at the upper right.
3. Four research tabs occupy a single bordered row.
4. Seven category pills sit left in the toolbar and the `Newest first` control sits right.
5. The featured card is a 40/60 split:
   - left: deep emerald participation panel with `72 /100`, comparison badge, subtle contour texture, and a mint trend curve;
   - right: featured category and state, research title and summary, three evidence columns, and the author/action footer.
6. `Latest research` renders beneath the card as two bordered columns with three compact rows each and a `View all research` action.

## Responsive behavior

- At tablet widths, retain two feature columns with reduced padding; allow category controls to scroll horizontally.
- At mobile widths, stack the participation panel above the research body, stack evidence rows, and render latest research as one column.
- The page must have no horizontal viewport overflow at 390px, 768px, or the desktop reference width.

## Interaction and data

- Existing research tabs and category pills remain keyboard-operable buttons.
- Selecting a category updates the featured story using the existing `STORIES` data.
- The sort control is a real button and all route actions use `next/link`.
- The participation display is decorative research context, not fabricated live market data.

## Acceptance criteria

- The visible desktop anatomy, copy, order, spacing hierarchy, card split, evidence blocks, and latest-research list match the supplied reference.
- The default feature is `Market structure`, `Long`, and `Breadth is improving beneath a quiet headline index`.
- The lower Insights sections remain present and unchanged.
- Focus states and reduced-motion behavior remain accessible.
- Focused route tests, ESLint, production build, and desktop/mobile screenshot checks pass.

## Readability scale correction

The approved composition remains unchanged, but the workspace now uses the available viewport more fully. The Insights canvas expands to `calc(100% - 40px)` with a `1600px` ceiling. Body copy targets 13–15px, detail copy targets 11–13px, compact research rows become 64px high, and the feature card grows proportionally so labels and evidence never feel compressed. Tablet and mobile breakpoints retain these readable minimums while stacking the existing anatomy instead of scaling the desktop surface down.
