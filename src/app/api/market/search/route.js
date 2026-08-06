import { isSafeSearchQuery } from "../../../../lib/market-data/normalize.js";
import { searchMarketSymbols } from "../../../../lib/market-data/home.js";

export const runtime = "nodejs";

export async function GET(request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (!isSafeSearchQuery(query)) {
    return Response.json(
      { error: "Enter between 1 and 48 letters, numbers, spaces, or ticker characters." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const results = await searchMarketSymbols(query);
    return Response.json(
      { query, results },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "Symbol search is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
