import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeChart,
  normalizeIpo,
  normalizeQuote,
  normalizeSearchResult,
} from "../src/lib/market-data/normalize.js";

test("normalizes a Yahoo quote into the homepage contract", () => {
  const quote = normalizeQuote({
    symbol: "RELIANCE.NS",
    shortName: "Reliance Industries Limited",
    regularMarketPrice: 2987.4,
    regularMarketChangePercent: 2.345,
    regularMarketTime: new Date("2026-08-07T09:45:00.000Z"),
    currency: "INR",
    marketState: "REGULAR",
  });

  assert.deepEqual(quote, {
    symbol: "RELIANCE.NS",
    displaySymbol: "RELIANCE",
    name: "Reliance Industries Limited",
    value: 2987.4,
    formattedValue: "2,987.40",
    changePercent: 2.345,
    formattedChange: "+2.35%",
    direction: "up",
    volume: null,
    open: null,
    high: null,
    low: null,
    previousClose: null,
    currency: "INR",
    marketState: "REGULAR",
    updatedAt: "2026-08-07T09:45:00.000Z",
    href: "https://finance.yahoo.com/quote/RELIANCE.NS/",
  });
});

test("normalizes a Yahoo chart and removes null closes", () => {
  const points = normalizeChart({
    quotes: [
      { date: new Date("2026-08-07T03:45:00.000Z"), close: 24740.25 },
      { date: new Date("2026-08-07T03:50:00.000Z"), close: null },
      { date: new Date("2026-08-07T03:55:00.000Z"), close: 24758.5 },
    ],
  });

  assert.deepEqual(points, [
    { timestamp: "2026-08-07T03:45:00.000Z", value: 24740.25 },
    { timestamp: "2026-08-07T03:55:00.000Z", value: 24758.5 },
  ]);
});

test("normalizes IPO Alerts GMP data without inventing unavailable values", () => {
  const ipo = normalizeIpo({
    id: "ipo-1",
    name: "Example Industries Ltd",
    symbol: "EXAMPLE",
    issueSize: "1,250cr",
    priceRange: "100-110",
    status: "open",
    infoUrl: "https://example.test/ipo",
    gmp: {
      lastUpdatedAt: "2026-08-07T10:00:00.000Z",
      aggregations: { median: 22 },
    },
  });

  assert.equal(ipo.gmp, 22);
  assert.equal(ipo.gmpPercent, 20);
  assert.equal(ipo.estimatedListingPrice, 132);
  assert.equal(ipo.issueHigh, 110);
  assert.equal(ipo.sourceMode, "live");
  assert.equal(ipo.href, "https://example.test/ipo");

  const withoutGmp = normalizeIpo({
    id: "ipo-2",
    name: "No GMP Ltd",
    priceRange: "95-100",
    status: "upcoming",
  });
  assert.equal(withoutGmp.gmp, null);
  assert.equal(withoutGmp.gmpPercent, null);
  assert.equal(withoutGmp.estimatedListingPrice, null);
  assert.equal(withoutGmp.sourceMode, "partial");
});

test("filters unsafe Yahoo search records and creates direct quote links", () => {
  assert.equal(
    normalizeSearchResult({ symbol: "<script>", quoteType: "EQUITY" }),
    null,
  );
  assert.deepEqual(
    normalizeSearchResult({
      symbol: "TCS.NS",
      shortname: "Tata Consultancy Services Limited",
      exchDisp: "NSE",
      quoteType: "EQUITY",
    }),
    {
      symbol: "TCS.NS",
      name: "Tata Consultancy Services Limited",
      exchange: "NSE",
      type: "EQUITY",
      href: "https://finance.yahoo.com/quote/TCS.NS/",
    },
  );
});
