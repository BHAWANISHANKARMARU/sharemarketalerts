export const MARKET_RANGE_CONFIG = Object.freeze({
  "1D": Object.freeze({ days: 7, interval: "5m" }),
  "5D": Object.freeze({ days: 7, interval: "15m" }),
  "1M": Object.freeze({ days: 35, interval: "1h" }),
  "6M": Object.freeze({ days: 190, interval: "1d" }),
  "1Y": Object.freeze({ days: 370, interval: "1d" }),
});

export const MARKET_RANGES = Object.freeze(Object.keys(MARKET_RANGE_CONFIG));

export function getMarketRangeConfig(range) {
  return MARKET_RANGE_CONFIG[range] || null;
}
