import s from "./HowItWorks.module.css";
import FinancialChart from "./FinancialChart";

const MARKET_INPUTS = [
  {
    kind: "price",
    title: "Price Action",
    lines: ["Real-time charts, patterns", "and momentum shifts"],
  },
  {
    kind: "volume",
    title: "Volume & Flow",
    lines: ["Smart money activity", "and volume anomalies"],
  },
  {
    kind: "sector",
    title: "Sector Moves",
    lines: ["Relative strength across", "sectors and industries"],
  },
  {
    kind: "macro",
    title: "Macro & News",
    lines: ["Economic indicators", "and event-driven signals"],
  },
];

const VALUE_PROPS = [
  {
    kind: "speed",
    title: "Speed to Edge",
    lines: ["From market signal to alert", "in under 1 second."],
  },
  {
    kind: "precision",
    title: "Precision First",
    lines: ["High-probability only.", "No noise. No guesswork."],
  },
  {
    kind: "risk",
    title: "Risk Aware",
    lines: ["Every signal is scored,", "sized, and stress-tested."],
  },
  {
    kind: "improve",
    title: "Always Improving",
    lines: ["Models adapt in real-time", "as markets evolve."],
  },
];

function InputIcon({ kind }) {
  if (kind === "price") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 21.5v-8m5 12V8.5m5 10V12m5 11V6.5m5 10v-5" />
        <circle cx="6" cy="12" r="1.5" />
        <circle cx="11" cy="20" r="1.5" />
        <circle cx="16" cy="11" r="1.5" />
        <circle cx="21" cy="16" r="1.5" />
        <circle cx="26" cy="10" r="1.5" />
        <path d="m6 12 5 8 5-9 5 5 5-6" />
      </svg>
    );
  }

  if (kind === "volume") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="20" width="4" height="7" rx="1.5" />
        <rect x="12" y="15" width="4" height="12" rx="1.5" />
        <rect x="19" y="10" width="4" height="17" rx="1.5" />
        <rect x="26" y="5" width="3" height="22" rx="1.5" />
      </svg>
    );
  }

  if (kind === "sector") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 5a11 11 0 1 0 11 11H16V5Z" />
        <path d="M19 5.5A9.5 9.5 0 0 1 26.5 13H19V5.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="7" y="5" width="18" height="22" rx="2.5" />
      <path d="M11 11h10M11 16h10M11 21h7" />
    </svg>
  );
}

function InputVisual({ kind }) {
  if (kind === "price") {
    return (
      <FinancialChart
        className={s.priceVisual}
        points="1,30 6,23 10,27 15,11 19,21 24,17 28,24 33,11 37,22 42,14 47,17 52,5 57,14 63,4"
        width={64}
        height={35}
        tone="brand"
        label="Price action trend"
        area
      />
    );
  }

  if (kind === "volume") {
    const bars = [14, 23, 31, 19, 17, 11, 16, 14, 20, 27];
    return (
      <span className={s.volumeVisual} aria-hidden="true">
        {bars.map((height, index) => (
          <i key={`${height}-${index}`} style={{ height }} />
        ))}
      </span>
    );
  }

  if (kind === "sector") {
    return (
      <span className={s.heatmap} aria-hidden="true">
        {Array.from({ length: 48 }, (_, index) => (
          <i key={index} style={{ opacity: 0.1 + (((index * 7) % 13) / 18) }} />
        ))}
      </span>
    );
  }

  return (
    <span className={s.impact} aria-hidden="true">
      <b>24</b>
      <span>
        High Impact
        <br />
        Events Today
      </span>
    </span>
  );
}

