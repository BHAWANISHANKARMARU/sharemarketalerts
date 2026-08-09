"use client";

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../SiteHeader";
import { useMarketData } from "../MarketDataProvider";
import PremiumTrendChart from "./PremiumTrendChart";
import {
  ChangeValue,
  FilterChip,
  FilterRail,
  InstrumentMark,
  PanelHeading,
  WorkspaceBreadcrumbs,
  WorkspaceTabs,
  formatIstTime,
} from "./WorkspacePrimitives";
import s from "./TradingWorkspace.module.css";

const CONDITIONS = ["moves above", "moves below", "changes by", "volume exceeds"];
const CHANNELS = ["Web", "Email", "Messaging"];
const FREQUENCIES = ["Once per event", "Once per bar", "Every time"];
const ALERT_LIBRARY = [
  ["Price alerts", "Exact levels and price movement", [["Crosses a level", "Price", "Live"], ["Moves by percentage", "Change", "Live"], ["Enters a range", "Price", "Live"]], "PR"],
  ["Technical alerts", "Indicator and structure changes", [["Breakout confirmed", "Structure", "Close"], ["Momentum shift", "Trend", "Close"], ["Support lost", "Risk", "Close"]], "TE"],
  ["Volume alerts", "Unusual market participation", [["Relative volume", "Volume", "Live"], ["Volume expansion", "Volume", "Close"], ["Liquidity change", "Quality", "Live"]], "VO"],
  ["Watchlist alerts", "Monitor groups of instruments", [["Any symbol triggers", "List", "Live"], ["Sector strength", "Breadth", "Close"], ["Risk concentration", "Risk", "Live"]], "WA"],
  ["Delivery channels", "Route urgency and context", [["Web workspace", "Context", "Instant"], ["Email digest", "Review", "Scheduled"], ["Messaging", "Urgent", "Instant"]], "DE"],
  ["Noise controls", "Keep notifications actionable", [["Close confirmation", "Confirm", "On"], ["Duplicate blocking", "Deduplicate", "On"], ["Cooldown window", "Suppress", "30m"]], "NO"],
];

