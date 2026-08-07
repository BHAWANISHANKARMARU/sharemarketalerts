"use client";

import { useState } from "react";
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

const TOOLS = [
  { name: "Market Lens", route: "/markets", category: "Discovery", description: "Read indices, sector leadership and breadth before selecting an instrument.", inputs: ["Live prices", "Breadth", "Sector strength"], output: "Session context", accent: "ML" },
  { name: "Signal Engine", route: "/live-markets", category: "Analysis", description: "Rank momentum, volume and risk events across the live market universe.", inputs: ["Price action", "Volume", "Trend state"], output: "Opportunity queue", accent: "SE" },
  { name: "IPO Desk", route: "/ipo", category: "Primary market", description: "Compare issue terms, demand context, GMP and the complete offer calendar.", inputs: ["Issue terms", "Demand", "GMP context"], output: "Issue comparison", accent: "IP" },
  { name: "Alert Router", route: "/stock-alerts", category: "Automation", description: "Turn a qualified market condition into a precise, controlled notification.", inputs: ["Condition", "Confirmation", "Channel"], output: "Actionable alert", accent: "AR" },
];

const CAPABILITIES = [
  ["Live market context", true, false, true, true],
  ["Breadth and leadership", true, false, true, true],
  ["IPO terms and calendar", false, true, false, true],
  ["Multi-condition rules", false, false, true, true],
  ["Context with every signal", true, true, true, true],
  ["Email and messaging handoff", false, false, true, true],
];

const MARKET_TOOLKIT = [
  ["Supercharts", "Interactive multi-timeframe charting with clean technical context.", "/markets", "CH"],
  ["Stock screener", "Filter the live equity universe by price, participation and signal state.", "/live-markets", "SC"],
  ["Sector heatmap", "See market leadership and pressure as a compact visual field.", "/markets", "HM"],
  ["IPO calendar", "Track offer dates, issue terms, demand context and listing milestones.", "/ipo", "IP"],
  ["Technical signals", "Rank confirmed momentum and risk events across tracked instruments.", "/live-markets", "TS"],
  ["Market alerts", "Monitor exact conditions without keeping another live feed open.", "/stock-alerts", "AL"],
  ["Research stream", "Read structured ideas, market themes and the week’s key catalysts.", "/insights", "RS"],
  ["Market calendar", "Connect earnings, macro releases and primary-market events.", "/insights", "CA"],
];

const PRODUCT_CATEGORIES = [
  ["Charting", "Analyse price and structure", ["Multi-timeframe charts", "Technical overlays", "Drawing and annotation"], "/markets", "CH"],
  ["Screeners", "Search complete market universes", ["Stock screener", "Momentum filters", "Risk and liquidity views"], "/live-markets", "SC"],
  ["Heatmaps", "See leadership at a glance", ["Sector performance", "Market breadth", "Relative strength"], "/markets", "HM"],
  ["Calendars", "Prepare for market events", ["Economic events", "Earnings watch", "IPO milestones"], "/ipo", "CA"],
  ["Research", "Turn data into context", ["Trade ideas", "Market news", "Technical explainers"], "/insights", "RS"],
  ["Alerts", "Automate continuous monitoring", ["Price conditions", "Candle confirmation", "Multi-channel delivery"], "/stock-alerts", "AL"],
];

