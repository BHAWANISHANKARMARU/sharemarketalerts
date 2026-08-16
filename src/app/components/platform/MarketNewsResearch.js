"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InstrumentMark } from "./WorkspacePrimitives";
import s from "./MarketReferenceSections.module.css";

const TABS = ["All Briefs", "Markets", "Sectors", "Equities", "Global"];
const INDEX_SYMBOLS = ["^NSEI", "^BSESN", "^NSEBANK", "^INDIAVIX"];
const BRIEF_IMAGES = [
  "/images/market-news-bse-green.png",
  "/images/market-news-chart-green.png",
  "/images/market-news-rbi.png",
  "/images/market-news-handshake-green.png",
];

function NewsIcon({ name = "news" }) {
  const paths = {
    news: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M8 8h8M8 12h5M8 16h7M3 7v11a2 2 0 0 0 2 2" /></>,
    chart: <><path d="M5 18V9m5 9V5m5 13v-7m4 7V3" /></>,
    pie: <><path d="M11 3v9h9A9 9 0 1 1 11 3Z" /><path d="M14 3.5A8 8 0 0 1 20.5 10H14Z" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" /></>,
    bulb: <><path d="M9 18h6m-5 3h4M8.5 15.5A7 7 0 1 1 15.5 15.5c-.8.7-1.2 1.4-1.3 2.5h-4.4c-.1-1.1-.5-1.8-1.3-2.5Z" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function quoteFor(market, symbol, label) {
  const quote = [...(market?.indices || []), ...(market?.coverage || [])].find((item) => item.symbol === symbol);
  return quote || { symbol, label, formattedValue: "—", formattedChange: "—", direction: "flat" };
}

function updateTime(value) {
  const time = Date.parse(value || "");
  if (!Number.isFinite(time)) return "Update unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(time));
}

function movementWord(quote) {
  return quote.direction === "down" ? "lower" : quote.direction === "up" ? "higher" : "unchanged";
}

export default function MarketNewsResearch({ market, ariaLabel = "Market news and research" }) {
  const [activeTab, setActiveTab] = useState("All Briefs");
  const quotes = [
    quoteFor(market, "^NSEI", "NIFTY 50"),
    quoteFor(market, "^BSESN", "SENSEX"),
    quoteFor(market, "^NSEBANK", "BANK NIFTY"),
    quoteFor(market, "^INDIAVIX", "INDIA VIX"),
  ];
  const sectors = [...(market?.sectors || [])].sort((a, b) => Number(b.changePercent) - Number(a.changePercent));
  const strongestSector = sectors[0];
  const weakestSector = sectors.at(-1);
  const topGainer = market?.gainers?.[0];
  const topLoser = market?.losers?.[0];
  const nifty = quotes[0];
  const bitcoin = quoteFor(market, "BTC-USD", "BITCOIN USD");
  const briefs = [
    {
      image: BRIEF_IMAGES[0], category: "Markets", updatedAt: nifty.updatedAt,
      title: `NIFTY 50 is ${movementWord(nifty)} at ${nifty.formattedValue}`,
      copy: `The benchmark is ${nifty.formattedChange} for the current Yahoo Finance session snapshot.`,
      href: nifty.href || "/live-markets",
    },
    strongestSector ? {
      image: BRIEF_IMAGES[1], category: "Sectors", updatedAt: strongestSector.updatedAt,
      title: `${strongestSector.label} leads tracked sectors`,
      copy: `${strongestSector.label} is ${strongestSector.formattedChange} while ${weakestSector?.label || "the weakest tracked group"} is ${weakestSector?.formattedChange || "unavailable"}.`,
      href: "#sector-heatmap",
    } : null,
    topGainer ? {
      image: BRIEF_IMAGES[2], category: "Equities", updatedAt: topGainer.updatedAt,
      title: `${topGainer.displaySymbol} leads the tracked equity movers`,
      copy: `${topGainer.name} is ${topGainer.formattedChange}; ${topLoser?.displaySymbol || "the leading decliner"} is ${topLoser?.formattedChange || "unavailable"}.`,
      href: topGainer.href || "/live-markets",
    } : null,
    {
      image: BRIEF_IMAGES[3], category: "Global", updatedAt: bitcoin.updatedAt,
      title: `Bitcoin is ${movementWord(bitcoin)} at ${bitcoin.formattedValue}`,
      copy: `The live BTC-USD snapshot is ${bitcoin.formattedChange}. Global exchange delays vary by instrument.`,
      href: bitcoin.href || "/live-markets",
    },
  ].filter(Boolean);
  const visibleBriefs = activeTab === "All Briefs" ? briefs : briefs.filter((brief) => brief.category === activeTab);
  const insights = [
    ["chart", "Benchmark", "NIFTY session", `${nifty.formattedValue} · ${nifty.formattedChange}`, nifty.updatedAt, "purple", nifty.href],
    ["pie", "Sector breadth", "Leadership spread", strongestSector ? `${strongestSector.label} ${strongestSector.formattedChange}` : "Unavailable", strongestSector?.updatedAt, "green", "#sector-heatmap"],
    ["search", "Equity mover", "Top tracked gainer", topGainer ? `${topGainer.displaySymbol} ${topGainer.formattedChange}` : "Unavailable", topGainer?.updatedAt, "orange", topGainer?.href],
    ["bulb", "Risk context", "India VIX", `${quotes[3].formattedValue} · ${quotes[3].formattedChange}`, quotes[3].updatedAt, "blue", quotes[3].href],
  ];

  return (
    <section className={s.newsSection} aria-label={ariaLabel} data-market-news-research>
      <header className={s.newsTitlebar}>
        <div className={s.referenceTitle}>
          <span className={s.referenceIcon}><NewsIcon /></span>
          <div><h2>Live Market <em>Briefs</em></h2><p>Session context generated only from<br />the current market data feed.</p></div>
        </div>
        <div className={s.newsQuoteRail}>
          {quotes.map((quote, index) => (
            <Link href="/live-markets" key={quote.label || quote.symbol}>
              <InstrumentMark symbol={quote.symbol || INDEX_SYMBOLS[index]} logoUrl={quote.logoUrl} tone={index} />
              <div><small>{quote.label || ["NIFTY 50", "SENSEX", "BANK NIFTY", "INDIA VIX"][index]}</small><strong>{quote.formattedValue}</strong><b data-direction={quote.direction}>{quote.direction === "down" ? "▼" : "▲"} {quote.formattedChange}</b></div>
            </Link>
          ))}
          <Link href="/live-markets" className={s.quoteNext} aria-label="Open live market quotes">›</Link>
        </div>
      </header>

      <nav className={s.newsTabs} aria-label="Brief categories">
        <div>{TABS.map((tab) => <button type="button" aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}><span aria-hidden="true">{tab === "All Briefs" ? "▣" : "◌"}</span>{tab}</button>)}</div>
        <Link href="/live-markets" className={s.customiseButton}><span>☷</span> Live screener</Link>
      </nav>

      <div className={s.newsWorkspace}>
        <article className={s.topNewsPanel}>
          <header><h3>Latest Market Briefs</h3><Link href="/live-markets">Open live market <span>→</span></Link></header>
          <div className={s.newsList}>
            {visibleBriefs.map(({ image, category, updatedAt, title, copy, href }) => (
              <article key={title} data-live="true">
                <a className={s.newsImage} href={href}><Image src={image} alt="" fill sizes="(max-width: 760px) 100vw, 240px" /></a>
                <div>
                  <header><span>{category}</span><i>•</i><time>{updateTime(updatedAt)}</time></header>
                  <h4>{title}</h4><p>{copy}</p>
                  <footer><span>Yahoo Finance</span><a href={href}>Open source <span>→</span></a></footer>
                </div>
              </article>
            ))}
          </div>
          {!visibleBriefs.length ? <p className={s.loadNews}>No live briefs match this filter.</p> : null}
          <Link className={s.loadNews} href="/live-markets">Open complete live feed <span>→</span></Link>
        </article>

        <aside className={s.researchPanel}>
          <header><h3>Live Session Insights</h3><Link href="/live-markets">View all quotes <span>→</span></Link></header>
          <div>
            {insights.map(([icon, label, title, copy, updatedAt, tone, href]) => (
              <article data-tone={tone} key={title}>
                <span><NewsIcon name={icon} /></span>
                <div><small>{label}</small><h4>{title}</h4><p>{copy}</p><footer><a href={href || "/live-markets"}>Open live view</a><time>{updateTime(updatedAt)}</time></footer></div>
              </article>
            ))}
          </div>
          <Link className={s.researchInbox} href="/stock-alerts">▣ &nbsp; Create alerts from live conditions <span>→</span></Link>
        </aside>
      </div>
    </section>
  );
}
