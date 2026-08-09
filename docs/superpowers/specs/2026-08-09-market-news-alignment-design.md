# Market News & Research Alignment Design

## Goal

Keep the existing Market News & Research visual design while aligning its outer edges with the Market Calendar section at desktop, tablet, and mobile widths.

## Root cause

The visible Calendar is styled by `MarketCalendarDashboard.module.css`, while the News stylesheet still contains a legacy shared Calendar selector. News initially uses the visible Calendar's centering model, but the legacy `min-width: 1500px` rule partially replaces it with a viewport translation. The incompatible rules shift News to the right and stretch it beyond the visible Calendar.

## Design

- Mirror the visible Calendar's containing-block formula in News.
- Use `min(100vw - 32px, 1360px)` on desktop, `min(100vw - 28px, 960px)` on tablet, and `100vw - 24px` on mobile.
- Preserve the News section's internal 24px desktop padding and current mobile stacking.
- Exclude News from the legacy 1500px Calendar media rule so its centering model cannot be overwritten.
- Keep all copy, cards, images, data, colors, typography, and interactions unchanged.

## Acceptance criteria

- Calendar and News outer edges share the same centered axis.
- News never overflows the viewport or clips the Research column.
- Desktop, tablet, and mobile layouts remain responsive.
- The source contract prevents reintroducing News-only `margin-left: 50%` centering.
- Existing tests, lint, and production build pass.

## Constraints

- Next.js 16.2.12 conventions and installed documentation remain authoritative.
- No Git commit, push, merge, or worktree operation.
