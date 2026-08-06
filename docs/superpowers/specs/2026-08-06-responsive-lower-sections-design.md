# Responsive Lower Sections Design

## Goal

Make every homepage section below the hero polished, readable, and fully usable on phones and tablets while preserving the approved desktop presentation at widths above 900px.

## Scope

The responsive pass covers, in page order:

1. IPO GMP Tracker
2. How It Works
3. What You Receive
4. Market Intelligence
5. Market Coverage
6. Testimonials
7. Pricing
8. Growth CTA
9. Footer

The mobile hero is already complete and remains unchanged. No content is removed. No dependencies or Git/GitHub operations are introduced.

## Selected approach

Use responsive CSS Modules to reflow the existing semantic components, with small markup additions only where CSS needs explicit data labels or grouping hooks. This preserves one source of truth for every section and isolates the approved desktop CSS from the mobile work.

Rejected alternatives:

- Duplicating every section into separate mobile components would create excessive markup and content drift.
- Scaling the 1920px canvases down as single units is the current failure: content technically fits but is too small to read or use.

## Responsive system

### Breakpoints

- `901px and above`: approved desktop layouts remain unchanged.
- `641px–900px`: tablet layout with centered content, two-column grids where useful, and a maximum readable content width.
- `0–640px`: phone layout with a single primary column and compact secondary grids.

Each section uses normal document flow at 900px and below. Fixed desktop heights, minimum widths, absolute-position-only composition, and desktop canvas scaling are disabled in the responsive layer.

### Shared mobile language

- Page gutters: 20px on phones and 28–36px on tablets.
- Section rhythm: 64–84px vertical padding on phones and 80–104px on tablets.
- Primary heading: clamp between 34px and 52px, balanced over two or three lines.
- Body copy: 15–17px with at least 1.5 line height.
- Cards: white or section-specific dark surface, 14–20px radius, 1px violet-tinted border, restrained shadow.
- Controls: minimum 44px touch height.
- Data: tabular numerals and readable minimum label sizes.
- No page-level horizontal scrolling.
- Decorative connector maps and oversized background flourishes may be hidden or simplified when they reduce clarity.

The existing violet, navy, mint, red, and typography tokens remain the visual source of truth.

## Section designs

### IPO GMP Tracker

- Stack the title and report date panel.
- Show the three KPI cards in one column on phones and three columns on tablets.
- Convert each table row into a readable company card on phones, using explicit field labels for IPO size, issue price, GMP, GMP percentage, listing price, expected gain, and last updated.
- Use a two-column data grid within each company card where width permits.
- Stack the two information cards and keep the source bar readable with wrapping.

### How It Works

- Preserve the heading and explanatory copy at the top.
- Replace the desktop left-to-center-to-right diagram flow with a vertical story: market inputs, AI decision core, actionable outcome.
- Hide only the decorative connector SVG on mobile; all information remains visible.
- Use one-column market input cards on phones and two columns on tablets.
- Keep the intelligence core circular but scale it to the viewport instead of scaling the whole desktop section.
- Stack the alert, confidence, opportunity, and delivery cards below the core.
- Present the four value propositions in a two-column phone grid and four-column tablet grid.

### What You Receive

- Keep the headline and intro first.
- Move the main signal panel into normal flow as the visual anchor.
- Place confidence and timing cards before the signal on wider tablets only when space allows; on phones all supporting cards stack below the signal.
- Convert target, stop-loss, and risk cards into a compact responsive grid.
- Reflow the four benefits into one column on phones and two columns on tablets.

### Market Intelligence

- Turn the desktop split visual into a stacked editorial layout.
- Keep the branded statement and explanatory copy first.
- Render the market dashboard at full available width with its inner information remaining readable.
- Reflow market summaries and opportunity cards into responsive grids rather than shrinking the full dashboard canvas.
- Preserve the supplied decorative artwork without cropping away essential content.

### Market Coverage

- Stack the title and description above the visualization.
- Present the four coverage statistics as a two-column phone/tablet grid.
- Keep the globe as a centered decorative focal point with exchange chips positioned or reflowed around it without overlaps.
- Reflow the “What we cover” list into a full-width card.
- Show bottom category statistics as a two-column phone grid and three-column tablet grid.

### Testimonials

- Stack testimonial cards into one column while retaining portraits and attribution.
- Keep the primary testimonial first, followed by the secondary cards.
- Remove overlapping paper-note positioning on phones and use normal card flow.
- Display proof statistics as a two-column grid on phones and four columns on tablets.

### Pricing

- Keep the heading, billing control, and savings message centered and readable.
- Move the money-back guarantee into a compact full-width card.
- Stack the plans on phones; use up to two columns on tablets when the cards remain at least 300px wide.
- Show the popular plan first in the responsive visual order.
- Keep every feature and CTA, with full-width touch-friendly buttons.
- Reflow the five platform benefits into one column on phones and a wrapping tablet grid.

### Growth CTA

- Keep the headline and introduction centered.
- Reflow the three supporting benefits into a single column on phones.
- Move the result seal into normal flow so it never overlaps copy.
- Convert the dark signup panel into stacked blocks: headline, assurances, email field, CTA, social proof.
- Stack the input and button on phones; place them side by side only when width permits.
- Wrap partner marks into a balanced two- or three-column grid.

### Footer

- Retain the existing responsive foundation but align it with the new 20px phone gutters and tablet rhythm.
- Keep market status, brand statement, navigation groups, signup, trust items, disclaimer, and legal content.
- Use two navigation columns on phones and four on tablets.
- Ensure the email control and legal links wrap without clipping.

## Semantics and accessibility

- Existing headings, sections, lists, tables, forms, and landmarks remain semantic.
- Table-to-card behavior preserves the table in the DOM and adds readable labels rather than duplicating data.
- Focus indicators remain visible.
- Touch targets are at least 44px where interactive.
- Generated or decorative imagery remains non-essential to understanding.
- Reduced-motion preferences remain respected.

## Verification strategy

### Automated regression contract

Add a rendered-page test that confirms all nine lower sections still exist in the approved order and that the IPO table exposes mobile field labels.

### Browser geometry checks

At 390px, 768px, and 900px:

- no section exceeds the viewport width;
- no page-level horizontal overflow exists;
- each section has a non-zero, natural-flow height;
- major cards are at least 280px wide on phones where applicable;
- text does not rely on a scaled 1920px canvas.

### Visual checks

Capture the full page at 390px, 768px, 900px, and 1920px. Inspect every section boundary, card stack, table card, image crop, and footer. Preserve a desktop-before screenshot and require an exact pixel match after responsive changes.

### Quality gates

- Full Node test suite passes.
- ESLint passes.
- Next.js production build succeeds.
- The existing multiple-lockfile workspace warning remains non-blocking.

## Acceptance criteria

- Every section below the hero is readable and polished at phone and tablet widths.
- All existing content remains available.
- No page-level horizontal overflow occurs at 390px, 768px, or 900px.
- Desktop pixels are unchanged at 1920px.
- No lower section is reduced to a tiny scaled desktop screenshot.
- Tests, lint, and production build pass.
