import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "IPO GMP Tracker",
  "Grey Market Premium Overview",
  "TOTAL IPOS TRACKED",
  "Companies",
  "HIGHEST GMP %",
  "LAST UPDATE",
  "Company Name",
  "IPO Size (₹ Cr)",
  "Issue Price (₹)",
  "GMP (₹)",
  "GMP % (%)",
  "Estimated Listing Price (₹)",
  "Expected Listing Gain (%)",
  "Last Updated",
  "WHAT IS GMP?",
  "Grey Market Premium (GMP) is the unofficial premium at which IPO shares are trading in the grey market before listing.",
  "DISCLAIMER",
  "GMP is not regulated by any authority. It is subject to market risks. Please invest only after your own research and due diligence.",
  "Source:",
  "IPO Alerts",
  "Data as on",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

test("homepage renders the live IPO GMP Tracker directly after Hero", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);

  for (const copy of REQUIRED_COPY) {
    assert.ok(text.includes(copy), "Missing: " + copy);
  }

  const hero = text.indexOf("AI-POWERED MARKET INTELLIGENCE");
  const tracker = text.indexOf("IPO GMP Tracker");
  const howItWorks = text.indexOf("How signals become conviction.");
  assert.ok(hero >= 0 && tracker > hero && howItWorks > tracker);

  const sectionMatch = html.match(
    /<section[^>]+id="ipo-gmp-tracker"[^>]+aria-labelledby="ipo-market-intelligence-title"[\s\S]*?<\/section>/,
  );
  assert.ok(sectionMatch, "Missing labelled IPO GMP Tracker section");
  assert.match(sectionMatch[0], /data-ipo-source="(?:live|partial|unavailable)"/);

  const summaryMatch = sectionMatch[0].match(
    /<div[^>]+aria-label="IPO summary"[^>]*>([\s\S]*?)<table/,
  );
  assert.ok(summaryMatch, "Missing IPO summary region");
  assert.equal((summaryMatch[1].match(/<article/g) || []).length, 3);

  const tableMatch = sectionMatch[0].match(/<table[^>]*>([\s\S]*?)<\/table>/);
  assert.ok(tableMatch, "Missing semantic GMP table");
  assert.equal((tableMatch[0].match(/<th scope="col"/g) || []).length, 8);

  const bodyMatch = tableMatch[0].match(/<tbody>([\s\S]*?)<\/tbody>/);
  assert.ok(bodyMatch, "Missing GMP table body");
  const rowCount = (bodyMatch[1].match(/<tr>/g) || []).length;
  assert.ok(rowCount >= 1, "Expected at least one row from the live IPO provider");
  assert.equal((bodyMatch[1].match(/target="_blank"/g) || []).length, rowCount);
});
