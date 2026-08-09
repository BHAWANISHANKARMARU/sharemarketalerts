import assert from "node:assert/strict";
import test from "node:test";

import * as marketsOverview from "../src/lib/market-data/markets-overview.js";

const { buildMarketsOverview } = marketsOverview;

function quote(symbol, label, value, changePercent) {
  return {
    symbol,
    label,
    displaySymbol: symbol,
    formattedValue: value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    formattedChange: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
    changePercent,
    direction: changePercent < 0 ? "down" : "up",
    href: `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}/`,
  };
}

const fixtureMarket = {
  status: "closed",
  statusLabel: "Markets Closed",
  indices: [
    quote("^INDIAVIX", "INDIA VIX", 12.16, 1.02),
    quote("^NSEBANK", "BANK NIFTY", 57746.45, -0.55),
    quote("^NSEI", "NIFTY 50", 24570.65, -0.27),
    quote("^BSESN", "SENSEX", 78499.17, -0.58),
  ],
  gainers: Array.from({ length: 20 }, (_, index) =>
    quote(`GAIN${index}.NS`, `GAIN ${index}`, 100 + index, 2),
  ),
  losers: Array.from({ length: 10 }, (_, index) =>
    quote(`LOSE${index}.NS`, `LOSE ${index}`, 100 + index, -1),
  ),
  chart: [
    { timestamp: "2026-08-09T03:45:00.000Z", value: 24520 },
    { timestamp: "2026-08-09T04:00:00.000Z", value: 24570.65 },
  ],
};

test("overview model orders the reference indices and derives live breadth", () => {
  const model = buildMarketsOverview(
    fixtureMarket,
    "2026-08-09T04:00:00.000Z",
  );

  assert.deepEqual(
    model.indices.map((row) => row.label),
    ["NIFTY 50", "SENSEX", "BANK NIFTY", "INDIA VIX"],
  );
  assert.equal(model.lead.formattedValue, "24,570.65");
  assert.equal(model.metrics[0].primary, "20 / 10");
  assert.equal(model.metrics[1].primary, "2.00");
  assert.equal(model.statusLabel, "Markets Closed");
});

test("overview model hides financial values when feeds are empty", () => {
  const model = buildMarketsOverview(
    { indices: [], gainers: [], losers: [], chart: [] },
    null,
  );

  assert.equal(model.indices.length, 4);
  assert.equal(model.lead.formattedValue, "—");
  assert.equal(model.metrics[0].primary, "— / —");
  assert.equal(model.chart.length, 0);
});

test("overview model labels breadth as the tracked live universe", () => {
  const model = buildMarketsOverview({
    ...fixtureMarket,
    gainers: fixtureMarket.gainers.slice(0, 2),
    losers: fixtureMarket.losers.slice(0, 1),
  }, null);

  assert.equal(model.metrics[0].primary, "2 / 1");
  assert.equal(model.metrics[1].primary, "2.00");
  assert.equal(model.metrics[1].detail, "Advancing");
});

test("overview model never fabricates sparkline history from OHLC summary values", () => {
  const market = {
    ...fixtureMarket,
    indices: fixtureMarket.indices.map((row, index) => ({
      ...row,
      previousClose: 78_000 + index * 100,
      open: 78_004 + index * 100,
      low: 77_990 + index * 100,
      high: 78_018 + index * 100,
      value: 78_010 + index * 100,
    })),
  };

  const model = buildMarketsOverview(market, null);
  const sensex = model.indices.find((row) => row.symbol === "^BSESN");

  assert.deepEqual(sensex.sparkline, []);
});

test("overview model uses provider intraday points for index sparklines", () => {
  const sensexSeries = Array.from({ length: 12 }, (_, index) => ({
    timestamp: `2026-08-08T0${Math.floor(index / 2)}:${index % 2 ? "20" : "10"}:00.000Z`,
    value: 78_400 + index * 7,
  }));
  const model = buildMarketsOverview({
    ...fixtureMarket,
    chartSeries: { "^BSESN": sensexSeries },
  }, null);
  const sensex = model.indices.find((row) => row.symbol === "^BSESN");

  assert.equal(sensex.sparkline.length, 12);
  assert.deepEqual(sensex.sparkline[0], { index: 0, value: 78_400 });
  assert.deepEqual(sensex.sparkline.at(-1), { index: 11, value: 78_477 });
});

test("chart tooltip reads the value and timestamp of each hovered point", () => {
  assert.equal(typeof marketsOverview.readChartTooltipPoint, "function");
  const first = marketsOverview.readChartTooltipPoint([{
    payload: { value: 31_146.2, timestamp: "2026-08-07T03:45:00.000Z" },
  }]);
  const second = marketsOverview.readChartTooltipPoint([{
    payload: { value: 31_547.7, timestamp: "2026-08-07T09:55:00.000Z" },
  }]);

  assert.deepEqual(first, { value: 31_146.2, timestamp: "2026-08-07T03:45:00.000Z" });
  assert.deepEqual(second, { value: 31_547.7, timestamp: "2026-08-07T09:55:00.000Z" });
  assert.notEqual(first.value, second.value);
});
