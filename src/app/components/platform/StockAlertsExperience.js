"use client";

import { useMemo, useState } from "react";
import SiteHeader from "../SiteHeader";
import { useMarketData } from "../MarketDataProvider";
import LiveRuleMonitoring from "./LiveRuleMonitoring";
import { InstrumentMark, PanelHeading, formatIstTime } from "./WorkspacePrimitives";
import s from "./TradingWorkspace.module.css";
import a from "./StockAlertsWorkspace.module.css";

const ALERT_LIBRARY = [
  ["Price alerts", "Exact levels and price movement", [["Crosses a level", "Price", "Live"], ["Moves by percentage", "Change", "Live"], ["Enters a range", "Price", "Live"]], "PR"],
  ["Technical alerts", "Indicator and structure changes", [["Breakout confirmed", "Structure", "Close"], ["Momentum shift", "Trend", "Close"], ["Support lost", "Risk", "Close"]], "TE"],
  ["Volume alerts", "Unusual market participation", [["Relative volume", "Volume", "Live"], ["Volume expansion", "Volume", "Close"], ["Liquidity change", "Quality", "Live"]], "VO"],
  ["Watchlist alerts", "Monitor groups of instruments", [["Any symbol triggers", "List", "Live"], ["Sector strength", "Breadth", "Close"], ["Risk concentration", "Risk", "Close"]], "WA"],
  ["Delivery channels", "Route urgency and context", [["Web workspace", "Context", "Instant"], ["Email digest", "Review", "Scheduled"], ["Messaging", "Urgent", "Instant"]], "DE"],
  ["Noise controls", "Keep notifications actionable", [["Close confirmation", "Confirm", "On"], ["Duplicate blocking", "Deduplicate", "On"], ["Cooldown window", "Suppress", "30m"]], "NO"],
];

export default function StockAlertsExperience() {
  const { market, sources, updatedAt } = useMarketData();
  const symbols = useMemo(() => [...market.gainers, ...market.losers], [market.gainers, market.losers]);
  const [paused, setPaused] = useState([]);
  const toggleAlert = (index) => setPaused((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index]);

  return (
    <main className={[s.workspacePage, s.alertsWorkspace, a.page].join(" ")} data-alert-builder>
      <SiteHeader />
      <div className={a.unifiedCanvas} id="live-rule-dashboard">
        <LiveRuleMonitoring
          quotes={symbols.slice(0, 4)}
          statusLabel={market.statusLabel}
          updatedAt={updatedAt}
          paused={paused}
          onToggle={toggleAlert}
        />
      </div>

      <div className={a.restoredContent}>
        <section className={a.alertDirectory}>
          <div className={s.sectionTitleRow}>
            <div>
              <h2>Alert types and templates</h2>
              <span>Complete monitoring coverage from a single price level to a full watchlist</span>
            </div>
            <a className={s.outlineButton} href="#live-rule-dashboard">Create custom alert</a>
          </div>

          <div className={a.alertDirectoryGrid}>
            {ALERT_LIBRARY.map(([title, copy, items, mark], index) => (
              <article key={title}>
                <header>
                  <div>
                    <InstrumentMark symbol={mark} tone={index} />
                    <span><h3>{title}</h3><p>{copy}</p></span>
                  </div>
                  <a href="#live-rule-dashboard" aria-label={`Use ${title}`}>↗</a>
                </header>
                <ol>
                  {items.map(([name, type, state]) => (
                    <li key={name}><span>{name}</span><strong>{type}</strong><em>{state}</em></li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <section className={s.alertLowerGrid}>
          <article className={s.recentTriggers}>
            <PanelHeading title="Live signal queue" subtitle="Derived from the current tracked movers" />
            <ol>
              {(market.opportunities || []).map((item) => (
                <li key={item.symbol}>
                  <time>{item.time}</time>
                  <span className={item.side === "BUY" ? s.signalBuy : s.signalSell}>{item.side}</span>
                  <div><strong>{item.name}</strong><small>{item.side === "BUY" ? "Positive price momentum" : "Negative price momentum"}</small></div>
                  <b>{item.entry}</b>
                  <em>{item.confidence}</em>
                </li>
              ))}
            </ol>
          </article>

          <article className={s.alertHealth}>
            <PanelHeading title="Market feed health" subtitle="Current provider snapshot" />
            <div><strong>{sources.yahoo.mode === "live" ? "LIVE" : "—"}</strong><span>{sources.yahoo.name}</span></div>
            <ul>
              <li><span>Quotes loaded</span><strong>{market.equities?.length || 0}</strong></li>
              <li><span>Sector feeds</span><strong>{market.sectors?.length || 0}</strong></li>
              <li><span>Last update</span><strong>{updatedAt ? formatIstTime(updatedAt) : "—"} IST</strong></li>
            </ul>
            <p>No synthetic delivery statistics are displayed.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
