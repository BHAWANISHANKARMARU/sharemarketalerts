"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./Hero.module.css";
import MobileHero from "./MobileHero";
import { useMarketData } from "./MarketDataProvider";
import {
  ArrowRight,
  BoltIcon,
  BoltSolid,
  ClipboardCheck,
  DialIcon,
  LogoMark,
  PlayGlyph,
  ScanIcon,
  ShieldCheck,
  SignalIcon,
  StackIcon,
  Star,
  TrendGlyph,
  UsersIcon,
} from "./icons";
import { NAV_ITEMS } from "./siteNavigation";

const STATS = [
  ["24/7", "AI Scanning"],
  ["1.2M+", "Signals/Day"],
  ["87%", "Accuracy"],
  ["< 1s", "Delivery Speed"],
];

const MOVER_COLORS = [
  ["#1c1b18", "#e8b23a"],
  ["#1a70c8", "#e0453c"],
  ["#123a6e", "#e0453c"],
  ["#c9ccd4", "#25457a"],
  ["#f0f1f4", "#d0342c"],
];

const FEED = [
  {
    sym: "TATASTEEL",
    type: "Breakout",
    time: "2s ago",
    level: "High",
    a: "#1d2330",
    b: "#2f9e63",
  },
  {
    sym: "NIFTY 26 JUN 24600 CE",
    type: "Breakout",
    time: "5s ago",
    level: "High",
    signal: true,
    stacked: true,
  },
  {
    sym: "BEL",
    type: "Momentum",
    time: "8s ago",
    level: "Medium",
    a: "#e8e9ee",
    b: "#1f7a4d",
  },
];

const FEATURES = [
  { Icon: ScanIcon, title: "AI Real-Time Scanning", body: ["Markets never sleep.", "Neither do we."], halo: true },
  { Icon: BoltIcon, title: "Instant Alerts", body: ["Signals delivered in", "under 1 second."] },
  { Icon: ShieldCheck, title: "High Accuracy", body: ["Backtested. Validated.", "Proven to perform."] },
  { Icon: StackIcon, title: "Data You Can Trust", body: ["Clean, deep and", "continuously updated."] },
];

const TRUST = [
  { Icon: UsersIcon, value: "250K+", label: "Active Traders" },
  { Icon: ClipboardCheck, value: "25M+", label: "Signals Delivered" },
  { Icon: DialIcon, value: "87%", label: "Average Accuracy" },
  { Icon: BoltSolid, value: "<1 Sec", label: "Alert Delivery" },
];

/* Partner row — plain wordmarks with generic marks, not the partners'
   trademarked logos. */
const PARTNERS = [
  { name: "ZERODHA", mark: "flag" },
  { name: "upstox", mark: "dash" },
  { name: "Groww", mark: "disc" },
  { name: "AngelOne", mark: "peak" },
  { name: "aliceblue", mark: null },
];

function PartnerMark({ kind, className }) {
  if (!kind) return null;
  if (kind === "dash")
    return (
      <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
        <rect x="1" y="8" width="9" height="2.2" rx="1.1" fill="currentColor" />
      </svg>
    );
  if (kind === "disc")
    return (
      <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="8" fill="#6b7597" />
        <path d="M1.6 10.6c2.6-3.4 5.2-3.4 7.4-.6s4.8 2.4 7.4-1" stroke="#eef0f6" strokeWidth="1.8" fill="none" />
      </svg>
    );
  if (kind === "peak")
    return (
      <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
        <path d="M9 2 15.5 16h-3.2L9 7.6 5.7 16H2.5L9 2Z" fill="currentColor" />
      </svg>
    );
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 2h7l5 6.5V16H3V2Z" fill="currentColor" />
    </svg>
  );
}

/* Tiny circular ticker avatars — monograms, not third-party marks. */
function Avatar({ a, b, sym }) {
  return (
    <span className={s.avatar} style={{ background: a, color: b }}>
      {sym.charAt(0)}
    </span>
  );
}

