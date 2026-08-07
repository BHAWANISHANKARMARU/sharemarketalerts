"use client";

import { useState } from "react";
import Link from "next/link";
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

const SECTORS = [
  ["Technology Services", 11.66], ["Consumer Durables", 8.04],
  ["Producer Manufacturing", 5.6], ["Non-Energy Minerals", 5.36],
  ["Health Technology", 4.22], ["Energy Minerals", 1.91], ["Finance", .38],
];

const EARNINGS = [
  ["MON", "TCS", "After market", "₹31.4 est."],
  ["TUE", "HDFCBANK", "Before market", "₹22.8 est."],
  ["THU", "RELIANCE", "After market", "₹38.6 est."],
  ["FRI", "INFY", "After market", "₹18.2 est."],
];

const ECONOMIC_EVENTS = [
  ["MON", "Industrial production", "12:00", "Medium"],
  ["TUE", "RBI liquidity update", "10:30", "Low"],
  ["THU", "CPI inflation", "17:30", "High"],
  ["FRI", "FX reserves", "17:00", "Medium"],
];

const MARKET_STORIES = [
  ["Market structure", "Breadth improves while the headline index stays range-bound", "Participation is widening across banks, autos and industrials without a material expansion in volatility.", "6 min"],
  ["Sector pulse", "Technology strength now needs volume confirmation", "Relative performance is constructive, but a durable move still depends on broader participation.", "4 min"],
  ["Risk desk", "Three checks for fragile small-cap momentum", "Separate durable trend continuation from a liquidity-led move before taking directional risk.", "7 min"],
  ["Primary market", "Read issue demand beyond the headline subscription", "Institutional demand, retail bids and grey-market pricing answer different questions.", "5 min"],
];

function QuoteRow({ quote, index }) {
  return (
    <li>
      <InstrumentMark symbol={quote.displaySymbol} tone={index} />
      <a href={quote.href} target="_blank" rel="noreferrer">
        <strong>{quote.displaySymbol}</strong><small>{quote.name}</small>
      </a>
      <b>₹{quote.formattedValue}</b>
      <ChangeValue value={quote.formattedChange} direction={quote.direction} />
    </li>
  );
}

