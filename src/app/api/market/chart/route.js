import { getMarketChart } from "../../../../lib/market-data/home.js";

export const runtime = "nodejs";

const SYMBOLS = new Set(["^NSEI", "^BSESN", "^NSEBANK", "^INDIAVIX"]);
const RANGES = new Set(["1D", "5D", "1M", "3M", "1Y"]);

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const symbol = params.get("symbol") || "^NSEI";
  const range = params.get("range") || "1D";

  if (!SYMBOLS.has(symbol) || !RANGES.has(range)) {
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