export default function StockAlertsExperience() {
  const { market, updatedAt, sources } = useMarketData();
  const symbols = useMemo(() => [...market.gainers, ...market.losers], [market.gainers, market.losers]);
  const [tab, setTab] = useState("Create alert");
  const [symbol, setSymbol] = useState(symbols[0]?.displaySymbol || "");
  const selected = symbols.find((item) => item.displaySymbol === symbol) || symbols[0];
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [threshold, setThreshold] = useState(symbols[0]?.value ? String(Math.round(symbols[0].value * 1.01)) : "");
  const [channel, setChannel] = useState(CHANNELS[2]);
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);
  const [confirmed, setConfirmed] = useState(true);
  const [paused, setPaused] = useState([]);
  const [symbolChart, setSymbolChart] = useState([]);

  useEffect(() => {
    if (!selected?.symbol) return undefined;
    const controller = new AbortController();
    fetch(`/api/market/chart?symbol=${encodeURIComponent(selected.symbol)}&range=1D`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    }).then((response) => response.ok ? response.json() : Promise.reject(new Error("Chart unavailable")))
      .then((payload) => setSymbolChart(Array.isArray(payload.points) ? payload.points : []))
      .catch((error) => {
        if (error.name !== "AbortError") setSymbolChart([]);
      });
    return () => controller.abort();
  }, [selected?.symbol]);

  const toggleAlert = (index) => {
    setPaused((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index]);
  };

  return (
    <main className={[s.workspacePage, s.alertsWorkspace].join(" ")} data-alert-builder>
      <SiteHeader />
      <div className={s.canvas}>
        <WorkspaceBreadcrumbs items={[{ label: "Stock alerts", href: "/stock-alerts" }, { label: "Workspace" }]} />
        <section className={s.compactIntro}>
          <div><span>AUTOMATED MARKET MONITORING</span><h1>Alert workspace</h1><p>Create a precise market rule, preserve its context and control exactly when it reaches you.</p></div>
          <div className={s.marketState}><i className={market.status === "open" ? s.statusOpen : s.statusClosed} /><span>{market.statusLabel}</span><small>{formatIstTime(updatedAt)} IST</small></div>
        </section>
        <WorkspaceTabs items={["Create alert", "Active alerts", "Triggered", "Settings"]} active={tab} onChange={setTab} label="Alert workspace views" />

        <section className={s.alertToolbar}>
          <div><InstrumentMark symbol={selected?.symbol || `${symbol}.NS`} logoUrl={selected?.logoUrl} /><label><span>SYMBOL</span><select value={symbol} onChange={(event) => setSymbol(event.target.value)}>{symbols.map((item) => <option value={item.displaySymbol} key={item.symbol}>{item.displaySymbol} · NSE</option>)}</select></label></div>
          <FilterRail label="Chart timeframe">{["1m", "5m", "15m", "1h", "1D"].map((item) => <FilterChip active={item === "15m"} key={item}>{item}</FilterChip>)}</FilterRail>
          <span>Price alerts · {market.statusLabel}</span>
        </section>

        <section className={s.alertWorkbench}>
          <article className={s.alertChartPanel}>
            <PanelHeading title={`${symbol || "Symbol"} · live session`} subtitle="NSE · Yahoo Finance chart" action={<ChangeValue value={selected?.formattedChange || "—"} direction={selected?.direction} />} />
            <div className={s.alertQuote}><span>LAST PRICE</span><strong>₹{selected?.formattedValue || "—"}</strong><small>Rule level ₹{threshold || "—"}</small></div>
            <PremiumTrendChart data={symbolChart} label={`${symbol || "Selected symbol"} price chart`} tone={selected?.direction === "down" ? "red" : "purple"} prefix="₹" />
            <div className={s.alertChartAxis}><span>09:15</span><span>11:00</span><span>13:00</span><span>15:30</span></div>
          </article>

          <aside className={s.ruleComposer}>
            <PanelHeading title="Rule preview" subtitle="Create price alert" action={<span className={s.draftBadge}>DRAFT</span>} />
            <div className={s.ruleFields}>
              <label><span>CONDITION</span><select value={condition} onChange={(event) => setCondition(event.target.value)}>{CONDITIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>VALUE</span><div><b>{condition === "changes by" ? "%" : "₹"}</b><input inputMode="decimal" value={threshold} onChange={(event) => setThreshold(event.target.value)} /></div></label>
              <label><span>FREQUENCY</span><select value={frequency} onChange={(event) => setFrequency(event.target.value)}>{FREQUENCIES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>EXPIRATION</span><select defaultValue="Open-ended"><option>Open-ended</option><option>End of session</option><option>30 days</option></select></label>
            </div>
            <label className={s.confirmRule}><button type="button" role="switch" aria-checked={confirmed} onClick={() => setConfirmed((value) => !value)}><i /></button><span><strong>Confirm on candle close</strong><small>Ignore temporary intrabar crosses</small></span></label>
            <div className={s.deliveryPicker}><span>DELIVER TO</span><div>{CHANNELS.map((item) => <button type="button" aria-pressed={channel === item} onClick={() => setChannel(item)} key={item}>{item}</button>)}</div></div>
            <div className={s.ruleSentence}><i className={s.statusOpen} /><p><strong>{symbol}</strong> {condition} <b>{condition === "changes by" ? `${threshold}%` : `₹${threshold}`}</b>{confirmed ? " on candle close" : " intraday"}.</p><small>{frequency} · {channel} · 30 min cooldown</small></div>
            <a className={s.createAlertButton} href={`mailto:alerts@sharemarketalerts.com?subject=${encodeURIComponent(`Create ${symbol} alert`)}`}>Create alert <span>↗</span></a>
          </aside>
        </section>

        <section className={s.activeAlerts}>
          <div className={s.sectionTitleRow}><div><h2>Live rule previews</h2><span>{symbols.slice(0, 4).length} templates populated with current quote values</span></div><FilterRail label="Alert status"><FilterChip active>All alerts</FilterChip><FilterChip>Price</FilterChip><FilterChip>Volume</FilterChip></FilterRail></div>
          <div className={s.tableScroller}>
            <table className={s.workspaceTable}>
              <thead><tr><th>Symbol</th><th>Condition</th><th>Last price</th><th>Distance</th><th>Delivery</th><th>Status</th></tr></thead>
              <tbody>{symbols.slice(0, 4).map((quote, index) => <tr key={quote.symbol}><td><a href={quote.href} target="_blank" rel="noreferrer"><InstrumentMark symbol={quote.symbol} logoUrl={quote.logoUrl} tone={index} /><span><strong>{quote.displaySymbol}</strong><small>NSE · Equity</small></span></a></td><td>{index % 2 ? "Moves below support" : "Breakout above range"}</td><td>₹{quote.formattedValue}</td><td><ChangeValue value={quote.formattedChange} direction={quote.direction} /></td><td>{index % 3 === 0 ? "Messaging" : "Web + Email"}</td><td><button className={s.statusToggle} type="button" aria-pressed={!paused.includes(index)} onClick={() => toggleAlert(index)}><i />{paused.includes(index) ? "Paused" : "Active"}</button></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className={s.marketDirectory}>
          <div className={s.sectionTitleRow}><div><h2>Alert types and templates</h2><span>Complete monitoring coverage from a single price level to a full watchlist</span></div><button type="button" className={s.outlineButton} onClick={() => setTab("Create alert")}>Create custom alert</button></div>
          <div className={s.marketDirectoryGrid}>{ALERT_LIBRARY.map(([title, copy, items, mark], index) => <article key={title}><header><div><InstrumentMark symbol={mark} tone={index} /><span><h3>{title}</h3><p>{copy}</p></span></div><button type="button" aria-label={`Use ${title}`}>↗</button></header><ol>{items.map(([name, type, state]) => <li key={`${title}-${name}`}><span>{name}</span><strong>{type}</strong><em>{state}</em></li>)}</ol></article>)}</div>
        </section>

        <section className={s.alertLowerGrid}>
          <article className={s.recentTriggers}><PanelHeading title="Live signal queue" subtitle="Derived from the current tracked movers" /><ol>{market.opportunities.map((item, index) => <li key={item.symbol}><time>{item.time}</time><span className={item.side === "BUY" ? s.signalBuy : s.signalSell}>{item.side}</span><div><strong>{item.name}</strong><small>{item.side === "BUY" ? "Positive price momentum" : "Negative price momentum"}</small></div><b>{item.entry}</b><em>{item.confidence}</em></li>)}</ol></article>
          <article className={s.alertHealth}><PanelHeading title="Market feed health" subtitle="Current provider snapshot" /><div><strong>{sources.yahoo.mode === "live" ? "LIVE" : "—"}</strong><span>{sources.yahoo.name}</span></div><ul><li><span>Quotes loaded</span><strong>{market.equities?.length || 0}</strong></li><li><span>Sector feeds</span><strong>{market.sectors?.length || 0}</strong></li><li><span>Last update</span><strong>{formatIstTime(updatedAt)} IST</strong></li></ul><p>No synthetic delivery statistics are displayed.</p></article>
        </section>
      </div>
    </main>
  );
}