function ConnectorMap() {
  return (
    <svg className={s.connectors} viewBox="0 0 994 553" aria-hidden="true">
      <g className={s.connectorLines}>
        <path d="M284 191h20q12 0 12 12v50q0 12 12 12h28" />
        <path d="M284 261h19q13 0 13 13v9q0 12 12 12h28" />
        <path d="M284 331h20q12 0 12-8h12q0 0 0 0h28" />
        <path d="M284 400h14q18 0 18-18v-17q0-12 12-12h28" />

        <path d="M619 266h20q14 0 14-14v-44q0-16 16-16h11" />
        <path d="M619 295h18q16 0 16 16v8q0 14 14 14h13" />
        <path d="M619 324h19q15 0 15 15v19q0 13 13 13h14" />
        <path d="M619 353h20q14 0 14 14v43q0 12 12 12h15" />
      </g>
      <g className={s.connectorDots}>
        <circle cx="284" cy="191" r="2" />
        <circle cx="284" cy="261" r="2" />
        <circle cx="284" cy="331" r="2" />
        <circle cx="284" cy="400" r="2" />
        <circle cx="356" cy="265" r="2.6" />
        <circle cx="356" cy="295" r="2.6" />
        <circle cx="356" cy="323" r="2.6" />
        <circle cx="356" cy="353" r="2.6" />
        <circle cx="619" cy="266" r="2.6" />
        <circle cx="619" cy="295" r="2.6" />
        <circle cx="619" cy="324" r="2.6" />
        <circle cx="619" cy="353" r="2.6" />
        <circle cx="680" cy="192" r="2" />
        <circle cx="680" cy="333" r="2" />
        <circle cx="680" cy="371" r="2" />
        <circle cx="680" cy="422" r="2" />
      </g>
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.2 4.4A3.4 3.4 0 0 0 6 7.7a3.2 3.2 0 0 0-1.8 4.9A3.6 3.6 0 0 0 7.5 18c.5 1.4 1.6 2.2 2.7 2.2V4.4Zm3.6 0A3.4 3.4 0 0 1 18 7.7a3.2 3.2 0 0 1 1.8 4.9 3.6 3.6 0 0 1-3.3 5.4c-.5 1.4-1.6 2.2-2.7 2.2V4.4Z" />
      <path d="M7.2 9.4c1.7.1 2.5.9 3 2.2m6.6-2.2c-1.7.1-2.5.9-3 2.2M7.5 15c1.3-.5 2.2-.3 2.7.5m6.3-.5c-1.3-.5-2.2-.3-2.7.5" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 13h4l2.2-6 3.2 11 2.7-8 2.2 5H22" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8 20 6v6.1c0 4.6-3.3 7.5-8 9.1-4.7-1.6-8-4.5-8-9.1V6l8-3.2Z" />
      <path d="m8.2 12 2.4 2.4 5.3-5.3" />
    </svg>
  );
}

