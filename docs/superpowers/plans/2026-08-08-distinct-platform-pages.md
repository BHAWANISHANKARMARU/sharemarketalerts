# Distinct Platform Pages — Implementation Plan

1. Replace shared-template tests with contracts for six independent route experiences and the existing navigation shell.
2. Add small shared display utilities for market formatting and premium inline trend visuals.
3. Build Markets and Live Markets around the existing live market provider.
4. Build IPO around existing IPO provider data with useful issue comparison and calendar content.
5. Build Products and Insights as distinct suite/editorial experiences.
6. Build Stock Alerts as an interactive client-side rule composer using live instruments/triggers without backend mutation.
7. Remove the rejected `PlatformPage` and `platformPageData` files.
8. Verify tests, lint, production build, desktop visuals, mobile typography, and horizontal overflow.
