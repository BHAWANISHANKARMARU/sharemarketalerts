import "server-only";
import YahooFinance from "yahoo-finance2";
import {
  isSafeSearchQuery,
  normalizeChart,
  normalizeQuote,
  normalizeSearchResult,
} from "../normalize.js";
import { getMarketRangeConfig } from "../ranges.js";
import { SECTOR_SYMBOLS } from "../sectors.js";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export const HOME_SYMBOLS = [
  "^NSEI",
  "^BSESN",
  "^NSEBANK",
  "^INDIAVIX",
  "^IXIC",
  "^NDX",
  "^GSPC",
  "^DJI",
  "^FTSE",
  "^GDAXI",
  "^N225",
  "^HSI",
  "000001.SS",
  "^KS11",
  "^AXJO",
  "^STI",
  "^FCHI",
  "^STOXX50E",
  "^IBEX",
  "FTSEMIB.MI",
  "^SSMI",
  "INR=X",
  "GC=F",
  "BZ=F",
  "BTC-USD",
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
  ...SECTOR_SYMBOLS,
];

const EARNINGS_SYMBOLS = [
  "TCS.NS",
  "HDFCBANK.NS",
  "RELIANCE.NS",
  "INFY.NS",
  "ICICIBANK.NS",
  "TATAMOTORS.NS",
  "WIPRO.NS",
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
  const [quotesResult, chartResult, earningsResults] = await Promise.all([
    Promise.resolve(withTimeout(
      yahooFinance.quote(HOME_SYMBOLS, undefined, { validateResult: false }),
      9000,
      "Yahoo quotes",
    )).then((value) => ({ status: "fulfilled", value }), (reason) => ({ status: "rejected", reason })),
    Promise.resolve(withTimeout(
      yahooFinance.chart("^NSEI", {
        period1,
        interval: "5m",
        return: "array",
      }),
      9000,
      "Yahoo chart",
    )).then((value) => ({ status: "fulfilled", value }), (reason) => ({ status: "rejected", reason })),
    Promise.allSettled(EARNINGS_SYMBOLS.map((symbol) => withTimeout(
      yahooFinance.quoteSummary(
        symbol,
        { modules: ["calendarEvents"] },
        { validateResult: false },
      ),
      7000,
      `Yahoo earnings ${symbol}`,
    ).then((result) => ({ symbol, result })))),
  ]);

  if (quotesResult.status !== "fulfilled") throw quotesResult.reason;
  const rawQuotes = quotesResult.value;
  const quotes = rawQuotes.map(normalizeQuote).filter(Boolean);
  const chart = chartResult.status === "fulfilled" ? normalizeChart(chartResult.value).slice(-96) : [];
  const earnings = earningsResults.flatMap((entry) => {
    if (entry.status !== "fulfilled") return [];
    const { symbol, result } = entry.value;
    const event = result?.calendarEvents?.earnings;
    const date = event?.earningsDate?.[0];
    if (!date) return [];
    const timestamp = date instanceof Date ? date.toISOString() : new Date(date).toISOString();
    if (Number.isNaN(Date.parse(timestamp))) return [];
    return [{
      symbol,
      date: timestamp,
      estimated: Boolean(event.isEarningsDateEstimate),
      earningsAverage: Number.isFinite(Number(event.earningsAverage)) ? Number(event.earningsAverage) : null,
      earningsLow: Number.isFinite(Number(event.earningsLow)) ? Number(event.earningsLow) : null,
      earningsHigh: Number.isFinite(Number(event.earningsHigh)) ? Number(event.earningsHigh) : null,
      revenueAverage: Number.isFinite(Number(event.revenueAverage)) ? Number(event.revenueAverage) : null,
    }];
  }).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  if (!quotes.length) throw new Error("Yahoo returned no usable quotes");

  return { quotes, chart, earnings };
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

export async function getYahooChart(symbol, range = "1D") {
  const config = getMarketRangeConfig(range);
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

  const points = normalizeChart(result);
  return points.slice(range === "1D" ? -96 : -180);
}
