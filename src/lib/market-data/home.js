import "server-only";
import { unstable_cache } from "next/cache";
import {
  FALLBACK_CHART,
  FALLBACK_IPOS,
  FALLBACK_QUOTES,
  FALLBACK_TIMESTAMP,
} from "./fallback.js";
import { formatMarketNumber, formatPercent } from "./normalize.js";
import { getIpoAlertsData } from "./providers/ipo-alerts.js";
import {
  getYahooHomepageData,
  getYahooChart,
  searchYahooSymbols,
} from "./providers/yahoo.js";

const INDEX_LABELS = {
  "^NSEI": "NIFTY 50",
  "^BSESN": "SENSEX",
  "^NSEBANK": "BANK NIFTY",
  "^INDIAVIX": "INDIA VIX",
  "^IXIC": "NASDAQ",
  "^GSPC": "S&P 500",
  "^DJI": "DOW JONES",
  "INR=X": "USD/INR",
  "GC=F": "GOLD FUTURES",
};

const TICKER_SYMBOLS = [
  "^NSEI",
  "^BSESN",
  "^NSEBANK",
  "^IXIC",
  "^GSPC",
  "^DJI",
  "INR=X",
];

const DASHBOARD_SYMBOLS = ["^NSEI", "^BSESN", "^NSEBANK", "^INDIAVIX"];
const COVERAGE_SYMBOLS = ["^NSEI", "^IXIC", "^BSESN", "INR=X", "GC=F", "^GSPC"];

function labelQuote(quote) {
  return { ...quote, label: INDEX_LABELS[quote.symbol] || quote.displaySymbol };
}

function newestTimestamp(items, fallback) {
  const dates = items
    .map((item) => Date.parse(item.updatedAt || ""))
    .filter(Number.isFinite);
  return dates.length ? new Date(Math.max(...dates)).toISOString() : fallback;
}

function makeOpportunity(quote, index) {
  const direction = quote.changePercent >= 0 ? 1 : -1;
  const target = quote.value * (1 + direction * (0.025 + index * 0.004));
  const stop = quote.value * (1 - direction * 0.018);
  const confidence = Math.max(
    68,
    Math.min(94, Math.round(74 + Math.abs(quote.changePercent || 0) * 4)),
  );

  return {
    ticker: quote.displaySymbol.slice(0, 3),
    symbol: quote.symbol,
    name: quote.displaySymbol,
    market: quote.symbol.startsWith("^") ? "Yahoo · Index" : "NSE · Equity",
    side: direction > 0 ? "BUY" : "SELL",
    entry: formatMarketNumber(quote.value),
    change: quote.formattedChange,
    target: formatMarketNumber(target),
    stop: formatMarketNumber(stop),
    confidence: `${confidence}%`,
    score: String(Math.min(98, confidence + 4)),
    time: "Live",
    href: quote.href,
  };
}

function mergeIpos(liveIpos) {
  const seen = new Set();
  return [...liveIpos, ...FALLBACK_IPOS]
    .filter((ipo) => {
      const key = `${ipo.symbol || ""}:${ipo.company}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 7);
}

async function loadHomeMarketData() {
  const [yahooResult, ipoResult] = await Promise.allSettled([
    getYahooHomepageData(),
    getIpoAlertsData(),
  ]);

  const yahooLive = yahooResult.status === "fulfilled";
  const liveQuotes = yahooLive ? yahooResult.value.quotes : [];
  const quoteMap = new Map(FALLBACK_QUOTES.map((quote) => [quote.symbol, quote]));
  for (const quote of liveQuotes) quoteMap.set(quote.symbol, quote);

  const allQuotes = [...quoteMap.values()].map(labelQuote);
  const equities = allQuotes.filter((quote) => quote.symbol.endsWith(".NS"));
  const gainers = [...equities]
    .filter((quote) => quote.changePercent !== null)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
  const losers = [...equities]
    .filter((quote) => quote.changePercent !== null)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
  const momentumUniverse = equities.filter((quote) => quote.changePercent !== null);
  const positiveShare = momentumUniverse.length
    ? momentumUniverse.filter((quote) => quote.changePercent >= 0).length /
      momentumUniverse.length
    : 0.5;
  const momentumScore = Math.round(45 + positiveShare * 45);
  const nseQuote = quoteMap.get("^NSEI");
  const marketOpen = ["REGULAR", "PRE", "POST"].includes(nseQuote?.marketState);

  const liveIpos = ipoResult.status === "fulfilled" ? ipoResult.value.ipos : [];
  const ipos = mergeIpos(liveIpos);
  const gmpIpos = ipos.filter((ipo) => ipo.gmpPercent !== null);
  const highestGmp = [...gmpIpos].sort((a, b) => b.gmpPercent - a.gmpPercent)[0] || null;
  const updatedAt = newestTimestamp(liveQuotes, FALLBACK_TIMESTAMP);

  return {
    updatedAt,
    market: {
      status: marketOpen ? "open" : "closed",
      statusLabel: marketOpen ? "Markets Open" : "Markets Closed",
      momentumScore,
      momentumLabel: momentumScore >= 60 ? "BULLISH" : momentumScore <= 45 ? "BEARISH" : "NEUTRAL",
      ticker: TICKER_SYMBOLS.map((symbol) => quoteMap.get(symbol)).filter(Boolean).map(labelQuote),
      indices: DASHBOARD_SYMBOLS.map((symbol) => quoteMap.get(symbol)).filter(Boolean).map(labelQuote),
      coverage: COVERAGE_SYMBOLS.map((symbol) => quoteMap.get(symbol)).filter(Boolean).map(labelQuote),
      gainers,
      losers,
      opportunities: gainers.slice(0, 4).map(makeOpportunity),
      chart:
        yahooLive && yahooResult.value.chart.length
          ? yahooResult.value.chart
          : FALLBACK_CHART,
    },
    ipo: {
      rows: ipos,
      total: ipos.length,
      highestGmp,
      updatedAt: newestTimestamp(liveIpos, FALLBACK_IPOS[0].updatedAt),
      partial:
        ipoResult.status !== "fulfilled" ||
        ipoResult.value.partial ||
        ipos.some((ipo) => ipo.sourceMode === "fallback"),
    },
    sources: {
      yahoo: {
        name: "Yahoo Finance",
        mode: yahooLive ? "live" : "fallback",
        message:
          yahooResult.status === "rejected"
            ? "Live market data is temporarily unavailable; last-known values are shown."
            : null,
      },
      ipo: {
        name: "IPO Alerts",
        mode:
          ipoResult.status === "fulfilled"
            ? ipoResult.value.partial
              ? "partial"
              : "live"
            : "fallback",
        message:
          ipoResult.status === "rejected"
            ? "Live IPO data is temporarily unavailable; clearly marked historical values are shown."
            : ipoResult.value.providerMessage,
      },
    },
  };
}

export const getHomeMarketData = unstable_cache(
  loadHomeMarketData,
  ["homepage-market-data-v1"],
  { revalidate: 60, tags: ["homepage-market-data"] },
);

export async function searchMarketSymbols(query) {
  return searchYahooSymbols(query);
}

export async function getMarketChart(symbol, range) {
  return getYahooChart(symbol, range);
}

export function marketQuotePresentation(quote) {
  return {
    value: quote?.formattedValue || "—",
    change: quote?.formattedChange || formatPercent(null),
  };
}
