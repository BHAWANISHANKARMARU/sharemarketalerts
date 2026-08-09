import assert from "node:assert/strict";
import test from "node:test";

import {
  getMarketRangeConfig,
  MARKET_RANGES,
} from "../src/lib/market-data/ranges.js";

test("market chart ranges include every overview period", () => {
  assert.deepEqual(MARKET_RANGES, ["1D", "5D", "1M", "6M", "1Y"]);
  assert.deepEqual(getMarketRangeConfig("6M"), {
    days: 190,
    interval: "1d",
  });
  assert.equal(getMarketRangeConfig("invalid"), null);
});

test("market chart API serves full intraday series for sector indices", async () => {
  const response = await fetch(
    "http://localhost:3000/api/market/chart?symbol=%5ECNXIT&range=1D",
  );

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.symbol, "^CNXIT");
  assert.ok(payload.points.length > 5, "sector chart should contain real intraday history");
});

test("batch chart API returns independent live series for every requested card", async () => {
  const params = new URLSearchParams();
  for (const symbol of ["^CNXIT", "^BSESN", "^GSPC"]) params.append("symbol", symbol);
  params.set("range", "1D");
  const response = await fetch(`http://localhost:3000/api/market/charts?${params}`);

  assert.equal(response.status, 200);
  const payload = await response.json();
  for (const symbol of ["^CNXIT", "^BSESN", "^GSPC"]) {
    assert.ok(payload.series[symbol].length > 5, `${symbol} should have its own intraday history`);
  }
});
