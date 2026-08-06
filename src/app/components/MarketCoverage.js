"use client";

import Image from "next/image";
import FinancialChart from "./FinancialChart";
import { useMarketData } from "./MarketDataProvider";
import styles from "./MarketCoverage.module.css";

const statistics = [
  {
    icon: "globe",
    value: "150+",
    label: "Exchanges",
    detail: "Across 6 continents",
  },
  {
    icon: "bars",
    value: "120K+",
    label: "Instruments",
    detail: "Stocks, ETFs, futures & more",
  },
  {
    icon: "scan",
    value: "24/7",
    label: "Market Scanning",
    detail: "Real-time • Non-stop",
  },
  {
    icon: "shield",
    value: "99.9%",
    label: "Uptime",
    detail: "Reliable. Always on.",
  },
];

const marketCards = [
  {
    className: "nse",
    symbol: "^NSEI",
    icon: "india",
    label: "NSE",
    detail: "India",
    change: "+0.86%",
    points: "2,24 12,19 20,21 28,12 37,16 47,8 55,12 64,4 70,9",
  },
  {
    className: "nasdaq",
    symbol: "^IXIC",
    icon: "usa",
    label: "NASDAQ",
    detail: "United States",
    change: "+1.32%",
    points: "2,25 11,20 19,21 28,14 37,17 47,9 57,12 67,4 72,7",
  },
  {
    className: "bse",
    symbol: "^BSESN",
    icon: "india",
    label: "BSE",
    detail: "India",
    change: "+0.74%",
    points: "2,22 11,18 20,20 29,12 38,15 47,8 56,11 65,5 72,8",
  },
  {
    className: "forex",
    symbol: "INR=X",
    icon: "globe",
    label: "FOREX",
    detail: "Global",
    change: "+0.41%",
    points: "2,24 12,21 20,22 29,15 38,17 47,11 56,14 65,7 72,10",
  },
  {
    className: "commodities",
    symbol: "GC=F",
    icon: "commodity",
    label: "COMMODITIES",
    detail: "Global",
    change: "+0.59%",
    points: "2,23 11,17 20,19 29,12 38,15 47,8 56,11 65,4 72,8",
  },
  {
    className: "globalMarkets",
    symbol: "^GSPC",
    icon: "globe",
    label: "GLOBAL MARKETS",
    detail: "Worldwide",
    change: "+0.67%",
    points: "2,24 11,19 20,20 29,13 38,16 47,9 56,12 65,5 72,8",
  },
];

const coverageRows = [
  { icon: "bars", label: "Indices", detail: "Global benchmarks", href: "https://finance.yahoo.com/markets/world-indices/" },
  { icon: "candles", label: "Stocks", detail: "Large, mid & small caps", href: "https://finance.yahoo.com/markets/stocks/" },
  { icon: "leaves", label: "Sectors", detail: "Sector-wise opportunities", href: "https://finance.yahoo.com/sectors/" },
  {
    icon: "commodity",
    label: "Commodities",
    detail: "Metals, energy & agri",
    href: "https://finance.yahoo.com/markets/commodities/",
  },
  { icon: "currency", label: "Forex", detail: "Major currency pairs", href: "https://finance.yahoo.com/markets/currencies/" },
  {
    icon: "globe",
    label: "Global Markets",
    detail: "Worldwide exchanges",
    href: "https://finance.yahoo.com/markets/world-indices/",
  },
];

const summaryItems = [
  { icon: "bars", label: "Indices", value: "50,000+", detail: "Global indices" },
  {
    icon: "candles",
    label: "Stocks",
    value: "100,000+",
    detail: "Stocks tracked",
  },
  { icon: "sectors", label: "Sectors", value: "24+", detail: "Major sectors" },
  {
    icon: "drop",
    label: "Commodities",
    value: "100+",
    detail: "Commodities",
  },
  { icon: "currency", label: "Forex", value: "180+", detail: "Currency pairs" },
  {
    icon: "globe",
    label: "Global Markets",
    value: "70+",
    detail: "Countries covered",
  },
];

