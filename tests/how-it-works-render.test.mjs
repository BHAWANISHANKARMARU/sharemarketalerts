import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const COPY = [
  "HOW IT WORKS",
  "How signals become conviction.",
  "We combine real-time market data, advanced AI, and risk-aware validation",
  "to surface high-probability opportunities you can act on with confidence.",
  "MARKET INPUTS",
  "Always on. Always learning.",
  "Price Action",
  "Real-time charts, patterns",
  "and momentum shifts",
  "Volume & Flow",
  "Smart money activity",
  "and volume anomalies",
  "Sector Moves",
  "Relative strength across",
  "sectors and industries",
  "Macro & News",
  "Economic indicators",
  "and event-driven signals",
  "AI DECISION ENGINE",
  "Analyze. Validate. Prioritize.",
  "PROBABILITY",
  "24/7 AI models",
  "ensemble scoring",
  "TREND STRENGTH",
  "Momentum & regime",
  "confirmation",
  "RISK CALIBRATION",
  "Volatility, liquidity &",
  "drawdown control",
  "ShareMarketAlerts",
  "Intelligence Core",
  "Backtested. Stress Tested. Continuously Learning.",
  "Every signal is tested across thousands of market scenarios.",
  "ACTIONABLE OUTCOME",
  "Clarity you can act on.",
  "AI SIGNAL ALERT",
  "High Conviction",
  "NIFTY 26 JUN 24600 CE",
  "247.85",
  "+18.65%",
  "2m ago",
  "Breakout",
  "High Probability",
  "CONFIDENCE SCORE",
  "Model agreement",
  "across 247+ signals",
  "87%",
  "OPPORTUNITY QUALITY",
  "Risk-adjusted edge",
  "vs. market baseline",
  "WHAT YOU RECEIVE",
  "Clear setups, levels,",
  "timing & risk guidance",
  "Entry",
  "Target",
  "SL",
  "R:R",
  "Speed to Edge",
  "From market signal to alert",
  "in under 1 second.",
  "Precision First",
  "High-probability only.",
  "No noise. No guesswork.",
  "Risk Aware",
  "Every signal is scored,",
  "sized, and stress-tested.",
  "Always Improving",
  "Models adapt in real-time",
  "as markets evolve.",
];

function toVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

test("the homepage renders the complete How It Works section below the hero", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);

  const html = await response.text();
  const visible = toVisibleText(html);

  for (const text of COPY) {
    assert.ok(visible.includes(text), `Missing: ${text}`);
  }

  assert.ok(
    visible.indexOf("HOW IT WORKS") >
      visible.indexOf("TRUSTED BY TRADERS ACROSS THE GLOBE"),
    "How It Works must render below the complete hero",
  );

  const section = html.match(
    /<section[^>]+aria-labelledby="how-it-works-title"[\s\S]*?<\/section>/,
  );
  assert.ok(section, "Missing labelled How It Works section");

  const circleStart = section[0].indexOf('data-decision-engine="true"');
  const validationStart = section[0].indexOf(
    "Backtested. Stress Tested. Continuously Learning.",
    circleStart,
  );
  assert.ok(circleStart >= 0, "Missing isolated AI decision engine");
  assert.ok(
    validationStart > circleStart,
    "Validation strip must follow the decision circle",
  );

  const circleHtml = section[0].slice(circleStart, validationStart);
  for (const text of [
    "PROBABILITY",
    "TREND STRENGTH",
    "RISK CALIBRATION",
    "ShareMarketAlerts",
    "Intelligence Core",
  ]) {
    assert.ok(
      toVisibleText(circleHtml).includes(text),
      "Decision circle is missing: " + text,
    );
  }
  assert.ok(!toVisibleText(circleHtml).includes("AI DECISION ENGINE"));
  assert.ok(
    !toVisibleText(circleHtml).includes(
      "Backtested. Stress Tested. Continuously Learning.",
    ),
  );
});

test("How It Works uses a readable three-stage pipeline", async () => {
  const css = await readFile(new URL("../src/app/components/HowItWorks.module.css", import.meta.url), "utf8");

  assert.match(css, /\.section\s*\{[^}]*--how-olive:\s*#657f2d/s);
  assert.match(css, /\.workflow\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*\.95fr\)\s*minmax\(320px,\s*1fr\)\s*minmax\(0,\s*1\.15fr\)/s);
  assert.match(css, /\.inputs,\.engine,\.outcomes\s*\{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*\.96\)/s);
  assert.match(css, /\.decisionPanel\s*\{[^}]*border-radius:\s*18px/s);
  assert.match(css, /\.analysisGrid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /\.analysisNode\s*\{[^}]*border-left:\s*2px solid var\(--how-olive\)/s);
  assert.match(css, /\.outcomes\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.alertCard\s*\{[^}]*min-height:\s*246px/s);
  assert.match(css, /\.inputCopy>span\s*\{[^}]*font-size:\s*13px/s);
  assert.match(css, /\.analysisNode>span:not\(\.analysisIcon\)\s*\{[^}]*font-size:\s*12px/s);
  assert.match(css, /\.priceVisual path,[\s\S]*\.outcomeChart path\s*\{[^}]*stroke:\s*var\(--how-olive\)\s*!important/s);
  assert.match(css, /\.core\s*\{[\s\S]*linear-gradient\([^;]*#718b35[^;]*#526a23/s);
  assert.match(css, /\.outcomeCard\s*\{[^}]*border:\s*1px solid var\(--how-border\)/s);
  assert.match(css, /\.alertCard\s*\{[^}]*background:\s*linear-gradient\([^;]*#536c23[^;]*#34451a/s);
  assert.match(css, /@media\s*\(max-width:\s*1100px\)[\s\S]*\.workflow\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test("How It Works communicates a literal collect validate alert flow", async () => {
  const source = await readFile(new URL("../src/app/components/HowItWorks.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/app/components/HowItWorks.module.css", import.meta.url), "utf8");

  assert.match(source, /01 · COLLECT/);
  assert.match(source, /02 · VALIDATE/);
  assert.match(source, /03 · ALERT/);
  assert.match(css, /\.inputs::after,[\s\S]*\.engine::after\s*\{[^}]*content:\s*"→"/s);
  assert.match(css, /\.stageVerb\s*\{[^}]*font-size:\s*12px/s);
});
