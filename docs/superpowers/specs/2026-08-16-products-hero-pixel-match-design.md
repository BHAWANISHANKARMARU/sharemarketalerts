# Products Hero Pixel-Match Design

## Scope

Change only the top hero/workspace area of `/products` to match the supplied 1252 × 711 reference. Preserve all existing sections below the hero and preserve their current content, structure, and styling.

The matched hero includes:

- Products / Workspace breadcrumbs
- Product workspace title, subtitle, and live-workspace action
- All tools, Discovery, Analysis, and Automation tabs
- Product selector rail and platform status
- Tool preview heading, active-product summary, preview canvas, and footer

## Structure and behavior

Keep the existing React tool data, tab filtering, active-tool selection, and destination links. Remove the `SiteHeader` only from the products route because it does not appear in the supplied hero reference. The lower products content remains directly after the matched hero.

Use a dedicated products CSS module for the hero so exact green palette, dimensions, borders, clipped corner, dotted field, type scale, and responsive rules cannot change the other routes that share `TradingWorkspace.module.css`.

## Visual system

- Page field: `#f7f7f7`; centered white hero canvas with a thin neutral border and clipped upper-left corner.
- Primary ink: near-black navy; secondary copy: cool muted gray.
- Accent: deep emerald for active states, product icon, buttons, status dots, and output label.
- Desktop reference viewport: 1252 × 711. The hero canvas begins near x=56, spans about 1056px, and fills the visible height.
- Typography follows the repository's loaded sans font and reproduces the reference hierarchy and line wrapping.
- Desktop geometry, spacing, radii, and strokes are tuned through screenshot comparison at the reference viewport.
- At approximately 390px, controls remain usable, content stacks, and no horizontal page overflow occurs.

## Validation

Add source/render assertions that verify the products hero copy, interactions, dedicated styling, and continued presence of the lower sections. Run the focused test, full test suite, lint, and production build. Capture desktop and mobile screenshots and iterate until the desktop hero visibly matches the supplied reference.
