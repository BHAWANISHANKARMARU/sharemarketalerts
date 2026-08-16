"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import marketHeroImage from "../../../../public/images/markets-indian-exchange-green.png";
import { buildMarketsOverview } from "../../../lib/market-data/markets-overview";
import { MARKET_RANGES } from "../../../lib/market-data/ranges";
import { formatIstTime, InstrumentMark } from "./WorkspacePrimitives";
import s from "./MarketsOverviewHero.module.css";

const VIEWS = ["Overview", "Performance", "Technicals"];

function ChevronDown() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4" /></svg>;
}

function FlagBadge() {
  return (
    <span className={s.flagBadge} aria-hidden="true">
      <i />
      <i><b /></i>
      <i />
    </span>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 16.5h11l-1.3-2.1V10a4.2 4.2 0 0 0-8.4 0v4.4z" />
      <path d="M10 18.3a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

function DashboardIcon({ name }) {
  const paths = {
    "advance-decline": <><circle cx="12" cy="12" r="8" /><path d="M7.7 14.8V11m4.3 3.8V7.5m4.3 7.3V9.4" /></>,
    "market-breadth": <><path d="M4 13h3l2-5 3.2 9 2.2-6H20" /></>,
    "fii-flow": <><path d="M4 16V8l4 2.4L12 6l4 4.4L20 8v8" /><path d="M7 19h10" /></>,
    "put-call": <><path d="M5 8.5a7.5 7.5 0 0 1 12.8-2.2L20 8.5m-1-4v4h-4" /><path d="M19 15.5a7.5 7.5 0 0 1-12.8 2.2L4 15.5m1 4v-4h4" /></>,
    "year-high": <><path d="m4 16 5-5 3 3 7-8" /><path d="M14 6h5v5" /></>,
    "year-low": <><path d="m4 8 5 5 3-3 7 8" /><path d="M14 18h5v-5" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function SectorIcon({ index }) {
  const paths = [
    "M5 5h14v11H5zm4 14h6m-3-3v3M9 9l-2 2 2 2m6-4 2 2-2 2",
    "M6 8h12l-1 11H7zm3 0a3 3 0 0 1 6 0",
    "M4 20V10l5 3V9l5 3V5l4 2v13zm4-3h2m3 0h2",
    "M12 3 20 8l-8 13L4 8zm0 0-3 5 3 13 3-13M4 8h16",
    "M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20Zm0-10v6m-3-3h6",
    "M12 3S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12-7-12Zm-3 12c.5 2 1.7 3 3.7 3",
    "M3 9h18M5 9l7-5 7 5M5 19h14M7 10v7m5-7v7m5-7v7",
  ];
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[index % paths.length]} /></svg>;
}

function IndexMark({ index, symbol, logoUrl }) {
  return <InstrumentMark className={s.indexMark} symbol={symbol} logoUrl={logoUrl} tone={index} />;
}

function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";
}

function Change({ quote, showAbsolute = false }) {
  const direction = quote?.direction === "down" ? "down" : quote?.direction === "flat" ? "flat" : "up";
  const absolute = Number.isFinite(Number(quote?.value)) && Number.isFinite(Number(quote?.previousClose))
    ? Number(quote.value) - Number(quote.previousClose)
    : null;
  return (
    <span className={s.change} data-direction={direction}>
      <i aria-hidden="true" />
      <span>{quote?.formattedChange || "—"}{showAbsolute && absolute !== null ? ` (${absolute >= 0 ? "+" : ""}${absolute.toFixed(2)})` : ""}</span>
    </span>
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  return (
    <div className={s.chartTooltip}>
      <strong>{formatNumber(point?.value)}</strong>
      <span>{point?.time || "NIFTY 50"}</span>
    </div>
  );
}

function MarketChart({ data }) {
  const gradientId = `market-overview-${useId().replaceAll(":", "")}`;
  const points = useMemo(() => (data || []).map((point, index) => ({
    ...point,
    index,
    value: Number(point.value),
    time: point.timestamp
      ? new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date(point.timestamp))
      : point.time,
  })).filter((point) => Number.isFinite(point.value)), [data]);
  const values = points.map((point) => point.value);
  const min = values.length ? Math.min(...values) : 24_100;
  const max = values.length ? Math.max(...values) : 24_900;
  const spread = Math.max(max - min, 400);
  const padding = spread * 0.18;
  const domain = [min - padding * 0.35, max + padding];

  return (
    <div className={s.mainChart} role="img" aria-label="NIFTY 50 market summary" data-chart-engine="recharts">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 14, right: 2, bottom: 0, left: -4 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#007a55" stopOpacity="0.18" />
              <stop offset="56%" stopColor="#007a55" stopOpacity="0.055" />
              <stop offset="100%" stopColor="#007a55" stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} horizontalCoordinatesGenerator={({ height }) => [height * 0.2, height * 0.5, height * 0.8]} stroke="#f3f4f6" strokeOpacity={0.9} />
          <XAxis dataKey="index" hide />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickCount={4}
            width={50}
            domain={domain}
            tick={{ fill: "#777589", fontSize: 9.5, fontWeight: 600 }}
            tickFormatter={(value) => Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          />
          <Tooltip content={<ChartTooltip />} cursor={false} animationDuration={170} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#007a55"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 3, fill: "#007a55", stroke: "#fff", strokeWidth: 1.5 }}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function sparklineData(quote, series) {
  if (Array.isArray(series) && series.length > 1) {
    return series
      .filter((point) => Number.isFinite(Number(point?.value)))
      .map((point, index) => ({ ...point, index, value: Number(point.value) }));
  }
  if (Array.isArray(quote?.sparkline) && quote.sparkline.length) return quote.sparkline;
  return [];
}

function Sparkline({ quote, series }) {
  const color = quote?.direction === "down" ? "#ff3159" : "#00b982";
  const data = sparklineData(quote, series);
  return (
    <div className={s.sparkline} aria-hidden="true" data-chart-engine="recharts" data-series-points={data.length}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <XAxis dataKey="index" hide />
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" dot={false} isAnimationActive animationDuration={700} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ExchangeArtwork() {
  return (
    <div className={s.heroArtwork} aria-hidden="true">
      <Image
        src={marketHeroImage}
        alt=""
        priority
        sizes="(max-width: 760px) 142vw, 60vw"
      />
    </div>
  );
}

function PanelTab({ label, selected, onSelect }) {
  return (
    <button type="button" data-panel-tab={label} aria-pressed={selected} onClick={() => onSelect(label)}>
      {label}
    </button>
  );
}

export default function MarketsOverviewHero({ market, chartSeries = {}, updatedAt, sourceMode = "unavailable", view, onViewChange }) {
  const model = useMemo(
    () => buildMarketsOverview({ ...market, chartSeries }, updatedAt),
    [market, chartSeries, updatedAt],
  );
  const liveSectors = useMemo(() => [...(market.sectors || [])]
    .filter((sector) => Number.isFinite(Number(sector.changePercent)))
    .sort((a, b) => Number(b.changePercent) - Number(a.changePercent))
    .slice(0, 7), [market.sectors]);
  const strongestSectorMove = Math.max(...liveSectors.map((sector) => Math.abs(Number(sector.changePercent))), 1);
  const controlsRef = useRef(null);
  const [period, setPeriod] = useState("1D");
  const [openMenu, setOpenMenu] = useState(null);
  const [remoteChart, setRemoteChart] = useState(null);
  const [chartState, setChartState] = useState("idle");
  const [sidePanel, setSidePanel] = useState("Key Indices");
  const providerIsLive = sourceMode === "live";
  const displayedChart = period === "1D"
    ? model.chart
    : remoteChart?.period === period
      ? remoteChart.points
      : model.chart;
  const sideRows = sidePanel === "Top Gainers"
    ? (market.gainers || []).slice(0, 4)
    : sidePanel === "Top Losers"
      ? (market.losers || []).slice(0, 4)
      : model.indices.slice(0, 4);

  useEffect(() => {
    function dismissMenu(event) {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "pointerdown" && controlsRef.current?.contains(event.target)) return;
      setOpenMenu(null);
    }

    document.addEventListener("keydown", dismissMenu);
    document.addEventListener("pointerdown", dismissMenu);
    return () => {
      document.removeEventListener("keydown", dismissMenu);
      document.removeEventListener("pointerdown", dismissMenu);
    };
  }, []);

  useEffect(() => {
    if (period === "1D") return undefined;
    const controller = new AbortController();

    async function loadChart() {
      setChartState("loading");
      try {
        const response = await fetch(
          `/api/market/chart?symbol=${encodeURIComponent("^NSEI")}&range=${period}`,
          { signal: controller.signal, headers: { accept: "application/json" } },
        );
        if (!response.ok) throw new Error(`Chart request failed with ${response.status}`);
        const payload = await response.json();
        if (!Array.isArray(payload.points) || !payload.points.length) throw new Error("Chart response did not include points");
        setRemoteChart({ period, points: payload.points });
        setChartState("ready");
      } catch (error) {
        if (error?.name !== "AbortError") setChartState("error");
      }
    }

    loadChart();
    return () => controller.abort();
  }, [period]);

  const updatedLabel = formatIstTime(model.updatedAt);
  const chartFeedback = chartState === "loading"
    ? `Loading ${period} NIFTY chart`
    : chartState === "error"
      ? `Live ${period} chart unavailable. Showing the last successful values.`
      : chartState === "ready"
        ? `${period} NIFTY chart updated`
        : "Showing the latest NIFTY session";

  return (
    <section className={s.overviewHero} data-markets-overview-hero data-source-mode={sourceMode} data-live={providerIsLive}>
      <header className={s.heroHeader}>
        <ExchangeArtwork />

        <div className={s.heroCopy} ref={controlsRef}>
          <div className={s.marketSelectorWrap}>
            <button
              type="button"
              className={s.marketSelector}
              aria-label="Selected market: Indian Stocks"
              aria-haspopup="menu"
              aria-expanded={openMenu === "market"}
              aria-controls="markets-overview-market-menu"
              onClick={() => setOpenMenu((current) => current === "market" ? null : "market")}
            >
              <FlagBadge />
              <strong>Indian Stocks</strong>
              <ChevronDown />
              <span className={s.selectorLiveDot} aria-hidden="true" />
            </button>
            {openMenu === "market" && (
              <div className={`${s.headerPopover} ${s.marketPopover}`} id="markets-overview-market-menu" role="menu">
                <div className={s.popoverHeading}><span>Indian market</span><b data-live={providerIsLive}>{providerIsLive ? "Live" : "Delayed"}</b></div>
                {model.indices.map((quote, index) => (
                  <a role="menuitem" href={quote.href} target="_blank" rel="noreferrer" key={quote.symbol}>
                    <IndexMark index={index} symbol={quote.symbol} logoUrl={quote.logoUrl} />
                    <span><strong>{quote.label}</strong><small>{quote.formattedValue}</small></span>
                    <Change quote={quote} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <h1 className={s.heroTitle}>Track the Market. <em>Smarter.</em></h1>
          <p>Live market updates, sector trends and everything you need to stay ahead.</p>
        </div>

        <div className={s.statusCard} data-live={providerIsLive} aria-live="polite">
          <span className={s.statusIcon}><i aria-hidden="true" /></span>
          <div><strong>{model.statusLabel}</strong><small>{model.updatedAt ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(model.updatedAt)) : "Latest session"} · {updatedLabel} IST</small></div>
        </div>
      </header>

      <nav className={s.viewTabs} aria-label="Market view">
        {VIEWS.map((item) => (
          <button type="button" key={item} aria-pressed={view === item} onClick={() => onViewChange(item)}>{item}</button>
        ))}
      </nav>

      <div className={s.metricStrip} aria-label="Market participation indicators">
        {model.metrics.map((metric) => (
          <article key={metric.key} data-tone={metric.tone} data-live={providerIsLive}>
            <span><DashboardIcon name={metric.key} /></span>
            <div>
              <small>{metric.label}</small>
              <div className={s.metricValueLine}>
                {metric.key === "advance-decline" ? (
                  <strong className={s.splitMetric}>
                    <i>{metric.primary.split(" / ")[0]}</i><b>/</b><em>{metric.primary.split(" / ")[1]}</em>
                  </strong>
                ) : <strong>{metric.primary}</strong>}
                {metric.detail && <em>{metric.detail}</em>}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={s.dashboardGrid}>
        <article className={s.marketSummaryCard}>
          <div className={s.summaryTopbar}>
            <div><h2>Market Today</h2><p>Live market movement</p></div>
            <div className={s.periodRail} aria-label="NIFTY chart period" aria-busy={chartState === "loading"} data-state={chartState}>
              {MARKET_RANGES.map((item) => (
                <button type="button" key={item} aria-pressed={period === item} data-loading={chartState === "loading" && period === item} onClick={() => setPeriod(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className={s.leadQuote}>
            <IndexMark index={0} symbol={model.lead.symbol} logoUrl={model.lead.logoUrl} />
            <div>
              <span>Nifty 50 <em>NIFTY</em></span>
              <div className={s.leadValue}><strong>{model.lead.formattedValue}</strong><Change quote={model.lead} showAbsolute /></div>
            </div>
          </div>

          <MarketChart data={displayedChart} />
          <span className={s.chartStatus} aria-live="polite">{chartFeedback}</span>
          <div className={s.chartTimes}><span>09:15</span><span>10:30</span><span>12:00</span><span>13:30</span><span>15:30</span></div>
          <div className={s.ohlcStrip}>
            <div><span>Open</span><strong>{formatNumber(model.lead.open)}</strong></div>
            <div><span>High</span><strong data-direction="up">{formatNumber(model.lead.high)}</strong></div>
            <div><span>Low</span><strong data-direction="down">{formatNumber(model.lead.low)}</strong></div>
            <div><span>Prev. Close</span><strong>{formatNumber(model.lead.previousClose)}</strong></div>
          </div>
        </article>

        <article className={s.sectorCard} data-live={providerIsLive}>
          <header>
            <div><h2>Sector Performance <span>Live</span></h2></div>
            <a href="#sector-heatmap">View All <b>›</b></a>
          </header>
          <ol>
            {liveSectors.map((sector, index) => {
              const value = Number(sector.changePercent);
              return (
                <li key={sector.symbol}>
                  <b>{index + 1}.</b>
                  <span className={s.sectorIcon}><SectorIcon index={index} /></span>
                  <div><span>{sector.label}</span><i><u style={{ width: `${Math.max(16, Math.abs(value) / strongestSectorMove * 100)}%` }} /></i></div>
                  <strong data-direction={value < 0 ? "down" : "up"}>{value >= 0 ? "+" : ""}{value.toFixed(2)}%</strong>
                </li>
              );
            })}
            {!liveSectors.length ? <li className={s.emptySector}><div><span>Live sector feed unavailable</span></div><strong>—</strong></li> : null}
          </ol>
          <div className={s.sectorInsight}><span aria-hidden="true">◆</span><strong>Tech stocks are leading the market today</strong></div>
        </article>

        <aside className={s.quotePanel} aria-label="Live market leaders">
          <div className={s.quoteTabs}>
            <PanelTab label="Key Indices" selected={sidePanel === "Key Indices"} onSelect={setSidePanel} data-panel-tab="Key Indices" />
            <PanelTab label="Top Gainers" selected={sidePanel === "Top Gainers"} onSelect={setSidePanel} data-panel-tab="Top Gainers" />
            <PanelTab label="Top Losers" selected={sidePanel === "Top Losers"} onSelect={setSidePanel} data-panel-tab="Top Losers" />
          </div>
          <div className={s.quoteRows}>
            {sideRows.map((quote, index) => (
              <a href={quote.href} target="_blank" rel="noreferrer" key={quote.symbol || `${sidePanel}-${index}`}>
                <div><span>{quote.label || quote.displaySymbol || quote.symbol}</span><strong>{quote.formattedValue || "—"} <Change quote={quote} /></strong></div>
                <Sparkline quote={quote} series={chartSeries[quote.symbol]} />
                <b aria-hidden="true">›</b>
              </a>
            ))}
            {!sideRows.length ? <div className={s.emptyQuotes}>Live quotes unavailable</div> : null}
          </div>
          <div className={s.watchlistBanner}>
            <span><BellIcon /></span>
            <div><strong>Never miss a market move</strong><small>Get live alerts on your watchlist</small></div>
            <a href="/stock-alerts">Create Watchlist</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
