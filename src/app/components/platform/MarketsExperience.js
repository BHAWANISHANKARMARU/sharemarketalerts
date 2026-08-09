"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import worldMapImage from "../../../../ChatGPT Image Aug 9, 2026, 02_29_35 PM.png";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SiteHeader from "../SiteHeader";
import { useMarketData } from "../MarketDataProvider";
import MarketNewsResearch from "./MarketNewsResearch";
import MarketsOverviewHero from "./MarketsOverviewHero";
import MarketCalendarDashboard from "./MarketCalendarDashboard";
import { readChartTooltipPoint } from "../../../lib/market-data/markets-overview";
import {
  ChangeValue,
  FilterChip,
  FilterRail,
  InstrumentMark,
  PanelHeading,
} from "./WorkspacePrimitives";
import s from "./TradingWorkspace.module.css";

const SECTOR_ICON_PATHS = [
  "M4 5h16v12H4zM8 21h8m-4-4v4M9 9l-2 2 2 2m6-4 2 2-2 2",
  "M5 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3m-15 0h16v6H4zm2 6v2m12-2v2",
  "M4 20V10l5 3V9l5 3V5l3 2v13zm4-3h2m3 0h2",
  "M12 3 21 8l-9 13L3 8zm0 0-3 5 3 13 3-13zM3 8h18",
  "M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20Zm0-10v6m-3-3h6",
  "M12 3S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12-7-12Zm-3 12c.5 2 1.7 3 3.7 3",
  "M3 9h18M5 9l7-5 7 5M5 19h14M7 10v7m5-7v7m5-7v7",
  "m13 2-7 11h6l-1 9 7-12h-6z",
  "M5 7h10l4 4-8 8H5zm3 3h.01",
  "M5 20V6h14v14M8 9h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2",
  "M3 7h11v9H3zm11 3h3l3 3v3h-6M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  "M4 6h2l2 10h9l3-7H7m2 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  "M6 8h12l-1 12H7zm3 0a3 3 0 0 1 6 0",
];

const GLOBAL_INDEXES = [
  ["S&P 500", "^GSPC", "US", "🇺🇸"],
  ["NASDAQ 100", "^NDX", "US", "🇺🇸"],
  ["FTSE 100", "^FTSE", "UK", "🇬🇧"],
  ["DAX", "^GDAXI", "Germany", "🇩🇪"],
  ["Nikkei 225", "^N225", "Japan", "🇯🇵"],
  ["NIFTY 50", "^NSEI", "India", "🇮🇳"],
];

const ASIA_MARKETS = [
  ["Hang Seng", "^HSI"],
  ["Shanghai Comp", "000001.SS"],
  ["KOSPI", "^KS11"],
  ["ASX 200", "^AXJO"],
  ["Singapore STI", "^STI"],
];

const EUROPE_MARKETS = [
  ["CAC 40", "^FCHI"],
  ["Euro Stoxx 50", "^STOXX50E"],
  ["IBEX 35", "^IBEX"],
  ["FTSE MIB", "FTSEMIB.MI"],
  ["Swiss Market", "^SSMI"],
];

const GLOBAL_LOCATIONS = [
  ["newYork", "🇺🇸", "New York", "America/New_York"],
  ["frankfurt", "🇩🇪", "Frankfurt", "Europe/Berlin"],
  ["tokyo", "🇯🇵", "Tokyo", "Asia/Tokyo"],
  ["london", "🇬🇧", "London", "Europe/London"],
  ["mumbai", "🇮🇳", "Mumbai", "Asia/Kolkata"],
  ["sydney", "🇦🇺", "Sydney", "Australia/Sydney"],
];

function unavailableMarketQuote(label, symbol) {
  return {
    label,
    displaySymbol: label,
    symbol,
    formattedValue: "—",
    formattedChange: "—",
    changePercent: null,
    direction: "flat",
    marketState: "UNAVAILABLE",
  };
}

function resolveMarketQuote(market, definition) {
  const [label, symbol, region, flag] = definition;
  const quote = [...market.indices, ...market.coverage].find((item) => item.symbol === symbol);
  return { ...(quote || unavailableMarketQuote(label, symbol)), label, region, flag };
}

