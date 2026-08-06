# Testimonials Section Design

## Objective

Reproduce the supplied desktop testimonial reference as a new section immediately after `MarketCoverage` on the home page. The result must preserve all existing sections and use the supplied local artwork from `public/images` without cropping or degrading it.

## Approved approach

Build a dedicated `Testimonials` React component and CSS module. Compose the supplied transparent PNG assets as positioned layers, because those assets already contain the reference card shapes, portraits, paper textures, shadows, and decorative architecture. Render the section heading, supporting copy, and bottom statistics rail as HTML/CSS so typography stays sharp and the content remains accessible.

This is preferred over rebuilding the illustrated cards from scratch, which would introduce visible differences, and over using the full screenshot as one background image, which would reduce sharpness and accessibility.

## Placement and scope

- Import and render `Testimonials` directly after `MarketCoverage` in `src/app/page.js`.
- Target laptop and desktop layouts in this pass, matching the existing fixed-width section pattern.
- Do not modify `Hero` or any existing section.
- Do not add animations or interactions that are absent from the reference.

## Visual composition

- Use a near-white, subtly lavender surface with the same full-width desktop proportions as the reference.
- Center the uppercase purple eyebrow `TESTIMONIALS` above the headline.
- Render the headline on two centered lines:
  - `Why serious traders`
  - italic purple `stay with ShareMarketAlerts.`
- Render the centered supporting copy on two lines:
  - `Traders rely on us for IPO GMP clarity, real-time alerts,`
  - `and the confidence to act before the market moves.`
- Place the wide Rohit Mehta testimonial asset on the left.
- Place the narrow Anjali Desai testimonial asset in the center.
- Place the combined Karan Malhotra and Vivek Narayan paper-note asset on the right.
- Place the purple oval platform and arched architectural artwork behind the right-side cards using the supplied assets.
- Preserve the original aspect ratio and alpha transparency of every PNG. No asset may be cropped, stretched, blurred, or upscaled beyond what the reference layout requires.
- Add the rounded statistics rail along the bottom with four equal groups and three vertical dividers.

## Asset mapping

- `ChatGPT Image Aug 4, 2026, 12_48_36 AM.png`: Rohit Mehta card.
- `ChatGPT Image Aug 4, 2026, 12_48_25 AM.png`: Anjali Desai card.
- `ChatGPT Image Aug 4, 2026, 12_48_53 AM.png`: Karan Malhotra and Vivek Narayan paper cards.
- `ChatGPT Image Aug 4, 2026, 12_48_09 AM.png`: right-side architectural arch.
- `ChatGPT Image Aug 4, 2026, 12_47_43 AM.png`: foreground oval platform.
- `ChatGPT Image Aug 4, 2026, 12_47_49 AM.png`: alternate platform rendering. Keep it available but do not stack duplicate platforms; select it only if screenshot comparison shows it matches the reference more closely.

## Exact visible copy

The statistics rail must contain:

1. `4.9/5` — `average rating`
2. `25,000+` — `active traders`
3. `1.2M+` — `alerts delivered`
4. `92%` — `users continue` / `trading with us`

Card copy, names, roles, locations, and platform marks remain embedded in the supplied reference assets and must not be duplicated over them.

## Component structure

- `src/app/components/Testimonials.js`: semantic section markup, heading, supporting copy, positioned image layers, and statistics data.
- `src/app/components/Testimonials.module.css`: desktop sizing, layering, typography, shadows, rail, dividers, and image placement.
- `src/app/page.js`: one import and one render call after `MarketCoverage`.

Use `next/image` for supplied raster assets with explicit intrinsic dimensions and `unoptimized` where necessary to preserve their approved source rendering.

## Accessibility

- Give the section an `aria-labelledby` relationship to its heading.
- Treat purely decorative architectural layers as hidden from assistive technology.
- Provide concise alternative text for testimonial artwork that contains meaningful testimonial content.
- Keep the statistics as readable HTML text rather than rasterized copy.

## Verification

- Add a render test before implementation that requires the new section after `MarketCoverage`, its exact heading/copy/statistics, and the five selected image paths.
- Confirm the test fails because the section does not yet exist, then implement until it passes.
- Capture the rendered section at the reference desktop width and compare its major bounds, headline wrapping, card positions, layer order, bottom rail, spacing, and colors against the supplied screenshot.
- Iterate until no visible mismatch remains at desktop/laptop widths.
- Run the focused render test, existing test suite, ESLint, and the production Next.js build.

## Constraints

- Work only inside the current Next.js project.
- Read the installed Next.js 16.2.12 documentation before writing framework-specific code.
- Use existing theme variables and typography where they match the reference.
- Perform no Git operations.
