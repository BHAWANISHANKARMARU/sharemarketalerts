# Growth CTA Section Design

## Goal

Reproduce the supplied 1404 × 843 CTA reference as a real Next.js section immediately after the existing Pricing section, without altering any existing section.

## Approved scope

- Desktop and laptop presentation only for this pass.
- The email field and CTA button are visual-only.
- The source-brand name “SearchVector” becomes “ShareMarketAlerts.”
- Existing sections remain unchanged.
- No Git operations.

## Architecture

- Add a semantic Server Component at 'src/app/components/GrowthCta.js'.
- Add isolated reference-scaled styling at 'src/app/components/GrowthCta.module.css'.
- Render 'GrowthCta' after 'Pricing' through the existing root 'src/app/template.js'.
- Use CSS and inline SVG for the contour-line background, icons, arrow accents, results stamp, checklist marks, shield, and compact trust artwork.
- Use the existing Figtree project font for all CTA typography.

## Reference inventory

### Header

- Outlined pill with lightning icon and 'READY TO GROW?'
- Two-line headline: 'Stop guessing.' and purple 'Start growing.'
- Purple hand-drawn underline/arrow beneath the second line
- Supporting copy:
  - 'Join thousands of marketers and businesses who use ShareMarketAlerts'
  - 'to get more visibility, traffic, and real results.'

### Benefit row

- 'Data-Backed Insights' / 'Make Smarter Decisions'
- 'Proven SEO Strategies' / 'That Drive Results'
- 'Unmatched Support' / 'We're with you all the way'
- Purple outlined icon tiles for trend, shield, and rocket
- Circular 'REAL DATA / 100% / REAL RESULTS' seal on the right

### Dark signup panel

- Purple sparkle and 'START YOUR JOURNEY TODAY'
- Headline 'Get Started in' and '60 Seconds', with '60' in purple
- Purple hand-drawn underline beneath '60'
- Vertical divider
- Four purple check items:
  - 'No Credit Card Required'
  - '7-Day Free Trial'
  - 'Cancel Anytime'
  - 'Setup in 1 Minute'
- Static email field with 'Enter your work email'
- Purple 'Start My Free Trial' button with arrow
- Five overlapping avatar chips and 'Trusted by 2,500+ businesses worldwide'

### Trust rail

- Purple shield badge
- 'Trusted by industry leaders'
- 'Powering growth for 2,500+ companies'
- Wordmarks in this order: Razorpay, CRED, lenskart, zomato, upstox, ZERODHA

## Visual system

- Scale from the 1404px reference width using one section-level CSS unit so desktop and laptop retain identical geometry.
- Use a white-to-lavender surface with faint purple contour rings entering from the left and right edges.
- Use near-black '#03060f' for the signup panel, violet '#8b00f5' for the primary accent, pale violet '#f3e7ff' for icon tiles, and violet-biased greys for secondary copy and borders.
- Match the reference’s large bold centered headline, compact benefit typography, rounded dark panel, subtle violet glow, pale bordered trust rail, and restrained radii.
- Keep all content within the section bounds with no horizontal overflow or cropping.

## Accessibility

- Use a labelled 'section', semantic headings, a list for the four assurances, and a list for the trust wordmarks.
- Keep the static field and button as form controls with descriptive labels while performing no submission action.
- Mark all decorative SVG artwork as hidden from assistive technology.

## Verification

- Add a render-contract test before implementation and confirm it fails because the section is absent.
- Implement the component, placement, and styling, then confirm the test passes.
- Capture the section at 1404px and 1024px.
- Compare the 1404px capture side-by-side with the supplied reference and tune geometry, typography, colours, borders, and shadows.
- Run the complete test suite, ESLint, and the Next.js production build.
