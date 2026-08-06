# Homepage live-data and interactions design

## Goal

Keep the approved homepage layout intact while replacing its static market widgets and inert controls with server-backed data and real interactions.

## Data architecture

- Yahoo Finance is the market-data source for index/equity quotes, historical chart points, symbol search, trending symbols, and mover calculations.
- Yahoo calls stay server-side through `yahoo-finance2`; components consume a normalized internal response rather than Yahoo response objects.
- Indian IPO listings and GMP use the separate IPO Alerts API because Yahoo does not publish grey-market premium data. The API key is optional for partial listing data and required for the provider's GMP add-on.
- Every provider has a timeout and normalized last-known fallback. Responses expose `source`, `mode`, and `updatedAt` so the UI never presents stale sample data as live.
- `/api/market/home` returns the shared homepage snapshot and is cached for 60 seconds. `/api/market/search` validates a short symbol query and returns normalized Yahoo matches.

## UI behavior

- Desktop and mobile hero tickers, top movers, market dashboard, and IPO tracker consume the same shared snapshot.
- Quote and mover rows open the corresponding Yahoo Finance instrument page.
- Header/footer navigation uses real section anchors; primary CTAs scroll to pricing/sign-up and secondary CTAs scroll to the live dashboard.
- Pricing monthly/yearly controls update visible prices and billing text.
- Trial/newsletter forms validate email, use a configured webhook when available, and otherwise open a pre-addressed email handoff rather than showing a fake success state.
- Mobile navigation opens and closes accessibly.
- Existing layout, typography, colors, and responsive composition remain unchanged except for small status, focus, and interaction states.

## Reliability and safety

- Yahoo and IPO requests execute concurrently with independent fallbacks.
- Symbols, ranges, intervals, and search text are validated; the site does not expose a generic upstream proxy.
- API keys remain in server environment variables.
- No failed upstream call can blank a section or block the whole homepage.
- Financial data includes provider attribution and a non-advisory disclaimer.

## Verification

- Unit tests cover Yahoo and IPO normalization plus fallback metadata.
- Route tests cover the public response contract and search validation.
- Homepage tests assert no placeholder `href="#"` controls remain.
- Interaction tests cover mobile navigation, pricing toggle, email validation/handoff, and clickable market rows.
- Final checks run lint, production build, API smoke tests, and desktop/mobile browser interaction checks.
