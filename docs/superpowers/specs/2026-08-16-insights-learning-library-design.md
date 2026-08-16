# Insights Learning Library Design

## Scope

Replace only the existing learning-library section near the bottom of `/insights`. Preserve the four supplied guide titles, descriptions, link labels, destinations, and order.

## Desktop composition

- Use a wide two-column section matching the supplied reference: an editorial introduction on the left and a 2×2 card grid on the right.
- The left column contains the “Learning library” eyebrow, the two-line “Build a better market process” heading, the supplied supporting sentence, and a compact callout with a pale-purple icon tile and vertical purple rule.
- The right column contains four equal-height bordered cards with generous white space and restrained shadows.
- Each card begins with a numbered tinted square and a simple line icon. Use the reference sequence: green, purple, amber, blue.
- Each card contains its existing title, description, and “Open guide ↗” link. Links use the section’s purple action colour, as in the reference.

## Responsive behavior

- Above 900px: left introduction plus right 2×2 cards.
- From 601px through 900px: introduction above a 2×2 card grid.
- At 600px and below: introduction, callout, and all four cards stack in one column.
- Typography and padding scale down without reducing body copy below 13px or creating horizontal overflow.
- Section height remains content-driven at every width.

## Component boundary

- Extract the section into `InsightsLearningLibrary.js` with a dedicated CSS module so the large shared `TradingWorkspace.module.css` does not gain another bespoke visual system.
- `InsightsExperience.js` imports and renders the component at the current learning-library position.
- The component owns its static guide data and inline line icons; it depends only on Next.js `Link` and its CSS module.

## Accessibility and verification

- Retain semantic section, heading, article, and link elements.
- Mark decorative icons as hidden from assistive technology.
- Add a focused route/render test for exact content and four-card order.
- Add responsive computed-style checks for 2×2 desktop/tablet behavior, single-column mobile behavior, readable font sizes, and no horizontal overflow.
- Capture and inspect desktop, tablet, and approximately 390px mobile renders; run scoped lint, production build, and `git diff --check`.