export default function Hero() {
  const marketData = useMarketData();
  const [moverTab, setMoverTab] = useState("Gainers");
  const ticker = marketData.market.ticker;
  const moverPool =
    moverTab === "Gainers"
      ? marketData.market.gainers
      : moverTab === "Breakouts"
        ? [...marketData.market.gainers, ...marketData.market.losers]
            .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
            .slice(0, 5)
        : [...marketData.market.gainers, ...marketData.market.losers]
            .sort((a, b) => (b.volume || 0) - (a.volume || 0))
            .slice(0, 5);
  const movers = moverPool.map((mover, index) => ({
    ...mover,
    sym: mover.displaySymbol,
    px: mover.formattedValue,
    chg: mover.formattedChange,
    a: MOVER_COLORS[index][0],
    b: MOVER_COLORS[index][1],
  }));
  const featuredSignal = marketData.market.opportunities[0];

  return (
    <>
      <div className={s.root}>
      {/* ── Top nav ─────────────────────────────────────────── */}
      <header className={s.nav}>
        <Link className={s.brand} href="/">
          <LogoMark className={s.brandMark} />
          <span className={s.brandWord}>SHAREMARKETALERTS</span>
        </Link>

        <nav className={s.navLinks}>
          {NAV_ITEMS.map(({ label, href }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className={s.navRight}>
          <a className={s.login} href="mailto:support@sharemarketalerts.com?subject=ShareMarketAlerts%20login%20access">
            Log in
          </a>
          <a className={s.btnDark} href="#pricing">
            Start Free Trial <ArrowRight className={s.btnArrow} />
          </a>
        </div>
      </header>

      {/* ── Market pulse ticker ─────────────────────────────── */}
      <div className={s.ticker}>
        <span className={s.livePill}>
          <BoltSolid className={s.liveBolt} />
          LIVE
        </span>
        <span className={s.tickerHead}>GLOBAL MARKET PULSE</span>

        <div className={s.tickerItems}>
          {ticker.map((t, i) => (
            <span key={t.symbol} className={s.tickerItem}>
              <b>{t.label}</b>
              <em>{t.formattedValue}</em>
              <i className={t.direction === "down" ? s.down : s.up}>{t.formattedChange}</i>
              {i < ticker.length - 1 && <span className={s.tickerDot} />}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stage ───────────────────────────────────────────── */}
      <div className={s.stage}>
        {/* artwork band: supplied render, clipped to the reference silhouette */}
        <div className={s.bandGlow} aria-hidden="true" />
        <div className={s.bandRim} aria-hidden="true" />
        <div className={s.band} aria-hidden="true" />

        {/* copy on the band */}
        <div className={s.scanNote}>
          <span className={s.scanLabel}>GLOBAL SCAN</span>
          <span>
            Scanning <b>75+</b> markets
          </span>
          <span>
            <b>143,382</b> signals processed
          </span>
          <span>in the last 60 seconds</span>
        </div>

        <div className={s.momentum}>
          <span className={s.momentumHead}>
            <TrendGlyph className={s.momentumGlyph} />
            MARKET MOMENTUM
          </span>
          <span className={s.bullish}>{marketData.market.momentumLabel}</span>
          <span className={s.momentumPct}>{marketData.market.momentumScore === null ? "—" : `${marketData.market.momentumScore}%`}</span>
          <span className={s.momentumSub}>Momentum Score</span>
        </div>

        {/* market status */}
        <div className={s.marketStatus}>
          <span className={s.statusDot} />
          {marketData.market.statusLabel}
        </div>

        {/* left copy column */}
        <div className={s.copy}>
          <p className={s.eyebrow}>AI-POWERED MARKET INTELLIGENCE</p>
          <h1 className={s.headline}>
            Intelligence
            <br />
            that <i className={s.hlAccent}>moves</i> <i>first</i>
            <span className={s.hlDot}>.</span>
          </h1>
          <p className={s.sub}>
            Real-time AI scans uncover high-probability opportunities before the
            crowd sees them.
          </p>
          <div className={s.ctas}>
            <a className={s.btnDark} href="#pricing">
              Start Free Trial <ArrowRight className={s.btnArrow} />
            </a>
            <a className={s.btnGhost} href="#market-intelligence">
              <span className={s.playRing}>
                <PlayGlyph className={s.playGlyph} />
              </span>
              See It In Action
            </a>
          </div>
        </div>

        {/* ── floating cards ─────────────────────────────────── */}
        <div className={`${s.card} ${s.cardBreakout}`}>
          <a className={s.rowLink} href={featuredSignal.href} target="_blank" rel="noreferrer" aria-label={`View ${featuredSignal.name} on Yahoo Finance`} />
          <div className={s.breakoutHead}>
            <span className={s.signalBadge}>
              <SignalIcon className={s.signalIcon} />
            </span>
            <span>
              <span className={s.cardKicker}>BREAKOUT SIGNAL</span>
              <span className={s.breakoutName}>{featuredSignal.name}</span>
            </span>
          </div>
          <div className={s.breakoutPrice}>
            <span className={s.breakoutValue}>{featuredSignal.entry}</span>
            <span className={s.breakoutChg}>{featuredSignal.change}</span>
          </div>
          <div className={s.strengthRow}>
            <span className={s.strengthLabel}>Strength</span>
            <span className={s.strengthPct}>{featuredSignal.confidence}</span>
          </div>
          <div className={s.bar}>
            <span style={{ width: featuredSignal.confidence }} />
          </div>
          <div className={s.breakoutFoot}>
            Live <span className={s.footDot} /> High Probability
          </div>
        </div>

        <div className={`${s.card} ${s.cardStats}`}>
          {STATS.map(([v, l]) => (
            <div key={l} className={s.statCell}>
              <span className={s.statValue}>{v}</span>
              <span className={s.statLabel}>{l}</span>
            </div>
          ))}
        </div>

        <div className={`${s.card} ${s.cardMovers}`}>
          <span className={s.cardTitle}>TOP MOVERS</span>
          <div className={s.tabs} role="tablist" aria-label="Top mover category">
            {["Gainers", "Breakouts", "Volume"].map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={moverTab === tab}
                className={moverTab === tab ? s.tabOn : undefined}
                onClick={() => setMoverTab(tab)}
                key={tab}
              >
                {tab}
              </button>
            ))}
          </div>
          <ul className={s.moverList}>
            {movers.map((m) => (
              <li key={m.sym}>
                <a className={s.rowLink} href={m.href} target="_blank" rel="noreferrer" aria-label={`View ${m.sym} on Yahoo Finance`} />
                <Avatar a={m.a} b={m.b} sym={m.sym} />
                <span className={s.moverSym}>{m.sym}</span>
                <span className={s.moverPx}>{m.px}</span>
                <span className={s.moverChg}>{m.chg}</span>
              </li>
            ))}
          </ul>
          <a className={s.cardLink} href="https://finance.yahoo.com/markets/stocks/gainers/" target="_blank" rel="noreferrer">
            View all movers <ArrowRight className={s.linkArrow} />
          </a>
        </div>

        <div className={`${s.card} ${s.cardFeed}`}>
          <div className={s.feedHead}>
            <SignalIcon className={s.feedHeadIcon} />
            <span className={s.cardKicker}>LIVE SIGNAL FEED</span>
          </div>
          <ul className={s.feedList}>
            {FEED.map((f) => (
              <li key={f.sym}>
                {f.signal ? (
                  <span className={`${s.avatar} ${s.avatarSignal}`}>
                    <SignalIcon className={s.avatarSignalIcon} />
                  </span>
                ) : (
                  <Avatar a={f.a} b={f.b} sym={f.sym} />
                )}
                <span className={s.feedName}>
                  {f.sym}
                  {f.stacked && <em className={s.feedSubType}>{f.type}</em>}
                </span>
                <span className={s.feedType}>{!f.stacked && f.type}</span>
                <span className={s.feedTime}>{f.time}</span>
                <span
                  className={
                    f.level === "High" ? s.pillHigh : s.pillMedium
                  }
                >
                  {f.level}
                </span>
              </li>
            ))}
          </ul>
          <a className={s.cardLink} href="#market-intelligence">
            View full live feed <ArrowRight className={s.linkArrow} />
          </a>
        </div>

        <div className={`${s.card} ${s.cardRisk}`}>
          <span className={s.cardTitle}>RISK LEVEL</span>
          <div className={s.gauge}>
            <svg viewBox="0 0 200 108" aria-hidden="true">
              <defs>
                <linearGradient id="riskArc" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3f1fe0" />
                  <stop offset="60%" stopColor="#7357f0" />
                  <stop offset="100%" stopColor="#8f7bf5" />
                </linearGradient>
              </defs>
              <path
                d="M18 100a82 82 0 0 1 164 0"
                fill="none"
                stroke="#e6e2fb"
                strokeWidth="22"
                strokeLinecap="round"
              />
              <path
                d="M18 100a82 82 0 0 1 164 0"
                fill="none"
                stroke="url(#riskArc)"
                strokeWidth="22"
                strokeLinecap="round"
                strokeDasharray="258"
                strokeDashoffset="72"
              />
            </svg>
            <span className={s.gaugeValue}>LOW</span>
            <span className={s.gaugeSub}>Well Balanced</span>
          </div>
          <div className={s.riskFoot}>
            <span>Volatility Normal</span>
            <span className={s.riskDivider} />
            <span>Risk Score 28/100</span>
          </div>
        </div>

        {/* ── feature strip ──────────────────────────────────── */}
        <div className={s.features}>
          {FEATURES.map(({ Icon, title, body, halo }) => (
            <div key={title} className={s.feature}>
              <span className={halo ? s.featIconHalo : s.featIcon}>
                <Icon className={s.featSvg} />
              </span>
              <span>
                <span className={s.featTitle}>{title}</span>
                {body.map((line) => (
                  <span key={line} className={s.featLine}>
                    {line}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust strip ─────────────────────────────────────── */}
      <div className={s.trust}>
        <div className={s.trustLeft}>
          <span className={`${s.trustKicker} ${s.trustKickerWide}`}>
            TRUSTED BY TRADERS ACROSS THE GLOBE
          </span>
          <div className={s.trustRow}>
            {TRUST.map(({ Icon, value, label }) => (
              <div key={label} className={s.trustItem}>
                <Icon className={s.trustIcon} />
                <span>
                  <span className={s.trustValue}>{value}</span>
                  <span className={s.trustLabel}>{label}</span>
                </span>
              </div>
            ))}
            <div className={`${s.trustItem} ${s.trustRating}`}>
              <span>
                <span className={s.stars}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className={s.star} />
                  ))}
                </span>
                <span className={s.trustValue}>4.9/5</span>
                <span className={s.trustLabel}>User Rating</span>
              </span>
            </div>
          </div>
        </div>

        <div className={s.trustRight}>
          <span className={s.trustKicker}>DATA &amp; TECHNOLOGY PARTNERS</span>
          <div className={s.partners}>
            {PARTNERS.map((p) => (
              <span key={p.name} className={s.partner}>
                <PartnerMark kind={p.mark} className={s.partnerGlyph} />
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
      <MobileHero />
    </>
  );
}
