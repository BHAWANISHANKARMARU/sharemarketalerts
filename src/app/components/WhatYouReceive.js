import s from "./WhatYouReceive.module.css";
import FinancialChart from "./FinancialChart";

const SIGNAL_ROWS = [
  { icon: "trend", label: "Signal Type", value: "Breakout Long" },
  { icon: "entry", label: "Entry Zone", value: "2,880.00 – 2,900.00" },
  { icon: "target", label: "Target", value: "3,050.00", tone: "positive" },
  { icon: "search", label: "Stop Loss", value: "2,810.00", tone: "negative" },
  { icon: "shield", label: "Confidence Score", value: "87%", badge: "High", tone: "confidence" },
  { icon: "risk", label: "Risk Level", value: "Medium", tone: "warning" },
  { icon: "clock", label: "Time Horizon", value: "2–5 Trading Days" },
  { icon: "calendar", label: "Trigger Time", value: "26 Jun 2024, 09:25 AM" },
  { icon: "status", label: "Status", value: "Active", tone: "positive" },
];

const BENEFITS = [
  { icon: "bullseye", title: "Clear setup", lines: ["Every signal includes entry,", "target, and stop — no guesswork."] },
  { icon: "shield", title: "Defined risk", lines: ["Know your downside before", "you take the trade."] },
  { icon: "bolt", title: "Instant timing", lines: ["Get alerted the moment the", "market is ready."] },
  { icon: "chart", title: "Actionable levels", lines: ["Precise price levels you can", "act on immediately."] },
];

function Glyph({ kind }) {
  if (kind === "signal") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8.2a5.4 5.4 0 0 0 0 7.6M5.1 5.4a9.3 9.3 0 0 0 0 13.2M16 8.2a5.4 5.4 0 0 1 0 7.6m2.9-10.4a9.3 9.3 0 0 1 0 13.2" /><circle cx="12" cy="12" r="2" /></svg>;
  if (kind === "clock") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>;
  if (kind === "bullseye") return <svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="13" cy="15" r="9" /><circle cx="13" cy="15" r="5" /><circle cx="13" cy="15" r="1.5" /><path d="m15.5 12.5 7-7m-3.7.2 3.8-.2-.2 3.8" /></svg>;
  if (kind === "shield") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6.1c0 4.6-3.3 7.5-8 9.1-4.7-1.6-8-4.5-8-9.1V6l8-3.2Z" /><path d="m8.3 12 2.3 2.3 5.2-5.1" /></svg>;
  if (kind === "bolt") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.7 2-8 12h5.6L10.4 22l8-12h-5.7L13.7 2Z" /></svg>;
  if (kind === "chart") return <svg viewBox="0 0 26 26" aria-hidden="true"><path d="M4 21V11m6 10v-6m6 6V8m6 13V4" /><path d="m4 10 5-4 5 3 8-7m-4 0h4v4" /></svg>;
  if (kind === "target") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="13" r="7" /><circle cx="11" cy="13" r="3" /><path d="m13.4 10.6 6.4-6.4m-3.4.2 3.6-.2-.2 3.6" /></svg>;
  if (kind === "stop") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6.1c0 4.6-3.3 7.5-8 9.1-4.7-1.6-8-4.5-8-9.1V6l8-3.2Z" /><path d="M12 8v5m0 3v.1" /></svg>;
  if (kind === "risk") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6.1c0 4.6-3.3 7.5-8 9.1-4.7-1.6-8-4.5-8-9.1V6l8-3.2Z" /><path d="m8.3 12 2.3 2.3 5.2-5.1" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 5-2v4l4 2-4 2v4l-5-2-4 2v-4l-4-2 4-2V3l4 2Z" /></svg>;
}

