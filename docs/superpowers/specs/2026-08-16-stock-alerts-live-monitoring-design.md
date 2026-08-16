# Stock Alerts Unified Live Monitoring Design

## Goal

Replace the complete `/stock-alerts` page body with the approved “Your market, right now” dashboard reference. Keep the live market provider and a controlled maximum width so the interface retains its proportions rather than stretching across large screens.

## Visual structure

- Dark live-market header with status, update time, three signal counters, and a four-symbol rule map.
- Red breakout card bridging the dark header and white content area.
- Recharts breakout trend using the current featured quote.
- Two compact cards for recent activity and all four rules.
- A pale monitoring-status footer.

## Data and interaction

- Use the current Yahoo-backed values for ADANIENT, BPCL, ICICIBANK, and WIPRO when available.
- Rule rows remain interactive and can be paused/resumed locally.
- Signal, activity, rule-management, and product links are real anchors.
- Static fallback values are used only when live quotes are unavailable.

## Responsive behavior

- The dashboard is capped at 980px and centered on desktop.
- At the 469px reference width it is a 463px by approximately 711px composition with the same two-column lower layout.
- Below 380px the lower cards stack for legibility.
- No viewport may produce horizontal overflow.

## Scope

Remove the old alert builder, template directory, prior monitoring block, signal queue, and feed-health panels from this route. Do not use Git.
