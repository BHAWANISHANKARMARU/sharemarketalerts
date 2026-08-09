"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { instrumentLogoUrl, normalizeInstrumentSymbol } from "../../lib/instrument-logos.js";
import s from "./TradingWorkspace.module.css";

export function WorkspaceBreadcrumbs({ items }) {
  return (
    <nav className={s.breadcrumbs} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 && <i aria-hidden="true">/</i>}
        </span>
      ))}
    </nav>
  );
}

export function WorkspaceTabs({ items, active, onChange, label = "Workspace views" }) {
  return (
    <div className={s.workspaceTabs} role="group" aria-label={label}>
      {items.map((item) => (
        <button
          type="button"
          aria-pressed={active === item}
          onClick={() => onChange?.(item)}
          key={item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function FilterRail({ children, label }) {
  return <div className={s.filterRail} role="group" aria-label={label}>{children}</div>;
}

export function FilterChip({ active = false, children, onClick }) {
  return (
    <button type="button" className={s.filterChip} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

export function PanelHeading({ title, subtitle, action }) {
  return (
    <header className={s.panelHeading}>
      <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      {action}
    </header>
  );
}

export function ChangeValue({ value, direction = "up", className = "" }) {
  return (
    <span className={`${direction === "down" ? s.changeDown : s.changeUp} ${className}`.trim()}>
      <span aria-hidden="true">{direction === "down" ? "▼" : "▲"}</span>
      {value}
    </span>
  );
}

function instrumentIconKind(symbol) {
  const value = String(symbol || "").toUpperCase().replace(/\.NS$|\.BO$/g, "");

  if (/TCS|INFY|WIPRO|TECH|SOFTWARE|DIGITAL|AI/.test(value)) return "technology";
  if (/TATAMOTORS|AUTO|MOTOR|TRANSPORT|MOBILITY/.test(value)) return "automotive";
  if (/RELIANCE|BPCL|ENERGY|OIL|GAS|POWER/.test(value)) return "energy";
  if (/HDFC|ICICI|BANK|FINANCE|CAPITAL/.test(value)) return "banking";
  if (/TITAN|CONSUMER|RETAIL|FMCG/.test(value)) return "consumer";
  if (/JSW|STEEL|METAL|MINERAL|INDUSTR/.test(value)) return "industry";
  if (/NIFTY|SENSEX|INDEX|MARKET|NASDAQ|DAX|S&P/.test(value)) return "index";
  return "market";
}

function InstrumentGlyph({ kind }) {
  if (kind === "technology") return <><rect x="4" y="5" width="16" height="12" rx="2" /><path d="m9 9-2 2 2 2m6-4 2 2-2 2M9 20h6" /></>;
  if (kind === "automotive") return <><path d="m5 13 1.6-5h10.8l1.6 5M4 13h16v5H4z" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></>;
  if (kind === "energy") return <path d="M13.7 2.8c.6 4-2.9 5.2-2.1 8.1.5 1.7 2.1 2.1 3.1 1.1.8-.8.7-2.2.1-3.1 2.9 1.7 4.2 4 3.5 6.8-.8 3.3-3.5 5.5-6.7 5.5-3.8 0-6.8-2.8-6.8-6.7 0-4.4 3.2-8.3 8.9-11.7Z" />;
  if (kind === "banking") return <><path d="M3 9h18L12 4 3 9Zm2 9h14M6 10v6m4-6v6m4-6v6m4-6v6" /></>;
  if (kind === "consumer") return <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>;
  if (kind === "industry") return <><path d="M4 20V10l5 3V9l5 3V5l3 2v13H4Z" /><path d="M8 17h2m3 0h2" /></>;
  if (kind === "index") return <><path d="M4 19V9m5 10V5m5 14v-7m5 7V3" /><path d="m4 12 5-4 5 2 5-5" /></>;
  return <><path d="M3 12h4l2.5-5 4 10 2.5-5h5" /><circle cx="12" cy="12" r="9" /></>;
}

export function InstrumentMark({ symbol, tone = 0, logoUrl = null, className = "" }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const normalizedSymbol = normalizeInstrumentSymbol(symbol) || "MARKET";
  const kind = instrumentIconKind(normalizedSymbol);
  const resolvedLogoUrl = instrumentLogoUrl(symbol) || logoUrl;
  const hasBrandLogo = Boolean(resolvedLogoUrl && !logoFailed);

  return (
    <span
      className={`${s.instrumentMark} ${className}`.trim()}
      data-instrument-symbol={normalizedSymbol}
      data-instrument-kind={kind}
      data-instrument-logo={hasBrandLogo ? "brand" : "fallback"}
      data-tone={tone % 6}
      aria-hidden="true"
    >
      {hasBrandLogo ? (
        <Image
          className={s.instrumentLogo}
          src={resolvedLogoUrl}
          alt=""
          width={28}
          height={28}
          unoptimized
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <svg viewBox="0 0 24 24"><InstrumentGlyph kind={kind} /></svg>
      )}
    </span>
  );
}

export function formatIstTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
