"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "../SiteHeader";
import MarketThemes from "./MarketThemes";
import InsightsLearningLibrary from "./InsightsLearningLibrary";
import InsightsWeekAhead from "./InsightsWeekAhead";
import {
  InstrumentMark,
  WorkspaceBreadcrumbs,
} from "./WorkspacePrimitives";
import s from "./TradingWorkspace.module.css";
import rh from "./InsightsResearchHero.module.css";
import ms from "./InsightsMarketStories.module.css";

const STORIES = [
  { category: "Market structure", state: "Long", title: "Breadth is improving beneath a quiet headline index", copy: "Participation has widened across financials, autos and industrials while index volatility remains contained.", author: "Research Desk", time: "6 min", symbol: "NIFTY" },
  { category: "Sector note", state: "Long", title: "Private banks regain relative strength", copy: "Price confirmation is improving, but the next leg still needs cleaner volume expansion.", author: "Aarav Mehta", time: "4 min", symbol: "BANK" },
  { category: "Risk desk", state: "Risk", title: "Where small-cap momentum becomes fragile", copy: "Separate durable trend continuation from liquidity-led excess with three observable checks.", author: "Risk Desk", time: "7 min", symbol: "SMALL" },
  { category: "Explainer", state: "Neutral", title: "What a falling VIX actually confirms", copy: "Lower implied volatility matters only when read beside realised movement and participation.", author: "Research Desk", time: "5 min", symbol: "VIX" },
  { category: "Primary market", state: "Neutral", title: "Read IPO demand by category, not headline bids", copy: "Institutional demand, retail enthusiasm and grey-market pricing answer different questions.", author: "IPO Desk", time: "5 min", symbol: "IPO" },
  { category: "Macro", state: "Risk", title: "The week’s inflation print changes the rate narrative", copy: "Map the release to banks, duration-sensitive sectors and the currency before the event.", author: "Macro Desk", time: "8 min", symbol: "CPI" },
];

const NEWS_DESK = [
  { category: "Indian stocks", title: "Banks and autos carry a broader session advance", desk: "Market breadth", icon: "trend", tone: "green" },
  { category: "Macro", title: "Inflation print becomes the week’s main positioning event", desk: "Week ahead", icon: "bank", tone: "orange" },
  { category: "Technology", title: "IT leadership improves as global risk appetite steadies", desk: "Sector pulse", icon: "bars", tone: "red" },
  { category: "Primary market", title: "Issue quality separates from headline subscription demand", desk: "IPO desk", icon: "calendar", tone: "teal" },
  { category: "Risk", title: "Volatility stays contained while small-cap dispersion widens", desk: "Risk monitor", icon: "globe", tone: "blue" },
];

const LATEST_RESEARCH = [
  ["Market structure", "Midcaps find support as participation broadens", "5 min read", "trend"],
  ["Sector note", "Banks: Deposit growth stabilises into Q2", "7 min read", "bank"],
  ["Risk desk", "Volatility compresses near support cluster", "4 min read", "shield"],
  ["Primary market", "Upcoming IPO: Key terms and watch points", "6 min read", "calendar"],
  ["Explainer", "How to read participation like an analyst", "8 min read", "book"],
  ["Macro", "Macro calendar: Events that move markets", "3 min read", "globe"],
];

const EVIDENCE = [
  ["What changed", "Participation expanded beyond index leaders.", "trend"],
  ["Confirmation", "Volume breadth remains above its 20-day mean.", "bars"],
  ["Invalidation", "Breadth falls while the headline index holds.", "shield"],
];

function ResearchGlyph({ name }) {
  if (name === "bank") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18L12 4 3 9Zm2 9h14M6 10v6m4-6v6m4-6v6m4-6v6" /></svg>;
  if (name === "shield") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></svg>;
  if (name === "calendar") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></svg>;
  if (name === "book") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23V5.5Z" /></svg>;
  if (name === "globe") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
  if (name === "bars") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20v-7h3v7H5Zm6 0V5h3v15h-3Zm6 0V9h3v11h-3Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 17 5-6 4 3 8-10" /><path d="M4 21h17" /><circle cx="8" cy="11" r="1" /><circle cx="12" cy="14" r="1" /><circle cx="20" cy="4" r="1" /></svg>;
}

const IDEA_CHARTS = [
  "M8 91 L40 54 L55 70 L72 58 L93 26 L113 24 L158 8",
  "M8 91 L28 73 L45 58 L65 58 L82 35 L104 34 L158 3",
  "M8 86 L30 54 L52 66 L76 21 L101 57 L124 52 L158 12",
  "M8 33 L32 12 L50 47 L70 20 L94 15 L109 44 L129 45 L158 58",
  "",
  "M8 91 L50 55 L72 73 L101 8 L128 45 L143 42 L158 8",
];

