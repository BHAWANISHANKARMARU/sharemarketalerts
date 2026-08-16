# Platform Products Readability Design

## Scope

Improve only the “All platform products” section on `/products`. Preserve all supplied wording, item order, routes, icons, and the existing green-and-white visual language.

## Visual treatment

- Keep the reference structure: heading and workspace action, six product cards, then four trust statements.
- Increase the section’s usable width and vertical rhythm instead of scaling content down to fit a fixed-height composition.
- Give each product card a quiet green-neutral surface distinct from the white section canvas, with a visible border and restrained shadow.
- Use dark, high-contrast body text. Supporting copy must render at 12px or larger on desktop and mobile; product names and list items must be larger than supporting copy.
- Increase card padding, header height, list-row height, icon size, and badge size so every label remains legible at normal browser zoom.
- Render each trust statement as a visually distinct mini-panel rather than one continuous low-contrast strip.
- Preserve the button, arrows, numbering, “Included ✓” badges, and existing line icons.

## Responsive behavior

- Above 900px: three product columns and four trust columns.
- From 601px through 900px: two product columns and two trust columns.
- At 600px and below: one product column and one trust column, a full-width workspace action, comfortable horizontal page padding, and no horizontal overflow.
- The section height is content-driven at every viewport; content must never be reduced merely to match a fixed height.

## Accessibility and interaction

- Maintain semantic headings, ordered lists, and real links.
- Keep text contrast readable against every new surface.
- Preserve visible focus behavior inherited from the application.
- Do not encode meaning through colour alone; retain text and checkmarks in status badges.

## Verification

- Add a focused regression test for readable font-size floors, distinct card/trust surfaces, and responsive column transitions.
- Capture and inspect the section at desktop, tablet, and approximately 390px mobile widths.
- Run scoped lint, the focused tests, a production build, and `git diff --check`.
