import "server-only";
import YahooFinance from "yahoo-finance2";
import {
  isSafeSearchQuery,
  normalizeChart,
  normalizeQuote,
  normalizeSearchResult,
} from "../normalize.js";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export const HOME_SYMBOLS = [
  "^NSEI",
  "^BSESN",
  "^NSEBANK",
  "^INDIAVIX",
  "^IXIC",
  "^GSPC",
  "^DJI",
  "INR=X",
  "GC=F",
  "RELIANCE.NS",
  "TCS.NS",
  "HDFCBANK.NS",
  "INFY.NS",
  "ICICIBANK.NS",
  "TATAMOTORS.NS",
  "ADANIENT.NS",
  "WIPRO.NS",
  "JSWSTEEL.NS",
  "BPCL.NS",
  "TITAN.NS",
];

function withTimeout(promise, milliseconds, label) {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(
      () => reject(new Error(`${label} timed out after ${milliseconds}ms`)),
      milliseconds,
    );
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeout));
}

export async function getYahooHomepageData() {
  const period1 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [rawQuotes, rawChart] = await Promise.all([
    withTimeout(yahooFinance.quote(HOME_SYMBOLS), 9000, "Yahoo quotes"),
    withTimeout(
      yahooFinance.chart("^NSEI", {
        period1,
        interval: "5m",
        return: "array",
      }),
      9000,
      "Yahoo chart",
    ),
  ]);

  const quotes = rawQuotes.map(normalizeQuote).filter(Boolean);
  const chart = normalizeChart(rawChart).slice(-96);
  if (!quotes.length) throw new Error("Yahoo returned no usable quotes");

  return { quotes, chart };
}

export async function searchYahooSymbols(query) {
  const cleanQuery = String(query ?? "").trim();
  if (!isSafeSearchQuery(cleanQuery)) return [];

  const result = await withTimeout(
    yahooFinance.search(cleanQuery, {
      quotesCount: 8,
      newsCount: 0,
      region: "IN",
      lang: "en-IN",
      enableFuzzyQuery: true,
    }),
    7000,
    "Yahoo search",
  );

  return (result.quotes || []).map(normalizeSearchResult).filter(Boolean).slice(0, 8);
}

const RANGE_CONFIG = {
  "1D": { days: 2, interval: "5m" },
  "5D": { days: 7, interval: "15m" },
  "1M": { days: 35, interval: "1h" },
  "3M": { days: 100, interval: "1d" },
  "1Y": { days: 370, interval: "1d" },
};

export async function getYahooChart(symbol, range = "1D") {
  const config = RANGE_CONFIG[range];
  if (!config) throw new Error("Unsupported chart range");
  const result = await withTimeout(
    yahooFinance.chart(symbol, {
      period1: new Date(Date.now() - config.days * 24 * 60 * 60 * 1000),
      interval: config.interval,
      return: "array",
    }),
    9000,
    "Yahoo chart",
  );

  return normalizeChart(result).slice(-180);
}
