"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, YAxis } from "recharts";
import { formatLiveMarketTime } from "../../lib/market-formatters";
import styles from "./LiveRuleMonitoring.module.css";

const FALLBACKS = [
  { symbol: "ADANIENT", value: 3035.1, change: "+2.37%" },
  { symbol: "BPCL", value: 319.45, change: "+1.41%" },
  { symbol: "ICICIBANK", value: 1417, change: "+0.73%" },
  { symbol: "WIPRO", value: 184, change: "+0.49%" },
];

const ACTIVITY = [
  ["10:13 AM", "ADANIENT", "crossed your breakout level", "Price is 2.37% above your trigger (₹3,000)", "TRIGGERED"],
  ["10:10 AM", "BPCL", "moving closer to your support", "Only 1.4% away from support (₹315.00)", "APPROACHING"],
  ["10:02 AM", "ICICIBANK", "entered monitoring range", "Price action matches your rule conditions", "MONITORING"],
  ["09:55 AM", "WIPRO", "rule updated", "Support level changed to ₹185.20", "UPDATED"],
];

const ALERT_TABS = ["Create alert", "Active alerts", "Triggered", "Settings"];
const TIMEFRAMES = [
  ["1m", "1D"],
  ["5m", "1D"],
  ["15m", "5D"],
  ["1h", "1M"],
  ["1D", "1Y"],
];

function normalize(quote, fallback) {
  const value = Number(quote?.value ?? fallback.value);
  return {
    symbol: quote?.displaySymbol || quote?.symbol?.replace(/\.(NS|BO)$/i, "") || fallback.symbol,
    apiSymbol: quote?.symbol || `${fallback.symbol}.NS`,
    value,
    price: quote?.formattedValue || new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    change: quote?.formattedChange || fallback.change,
    href: quote?.href || `/live-markets?symbol=${fallback.symbol}`,
  };
}

function MiniPulse() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13h4l2-7 4 13 2-7h6" /></svg>;
}

function RuleNode({ rule, tone, state, caption, position, active = false }) {
  return (
    <div className={styles.ruleNode} style={{ left: position }}>
      <i className={styles.nodeDot} style={{ borderColor: tone, background: tone }} />
      <span className={active ? styles.activeHalo : ""} style={{ background: tone }}>{rule.symbol.charAt(0)}</span>
      <strong>{rule.symbol}</strong>
      <small>{caption}</small>
      {active && <em>{state}</em>}
    </div>
  );
}

function StateBadge({ children }) {
  const key = String(children).toLowerCase();
  return <span className={`${styles.stateBadge} ${styles[key] || ""}`}>{children}</span>;
}

