"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FinancialChart from "./FinancialChart";
import { useMarketData } from "./MarketDataProvider";
import s from "./MarketIntelligence.module.css";

const INDEX_OPTIONS = [
  ["^NSEI", "NIFTY 50 INDEX"],
  ["^BSESN", "SENSEX INDEX"],
  ["^NSEBANK", "BANK NIFTY INDEX"],
  ["^INDIAVIX", "INDIA VIX INDEX"],
];

const SPARKLINES = [
  "2,27 8,25 13,26 19,19 25,22 31,15 37,18 45,6",
  "2,25 8,21 14,24 20,16 27,19 34,11 40,15 47,6",
  "2,27 9,21 15,23 21,15 27,19 34,10 39,13 47,5",
  "2,10 8,15 14,12 20,21 26,18 33,26 39,21 47,29",
];

function chartPoints(series, width = 178, height = 118) {
  const values = series.map((point) => Number(point.value)).filter(Number.isFinite);
  if (values.length < 2) return "0,60 178,60";
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = Math.max(maximum - minimum, 1);
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - minimum) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function BrandMark() {
  return (
    <svg className={s.brandMark} viewBox="0 0 34 32" aria-hidden="true">
      <defs><linearGradient id="market-brand" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#6a08e8" /><stop offset="1" stopColor="#d51cff" /></linearGradient></defs>
      <rect x="2" y="15" width="3" height="13" rx="1.5" fill="url(#market-brand)" />
      <rect x="8" y="9" width="3" height="19" rx="1.5" fill="url(#market-brand)" />
      <rect x="14" y="3" width="3" height="25" rx="1.5" fill="url(#market-brand)" />
      <rect x="20" y="11" width="3" height="17" rx="1.5" fill="url(#market-brand)" />
      <path d="M1 20 8 16l6 3 8-11 9 3" fill="none" stroke="#9a13f2" strokeWidth="1.6" />
    </svg>
  );
}

function MarketIcon({ bank = false }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" />
      {bank ? <path d="M5 8h10M6 8v5m4-5v5m4-5v5M5 14h10M10 4l5 3H5l5-3Z" /> : <path d="m5 13 3-3 2 1.5 4.5-5M12 6.5h2.5V9" />}
    </svg>
  );
}

function Sparkline({ points, tone }) {
  return (
    <FinancialChart
      className={`${s.sparkline} ${s[tone]}`}
      points={points}
      width={49}
      height={32}
      tone={tone === "red" ? "negative" : "positive"}
      label={`${tone === "red" ? "Falling" : "Rising"} market trend`}
    />
  );
}

function StatusRow({ statusLabel, updatedAt }) {
  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(updatedAt));
  return (
    <div className={s.statusRow}>
      <p><b>MARKET STATUS:</b><i />{statusLabel.toUpperCase()}</p>
      <time dateTime={updatedAt}>{time}</time>
      <span className={s.statusBolt} aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m11.6 2.5-6 8.5h4L8.7 17.5l6-8.5h-4l.9-6.5Z" /></svg></span>
    </div>
  );
}

function MarketStrip({ markets }) {
  return (
    <div className={s.marketStrip}>
      {markets.map((market, index) => (
        <div className={s.marketMetric} key={market.name}>
          <span className={s.marketMetricIcon}><MarketIcon bank={index === 2} /></span>
          <div className={s.marketNumbers}><span>{market.name}</span><strong>{market.value}</strong><b className={s[market.tone]}>{market.delta}</b></div>
          <Sparkline points={market.points} tone={market.tone} />
        </div>
      ))}
      <div className={s.scanned}>
        <span>MARKETS SCANNED</span><strong>6</strong><small>Asset Classes</small>
        <svg viewBox="0 0 58 58" aria-hidden="true"><circle cx="29" cy="29" r="19" /><circle cx="29" cy="29" r="10" /><circle cx="29" cy="29" r="2.5" /><path d="M29 5v6m0 36v6M5 29h6m36 0h6M12 12l4 4m26 26 4 4m0-34-4 4M16 42l-4 4" /></svg>
      </div>
    </div>
  );
}

