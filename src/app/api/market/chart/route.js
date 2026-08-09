import { getMarketChart } from "../../../../lib/market-data/home.js";
import { MARKET_RANGES } from "../../../../lib/market-data/ranges.js";

export const runtime = "nodejs";

const RANGES = new Set(MARKET_RANGES);
const SAFE_MARKET_SYMBOL = /^(?:\^[A-Z0-9]+|[A-Z0-9][A-Z0-9._&=-]{0,30})$/;

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const symbol = params.get("symbol") || "^NSEI";
  const range = params.get("range") || "1D";

  if (!SAFE_MARKET_SYMBOL.test(symbol) || !RANGES.has(range)) {
    return Response.json(
      { error: "Unsupported chart symbol or range." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const points = await getMarketChart(symbol, range);
    return Response.json(
      { symbol, range, points, source: "Yahoo Finance" },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=180",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "Chart data is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