function CoreMark() {
  return (
    <svg className={s.coreMark} viewBox="0 0 54 48" aria-hidden="true">
      <defs>
        <linearGradient id="core-a" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#5a13ff" />
          <stop offset=".52" stopColor="#a942ff" />
          <stop offset="1" stopColor="#6418ff" />
        </linearGradient>
        <filter id="core-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="m27 3 21 38-17-6-22 8L27 3Zm0 11-8 19 12-4 8 3-12-18Z" fill="url(#core-a)" filter="url(#core-glow)" />
    </svg>
  );
}

function OutcomeChart() {
  return (
    <FinancialChart
      className={s.outcomeChart}
      points="1,42 8,34 15,38 23,23 31,36 39,31 47,20 55,32 63,27 71,35 79,17 86,4 93,28 101,23 105,28"
      width={105}
      height={48}
      tone="brand"
      label="AI signal price trend"
      area
    />
  );
}

function ScoreRing() {
  return (
    <svg className={s.scoreRing} viewBox="0 0 54 54" aria-hidden="true">
      <circle cx="27" cy="27" r="21" fill="none" stroke="#e5d8ff" strokeWidth="6" />
      <circle cx="27" cy="27" r="21" fill="none" stroke="#7810f4" strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="87 13" transform="rotate(-90 27 27)" />
    </svg>
  );
}

function Stars() {
  return (
    <span className={s.stars} aria-label="Four out of five stars">
      {[0, 1, 2, 3, 4].map((index) => (
        <svg key={index} className={index === 4 ? s.starEmpty : s.starFull} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 2.6 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.6Z" />
        </svg>
      ))}
    </span>
  );
}

function DeliveryIcons() {
  return (
    <div className={s.deliveryIcons}>
      <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 18 5-5 3 2 7-9m-5 0h5v5" /></svg>
        <b>Entry</b>
      </span>
      <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3" /></svg>
        <b>Target</b>
      </span>
      <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v6.1c0 4.6-3.3 7.5-8 9.1-4.7-1.6-8-4.5-8-9.1V6l8-3.2Z" /><path d="m8.2 12 2.4 2.4 5.3-5.3" /></svg>
        <b>SL</b>
      </span>
      <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v14m12-14v14M3 7h6m6 0h6M4 18h4m8 0h4M12 4v16" /><path d="m8 7-3 6h6L8 7Zm8 0-3 6h6l-3-6Z" /></svg>
        <b>R:R</b>
      </span>
    </div>
  );
}

function ValueIcon({ kind }) {
  if (kind === "speed") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true">
        <defs><filter id="bolt-glow"><feGaussianBlur stdDeviation="2" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <path d="m19 2-9 17h7l-2 13 10-18h-7l1-12Z" fill="currentColor" stroke="none" filter="url(#bolt-glow)" />
      </svg>
    );
  }

  if (kind === "precision") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true">
        <circle cx="17" cy="17" r="10" /><circle cx="17" cy="17" r="3" /><path d="M17 2v6m0 18v6M2 17h6m18 0h6" />
      </svg>
    );
  }

  if (kind === "risk") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true">
        <path d="M17 2.5 28 7v8.5c0 7-4.6 11.6-11 14-6.4-2.4-11-7-11-14V7l11-4.5Z" /><path d="m11.5 16.5 3.6 3.6 7.4-7.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="11" strokeDasharray="5 4" /><path d="m24 7 4 1-1 4" /><path d="M26.5 9A12 12 0 0 1 28 17" />
    </svg>
  );
}