function liveSeries(points) {
  if (!Array.isArray(points)) return [];
  return points
    .filter((point) => Number.isFinite(Number(point?.value)))
    .map((point, index) => ({ ...point, index, value: Number(point.value) }));
}

function formatLocalDateTime(value, timeZone) {
  if (!value || !timeZone) return { time: "—", zone: "" };
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return { time: "—", zone: "" };
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(date);
  return {
    time: `${parts.find((part) => part.type === "hour")?.value || ""}:${parts.find((part) => part.type === "minute")?.value || ""} ${parts.find((part) => part.type === "dayPeriod")?.value || ""}`.trim(),
    zone: parts.find((part) => part.type === "timeZoneName")?.value || "",
  };
}

function GlobalMiniChart({ quote, series }) {
  const gradientId = `global-index-fill-${useId().replaceAll(":", "")}`;
  const positive = quote.direction !== "down";
  const color = positive ? "#00b775" : "#ff3158";
  const data = liveSeries(series);

  return (
    <div className={s.globalMiniChart} role="img" aria-label={`${quote.label} live price chart`} data-series-points={data.length}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 3, right: 1, bottom: 1, left: 1 }} baseValue="dataMin">
          <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.16} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="index" hide />
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Tooltip content={<SectorChartTooltip name={quote.label} range="Live" />} cursor={false} isAnimationActive animationDuration={180} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 3, fill: color, stroke: "#fff", strokeWidth: 1.5 }} isAnimationActive animationDuration={700} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RegionalMarkets({ title, definitions, quoteMap }) {
  const rows = definitions.map(([name, symbol]) => {
    const quote = quoteMap.get(symbol) || unavailableMarketQuote(name, symbol);
    const local = formatLocalDateTime(quote.updatedAt, quote.timeZone);
    return { name, quote, local };
  });
  return (
    <article className={s.globalMarketPanel}>
      <header><h3>{title}</h3><Link href="/live-markets">View all</Link></header>
      <div className={s.globalTableHeader}><span>Market</span><span>Value</span><span>Change</span><span>Time</span></div>
      <ol>{rows.map(({ name, quote, local }, index) => <li key={name} data-live={quote.marketState !== "UNAVAILABLE"}><span><InstrumentMark symbol={quote.symbol} logoUrl={quote.logoUrl} tone={index} />{name}</span><strong>{quote.formattedValue}</strong><ChangeValue value={quote.formattedChange} direction={quote.direction} /><time>{local.time}</time></li>)}</ol>
    </article>
  );
}

function SectorIcon({ index }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={SECTOR_ICON_PATHS[index]} /></svg>;
}

function SectorChartTooltip({ active, payload, name, range }) {
  if (!active) return null;
  const point = readChartTooltipPoint(payload);
  if (!point) return null;

  const date = point.timestamp ? new Date(point.timestamp) : null;
  const pointTime = date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date)
    : range;

  return <div className={s.sectorChartTooltip}><strong>{point.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><span>{name} · {pointTime}</span></div>;
}

function SectorSparkline({ series, positive, name, range }) {
  const gradientId = `sector-fill-${useId().replaceAll(":", "")}`;
  const color = positive ? "#00a868" : "#ff2447";
  return (
    <div className={s.sectorSparkline} role="img" aria-label={`${name} ${range} trend`} data-chart-engine="recharts" data-series-points={liveSeries(series).length}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={liveSeries(series)} margin={{ top: 5, right: 2, bottom: 2, left: 2 }} accessibilityLayer>
          <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.18} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="index" hide />
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Tooltip content={<SectorChartTooltip name={name} range={range} />} cursor={false} isAnimationActive animationDuration={180} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 3, fill: color, stroke: "#fff", strokeWidth: 1.5 }} isAnimationActive animationDuration={700} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function sectorPerformanceLabel(value) {
  if (value > 10) return "High Performance";
  if (value > 6) return "Strong Performance";
  if (value > 2) return "Moderate Performance";
  if (value > .75) return "Slightly Positive";
  if (value >= 0) return "Nearly Flat";
  if (value > -1) return "Slightly Negative";
  if (value > -2) return "Negative";
  return "Weak Performance";
}

