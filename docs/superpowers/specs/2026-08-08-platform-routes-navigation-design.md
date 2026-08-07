# Platform Routes and Navigation Design

## Objective

Replace the homepage-only anchor navigation with a credible product navigation and create six dedicated Next.js App Router pages: Markets, IPO, Products, Insights, Stock Alerts, and Live Markets. Home remains `/`. Navigation must use `next/link` so prefetched client-side transitions preserve the SPA-like experience.

## Information Architecture

- `/` — Home: existing landing page and sections remain intact.
- `/markets` — broad market coverage, indices, sectors, breadth, and global sessions.
- `/ipo` — IPO discovery, GMP context, calendars, and listing workflow.
- `/products` — the complete platform suite and how its capabilities connect.
- `/insights` — research notes, market themes, explainers, and weekly outlooks.
- `/stock-alerts` — alert types, setup workflow, delivery channels, and risk controls.
- `/live-markets` — real-time pulse, movers, breadth, session status, and active opportunities.

Markets is the considered overview; Live Markets is the fast operational dashboard. IPO and Stock Alerts are focused product experiences rather than duplicated overview pages.

## Navigation

A single `NAV_ITEMS` source defines labels and hrefs for desktop, mobile, homepage, inner-page header, and footer. The homepage keeps its existing visual header but renders the new links with `Link`. Inner routes use a sticky, light glass header with an active-route indicator, compact CTA, accessible mobile menu, escape/outside-route closure, and visible focus states. Mobile homepage navigation uses the same destinations.

## Page System

Each route is a static Server Component that passes page-specific content to a shared `PlatformPage` presentation component. The shared shell provides consistent quality while route configuration changes the eyebrow, headline, metrics, spotlight visualization, content modules, and accent treatment. Pages use real market-platform copy, not placeholders.

The inner-page design uses a calm white and cool-lilac canvas, deep navy typography, Manrope for UI and data, restrained violet accents, thin neutral rules, editorial whitespace, tabular financial numerals, and one distinctive data surface per page. Cards remain quiet and purposeful. Responsive layouts collapse cleanly to a single column without shrinking text below readable mobile sizes.

## Shared Page Sections

1. Route-aware header.
2. Editorial hero with concise value proposition and page-specific market visual.
3. Three proof metrics.
4. Capability grid with route-specific content.
5. Dark operational panel showing a workflow, feed, or market state.
6. Contextual CTA.
7. Existing global Growth CTA and footer.

The homepage alone keeps Pricing. Inner routes do not repeat Pricing.

## Data and Behavior

Routes are statically renderable and require no new API. Existing live market APIs and business logic remain unchanged. Decorative data surfaces use deterministic content so server rendering is stable. Navigation active state is isolated in the client header via `usePathname`; page bodies remain Server Components.

## Accessibility and Motion

Use semantic headings, landmarks, lists, labels, `aria-current="page"`, a labelled mobile toggle, keyboard focus rings, and sufficient text contrast. Motion is limited to subtle entrance and hover transitions and disabled under `prefers-reduced-motion`.

## Testing

Add source/render contracts for all route files, shared nav destinations, `Link` usage, active-route semantics, unique page titles/copy, homepage link replacement, mobile navigation, and the homepage-only Pricing placement. Run the focused Node tests, ESLint, production build, and desktop/mobile screenshots.

## Scope Boundaries

Do not remove or redesign homepage sections. Do not change market-data APIs, chart data, authentication, billing, or alert delivery business logic. Do not add a new UI or chart dependency.