function AnalysisNode({ className, icon, title, lines }) {
  return (
    <div className={`${s.analysisNode} ${className}`}>
      <span className={s.analysisIcon}>{icon}</span>
      <strong>{title}</strong>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-section="how-it-works"
      className={s.section}
      aria-labelledby="how-it-works-title"
    >
      <div className={s.canvas}>
        <header className={s.header}>
          <p className={s.eyebrow}>HOW IT WORKS</p>
          <h2 id="how-it-works-title">
            How signals become <em>conviction.</em>
          </h2>
          <p className={s.intro}>
            <span>We combine real-time market data, advanced AI, and risk-aware validation</span>
            <span>to surface high-probability opportunities you can act on with confidence.</span>
          </p>
        </header>

        <ConnectorMap />

        <div className={s.inputs}>
          <div className={s.columnHeading}>
            <h3>MARKET INPUTS</h3>
            <p>Always on. Always learning.</p>
          </div>
          <div className={s.inputCards}>
            {MARKET_INPUTS.map((item) => (
              <article key={item.kind} className={s.inputCard}>
                <span className={s.inputIcon}><InputIcon kind={item.kind} /></span>
                <span className={s.inputCopy}>
                  <strong>{item.title}</strong>
                  {item.lines.map((line) => <span key={line}>{line}</span>)}
                </span>
                <InputVisual kind={item.kind} />
              </article>
            ))}
          </div>
        </div>

        <div className={s.engine}>
          <div className={`${s.columnHeading} ${s.engineHeading}`}>
            <h3>AI DECISION ENGINE</h3>
            <p>Analyze. Validate. Prioritize.</p>
          </div>

          <div className={s.decisionCircle} data-decision-circle="true">
            <div className={s.orbit} aria-hidden="true">
              <span className={s.orbitGlow} />
              <span className={`${s.ring} ${s.ringOne}`} />
              <span className={`${s.ring} ${s.ringTwo}`} />
              <span className={`${s.ring} ${s.ringThree}`} />
              <i className={`${s.orbitDot} ${s.dotTop}`} />
              <i className={`${s.orbitDot} ${s.dotRight}`} />
              <i className={`${s.orbitDot} ${s.dotBottom}`} />
              <i className={`${s.orbitDot} ${s.dotLeft}`} />
            </div>

            <AnalysisNode
              className={s.probability}
              icon={<BrainIcon />}
              title="PROBABILITY"
              lines={["24/7 AI models", "ensemble scoring"]}
            />
            <AnalysisNode
              className={s.trend}
              icon={<PulseIcon />}
              title="TREND STRENGTH"
              lines={["Momentum & regime", "confirmation"]}
            />
            <AnalysisNode
              className={s.riskCalibration}
              icon={<ShieldIcon />}
              title="RISK CALIBRATION"
              lines={["Volatility, liquidity &", "drawdown control"]}
            />

            <div className={s.core}>
              <CoreMark />
              <strong>ShareMarketAlerts</strong>
              <span>Intelligence Core</span>
            </div>
          </div>

          <div className={s.validation}>
            <span className={s.validationShield}><ShieldIcon /></span>
            <span>
              <strong>Backtested. Stress Tested. Continuously Learning.</strong>
              <small>Every signal is tested across thousands of market scenarios.</small>
            </span>
          </div>
        </div>

        <div className={s.outcomes}>
          <div className={s.columnHeading}>
            <h3>ACTIONABLE OUTCOME</h3>
            <p>Clarity you can act on.</p>
          </div>

          <article className={s.alertCard}>
            <div className={s.alertTop}>
              <span className={s.alertLabel}><PulseIcon /> AI SIGNAL ALERT</span>
              <span className={s.conviction}>High Conviction</span>
            </div>
            <strong className={s.alertName}>NIFTY 26 JUN 24600 CE</strong>
            <div className={s.alertData}>
              <span className={s.alertPrice}>247.85</span>
              <span className={s.alertGain}>+18.65%</span>
              <OutcomeChart />
            </div>
            <div className={s.alertMeta}>
              <span>2m ago</span><i /><span>Breakout</span><i /><span>High Probability</span>
            </div>
          </article>

          <article className={`${s.outcomeCard} ${s.confidenceCard}`}>
            <span className={s.outcomeCopy}>
              <strong>CONFIDENCE SCORE</strong>
              <span>Model agreement</span>
              <span>across 247+ signals</span>
            </span>
            <span className={s.score}><ScoreRing /><b>87%</b></span>
          </article>

          <article className={`${s.outcomeCard} ${s.qualityCard}`}>
            <span className={s.outcomeCopy}>
              <strong>OPPORTUNITY QUALITY</strong>
              <span>Risk-adjusted edge</span>
              <span>vs. market baseline</span>
            </span>
            <Stars />
          </article>

          <article className={`${s.outcomeCard} ${s.receiveCard}`}>
            <span className={s.outcomeCopy}>
              <strong>WHAT YOU RECEIVE</strong>
              <span>Clear setups, levels,</span>
              <span>timing & risk guidance</span>
            </span>
            <DeliveryIcons />
          </article>
        </div>

        <div className={s.values}>
          {VALUE_PROPS.map((item) => (
            <article key={item.kind} className={s.valueItem}>
              <span className={s.valueIcon}><ValueIcon kind={item.kind} /></span>
              <span className={s.valueCopy}>
                <strong>{item.title}</strong>
                {item.lines.map((line) => <span key={line}>{line}</span>)}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