export default function MarketsExperience() {
  const { market, updatedAt, sources } = useMarketData();
  const [view, setView] = useState("Overview");
  const [period, setPeriod] = useState("1D");
  const [collection, setCollection] = useState("Most active");
  const lead = market.indices[0];
  const collectionRows = collection === "Biggest losers" ? market.losers : market.gainers;

  return (
    <main className={`${s.workspacePage} ${s.marketsWorkspace}`} data-market-dashboard>
      <SiteHeader />
      <div className={s.canvas}>
        <WorkspaceBreadcrumbs items={[{ label: "Markets", href: "/markets" }, { label: "India" }, { label: "Stocks" }]} />
        <section className={s.marketTitle}>
          <button type="button" className={s.marketSelector}><span>🇮🇳</span> Indian stocks <i>⌄</i></button>
          <h1>{view} <span aria-hidden="true">⌄</span></h1>
          <p>Live Indian market performance, leadership and participation in one workspace.</p>
        </section>
        <WorkspaceTabs items={["Overview", "Performance", "Technicals"]} active={view} onChange={setView} label="Market view" />

        <section className={s.marketSummary}>
          <div className={s.sectionTitleRow}>
            <div><h2>Market summary</h2><span><i className={market.status === "open" ? s.statusOpen : s.statusClosed} /> {market.statusLabel} · {formatIstTime(updatedAt)} IST</span></div>
            <FilterRail label="Chart period">{["1D", "5D", "1M", "6M", "1Y"].map((item) => <FilterChip key={item} active={period === item} onClick={() => setPeriod(item)}>{item}</FilterChip>)}</FilterRail>
          </div>

          <div className={s.summaryGrid}>
            <article className={s.summaryChartPanel}>
              <div className={s.quoteHeadline}>
                <InstrumentMark symbol="50" />
                <div><span>Nifty 50 <em>NIFTY</em></span><strong>{lead?.formattedValue || "—"} <small>POINT</small></strong></div>
                <ChangeValue value={lead?.formattedChange || "—"} direction={lead?.direction} />
              </div>
              <PremiumTrendChart data={market.chart} label="NIFTY 50 market summary" tone={lead?.direction === "down" ? "red" : "green"} />
              <div className={s.chartAxis}><span>09:15</span><span>11:00</span><span>13:00</span><span>15:30</span></div>
            </article>
            <article className={s.sectorPerformance}>
              <PanelHeading title="Sector performance, 1M" subtitle="Relative change across tracked groups" />
              <ol>{SECTORS.map(([name, value]) => <li key={name}><div><span>{name}</span><strong>+{value.toFixed(2)}%</strong></div><i><b style={{ width: `${Math.max(3, value / 11.66 * 100)}%` }} /></i></li>)}</ol>
              <Link href="/live-markets">See all sectors <span>↗</span></Link>
            </article>
          </div>
        </section>

        <section className={s.indexSnapshot} aria-label="Index snapshot">
          {market.indices.map((quote, index) => <a href={quote.href} target="_blank" rel="noreferrer" key={quote.symbol}><InstrumentMark symbol={quote.label} tone={index} /><div><span>{quote.label}</span><strong>{quote.formattedValue}</strong></div><ChangeValue value={quote.formattedChange} direction={quote.direction} /></a>)}
        </section>

        <section className={s.marketBoards}>
          <article className={s.dataListPanel}>
            <PanelHeading title={collection} subtitle="Indian equities" action={<FilterRail label="Market collection">{["Most active", "Top gainers", "Biggest losers"].map((item) => <FilterChip key={item} active={collection === item} onClick={() => setCollection(item)}>{item}</FilterChip>)}</FilterRail>} />
            <ol className={s.quoteList}>{collectionRows.slice(0, 5).map((quote, index) => <QuoteRow quote={quote} index={index} key={quote.symbol} />)}</ol>
            <Link className={s.panelLink} href="/live-markets">Open Market screener <span>↗</span></Link>
          </article>
          <article className={s.earningsPanel}>
            <PanelHeading title="Earnings watch" subtitle="The week ahead" />
            <ol>{EARNINGS.map(([day, symbol, timing, estimate], index) => <li key={symbol}><time>{day}</time><InstrumentMark symbol={symbol} tone={index + 2} /><div><strong>{symbol}</strong><small>{timing}</small></div><span>{estimate}</span></li>)}</ol>
            <p>Estimates are deterministic examples for interface context.</p>
          </article>
        </section>

        <section className={s.marketHeatSection}>
          <div className={s.sectionTitleRow}><div><h2>Sector heatmap</h2><span>Session-level leadership and pressure</span></div><Link href="/stock-alerts">Create sector alert <span>↗</span></Link></div>
          <div className={s.marketHeatmap}>{[...SECTORS, ["Realty", -1.12], ["Utilities", -.46], ["FMCG", .22]].map(([name, value], index) => <article className={value >= 0 ? s.heatPositive : s.heatNegative} style={{ "--heat-weight": index % 3 === 0 ? "2" : "1" }} key={name}><strong>{name}</strong><span>{value > 0 ? "+" : ""}{value.toFixed(2)}%</span><small>{value > 4 ? "Strong momentum" : value > 0 ? "Advancing" : "Under pressure"}</small></article>)}</div>
          <p className={s.dataSource}>Data source: {sources.yahoo.name} · {sources.yahoo.mode}. Market values are informational, not investment advice.</p>
        </section>

        <section className={s.marketDirectory}>
          <div className={s.sectionTitleRow}><div><h2>Markets, everywhere</h2><span>Move across asset classes without losing the session context</span></div><Link href="/live-markets">View all markets <span>↗</span></Link></div>
          <div className={s.marketDirectoryGrid}>
            {[
              ["Indian indices", "NIFTY · SENSEX · BANK NIFTY", market.indices.slice(0, 3), "/live-markets"],
              ["Indian stocks", "Leaders, laggards and most active", market.gainers.slice(0, 3), "/live-markets"],
              ["World indices", "US and global session signals", market.coverage.filter((quote) => quote.symbol.startsWith("^")).slice(0, 3), "/markets"],
              ["Currencies", "Rupee and cross-market context", market.coverage.filter((quote) => quote.symbol.endsWith("=X")), "/markets"],
              ["Commodities", "Metals and macro-sensitive assets", market.coverage.filter((quote) => quote.symbol.endsWith("=F")), "/markets"],
              ["Risk watch", "Weakness, volatility and downside pressure", market.losers.slice(0, 3), "/stock-alerts"],
            ].map(([title, copy, quotes, route], groupIndex) => <article key={title}><header><div><InstrumentMark symbol={title} tone={groupIndex} /><span><h3>{title}</h3><p>{copy}</p></span></div><Link href={route}>↗</Link></header><ol>{quotes.map((quote) => <li key={`${title}-${quote.symbol}`}><span>{quote.label || quote.displaySymbol}</span><strong>{quote.formattedValue}</strong><ChangeValue value={quote.formattedChange} direction={quote.direction} /></li>)}</ol>{quotes.length === 0 && <p className={s.directoryEmpty}>Available through the connected market feed.</p>}</article>)}
          </div>
        </section>

        <section className={s.marketCalendarHub}>
          <div className={s.sectionTitleRow}><div><h2>Market calendars</h2><span>Earnings, economic releases and primary-market decisions in one timeline</span></div><Link href="/ipo">Open IPO Calendar <span>↗</span></Link></div>
          <div className={s.calendarHubGrid}>
            <article><PanelHeading title="Earnings calendar" subtitle="This week · India" /><ol>{EARNINGS.map(([day, symbol, timing, estimate], index) => <li key={`calendar-${symbol}`}><time>{day}</time><InstrumentMark symbol={symbol} tone={index} /><span><strong>{symbol}</strong><small>{timing}</small></span><b>{estimate}</b></li>)}</ol><Link href="/insights">See earnings context ↗</Link></article>
            <article><PanelHeading title="Economic calendar" subtitle="Events ranked by market impact" /><ol>{ECONOMIC_EVENTS.map(([day, event, time, impact], index) => <li key={event}><time>{day}</time><i data-impact={impact} /><span><strong>{event}</strong><small>{time} IST</small></span><b>{impact}</b></li>)}</ol><Link href="/insights">Open week ahead ↗</Link></article>
            <article className={s.primaryCalendar}><PanelHeading title="IPO calendar" subtitle="Primary-market workflow" /><div><strong>Offer review</strong><span>Read terms and use of proceeds</span><time>10 Aug</time></div><div><strong>Demand checkpoint</strong><span>Compare bids by investor category</span><time>12 Aug</time></div><div><strong>Listing watch</strong><span>Observe opening price discovery</span><time>20 Aug</time></div><Link href="/ipo">Open IPO workspace ↗</Link></article>
          </div>
        </section>

        <section className={s.marketStories}>
          <div className={s.sectionTitleRow}><div><h2>Market news and research</h2><span>Context for the price action visible across the workspace</span></div><Link href="/insights">View all insights <span>↗</span></Link></div>
          <div>{MARKET_STORIES.map(([category, title, copy, time], index) => <article key={title}><header><InstrumentMark symbol={category} tone={index + 1} /><span>{category}</span><small>{time} read</small></header><h3>{title}</h3><p>{copy}</p><Link href="/insights">Read analysis <span>↗</span></Link></article>)}</div>
        </section>
      </div>
    </main>
  );
}
