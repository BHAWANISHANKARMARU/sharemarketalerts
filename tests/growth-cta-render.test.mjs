import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "READY TO GROW?",
  "Stop guessing. Start growing.",
  "Join thousands of marketers and businesses who use ShareMarketAlerts to get more visibility, traffic, and real results.",
  "Data-Backed Insights",
  "Make Smarter Decisions",
  "Proven SEO Strategies",
  "That Drive Results",
  "Unmatched Support",
  "We're with you all the way",
  "REAL DATA",
  "100%",
  "REAL RESULTS",
  "START YOUR JOURNEY TODAY",
  "Get Started in 60 Seconds",
  "No Credit Card Required",
  "7-Day Free Trial",
  "Cancel Anytime",
  "Setup in 1 Minute",
  "Start My Free Trial",
  "Trusted by 2,500+ businesses worldwide",
  "Trusted by industry leaders",
  "Powering growth for 2,500+ companies",
  "Razorpay",
  "CRED",
  "lenskart",
  "zomato",
  "upstox",
  "ZERODHA",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&apos;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

test("Growth CTA renders directly after Pricing with the approved content", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const match = html.match(
    /<section[^>]*data-section="growth-cta"[\s\S]*?<\/section>/,
  );
  assert.ok(match, "Growth CTA section is missing");
  assert.match(match[0], /id="growth-cta"/);
  assert.match(match[0], /aria-labelledby="growth-cta-title"/);

  const text = visibleText(match[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(text.includes(copy), "Missing from Growth CTA: " + copy);
  }

  assert.equal(match[0].match(/data-assurance=/g)?.length ?? 0, 4);
  assert.equal(match[0].match(/data-trust-brand=/g)?.length ?? 0, 6);
  assert.ok(
    html.indexOf('data-section="growth-cta"') >
      html.indexOf('data-section="pricing"'),
    "Growth CTA must render after Pricing",
  );
});
