"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatIndianRevenue } from "../../lib/market-formatters";
import { useMarketData } from "../MarketDataProvider";
import s from "./MarketCalendarDashboard.module.css";

function formatEstimate(value, prefix = "₹") {
  return Number.isFinite(Number(value)) ? `${prefix}${Number(value).toFixed(2)}` : "—";
}

function impactFor(entry) {
  const low = Number(entry.earningsLow);
  const high = Number(entry.earningsHigh);
  if (!Number.isFinite(low) || !Number.isFinite(high)) return "Low";
  const spread = Math.abs(high - low) / Math.max(Math.abs(Number(entry.earningsAverage)) || 1, 1);
  return spread >= 0.15 ? "High" : spread >= 0.05 ? "Medium" : "Low";
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2" /><path d="M8 3.5v4M16 3.5v4M4 9.5h16M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01" /></svg>;
}

function Chevron({ direction = "right" }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" data-direction={direction}><path d="m7.5 4.5 5 5.5-5 5.5" /></svg>;
}

function SlidersIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14M9 5v4M15 10v4M11 15v4" /></svg>;
}

function InfoIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M10 9v4M10 6.5h.01" /></svg>;
}

function IndiaFlag() {
  return <span className={s.indiaFlag} aria-label="India"><i /><i><b /></i><i /></span>;
}

function ImpactDots({ impact }) {
  const count = impact === "High" ? 3 : impact === "Medium" ? 2 : 1;
  return <span className={s.impactDots} data-impact={impact.toLowerCase()} aria-label={`${impact} impact`}>{Array.from({ length: count }, (_, index) => <i key={index} />)}</span>;
}

function EventRow({ entry, expanded, onToggle }) {
  return (
    <article className={s.eventRow} role="row">
      <time className={s.timeCell}><strong>{entry.time}</strong><span>IST</span></time>
      <div className={s.eventCell} role="cell"><IndiaFlag /><span><strong>{entry.event}</strong><small>{entry.period}</small></span></div>
      <div className={s.impactCell} role="cell"><ImpactDots impact={entry.impact} /><span>{entry.impact}</span></div>
      <div className={s.eventValues}>
        <span className={s.actualValue} data-label="EPS estimate">{entry.eps}</span>
        <span data-label="EPS range">{entry.range}</span>
        <span data-label="Revenue estimate">{entry.revenue}</span>
      </div>
      <button className={s.expandButton} type="button" aria-label={`${expanded ? "Hide" : "Show"} details for ${entry.event}`} aria-expanded={expanded} onClick={onToggle}><Chevron direction={expanded ? "up" : "down"} /></button>
      {expanded ? <p className={s.eventDetail}>Yahoo Finance estimates can be revised as analyst coverage changes.</p> : null}
    </article>
  );
}

