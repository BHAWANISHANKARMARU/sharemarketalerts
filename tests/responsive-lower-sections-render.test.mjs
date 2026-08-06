import assert from "node:assert/strict";
import test from "node:test";

const LOWER_SECTIONS = [
  "ipo-gmp-tracker",
  "how-it-works",
  "what-you-receive",
  "market-intelligence",
  "market-coverage",
  "testimonials",
  "pricing",
  "growth-cta",
  "site-footer",
];

test("homepage exposes every responsive lower section in order", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);
  const html = await response.text();

  let previous = -1;
  for (const section of LOWER_SECTIONS) {
    const position = html.indexOf(`data-section="${section}"`);
    assert.ok(position > previous, `Missing or out-of-order section: ${section}`);
    previous = position;
  }

  for (const label of [
    "IPO Size (₹ Cr)",
    "Issue Price (₹)",
    "GMP (₹)",
    "GMP (%)",
    "Estimated Listing Price (₹)",
    "Expected Listing Gain (%)",
    "Last Updated",
  ]) {
    assert.ok(
      html.includes(`data-label="${label}"`),
      `Missing mobile IPO label: ${label}`,
    );
  }
});
