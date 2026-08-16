"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../SiteHeader";
import { useMarketData } from "../MarketDataProvider";
import { InstrumentMark, formatIstTime } from "./WorkspacePrimitives";
import IpoReadingGuide from "./IpoReadingGuide";
import s from "./IpoExperience.module.css";

function money(value) {
  return Number.isFinite(value)
    ? `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`
    : "—";
}

function Icon({ name }) {
  if (name === "search") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>;
  if (name === "bookmark") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4Z" /></svg>;
  if (name === "calendar") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M7 3v5m10-5v5M4 10h16" /></svg>;
  if (name === "clock") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg>;
  if (name === "history") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7v5h5M5 11a8 8 0 1 0 2-5.2L4 8" /><path d="M12 8v5l3 2" /></svg>;
  if (name === "issue") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 17V9h4v8m4 0V4h4v13" /><path d="m5 8 5-4 4 2 5-4" /></svg>;
  if (name === "people") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-2.5A5.5 5.5 0 0 1 9 12h1a5.5 5.5 0 0 1 5.5 5.5V20M16 5a3 3 0 0 1 0 6m2 2a5 5 0 0 1 2.5 4.5V20" /></svg>;
  if (name === "trend") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 18 6-6 4 3 8-9" /><path d="M15 6h6v6" /></svg>;
  if (name === "database") return <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7" ry="3" /><path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>;
  if (name === "document") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" /><path d="M14 3.5v4h4M9 12h6M9 15.5h6" /></svg>;
  if (name === "workflow") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M12 7v5M6 16v-4h12v4" /></svg>;
  if (name === "review") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h8l3 3v14H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" /><path d="M14 3.5v4h4M9 12h4" /><circle cx="15.5" cy="16" r="2.5" /><path d="m17.5 18 2 2" /></svg>;
  if (name === "demand") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V12h4v7M10 19V7h4v12M15 19V4h4v15" /></svg>;
  if (name === "open") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M11 5h8v8" /><path d="M18 15v4H5V6h4" /></svg>;
  if (name === "close") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4h12l-3 4 3 4H8" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
}

function IpoHubIllustration() {
  const bars = [
    [84, 133, 16], [109, 126, 23], [134, 116, 33], [159, 122, 27],
    [184, 105, 44], [209, 94, 55], [234, 75, 74],
  ];

  return (
    <svg className={s.hubIllustration} viewBox="0 0 360 190" aria-hidden="true">
      <defs>
        <linearGradient id="ipo-report-card" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#f7fbf8" /></linearGradient>
        <linearGradient id="ipo-report-bars" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#9cd9b3" /><stop offset="1" stopColor="#e0f3e7" /></linearGradient>
      </defs>
      <g className={s.hubReportCard}>
        <rect x="34" y="15" width="254" height="156" rx="10" fill="url(#ipo-report-card)" />
        <rect x="57" y="36" width="69" height="7" rx="3.5" fill="#7bcf9c" />
        <rect x="57" y="55" width="78" height="5" rx="2.5" fill="#e4ece7" />
        <rect x="57" y="72" width="52" height="5" rx="2.5" fill="#e4ece7" />
        {bars.map(([x, y, height]) => <rect key={x} x={x} y={y} width="11" height={height} rx="2" fill="url(#ipo-report-bars)" />)}
        <path d="M70 132c16-24 24 1 38-15 15-17 24-39 39-20 16 20 27-7 41-11 14-4 22 9 34-4 13-14 20-4 36-33" fill="none" stroke="#00945b" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m252 48 7-1-1 7" fill="none" stroke="#00945b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className={s.hubDonutCard}>
        <rect x="184" y="112" width="154" height="66" rx="10" fill="#fff" />
        <circle cx="226" cy="145" r="20" fill="none" stroke="#d9eee1" strokeWidth="11" />
        <path d="M226 125a20 20 0 0 1 17 30" fill="none" stroke="#00945b" strokeWidth="11" />
        <path d="M243 155a20 20 0 0 1-27 7" fill="none" stroke="#56c48a" strokeWidth="11" />
        <rect x="264" y="130" width="44" height="5" rx="2.5" fill="#e2eae5" />
        <rect x="264" y="145" width="55" height="5" rx="2.5" fill="#e2eae5" />
        <rect x="264" y="160" width="35" height="5" rx="2.5" fill="#e2eae5" />
        <circle cx="255" cy="132.5" r="2.5" fill="#00945b" /><circle cx="255" cy="147.5" r="2.5" fill="#56c48a" /><circle cx="255" cy="162.5" r="2.5" fill="#b8dfc7" />
      </g>
    </svg>
  );
}

