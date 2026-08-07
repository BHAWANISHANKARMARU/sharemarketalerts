import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "MARKETS SCANNING 24/7",
  "150+ exchanges",
  "120K+ instruments",
  "Signals updated in real time",
  "SHAREMARKETALERTS",
  "See the signal. Move before the market.",
  "AI-powered market intelligence, IPO GMP clarity, and risk-aware alerts—built for confident decisions.",
  "Platform",
  "Products",
  "Stock Alerts",
  "Live Markets",
  "Insights",
  "Markets",
  "Market Overview",
  "IPO Intelligence",
  "Resources",
  "Home",
  "Support",
  "Company",
  "About",
  "Contact",
  "Privacy",
  "Terms",
  "The market won’t wait.",
  "Get high-conviction alerts and IPO updates delivered before the crowd moves.",
  "Get Market Alerts",
  "No spam. Unsubscribe anytime.",
  "Real-time scanning",
  "Markets monitored continuously",
  "Risk-aware intelligence",
  "Every signal is calibrated",
  "Built for clarity",
  "Actionable levels, not noise",
  "Market data and alerts are provided for informational purposes only and do not constitute investment advice. Trading and investing involve risk.",
  "© 2026 ShareMarketAlerts. All rights reserved.",
  "Privacy Policy",
  "Terms of Use",
  "Risk Disclosure",
  "Made for traders who move with conviction.",
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

test("Market Command footer renders last with approved content and semantics", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const match = html.match(
    /<footer[^>]*data-section="site-footer"[\s\S]*?<\/footer>/,
  );
  assert.ok(match, "Market Command footer is missing");
  assert.match(match[0], /id="site-footer"/);
  assert.match(match[0], /aria-labelledby="site-footer-title"/);

  const text = visibleText(match[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(text.includes(copy), "Missing from footer: " + copy);
  }

  assert.equal(match[0].match(/data-footer-nav-group=/g)?.length ?? 0, 4);
  assert.equal(match[0].match(/data-footer-trust=/g)?.length ?? 0, 3);
  assert.match(match[0], /aria-label="Footer navigation"/);
  assert.match(match[0], /type="email"/);
  assert.doesNotMatch(match[0], /readonly=""/i);
  assert.match(match[0], /<button[^>]*type="submit"/);
  assert.match(match[0], /<form[^>]*emailControl/);
  assert.doesNotMatch(match[0], /href="#"/);
  assert.match(match[0], /href="\/markets"/);
  assert.match(match[0], /href="\/ipo"/);
  assert.match(match[0], /href="\/products"/);
  assert.match(match[0], /href="\/insights"/);
  assert.match(match[0], /href="\/stock-alerts"/);
  assert.match(match[0], /href="\/live-markets"/);
  assert.ok(
    html.indexOf('data-section="site-footer"') >
      html.indexOf('data-section="growth-cta"'),
    "Footer must render after Growth CTA",
  );
});
