import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "MARKET COVERAGE",
  "Every market. One intelligence.",
  "Comprehensive coverage across indices, stocks, sectors, commodities, forex and global markets.",
  "We scan millions of signals 24/7 so you never miss an opportunity.",
  "150+",
  "Exchanges",
  "Across 6 continents",
  "120K+",
  "Instruments",
  "Stocks, ETFs, futures & more",
  "24/7",
  "Market Scanning",
  "Real-time • Non-stop",
  "99.9%",
  "Uptime",
  "Reliable. Always on.",
  "NSE",
  "India",
  "NASDAQ",
  "United States",
  "BSE",
  "FOREX",
  "Global",
  "COMMODITIES",
  "GLOBAL MARKETS",
  "Worldwide",
  "What we cover",
  "Indices",
  "Global benchmarks",
  "Stocks",
  "Large, mid & small caps",
  "Sectors",
  "Sector-wise opportunities",
  "Commodities",
  "Metals, energy & agri",
  "Forex",
  "Major currency pairs",
  "Global Markets",
  "Worldwide exchanges",
  "50,000+",
  "Global indices",
  "100,000+",
  "Stocks tracked",
  "24+",
  "Major sectors",
  "100+",
  "180+",
  "Currency pairs",
  "70+",
  "Countries covered",
  "One platform. Every market. Endless opportunities.",
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

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}

function assertOrderedText(value, items, scope) {
  let previousIndex = -1;

  for (const item of items) {
    const index = value.indexOf(item, previousIndex + 1);
    assert.ok(index > previousIndex, `${scope} is missing or misordered: ${item}`);
    previousIndex = index;
  }
}

test("Market Coverage renders after Market Intelligence with the complete approved content", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sectionMatch = html.match(
    /<section[^>]*data-section="market-coverage"[\s\S]*?<\/section>/,
  );
  assert.ok(sectionMatch, "Market Coverage section is missing");
  assert.match(sectionMatch[0], /id="market-coverage"/);
  assert.match(sectionMatch[0], /aria-labelledby="market-coverage-title"/);

  const sectionText = visibleText(sectionMatch[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(sectionText.includes(copy), `Missing from Market Coverage: ${copy}`);
  }

  const globeImage = sectionMatch[0].match(
    /<img\b[^>]*src="\/images\/market-coverage-globe-reference\.png"[^>]*>/,
  );
  assert.ok(
    globeImage,
    "Market Coverage must render the approved reference-derived globe image",
  );
  assert.match(globeImage[0], /alt=""/);
  assert.match(globeImage[0], /aria-hidden="true"/);
  assert.match(globeImage[0], /width="1318"/);
  assert.match(globeImage[0], /height="1193"/);

  const marketList = sectionMatch[0].match(
    /<ul[^>]*aria-label="Covered market examples"[\s\S]*?<\/ul>/,
  );
  assert.ok(marketList, "Covered market examples must be a named list");
  assert.equal(countMatches(marketList[0], /<li\b/g), 6);
  assert.equal(countMatches(marketList[0], /finance\.yahoo\.com\/quote\//g), 6);
  assert.equal(countMatches(marketList[0], /aria-label="View [^"]* on Yahoo Finance"/g), 6);
  assertOrderedText(visibleText(marketList[0]), ["NSE India", "NASDAQ United States", "BSE India", "FOREX Global", "COMMODITIES Global", "GLOBAL MARKETS Worldwide"], "Market cards");

  const coverageList = sectionMatch[0].match(
    /<aside[^>]*aria-labelledby="coverage-list-title"[\s\S]*?<\/aside>/,
  );
  assert.ok(coverageList, "What we cover list is missing");
  assert.equal(countMatches(coverageList[0], /<li\b/g), 6);
  assert.equal(countMatches(coverageList[0], /<a\b/g), 6);
  assertOrderedText(
    visibleText(coverageList[0]),
    [
      "Indices Global benchmarks",
      "Stocks Large, mid & small caps",
      "Sectors Sector-wise opportunities",
      "Commodities Metals, energy & agri",
      "Forex Major currency pairs",
      "Global Markets Worldwide exchanges",
    ],
    "Coverage rows",
  );

  const summaryList = sectionMatch[0].match(
    /<ul[^>]*aria-label="Coverage totals"[\s\S]*?<\/ul>/,
  );
  assert.ok(summaryList, "Coverage totals must be a named list");
  assert.equal(countMatches(summaryList[0], /<li\b/g), 6);
  assertOrderedText(
    visibleText(summaryList[0]),
    [
      "Indices 50,000+ Global indices",
      "Stocks 100,000+ Stocks tracked",
      "Sectors 24+ Major sectors",
      "Commodities 100+ Commodities",
      "Forex 180+ Currency pairs",
      "Global Markets 70+ Countries covered",
    ],
    "Coverage totals",
  );

  const svgTags = sectionMatch[0].match(/<svg\b[^>]*>/g) ?? [];
  assert.ok(svgTags.length > 0, "Market Coverage SVG visuals are missing");
  for (const svg of svgTags) {
    assert.match(svg, /aria-hidden="true"/);
    assert.match(svg, /focusable="false"/);
  }

  assert.ok(
    html.indexOf('data-section="market-coverage"') >
      html.indexOf("SEE IT BEFORE THE MARKET MOVES."),
    "Market Coverage must render below Market Intelligence",
  );
});
