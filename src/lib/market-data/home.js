import "server-only";
import { unstable_cache } from "next/cache";
import { formatMarketNumber, formatPercent } from "./normalize.js";
import { buildSectorQuotes, isSectorSymbol } from "./sectors.js";
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
  "^NDX": "NASDAQ 100",
  "^GSPC": "S&P 500",
  "^DJI": "DOW JONES",
  "^FTSE": "FTSE 100",
  "^GDAXI": "DAX",
  "^N225": "NIKKEI 225",
  "^HSI": "HANG SENG",
  "000001.SS": "SHANGHAI COMPOSITE",
  "^KS11": "KOSPI",
  "^AXJO": "ASX 200",
  "^STI": "SINGAPORE STI",
  "^FCHI": "CAC 40",
  "^STOXX50E": "EURO STOXX 50",
  "^IBEX": "IBEX 35",
  "FTSEMIB.MI": "FTSE MIB",
  "^SSMI": "SWISS MARKET",
  "INR=X": "USD/INR",
  "GC=F": "GOLD FUTURES",
  "BZ=F": "BRENT CRUDE",
  "BTC-USD": "BITCOIN USD",
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
const COVERAGE_SYMBOLS = [
  "^NSEI", "^IXIC", "^NDX", "^BSESN", "INR=X", "GC=F", "BZ=F", "BTC-USD",
  "^GSPC", "^DJI", "^FTSE", "^GDAXI", "^N225", "^HSI", "000001.SS", "^KS11",
  "^AXJO", "^STI", "^FCHI", "^STOXX50E", "^IBEX", "FTSEMIB.MI", "^SSMI",
];

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

async function loadHomeMarketData() {
  const [yahooResult, ipoResult] = await Promise.allSettled([
    getYahooHomepageData(),
    getIpoAlertsData(),
  ]);

  const yahooLive = yahooResult.status === "fulfilled";
  const liveQuotes = yahooLive ? yahooResult.value.quotes : [];
  const quoteMap = new Map(liveQuotes.map((quote) => [quote.symbol, quote]));

  const allQuotes = [...quoteMap.values()].map(labelQuote);
  const equities = allQuotes.filter(
    (quote) => quote.symbol.endsWith(".NS") && !isSectorSymbol(quote.symbol),
  );
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
    : null;
  const momentumScore = positiveShare === null ? null : Math.round(45 + positiveShare * 45);
  const nseQuote = quoteMap.get("^NSEI");
  const marketOpen = nseQuote?.marketState === "REGULAR";

  const liveIpos = ipoResult.status === "fulfilled" ? ipoResult.value.ipos : [];
  const ipos = liveIpos.slice(0, 7);
  const gmpIpos = ipos.filter((ipo) => ipo.gmpPercent !== null);
  const highestGmp = [...gmpIpos].sort((a, b) => b.gmpPercent - a.gmpPercent)[0] || null;
  const updatedAt = newestTimestamp(liveQuotes, null);

  return {
    updatedAt,
    market: {
      status: !nseQuote ? "unavailable" : marketOpen ? "open" : "closed",
      statusLabel: !nseQuote ? "Market data unavailable" : marketOpen ? "Markets Open" : "Markets Closed",
      momentumScore,
      momentumLabel: momentumScore === null ? "UNAVAILABLE" : momentumScore >= 60 ? "BULLISH" : momentumScore <= 45 ? "BEARISH" : "NEUTRAL",
      ticker: TICKER_SYMBOLS.map((symbol) => quoteMap.get(symbol)).filter(Boolean).map(labelQuote),
      indices: DASHBOARD_SYMBOLS.map((symbol) => quoteMap.get(symbol)).filter(Boolean).map(labelQuote),
      coverage: COVERAGE_SYMBOLS.map((symbol) => quoteMap.get(symbol)).filter(Boolean).map(labelQuote),
      equities,
      sectors: buildSectorQuotes(liveQuotes),
      earnings: yahooLive ? yahooResult.value.earnings || [] : [],
      gainers,
      losers,
      opportunities: gainers.slice(0, 4).map(makeOpportunity),
      chart: yahooLive ? yahooResult.value.chart : [],
    },
    ipo: {
      rows: ipos,
      total: ipos.length,
      highestGmp,
      updatedAt: newestTimestamp(liveIpos, null),
      partial:
        ipoResult.status !== "fulfilled" ||
        ipoResult.value.partial,
    },
    sources: {
      yahoo: {
        name: "Yahoo Finance",
        mode: yahooLive ? "live" : "unavailable",
        message:
          yahooResult.status === "rejected"
            ? "Live market data is temporarily unavailable. Values are hidden until the feed recovers."
            : null,
      },
      ipo: {
        name: "IPO Alerts",
        mode:
          ipoResult.status === "fulfilled"
            ? ipoResult.value.partial
              ? "partial"
              : "live"
            : "unavailable",
        message:
          ipoResult.status === "rejected"
            ? "Live IPO data is temporarily unavailable. No historical demo values are shown."
            : ipoResult.value.providerMessage,
      },
    },
  };
}

export const getHomeMarketData = unstable_cache(
  loadHomeMarketData,
  ["homepage-market-data-v8-live-only"],
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
