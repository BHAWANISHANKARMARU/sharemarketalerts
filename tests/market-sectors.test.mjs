import assert from "node:assert/strict";
import test from "node:test";

import {
  SECTOR_DEFINITIONS,
  SECTOR_SYMBOLS,
  buildSectorQuotes,
  isSectorSymbol,
} from "../src/lib/market-data/sectors.js";

test("sector quote model maps the live Yahoo index feed into the heatmap order", () => {
  const quotes = SECTOR_DEFINITIONS.map(({ symbol }, index) => ({
    symbol,
    changePercent: index % 2 === 0 ? index + 0.25 : -(index + 0.5),
    formattedChange: index % 2 === 0 ? `+${index + 0.25}%` : `-${index + 0.5}%`,
    updatedAt: "2026-08-09T09:30:00.000Z",
  }));

  const sectors = buildSectorQuotes(quotes);

  assert.equal(SECTOR_DEFINITIONS.length, 13);
  assert.deepEqual(SECTOR_SYMBOLS, SECTOR_DEFINITIONS.map(({ symbol }) => symbol));
  assert.deepEqual(
    sectors.map(({ label, symbol, changePercent }) => ({ label, symbol, changePercent })),
    SECTOR_DEFINITIONS.map(({ label, symbol }, index) => ({
      label,
      symbol,
      changePercent: index % 2 === 0 ? index + 0.25 : -(index + 0.5),
    })),
  );
});

test("sector symbols remain separate from the equity mover universe", () => {
  assert.equal(isSectorSymbol("NIFTY_MOBILITY.NS"), true);
  assert.equal(isSectorSymbol("NIFTY_INDIA_MFG.NS"), true);
  assert.equal(isSectorSymbol("TCS.NS"), false);
});

test("sector quote model omits unavailable rows instead of inventing live values", () => {
  const [first, second] = SECTOR_DEFINITIONS;
  const sectors = buildSectorQuotes([
    { symbol: first.symbol, changePercent: 1.42 },
    { symbol: second.symbol, changePercent: null },
    { symbol: "UNKNOWN", changePercent: 9.99 },
  ]);

  assert.deepEqual(sectors, [
    { symbol: first.symbol, label: first.label, changePercent: 1.42 },
  ]);
});
