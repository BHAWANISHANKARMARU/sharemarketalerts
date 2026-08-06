# How It Works Decision Engine Correction

## Goal

Correct only the circular artwork inside the existing AI Decision Engine so its proportions, spacing, rings, nodes, core, and glow match the supplied compact target crop `/tmp/codex-clipboard-QLGOg5.png` instead of the oversized current crop `/tmp/codex-clipboard-pbBDcG.png`.

## Scope

- Keep the How It Works section in its current page position.
- Preserve the section heading, introduction, connector map, market-input cards, actionable-outcome cards, validation strip, bottom value strip, copy, colours, and semantics.
- Modify only the circular artwork and its directly associated heading block: concentric rings, four orbit dots, three analysis nodes, Intelligence Core, glow/shadow treatment, and the positioning/width of `AI DECISION ENGINE` with `Analyze. Validate. Prioritize.`.
- Preserve desktop and laptop behavior; mobile remains outside this pass.
- Add no dependencies and perform no Git operations.

## Selected approach

Retain the current semantic React markup and inline SVG icons. Introduce an isolated circle-scale coordinate system centered on the existing engine axis and capped on wide desktops, preventing only the circular artwork from growing with the entire 1920px section.

This approach preserves crisp text and vectors, avoids a raster screenshot, and keeps the existing section structure accessible and maintainable.

## Exact visual corrections

### Engine scale and alignment

- Keep the engine centered on the same horizontal axis as the existing section.
- Keep the visible outer orbit at approximately 25% of the section width, reaching about 440–446px at the supplied 1787px comparison width.
- Keep the engine compact at 1366px and proportionally readable at laptop width.
- Reduce the original oversized wide-desktop engine only enough to match the normalized target ratio while leaving the surrounding columns unchanged.
- Center every ring, node, and core on the same axis with no horizontal drift.

### Engine heading

- Render `AI DECISION ENGINE` on one line.
- Keep `Analyze. Validate. Prioritize.` on one line directly below it.
- Keep at least 28px of clear vertical space between the introduction and engine heading at the 1920px reference viewport, scaling proportionally at laptop widths.
- Position both lines completely above and outside the outer orbit with a clear gap.

### Orbit

- Render three concentric circular rings.
- Use thin pale-violet strokes with a restrained soft glow.
- The outer ring carries four small purple connection dots at the top, right, bottom, and left.
- The inner ring encloses the core and the three analysis nodes without touching their labels.
- Match the target crop’s whitespace: the orbit must feel light and open, not visually dominant.

### Analysis nodes

- Probability remains centered above the core.
- Trend Strength remains at the lower-left.
- Risk Calibration remains at the lower-right.
- Keep the existing brain, pulse, and shield icons.
- Reduce icon circles, heading sizes, body text, and vertical gaps together so their proportions match the compact target.
- Preserve all exact copy:
  - `PROBABILITY` / `24/7 AI models` / `ensemble scoring`
  - `TREND STRENGTH` / `Momentum & regime` / `confirmation`
  - `RISK CALIBRATION` / `Volatility, liquidity &` / `drawdown control`

### Intelligence Core

- Reduce the dark circular core to approximately 115–120px on wide desktop viewports.
- Preserve the purple triangular mark and both text lines.
- Keep the exact text `ShareMarketAlerts` and `Intelligence Core`.
- Use a narrow violet halo and restrained shadow instead of the current large glow field.

## Architecture

- Continue using `src/app/components/HowItWorks.js` as a Server Component.
- Keep the current `AnalysisNode`, icon, and core-mark helpers.
- Add one visual wrapper around only the orbit, nodes, and core if required for the isolated scale.
- Adjust only the center stack’s shared vertical position—the AI Decision Engine heading, circle, and validation strip—while leaving the complete connector SVG unchanged.
- Keep the validation strip outside the scaled engine wrapper so it retains its existing size and page alignment.
- Update only the relevant selectors in `src/app/components/HowItWorks.module.css`.
- Keep existing content tests and add a structural assertion for the isolated decision-engine group.

## Accessibility

- Preserve the labelled How It Works section and its existing visible copy.
- Keep orbit rings, dots, and connector artwork hidden from assistive technology.
- Keep analysis labels as real HTML text rather than converting the engine into a decorative image.

## Verification

- Use test-driven development: add the decision-engine structural contract and confirm it fails before changing production markup.
- Capture the How It Works section at 1920px, 1366px, and laptop width.
- Produce a focused center crop and compare it beside `/tmp/codex-clipboard-QLGOg5.png`.
- Check outer-ring diameter, core diameter, node positions, label spacing, orbit dots, and glow strength.
- Iterate until the wide-desktop center matches the compact target without changing the other How It Works elements.
- Run the complete Node test suite, ESLint, and the Next.js production build.
