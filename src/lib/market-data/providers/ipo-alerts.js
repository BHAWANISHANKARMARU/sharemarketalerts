import "server-only";
import { normalizeIpo } from "../normalize.js";

const BASE_URL = "https://api.ipoalerts.in/ipos";

async function requestIpos({ includeGmp }) {
  const apiKey = process.env.IPO_ALERTS_API_KEY;
  const limit = apiKey ? 10 : 1;
  const url = new URL(BASE_URL);
  url.searchParams.set("status", "open");
  url.searchParams.set("limit", String(limit));
  if (includeGmp) url.searchParams.set("includeGmp", "true");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`IPO Alerts returned ${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function getIpoAlertsData() {
  let payload;
  let gmpEnabled = Boolean(process.env.IPO_ALERTS_API_KEY);
  try {
    payload = await requestIpos({ includeGmp: gmpEnabled });
  } catch (error) {
    if (!gmpEnabled) throw error;
    gmpEnabled = false;
    payload = await requestIpos({ includeGmp: false });
  }

  const rawIpos = payload.ipos || payload.data || [];
  return {
    ipos: rawIpos.map(normalizeIpo).filter(Boolean),
    partial: Boolean(payload.meta?.info) || !gmpEnabled,
    providerMessage: payload.meta?.info || null,
  };
}
