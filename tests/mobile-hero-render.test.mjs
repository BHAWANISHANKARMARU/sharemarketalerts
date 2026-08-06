import assert from "node:assert/strict";
import test from "node:test";

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?/])/g, "$1")
    .trim();
}

const MOBILE_COPY = [
  "SHAREMARKETALERTS",
  "Free Trial",
  "LIVE",
  "Market Pulse",
  "AI-POWERED MARKET INTELLIGENCE",
  "Intelligence",
  "that moves first.",
  "Real-time AI scans uncover high-probability opportunities before the crowd sees them.",
  "Start Free Trial",
  "See It In Action",
  "Market Momentum",
  "BULLISH",
  "Momentum Score",
  "Breakout Signal",
  "High Probability",
  "Strength",
  "Top Movers",
  "Risk Level",
  "LOW",
  "Well Balanced",
  "28/100",
  "Risk Score",
  "AI Real-Time Scanning",
  "Never miss a move.",
  "Instant Alerts",
  "Delivered in real-time.",
  "High Accuracy",
  "Backtested & proven.",
];

test("homepage renders the approved mobile and tablet hero contract", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const section = html.match(
    /<section[^>]+data-mobile-hero="true"[\s\S]*?<\/section>/,
  );
  assert.ok(section, "Missing dedicated mobile hero");

  assert.ok(
    !section[0].includes('data-mobile-phone="true"'),
    "Mobile hero must render as page content, not inside a phone mockup",
  );

  const text = visibleText(section[0]);
  for (const copy of MOBILE_COPY) {
    assert.ok(text.includes(copy), `Missing mobile copy: ${copy}`);
  }

  assert.match(text, /(?:BULLISH|BEARISH|NEUTRAL) \d{1,3}\s*% Momentum Score/);
  assert.ok((section[0].match(/finance\.yahoo\.com\/quote\//g)?.length ?? 0) >= 4);

  const momentum = section[0].indexOf('data-mobile-card="momentum"');
  const breakout = section[0].indexOf('data-mobile-card="breakout"');
  const movers = section[0].indexOf('data-mobile-card="movers"');
  const risk = section[0].indexOf('data-mobile-card="risk"');
  assert.ok(
    momentum >= 0 && momentum < breakout && breakout < movers && movers < risk,
    "Mobile cards must follow the approved order",
  );

  assert.ok(
    section[0].includes("mobile-market-momentum-v1"),
    "Mobile hero must use the generated momentum asset",
  );
  assert.equal(
    (section[0].match(/data-mobile-feature="true"/g) ?? []).length,
    3,
  );
});