function Icon({ name }) {
  const common = {
    className: styles.lineIcon,
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false",
  };

  switch (name) {
    case "bars":
      return (
        <svg {...common}>
          <path d="M4 27V18h5v9H4Zm9 0V10h5v17h-5Zm9 0V4h5v23h-5Z" />
          <path d="M3 28.5h26" />
        </svg>
      );
    case "candles":
      return (
        <svg {...common}>
          <path d="M7 3v26M16 2v28M25 5v22" />
          <rect x="4" y="9" width="6" height="12" rx="1" />
          <rect x="13" y="6" width="6" height="16" rx="1" />
          <rect x="22" y="11" width="6" height="10" rx="1" />
        </svg>
      );
    case "sectors":
      return (
        <svg {...common}>
          <path d="M16 3a13 13 0 1 0 13 13H16V3Z" />
          <path d="M20 3.7A13 13 0 0 1 28.3 12H20V3.7Z" />
          <circle cx="16" cy="16" r="2.5" />
        </svg>
      );
    case "leaves":
      return (
        <svg {...common}>
          <path d="M15.5 26c-1-7.8 1.4-14 7.4-18.8 1 7.6-1.4 13.8-7.4 18.8Z" />
          <path d="M14.8 21.8C8.3 20.9 4.5 17.1 3.4 10.5c6.5.9 10.3 4.7 11.4 11.3Z" />
          <path d="M8 13.7c3 2.1 5.4 5.2 7.3 9.2M21.4 11.2c-2.9 3.7-4.8 7.7-5.8 12" />
        </svg>
      );
    case "scan":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="11" />
          <circle cx="16" cy="16" r="6.2" />
          <circle cx="16" cy="16" r="2.2" />
          <path d="M16 2v4M30 16h-4M27 5l-3 3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M16 3.2 26 7v7.6c0 6.4-3.9 11.5-10 14.2-6.1-2.7-10-7.8-10-14.2V7l10-3.8Z" />
          <path d="m11 16 3.2 3.2L21.5 12" />
        </svg>
      );
    case "commodity":
      return (
        <svg {...common}>
          <path d="M4 22h11l-2.5 6h-11L4 22Zm14 0h11l-2.5 6h-11l2.5-6Z" />
          <path d="M10 10h12l3 9H7l3-9Z" />
          <path d="M13 4h6l2 6H11l2-6Z" />
        </svg>
      );
    case "drop":
      return (
        <svg {...common}>
          <path d="M16 3S7 14 7 20a9 9 0 0 0 18 0c0-6-9-17-9-17Z" />
          <path d="M11.5 21.5c.6 2.2 2.1 3.5 4.5 3.9" />
        </svg>
      );
    case "currency":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="13" />
          <path d="M19.8 10.5c-.8-1-2-1.5-3.8-1.5-2.6 0-4.3 1.3-4.3 3.3 0 4.7 8.6 2 8.6 6.7 0 2.3-1.8 3.8-4.6 3.8-2 0-3.6-.7-4.6-2M16 6.5v19" />
        </svg>
      );
    case "globe":
    default:
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12.5" />
          <path d="M3.8 16h24.4M16 3.5c4 3.7 6.1 7.8 6.1 12.5S20 24.8 16 28.5M16 3.5C12 7.2 9.9 11.3 9.9 16S12 24.8 16 28.5M6.2 9.6h19.6M6.2 22.4h19.6" />
        </svg>
      );
  }
}

function MarketEmblem({ name }) {
  if (name === "india") {
    return (
      <span className={styles.flagIndia} aria-hidden="true">
        <i />
      </span>
    );
  }

  if (name === "usa") {
    return (
      <span className={styles.flagUsa} aria-hidden="true">
        <i />
      </span>
    );
  }

  return (
    <span
      className={
        name === "commodity"
          ? `${styles.cardLineIcon} ${styles.commodityEmblem}`
          : styles.cardLineIcon
      }
    >
      <Icon name={name} />
    </span>
  );
}

function Sparkline({ points, label, tone = "positive" }) {
  return (
    <FinancialChart
      className={styles.sparkline}
      points={points}
      width={74}
      height={30}
      tone={tone}
      label={`${label} market trend`}
      marker
    />
  );
}

function Statistic({ item }) {
  return (
    <article className={styles.statistic}>
      <span className={styles.statIcon}>
        <Icon name={item.icon} />
      </span>
      <div>
        <strong>{item.value}</strong>
        <b>{item.label}</b>
        <span>{item.detail}</span>
      </div>
    </article>
  );
}

function MarketCard({ card, quote }) {
  const change = quote?.formattedChange || card.change;
  const tone = quote?.direction === "down" ? "negative" : "positive";
  const href = quote?.href || `https://finance.yahoo.com/quote/${encodeURIComponent(card.symbol)}/`;
  return (
    <li className={`${styles.marketCard} ${styles[card.className]}`}>
      <a className={styles.marketCardLink} href={href} target="_blank" rel="noreferrer" aria-label={`View ${card.label} on Yahoo Finance`} />
      <MarketEmblem name={card.icon} />
      <div className={styles.marketIdentity}>
        <strong>{card.label}</strong>
        <span>{card.detail}</span>
      </div>
      <div className={styles.marketTrend}>
        <Sparkline points={card.points} label={card.label} tone={tone} />
        <b className={tone === "negative" ? styles.negativeChange : undefined}>{change}</b>
      </div>
    </li>
  );
}

