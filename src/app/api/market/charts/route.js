import { getMarketChart } from "../../../../lib/market-data/home.js";
import { MARKET_RANGES } from "../../../../lib/market-data/ranges.js";

export const runtime = "nodejs";

const RANGES = new Set(MARKET_RANGES);
const SAFE_MARKET_SYMBOL = /^(?:\^[A-Z0-9]+|[A-Z0-9][A-Z0-9._&=-]{0,30})$/;
const MAX_SYMBOLS = 32;
const CONCURRENCY = 6;

async function loadSeries(symbols, range) {
  const series = {};
  const unavailable = [];
  let cursor = 0;

  async function worker() {
    while (cursor < symbols.length) {
      const symbol = symbols[cursor];
      cursor += 1;
      try {
        const points = await getMarketChart(symbol, range);
        if (points.length > 1) series[symbol] = points;
        else unavailable.push(symbol);
      } catch {
        unavailable.push(symbol);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, symbols.length) }, () => worker()),
  );
  return { series, unavailable };
}

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const range = params.get("range") || "1D";
  const symbols = [...new Set(params.getAll("symbol").map((symbol) => symbol.trim()).filter(Boolean))];

  if (
    !RANGES.has(range) ||
    !symbols.length ||
    symbols.length > MAX_SYMBOLS ||
    symbols.some((symbol) => !SAFE_MARKET_SYMBOL.test(symbol))
  ) {
    return Response.json(
      { error: "Unsupported chart symbols or range." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { series, unavailable } = await loadSeries(symbols, range);
  return Response.json(
    { range, series, unavailable, source: "Yahoo Finance" },
    {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=180",
      },
    },
  );
}