export default function ProductsExperience() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [tab, setTab] = useState("All tools");

  return (
    <main className={[s.workspacePage, s.productsWorkspace].join(" ")} data-products-suite>
      <SiteHeader />
      <div className={s.canvas}>
        <WorkspaceBreadcrumbs items={[{ label: "Products", href: "/products" }, { label: "Workspace" }]} />
        <section className={s.compactIntro}>
          <div><span>CONNECTED MARKET TOOLS</span><h1>Product workspace</h1><p>Move from market context to a qualified alert without rebuilding the decision in another tool.</p></div>
          <Link className={s.primaryButton} href="/live-markets">Open live workspace <span>↗</span></Link>
        </section>
        <WorkspaceTabs items={["All tools", "Discovery", "Analysis", "Automation"]} active={tab} onChange={setTab} label="Product categories" />

        <section className={s.productWorkbench}>
          <aside className={s.toolRail}>
            <header><span>PRODUCTS</span><strong>{tab}</strong></header>
            <nav aria-label="Product tools">
              {TOOLS.filter((tool) => tab === "All tools" || tool.category === tab).map((tool, index) => <button type="button" aria-pressed={activeTool.name === tool.name} onClick={() => setActiveTool(tool)} key={tool.name}><i>{tool.accent}</i><span><strong>{tool.name}</strong><small>{tool.category}</small></span><b aria-hidden="true">›</b></button>)}
            </nav>
            <div className={s.toolRailFoot}><span>PLATFORM STATUS</span><strong><i /> All systems operational</strong></div>
          </aside>

          <article className={s.toolPreview}>
            <PanelHeading title="Tool preview" subtitle="One shared context layer" action={<span className={s.availableBadge}>AVAILABLE NOW</span>} />
            <div className={s.previewHeader}><div className={s.previewIcon}>{activeTool.accent}</div><div><span>{activeTool.category}</span><h2>{activeTool.name}</h2><p>{activeTool.description}</p></div><Link href={activeTool.route}>Open tool <span>↗</span></Link></div>
            <div className={s.previewCanvas}>
              <div className={s.previewToolbar}><span>{activeTool.name.toUpperCase()}</span><div><i /><i /><i /></div><button type="button">Live ▾</button></div>
              <div className={s.previewBody}>
                <aside>{activeTool.inputs.map((input, index) => <div key={input}><span>0{index + 1}</span><strong>{input}</strong><small>Connected input</small></div>)}</aside>
                <div className={s.previewSignal}>
                  <span>DECISION OUTPUT</span>
                  <strong>{activeTool.output}</strong>
                  <div><i /><i /><i /><i /><i /></div>
                  <p>Context is preserved from detection through delivery.</p>
                </div>
              </div>
            </div>
            <footer><span>Inputs update with the market provider</span><span>Output: {activeTool.output}</span></footer>
          </article>
        </section>

        <section className={s.productList}>
          <div className={s.sectionTitleRow}><div><h2>Built around the decision</h2><span>Four tools, one continuous workflow</span></div><FilterRail label="Product filter"><FilterChip active>All capabilities</FilterChip><FilterChip>For traders</FilterChip><FilterChip>For investors</FilterChip></FilterRail></div>
          <div>{TOOLS.map((tool, index) => <article key={tool.name}><span>0{index + 1}</span><div><h3>{tool.name}</h3><p>{tool.description}</p></div><small>{tool.inputs.join(" · ")}</small><Link href={tool.route}>Explore <span>↗</span></Link></article>)}</div>
        </section>

        <section className={s.toolkitDirectory}>
          <div className={s.sectionTitleRow}><div><h2>Explore the market toolkit</h2><span>Focused surfaces for every part of the research workflow</span></div></div>
          <div>{MARKET_TOOLKIT.map(([title, copy, route, mark], index) => <Link href={route} key={title}><InstrumentMark symbol={mark} tone={index} /><span><h3>{title}</h3><p>{copy}</p></span><i>↗</i></Link>)}</div>
        </section>

        <section className={s.marketDirectory}>
          <div className={s.sectionTitleRow}><div><h2>All platform products</h2><span>Complete market coverage organised by the job you need to do</span></div><Link href="/live-markets">Launch workspace <span>↗</span></Link></div>
          <div className={s.marketDirectoryGrid}>{PRODUCT_CATEGORIES.map(([title, copy, items, route, mark], index) => <article key={title}><header><div><InstrumentMark symbol={mark} tone={index} /><span><h3>{title}</h3><p>{copy}</p></span></div><Link href={route}>↗</Link></header><ol>{items.map((item, itemIndex) => <li key={item}><span>{item}</span><strong>Included</strong><em>0{itemIndex + 1}</em></li>)}</ol></article>)}</div>
        </section>

        <section className={s.capabilityMatrix}>
          <div className={s.sectionTitleRow}><div><h2>Capability matrix</h2><span>Know exactly where each workflow lives</span></div></div>
          <div className={s.tableScroller}><table className={s.workspaceTable}><thead><tr><th>Capability</th><th>Market Lens</th><th>IPO Desk</th><th>Alert Router</th><th>Platform</th></tr></thead><tbody>{CAPABILITIES.map(([name, ...values]) => <tr key={name}><td><strong>{name}</strong></td>{values.map((value, index) => <td key={index}>{value ? <span className={s.matrixCheck}>✓</span> : <span className={s.matrixDash}>—</span>}</td>)}</tr>)}</tbody></table></div>
        </section>

        <section className={s.deliverySurfaces}>
          <div><span>DELIVERY SYSTEM</span><h2>Delivery surfaces</h2><p>Urgency and context travel differently. Route each to the place where it is most useful.</p></div>
          <div>{[["Web workspace", "Deep analysis", "Charts, source context and outcome history."], ["Email brief", "Scheduled review", "A calm digest before or after the session."], ["Messaging", "Immediate action", "Qualified alerts with the essential decision context."]].map(([title, use, copy]) => <article key={title}><span>{use}</span><h3>{title}</h3><p>{copy}</p><i>↗</i></article>)}</div>
        </section>
      </div>
    </main>
  );
}