function PulseChart({ points, valueRange, domainRange }) {
  return (
    <div className={s.pulseChart}>
      <FinancialChart
        className={s.pulsePlot}
        points={points}
        width={210}
        height={190}
        tone="brand"
        label="NIFTY 50 intraday price trend"
        area
        marker
        grid
        showYAxis
        valueRange={valueRange}
        domainRange={domainRange}
        yTicks={domainRange ? [domainRange[0], (domainRange[0] + domainRange[1]) / 2, domainRange[1]] : undefined}
      />
      <span className={s.noon}>12 PM</span><span className={s.morning}>09 AM</span><span className={s.afternoon}>03 PM</span><span className={s.evening}>06 PM</span>
    </div>
  );
}

function BreadthBars() {
  return <svg viewBox="0 0 93 25" aria-hidden="true"><g fill="#0ac87e"><rect x="2" y="7" width="3" height="8" /><rect x="7" y="4" width="3" height="11" /><rect x="12" y="9" width="3" height="6" /><rect x="17" y="2" width="3" height="13" /><rect x="22" y="6" width="3" height="9" /><rect x="27" y="3" width="3" height="12" /><rect x="32" y="8" width="3" height="7" /><rect x="37" y="5" width="3" height="10" /></g><g fill="#ff4968"><rect x="52" y="8" width="3" height="7" /><rect x="57" y="3" width="3" height="12" /><rect x="62" y="6" width="3" height="9" /><rect x="67" y="2" width="3" height="13" /><rect x="72" y="9" width="3" height="6" /><rect x="77" y="4" width="3" height="11" /><rect x="82" y="7" width="3" height="8" /><rect x="87" y="5" width="3" height="10" /></g></svg>;
}

function TinyVolatility() {
  return (
    <FinancialChart
      points="2,12 9,9 15,16 21,11 27,18 34,13 40,20 47,14 53,16 60,7"
      width={62}
      height={26}
      tone="negative"
      label="India VIX trend"
      marker
    />
  );
}

function SentimentGauge() {
  return (
    <div className={s.sentimentGauge}>
      <svg viewBox="0 0 80 43" aria-hidden="true"><path d="M8 39a32 32 0 0 1 64 0" /><path className={s.gaugeValue} d="M8 39a32 32 0 0 1 64 0" pathLength="100" /></svg><strong>72%</strong>
    </div>
  );
}

function MarketPulse({ chart, quote, range, symbol, onRangeChange, onSymbolChange, loading }) {
  const values = chart.map((point) => point.value).filter(Number.isFinite);
  const minimum = values.length ? Math.min(...values) : 0;
  const maximum = values.length ? Math.max(...values) : 100;
  const padding = Math.max((maximum - minimum) * 0.18, maximum * 0.002, 1);
  const domainRange = [Math.floor(minimum - padding), Math.ceil(maximum + padding)];
  const valueRange = [minimum, maximum];
  const format = (value) =>
    value === null || value === undefined
      ? "—"
      : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
  const priceRows = [
    ["OPEN", format(quote?.open), ""],
    ["HIGH", format(quote?.high), "green"],
    ["LOW", format(quote?.low), "red"],
    ["CLOSE", quote?.formattedValue || "—", "violet"],
    ["CHANGE", quote?.formattedChange || "—", quote?.direction === "down" ? "red" : "green"],
    ["VOLUME", quote?.volume ? new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 2 }).format(quote.volume) : "—", ""],
  ];

  return (
    <article className={s.pulsePanel} aria-busy={loading}>
      <header className={s.panelHeader}>
        <h3><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 12h3l2-5 3 7 2-4h4" /></svg>MARKET PULSE</h3>
        <div className={s.pulseControls}>
          <div className={s.periods} role="group" aria-label="Chart period">
            {["1D", "5D", "1M", "3M", "1Y"].map((period) => (
              <button type="button" className={range === period ? s.activeTab : undefined} aria-pressed={range === period} onClick={() => onRangeChange(period)} key={period}>{period}</button>
            ))}
          </div>
          <label className={s.indexSelect}>
            <span className={s.srOnly}>Market index</span>
            <select value={symbol} onChange={(event) => onSymbolChange(event.target.value)}>
              {INDEX_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
            <i aria-hidden="true">⌄</i>
          </label>
          <a className={s.expandIcon} href={quote?.href || "https://finance.yahoo.com/quote/%5ENSEI/"} target="_blank" rel="noreferrer" aria-label="Open selected index on Yahoo Finance"><svg viewBox="0 0 18 18"><path d="M3 7V3h4M11 3h4v4M15 11v4h-4M7 15H3v-4" /></svg></a>
        </div>
      </header>
      <div className={s.pulseMain}>
        <PulseChart points={chartPoints(chart)} valueRange={valueRange} domainRange={domainRange} />
        <div className={s.priceRows}>{priceRows.map(([label, value, tone]) => <div key={label}><span>{label}</span><strong className={tone ? s[tone] : ""}>{value}</strong></div>)}</div>
      </div>
      <div className={s.pulseStats}>
        <div className={s.breadth}><h4>MARKET BREADTH</h4><BreadthBars /><p><span><strong>1,892</strong>ADVANCES</span><span><strong>1,023</strong>DECLINES</span></p></div>
        <div className={s.activity}><h4>FII / DII ACTIVITY (₹ Cr)</h4><p><span><strong>+1,245.60</strong>FII NET BUY</span><span><strong>+892.30</strong>DII NET BUY</span></p></div>
        <div className={s.volatility}><h4>VOLATILITY INDEX</h4><small>India VIX</small><p><strong>12.48</strong><b>-2.35%</b></p><TinyVolatility /></div>
        <div className={s.sentiment}><h4>MARKET SENTIMENT</h4><small>BULLISH</small><SentimentGauge /></div>
      </div>
    </article>
  );
}