function RowIcon({ kind }) {
  if (kind === "trend") return <path d="m3 14 4-5 3 2 6-7m-3 0h3v3" />;
  if (kind === "entry") return <><circle cx="9" cy="9" r="6" /><path d="M9 5v4l3 2" /></>;
  if (kind === "target") return <><circle cx="9" cy="9" r="6" /><circle cx="9" cy="9" r="2" /></>;
  if (kind === "search") return <><circle cx="8" cy="8" r="5" /><path d="m12 12 4 4" /></>;
  if (kind === "shield") return <><path d="m9 2 6 2.5v4.8c0 3.4-2.4 5.5-6 6.7-3.6-1.2-6-3.3-6-6.7V4.5L9 2Z" /><path d="m6.2 9 1.8 1.8 3.9-3.9" /></>;
  if (kind === "risk") return <><path d="m9 2 7 13H2L9 2Z" /><path d="M9 6.5v4m0 2v.1" /></>;
  if (kind === "clock") return <><circle cx="9" cy="9" r="6" /><path d="M9 5.5V9l2.5 1.5" /></>;
  if (kind === "calendar") return <><rect x="3" y="4" width="12" height="11" rx="2" /><path d="M6 2v4m6-4v4M3 8h12" /></>;
  return <><circle cx="9" cy="9" r="6" /><path d="m6.5 9 1.7 1.7 3.5-3.5" /></>;
}

function ConfidenceRing() {
  return (
    <div className={s.confidenceRing}>
      <svg viewBox="0 0 70 70" aria-hidden="true">
        <defs><linearGradient id="receive-confidence" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#006b3c" /><stop offset="1" stopColor="#00a76f" /></linearGradient></defs>
        <circle cx="35" cy="35" r="27" className={s.ringTrack} />
        <circle cx="35" cy="35" r="27" className={s.ringValue} pathLength="100" />
      </svg>
      <strong>87%</strong><span>Confidence</span>
    </div>
  );
}

function ConnectorMap() {
  return (
    <svg className={s.connectors} viewBox="0 0 994 553" aria-hidden="true">
      <g className={s.connectorLines}>
        <path d="M182 313h44" /><path d="M260 276v-27q0-13 13-13h77" /><path d="M350 236c35 0 34-42 68-42" /><path d="M338 347h13c31 0 31-42 67-42" />
        <path d="M757 139c13 0 14-19 33-19" /><path d="M757 211c15 0 13 24 32 24" /><path d="M757 343c14 0 12 11 31 11" />
      </g>
      <g className={s.connectorDots}>
        <circle cx="182" cy="313" r="2" /><circle cx="350" cy="236" r="2.7" /><circle cx="338" cy="347" r="2" /><circle cx="418" cy="194" r="2" /><circle cx="418" cy="305" r="2" /><circle cx="757" cy="139" r="2" /><circle cx="757" cy="211" r="2" /><circle cx="757" cy="343" r="2" />
      </g>
    </svg>
  );
}

function MomentumChart() {
  return (
    <FinancialChart
      className={s.momentumChart}
      points="2,64 8,51 14,55 20,44 26,50 32,46 38,32 44,35 50,49 56,53 62,40 68,31 74,37 80,23 86,27 92,18 98,10 104,25 110,5"
      width={146}
      height={82}
      tone="brand"
      label="Reliance price momentum"
      area
      marker
      grid
      showYAxis
      valueRange={[2820, 2940]}
      domainRange={[2780, 2980]}
      yTicks={[2820, 2860, 2900, 2940]}
      valuePrefix="₹"
    />
  );
}

function SignalRow({ icon, label, value, badge, tone }) {
  return (
    <div className={s.signalRow}>
      <svg className={s.rowIcon} viewBox="0 0 18 18" aria-hidden="true"><RowIcon kind={icon} /></svg>
      <span className={s.rowLabel}>{label}</span>
      <span className={`${s.rowValue} ${tone ? s[tone] : ""}`}>
        {tone === "confidence" && <i className={s.miniRing} aria-hidden="true" />}
        {tone === "positive" && label === "Status" && <i className={s.statusDot} aria-hidden="true" />}
        {value}{badge && <b>{badge}</b>}
      </span>
    </div>
  );
}

