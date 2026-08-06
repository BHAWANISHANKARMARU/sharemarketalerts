# IPO GMP Tracker Replacement Design

## Goal

Replace the current IPO Market Intelligence dashboard directly below Hero with a real Next.js reproduction of the supplied 1404 × 843 IPO GMP Tracker reference. Every other section remains unchanged.

## Approved scope

- Replace only the current 'IpoMarketIntelligence' component and its isolated styling.
- Preserve the component’s existing position directly after Hero.
- Desktop and laptop presentation only for this pass.
- Keep all values and the date '20 May 2025' static exactly as shown.
- Use no external dependencies and perform no Git operations.

## Architecture

- Keep the existing component path 'src/app/components/IpoMarketIntelligence.js' so page wiring remains stable.
- Replace its markup with the new GMP Tracker hierarchy.
- Replace 'src/app/components/IpoMarketIntelligence.module.css' with an isolated reference-scaled layout.
- Use semantic HTML for the KPI summaries, data table, explanatory cards, and source footer.
- Use inline SVG for the calendar, building, trend, clock, book, shield, source, and table-heading icons.
- Use the existing Playfair Display font for the large title and Figtree for utility text and tabular data.

## Exact content

### Header and date panel

- 'IPO GMP Tracker'
- 'Grey Market Premium Overview'
- '20 May 2025'
- 'Tuesday'
- '10:30 AM'

### KPI cards

1. 'TOTAL IPOS TRACKED' / '7' / 'Companies'
2. 'HIGHEST GMP %' / '14.02%' / 'Ather Energy Ltd'
3. 'LAST UPDATE' / '20 May 2025, 10:30 AM' / 'Tuesday'

### Table columns

1. 'Company Name'
2. 'IPO Size (₹ Cr)'
3. 'Issue Price (₹)'
4. 'GMP (₹)'
5. 'GMP % (%)'
6. 'Estimated Listing Price (₹)'
7. 'Expected Listing Gain (%)'
8. 'Last Updated'

### Table rows

1. 'Ather Energy Ltd' / '2,981.06' / '321 – 321' / '45' / '14.02%' / '366' / '14.02%'
2. 'LG Electronics India Ltd' / '11,607.01' / '1,080 – 1,140' / '120' / '10.53%' / '1,200 – 1,260' / '10.53%'
3. 'Hero FinCorp Ltd' / '3,668.00' / '334 – 352' / '38' / '11.08%' / '372 – 390' / '11.08%'
4. 'Bajaj Housing Finance Ltd' / '6,560.00' / '66 – 70' / '7' / '10.61%' / '73 – 77' / '10.61%'
5. 'NTPC Green Energy Ltd' / '10,000.00' / '102 – 108' / '12' / '11.11%' / '114 – 120' / '11.11%'
6. 'OLA Electric Mobility Ltd' / '6,145.56' / '72 – 76' / '6' / '7.89%' / '78 – 82' / '7.89%'
7. 'Swiggy Ltd' / '11,327.43' / '371 – 390' / '25' / '6.76%' / '396 – 415' / '6.76%'

Every row ends with '20 May 2025' and '10:30 AM' on separate lines. Positive GMP cells use green; the OLA GMP, percentage, estimated price, and gain cells use red.

### Information cards

- 'WHAT IS GMP?'
- 'Grey Market Premium (GMP) is the unofficial premium at which IPO'
- 'shares are trading in the grey market before listing.'
- 'DISCLAIMER'
- 'GMP is not regulated by any authority. It is subject to market risks.'
- 'Please invest only after your own research and due diligence.'

### Source footer

- 'Source:'
- 'Various Market Sources'
- 'Data as on 20 May 2025, 10:30 AM'

## Visual system

- Scale all geometry from the 1404px reference width through one section-level CSS unit.
- Use a white and very pale blue surface with subtle blue wave contours behind the content.
- Use deep navy for the title, date panel, table header, and source footer.
- Use teal-green for positive values, the subtitle underline, and informational accents.
- Use red only for the OLA negative-highlight cells.
- Match the three elevated KPI cards, rounded table container, alternating blue-tinted table rows, thin column dividers, two information cards, and the full-width source strip.
- Preserve the reference’s shadows, corner radii, heading sizes, table density, and numerical alignment.

## Accessibility

- Retain a labelled 'section' and semantic title.
- Render the summary values as three articles.
- Use one semantic table with column-header scopes and seven body rows.
- Use a labelled footer for source information.
- Mark decorative SVG artwork as hidden from assistive technology.

## Verification

- Replace the old IPO dashboard render contract with a new failing GMP Tracker contract before implementation.
- Confirm the test fails because the old content is still rendered.
- Implement the new component and styling, then confirm the contract passes.
- Capture the section at 1404px and 1024px.
- Compare the 1404px capture beside the supplied reference and tune until the header, KPIs, table, information cards, and footer align closely.
- Run the complete test suite, ESLint, and the Next.js production build.
