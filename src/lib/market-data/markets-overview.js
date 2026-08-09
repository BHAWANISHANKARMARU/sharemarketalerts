import { instrumentLogoUrl } from "../../app/lib/instrument-logos.js";

const INDEX_ORDER = ["^NSEI", "^BSESN", "^NSEBANK", "^INDIAVIX"];

const INDEX_LABELS = new Map([
  ["^NSEI", "NIFTY 50"],
  ["^BSESN", "SENSEX"],
  ["^NSEBANK", "BANK NIFTY"],
  ["^INDIAVIX", "INDIA VIX"],
]);

function unavailableQuote(symbol) {
  const label = INDEX_LABELS.get(symbol) || symbol;
  return {
    symbol,
    label,
    displaySymbol: label,
    name: label,
    formattedValue: "—",
    formattedChange: "—",
    changePercent: null,
    direction: "flat",
    href: `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}/`,
    logoUrl: instrumentLogoUrl(symbol),
  };
}

function finiteChange(quote) {
  const value = Number(quote?.changePercent);
  return Number.isFinite(value) ? value : Number.parseFloat(quote?.formattedChange) || 0;
}

function createSparkline(chart, chartSeries, quote) {
  const providerSeries = Array.isArray(chartSeries?.[quote.symbol])
    ? chartSeries[quote.symbol].filter((point) => Number.isFinite(Number(point?.value)))
    : [];
  const rawSource = providerSeries.length > 3
    ? providerSeries.slice(-96)
    : quote.symbol === "^NSEI" && chart.length > 3
      ? chart.slice(-56)
      : [];
  if (!rawSource.length) return [];
  const stride = Math.max(1, Math.floor(rawSource.length / 14));
  const source = rawSource.filter((_, pointIndex) => pointIndex % stride === 0).slice(-14);
  return source.map((point, pointIndex) => ({ index: pointIndex, value: Number(point.value) }));
}

function countDirectionalRows(rows, predicate) {
  return Array.isArray(rows) ? rows.filter((row) => predicate(finiteChange(row))).length : 0;
}

export function readChartTooltipPoint(payload) {
  const point = payload?.[0]?.payload;
  const value = Number(point?.value);
  if (!Number.isFinite(value)) return null;

  return {
    value,
    timestamp: point?.timestamp || null,
  };
}

export function buildMarketsOverview(market = {}, updatedAt = null) {
  const quoteMap = new Map(
    (Array.isArray(market.indices) ? market.indices : []).map((quote) => [quote.symbol, quote]),
  );
  const chart = Array.isArray(market.chart) && market.chart.length
    ? market.chart.filter((point) => Number.isFinite(Number(point?.value)))
    : [];
  const chartSeries = market.chartSeries && typeof market.chartSeries === "object"
    ? market.chartSeries
    : {};

  const indices = INDEX_ORDER.map((symbol) => {
    const live = quoteMap.get(symbol);
    const quote = live
      ? { ...live, label: INDEX_LABELS.get(symbol) || live.label }
      : unavailableQuote(symbol);
    return { ...quote, sparkline: createSparkline(chart, chartSeries, quote) };
  });

  const universe = Array.isArray(market.equities) && market.equities.length
    ? market.equities
    : [...(market.gainers || []), ...(market.losers || [])];
  const advances = countDirectionalRows(universe, (change) => change > 0);
  const declines = countDirectionalRows(universe, (change) => change < 0);
  const breadth = declines > 0 ? advances / declines : null;
  const breadthLabel = breadth === null ? "Unavailable" : breadth > 1.05 ? "Advancing" : breadth < 0.95 ? "Declining" : "Balanced";
  const finiteChanges = universe.map(finiteChange).filter(Number.isFinite);
  const averageMove = finiteChanges.length
    ? finiteChanges.reduce((total, value) => total + value, 0) / finiteChanges.length
    : null;
  const totalVolume = universe.reduce((total, quote) => total + (Number(quote.volume) || 0), 0);
  const nearHigh = universe.filter((quote) => Number(quote.value) >= Number(quote.fiftyTwoWeekHigh) * 0.98).length;
  const nearLow = universe.filter((quote) => Number(quote.value) <= Number(quote.fiftyTwoWeekLow) * 1.02).length;

  return {
    lead: indices[0],
    indices,
    chart,
    updatedAt,
    status: market.status === "open" ? "open" : "closed",
    statusLabel: market.statusLabel || "Markets Closed",
    metrics: [
      {
        key: "advance-decline",
        label: "Advance / Decline",
        primary: universe.length ? `${advances} / ${declines}` : "— / —",
        detail: "",
        tone: "split",
      },
      {
        key: "market-breadth",
        label: "Market Breadth",
        primary: breadth === null ? "—" : breadth.toFixed(2),
        detail: breadthLabel,
        tone: breadthLabel === "Declining" ? "red" : breadthLabel === "Advancing" ? "green" : "purple",
      },
      {
        key: "fii-flow",
        label: "Tracked Volume",
        primary: totalVolume ? new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(totalVolume) : "—",
        detail: `${universe.length || 0} equities`,
        tone: "purple",
      },
      {
        key: "put-call",
        label: "Average Move",
        primary: averageMove === null ? "—" : `${averageMove >= 0 ? "+" : ""}${averageMove.toFixed(2)}%`,
        detail: "Tracked equities",
        tone: averageMove !== null && averageMove < 0 ? "red" : "green",
      },
      {
        key: "year-high",
        label: "Near 52W High",
        primary: universe.length ? String(nearHigh) : "—",
        detail: "Within 2%",
        tone: "green",
      },
      {
        key: "year-low",
        label: "Near 52W Low",
        primary: universe.length ? String(nearLow) : "—",
        detail: "Within 2%",
        tone: "red",
      },
    ],
  };
}
