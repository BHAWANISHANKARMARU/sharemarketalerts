# Markets Icon Surface Design

## Objective

Make every icon on `/markets` clearer, larger, and correctly aligned without changing the page layout, card design, market data, or business logic.

## Scope

The update covers all icon contexts rendered on `/markets`:

- overview hero metrics, market summary, sector performance, and index cards;
- quote activity and earnings cards;
- sector heatmap heading and sector cards;
- global market heading, index rail, regional tables, and market movers;
- shared company and index logo marks used by these sections.

Navigation and icons on other routes remain unchanged.

## Visual System

Every icon receives a white surface, a subtle neutral or brand-tinted border, and a restrained shadow. Semantic foreground colors remain unchanged: purple for platform actions, green and red for market direction, and original brand colors for company or index logos.

Icons use three context-aware sizes instead of one universal size:

- prominent icons for section headings and featured heatmap cards;
- standard icons for cards and timelines;
- compact icons for dense tables and market rows.

The icon artwork grows approximately 15–20 percent within each surface. Real logos use consistent inner padding and `object-fit: contain`; SVG glyphs remain centered with even optical space.

## Alignment

All icon surfaces use fixed square dimensions, `flex: 0 0 auto`, and grid centering. Parent rows align items centrally and use consistent gaps, preventing icons from drifting above, below, or into adjacent labels. Mobile rules preserve the same visual hierarchy without forcing text to wrap unnecessarily.

## Implementation Boundaries

The existing `InstrumentMark` component remains the shared logo renderer. The change is limited to its `/markets` CSS contexts plus page-specific icon holders in the markets workspace and overview hero. No component replacement, data transformation, navigation change, or card/layout redesign is included.

## Responsive Behavior

Desktop and wide-screen icon surfaces increase proportionally with the existing typography. Tablet and mobile sizes remain large enough to recognize while respecting dense rows. Brand-logo padding and centering remain identical at every breakpoint.

## Verification

Automated render tests will verify that markets icon contexts use the shared surface behavior. Browser screenshots at desktop and mobile widths will be inspected for centering, clipping, row alignment, logo legibility, and accidental layout shifts. The existing market tests, ESLint, and production build must remain clean.
