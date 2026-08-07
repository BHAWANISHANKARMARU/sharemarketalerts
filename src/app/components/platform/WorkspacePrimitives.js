"use client";

import Link from "next/link";
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

export function InstrumentMark({ symbol, tone = 0 }) {
  return <span className={s.instrumentMark} data-tone={tone % 6}>{symbol?.slice(0, 1) || "M"}</span>;
}

export function formatIstTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
