"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../SiteHeader";
import {
  FilterChip,
  FilterRail,
  InstrumentMark,
  PanelHeading,
  WorkspaceBreadcrumbs,
  WorkspaceTabs,
} from "./WorkspacePrimitives";
import s from "./TradingWorkspace.module.css";

const STORIES = [
  { category: "Market structure", state: "Long", title: "Breadth is improving beneath a quiet headline index", copy: "Participation has widened across financials, autos and industrials while index volatility remains contained.", author: "Research Desk", time: "6 min", symbol: "NIFTY" },
  { category: "Sector note", state: "Long", title: "Private banks regain relative strength", copy: "Price confirmation is improving, but the next leg still needs cleaner volume expansion.", author: "Aarav Mehta", time: "4 min", symbol: "BANK" },
  { category: "Risk desk", state: "Risk", title: "Where small-cap momentum becomes fragile", copy: "Separate durable trend continuation from liquidity-led excess with three observable checks.", author: "Risk Desk", time: "7 min", symbol: "SMALL" },
  { category: "Explainer", state: "Neutral", title: "What a falling VIX actually confirms", copy: "Lower implied volatility matters only when read beside realised movement and participation.", author: "Research Desk", time: "5 min", symbol: "VIX" },
  { category: "Primary market", state: "Neutral", title: "Read IPO demand by category, not headline bids", copy: "Institutional demand, retail enthusiasm and grey-market pricing answer different questions.", author: "IPO Desk", time: "5 min", symbol: "IPO" },
  { category: "Macro", state: "Risk", title: "The week’s inflation print changes the rate narrative", copy: "Map the release to banks, duration-sensitive sectors and the currency before the event.", author: "Macro Desk", time: "8 min", symbol: "CPI" },
];

const NEWS_DESK = [
  ["Indian stocks", "Banks and autos carry a broader session advance", "Market breadth"],
  ["Macro", "Inflation print becomes the week’s main positioning event", "Week ahead"],
  ["Technology", "IT leadership improves as global risk appetite steadies", "Sector pulse"],
  ["Primary market", "Issue quality separates from headline subscription demand", "IPO desk"],
  ["Risk", "Volatility stays contained while small-cap dispersion widens", "Risk monitor"],
];

const LEARNING_PATHS = [
  ["01", "Reading market breadth", "Understand how participation confirms—or contradicts—the index."],
  ["02", "Building a price alert", "Turn a thesis into a condition, confirmation rule and delivery path."],
  ["03", "Comparing IPO demand", "Separate issue terms, bidder categories, GMP and listing expectations."],
  ["04", "Using a stock screener", "Move from a broad universe to a ranked, reviewable opportunity queue."],
];

