"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Footer.module.css";
import FinancialChart from "./FinancialChart";
import { LogoMark } from "./icons";

const NAV_GROUPS = [
  {
    title: "Platform",
    links: [
      ["Market Intelligence", "#market-intelligence"],
      ["AI Signals", "#how-it-works"],
      ["How It Works", "#how-it-works"],
      ["Pricing", "#pricing"],
    ],
  },
  {
    title: "Markets",
    links: [
      ["IPO GMP Tracker", "#ipo-gmp-tracker"],
      ["Stocks", "#market-coverage"],
      ["Indices", "#market-coverage"],
      ["Global Markets", "#market-coverage"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Performance", "#testimonials"],
      ["Trader Stories", "#testimonials"],
      ["Market Coverage", "#market-coverage"],
      ["Support", "mailto:support@sharemarketalerts.com"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#footer-about"],
      ["Contact", "mailto:support@sharemarketalerts.com"],
      ["Privacy", "#privacy-policy"],
      ["Terms", "#terms-of-use"],
    ],
  },
];

const TRUST_ITEMS = [
  ["scan", "Real-time scanning", "Markets monitored continuously"],
  ["shield", "Risk-aware intelligence", "Every signal is calibrated"],
  ["signal", "Built for clarity", "Actionable levels, not noise"],
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
    </svg>
  );
}

function TrustIcon({ name }) {
  const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: "false",
  };

  if (name === "scan") {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
        <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...iconProps}>
        <path d="M12 2.5 20 6v5.3c0 5.2-3.2 8.4-8 10.2-4.8-1.8-8-5-8-10.2V6l8-3.5Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M3 13h3l2-5 4 10 3-8 2 3h4" />
    </svg>
  );
}

function MarketPulse() {
  const nodes = [
    [553, 52],
    [724, 35],
    [980, 23],
    [1320, 14],
  ];

  return (
    <FinancialChart
      className={styles.marketPulse}
      points="0,92 82,91 126,88 164,95 210,86 254,89 294,80 338,87 382,75 422,81 466,68 510,76 553,52 596,67 640,49 681,59 724,35 765,51 808,32 850,48 894,26 936,41 980,23 1022,37 1065,18 1108,34 1150,20 1192,31 1234,17 1278,27 1320,14 1380,23"
      width={1380}
      height={120}
      tone="brand"
      label="ShareMarketAlerts market pulse"
      area
      marker
      tooltip={false}
    />
  );
}

export default function Footer() {
  const [status, setStatus] = useState("");

  function handleAlertsSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const email = new FormData(form).get("email");
    setStatus("Opening your market-alert request…");
    window.location.href = `mailto:alerts@sharemarketalerts.com?subject=${encodeURIComponent("Subscribe me to ShareMarketAlerts")}&body=${encodeURIComponent(`Please subscribe ${email} to market alerts and IPO updates.`)}`;
  }

  return (
    <footer
      id="site-footer"
      data-section="site-footer"
      className={styles.footer}
      aria-labelledby="site-footer-title"
    >
      <div className={styles.gridBackdrop} aria-hidden="true" />
      <MarketPulse />

      <div className={styles.inner}>
        <div className={styles.marketRail} aria-label="Live market coverage">
          <p className={styles.liveStatus}>
            <i aria-hidden="true" />
            <span>MARKETS SCANNING 24/7</span>
          </p>
          {["150+ exchanges", "120K+ instruments", "Signals updated in real time"].map(
            (item) => (
              <p key={item} data-footer-stat="true">
                {item}
              </p>
            ),
          )}
        </div>

        <div className={styles.commandPanel}>
            <section id="footer-about" className={styles.brandBlock}>
            <Link className={styles.brand} href="/" aria-label="ShareMarketAlerts home">
              <LogoMark className={styles.brandMark} />
              <span>SHAREMARKETALERTS</span>
            </Link>
            <h2 id="site-footer-title">
              See the <em>signal.</em>
              <span>Move before the market.</span>
            </h2>
            <p>
              AI-powered market intelligence, IPO GMP clarity, and risk-aware
              alerts—built for confident decisions.
            </p>
          </section>

          <nav className={styles.navigation} aria-label="Footer navigation">
            {NAV_GROUPS.map((group) => (
              <section key={group.title} data-footer-nav-group={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      {href ? (
                        <a href={href}>
                          {label}
                          <ArrowIcon />
                        </a>
                      ) : (
                        <span aria-disabled="true">{label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <section className={styles.signup} aria-labelledby="footer-signup-title">
            <p className={styles.signupEyebrow}>MARKET ALERTS</p>
            <h3 id="footer-signup-title">The market won’t wait.</h3>
            <p>
              Get high-conviction alerts and IPO updates delivered before the
              crowd moves.
            </p>
                <form className={styles.emailControl} onSubmit={handleAlertsSubmit}>
              <label htmlFor="footer-alert-email">Email address</label>
              <input
                    id="footer-alert-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                  />
                  <button type="submit">
                Get Market Alerts
                <ArrowIcon />
                  </button>
                  <span className={styles.srOnly} role="status" aria-live="polite">{status}</span>
                </form>
            <small>No spam. Unsubscribe anytime.</small>
          </section>
        </div>

        <ul className={styles.trustStrip} aria-label="Platform trust signals">
          {TRUST_ITEMS.map(([icon, title, copy]) => (
            <li key={title} data-footer-trust={title}>
              <span className={styles.trustIcon}>
                <TrustIcon name={icon} />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
            </li>
          ))}
        </ul>

            <p id="risk-disclosure" className={styles.disclaimer}>
          Market data and alerts are provided for informational purposes only and
          do not constitute investment advice. Trading and investing involve risk.
        </p>

        <div className={styles.legalRow}>
          <p>© 2026 ShareMarketAlerts. All rights reserved.</p>
              <p className={styles.legalLinks}>
                <a id="privacy-policy" href="mailto:support@sharemarketalerts.com?subject=Privacy%20Policy">Privacy Policy</a>
                <a id="terms-of-use" href="mailto:support@sharemarketalerts.com?subject=Terms%20of%20Use">Terms of Use</a>
                <a href="#risk-disclosure">Risk Disclosure</a>
          </p>
          <p>Made for traders who move with conviction.</p>
        </div>
      </div>
    </footer>
  );
}