function CompanyIcon({ index, loser, name }) {
  const colors = loser ? ["#715cf6", "#652bf0", "#d81965", "#5521ba", "#d69649"] : ["#7752f4", "#1f7cf2", "#df4255", "#398af5", "#eb3160"];
  const marks = { RELIANCE: "R", "TATA MOTORS": "T", HDFCBANK: "H", INFY: "I", ICICIBANK: "I", ADANIENT: "A", WIPRO: "W", JSWSTEEL: "J", BPCL: "B", TITAN: "T" };
  return <span className={s.companyIcon} style={{ "--company-color": colors[index] }}>{marks[name]}</span>;
}

function MoversList({ title, rows, loser = false }) {
  return (
    <section className={s.moversList}>
      <header><h3>{title}</h3><a href={loser ? "https://finance.yahoo.com/markets/stocks/losers/" : "https://finance.yahoo.com/markets/stocks/gainers/"} target="_blank" rel="noreferrer">VIEW ALL →</a></header>
      <ol>{rows.map(([name, price, delta, href], index) => <li key={name}><a className={s.rowLink} href={href} target="_blank" rel="noreferrer" aria-label={`View ${name} on Yahoo Finance`} /><b>{String(index + 1).padStart(2, "0")}</b><CompanyIcon index={index} loser={loser} name={name} /><strong>{name}</strong><span>{price}</span><em className={loser ? s.red : s.green}>{delta}</em></li>)}</ol>
    </section>
  );
}

function MoversPanel({ gainers, losers }) {
  return <aside className={s.moversPanel}><MoversList title="TOP GAINERS" rows={gainers} /><MoversList title="TOP LOSERS" rows={losers} loser /></aside>;
}

function OpportunityCard({ item }) {
  return (
    <article className={s.opportunityCard}>
      <a className={s.rowLink} href={item.href} target="_blank" rel="noreferrer" aria-label={`View ${item.name} on Yahoo Finance`} />
      <header><span className={`${s.tickerIcon} ${item.side === "SELL" ? s.sellIcon : ""}`}>{item.ticker}</span><span><strong>{item.name}</strong><small>{item.market}</small></span><b className={item.side === "SELL" ? s.sell : s.buy}>{item.side}</b></header>
      <div className={s.tradeLevels}><span><small>ENTRY</small><strong>{item.entry}</strong></span><span><small>TARGET</small><strong>{item.target}</strong></span><span><small>STOP LOSS</small><strong>{item.stop}</strong></span></div>
      <div className={s.tradeMeta}><span><small>CONFIDENCE</small><strong>{item.confidence}<i><b style={{ width: item.confidence }} /></i></strong></span><span><small>SCORE</small><strong className={s.score}>{item.score}</strong></span><span><small>TIME</small><strong>{item.time}</strong></span></div>
    </article>
  );
}

