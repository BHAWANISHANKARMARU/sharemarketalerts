import { instrumentLogoUrl } from "../../app/lib/instrument-logos.js";

const SYMBOL_PATTERN = /^[A-Z0-9^=._-]{1,32}$/i;

function finiteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function isoDate(value) {
  if (!value) return null;
  const normalized = typeof value === "number" && value > 0 && value < 1_000_000_000_000
    ? value * 1000
    : value;
  const date = normalized instanceof Date ? normalized : new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function formatMarketNumber(value, digits = 2) {
  const number = finiteNumber(value);
  if (number === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(number);
}

export function formatPercent(value) {
  const number = finiteNumber(value);
  if (number === null) return "—";
  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
}

export function yahooQuoteHref(symbol) {
  if (!SYMBOL_PATTERN.test(symbol ?? "")) return null;
  return `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}/`;
}

export function normalizeQuote(raw = {}) {
  const symbol = String(raw.symbol ?? "").toUpperCase();
  if (!SYMBOL_PATTERN.test(symbol)) return null;

  const value = finiteNumber(raw.regularMarketPrice);
  const changePercent = finiteNumber(raw.regularMarketChangePercent);
  if (value === null) return null;

  return {
    symbol,
    displaySymbol: symbol.replace(/\.NS$|\.BO$/i, ""),
    name: raw.longName || raw.shortName || symbol,
    value,
    formattedValue: formatMarketNumber(value),
    changePercent,
    formattedChange: formatPercent(changePercent),
    direction:
      changePercent === null ? "flat" : changePercent < 0 ? "down" : "up",
    volume: finiteNumber(raw.regularMarketVolume),
    averageVolume: finiteNumber(raw.averageDailyVolume3Month),
    open: finiteNumber(raw.regularMarketOpen),
    high: finiteNumber(raw.regularMarketDayHigh),
    low: finiteNumber(raw.regularMarketDayLow),
    previousClose: finiteNumber(raw.regularMarketPreviousClose),
    fiftyTwoWeekHigh: finiteNumber(raw.fiftyTwoWeekHigh),
    fiftyTwoWeekLow: finiteNumber(raw.fiftyTwoWeekLow),
    currency: raw.currency || null,
    exchange: raw.fullExchangeName || raw.exchange || null,
    timeZone: raw.exchangeTimezoneName || null,
    timeZoneShortName: raw.exchangeTimezoneShortName || null,
    delayMinutes: finiteNumber(raw.exchangeDataDelayedBy),
    marketState: raw.marketState || "CLOSED",
    updatedAt: isoDate(raw.regularMarketTime),
    href: yahooQuoteHref(symbol),
    logoUrl: instrumentLogoUrl(symbol),
  };
}

export function normalizeChart(raw = {}) {
  const quotes = Array.isArray(raw.quotes) ? raw.quotes : [];

  return quotes.flatMap((quote) => {
    const value = finiteNumber(quote?.close);
    const timestamp = isoDate(quote?.date);
    return value === null || !timestamp ? [] : [{ timestamp, value }];
  });
}

function parsePriceRange(value) {
  const values = String(value ?? "")
    .replaceAll(",", "")
    .match(/\d+(?:\.\d+)?/g)
    ?.map(Number)
    .filter(Number.isFinite);

  if (!values?.length) return { low: null, high: null };
  return {
    low: Math.min(...values),
    high: Math.max(...values),
  };
}

function parseIssueSize(value) {
  const match = String(value ?? "")
    .replaceAll(",", "")
    .match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function normalizeIpo(raw = {}) {
  const { low, high } = parsePriceRange(raw.priceRange);
  const gmp = finiteNumber(
    raw.gmp?.aggregations?.median ??
      raw.gmp?.aggregations?.mean ??
      raw.gmp?.aggregations?.mode,
  );
  const updatedAt = isoDate(raw.gmp?.lastUpdatedAt);
  const fallbackHref = raw.slug
    ? `https://ipoalerts.in/ipo/${encodeURIComponent(raw.slug)}`
    : "https://ipoalerts.in/";

  return {
    id: String(raw.id ?? raw.slug ?? raw.symbol ?? raw.name ?? "ipo"),
    company: raw.name || raw.companyName || raw.symbol || "IPO",
    symbol: raw.symbol || null,
    status: String(raw.status || "unknown").toLowerCase(),
    issueSize: parseIssueSize(raw.issueSize),
    issueLow: low,
    issueHigh: high,
    gmp,
    gmpPercent:
      gmp !== null && high ? Number(((gmp / high) * 100).toFixed(2)) : null,
    estimatedListingPrice:
      gmp !== null && high ? Number((high + gmp).toFixed(2)) : null,
    expectedListingGain:
      gmp !== null && high ? Number(((gmp / high) * 100).toFixed(2)) : null,
    startDate: isoDate(raw.startDate || raw.openDate),
    endDate: isoDate(raw.endDate || raw.closeDate),
    listingDate: isoDate(raw.listingDate),
    updatedAt,
    sourceMode: gmp === null ? "partial" : "live",
    href: raw.infoUrl || raw.nseInfoUrl || raw.bseInfoUrl || fallbackHref,
  };
}

export function normalizeSearchResult(raw = {}) {
  const symbol = String(raw.symbol ?? "").toUpperCase();
  if (!SYMBOL_PATTERN.test(symbol)) return null;
  if (raw.isYahooFinance === false) return null;

  return {
    symbol,
    name: raw.longname || raw.shortname || symbol,
    exchange: raw.exchDisp || raw.exchange || "Yahoo Finance",
    type: raw.quoteType || raw.typeDisp || "SECURITY",
    href: yahooQuoteHref(symbol),
    logoUrl: instrumentLogoUrl(symbol),
  };
}

export function isSafeSearchQuery(value) {
  return /^[\p{L}\p{N} .&^=_-]{1,48}$/u.test(String(value ?? "").trim());
}
