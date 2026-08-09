"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../SiteHeader";
import { useMarketData } from "../MarketDataProvider";
import {
  FilterChip,
  FilterRail,
  InstrumentMark,
  PanelHeading,
  WorkspaceBreadcrumbs,
  WorkspaceTabs,
  formatIstTime,
} from "./WorkspacePrimitives";
import s from "./TradingWorkspace.module.css";

function money(value) {
  return Number.isFinite(value) ? "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value) : "—";
}

export default function IpoExperience() {
  const { ipo, sources } = useMarketData();
  const [status, setStatus] = useState("All issues");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("Calendar");
  const rows = useMemo(() => ipo.rows.filter((row) => {
    const matchesQuery = [row.company, row.symbol || ""].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All issues" || row.status.toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesStatus;
  }), [ipo.rows, query, status]);
  const positive = ipo.rows.filter((row) => Number(row.gmpPercent) > 0).length;
  const byPremium = [...ipo.rows].sort((a, b) => (b.gmpPercent || 0) - (a.gmpPercent || 0));
  const bySize = [...ipo.rows].sort((a, b) => (b.issueSize || 0) - (a.issueSize || 0));
  const listed = ipo.rows.filter((row) => row.status === "listed");
  const calendarEvents = ipo.rows.flatMap((row) => [
    row.startDate ? { date: row.startDate, title: "Offer opens", company: row.company, copy: "Live IPO Alerts opening date", state: "Open" } : null,
    row.endDate ? { date: row.endDate, title: "Offer closes", company: row.company, copy: "Live IPO Alerts closing date", state: "Close" } : null,
    row.listingDate ? { date: row.listingDate, title: "Listing day", company: row.company, copy: "Live IPO Alerts listing date", state: "Listing" } : null,
  ].filter(Boolean)).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const nextEvent = calendarEvents[0];
  const ipoCollections = [
    ["Tracked issues", "Complete primary-market coverage", ipo.rows.slice(0, 3).map((row) => [row.company, row.status, row.symbol || "Unlisted"]), "TR"],
    ["Highest GMP", "Unofficial premium watch", byPremium.slice(0, 3).map((row) => [row.company, row.gmpPercent == null ? "—" : `${row.gmpPercent.toFixed(2)}%`, money(row.gmp)]), "GM"],
    ["Largest offers", "Issue size comparison", bySize.slice(0, 3).map((row) => [row.company, `${money(row.issueSize)} Cr`, row.status]), "OF"],
    ["Recently listed", "Post-listing review queue", listed.slice(0, 3).map((row) => [row.company, money(row.estimatedListingPrice), row.symbol || "NSE"]), "LI"],
    ["Issue documents", "What to read before applying", [["Offer document", "Business + risk", "RHP"], ["Use of proceeds", "Growth vs. exits", "Terms"], ["Peer comparison", "Valuation context", "Review"]], "DO"],
    ["Investor workflow", "Decisions from open to listing", [["Review terms", "Before opening", "01"], ["Check demand", "Before closing", "02"], ["Plan listing", "Before debut", "03"]], "WF"],
  ];

  return (
    <main className={[s.workspacePage, s.ipoWorkspace].join(" ")} data-ipo-explorer>
      <SiteHeader />
      <div className={s.canvas}>
        <WorkspaceBreadcrumbs items={[{ label: "Markets", href: "/markets" }, { label: "Calendars" }, { label: "IPO" }]} />
        <section className={s.compactIntro}>
          <div><span>PRIMARY MARKET · INDIA</span><h1>IPO Calendar</h1><p>Track issue dates, terms, demand context and listing expectations without leaving the calendar.</p></div>
          <div className={s.updatedBadge}><i /> Updated {formatIstTime(ipo.updatedAt)} IST</div>
        </section>
        <WorkspaceTabs items={["Calendar", "Open issues", "Recently listed", "Guide"]} active={view} onChange={setView} label="IPO view" />

        <section className={s.ipoToolbar}>
          <FilterRail label="IPO status">{["All issues", "Open", "Upcoming", "Listed", "Historical"].map((item) => <FilterChip active={status === item} onClick={() => setStatus(item)} key={item}>{item}</FilterChip>)}</FilterRail>
          <label className={s.workspaceSearch}><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><span className={s.srOnly}>Search IPOs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or symbol" /></label>
        </section>

        <section className={s.ipoMetrics} aria-label="IPO market summary">
          <article><span>Tracked issues</span><strong>{ipo.total}</strong><small>{sources.ipo.mode} provider state</small></article>
          <article><span>Positive GMP</span><strong>{positive}</strong><small>Unofficial interest indicator</small></article>
          <article><span>Highest GMP</span><strong>{ipo.highestGmp?.gmpPercent?.toFixed(2) || "—"}%</strong><small>{ipo.highestGmp?.company || "No live premium"}</small></article>
          <article><span>Next IPO event</span><strong>{nextEvent ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(nextEvent.date)) : "—"}</strong><small>{nextEvent ? `${nextEvent.company} · ${nextEvent.title}` : "No live event date"}</small></article>
        </section>

        <section className={s.ipoCalendarBoard}>
          <PanelHeading title="Offer calendar" subtitle="Key primary-market decision points" action={<button type="button" className={s.outlineButton}>This month⌄</button>} />
          <div className={s.calendarHeader}><span>DATE</span><span>EVENT</span><span>WHAT TO REVIEW</span><span>STATE</span></div>
          <ol>{calendarEvents.map((event) => <li key={`${event.company}-${event.title}-${event.date}`} data-live="true"><time>{new Intl.DateTimeFormat("en-US", { weekday: "short", day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(event.date)).toUpperCase()}</time><span className={s.calendarDot} data-state={event.state} /><div><strong>{event.title}</strong><small>{event.company}</small></div><p>{event.copy}</p><em>{event.state}</em></li>)}</ol>
          {!calendarEvents.length ? <p className={s.emptyState}>No dated IPO events are available from the live provider.</p> : null}
        </section>

        <section className={s.ipoScreener}>
          <div className={s.sectionTitleRow}><div><h2>Issue screener</h2><span>{rows.length} matching issues · GMP values are unofficial</span></div><button type="button" className={s.outlineButton}>Columns ⊞</button></div>
          <div className={s.tableScroller}>
            <table className={s.workspaceTable}>
              <thead><tr><th>Company</th><th>Status</th><th>Issue size</th><th>Price band</th><th>GMP</th><th>Est. listing</th><th>Signal</th></tr></thead>
              <tbody>{rows.map((row, index) => {
                const signal = row.gmpPercent >= 10 ? "High interest" : row.gmpPercent > 0 ? "Tracking" : "No premium";
                const band = row.issueLow === row.issueHigh ? money(row.issueHigh) : [money(row.issueLow), money(row.issueHigh)].join("–");
                const percent = row.gmpPercent == null ? "Unavailable" : (row.gmpPercent >= 0 ? "+" : "") + row.gmpPercent.toFixed(2) + "%";
                return <tr key={row.id}><td><a href={row.href} target="_blank" rel="noreferrer"><InstrumentMark symbol={row.company} tone={index} /><span><strong>{row.company}</strong><small>{row.symbol || "Unlisted issue"}</small></span></a></td><td><em className={s.statusPill}>{row.status}</em></td><td>{money(row.issueSize)} Cr</td><td>{band}</td><td className={row.gmpPercent >= 0 ? s.tablePositive : s.tableNegative}><strong>{money(row.gmp)}</strong><small>{percent}</small></td><td>{money(row.estimatedListingPrice)}</td><td><span className={s.signalPill} data-signal={signal}>{signal}</span></td></tr>;
              })}</tbody>
            </table>
            {!rows.length && <p className={s.emptyState}>No issue matches the current search and status filters.</p>}
          </div>
        </section>

        <section className={s.marketDirectory}>
          <div className={s.sectionTitleRow}><div><h2>All IPO market data</h2><span>Issues, premiums, offer sizes, listings and decision resources</span></div><Link href="/insights">Read primary-market research <span>↗</span></Link></div>
          <div className={s.marketDirectoryGrid}>{ipoCollections.map(([title, copy, items, mark], index) => <article key={title}><header><div><InstrumentMark symbol={mark} tone={index} /><span><h3>{title}</h3><p>{copy}</p></span></div><span aria-hidden="true">↗</span></header><ol>{items.map(([name, value, meta]) => <li key={`${title}-${name}`}><span>{name}</span><strong>{value}</strong><em>{meta}</em></li>)}</ol></article>)}</div>
        </section>

        <section className={s.ipoGuide}>
          <div><h2>Read the issue, not only the premium</h2><p>GMP reflects informal demand. It does not measure valuation, allocation probability or post-listing liquidity.</p></div>
          <ol>{[["01", "Demand", "Separate institutional, non-institutional and retail bids."], ["02", "Valuation", "Compare the upper band with relevant listed peers."], ["03", "Proceeds", "Distinguish growth capital from shareholder exits."], ["04", "Risk", "Review leverage, concentration and litigation disclosures."]].map(([number, title, copy]) => <li key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        </section>
        <p className={s.dataSource}>Source: {sources.ipo.name} · {sources.ipo.mode}. Figures are informational and may be delayed.</p>
      </div>
    </main>
  );
}