function Opportunities({ items }) {
  const [offset, setOffset] = useState(0);
  const orderedItems = items.length
    ? [...items.slice(offset), ...items.slice(0, offset)]
    : [];
  const move = (direction) => {
    if (items.length < 2) return;
    setOffset((current) => (current + direction + items.length) % items.length);
  };

  return (
    <section className={s.opportunities}>
      <header><h3>LIVE HIGH PROBABILITY OPPORTUNITIES</h3><span>{items.length} LIVE</span><div><button type="button" aria-label="Previous opportunity" onClick={() => move(-1)} disabled={items.length < 2}>‹</button><button type="button" aria-label="Next opportunity" onClick={() => move(1)} disabled={items.length < 2}>›</button></div></header>
      <div className={s.opportunityGrid}>{orderedItems.map((item) => <OpportunityCard key={item.symbol} item={item} />)}</div>
    </section>
  );
}

function EditorialPanel() {
  return (
    <aside className={s.editorial}>
      <div className={s.dotGrid} aria-hidden="true" />
      <div className={s.lowerDotGrid} aria-hidden="true" />
      <div className={s.brand}><BrandMark /><strong>SHARE<br />MARKET<br />ALERTS</strong></div>
      <p className={s.verticalCopy}>REAL-TIME MARKET INTELLIGENCE</p>
      <h2 id="market-intelligence-title"><span>SEE IT</span><span className={s.accent}>BEFORE</span><span>THE MARKET</span><span className={s.moves}>MOVES.</span></h2>
      <i className={s.titleRule} aria-hidden="true" />
      <p className={s.editorialCopy}>Real-time intelligence that<br />{" "}surfaces high-probability<br />{" "}opportunities before<br />{" "}everyone else.</p>
      <div className={s.radarWedge}>
        <Image src="/images/market-intelligence-radar.png" alt="" fill sizes="(min-width: 1920px) 565px, 30vw" className={s.radarImage} />
        <div className={s.radarShade} />
        <p><strong>{"MARKETS DON'T WAIT."}</strong><span>Neither should you.</span></p>
      </div>
    </aside>
  );
}

export default function MarketIntelligence() {
  const marketData = useMarketData();
  const [range, setRange] = useState("1D");
  const [symbol, setSymbol] = useState("^NSEI");
  const [remoteChart, setRemoteChart] = useState(null);

  useEffect(() => {
    if (symbol === "^NSEI" && range === "1D") {
      return undefined;
    }

    const controller = new AbortController();
    fetch(`/api/market/chart?symbol=${encodeURIComponent(symbol)}&range=${range}`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("chart"))))
      .then((payload) => {
        if (payload.points?.length) setRemoteChart(payload.points);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [marketData.market.chart, range, symbol]);

  const chart =
    symbol === "^NSEI" && range === "1D"
      ? marketData.market.chart
      : remoteChart || marketData.market.chart;

  const markets = marketData.market.indices.map((quote, index) => ({
    name: quote.label,
    value: quote.formattedValue,
    delta: quote.formattedChange,
    tone: quote.direction === "down" ? "red" : "green",
    points:
      index === 0 && marketData.market.chart.length
        ? chartPoints(marketData.market.chart.slice(-24), 47, 27)
        : SPARKLINES[index],
  }));
  const gainers = marketData.market.gainers.map((quote) => [
    quote.displaySymbol,
    `₹${quote.formattedValue}`,
    quote.formattedChange,
    quote.href,
  ]);
  const losers = marketData.market.losers.map((quote) => [
    quote.displaySymbol,
    `₹${quote.formattedValue}`,
    quote.formattedChange,
    quote.href,
  ]);
  const selectedQuote = marketData.market.indices.find((quote) => quote.symbol === symbol);

  return (
    <section
      id="market-intelligence"
      data-section="market-intelligence"
      data-market-source={marketData.sources.yahoo.mode}
      className={s.section}
      aria-labelledby="market-intelligence-title"
    >
      <div className={s.canvas}>
        <EditorialPanel />
        <div className={s.dashboard}>
          <StatusRow statusLabel={marketData.market.statusLabel} updatedAt={marketData.updatedAt} />
          <MarketStrip markets={markets} />
          <div className={s.dashboardBody}>
            <MarketPulse chart={chart} quote={selectedQuote} range={range} symbol={symbol} onRangeChange={setRange} onSymbolChange={setSymbol} loading={false} />
            <MoversPanel gainers={gainers} losers={losers} />
          </div>
          <Opportunities items={marketData.market.opportunities} />
        </div>
      </div>
    </section>
  );
}
