"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import momentumImage from "../../../public/images/mobile-market-momentum-green.png";
import { useMarketData } from "./MarketDataProvider";
import { NAV_ITEMS } from "./siteNavigation";
import {
  ArrowRight,
  BoltIcon,
  LogoMark,
  PlayGlyph,
  ScanIcon,
  ShieldCheck,
  SignalIcon,
} from "./icons";
import s from "./MobileHero.module.css";

const MOBILE_COLORS = [
  ["#1c1b18", "#e8b23a"],
  ["#1a70c8", "#e0453c"],
  ["#123a6e", "#e0453c"],
];

const MOBILE_FEATURES = [
  {
    title: "AI Real-Time Scanning",
    body: "Never miss a move.",
    Icon: ScanIcon,
  },
  {
    title: "Instant Alerts",
    body: "Delivered in real-time.",
    Icon: BoltIcon,
  },
  {
    title: "High Accuracy",
    body: "Backtested & proven.",
    Icon: ShieldCheck,
  },
];

function MoverAvatar({ symbol, colors }) {
  return (
    <span
      className={s.moverAvatar}
      style={{ background: colors[0], color: colors[1] }}
      aria-hidden="true"
    >
      {symbol.charAt(0)}
    </span>
  );
}

function RiskGauge() {
  return (
    <svg className={s.riskGauge} viewBox="0 0 90 52" aria-hidden="true">
      <path
        d="M8 46a37 37 0 0 1 74 0"
        fill="none"
        stroke="#dcefe6"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M8 46a37 37 0 0 1 74 0"
        fill="none"
        stroke="#007a55"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="116"
        strokeDashoffset="76"
      />
    </svg>
  );
}

export default function MobileHero() {
  const marketData = useMarketData();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileTicker = marketData.market.ticker.slice(0, 3);
  const mobileMovers = marketData.market.gainers.slice(0, 3).map((mover, index) => ({
    symbol: mover.displaySymbol,
    price: mover.formattedValue,
    change: mover.formattedChange,
    href: mover.href,
    colors: MOBILE_COLORS[index],
  }));
  const featuredSignal = marketData.market.opportunities[0];

  return (
    <section
      className={s.mobileRoot}
      data-mobile-hero="true"
      aria-labelledby="mobile-hero-title"
    >
      <div className={s.canvas} data-mobile-canvas="true">
        <div className={s.screen}>

            <header className={s.mobileNav}>
              <Link className={s.brand} href="/" aria-label="ShareMarketAlerts home">
                <LogoMark className={s.brandMark} />
                <span>SHAREMARKETALERTS</span>
              </Link>
              <a className={s.freeTrial} href="#pricing">
                Free Trial
              </a>
              <button
                className={s.menu}
                type="button"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            </header>

            {menuOpen && (
              <nav id="mobile-navigation" className={s.mobileMenu} aria-label="Mobile navigation">
                {NAV_ITEMS.map(({ label, href }) => (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                ))}
              </nav>
            )}

            <div className={s.mobileTicker} aria-label="Market Pulse">
              <span className={s.liveDot} aria-hidden="true" />
              <strong>LIVE</strong>
              <span className={s.pulseLabel}>Market Pulse</span>
              <div className={s.tickerTrack}>
                {mobileTicker.map((ticker) => (
                  <span className={s.tickerCell} key={ticker.symbol}>
                    <b>{ticker.label}</b>
                    <span>
                      {ticker.formattedValue} <em>{ticker.formattedChange}</em>
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className={s.heroCopy}>
              <p className={s.eyebrow}>AI-POWERED MARKET INTELLIGENCE</p>
              <h1 id="mobile-hero-title" className={s.headline}>
                Intelligence
                <br />
                that <em>moves</em> <i>first</i><span>.</span>
              </h1>
              <p className={s.description}>
                Real-time AI scans uncover high-probability opportunities before the
                crowd sees them.
              </p>
              <div className={s.ctas}>
                <a className={s.primaryCta} href="#pricing">
                  Start Free Trial <ArrowRight className={s.ctaArrow} />
                </a>
                <a className={s.secondaryCta} href="#market-intelligence">
                  <span className={s.playCircle}>
                    <PlayGlyph className={s.playIcon} />
                  </span>
                  See It In Action
                </a>
              </div>
            </div>

            <article
              className={`${s.mobileCard} ${s.momentumCard}`}
              data-mobile-card="momentum"
            >
              <Image
                src={momentumImage}
                alt=""
                fill
                sizes="(max-width: 900px) 430px, 1px"
                className={s.momentumImage}
                preload
              />
              <div className={s.momentumCopy}>
                <strong>Market Momentum</strong>
                <span className={s.bullish}>{marketData.market.momentumLabel}</span>
                <b>{marketData.market.momentumScore === null ? "—" : `${marketData.market.momentumScore}%`}</b>
                <span className={s.momentumLabel}>
                  Momentum Score <i aria-hidden="true">i</i>
                </span>
              </div>
            </article>

            <article
              className={`${s.mobileCard} ${s.breakoutCard}`}
              data-mobile-card="breakout"
            >
              <a className={s.mobileRowLink} href={featuredSignal.href} target="_blank" rel="noreferrer" aria-label={`View ${featuredSignal.name} on Yahoo Finance`} />
              <span className={s.cardIcon}>
                <SignalIcon />
              </span>
              <div className={s.breakoutIdentity}>
                <span>Breakout Signal</span>
                <strong>{featuredSignal.name}</strong>
                <div>
                  <b>{featuredSignal.entry}</b>
                  <em>{featuredSignal.change}</em>
                </div>
              </div>
              <span className={s.probabilityPill}>High Probability</span>
              <div className={s.strength}>
                <span>
                  Strength <b>{featuredSignal.confidence}</b>
                </span>
                <i><span style={{ width: featuredSignal.confidence }} /></i>
              </div>
            </article>

            <article
              className={`${s.mobileCard} ${s.moversCard}`}
              data-mobile-card="movers"
            >
              <span className={`${s.cardIcon} ${s.trendIcon}`} aria-hidden="true">
                ↗
              </span>
              <strong className={s.moversTitle}>Top Movers</strong>
              <span className={s.moversChevron} aria-hidden="true">›</span>
              <ul className={s.moverList}>
                {mobileMovers.map((mover) => (
                  <li key={mover.symbol}>
                    <a className={s.mobileRowLink} href={mover.href} target="_blank" rel="noreferrer" aria-label={`View ${mover.symbol} on Yahoo Finance`} />
                    <MoverAvatar symbol={mover.symbol} colors={mover.colors} />
                    <strong>{mover.symbol}</strong>
                    <span>{mover.price}</span>
                    <em>{mover.change}</em>
                  </li>
                ))}
              </ul>
            </article>

            <article
              className={`${s.mobileCard} ${s.riskCard}`}
              data-mobile-card="risk"
            >
              <span className={s.cardIcon}>
                <ShieldCheck />
              </span>
              <div className={s.riskCopy}>
                <strong>Risk Level</strong>
                <b>LOW</b>
                <span>Well Balanced</span>
              </div>
              <div className={s.riskMeter}>
                <RiskGauge />
                <strong>28<small>/100</small></strong>
                <span>Risk Score</span>
              </div>
            </article>

            <div className={s.mobileFeatures}>
              {MOBILE_FEATURES.map(({ title, body, Icon }) => (
                <div className={s.mobileFeature} data-mobile-feature="true" key={title}>
                  <Icon className={s.featureIcon} />
                  <strong>{title}</strong>
                  <span>{body}</span>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