export default function LiveRuleMonitoring({ quotes = [], statusLabel = "Market Open", updatedAt, paused = [], onToggle = () => {} }) {
  const lookup = new Map(quotes.map((quote) => [quote.displaySymbol || quote.symbol?.replace(/\.(NS|BO)$/i, ""), quote]));
  const rules = FALLBACKS.map((fallback, index) => normalize(lookup.get(fallback.symbol) || quotes[index], fallback));
  const [defaultFeatured, bpcl, icici, wipro] = rules;
  const [activeTab, setActiveTab] = useState("Create alert");
  const [selectedSymbol, setSelectedSymbol] = useState(defaultFeatured.apiSymbol);
  const [timeframe, setTimeframe] = useState("15m");
  const [chart, setChart] = useState([]);
  const [condition, setCondition] = useState("Moves above");
  const [ruleValue, setRuleValue] = useState("3065");
  const [frequency, setFrequency] = useState("Once per event");
  const [expiration, setExpiration] = useState("Open-ended");
  const [confirmClose, setConfirmClose] = useState(true);
  const [delivery, setDelivery] = useState("Messaging");
  const [created, setCreated] = useState(false);
  const [clockTime, setClockTime] = useState(updatedAt || null);
  const selectedRange = TIMEFRAMES.find(([label]) => label === timeframe)?.[1] || "5D";
  const featured = rules.find((rule) => rule.apiSymbol === selectedSymbol) || defaultFeatured;
  const breakout = Math.max(0, Math.floor(featured.value / 50) * 50);
  const chartData = useMemo(() => chart
    .filter((point) => Number.isFinite(Number(point?.value)))
    .slice(-48)
    .map((point, index) => ({ index, value: Number(point.value) })), [chart]);

  useEffect(() => {
    const updateClock = () => setClockTime(updatedAt || new Date().toISOString());
    const initialUpdate = window.setTimeout(updateClock, 0);
    const interval = updatedAt ? null : window.setInterval(updateClock, 1_000);

    return () => {
      window.clearTimeout(initialUpdate);
      if (interval) window.clearInterval(interval);
    };
  }, [updatedAt]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/market/chart?symbol=${encodeURIComponent(selectedSymbol)}&range=${selectedRange}`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("chart")))
      .then((payload) => setChart(Array.isArray(payload.points) ? payload.points : []))
      .catch((error) => {
        if (error.name !== "AbortError") setChart([]);
      });
    return () => controller.abort();
  }, [selectedRange, selectedSymbol]);

  function submitAlert(event) {
    event.preventDefault();
    setCreated(true);
  }

  return (
    <section className={styles.dashboard} data-live-rule-monitoring="true">
      <div className={styles.monitorLayout}>
        <div className={styles.monitorCore}>
          <div className={styles.darkShell}>
            <div className={styles.marketBar}>
              <div><span className={styles.livePill}>●&nbsp; LIVE</span><strong>{statusLabel}</strong><time dateTime={clockTime || undefined}>{formatLiveMarketTime(clockTime)}</time></div>
              <div><span>NSE Cash</span><b>⌄</b><i><MiniPulse /></i></div>
            </div>

            <header className={styles.overviewHeader}>
              <div><h1>Your market, right now</h1><p>3 stocks are showing activity across your rules.</p></div>
              <div className={styles.overviewStats}>
                <span><b>3</b><strong>Active signals</strong><small>Needs attention</small></span>
                <span><b>1</b><strong>Approaching</strong><small>Keep watch</small></span>
                <span><b>2</b><strong>Monitoring</strong><small>All normal</small></span>
              </div>
            </header>

            <section className={styles.ruleMap} data-rule-summary="true" aria-label="Live rules across the market">
              <div className={styles.mapLabels}>
                <span><b>NORMAL</b><small>Everything is stable</small></span>
                <span><b>GETTING CLOSE</b><small>Approaching your level</small></span>
                <span><b>TRIGGERED</b><small>Your rule is activated</small></span>
              </div>
              <div className={styles.mapTrack}><i /><b>→</b></div>
              <RuleNode rule={icici} tone="#00b879" state="" caption="Monitoring" position="13%" />
              <RuleNode rule={wipro} tone="#00b879" state="" caption="Monitoring" position="29%" />
              <RuleNode rule={bpcl} tone="#ffad0d" state="" caption="1.4% away" position="56%" />
              <RuleNode rule={featured} tone="#ef173d" state="Triggered" caption="" position="86%" active />
            </section>
          </div>

          <article className={styles.signalCard} data-monitoring-featured-rule="true">
            <div className={styles.signalMain}>
              <span className={styles.breakoutBadge}>ϟ&nbsp; BREAKOUT DETECTED</span>
              <div className={styles.signalIdentity}><i>{featured.symbol.charAt(0)}</i><span><strong>{featured.symbol}</strong><small>NSE · Equity</small></span></div>
              <h2>Price crossed your breakout level.</h2>
              <p>Your rule was triggered</p>
              <div className={styles.signalChart} data-chart-engine="recharts" role="img" aria-label={`${featured.symbol} breakout trend`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 2, left: 4 }}>
                    <defs><linearGradient id="alertArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f00634" stopOpacity=".42" /><stop offset="100%" stopColor="#f00634" stopOpacity="0" /></linearGradient></defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,.12)" strokeDasharray="3 3" />
                    <YAxis hide domain={["dataMin - 18", "dataMax + 8"]} />
                    <Area type="monotone" dataKey="value" stroke="#f00634" strokeWidth={2.4} fill="url(#alertArea)" dot={false} activeDot={{ r: 3, fill: "#f00634", stroke: "#fff", strokeWidth: 1 }} isAnimationActive animationDuration={700} />
                  </AreaChart>
                </ResponsiveContainer>
                <span className={styles.chartLevel}>₹{breakout.toLocaleString("en-IN")}</span>
                <div className={styles.chartTimes}><span>09:15</span><span>09:45</span><span>10:15</span></div>
              </div>
            </div>
            <div className={styles.signalQuote}><small>CURRENT PRICE</small><strong>₹{featured.price}</strong><b>+{featured.change.replace(/^\+/, "")}</b><p>2.37% above your trigger</p></div>
            <div className={styles.signalRule}><span><small>YOUR RULE</small><strong>Breakout above ₹{breakout.toLocaleString("en-IN")}</strong></span><span><small>TRIGGERED</small><strong>2 minutes ago</strong><em>10:13 AM</em></span><a href={featured.href} target="_blank" rel="noreferrer">Review signal <b>→</b></a></div>
          </article>

          <div className={styles.lowerGrid}>
            <section className={styles.activityCard} data-rule-activity="true">
              <header><h2>What just happened</h2><p>Live activity feed</p></header>
              <ol>{ACTIVITY.map(([time, symbol, title, copy, state], index) => <li key={symbol}><i className={styles.activityDot}>{index === 0 ? "ϟ" : index === 1 ? "◷" : "⊙"}</i><time>{time}</time><p><strong>{symbol}</strong> {title}<small>{copy}</small></p><StateBadge>{state}</StateBadge></li>)}</ol>
              <a href="/stock-alerts?view=activity">View full activity <span>›</span></a>
            </section>

            <section className={styles.rulesCard}>
              <header><h2>Your rules in motion</h2><p>4 rules watching the market</p></header>
              <ol>{rules.map((rule, index) => {
                const state = index === 0 ? "TRIGGERED" : index === 1 ? "APPROACHING" : "MONITORING";
                const caption = index % 2 ? "Moving below support" : "Breakout above range";
                const isPaused = paused.includes(index);
                return <li data-watched-rule="true" key={rule.symbol}><i className={index === 0 ? styles.redRule : index === 1 ? styles.orangeRule : styles.greenRule}>{rule.symbol.charAt(0)}</i><p><strong>{rule.symbol}</strong><small>{caption}</small></p><span><StateBadge>{isPaused ? "UPDATED" : state}</StateBadge><small>{index === 0 ? rule.change : index === 1 ? "1.4% away" : "Watching"}</small></span><button type="button" aria-label={`${isPaused ? "Resume" : "Pause"} ${rule.symbol}`} onClick={() => onToggle(index)}>›</button></li>;
              })}</ol>
              <a href="/stock-alerts?view=rules">Manage rules <span>→</span></a>
            </section>
          </div>

          <footer className={styles.monitorFooter}><span><i><MiniPulse /></i><b>Stay ahead with smart monitoring<small>We’ll notify you the moment your conditions are met.</small></b></span><a href="/products">How it works&nbsp; ⊙</a></footer>
        </div>

        <aside className={styles.alertDock}>
          <section className={styles.integratedControls} data-integrated-alert-controls="true">
            <nav className={styles.alertTabs} aria-label="Alert workspace views">
              {ALERT_TABS.map((tab) => <button type="button" key={tab} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
            </nav>
            <div className={styles.alertToolbar}>
              <label><span>SYMBOL</span><select value={selectedSymbol} onChange={(event) => { setSelectedSymbol(event.target.value); setCreated(false); }}>{rules.map((rule) => <option value={rule.apiSymbol} key={rule.apiSymbol}>{rule.symbol} · NSE</option>)}</select></label>
              <div className={styles.timeframes} role="group" aria-label="Chart timeframe">{TIMEFRAMES.map(([label]) => <button type="button" key={label} aria-pressed={timeframe === label} onClick={() => { setTimeframe(label); setCreated(false); }}>{label}</button>)}</div>
              <span>Price alerts · {statusLabel}</span>
            </div>
          </section>

          {activeTab === "Create alert" ? (
            <form className={`${styles.signalComposer} ${styles.dockComposer}`} onSubmit={submitAlert}>
              <header><span><strong>Create price alert</strong><small>Build a live rule from the current quote</small></span><em>DRAFT</em></header>
              <div className={styles.composerFields}>
                <label><span>CONDITION</span><select value={condition} onChange={(event) => setCondition(event.target.value)}><option>Moves above</option><option>Moves below</option><option>Enters range</option></select></label>
                <label><span>VALUE</span><div><b>₹</b><input aria-label="Alert value" inputMode="decimal" value={ruleValue} onChange={(event) => setRuleValue(event.target.value.replace(/[^0-9.]/g, ""))} /></div></label>
                <label><span>FREQUENCY</span><select value={frequency} onChange={(event) => setFrequency(event.target.value)}><option>Once per event</option><option>Every cross</option><option>Daily</option></select></label>
                <label><span>EXPIRATION</span><select value={expiration} onChange={(event) => setExpiration(event.target.value)}><option>Open-ended</option><option>End of session</option><option>30 days</option></select></label>
              </div>
              <div className={styles.confirmClose}><button type="button" role="switch" aria-checked={confirmClose} onClick={() => setConfirmClose((value) => !value)}><i /></button><span><strong>Confirm on candle close</strong><small>Ignore temporary intrabar crosses</small></span></div>
              <div className={styles.delivery}><span>DELIVER TO</span><div>{["Web", "Email", "Messaging"].map((channel) => <button type="button" key={channel} aria-pressed={delivery === channel} onClick={() => setDelivery(channel)}>{channel}</button>)}</div></div>
              <div className={styles.ruleSentence}><i>●</i><span><p><b>{featured.symbol}</b> {condition.toLowerCase()} <b>₹{ruleValue || "—"}</b>{confirmClose ? " on candle close" : " immediately"}.</p><small>{frequency} · {delivery} · {expiration}</small></span></div>
              <button type="submit" className={styles.createAlert}><span>{created ? "Alert created" : "Create alert"}</span><b>{created ? "✓" : "→"}</b></button>
            </form>
          ) : (
            <aside className={`${styles.alertTabState} ${styles.dockTabState}`}><span>{activeTab === "Active alerts" ? "4" : activeTab === "Triggered" ? "1" : "✓"}</span><strong>{activeTab}</strong><p>{activeTab === "Active alerts" ? "Your live rules are being monitored now." : activeTab === "Triggered" ? `${featured.symbol} crossed its configured breakout level.` : "Candle confirmation and delivery preferences are enabled."}</p><button type="button" onClick={() => setActiveTab("Create alert")}>Back to create alert →</button></aside>
          )}
        </aside>
      </div>
    </section>
  );
}
