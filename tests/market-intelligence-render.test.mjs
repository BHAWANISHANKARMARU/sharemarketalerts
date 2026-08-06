import assert from "node:assert/strict";
import test from "node:test";

const COPY = [
  "SHARE MARKET ALERTS",
  "SEE IT BEFORE THE MARKET MOVES.",
  "Real-time intelligence that surfaces high-probability opportunities before everyone else.",
  "MARKETS DON'T WAIT.",
  "Neither should you.",
  "MARKET STATUS:",
  "NIFTY 50",
  "SENSEX",
  "BANK NIFTY",
  "INDIA VIX",
  "MARKETS SCANNED",
  "Asset Classes",
  "MARKET PULSE",
  "1D",
  "5D",
  "1M",
  "3M",
  "1Y",
  "NIFTY 50 INDEX",
  "OPEN",
  "HIGH",
  "LOW",
  "CLOSE",
  "CHANGE",
  "VOLUME",
  "MARKET BREADTH",
  "ADVANCES",
  "DECLINES",
  "FII / DII ACTIVITY (₹ Cr)",
  "FII NET BUY",
  "DII NET BUY",
  "VOLATILITY INDEX",
  "India VIX",
  "MARKET SENTIMENT",
  "TOP GAINERS",
  "TOP LOSERS",
  "VIEW ALL →",
  "LIVE HIGH PROBABILITY OPPORTUNITIES",
  "ENTRY",
  "TARGET",
  "STOP LOSS",
  "CONFIDENCE",
  "SCORE",
  "TIME",
];

function toVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

test("the homepage renders the functional live Market Intelligence section after What You Receive", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);

  const html = await response.text();
  const visible = toVisibleText(html);
  for (const copy of COPY) {
    assert.ok(visible.includes(copy), `Missing: ${copy}`);
  }

  const sectionStart = html.indexOf('data-section="market-intelligence"');
  const sectionEnd = html.indexOf('data-section="market-coverage"', sectionStart);
  assert.ok(sectionStart >= 0 && sectionEnd > sectionStart, "Market Intelligence section is missing");
  const section = html.slice(sectionStart, sectionEnd);
  assert.match(section, /data-market-source="(?:live|fallback)"/);
  assert.match(section, /MARKETS (?:OPEN|CLOSED)/);
  assert.equal(section.match(/role="group"/g)?.length ?? 0, 1);
  assert.equal(section.match(/aria-pressed=/g)?.length ?? 0, 5);
  assert.match(section, /<select/);
  assert.ok((section.match(/finance\.yahoo\.com\/quote\//g) ?? []).length >= 10);

  assert.ok(
    visible.indexOf("SEE IT BEFORE THE MARKET MOVES.") >
      visible.indexOf("Everything you need, in one decisive signal."),
    "Market Intelligence must render below What You Receive",
  );
});