function CoverageRow({ item }) {
  return (
    <li className={styles.coverageRow}>
      <a className={styles.coverageLink} href={item.href} target="_blank" rel="noreferrer">
        <span className={styles.coverageIcon}>
          <Icon name={item.icon} />
        </span>
        <span className={styles.coverageText}>
          <strong>{item.label}</strong>
          <small>{item.detail}</small>
        </span>
        <svg
          className={styles.chevron}
          viewBox="0 0 12 20"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m3 3 6 7-6 7" />
        </svg>
      </a>
    </li>
  );
}

function SummaryItem({ item }) {
  return (
    <li className={styles.summaryItem}>
      <span className={styles.summaryIcon}>
        <Icon name={item.icon} />
      </span>
      <div>
        <b>{item.label}</b>
        <strong>{item.value}</strong>
        <span>{item.detail}</span>
      </div>
    </li>
  );
}

function CoverageGlobe() {
  return (
    <svg
      className={styles.globe}
      viewBox="0 0 720 390"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="mc-sphere" cx="48%" cy="39%" r="62%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".98" />
          <stop offset=".56" stopColor="#f1e8ff" stopOpacity=".96" />
          <stop offset="1" stopColor="#d7c2ff" stopOpacity=".9" />
        </radialGradient>
        <radialGradient id="mc-core" cx="50%" cy="46%" r="54%">
          <stop offset="0" stopColor="#8f4cf4" stopOpacity=".3" />
          <stop offset=".7" stopColor="#7f25f0" stopOpacity=".11" />
          <stop offset="1" stopColor="#8a2df5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mc-orbit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c5a2ff" stopOpacity=".05" />
          <stop offset=".48" stopColor="#8c32f5" stopOpacity=".22" />
          <stop offset="1" stopColor="#c7a3ff" stopOpacity=".08" />
        </linearGradient>
        <pattern id="mc-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r=".76" fill="#9561ed" opacity=".36" />
        </pattern>
        <pattern id="mc-land-dots" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1.25" cy="1.25" r="1.05" fill="#6f35e4" opacity=".88" />
        </pattern>
        <clipPath id="mc-sphere-clip">
          <circle cx="360" cy="192" r="170" />
        </clipPath>
        <filter id="mc-blur-18" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="mc-blur-8" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <ellipse
        cx="360"
        cy="366"
        rx="135"
        ry="23"
        fill="#781cf0"
        opacity=".28"
        filter="url(#mc-blur-18)"
      />
      <ellipse
        cx="360"
        cy="195"
        rx="338"
        ry="105"
        fill="none"
        stroke="url(#mc-orbit)"
        strokeWidth="1.1"
        transform="rotate(-5 360 195)"
      />
      <ellipse
        cx="360"
        cy="195"
        rx="303"
        ry="145"
        fill="none"
        stroke="url(#mc-orbit)"
        strokeWidth=".8"
        transform="rotate(12 360 195)"
      />
      <ellipse
        cx="360"
        cy="195"
        rx="245"
        ry="177"
        fill="none"
        stroke="url(#mc-orbit)"
        strokeWidth=".7"
        transform="rotate(-14 360 195)"
      />

      <circle
        cx="360"
        cy="192"
        r="188"
        fill="#8b28f5"
        opacity=".09"
        filter="url(#mc-blur-8)"
      />
      <circle cx="360" cy="192" r="170" fill="url(#mc-sphere)" />
      <circle cx="360" cy="192" r="170" fill="url(#mc-core)" />

      <g clipPath="url(#mc-sphere-clip)">
        <rect x="190" y="22" width="340" height="340" fill="url(#mc-dots)" />
        <g
          fill="none"
          stroke="#a875f4"
          strokeWidth=".7"
          opacity=".23"
        >
          <ellipse cx="360" cy="192" rx="168" ry="45" />
          <ellipse cx="360" cy="192" rx="168" ry="88" />
          <ellipse cx="360" cy="192" rx="168" ry="129" />
          <ellipse cx="360" cy="192" rx="53" ry="168" />
          <ellipse cx="360" cy="192" rx="102" ry="168" />
          <ellipse cx="360" cy="192" rx="144" ry="168" />
        </g>

        <g
          fill="url(#mc-land-dots)"
          transform="translate(360 192) scale(1.07) translate(-360 -192)"
        >
          <path d="M270 81 286 68l17 5 10 12 22 6 12 13-4 17-19 4-9 16-23-2-15-13-18-8-9-18 20-19Z" />
          <path d="M333 102 349 90l22 2 13 13 18-1 8 12-11 9-17-3-11 9-17-3-8-14-13-12Z" />
          <path d="m335 133 26-9 30 9 13 25-5 31-14 24-11 35-17 24-17-7-6-32-14-25 1-33 14-42Z" />
          <path d="M386 82 410 68l35 3 21 12 25 3 18 15-6 16-22 4-13 15-22-4-14 12-25-4-9-17-23-10 11-31Z" />
          <path d="M427 137 449 127l23 9 10 18-8 16-19 4-8 22-16-3-9-21 5-35Z" />
          <path d="m465 180 18 14 3 30-12 24-15-9 3-24-9-21 12-14Z" />
          <path d="m491 250 16-3 13 11-7 14-20 4-12-12 10-14Z" />
          <path d="m306 253 15 13 5 27-10 22-13-13 1-24-10-14 12-11Z" />
        </g>

        <path
          d="M250 109c67-42 165-49 244-7M229 246c70 59 183 72 270 12"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          opacity=".28"
        />
      </g>

      <circle
        cx="360"
        cy="192"
        r="170"
        fill="none"
        stroke="#b884ff"
        strokeWidth="1.1"
        opacity=".42"
      />
      <g fill="#8b18f4">
        <circle cx="53" cy="120" r="4" />
        <circle cx="667" cy="120" r="4" />
        <circle cx="70" cy="211" r="3.4" />
        <circle cx="651" cy="211" r="3.4" />
        <circle cx="86" cy="309" r="3.2" />
        <circle cx="632" cy="309" r="3.2" />
      </g>
      <g fill="#fff" stroke="#a349fa" strokeWidth="1.4">
        <circle cx="53" cy="120" r="1.7" />
        <circle cx="667" cy="120" r="1.7" />
        <circle cx="70" cy="211" r="1.4" />
        <circle cx="651" cy="211" r="1.4" />
        <circle cx="86" cy="309" r="1.3" />
        <circle cx="632" cy="309" r="1.3" />
      </g>
    </svg>
  );
}

