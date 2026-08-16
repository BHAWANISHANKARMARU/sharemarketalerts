# Insights Market Themes Design

Replace only the existing Market themes block on `/insights` with the supplied 2×2 reference composition. Preserve every adjacent research section and all current workspace behavior.

The section uses a spacious heading area followed by one bordered, rounded grid. Each theme cell contains a green sequence number, pale-green line-icon tile, title, exact description, and an optional state control aligned to the right. Constructive, Watch, and Selective are rendered; Global technology has no invented state. Desktop uses two equal columns and two equal rows, tablet retains two columns where content fits, and mobile stacks four full-width cells without document overflow.

Use the existing Manrope typography and green insights palette, inline SVG icons, restrained borders, and no new dependencies. Verify exact text, four-cell ordering, status count, desktop geometry, and mobile overflow with rendered tests and screenshots, then run scoped lint and production build.