export default function MarketCalendarDashboard({ ariaLabel = "Market calendar" }) {
  const { market } = useMarketData();
  const [selectedDay, setSelectedDay] = useState(0);
  const [highOnly, setHighOnly] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState("");
  const calendar = useMemo(() => {
    const events = (market.earnings || [])
      .filter((entry) => !Number.isNaN(Date.parse(entry.date)))
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    const dateKeys = [...new Set(events.map((entry) => new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(entry.date))))].slice(0, 7);
    const days = dateKeys.map((dateKey) => {
      const event = events.find((entry) => new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(entry.date)) === dateKey);
      const date = new Date(event.date);
      return {
        key: dateKey,
        weekday: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Kolkata" }).format(date),
        day: new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: "Asia/Kolkata" }).format(date),
        month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "Asia/Kolkata" }).format(date),
      };
    });
    return { events, days };
  }, [market.earnings]);
  const activeDay = calendar.days[Math.min(selectedDay, Math.max(calendar.days.length - 1, 0))];
  const groups = useMemo(() => {
    if (!activeDay) return [];
    const events = calendar.events.flatMap((entry) => {
      const date = new Date(entry.date);
      const dateKey = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
      if (dateKey !== activeDay.key) return [];
      const impact = impactFor(entry);
      if (highOnly && impact !== "High") return [];
      const low = formatEstimate(entry.earningsLow);
      const high = formatEstimate(entry.earningsHigh);
      return [{
        time: new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(date),
        event: `${entry.symbol.replace(/\.NS$/i, "")} earnings`,
        period: entry.estimated ? "Estimated date" : "Confirmed date",
        impact,
        eps: formatEstimate(entry.earningsAverage),
        range: low === "—" && high === "—" ? "—" : `${low} – ${high}`,
        revenue: formatIndianRevenue(entry.revenueAverage),
      }];
    });
    return events.length ? [{ label: `${activeDay.weekday}, ${activeDay.day} ${activeDay.month}`, events }] : [];
  }, [activeDay, calendar.events, highOnly]);

  const moveDay = (direction) => setSelectedDay((current) => Math.max(0, Math.min(calendar.days.length - 1, current + direction)));

  return (
    <section className={s.calendarSection} aria-label={ariaLabel} data-market-calendar>
      <div className={s.calendarShell}>
        <header className={s.calendarHeader}>
          <div className={s.titleGroup}>
            <span className={s.titleIcon}><CalendarIcon /></span>
            <div><h2>Market <span>Calendar</span></h2><p>Live earnings dates and analyst estimates <br />from the market data feed.</p></div>
          </div>
          <div className={s.headerActions}>
            <div className={s.calendarControls}>
              <label><span className={s.srOnly}>Market country</span><IndiaFlag /><select defaultValue="India"><option>India</option></select><Chevron direction="down" /></label>
              <label className={s.timezoneControl}><span className={s.clockMark} aria-hidden="true">◷</span><span className={s.srOnly}>Timezone</span><select defaultValue="IST (UTC +5:30)"><option>IST (UTC +5:30)</option></select><Chevron direction="down" /></label>
              <button className={s.filterButton} type="button" aria-label={highOnly ? "Show all impact levels" : "Show high-impact events only"} aria-pressed={highOnly} onClick={() => setHighOnly((active) => !active)}><SlidersIcon /></button>
            </div>
            <div className={s.impactLegend} aria-label="Impact legend"><span><i data-impact="high" />High Impact</span><span><i data-impact="medium" />Medium Impact</span><span><i data-impact="low" />Low Impact</span></div>
          </div>
        </header>

        <div className={s.weekPanel}>
          <button className={s.weekArrow} type="button" aria-label="Previous calendar day" disabled={selectedDay === 0} onClick={() => moveDay(-1)}><Chevron direction="left" /></button>
          <div className={s.dayStrip} role="group" aria-label="Calendar week">
            {calendar.days.map((item, index) => <button type="button" key={item.key} aria-pressed={selectedDay === index} onClick={() => setSelectedDay(index)}><span>{item.weekday}</span><strong>{item.day}</strong><small>{item.month}</small>{selectedDay === index ? <i /> : null}</button>)}
            {!calendar.days.length ? <p>Upcoming earnings calendar unavailable</p> : null}
          </div>
          <button className={s.weekArrow} type="button" aria-label="Next calendar day" disabled={!calendar.days.length || selectedDay === calendar.days.length - 1} onClick={() => moveDay(1)}><Chevron direction="right" /></button>
          <Link className={s.fullCalendarLink} href="/insights"><CalendarIcon />View Full Calendar</Link>
        </div>

        <div className={s.calendarTable} role="table" aria-label="Indian economic events">
          <div className={s.tableHeader} role="row"><span>Time</span><span>Event</span><span>Impact</span><span className={s.valuesHeader}><i>EPS Est.</i><i>EPS Range</i><i>Revenue Est.</i></span></div>
          {groups.map((group) => <div className={s.eventGroup} role="rowgroup" key={group.label}>
            <h3><CalendarIcon />{group.label}</h3>
            {group.events.map((entry) => {
              const key = `${group.label}-${entry.event}`;
              return <EventRow key={key} entry={entry} expanded={expandedEvent === key} onToggle={() => setExpandedEvent((current) => current === key ? "" : key)} />;
          })}
          {!groups.length ? <p className={s.eventDetail}>No matching live earnings events for this selection.</p> : null}
          </div>)}
        </div>

        <footer className={s.calendarFooter}>
          <div><InfoIcon /><p>All times are in Indian Standard Time (IST)<span>Dates and estimates are supplied by Yahoo Finance and may change.</span></p></div>
          <Link href="/insights">View Full Economic Calendar <span>→</span></Link>
        </footer>
      </div>
    </section>
  );
}