function SideCard({ className, icon, title, lines, value, delta, tone }) {
  return (
    <article className={`${s.sideCard} ${className}`}>
      <div className={`${s.sideTitle} ${tone ? s[tone] : ""}`}><span className={s.sideIcon}><Glyph kind={icon} /></span><h3>{title}</h3></div>
      <p>{lines.map((line) => <span key={line}>{line}</span>)}</p>
      {value && <div className={`${s.sideValue} ${tone ? s[tone] : ""}`}><strong>{value}</strong>{delta && <span>{delta}</span>}</div>}
      {tone === "warning" && <span className={s.mediumPill}>MEDIUM</span>}
    </article>
  );
}

function Dashboard() {
  return (
    <article className={s.dashboard} aria-label="RELIANCE breakout signal">
      <div className={s.dashboardHeader}>
        <span className={s.signalKicker}><Glyph kind="signal" />BREAKOUT SIGNAL</span><span className={s.activePill}>ACTIVE <i /></span>
        <h3>RELIANCE</h3><p>NSE: RELIANCE</p>
      </div>
      <div className={s.signalRows}>{SIGNAL_ROWS.map((row) => <SignalRow key={row.label} {...row} />)}</div>
      <div className={s.chartPanel}><div className={s.panelHeading}><span>PRICE MOMENTUM</span><b>2D</b></div><MomentumChart /></div>
      <div className={s.rewardPanel}>
        <h4>TRADE RISK / REWARD</h4>
        <div className={s.rewardNumbers}><span><b>RISK</b><strong>70.00 (2.4%)</strong></span><span><b>REWARD</b><strong>150.00 (5.2%)</strong></span></div>
        <div className={s.rewardBar}><i /><b /></div><p>1 : 2.1</p>
      </div>
    </article>
  );
}

export default function WhatYouReceive() {
  return (
    <section
      className={s.section}
      data-section="what-you-receive"
      aria-labelledby="what-you-receive-title"
    >
      <div className={s.canvas}>
        <header className={s.introHeader}>
          <p className={s.eyebrow}>WHAT YOU RECEIVE</p>
          <h2 id="what-you-receive-title">Everything you need,<br />in one <em>decisive signal.</em></h2>
          <p className={s.introCopy}><span>A complete setup with entry, target, risk and confidence —</span><span>ready to act on in seconds.</span></p>
        </header>
        <ConnectorMap />
        <article className={s.confidenceCard}>
          <div className={s.cardHeading}><Glyph kind="spark" /><h3>CONFIDENCE</h3></div>
          <p><span>High-probability setups</span><span>backed by AI & data.</span></p><ConfidenceRing />
        </article>
        <article className={s.timingCard}>
          <div className={s.cardHeading}><Glyph kind="clock" /><h3>TIMING</h3></div>
          <p><span>Alerts delivered the</span><span>moment conditions align.</span></p><div className={s.trigger}><i />Triggered at <strong>09:25 AM</strong></div>
        </article>
        <Dashboard />
        <SideCard className={s.targetCard} icon="target" title="TARGET" lines={["Clearly defined upside", "with reward potential."]} value="3,050.00" delta="+5.2%" tone="positive" />
        <SideCard className={s.stopCard} icon="stop" title="STOP LOSS" lines={["Pre-defined protection", "to manage downside."]} value="2,810.00" delta="-2.4%" tone="negative" />
        <SideCard className={s.riskCard} icon="risk" title="RISK LEVEL" lines={["Every signal includes", "a clear risk rating."]} tone="warning" />
        <div className={`${s.dotGrid} ${s.dotGridLeft}`} aria-hidden="true" /><div className={`${s.dotGrid} ${s.dotGridRight}`} aria-hidden="true" />
        <div className={s.benefitRail}>
          {BENEFITS.map((benefit) => <article className={s.benefit} key={benefit.title}><span className={s.benefitIcon}><Glyph kind={benefit.icon} /></span><div><h3>{benefit.title}</h3><p>{benefit.lines.map((line) => <span key={line}>{line}</span>)}</p></div></article>)}
        </div>
      </div>
    </section>
  );
}
