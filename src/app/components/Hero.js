"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./Hero.module.css";

const NAV = [
  ["Features", "#features"],
  ["Alerts", "/stock-alerts"],
  ["Markets", "/markets"],
  ["Pricing", "#pricing"],
  ["Testimonials", "#testimonials"],
  ["Blog", "/insights"],
  ["About", "#about"],
];

const BENEFITS = [
  ["bell", "Real-Time Alerts", "Never miss profitable opportunities"],
  ["target", "Expert Insights", "Professional analysis you can trust"],
  ["shield", "Actionable Signals", "Clear signals to help you take action"],
];

const ALERTS = [
  ["mountain", "RELIANCE", "Breakout above ₹2,950", "09:45 AM"],
  ["bars", "TCS", "Strong Volume Spike", "09:32 AM"],
  ["bolt", "INFY", "Momentum Building", "09:15 AM"],
];

const STATS = [
  ["users", "50K+", "Active Traders"],
  ["target", "98.6%", "Accuracy Rate"],
  ["clock", "24/7", "Real-Time Monitoring"],
  ["trend", "100+", "Stocks Covered"],
];

function Mark({ name, className }) {
  const common = { className, viewBox: "0 0 32 32", fill: "none", "aria-hidden": true };
  if (name === "bell") return <svg {...common}><path d="M8 23h16l-2.2-3.2V14a5.8 5.8 0 0 0-11.6 0v5.8L8 23Z"/><path d="M13.5 25.5a2.7 2.7 0 0 0 5 0"/></svg>;
  if (name === "target") return <svg {...common}><circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="3.5"/><path d="M16 3v5m0 16v5M3 16h5m16 0h5"/></svg>;
  if (name === "shield") return <svg {...common}><path d="M16 4 25 8v7c0 6.2-3.7 10.3-9 13-5.3-2.7-9-6.8-9-13V8l9-4Z"/></svg>;
  if (name === "users") return <svg {...common}><circle cx="12" cy="11" r="4"/><circle cx="22" cy="12" r="3"/><path d="M4 27v-3c0-4 3.2-7 8-7s8 3 8 7v3M20 19c4.5 0 7 2.2 7 5.5V27"/></svg>;
  if (name === "clock") return <svg {...common}><circle cx="16" cy="16" r="12"/><path d="M16 8v8h7"/></svg>;
  if (name === "trend") return <svg {...common}><path d="m4 24 8-8 5 5L28 9"/><path d="M20 9h8v8"/></svg>;
  if (name === "mountain") return <svg {...common}><path d="m7 22 8-12 9 12H7Z"/><path d="m12 18 3-3 2 2 2-2"/></svg>;
  if (name === "bars") return <svg {...common}><path d="M7 25V17m6 8V12m6 13V15m6 10V7"/><path d="m6 15 7-6 6 3 7-7"/></svg>;
  if (name === "bolt") return <svg {...common}><path d="m18 3-9 15h7l-2 11 9-16h-7l2-10Z"/></svg>;
  return null;
}

function Logo() {
  return (
    <span className={s.logoMark} aria-hidden="true">
      <svg viewBox="0 0 46 46">
        <circle cx="23" cy="23" r="23" />
        <path className={s.logoBars} d="M10 31V23h5v8m4 0V18h5v13m4 0V12h5v19m4 0V8h3v23" />
        <path className={s.logoArrow} d="m9 22 9-8 7 4 12-11m-6 0h6v6" />
      </svg>
    </span>
  );
}

function MarketBackdrop() {
  return (
    <svg className={s.marketBackdrop} viewBox="0 0 820 820" aria-hidden="true">
      <defs>
        <radialGradient id="hero-disc" cx="48%" cy="42%" r="66%">
          <stop offset="0" stopColor="#c9d5a7" />
          <stop offset=".72" stopColor="#a9ba7e" />
          <stop offset="1" stopColor="#97aa69" />
        </radialGradient>
        <radialGradient id="backdrop-ring-mask-gradient" cx="24%" cy="18%" r="84%">
          <stop offset="0" stopColor="white" />
          <stop offset=".46" stopColor="white" stopOpacity=".92" />
          <stop offset=".69" stopColor="white" stopOpacity=".18" />
          <stop offset=".84" stopColor="black" />
        </radialGradient>
        <mask id="backdrop-ring-fade">
          <rect width="820" height="820" fill="url(#backdrop-ring-mask-gradient)" />
        </mask>
      </defs>
      <g mask="url(#backdrop-ring-fade)">
        <circle data-backdrop-ring="3" className={s.backdropRing} cx="410" cy="410" r="405" />
        <circle data-backdrop-ring="2" className={s.backdropRing} cx="410" cy="410" r="360" />
        <circle data-backdrop-ring="1" className={s.backdropRing} cx="410" cy="410" r="315" />
      </g>
      <circle data-backdrop-disc="true" className={s.backdropDisc} cx="410" cy="410" r="290" />

      <g className={s.backdropCandles} data-candle-cluster="left" transform="translate(-72 0)">
        <path d="M25 520v-58M52 501v-78M79 484v-89M106 459v-91M133 438v-105M160 413v-116M187 387v-125" />
        <rect x="18" y="480" width="14" height="28" /><rect x="45" y="458" width="14" height="31" />
        <rect x="72" y="438" width="14" height="29" /><rect x="99" y="411" width="14" height="34" />
        <rect x="126" y="385" width="14" height="36" /><rect x="153" y="350" width="14" height="47" />
        <rect x="180" y="315" width="14" height="55" />
      </g>

      <g className={s.backdropCandles} data-candle-cluster="right" transform="translate(28 0)">
        <path d="M642 253V113M676 286V153M710 260V126M744 300V167M778 280V137M812 237V97" />
        <rect x="633" y="139" width="18" height="77" /><rect x="667" y="188" width="18" height="65" />
        <rect x="701" y="153" width="18" height="74" /><rect x="735" y="210" width="18" height="60" />
        <rect x="769" y="177" width="18" height="72" /><rect x="803" y="122" width="18" height="80" />
      </g>
    </svg>
  );
}

