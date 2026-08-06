import assert from "node:assert/strict";
import test from "node:test";

const COPY = [
  "WHAT YOU RECEIVE",
  "Everything you need, in one decisive signal.",
  "A complete setup with entry, target, risk and confidence —",
  "ready to act on in seconds.",
  "CONFIDENCE",
  "High-probability setups",
  "backed by AI & data.",
  "87%",
  "Confidence",
  "TIMING",
  "Alerts delivered the",
  "moment conditions align.",
  "Triggered at 09:25 AM",
  "BREAKOUT SIGNAL",
  "ACTIVE",
  "RELIANCE",
  "NSE: RELIANCE",
  "Signal Type",
  "Breakout Long",
  "Entry Zone",
  "2,880.00 – 2,900.00",
  "Target",
  "3,050.00",
  "Stop Loss",
  "2,810.00",
  "Confidence Score",
  "High",
  "Risk Level",
  "Medium",
  "Time Horizon",
  "2–5 Trading Days",
  "Trigger Time",
  "26 Jun 2024, 09:25 AM",
  "Status",
  "Active",
  "PRICE MOMENTUM",
  "2D",
  "TRADE RISK / REWARD",
  "RISK",
  "REWARD",
  "70.00 (2.4%)",
  "150.00 (5.2%)",
  "1 : 2.1",
  "TARGET",
  "Clearly defined upside",
  "with reward potential.",
  "+5.2%",
  "STOP LOSS",
  "Pre-defined protection",
  "to manage downside.",
  "-2.4%",
  "RISK LEVEL",
  "Every signal includes",
  "a clear risk rating.",
  "MEDIUM",
  "Clear setup",
  "Every signal includes entry,",
  "target, and stop — no guesswork.",
  "Defined risk",
  "Know your downside before",
  "you take the trade.",
  "Instant timing",
  "Get alerted the moment the",
  "market is ready.",
  "Actionable levels",
  "Precise price levels you can",
  "act on immediately.",
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

test("the homepage renders the complete What You Receive section after How It Works", async () => {
  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);

  const visible = toVisibleText(await response.text());

  for (const text of COPY) {
    assert.ok(visible.includes(text), `Missing: ${text}`);
  }

  assert.ok(
    visible.indexOf("Everything you need, in one decisive signal.") >
      visible.indexOf("How signals become conviction."),
    "What You Receive must render below How It Works",
  );
});
