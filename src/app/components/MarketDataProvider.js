"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MarketDataContext = createContext(null);

export default function MarketDataProvider({ initialData, children }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      if (document.visibilityState === "hidden") return;
      try {
        const response = await fetch("/api/market/home", {
          headers: { accept: "application/json" },
        });
        if (!response.ok) return;
        const nextData = await response.json();
        if (!cancelled && nextData?.market && nextData?.ipo) setData(nextData);
      } catch {
        // Keep the server-rendered last-known snapshot when the network is offline.
      }
    }

    const interval = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const value = useMemo(() => ({ data }), [data]);
  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (!context) throw new Error("useMarketData must be used inside MarketDataProvider");
  return context.data;
}
