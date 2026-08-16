# Insights Market Stories Design

## Scope

Replace only the existing `Top market stories` section on `/insights` with the approved five-row editorial panel. Preserve all surrounding Insights sections and their order.

## Composition

- A white bordered surface with restrained shadow and 12px corners.
- Header with a short emerald vertical rail, `Top market stories`, the supplied supporting line, and the market-overview link on the right.
- Five equal rows containing the ordinal, a tone-specific circular line icon, uppercase category, supplied headline, desk label, and `Read` action.
- A pale green subscription strip beneath the list with an envelope icon, concise message, email field, and green subscribe button.

## Responsive behavior

- Desktop keeps the reference grid and generous whitespace.
- Tablet reduces secondary-column width while retaining a single row per story.
- Mobile stacks the desk label and action beneath the headline, keeps a 44px icon target, and never reduces body copy below 12px.
- No horizontal viewport overflow at 390px, 768px, or desktop widths.

## Implementation boundary

Use a dedicated CSS module imported only by `InsightsExperience.js`. Reuse the existing `ResearchGlyph` icon system and current Next.js route. No shared page sections, data providers, or navigation are changed.

## Verification

The route contract must expose one market-stories landmark, exactly five story rows, and the subscription strip. Verify with desktop/mobile screenshots, focused route tests, ESLint, and a live HTTP response.
