"use client";

import { useEffect, useMemo, useState } from "react";
import FinancialChart from "../FinancialChart";
import { InstrumentMark } from "./WorkspacePrimitives";
import s from "./TradingWorkspace.module.css";
import a from "./StockAlertsWorkspace.module.css";

const TABS = ["Create alert", "Active alerts", "Triggered", "Settings"];
const TIMEFRAMES = [
  ["1m", "1D"],
  ["5m", "1D"],
  ["15m", "5D"],
  ["1h", "1M"],
  ["1D", "1Y"],
];

function chartPoints(series, width = 900, height = 330) {
  const values = series.map((point) => Number(point?.value)).filter(Number.isFinite);
  if (values.length < 2) return "0,165 900,165";
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = Math.max(maximum - minimum, 1);

  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - minimum) / span) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

function compactSymbols(quotes) {
  const seen = new Set();
  return quotes.filter((quote) => {
    const symbol = quote?.symbol;
    if (!symbol || seen.has(symbol)) return false;
    seen.add(symbol);
    return true;
  });
}

export default function AlertRuleWorkspace({ quotes = [], statusLabel = "Markets Closed" }) {
  const options = useMemo(() => compactSymbols(quotes), [quotes]);
  const [activeTab, setActiveTab] = useState("Create alert");
  const [selectedSymbol, setSelectedSymbol] = useState(options[0]?.symbol || "ADANIENT.NS");
  const [timeframe, setTimeframe] = useState("15m");
  const [chart, setChart] = useState([]);
  const [condition, setCondition] = useState("Moves above");
  const [ruleValue, setRuleValue] = useState("3065");
  const [frequency, setFrequency] = useState("Once per event");
  const [expiration, setExpiration] = useState("Open-ended");
  const [confirmClose, setConfirmClose] = useState(true);
  const [delivery, setDelivery] = useState("Messaging");
  const [created, setCreated] = useState(false);

  const selectedQuote = options.find((quote) => quote.symbol === selectedSymbol) || options[0];
  const selectedTimeframe = TIMEFRAMES.find(([label]) => label === timeframe) || TIMEFRAMES[2];
  const selectedRange = selectedTimeframe[1];
  const displaySymbol = selectedQuote?.displaySymbol || selectedSymbol.replace(/\.(NS|BO)$/i, "");
  const currentValue = Number(selectedQuote?.value);
  const formattedValue = selectedQuote?.formattedValue || (Number.isFinite(currentValue)
    ? currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—");
  const formattedChange = selectedQuote?.formattedChange || "—";
  const chartLine = useMemo(() => chartPoints(chart), [chart]);

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
    <section className={a.ruleWorkspace} data-alert-rule-workspace="true" id="alert-workspace">
      <header className={a.ruleWorkspaceIntro}>
        <div>
          <span>AUTOMATED MARKET MONITORING</span>
          <h2>Alert workspace</h2>
          <p>Create precise market rules, preserve context and control exactly when it reaches you.</p>
        </div>
        <div className={a.ruleWorkspaceStatus}><i /><span><strong>{statusLabel}</strong><small>Live · Yahoo Finance</small></span></div>
      </header>

      <nav className={a.ruleWorkspaceTabs} aria-label="Alert workspace views">
        {TABS.map((tab) => <button type="button" key={tab} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </nav>

      {activeTab === "Create alert" ? (
        <>
          <div className={a.ruleToolbar}>
            <label>
              <span>SYMBOL</span>
              <select value={selectedSymbol} onChange={(event) => { setSelectedSymbol(event.target.value); setCreated(false); }}>
                {options.map((quote) => <option value={quote.symbol} key={quote.symbol}>{quote.displaySymbol || quote.symbol} · NSE</option>)}
              </select>
            </label>
            <div className={a.timeframePicker} role="group" aria-label="Chart timeframe">
              {TIMEFRAMES.map(([label]) => <button type="button" key={label} aria-pressed={timeframe === label} onClick={() => { setTimeframe(label); setCreated(false); }}>{label}</button>)}
            </div>
            <span>Price alerts · {statusLabel}</span>
          </div>

          <div className={`${s.alertWorkbench} ${a.workbench}`}>
            <article className={`${s.alertChartPanel} ${a.chartPanel}`}>
              <header className={a.chartHeader}>
                <div><InstrumentMark symbol={selectedSymbol} /><span><strong>{displaySymbol} · live session</strong><small>NSE · Yahoo Finance chart</small></span></div>
                <span>{formattedChange}</span>
              </header>
              <div className={`${s.alertQuote} ${a.quote}`}><span>LAST PRICE</span><strong>₹{formattedValue}</strong><small>Rule level <b>₹{ruleValue || "—"}</b></small></div>
              <FinancialChart className={`${s.premiumChart} ${a.workspaceChart}`} points={chartLine} width={900} height={400} tone="brand" label={`${displaySymbol} live Yahoo Finance price chart`} area grid tooltip />
              <div className={`${s.alertChartAxis} ${a.chartAxis}`}><span>09:15</span><span>11:00</span><span>13:00</span><span>15:30</span></div>
            </article>

            <form className={`${s.ruleComposer} ${a.composer}`} onSubmit={submitAlert}>
              <header className={a.composerHeader}><div><h3>Create price alert</h3><p>Build a live rule from the current quote</p></div><span>DRAFT</span></header>
              <div className={`${s.ruleFields} ${a.ruleFields}`}>
                <label><span>CONDITION</span><select value={condition} onChange={(event) => setCondition(event.target.value)}><option>Moves above</option><option>Moves below</option><option>Enters range</option></select></label>
                <label><span>VALUE</span><div><b>₹</b><input inputMode="decimal" value={ruleValue} onChange={(event) => setRuleValue(event.target.value.replace(/[^0-9.]/g, ""))} /></div></label>
                <label><span>FREQUENCY</span><select value={frequency} onChange={(event) => setFrequency(event.target.value)}><option>Once per event</option><option>Every cross</option><option>Daily</option></select></label>
                <label><span>EXPIRATION</span><select value={expiration} onChange={(event) => setExpiration(event.target.value)}><option>Open-ended</option><option>End of session</option><option>30 days</option></select></label>
              </div>
              <div className={`${s.confirmRule} ${a.confirmRule}`}><button type="button" role="switch" aria-checked={confirmClose} onClick={() => setConfirmClose((value) => !value)}><i /></button><span><strong>Confirm on candle close</strong><small>Ignore temporary intrabar crosses</small></span></div>
              <div className={`${s.deliveryPicker} ${a.deliveryPicker}`}><span>DELIVER TO</span><div>{["Web", "Email", "Messaging"].map((channel) => <button type="button" key={channel} aria-pressed={delivery === channel} onClick={() => setDelivery(channel)}>{channel}</button>)}</div></div>
              <div className={`${s.ruleSentence} ${a.ruleSentence}`}><i>●</i><p><b>{displaySymbol}</b> {condition.toLowerCase()} <b>₹{ruleValue || "—"}</b>{confirmClose ? " on candle close" : " immediately"}.</p><small>{frequency} · {delivery} · {expiration}</small></div>
              <button type="submit" className={`${s.createAlertButton} ${a.createAlertButton}`}><span>{created ? "Alert created" : "Create alert"}</span><b>{created ? "✓" : "→"}</b></button>
              <p className={a.formStatus} aria-live="polite">{created ? `${displaySymbol} rule is now active.` : "Uses the latest Yahoo Finance quote and chart data."}</p>
            </form>
          </div>
        </>
      ) : (
        <div className={a.ruleTabPanel}>
          <div><span>{activeTab === "Active alerts" ? "4" : activeTab === "Triggered" ? "1" : "✓"}</span><h3>{activeTab}</h3><p>{activeTab === "Active alerts" ? "Your live price, breakout and support rules are being monitored." : activeTab === "Triggered" ? "ADANIENT crossed its configured breakout level during the latest session." : "Candle confirmation, cooldown and delivery preferences are enabled."}</p></div>
          <button type="button" onClick={() => setActiveTab("Create alert")}>Back to create alert →</button>
        </div>
      )}
    </section>
  );
}
