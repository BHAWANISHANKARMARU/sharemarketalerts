# Products Reference Sections Design

## Scope

Replace only the existing “Built around the decision” and “All platform products” sections on `/products`. Preserve the hero, toolkit, capability matrix, delivery surfaces, navigation, data flow, and all other in-progress workspace changes.

## Decision workflow section

Render the supplied heading, subtitle, three filter pills, and four horizontal tool rows. Each row contains a green sequence number, pale-green icon tile with a distinct line icon, title and exact description, three compact capability pills separated by green dots, and a green Explore link. Desktop uses the reference’s spacious full-width table rhythm; mobile stacks row content without overflow.

## Platform products section

Render the supplied heading, subtitle, green Launch workspace button, and six product cards in a 3×2 desktop grid. Each card contains a pale-green icon tile, title, subtitle, corner link, and three numbered Included rows. Add the four-item trust strip from the reference below the grid. Mobile uses a single card column and stacked trust items.

## Visual system

Use Manrope and the products page’s existing green palette. Surfaces are white or faint cool grey, borders are thin and neutral, corners are modest, shadows are restrained, and all icons are inline SVG. Supplied text overrides any differing screenshot text.

## Verification

Use a rendered `/products` test to assert landmarks, exact copy, row/card counts, icons, and ordering. Verify the test red before implementation and green afterward. Run lint and production build, then capture and compare desktop at 1275×695 and mobile at 390×844 with zero horizontal overflow.
