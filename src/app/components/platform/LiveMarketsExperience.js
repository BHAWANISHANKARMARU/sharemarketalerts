"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../SiteHeader";
import { useMarketData } from "../MarketDataProvider";
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

const COLUMN_SETS = ["Overview", "Performance", "Momentum", "Risk"];

function signalFor(quote) {
  const strength = Math.abs(quote.changePercent || 0);
  if (strength >= 2.4) return quote.direction === "down" ? "Strong sell" : "Strong buy";
  if (strength >= 1) return quote.direction === "down" ? "Sell" : "Buy";
  return "Neutral";
}

export default function LiveMarketsExperience() {
  const { market, updatedAt, sources } = useMarketData();
  const [tab, setTab] = useState("Stocks");
  const [moverMode, setMoverMode] = useState("All stocks");
  const [signalFilter, setSignalFilter] = useState("All signals");
  const [columnSet, setColumnSet] = useState("Overview");
  const [descending, setDescending] = useState(true);
  const upCount = (market.equities || []).filter((quote) => Number(quote.changePercent) > 0).length;
  const downCount = (market.equities || []).filter((quote) => Number(quote.changePercent) < 0).length;
  const upShare = Math.round((upCount / Math.max(upCount + downCount, 1)) * 100);

  const rows = useMemo(() => {
    let next = [...(market.equities || [])];
    if (moverMode === "Gainers") next = next.filter((quote) => quote.direction !== "down");
    if (moverMode === "Losers") next = next.filter((quote) => quote.direction === "down");
    if (signalFilter !== "All signals") next = next.filter((quote) => signalFor(quote).includes(signalFilter));
    return next.sort((a, b) => descending ? b.changePercent - a.changePercent : a.changePercent - b.changePercent);
  }, [descending, market.equities, moverMode, signalFilter]);
  const vix = market.indices.find((quote) => quote.symbol === "^INDIAVIX");
  const sectorChanges = (market.sectors || []).map((sector) => Number(sector.changePercent)).filter(Number.isFinite);
  const sectorSpread = sectorChanges.length ? Math.max(...sectorChanges) - Math.min(...sectorChanges) : null;
  const volumeCoverage = (market.equities || []).filter((quote) => Number(quote.averageVolume) > 0).length;
  const marketCollections = [
    ["Indian indices", "Headline market benchmarks", market.indices.slice(0, 3).map((quote) => [quote.label, quote.formattedValue, quote.formattedChange]), "IN"],
    ["Top gainers", "Strongest tracked equities", market.gainers.slice(0, 3).map((quote) => [quote.displaySymbol, `₹${quote.formattedValue}`, quote.formattedChange]), "UP"],
    ["Top losers", "Weakest tracked equities", market.losers.slice(0, 3).map((quote) => [quote.displaySymbol, `₹${quote.formattedValue}`, quote.formattedChange]), "DN"],
    ["World markets", "Overnight and global context", market.coverage.filter((quote) => quote.symbol.startsWith("^")).slice(0, 3).map((quote) => [quote.label, quote.formattedValue, quote.formattedChange]), "GL"],
    ["Currencies + commodities", "Macro-sensitive instruments", market.coverage.filter((quote) => quote.symbol.includes("=")).slice(0, 3).map((quote) => [quote.label, quote.formattedValue, quote.formattedChange]), "FX"],
    ["Signal queue", "Highest-confidence opportunities", market.opportunities.slice(0, 3).map((item) => [item.name, item.side, item.confidence]), "SQ"],
  ];

  return (
    <main className={[s.workspacePage, s.liveWorkspace].join(" ")} data-live-terminal>
      <SiteHeader />
      <div className={s.wideCanvas}>
        <WorkspaceBreadcrumbs items={[{ label: "Live markets", href: "/live-markets" }, { label: "India" }, { label: "Stocks" }]} />
        <section className={s.screenerIntro}>
          <div><button type="button"><span>🇮🇳</span> Indian market <i>⌄</i></button><h1>Market screener</h1><p>Scan live equities across price action, participation, momentum and risk.</p></div>
          <div><i className={market.status === "open" ? s.statusOpen : s.statusClosed} /><strong>{market.statusLabel}</strong><span>{formatIstTime(updatedAt)} IST · {sources.yahoo.mode}</span></div>
        </section>
        <WorkspaceTabs items={["Stocks", "Indices", "Futures", "ETFs"]} active={tab} onChange={setTab} label="Market instruments" />

        <section className={s.screenerControls}>
          <FilterRail label="Mover filters">{["All stocks", "Gainers", "Losers"].map((item) => <FilterChip key={item} active={moverMode === item} onClick={() => setMoverMode(item)}>{item}</FilterChip>)}</FilterRail>
          <div className={s.screeningFilters}>
            <label><span>Market cap</span><select defaultValue="All"><option>All</option><option>Large cap</option><option>Mid cap</option><option>Small cap</option></select></label>
            <label><span>Sector</span><select defaultValue="All sectors"><option>All sectors</option><option>Financials</option><option>Technology</option><option>Energy</option></select></label>
            <label><span>Signal</span><select value={signalFilter} onChange={(event) => setSignalFilter(event.target.value)}><option>All signals</option><option>Buy</option><option>Sell</option></select></label>
            <button type="button" className={s.addFilterButton}>＋ Add filter</button>
          </div>
        </section>

        <section className={s.screenerBoard}>
          <header className={s.columnBar}>
            <div><span>Column set</span>{COLUMN_SETS.map((item) => <button type="button" aria-pressed={columnSet === item} onClick={() => setColumnSet(item)} key={item}>{item}</button>)}</div>
            <div><span>{rows.length} matches</span><button type="button" aria-label="Table settings">⚙</button><button type="button" aria-label="More table actions">•••</button></div>
          </header>
          <div className={s.screenerTableWrap}>
            <table className={s.screenerTable}>
              <thead><tr><th>Symbol</th><th>Price</th><th><button type="button" onClick={() => setDescending((value) => !value)} aria-label="Sort by change">Change % {descending ? "↓" : "↑"}</button></th><th>Relative volume</th><th>Signal</th><th>Confidence</th><th>Market</th></tr></thead>
              <tbody>{rows.map((quote, index) => {
                const signal = signalFor(quote);
                const confidence = Math.min(96, Math.round(68 + Math.abs(quote.changePercent || 0) * 7));
                const relativeVolume = Number(quote.averageVolume) > 0 && Number(quote.volume) >= 0
                  ? Number(quote.volume) / Number(quote.averageVolume)
                  : null;
                return <tr key={quote.symbol}><td><a href={quote.href} target="_blank" rel="noreferrer"><InstrumentMark symbol={quote.symbol} logoUrl={quote.logoUrl} tone={index} /><span><strong>{quote.displaySymbol}</strong><small>{quote.name}</small></span><em>NSE</em></a></td><td><strong>₹{quote.formattedValue}</strong></td><td><ChangeValue value={quote.formattedChange} direction={quote.direction} /></td><td><span className={s.volumeCell}><b style={{ width: `${relativeVolume === null ? 0 : Math.min(100, relativeVolume * 36)}%` }} />{relativeVolume === null ? "—" : `${relativeVolume.toFixed(2)}×`}</span></td><td><span className={signal.includes("buy") ? s.signalBuy : signal.includes("sell") ? s.signalSell : s.signalNeutral}>{signal}</span></td><td><span className={s.confidenceCell}><i><b style={{ width: `${confidence}%` }} /></i>{confidence}%</span></td><td><span className={s.marketCell}><i />India</span></td></tr>;
              })}</tbody>
            </table>
          </div>
          <footer><span>Showing {rows.length} of {(market.equities || []).length} tracked equities</span><span>Relative volume uses Yahoo current and 3-month average volume; confidence is a derived signal score.</span></footer>
        </section>

        <section className={s.screenerSummary}>
          <article className={s.breadthCard}><PanelHeading title="Market breadth" subtitle="Tracked universe" /><div className={s.breadthDonut} style={{ "--breadth": `${upShare * 3.6}deg` }}><strong>{upShare}%</strong><span>advancing</span></div><div className={s.breadthLegend}><span><i />Advancing <strong>{upCount}</strong></span><span><i />Declining <strong>{downCount}</strong></span></div><p>{upShare >= 50 ? "Participation supports the headline direction." : "Leadership is narrow; confirmation remains selective."}</p></article>
          <article className={s.opportunityQueue}><PanelHeading title="Opportunity queue" subtitle="Ranked by signal quality" action={<Link href="/stock-alerts">Create alert ↗</Link>} /><ol>{market.opportunities.map((item, index) => <li key={item.symbol}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.name}</strong><small>{item.market}</small></div><em className={item.side === "BUY" ? s.signalBuy : s.signalSell}>{item.side}</em><b>{item.entry}<small>{item.change}</small></b><i>{item.score}</i></li>)}</ol></article>
          <article className={s.riskMonitor}><PanelHeading title="Risk monitor" subtitle="Live derived conditions" /><ul><li><span>India VIX</span><strong>{vix?.formattedValue || "—"}</strong><i data-level={Number(vix?.changePercent) > 3 ? "medium" : "low"} /></li><li><span>Sector spread</span><strong>{sectorSpread === null ? "—" : `${sectorSpread.toFixed(2)}%`}</strong><i data-level={sectorSpread !== null && sectorSpread > 4 ? "medium" : "low"} /></li><li><span>Declining equities</span><strong>{downCount}</strong><i data-level={downCount > upCount ? "medium" : "low"} /></li><li><span>Volume coverage</span><strong>{volumeCoverage}/{(market.equities || []).length}</strong><i data-level={volumeCoverage ? "low" : "medium"} /></li></ul><div><span>SESSION MOMENTUM</span><strong>{market.momentumScore ?? "—"}<small>/100</small></strong><em>{market.momentumLabel}</em></div></article>
        </section>
        <section className={s.marketDirectory}>
          <div className={s.sectionTitleRow}><div><h2>Browse every market view</h2><span>Indices, equities, global context, macro instruments and ranked signals</span></div><Link href="/markets">Open market overview <span>↗</span></Link></div>
          <div className={s.marketDirectoryGrid}>{marketCollections.map(([title, copy, items, mark], index) => <article key={title}><header><div><InstrumentMark symbol={mark} tone={index} /><span><h3>{title}</h3><p>{copy}</p></span></div><Link href={title === "Signal queue" ? "/stock-alerts" : "/markets"}>↗</Link></header><ol>{items.map(([name, value, meta]) => <li key={`${title}-${name}`}><span>{name}</span><strong>{value}</strong><em>{meta}</em></li>)}</ol></article>)}</div>
        </section>
        <p className={s.screenerDisclaimer}>Data source: {sources.yahoo.name} · {sources.yahoo.mode}. No demo price fallback is used; unavailable values display as —. Confirm price and suitability with your broker before acting.</p>
      </div>
    </main>
  );
}
