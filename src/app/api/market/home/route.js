import { getHomeMarketData } from "../../../../lib/market-data/home.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getHomeMarketData();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=180",
      },
    });
  } catch {
    return Response.json(
      { error: "Market data is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
