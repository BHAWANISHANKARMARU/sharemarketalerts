import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const REQUIRED_COPY = [
  "PLANS THAT GROW WITH YOU",
  "Simple pricing. Serious results.",
  "Choose the plan that fits your goals. Upgrade, pause or cancel anytime.",
  "Save up to 20%",
  "Monthly",
  "Yearly",
  "-20% OFF",
  "14-Day Money Back Guarantee",
  "STARTER",
  "Launch Smart",
  "₹1,999 /month",
  "GROWTH",
  "Grow Faster",
  "₹5,599 /month",
  "ENTERPRISE",
  "Dominate Market",
  "₹11,999 /month",
  "Billed annually · 20% saved",
  "Unlimited Growth",
  "Enterprise Security",
  "Blazing Fast Platform",
  "Human Support",
  "Results That Matter",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

test("Pricing renders after Testimonials with the approved plans and benefits", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sectionMatch = html.match(
    /<section[^>]*data-section="pricing"[\s\S]*?<\/section>/,
  );
  assert.ok(sectionMatch, "Pricing section is missing");
  assert.match(sectionMatch[0], /id="pricing"/);
  assert.match(sectionMatch[0], /aria-labelledby="pricing-title"/);

  const sectionText = visibleText(sectionMatch[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(sectionText.includes(copy), `Missing from Pricing: ${copy}`);
  }

  assert.equal(sectionMatch[0].match(/<article\b/g)?.length ?? 0, 3);
  assert.match(sectionMatch[0], /aria-label="Billing period"/);
  assert.match(sectionMatch[0], /aria-pressed="true"/);
  assert.match(sectionMatch[0], /aria-label="Plan benefits"/);

  assert.ok(
    html.indexOf('data-section="pricing"') >
      html.indexOf('data-section="testimonials"'),
    "Pricing must render after Testimonials",
  );
});

test("Simple pricing uses the primary Manrope typography", async () => {
  const css = await readFile(
    new URL("../src/app/components/Pricing.module.css", import.meta.url),
    "utf8",
  );
  const simplePricingRule = css.match(/\.header h2 span\s*\{([^}]*)\}/);

  assert.ok(simplePricingRule, "Simple pricing typography rule is missing");
  assert.match(simplePricingRule[1], /font-family:\s*var\(--font-sans\)/);
  assert.match(simplePricingRule[1], /font-weight:\s*700/);
});

test("the site loads Manrope and Playfair as its only font families", async () => {
  const [layout, marketCss] = await Promise.all([
    readFile(new URL("../src/app/layout.js", import.meta.url), "utf8"),
    readFile(
      new URL("../src/app/components/MarketIntelligence.module.css", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(layout, /import \{ Manrope, Playfair_Display \} from "next\/font\/google"/);
  assert.doesNotMatch(layout, /Figtree/);
  assert.doesNotMatch(marketCss, /font-family:\s*Impact/);
});