function QuoteRow({ quote, index }) {
  return (
    <li data-market-board-row="quote">
      <InstrumentMark symbol={quote.symbol} logoUrl={quote.logoUrl} tone={index} />
      <a href={quote.href} target="_blank" rel="noreferrer">
        <strong>{quote.displaySymbol}</strong><small>{quote.name}</small>
      </a>
      <b>₹{quote.formattedValue}</b>
      <ChangeValue value={quote.formattedChange} direction={quote.direction} />
    </li>
  );
}

function MarketBoardIcon({ kind }) {
  return (
    <span className={s.marketBoardIcon} data-market-board-icon={kind} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        {kind === "calendar" ? <>
          <rect x="4" y="5.5" width="16" height="14" rx="3" />
          <path d="M8 3.5v4M16 3.5v4M4 9.5h16M8 13h2M14 13h2M8 16.5h2M14 16.5h2" />
        </> : <>
          <path d="M4 17.5 8.2 13l3.2 2.6 5.1-7.1 3.5 2.6" />
          <path d="M4 20h16M6 8.5V5m6 5V4m6 1.5V3" />
        </>}
      </svg>
    </span>
  );
}

export default function MarketsExperience() {
  const { market, updatedAt, sources } = useMarketData();
  const [clock, setClock] = useState(null);
  const [view, setView] = useState("Overview");
  const [collection, setCollection] = useState("Most active");
  const heatRange = "1D";
  const [heatView, setHeatView] = useState("grid");
  const [worldView, setWorldView] = useState("Global Overview");
  const [moverView, setMoverView] = useState("Top Gainers");
  useEffect(() => {
    const updateClock = () => setClock(new Date());
    updateClock();
    const interval = window.setInterval(updateClock, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const mostActiveRows = [...(market.equities || [])]
    .sort((a, b) => (Number(b.volume) || 0) - (Number(a.volume) || 0));
  const collectionRows = collection === "Biggest losers"
    ? market.losers
    : collection === "Top gainers"
      ? market.gainers
      : mostActiveRows;
  const globalIndexRows = GLOBAL_INDEXES.map((definition) => resolveMarketQuote(market, definition));
  const globalMoverRows = moverView === "Top Losers"
    ? market.losers
    : moverView === "Most Active"
      ? mostActiveRows
      : market.gainers;
  const quoteMap = useMemo(() => new Map(
    [...(market.indices || []), ...(market.coverage || []), ...(market.equities || [])].map((quote) => [quote.symbol, quote]),
  ), [market.coverage, market.equities, market.indices]);
  const chartSymbols = useMemo(() => [...new Set([
    ...GLOBAL_INDEXES.map(([, symbol]) => symbol),
    ...(market.indices || []).map((quote) => quote.symbol),
    ...(market.sectors || []).map((quote) => quote.symbol),
    ...(market.gainers || []).map((quote) => quote.symbol),
    ...(market.losers || []).map((quote) => quote.symbol),
  ])], [market.gainers, market.indices, market.losers, market.sectors]);
  const [chartSeries, setChartSeries] = useState(() => (
    Array.isArray(market.chart) && market.chart.length > 1
      ? { "^NSEI": market.chart }
      : {}
  ));

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ range: "1D" });
    chartSymbols.forEach((symbol) => params.append("symbol", symbol));
    fetch(`/api/market/charts?${params}`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Chart series unavailable")))
      .then((payload) => {
        if (!payload?.series || controller.signal.aborted) return;
        setChartSeries((current) => ({ ...current, ...payload.series }));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [chartSymbols, updatedAt]);
  const snapshotQuotes = [
    ["VIX (Volatility Index)", quoteMap.get("^INDIAVIX")],
    ["Crude Oil (Brent)", quoteMap.get("BZ=F")],
    ["Gold (Spot)", quoteMap.get("GC=F")],
    ["USD / INR", quoteMap.get("INR=X")],
    ["Bitcoin (USD)", quoteMap.get("BTC-USD")],
  ];
  const sectorRows = (market.sectors || []).filter((quote) => Number.isFinite(Number(quote.changePercent)));
  const earnings = (market.earnings || []).slice(0, 4);
  const marketStates = globalIndexRows.reduce((counts, quote) => {
    const state = quote.marketState;
    if (state === "REGULAR") counts.open += 1;
    else if (state === "PRE") counts.pre += 1;
    else if (state === "POST" || state === "POSTPOST") counts.post += 1;
    else if (state === "CLOSED") counts.closed += 1;
    return counts;
  }, { open: 0, pre: 0, post: 0, closed: 0 });
  const latestGlobalUpdate = formatLocalDateTime(updatedAt, "Asia/Kolkata");

  return (
    <main className={`${s.workspacePage} ${s.marketsWorkspace}`} data-market-dashboard>
      <SiteHeader />
      <div className={s.canvas}>
        <MarketsOverviewHero
          market={market}
          chartSeries={chartSeries}
          updatedAt={updatedAt}
          sourceMode={sources.yahoo.mode}
          view={view}
          onViewChange={setView}
        />

        <section className={s.marketBoards} aria-label="Indian equity activity and earnings">
          <article className={s.dataListPanel} data-market-board="quotes">
            <header className={s.marketBoardHeader}>
              <div className={s.marketBoardTitle}><MarketBoardIcon kind="activity" /><div><h2>{collection}</h2><p>Indian equities</p></div></div>
              <div className={s.marketBoardFilters}><FilterRail label="Market collection">{["Most active", "Top gainers", "Biggest losers"].map((item) => <FilterChip key={item} active={collection === item} onClick={() => setCollection(item)}>{item}</FilterChip>)}</FilterRail></div>
            </header>
            <ol className={s.quoteList}>{collectionRows.slice(0, 5).map((quote, index) => <QuoteRow quote={quote} index={index} key={quote.symbol} />)}</ol>
            <Link className={`${s.panelLink} ${s.marketBoardFooter}`} href="/live-markets">Open Market screener <span>↗</span></Link>
          </article>
          <article className={s.earningsPanel} data-market-board="earnings">
            <header className={s.marketBoardHeader}>
              <div className={s.marketBoardTitle}><MarketBoardIcon kind="calendar" /><div><h2>Earnings watch</h2><p>The week ahead</p></div></div>
              <span className={s.earningsCount}><i />{earnings.length} events</span>
            </header>
            <ol className={s.earningsTimeline}>{earnings.map((event, index) => {
              const symbol = event.symbol.replace(/\.NS$/i, "");
              const date = new Date(event.date);
              return <li data-market-board-row="earnings" data-live="true" key={`${event.symbol}-${event.date}`}><time>{new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Kolkata" }).format(date).toUpperCase()}</time><InstrumentMark symbol={event.symbol} logoUrl={quoteMap.get(event.symbol)?.logoUrl} tone={index + 2} /><div><strong>{symbol}</strong><small>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(date)} · {event.estimated ? "Estimated" : "Confirmed"}</small></div><span>{event.earningsAverage === null ? "—" : `₹${event.earningsAverage.toFixed(2)} est.`}</span></li>;
            })}</ol>
            <p className={s.earningsNote}><span aria-hidden="true">i</span><span>{earnings.length ? "Dates and EPS estimates supplied by Yahoo Finance." : "Upcoming earnings data is currently unavailable."}</span></p>
          </article>
        </section>

        <section className={s.marketHeatSection} id="sector-heatmap">
          <div className={s.marketHeatShell}>
            <header className={s.marketHeatHeader}>
              <div className={s.marketHeatTitle}>
                <span className={s.marketHeatMark} aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg></span>
                <div><h2>Sector Heatmap</h2><span>Live performance of Indian market sectors</span></div>
              </div>
              <div className={s.marketHeatControls}>
                <div className={s.marketHeatRanges} role="group" aria-label="Sector heatmap range">{["1D", "1W", "1M", "3M", "1Y"].map((range) => <button type="button" aria-pressed={heatRange === range} disabled={range !== "1D"} title={range === "1D" ? "Live session" : "Historical sector series unavailable"} key={range}>{range}</button>)}</div>
                <button className={s.marketCapControl} type="button" aria-label="Sort sectors by market capitalization" aria-haspopup="listbox">Market Cap <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m6 8 4 4 4-4" /></svg></button>
                <div className={s.marketViewControls} role="group" aria-label="Heatmap view">
                  <button type="button" aria-label="Grid view" aria-pressed={heatView === "grid"} onClick={() => setHeatView("grid")}><svg aria-hidden="true" viewBox="0 0 20 20"><rect x="3" y="3" width="6" height="6" /><rect x="11" y="3" width="6" height="6" /><rect x="3" y="11" width="6" height="6" /><rect x="11" y="11" width="6" height="6" /></svg></button>
                  <button type="button" aria-label="List view" aria-pressed={heatView === "list"} onClick={() => setHeatView("list")}><svg aria-hidden="true" viewBox="0 0 20 20"><path d="M7 5h10M7 10h10M7 15h10" /><circle cx="3" cy="5" r=".8" /><circle cx="3" cy="10" r=".8" /><circle cx="3" cy="15" r=".8" /></svg></button>
                </div>
              </div>
            </header>
            <div className={`${s.marketHeatmap} ${heatView === "list" ? s.marketHeatmapList : ""}`}>{sectorRows.map((quote, index) => {
              const name = quote.label;
              const value = Number(quote.changePercent);
              const positive = value >= 0;
              const positionClass = index === 0 ? s.sectorHeatCardFeatured : index < 5 ? s.sectorHeatCardUpper : s.sectorHeatCardLower;
              return <article className={`${s.sectorHeatCard} ${positionClass} ${positive ? s.heatPositive : s.heatNegative}`} data-live="true" aria-label={`${name}, ${value > 0 ? "+" : ""}${value.toFixed(2)} percent, live`} key={quote.symbol}>
                <div className={s.sectorCardHeading}><span className={s.sectorIcon}><SectorIcon index={index} /></span><div><strong>{name}</strong><b>{value > 0 ? "+" : ""}{value.toFixed(2)}%</b></div></div>
                <p>{sectorPerformanceLabel(value)}</p>
                <SectorSparkline series={chartSeries[quote.symbol]} positive={positive} name={name} range={heatRange} />
              </article>;
            })}{!sectorRows.length ? <p className={s.dataSource}>Live sector values are temporarily unavailable.</p> : null}</div>
          </div>
          <p className={s.dataSource}>Data source: {sources.yahoo.name} · {sources.yahoo.mode}. Market values are informational, not investment advice.</p>
        </section>

        <section className={s.marketDirectory} id="global-markets">
          <div className={s.globalMarketDashboard}>
            <div className={s.globalMarketIntro}>
              <span className={s.globalMarketGlobe} aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.6 8.2 12S9.5 18.4 12 21" /></svg></span>
              <div><h2 aria-label="Market Everywhere">Market <span>Everywhere</span></h2><p>Global markets at a glance. Stay informed,<br />wherever you are.</p></div>
            </div>
            <span className={s.localTimeBadge}><svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6.5" /><path d="M10 6.5V10l2.5 1.5" /></svg>All times are local</span>

            <div className={s.globalMapStage} style={{ "--world-map-image": `url("${worldMapImage.src}")` }} aria-hidden="true">
              <svg className={s.globalRoutes} viewBox="0 0 700 280" preserveAspectRatio="none"><path d="M98 108C155 46 232 44 282 82" /><path d="M282 82C345 62 407 74 451 130" /><path d="M451 130C514 82 578 80 626 118" /><path d="M282 82C336 116 366 152 390 190" /><path d="M451 130C548 158 573 198 590 238" /></svg>
              {GLOBAL_LOCATIONS.map(([place, flag, city, timeZone]) => {
                const local = formatLocalDateTime(clock, timeZone);
                return <span className={s.globalLocation} data-place={place} key={place}><b>{flag} {city}</b><small>{local.time}<em>{local.zone}</em></small></span>;
              })}
            </div>

            <div className={s.globalMarketTabs} role="group" aria-label="Global market views">
              {["Global Overview", "Indices", "Futures", "Currencies", "Commodities"].map((tab, index) => <button type="button" aria-pressed={worldView === tab} onClick={() => setWorldView(tab)} key={tab}><span aria-hidden="true">{["◎", "▥", "◉", "◌", "⌘"][index]}</span>{tab}</button>)}
            </div>

            <article className={s.marketStatusCard}>
              <header><span aria-hidden="true">⌁</span><h3>Market Status</h3></header>
              <div className={s.marketStatusBody}>
                <div className={s.marketStatusDonut}><strong>{marketStates.open}</strong><span>Open<br />Markets</span></div>
                <ul><li><i data-status="open" />Open <b>{marketStates.open}</b></li><li><i data-status="soon" />Pre-market <b>{marketStates.pre}</b></li><li><i data-status="holiday" />Post-market <b>{marketStates.post}</b></li><li><i data-status="closed" />Closed <b>{marketStates.closed}</b></li></ul>
              </div>
              <footer><span>Latest Provider Update</span><div><strong>Yahoo Finance</strong><time>{latestGlobalUpdate.time} <em>{latestGlobalUpdate.zone}</em></time></div></footer>
            </article>

            <div className={s.globalIndexRail}>{globalIndexRows.map((quote) => {
              const local = formatLocalDateTime(quote.updatedAt, quote.timeZone);
              return <article className={s.globalIndexCard} data-live={quote.marketState !== "UNAVAILABLE"} key={quote.symbol}><header><InstrumentMark symbol={quote.symbol} logoUrl={quote.logoUrl} /><strong>{quote.label}</strong><small>{quote.region}</small></header><b>{quote.formattedValue}</b><ChangeValue value={quote.formattedChange} direction={quote.direction} /><GlobalMiniChart quote={quote} series={chartSeries[quote.symbol]} /><footer><span><i />{local.time}</span><em>{local.zone}</em></footer></article>;
            })}</div>

            <div className={s.globalMarketGrid}>
              <RegionalMarkets title="Asia Markets" definitions={ASIA_MARKETS} quoteMap={quoteMap} />
              <RegionalMarkets title="Europe Markets" definitions={EUROPE_MARKETS} quoteMap={quoteMap} />
              <article className={`${s.globalMarketPanel} ${s.globalMoversPanel}`}>
                <header><h3>Market Movers</h3><Link href="/live-markets">View all</Link></header>
                <div className={s.globalMoverTabs} role="group" aria-label="Global market movers">{["Top Gainers", "Top Losers", "Most Active"].map((tab) => <button type="button" aria-pressed={moverView === tab} onClick={() => setMoverView(tab)} key={tab}>{tab}</button>)}</div>
                <ol>{globalMoverRows.slice(0, 5).map((quote, index) => <li key={quote.symbol}><InstrumentMark symbol={quote.symbol} logoUrl={quote.logoUrl} tone={index} /><span><strong>{quote.displaySymbol}</strong><small>{quote.symbol.replace(".NS", "") === quote.displaySymbol ? "NSE" : quote.symbol.replace(".NS", "")}</small></span><ChangeValue value={quote.formattedChange} direction={quote.direction} /></li>)}</ol>
              </article>
              <article className={`${s.globalMarketPanel} ${s.globalSnapshotPanel}`}>
                <header><h3>Global Snapshot</h3></header>
                <ol>{snapshotQuotes.map(([label, quote]) => <li key={label} data-live={Boolean(quote)}><span>{label}</span><strong>{quote?.formattedValue || "—"}</strong><ChangeValue value={quote?.formattedChange || "—"} direction={quote?.direction || "flat"} /></li>)}</ol>
              </article>
            </div>

            <footer className={s.globalMarketFooter}><span><svg aria-hidden="true" viewBox="0 0 20 20"><path d="M6 14V9a4 4 0 0 1 8 0v5l2 2H4zM8 16a2 2 0 0 0 4 0" /></svg>Live Yahoo Finance snapshots. Exchange delays vary by instrument.</span><Link href="/live-markets">See full market coverage <span>→</span></Link></footer>
          </div>
        </section>

        <MarketCalendarDashboard ariaLabel="Market calendars" />
        <MarketNewsResearch market={market} ariaLabel="Market news and research" />
      </div>
    </main>
  );
}