export default function MarketCoverage() {
  const marketData = useMarketData();
  const coverageQuotes = new Map(
    (marketData.market.coverage || []).map((quote) => [quote.symbol, quote]),
  );

  return (
    <section
      id="market-coverage"
      className={styles.section}
      data-section="market-coverage"
      aria-labelledby="market-coverage-title"
    >
      <div className={styles.canvas}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>MARKET COVERAGE</p>
          <h2 id="market-coverage-title">
            Every market. One{" "}
            <span className={styles.titleAccent}>intelligence.</span>
          </h2>
          <p className={styles.intro}>
            Comprehensive coverage across indices, stocks, sectors, commodities,
            forex and global markets.
            <br />
            {" "}
            We scan millions of signals 24/7 so you never miss an opportunity.
          </p>
        </header>

        <aside className={styles.statistics} aria-label="Market coverage statistics">
          {statistics.map((item) => (
            <Statistic key={item.label} item={item} />
          ))}
        </aside>

        <div className={styles.globeStage} aria-hidden="true">
          <Image
            src="/images/market-coverage-globe-reference.png"
            alt=""
            width={1318}
            height={1193}
            className={styles.globeReference}
            aria-hidden="true"
            unoptimized
          />
          <CoverageGlobe />
        </div>

        <ul className={styles.marketCards} aria-label="Covered market examples">
          {marketCards.map((card) => (
            <MarketCard key={card.label} card={card} quote={coverageQuotes.get(card.symbol)} />
          ))}
        </ul>

        <aside
          className={styles.coverageCard}
          aria-labelledby="coverage-list-title"
        >
          <h3 id="coverage-list-title">What we cover</h3>
          <ul>
            {coverageRows.map((item) => (
              <CoverageRow key={item.label} item={item} />
            ))}
          </ul>
        </aside>

        <ul className={styles.summaryStrip} aria-label="Coverage totals">
          {summaryItems.map((item) => (
            <SummaryItem key={item.label} item={item} />
          ))}
        </ul>

        <p className={styles.footerStatement}>
          <span className={styles.footerShield}>
            <Icon name="shield" />
          </span>
          One platform. <em>Every market.</em> Endless opportunities.
        </p>
      </div>
    </section>
  );
}
