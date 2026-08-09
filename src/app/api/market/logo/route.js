import { getInstrumentLogoSource } from "../../../lib/instrument-logos.js";

export const runtime = "nodejs";

export async function GET(request) {
  const symbol = new URL(request.url).searchParams.get("symbol") || "";
  const source = getInstrumentLogoSource(symbol);

  if (!source) {
    return Response.json(
      { error: "No verified logo is available for this instrument." },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const upstream = await fetch(source, {
      cache: "force-cache",
      headers: { "User-Agent": "ShareMarketAlerts/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    const contentType = upstream.headers.get("content-type") || "";

    if (!upstream.ok || !contentType.startsWith("image/")) {
      throw new Error("Logo provider returned an invalid response.");
    }

    return new Response(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json(
      { error: "Instrument logo is temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

