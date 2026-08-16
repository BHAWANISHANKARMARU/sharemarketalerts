"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "../SiteHeader";
import ProductDecisionTools from "./ProductDecisionTools";
import PlatformProductsGrid from "./PlatformProductsGrid";
import s from "./TradingWorkspace.module.css";
import hero from "./ProductsHero.module.css";

const TOOLS = [
  { name: "Market Lens", route: "/markets", category: "Discovery", description: "Read indices, sector leadership and breadth before selecting an instrument.", inputs: ["Live prices", "Breadth", "Sector strength"], output: "Session context", accent: "ML" },
  { name: "Signal Engine", route: "/live-markets", category: "Analysis", description: "Rank momentum, volume and risk events across the live market universe.", inputs: ["Price action", "Volume", "Trend state"], output: "Opportunity queue", accent: "SE" },
  { name: "IPO Desk", route: "/ipo", category: "Primary market", description: "Compare issue terms, demand context, GMP and the complete offer calendar.", inputs: ["Issue terms", "Demand", "GMP context"], output: "Issue comparison", accent: "IP" },
  { name: "Alert Router", route: "/stock-alerts", category: "Automation", description: "Turn a qualified market condition into a precise, controlled notification.", inputs: ["Condition", "Confirmation", "Channel"], output: "Actionable alert", accent: "AR" },
];

const CAPABILITIES = [
  ["Live market context", "Real-time prices, structure and momentum.", "pulse", true, false, true, true],
  ["Breadth and leadership", "Understand market rotation and strength.", "breadth", true, false, true, true],
  ["IPO terms and calendar", "Track offers, terms and key milestones.", "calendar", false, true, false, true],
  ["Multi-condition rules", "Create precise rules across conditions.", "sliders", false, false, true, true],
  ["Context with every signal", "Clear context for better decision making.", "research", true, true, true, true],
  ["Email and messaging handoff", "Deliver alerts where you already work.", "send", true, true, true, true],
];

const MARKET_TOOLKIT = [
  ["Supercharts", "Interactive multi-timeframe charting with clean technical context.", "/markets", "chart"],
  ["Stock screener", "Filter the live equity universe by price, participation and signal state.", "/live-markets", "filter"],
  ["Sector heatmap", "See market leadership and pressure as a compact visual field.", "/markets", "heatmap"],
  ["IPO calendar", "Track offer dates, issue terms, demand context and listing milestones.", "/ipo", "calendar"],
  ["Technical signals", "Rank confirmed momentum and risk events across tracked instruments.", "/live-markets", "signal"],
  ["Market alerts", "Monitor exact conditions without keeping another live feed open.", "/stock-alerts", "alert"],
  ["Research stream", "Read structured ideas, market themes and the week’s key catalysts.", "/insights", "research"],
  ["Market calendar", "Connect earnings, macro releases and primary-market events.", "/insights", "globe"],
];

const TOOLKIT_TRUST = [
  ["Reliable data", "Multiple sources. Continuous validation.", "shield"],
  ["Real-time updates", "Signals, prices and events as they happen.", "clock"],
  ["Custom workflows", "Use tools individually or together.", "sliders"],
  ["Secure by design", "Enterprise-grade infrastructure.", "lock"],
];

const DELIVERY_CANDLES = [18, 25, 21, 30, 24, 33, 28, 37, 31, 40, 34, 45, 39, 58, 48, 44, 52, 36, 31, 38, 29, 33, 46, 41];