export default function InsightsExperience() {
  const [category, setCategory] = useState("All ideas");
  const [tab, setTab] = useState("Research ideas");
  const filtered = useMemo(() => STORIES.filter((story) => category === "All ideas" || story.category === category), [category]);
  const feature = filtered[0] || STORIES[0];

  return (
    <main className={[s.workspacePage, s.insightsWorkspace].join(" ")} data-insights-hub>
      <SiteHeader />
      <div className={s.canvas}>
        <WorkspaceBreadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: "India" }, { label: "Research" }]} />
        <section className={s.compactIntro}>
          <div><span>ORIGINAL MARKET RESEARCH</span><h1>Research ideas</h1><p>Decision-ready notes connecting price, participation and catalyst—ranked by consequence, not engagement.</p></div>
          <Link className={s.outlineButton} href="/markets">Open market overview ↗</Link>
        </section>
        <WorkspaceTabs items={["Research ideas", "Market themes", "Week ahead", "Explainers"]} active={tab} onChange={setTab} label="Research view" />

        <section className={s.insightsToolbar}>
          <FilterRail label="Research topics">{["All ideas", "Market structure", "Sector note", "Risk desk", "Explainer", "Primary market", "Macro"].map((item) => <FilterChip active={category === item} onClick={() => setCategory(item)} key={item}>{item}</FilterChip>)}</FilterRail>
          <button className={s.outlineButton} type="button">Newest first⌄</button>
        </section>

        <section className={s.featureResearch}>
          <div className={s.featureChart}>
            <div className={s.researchGrid} aria-hidden="true" />
            <span>PARTICIPATION INDEX</span>
            <strong>72</strong>
            <small>/100</small>
            <i />
          </div>
          <article>
            <div><span>FEATURED · {feature.category.toUpperCase()}</span><em data-state={feature.state}>{feature.state}</em></div>
            <h2>{feature.title}</h2>
            <p>{feature.copy}</p>
            <ul><li>What changed: participation expanded beyond index leaders.</li><li>Confirmation: volume breadth remains above its 20-day mean.</li><li>Invalidation: breadth falls while the headline index holds.</li></ul>
            <footer><span>By {feature.author} · {feature.time} read</span><button type="button">Open research note ↗</button></footer>
          </article>
        </section>

        <section className={s.researchFeed}>
          <div className={s.sectionTitleRow}><div><h2>Latest research</h2><span>{filtered.length} notes in this view</span></div></div>
          <div className={s.researchGridCards}>{filtered.map((story, index) => <article key={story.title}><header><InstrumentMark symbol={story.symbol} tone={index} /><div><span>{story.category}</span><small>{story.symbol} · INDIA</small></div><em data-state={story.state}>{story.state}</em></header><h3>{story.title}</h3><p>{story.copy}</p><footer><span>By {story.author}</span><span>{story.time} read</span></footer></article>)}</div>
        </section>

        <section className={s.themeBoard}>
          <PanelHeading title="Market themes" subtitle="What the research desk is tracking now" />
          <div>{[["01", "Broadening leadership", "Constructive", "Banks, autos and industrials are sharing index leadership."], ["02", "Compressed volatility", "Watch", "Low implied volatility leaves less room for weak execution."], ["03", "Primary-market demand", "Selective", "Issue quality matters more as GMP dispersion widens."], ["04", "Global technology", "Improving", "Overnight strength supports domestic IT, but currency matters."]].map(([number, title, state, copy]) => <article key={title}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><em>{state}</em></article>)}</div>
        </section>

        <section className={s.weekAhead}>
          <div><span>TACTICAL CALENDAR</span><h2>Week ahead</h2><p>Events ranked by their capacity to change positioning.</p></div>
          <ol>{[["MON 10", "Industrial output", "Medium"], ["TUE 11", "Large-bank results", "High"], ["THU 13", "CPI inflation", "High"], ["FRI 14", "Weekly institutional flows", "Medium"]].map(([date, event, impact]) => <li key={event}><time>{date}</time><i data-impact={impact} /><strong>{event}</strong><span>{impact} impact</span></li>)}</ol>
        </section>

        <section className={s.communityIdeas}>
          <div className={s.sectionTitleRow}><div><h2>Community ideas</h2><span>Structured setups from across the tracked market universe</span></div><FilterRail label="Idea types"><FilterChip active>Editors’ picks</FilterChip><FilterChip>Popular</FilterChip><FilterChip>Recent</FilterChip></FilterRail></div>
          <div>{STORIES.map((story, index) => <article key={`idea-${story.title}`}><div className={s.ideaVisual}><span>{story.symbol}</span><i /><i /><i /><i /><b>{story.state}</b></div><div><header><InstrumentMark symbol={story.symbol} tone={index} /><span><strong>{story.symbol}</strong><small>{story.category}</small></span><em data-state={story.state}>{story.state}</em></header><h3>{story.title}</h3><p>{story.copy}</p><footer><span>By {story.author}</span><button type="button">Open idea ↗</button></footer></div></article>)}</div>
        </section>

        <section className={s.newsDesk}>
          <div className={s.sectionTitleRow}><div><h2>Top market stories</h2><span>A clear reading queue for the current session</span></div><Link href="/markets">Open market overview <span>↗</span></Link></div>
          <ol>{NEWS_DESK.map(([categoryName, title, desk], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><InstrumentMark symbol={categoryName} tone={index + 2} /><div><small>{categoryName}</small><h3>{title}</h3></div><em>{desk}</em><button type="button">Read ↗</button></li>)}</ol>
        </section>

        <section className={s.learningLibrary}>
          <div><span>Learning library</span><h2>Build a better market process</h2><p>Short guides connect each workspace to the decision it is designed to support.</p></div>
          <div>{LEARNING_PATHS.map(([number, title, copy]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p><Link href={title.includes("IPO") ? "/ipo" : title.includes("alert") ? "/stock-alerts" : title.includes("screener") ? "/live-markets" : "/markets"}>Open guide ↗</Link></article>)}</div>
        </section>
      </div>
    </main>
  );
}