function MarketCard() {
  return (
    <div className={s.marketWrap}>
      <MarketBackdrop />
      <section className={s.marketCard} aria-label="Live Market Overview">
        <div className={s.cardTopline}><strong>Live Market Overview</strong><span>↗</span></div>
        <div className={s.marketSummary}>
          <div>
            <div className={s.indexName}>NIFTY 50 <span>▲ 1.18%</span></div>
            <strong className={s.indexValue}>22,957.25</strong>
            <small><b>+267.90 (1.18%)</b> Today</small>
          </div>
          <div className={s.chart} aria-label="NIFTY 50 intraday trend">
            <svg viewBox="0 0 250 92" role="img">
              <path className={s.gridLine} d="M0 73h250M0 44h250" />
              <path className={s.chartLine} d="M0 70 9 50l10 13 9-25 10 20 10-8 9 16 10-5 9 7 11-28 10 12 9-8 10 11 10-17 10 10 9-12 10 5 10-10 10-5 10-10 10-1" />
              <circle cx="245" cy="15" r="5" />
            </svg>
            <div><span>09:15</span><span>11:00</span><span>12:30</span><span>14:00</span><span>15:30</span></div>
          </div>
        </div>
        <div className={s.alertHeading}><strong>Recent Alerts</strong><a href="/stock-alerts">View All →</a></div>
        <div className={s.alertList}>
          {ALERTS.map(([icon, symbol, detail, time]) => (
            <div className={s.alertRow} data-market-alert="true" key={symbol}>
              <span className={s.alertIcon}><Mark name={icon} /></span>
              <span className={s.alertCopy}><strong>{symbol}</strong><small>{detail}</small></span>
              <time>{time}</time><span className={s.bullish}>Bullish</span>
            </div>
          ))}
        </div>
      </section>
      <div className={s.trustCard}>
        <Mark name="shield" className={s.trustShield} />
        <span><strong>Trusted by 50K+ Traders</strong><small>across India</small></span>
        <div className={s.avatars} aria-label="Trusted trader community">
          <i data-trader-avatar="true" aria-hidden="true" />
          <i data-trader-avatar="true" aria-hidden="true" />
          <i data-trader-avatar="true" aria-hidden="true" />
          <i>50K+</i>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className={s.hero} data-reference-hero="true">
      <header className={s.header}>
        <Link className={s.brand} href="/" aria-label="ShareMarket Alerts home">
          <Logo />
          <span>ShareMarket<em>Alerts</em></span>
        </Link>
        <nav className={s.nav} aria-label="Primary navigation">
          {NAV.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}
        </nav>
        <div className={s.headerActions}>
          <a className={s.login} href="mailto:support@sharemarketalerts.com?subject=Login">Log In</a>
          <a className={s.getStarted} href="#pricing">Get Started</a>
          <button className={s.menuButton} type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><i /><i /><i /></button>
        </div>
        {menuOpen && <nav className={s.mobileNav}>{NAV.map(([label, href]) => <Link href={href} key={label} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>}
      </header>

      <div className={s.heroBody}>
        <div className={s.copy}>
          <p className={s.eyebrow}><i /> SMARTER ALERTS. BETTER TRADES.</p>
          <h1>Real-Time Share<br />Market <span>Alerts</span><br />That Give You Edge</h1>
          <p className={s.description}>Get real-time stock alerts, expert insights, and market updates<br className={s.desktopBreak} /> designed to help you make smarter trading decisions.</p>
          <div className={s.benefits} id="features">
            {BENEFITS.map(([icon, title, body]) => (
              <div className={s.benefit} data-hero-benefit="true" key={title}>
                <span className={s.benefitIcon}><Mark name={icon} /></span>
                <span><strong>{title}</strong><small>{body}</small></span>
              </div>
            ))}
          </div>
          <div className={s.ctas}>
            <a className={s.primaryCta} href="#pricing">Start Free Trial <span>→</span></a>
            <a className={s.secondaryCta} href="#market-intelligence"><i>▶</i> Watch Demo</a>
          </div>
          <div className={s.assurances}>
            <span><i className={s.assuranceCheck}>✓</i>No Credit Card Required</span>
            <span><i className={s.assuranceCheck}>✓</i>14-Day Free Trial</span>
            <span><i className={s.assuranceCheck}>✓</i>Cancel Anytime</span>
          </div>
        </div>
        <MarketCard />
      </div>

      <div className={s.stats}>
        {STATS.map(([icon, value, label]) => (
          <div className={s.stat} data-hero-stat="true" key={label}>
            <Mark name={icon} /><span><strong>{value}</strong><small>{label}</small></span>
          </div>
        ))}
      </div>
    </section>
  );
}