function ToolkitIcon({ name }) {
  if (name === "monitor") return <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4m-5-8 3-3 3 2 4-5" /></svg>;
  if (name === "mail") return <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "pulse") return <svg viewBox="0 0 24 24"><path d="M3 13h4l2-6 4 11 3-8 2 3h3" /></svg>;
  if (name === "breadth") return <svg viewBox="0 0 24 24"><path d="M5 20v-5m5 5V9m5 11V5m5 15V2" /></svg>;
  if (name === "send") return <svg viewBox="0 0 24 24"><path d="m3 11 18-8-7 18-3-7-8-3Z" /><path d="m11 14 5-6" /></svg>;
  if (name === "filter") return <svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" /></svg>;
  if (name === "heatmap") return <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" /></svg>;
  if (name === "calendar") return <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></svg>;
  if (name === "signal") return <svg viewBox="0 0 24 24"><path d="m3 18 5-6 4 3 8-10" /><circle cx="3" cy="18" r="1.5" /><circle cx="8" cy="12" r="1.5" /><circle cx="12" cy="15" r="1.5" /><circle cx="20" cy="5" r="1.5" /></svg>;
  if (name === "alert") return <svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 8H3c0-1 3-1 3-8Z" /><path d="M10 21h4" /></svg>;
  if (name === "research") return <svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>;
  if (name === "globe") return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
  if (name === "shield") return <svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></svg>;
  if (name === "clock") return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></svg>;
  if (name === "sliders") return <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="11" cy="18" r="2" /></svg>;
  if (name === "lock") return <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="M3 17c3-1 5-6 8-5s4 4 10-5M4 21h17" /><path d="M6 12V8m4 3V5m4 6V7m4-2v4" /></svg>;
}

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
      <section className={hero.heroField} data-products-hero="true">
        <div className={hero.heroCanvas}>
          <nav className={hero.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/products"><span aria-hidden="true">▾</span>Products</Link>
            <i aria-hidden="true">›</i>
            <span>Workspace</span>
          </nav>

          <section className={hero.intro}>
            <div><h1>Product workspace</h1><p>Move from market context to a qualified alert without rebuilding the decision in another tool.</p></div>
            <Link className={hero.primaryButton} href="/live-markets">Open live workspace <span>↗</span></Link>
          </section>

          <div className={hero.tabs} role="group" aria-label="Product categories">
            {["All tools", "Discovery", "Analysis", "Automation"].map((item) => <button type="button" aria-pressed={tab === item} onClick={() => setTab(item)} key={item}>{item}</button>)}
          </div>

          <section className={hero.workbench}>
          <aside className={hero.toolRail}>
            <header><span>PRODUCTS</span><strong>{tab}</strong></header>
            <nav aria-label="Product tools">
              {TOOLS.filter((tool) => tab === "All tools" || tool.category === tab).map((tool, index) => <button type="button" aria-pressed={activeTool.name === tool.name} onClick={() => setActiveTool(tool)} key={tool.name}><i>{tool.accent}</i><span><strong>{tool.name}</strong><small>{tool.category}</small></span><b aria-hidden="true">›</b></button>)}
            </nav>
            <div className={hero.toolRailFoot}><span>PLATFORM STATUS</span><strong><i /> All systems operational</strong></div>
          </aside>

          <article className={hero.toolPreview}>
            <header className={hero.panelHeading}><div><h2>Tool preview</h2><p>One shared context layer</p></div><span className={hero.availableBadge}>AVAILABLE NOW</span></header>
            <div className={hero.previewHeader}><div className={hero.previewIcon}>{activeTool.accent}</div><div><span>{activeTool.category}</span><h2>{activeTool.name}</h2><p>{activeTool.description}</p></div><Link href={activeTool.route}>Open tool <span>↗</span></Link></div>
            <div className={hero.previewCanvas}>
              <div className={hero.previewToolbar}><span>{activeTool.name.toUpperCase()}</span><div><i /><i /><i /></div><button type="button"><i /> Live</button></div>
              <div className={hero.previewBody}>
                <aside>{activeTool.inputs.map((input, index) => <div key={input}><span>0{index + 1}</span><strong>{input}</strong><small>Connected input</small></div>)}</aside>
                <div className={hero.previewSignal}>
                  <span>DECISION OUTPUT</span>
                  <strong>{activeTool.output}</strong>
                  <div><i /><i /><i /><i /><i /></div>
                  <p>Context is presented from detection through delivery.</p>
                </div>
              </div>
            </div>
            <footer><span>Inputs update with the market provider</span><span>Output: {activeTool.output}</span></footer>
          </article>
          </section>
        </div>
      </section>

      <div className={s.canvas}>

        <ProductDecisionTools tools={TOOLS} />

        <section className={s.toolkitDirectory} data-toolkit-section>
          <header className={s.toolkitHeading}><span>MARKET TOOLS</span><h2>Explore the market toolkit</h2><p>Focused surfaces for every part of the research workflow</p></header>
          <div className={s.toolkitGrid} data-toolkit-grid>{MARKET_TOOLKIT.map(([title, copy, route, mark], index) => <Link href={route} data-tone={index} key={title}><span className={s.toolkitIcon}><ToolkitIcon name={mark} /></span><h3>{title}</h3><p>{copy}</p><i>↗</i></Link>)}</div>
          <div className={s.toolkitTrust}>{TOOLKIT_TRUST.map(([title, copy, icon]) => <div key={title}><span><ToolkitIcon name={icon} /></span><p><strong>{title}</strong><small>{copy}</small></p></div>)}</div>
        </section>

        <PlatformProductsGrid categories={PRODUCT_CATEGORIES} />

        <section className={s.capabilityMatrix} data-capability-section>
          <header className={s.capabilityHeading}><span>PLATFORM OVERVIEW</span><h2>Capability matrix</h2><p>Know exactly where each workflow lives</p></header>
          <div className={s.capabilityScroller}><table className={s.capabilityMatrixTable} data-capability-matrix><thead><tr><th>CAPABILITY</th>{[["Market Lens", "chart"], ["IPO Desk", "calendar"], ["Alert Router", "alert"], ["Platform", "heatmap"]].map(([name, icon], index) => <th data-tone={index} key={name}><span><ToolkitIcon name={icon} /></span><strong>{name}</strong></th>)}</tr></thead><tbody>{CAPABILITIES.map(([name, detail, icon, ...values], rowIndex) => <tr key={name}><td><span data-tone={rowIndex}><ToolkitIcon name={icon} /></span><p><strong>{name}</strong><small>{detail}</small></p></td>{values.map((value, index) => <td key={index}>{value ? <span className={s.matrixCheck}>✓</span> : <span className={s.matrixDash}>—</span>}</td>)}</tr>)}</tbody></table></div>
        </section>

        <section className={s.deliverySurfaces} data-delivery-surfaces>
          <header className={s.deliveryHeading}><span>DELIVERY SYSTEM</span><h2>Delivery surfaces</h2><p>Urgency and context travel differently. Route each to the place where it is most useful.</p></header>
          <div className={s.deliveryCards}>
            <article data-tone="green"><header><span className={s.deliveryIcon}><ToolkitIcon name="monitor" /></span><div><em>Deep analysis</em><h3>Web workspace</h3><p>Charts, source context and outcome history.</p></div></header><div className={s.deliveryPreview}><div className={s.miniQuote}><small>NIFTY 50</small><strong>24,532.10 <em>+162.35 (0.66%)</em></strong><span>1D　5D　1M　3M　1Y　All <b>☼ Indicators</b></span></div><div className={s.deliveryChart} aria-hidden="true"><div className={s.chartPrices}><span>24,600</span><span>24,500</span><span>24,400</span><span>24,300</span><span>24,200</span></div><div className={s.candles}>{DELIVERY_CANDLES.map((height, index) => <i data-up={index % 4 !== 1} style={{ "--candle-height": `${height}px`, "--candle-shift": `${Math.abs(35 - height)}px` }} key={index}><b /></i>)}</div><div className={s.chartTimes}><span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span><span>15:00</span></div></div><footer><span>Recent outcomes</span><strong>Breakout confirmation <small>+1.42%</small></strong></footer></div><i>↗</i></article>
            <article data-tone="blue"><header><span className={s.deliveryIcon}><ToolkitIcon name="mail" /></span><div><em>Scheduled review</em><h3>Email brief</h3><p>A calm digest before or after the session.</p></div></header><div className={[s.deliveryPreview, s.emailPreview].join(" ")}><header><strong>SHAREMARKETALERTS</strong><time>16 May 2025</time></header><h4>Morning Market Brief</h4><p>Your scheduled market review</p><strong>Market snapshot</strong><div><span>NIFTY 50<b>24,532.10</b><em>+0.66%</em></span><span>SENSEX<b>80,845.75</b><em>+0.59%</em></span><span>ADV / DEC<b>1.8 / 1</b><em>Positive</em></span></div><strong>Key highlights</strong><ul><li>Global cues remain supportive</li><li>Nifty holds above key support zone</li><li>Banking & PSU space showing strength</li></ul></div><i>↗</i></article>
            <article data-tone="amber"><header><span className={s.deliveryIcon}><ToolkitIcon name="alert" /></span><div><em>Immediate action</em><h3>Messaging</h3><p>Qualified alerts with the essential decision context.</p></div></header><div className={[s.deliveryPreview, s.messagePreview].join(" ")}><div><header><span><ToolkitIcon name="send" /></span><strong>ShareMarketAlerts</strong><time>now</time></header><b>🚨 Breakout Confirmed</b><h4>RELIANCE</h4><p>Price: ₹2,945.60<br />Above: <strong>₹2,930.00</strong><br />Volume: 1.8x avg<br />Context: Strong momentum with sector tailwind. Next resistance ₹3,020.</p><a href="/markets">View chart →</a><time>09:21 AM</time></div></div><i>↗</i></article>
          </div>
        </section>
      </div>
    </main>
  );
}