const IPO_WORKFLOW = [
  ["01", "Review terms", "Before opening", "review"],
  ["02", "Check demand", "Before closing", "demand"],
  ["03", "Plan listing", "Before debut", "calendar"],
];

function parseDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return { weekday: "—", day: "—", month: "—" };
  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Kolkata" }).format(date).toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: "Asia/Kolkata" }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "Asia/Kolkata" }).format(date).toUpperCase(),
  };
}

export default function IpoExperience() {
  const { ipo, sources } = useMarketData();
  const [status, setStatus] = useState("All issues");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("Calendar");

  const rows = useMemo(() => ipo.rows.filter((row) => {
    const matchesQuery = `${row.company} ${row.symbol || ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All issues" || row.status.toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesStatus;
  }), [ipo.rows, query, status]);

  const positive = ipo.rows.filter((row) => Number(row.gmpPercent) > 0).length;
  const byPremium = [...ipo.rows].sort((a, b) => (b.gmpPercent || 0) - (a.gmpPercent || 0));
  const bySize = [...ipo.rows].sort((a, b) => (b.issueSize || 0) - (a.issueSize || 0));
  const listed = ipo.rows.filter((row) => row.status.toLowerCase() === "listed");
  const calendarEvents = ipo.rows.flatMap((row) => [
    row.startDate ? { date: row.startDate, title: "Offer opens", company: row.company, copy: "Live IPO Alerts opening date", state: "Open", icon: "open" } : null,
    row.endDate ? { date: row.endDate, title: "Offer closes", company: row.company, copy: "Live IPO Alerts closing date", state: "Upcoming", icon: "close" } : null,
    row.listingDate ? { date: row.listingDate, title: "Listing day", company: row.company, copy: "Live IPO Alerts listing date", state: "Listed", icon: "calendar" } : null,
  ].filter(Boolean)).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const nextEvent = calendarEvents[0];
  const visibleEvents = calendarEvents.slice(0, 2);
  const metrics = [
    { icon: "issue", label: "Tracked issues", value: ipo.total, detail: `${sources.ipo.mode} provider state`, tone: "mint" },
    { icon: "people", label: "Positive GMP", value: positive, detail: "Unofficial interest indicator", tone: "sand" },
    { icon: "trend", label: "Highest GMP", value: ipo.highestGmp?.gmpPercent == null ? "—%" : `${ipo.highestGmp.gmpPercent.toFixed(2)}%`, detail: ipo.highestGmp?.company || "No live premium", tone: "mint" },
    { icon: "calendar", label: "Next IPO event", value: nextEvent ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(nextEvent.date)) : "—", detail: nextEvent ? `${nextEvent.company} · ${nextEvent.title}` : "No live event date", tone: "mint" },
  ];
  const hubCollections = [
    {
      title: "Tracked issues", copy: "Complete primary-market coverage", icon: "bookmark", href: "#issue-screener",
      items: ipo.rows.slice(0, 3).map((row) => ({ name: row.company, detail: row.symbol || "Unlisted issue", value: row.status.toUpperCase(), valueTone: "tag", status: row.status })),
    },
    {
      title: "Highest GMP", copy: "Unofficial premium watch", icon: "trend", href: "#issue-screener",
      items: byPremium.slice(0, 3).map((row) => ({ name: row.company, detail: money(row.gmp), value: row.gmpPercent == null ? "—" : `${row.gmpPercent.toFixed(2)}%` })),
    },
    {
      title: "Largest offers", copy: "Issue size comparison", icon: "database", href: "#issue-screener",
      items: bySize.slice(0, 3).map((row) => ({ name: row.company, detail: "", value: Number.isFinite(row.issueSize) ? `${money(row.issueSize)} Cr` : "— Cr", tag: row.status.toUpperCase(), status: row.status })),
    },
    {
      title: "Recently listed", copy: "Post-listing review queue", icon: "clock", href: "#offer-calendar",
      items: listed.slice(0, 3).map((row) => ({ name: row.company, detail: row.symbol || "NSE", value: money(row.estimatedListingPrice) })),
    },
    {
      title: "Issue documents", copy: "What to read before applying", icon: "document", href: "/insights",
      items: [
        { name: "Offer document", detail: "Business + risk", value: "RHP", valueTone: "tag" },
        { name: "Use of proceeds", detail: "Growth vs. exits", value: "TERMS", valueTone: "tag" },
        { name: "Peer comparison", detail: "Valuation context", value: "REVIEW", valueTone: "tag" },
      ],
    },
  ];

  return (
    <main className={s.page} data-ipo-reference-page data-ipo-explorer data-ready="true">
      <SiteHeader theme="ipo" />

      <section className={s.hero} data-ipo-hero>
        <div className={s.content}>
          <nav className={s.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/markets">Markets</Link><span>›</span><span>Calendars</span><span>›</span><span>IPO</span>
          </nav>
          <div className={s.heroCopy}>
            <span className={s.eyebrow}>PRIMARY MARKET · INDIA</span>
            <h1>IPO Calendar</h1>
            <p>Track issue dates, terms, demand context and listing<br className={s.desktopBreak} /> expectations without leaving the calendar.</p>
          </div>
          <div className={s.updatedBadge}><i />Updated {formatIstTime(ipo.updatedAt)} IST</div>
        </div>
      </section>

      <section className={s.workspace}>
        <div className={s.content}>
          <div className={s.tabs} role="group" aria-label="IPO view">
            {["Calendar", "Open issues", "Recently listed", "Guide"].map((item) => (
              <button type="button" aria-pressed={view === item} onClick={() => setView(item)} key={item}>{item}</button>
            ))}
          </div>

          <div className={s.toolbar}>
            <div className={s.filters} role="group" aria-label="IPO status">
              {[
                ["All issues", "issue"], ["Open", "check"], ["Upcoming", "calendar"], ["Listed", "calendar"], ["Historical", "history"],
              ].map(([item, icon]) => (
                <button type="button" data-ipo-status-filter aria-pressed={status === item} onClick={() => setStatus(item)} key={item}><Icon name={icon} />{item}</button>
              ))}
            </div>
            <div className={s.toolbarRight}>
              <label className={s.search}><Icon name="search" /><span className={s.srOnly}>Search IPOs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or symbol" /></label>
              <button className={s.trackedButton} type="button"><Icon name="bookmark" />Tracked issues <span>{ipo.total}</span></button>
            </div>
          </div>

          <section className={s.metrics} data-ipo-metrics aria-label="IPO market summary">
            {metrics.map((metric) => <article key={metric.label}>
              <span className={s.metricIcon} data-tone={metric.tone}><Icon name={metric.icon} /></span>
              <div><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small></div>
            </article>)}
          </section>

          <section className={s.calendarBoard} id="offer-calendar" data-ipo-calendar-board>
            <header>
              <div><h2>Offer calendar</h2><p>Key primary-market decision points</p></div>
              <button type="button">This month <span>⌄</span></button>
            </header>
            <div className={s.calendarLabels}><span>DATE</span><span>EVENT</span><span>WHAT TO REVIEW</span><span>STATE</span></div>
            <ol>
              {visibleEvents.map((event, index) => {
                const date = parseDate(event.date);
                return <li data-ipo-calendar-event key={`${event.company}-${event.title}-${event.date}`}>
                  <time><span>{date.weekday}</span><strong>{date.day}</strong><em>{date.month}</em></time>
                  <span className={s.timeline}><i data-state={index === 0 ? "open" : "upcoming"} /></span>
                  <span className={s.eventIcon}><Icon name={event.icon} /></span>
                  <div className={s.eventName}><strong>{event.title}</strong><span>{event.company}</span></div>
                  <div className={s.review}><strong>{event.copy.split(" ").slice(0, 3).join(" ")}</strong><span>{event.copy.split(" ").slice(3).join(" ")}</span></div>
                  <em className={s.state} data-state={event.state}>{event.state === "Listed" ? "Listed" : event.state}</em>
                </li>;
              })}
            </ol>
            {!visibleEvents.length && <p className={s.empty}>No dated IPO events are available from the live provider.</p>}
          </section>

          <section className={s.ipoDataHub} data-ipo-data-hub="true" aria-labelledby="ipo-data-hub-title">
            <header className={s.ipoDataHubHeader}>
              <div className={s.ipoDataHubIntro}>
                <span>ALL IPO MARKET DATA</span>
                <h2 id="ipo-data-hub-title">Issues, premiums, offer sizes,<br />listings and decision resources</h2>
                <Link href="/insights">Read primary-market research <span aria-hidden="true">↗</span></Link>
              </div>
              <IpoHubIllustration />
            </header>

            <div className={s.ipoDataCardGrid}>
              {hubCollections.map((collection) => {
                const items = collection.items.length ? collection.items : [{ name: "—", detail: "—", value: "—" }];
                return (
                  <article className={s.ipoDataCard} data-ipo-data-card="true" key={collection.title}>
                    <header>
                      <span className={s.ipoDataCardIcon}><Icon name={collection.icon} /></span>
                      <div><h3>{collection.title}</h3><p>{collection.copy}</p></div>
                      <Link href={collection.href} aria-label={`Open ${collection.title}`}><span aria-hidden="true">↗</span></Link>
                    </header>
                    <ol>
                      {items.map((item, index) => (
                        <li key={`${collection.title}-${item.name}-${index}`}>
                          <span className={s.ipoDataRowNumber}>{index + 1}.</span>
                          <span className={s.ipoDataRowCopy}><strong>{item.name}</strong>{item.detail ? <small>{item.detail}</small> : null}</span>
                          <span className={s.ipoDataRowEnd}><em data-tone={item.valueTone} data-status={item.status}>{item.value}</em>{item.tag ? <small data-status={item.status}>{item.tag}</small> : null}</span>
                        </li>
                      ))}
                    </ol>
                  </article>
                );
              })}
            </div>

            <section className={s.ipoWorkflow} data-ipo-workflow="true" aria-labelledby="ipo-workflow-title">
              <header>
                <span className={s.ipoWorkflowIcon}><Icon name="workflow" /></span>
                <div><h3 id="ipo-workflow-title">Investor workflow</h3><p>Decisions from open to listing</p></div>
                <Link href="#offer-calendar" aria-label="Open investor workflow"><span aria-hidden="true">↗</span></Link>
              </header>
              <ol>
                {IPO_WORKFLOW.map(([number, title, copy, icon]) => (
                  <li key={number}>
                    <span className={s.ipoWorkflowNumber}>{number}</span>
                    <span className={s.ipoWorkflowCopy}><strong>{title}</strong><small>{copy}</small></span>
                    <span className={s.ipoWorkflowStepIcon}><Icon name={icon} /></span>
                  </li>
                ))}
              </ol>
            </section>
          </section>

          <section className={s.screener} id="issue-screener">
            <div className={s.sectionHeading}><div><span>LIVE ISSUE DIRECTORY</span><h2>IPO issue screener</h2><p>{rows.length} matching issues · GMP values are unofficial</p></div></div>
            <div className={s.tableScroller}>
              <table>
                <thead><tr><th>Company</th><th>Status</th><th>Issue size</th><th>Price band</th><th>GMP</th><th>Est. listing</th></tr></thead>
                <tbody>{rows.map((row, index) => {
                  const band = row.issueLow === row.issueHigh ? money(row.issueHigh) : `${money(row.issueLow)}–${money(row.issueHigh)}`;
                  const percent = row.gmpPercent == null ? "Unavailable" : `${row.gmpPercent >= 0 ? "+" : ""}${row.gmpPercent.toFixed(2)}%`;
                  return <tr key={row.id}><td><a href={row.href} target="_blank" rel="noreferrer"><InstrumentMark symbol={row.company} tone={index} /><span><strong>{row.company}</strong><small>{row.symbol || "Unlisted issue"}</small></span></a></td><td><em>{row.status}</em></td><td>{money(row.issueSize)} Cr</td><td>{band}</td><td data-positive={row.gmpPercent >= 0}><strong>{money(row.gmp)}</strong><small>{percent}</small></td><td>{money(row.estimatedListingPrice)}</td></tr>;
                })}</tbody>
              </table>
              {!rows.length && <p className={s.empty}>No issue matches the current search and status filters.</p>}
            </div>
          </section>

          <IpoReadingGuide />

          <footer className={s.source}>Source: {sources.ipo.name} · {sources.ipo.mode}. Figures are informational and may be delayed.</footer>
        </div>
      </section>

    </main>
  );
}