const IDEA_POINTS = [
  [[8, 91], [40, 54], [55, 70], [72, 58], [93, 26], [113, 24]],
  [[8, 91], [28, 73], [45, 58], [65, 58], [82, 35], [104, 34]],
  [],
  [[8, 33], [32, 12], [50, 47], [70, 20], [94, 15], [109, 44], [129, 45]],
  [],
  [[8, 91], [50, 55], [72, 73], [101, 8], [128, 45], [143, 42]],
];

function IdeaSparkline({ index, tone }) {
  if (index === 4) {
    return <div className={s.communityBars} aria-hidden="true">{[10, 32, 22, 55, 76, 39, 101, 50, 35, 72, 112, 42, 88, 32, 134].map((height, barIndex) => <i style={{ "--bar-height": `${height}px`, "--bar-opacity": String(.3 + (barIndex % 4) * .18) }} key={barIndex} />)}</div>;
  }
  if (index === 2) {
    return (
      <svg className={s.communitySparkline} viewBox="0 0 166 100" preserveAspectRatio="none" data-tone={tone} aria-hidden="true">
        <defs><linearGradient id="idea-fill-2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".18" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
        <path className={s.communitySparkArea} d="M8 86 L29 58 L50 67 L72 21 L94 50 L118 45 L140 25 L158 3 L158 100 L8 100 Z" fill="url(#idea-fill-2)" />
        <path className={s.communitySparkLine} d="M8 86 L29 58 L50 67 L72 21 L94 50" />
        <path className={[s.communitySparkLine, s.communitySparkDashed].join(" ")} d="M94 50 L118 45 L140 25 L158 3" />
        <circle className={s.communitySparkTerminal} cx="94" cy="50" r="4" /><circle className={s.communitySparkTerminalDot} cx="94" cy="50" r="1.8" />
        <circle className={s.communitySparkTerminal} cx="158" cy="3" r="4" /><circle className={s.communitySparkTerminalDot} cx="158" cy="3" r="1.8" />
      </svg>
    );
  }
  return (
    <svg className={s.communitySparkline} viewBox="0 0 166 100" preserveAspectRatio="none" data-tone={tone} aria-hidden="true">
      <defs><linearGradient id={`idea-fill-${index}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".18" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
      <path className={s.communitySparkArea} d={`${IDEA_CHARTS[index]} L158 100 L8 100 Z`} fill={`url(#idea-fill-${index})`} />
      <path className={s.communitySparkLine} d={IDEA_CHARTS[index]} />
      {IDEA_POINTS[index].map(([cx, cy]) => <circle className={s.communitySparkPoint} cx={cx} cy={cy} r="1.35" key={`${cx}-${cy}`} />)}
      <circle className={s.communitySparkTerminal} cx="158" cy={index === 0 ? 8 : index === 1 ? 3 : index === 3 ? 58 : 8} r="4" />
      <circle className={s.communitySparkTerminalDot} cx="158" cy={index === 0 ? 8 : index === 1 ? 3 : index === 3 ? 58 : 8} r="1.8" />
    </svg>
  );
}

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
        <section className={rh.referenceHero} data-insights-reference-hero="true">
          <header className={rh.intro}>
            <div>
              <span className={rh.eyebrow}>ORIGINAL MARKET RESEARCH <i aria-hidden="true" /></span>
              <h1>Research ideas</h1>
              <p>Decision-ready notes connecting price, participation and catalyst—<br />ranked by consequence, not engagement.</p>
            </div>
            <Link className={rh.marketOverview} href="/markets"><span aria-hidden="true">↗</span> Open market overview</Link>
          </header>

          <nav className={rh.tabs} aria-label="Research view">
            {["Research ideas", "Market themes", "Week ahead", "Explainers"].map((item) => <button type="button" aria-pressed={tab === item} onClick={() => setTab(item)} key={item}>{item}</button>)}
          </nav>

          <div className={rh.toolbar}>
            <div className={rh.filters} role="group" aria-label="Research topics">
              {["All ideas", "Market structure", "Sector note", "Risk desk", "Explainer", "Primary market", "Macro"].map((item) => <button type="button" aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}
            </div>
            <button className={rh.sortButton} type="button" aria-label="Sort research by newest first"><ResearchGlyph name="bars" />Newest first <span aria-hidden="true">⌄</span></button>
          </div>

          <section className={rh.feature} data-featured-research="true">
            <div className={rh.participation}>
              <span>PARTICIPATION INDEX</span>
              <div><strong>72</strong><small>/100</small></div>
              <em><span aria-hidden="true">↗</span> +8 vs 20-day avg</em>
              <svg className={rh.participationChart} viewBox="0 0 340 140" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="participation-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#55e4bf" stopOpacity=".18" /><stop offset="1" stopColor="#55e4bf" stopOpacity="0" /></linearGradient></defs>
                <path className={rh.participationArea} d="M10 124 C44 87 58 106 88 78 S134 65 158 83 S197 99 222 63 S266 72 306 24 L306 140 L10 140 Z" />
                <path className={rh.participationLine} d="M10 124 C44 87 58 106 88 78 S134 65 158 83 S197 99 222 63 S266 72 306 24" />
                <circle cx="306" cy="24" r="6.5" /><circle cx="306" cy="24" r="3.5" />
              </svg>
            </div>

            <article className={rh.featureBody}>
              <div className={rh.featureHeading}><span><b>FEATURED</b><i>·</i>{feature.category.toUpperCase()}</span><em data-state={feature.state}>{feature.state}</em></div>
              <h2>{feature.title}</h2>
              <p>{feature.copy}</p>
              <div className={rh.evidence}>
                {EVIDENCE.map(([title, copy, icon]) => <div key={title}><span><ResearchGlyph name={icon} /></span><p><strong>{title}</strong><small>{copy}</small></p></div>)}
              </div>
              <footer>
                <span className={rh.author}><i>RD</i><strong>By {feature.author}</strong><b>·</b><small>{feature.time} read</small></span>
                <button type="button">Open research note <span aria-hidden="true">↗</span></button>
              </footer>
            </article>
          </section>

          <section className={rh.latest} data-latest-research="true">
            <header><h2>Latest research</h2><Link href="/insights">View all research <span aria-hidden="true">↗</span></Link></header>
            <div>
              {LATEST_RESEARCH.map(([group, title, time, icon]) => (
                <article data-latest-research-item="true" data-group={group} key={title}>
                  <span className={rh.latestIcon}><ResearchGlyph name={icon} /></span>
                  <p><small>{group.toUpperCase()}</small><strong>{title}</strong></p>
                  <time>{time}</time><Link href="/insights" aria-label={`Read ${title}`}>→</Link>
                </article>
              ))}
            </div>
          </section>
        </section>

        <MarketThemes />

        <InsightsWeekAhead />

        <section className={s.communityIdeas} data-community-ideas-reference="true">
          <header className={s.communityHeader}>
            <div><span>♧ COMMUNITY IDEAS</span><h2>Community ideas</h2><p>Structured setups from across the tracked market universe</p></div>
            <div className={s.communityFilters} role="group" aria-label="Idea types"><button type="button" aria-pressed="true">☆ <span>Editors’ picks</span></button><button type="button">♨ <span>Popular</span></button><button type="button">◷ <span>Recent</span></button></div>
          </header>
          <div className={s.communityIdeasGrid}>
            {STORIES.map((story, index) => (
              <article data-tone={index} key={`idea-${story.title}`}>
                <header><InstrumentMark symbol={story.symbol} tone={index} /><span><strong>{story.symbol}</strong><small>{story.category}</small></span><em data-state={story.state}>{story.state.toUpperCase()}</em></header>
                <div className={s.communityIdeaBody}><div><h3>{story.title}</h3><p>{story.copy}</p></div><IdeaSparkline index={index} tone={index} /></div>
                <footer><span><i>{story.author.split(" ").map((part) => part[0]).join("").slice(0, 2)}</i><strong>By {story.author}</strong></span><button type="button">Open idea <b aria-hidden="true">→</b></button></footer>
              </article>
            ))}
          </div>
          <footer className={s.communityGuidelines}><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4.5 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="M8 9h8m-8 4h5" /></svg></span><p>These ideas are community-generated and curated by our research team.<strong>Do your own analysis before acting.</strong></p><Link href="/insights">See community guidelines <b aria-hidden="true">→</b></Link></footer>
        </section>

        <section className={ms.marketStories} data-insights-market-stories="true">
          <header className={ms.header}>
            <div className={ms.heading}>
              <i aria-hidden="true" />
              <div><h2>Top market stories</h2><p>A clear reading queue for the current session</p></div>
            </div>
            <Link href="/markets">Open market overview <span aria-hidden="true">↗</span></Link>
          </header>

          <ol className={ms.storyList}>
            {NEWS_DESK.map(({ category, title, desk, icon, tone }, index) => (
              <li data-market-story="true" data-tone={tone} key={title}>
                <span className={ms.number}>{String(index + 1).padStart(2, "0")}</span>
                <span className={ms.storyIcon}><ResearchGlyph name={icon} /></span>
                <div className={ms.storyCopy}><small>{category}</small><h3>{title}</h3></div>
                <em className={ms.storyDesk}>{desk}</em>
                <Link className={ms.readLink} href={`/insights?story=${index + 1}`}>Read <span aria-hidden="true">↗</span></Link>
              </li>
            ))}
          </ol>

          <footer className={ms.subscribe} data-market-stories-subscribe="true">
            <span className={ms.mailIcon} aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></span>
            <div><h3>Never miss a market moving story.</h3><p>Get top insights delivered to your inbox, every morning.</p></div>
            <form action="/insights" method="get"><label className={s.srOnly} htmlFor="market-stories-email">Email address</label><input id="market-stories-email" name="email" type="email" placeholder="Enter your email" required /><button type="submit">Subscribe</button></form>
          </footer>
        </section>

        <InsightsLearningLibrary />
      </div>
    </main>
  );
}
