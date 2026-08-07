# Investment Ecosystem Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five valuable research and investment-planning workspaces, then connect them contextually to the existing six analytical pages without changing the homepage or primary navbar.

**Architecture:** Keep every App Router `page.js` as a Server Component that exports metadata, and isolate stateful filters, calculators, and local portfolio state inside focused Client Components under `src/app/components/investing/`. Reuse the existing site header and platform primitives, preserve `MarketDataProvider` only where live quotes are consumed, and keep all educational/illustrative catalogues separate from deterministic pure calculator functions.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2.4, CSS Modules, Recharts 3.10.1, Node 22 built-in test runner, ESLint 9.

## Global Constraints

- Do not change the homepage or its layout.
- Keep the existing primary navbar destinations unchanged.
- Preserve the existing Next.js App Router architecture, responsive behavior, live market provider, Recharts implementation, and business logic.
- New destinations are reached through the Products workspace and contextual links inside existing inner pages.
- Do not simulate account creation, KYC, deposits, withdrawals, broker connectivity, or real order placement.
- Do not present illustrative values as live market facts.
- Every non-live dataset must be labelled as illustrative, educational, or planning-only.
- Keep Manrope typography, compact borders, restrained blue accents, semantic green/red states, and the existing light analytical workspace.
- Mobile controls must remain readable: 16px form controls, at least 12px utility text, 44px minimum primary touch targets, and no document-level horizontal overflow.
- Use `next/link` for internal SPA navigation and retain the seven entries in `NAV_ITEMS` exactly as they are.
- Keep Server Components as the default; add `"use client"` only to interactive component entry points.
- Do not add a new dependency or external market-data provider.

---

## File Structure

### New files

- `src/lib/investing/calculators.js` — pure, deterministic planning formulas and numeric input normalization.
- `src/app/components/investing/investmentData.js` — explicitly illustrative product catalogues, option-chain rows, portfolio demo holdings, and educational content.
- `src/app/components/investing/InvestmentPrimitives.js` — reusable headers, tabs, metric strips, toolbars, tables, calculator fields, result summaries, and disclosures.
- `src/app/components/investing/InvestmentWorkspace.module.css` — the shared responsive visual system for only the five new workspaces.
- `src/app/components/investing/MutualFundsExperience.js` — fund screener, comparison, SIP/goal planner, NFO education, and fund-selection guidance.
- `src/app/components/investing/EtfsBondsExperience.js` — ETF screener, bond comparison, ladder planning, asset-allocation guidance, and risk education.
- `src/app/components/investing/StrategyPayoffChart.js` — premium Recharts payoff visual with semantic profit/loss treatment and accessible labelling.
- `src/app/components/investing/FuturesOptionsExperience.js` — illustrative option chain, strategy payoff builder, futures overview, commodities directory, and leverage disclosure.
- `src/app/components/investing/CalculatorsExperience.js` — eight deterministic planning calculators in a single interactive workspace.
- `src/app/components/investing/PortfolioExperience.js` — local demo holdings, allocation, concentration, live watchlist, events, and goals.
- `src/app/mutual-funds/page.js` — static App Router route and metadata.
- `src/app/etfs-bonds/page.js` — static App Router route and metadata.
- `src/app/futures-options/page.js` — static App Router route and metadata.
- `src/app/calculators/page.js` — static App Router route and metadata.
- `src/app/portfolio/page.js` — revalidated Server Component route that injects the existing live market snapshot.
- `tests/investment-calculators.test.mjs` — formula, validation, and boundary tests.
- `tests/investment-routes-render.test.mjs` — route, content, truthfulness, navigation, and responsive source-contract tests.

### Existing files to modify

- `src/app/components/platform/ProductsExperience.js` — add the complete Research, Investing, Trading, Automation, and Planning directory.
- `src/app/components/platform/MarketsExperience.js` — add contextual ETF, bond, fund, event, and derivatives entry points.
- `src/app/components/platform/IpoExperience.js` — add subscription education, allotment workflow guidance, and watchlist/portfolio handoff.
- `src/app/components/platform/InsightsExperience.js` — add beginner-to-advanced investing learning paths.
- `src/app/components/platform/StockAlertsExperience.js` — add clearly distinguished event/reminder alert templates.
- `src/app/components/platform/LiveMarketsExperience.js` — add ETF, derivatives, event, and portfolio handoffs.
- `src/app/components/platform/TradingWorkspace.module.css` — style only the contextual additions to existing workspaces.
- `tests/platform-routes-render.test.mjs` — lock the primary navigation and existing live-provider behavior while asserting new contextual destinations.

---

### Task 1: Deterministic Investment Calculator Engine

**Files:**
- Create: `src/lib/investing/calculators.js`
- Create: `tests/investment-calculators.test.mjs`

**Interfaces:**
- Consumes: plain numeric input objects from `CalculatorsExperience`, `MutualFundsExperience`, `EtfsBondsExperience`, and `FuturesOptionsExperience`.
- Produces: `clampNumber(value, minimum, maximum, fallback)`, `calculateSip(input)`, `calculateLumpSum(input)`, `calculateSwp(input)`, `calculateCagr(input)`, `calculateTransactionCosts(input)`, `calculateMargin(input)`, and `calculateGoal(input)`.
- All money results are finite numbers rounded to two decimal places. Rates are entered as annual percentages, not decimals.

- [ ] **Step 1: Write the failing formula tests**

```js
import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateCagr,
  calculateGoal,
  calculateLumpSum,
  calculateMargin,
  calculateSip,
  calculateSwp,
  calculateTransactionCosts,
  clampNumber,
} from "../src/lib/investing/calculators.js";

test("clamps invalid calculator input to safe finite boundaries", () => {
  assert.equal(clampNumber("", 1, 100, 10), 10);
  assert.equal(clampNumber(-4, 1, 100, 10), 1);
  assert.equal(clampNumber(140, 1, 100, 10), 100);
});

test("calculates SIP, lump-sum, SWP, CAGR, and goal projections", () => {
  assert.deepEqual(calculateSip({ monthly: 10000, annualRate: 12, years: 10 }), {
    invested: 1200000,
    estimatedValue: 2300386.89,
    gains: 1100386.89,
  });
  assert.deepEqual(calculateLumpSum({ principal: 100000, annualRate: 12, years: 10 }), {
    invested: 100000,
    estimatedValue: 310584.82,
    gains: 210584.82,
  });
  assert.equal(calculateSwp({ principal: 100000, monthlyWithdrawal: 2000, annualRate: 8, years: 5 }).remainingValue, 2030.86);
  assert.equal(calculateCagr({ initialValue: 100000, finalValue: 200000, years: 5 }).cagr, 14.87);
  assert.equal(calculateGoal({ target: 5000000, current: 0, annualRate: 12, years: 10 }).requiredMonthly, 21735.47);
});

test("calculates transparent transaction-cost and margin estimates", () => {
  assert.deepEqual(calculateTransactionCosts({ buyValue: 100000, sellValue: 105000 }), {
    turnover: 205000,
    brokerage: 40,
    taxesAndFees: 137.72,
    totalCost: 177.72,
    netProceeds: 104822.28,
  });
  assert.deepEqual(calculateMargin({ price: 22500, lotSize: 25, lots: 2, marginRate: 12.5 }), {
    notionalValue: 1125000,
    estimatedMargin: 140625,
  });
});

test("returns safe zero states for mathematically invalid projections", () => {
  assert.deepEqual(calculateCagr({ initialValue: 0, finalValue: 100, years: 5 }), { cagr: 0 });
  assert.equal(calculateGoal({ target: 100000, current: 120000, annualRate: 10, years: 5 }).requiredMonthly, 0);
});
```

- [ ] **Step 2: Run the tests to verify the module is missing**

Run: `node --test tests/investment-calculators.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/investing/calculators.js`.

- [ ] **Step 3: Implement the formulas with explicit assumptions**

```js
const money = (value) => Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;

export function clampNumber(value, minimum, maximum, fallback = minimum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

export function calculateSip({ monthly, annualRate, years }) {
  const payment = clampNumber(monthly, 0, 10_000_000, 0);
  const months = Math.round(clampNumber(years, 0, 80, 0) * 12);
  const rate = clampNumber(annualRate, 0, 100, 0) / 1200;
  const invested = payment * months;
  const estimatedValue = rate === 0 ? invested : payment * (((1 + rate) ** months - 1) / rate);
  return { invested: money(invested), estimatedValue: money(estimatedValue), gains: money(estimatedValue - invested) };
}

export function calculateLumpSum({ principal, annualRate, years }) {
  const invested = clampNumber(principal, 0, 1_000_000_000, 0);
  const rate = clampNumber(annualRate, 0, 100, 0) / 100;
  const horizon = clampNumber(years, 0, 80, 0);
  const estimatedValue = invested * (1 + rate) ** horizon;
  return { invested: money(invested), estimatedValue: money(estimatedValue), gains: money(estimatedValue - invested) };
}

export function calculateSwp({ principal, monthlyWithdrawal, annualRate, years }) {
  const startingValue = clampNumber(principal, 0, 1_000_000_000, 0);
  const withdrawal = clampNumber(monthlyWithdrawal, 0, 10_000_000, 0);
  const months = Math.round(clampNumber(years, 0, 80, 0) * 12);
  const rate = clampNumber(annualRate, 0, 100, 0) / 1200;
  const growth = (1 + rate) ** months;
  const remainingValue = rate === 0 ? startingValue - withdrawal * months : startingValue * growth - withdrawal * ((growth - 1) / rate);
  return { startingValue: money(startingValue), withdrawn: money(withdrawal * months), remainingValue: money(Math.max(0, remainingValue)) };
}

export function calculateCagr({ initialValue, finalValue, years }) {
  const start = clampNumber(initialValue, 0, 1_000_000_000, 0);
  const end = clampNumber(finalValue, 0, 1_000_000_000, 0);
  const horizon = clampNumber(years, 0, 80, 0);
  if (start === 0 || end === 0 || horizon === 0) return { cagr: 0 };
  return { cagr: money(((end / start) ** (1 / horizon) - 1) * 100) };
}

export function calculateTransactionCosts({ buyValue, sellValue }) {
  const buy = clampNumber(buyValue, 0, 1_000_000_000, 0);
  const sell = clampNumber(sellValue, 0, 1_000_000_000, 0);
  const turnover = buy + sell;
  const brokerage = Math.min(20, buy * 0.0003) + Math.min(20, sell * 0.0003);
  const stt = sell * 0.001;
  const exchangeAndRegulatory = turnover * 0.0000435;
  const gst = (brokerage + exchangeAndRegulatory) * 0.18;
  const stampDuty = buy * 0.00015;
  const taxesAndFees = stt + exchangeAndRegulatory + gst + stampDuty;
  return { turnover: money(turnover), brokerage: money(brokerage), taxesAndFees: money(taxesAndFees), totalCost: money(brokerage + taxesAndFees), netProceeds: money(sell - brokerage - taxesAndFees) };
}

export function calculateMargin({ price, lotSize, lots, marginRate }) {
  const notionalValue = clampNumber(price, 0, 100_000_000, 0) * clampNumber(lotSize, 1, 100_000, 1) * clampNumber(lots, 1, 10_000, 1);
  const estimatedMargin = notionalValue * clampNumber(marginRate, 0, 100, 0) / 100;
  return { notionalValue: money(notionalValue), estimatedMargin: money(estimatedMargin) };
}

export function calculateGoal({ target, current, annualRate, years }) {
  const targetValue = clampNumber(target, 0, 1_000_000_000, 0);
  const currentValue = clampNumber(current, 0, 1_000_000_000, 0);
  const months = Math.round(clampNumber(years, 0, 80, 0) * 12);
  const rate = clampNumber(annualRate, 0, 100, 0) / 1200;
  const futureCurrent = currentValue * (1 + rate) ** months;
  const gap = Math.max(0, targetValue - futureCurrent);
  const requiredMonthly = months === 0 ? gap : rate === 0 ? gap / months : gap * rate / ((1 + rate) ** months - 1);
  return { target: money(targetValue), projectedCurrent: money(futureCurrent), fundingGap: money(gap), requiredMonthly: money(requiredMonthly) };
}
```

- [ ] **Step 4: Run the calculator tests and adjust only if the documented formulas disagree with the assertions**

Run: `node --test tests/investment-calculators.test.mjs`

Expected: PASS, 4 tests.

- [ ] **Step 5: Commit the calculator engine**

```bash
git add src/lib/investing/calculators.js tests/investment-calculators.test.mjs
git commit -m "feat: add deterministic investment calculators"
```

---

### Task 2: Shared Investment Data Contracts and Workspace Primitives

**Files:**
- Create: `src/app/components/investing/investmentData.js`
- Create: `src/app/components/investing/InvestmentPrimitives.js`
- Create: `src/app/components/investing/InvestmentWorkspace.module.css`
- Create: `tests/investment-routes-render.test.mjs`

**Interfaces:**
- Consumes: `WorkspaceBreadcrumbs`, `PanelHeading`, and `InstrumentMark` from `../platform/WorkspacePrimitives`; `Link` from `next/link`.
- Produces: `INVESTMENT_DESTINATIONS`, `FUND_CATEGORIES`, `MUTUAL_FUNDS`, `ETF_BOND_ROWS`, `OPTION_CHAIN_ROWS`, `FUTURES_ROWS`, `PORTFOLIO_HOLDINGS`, `CORPORATE_EVENTS`, `INVESTMENT_LEARNING_PATHS`, `EVENT_ALERT_TEMPLATES`.
- Produces: `InvestmentWorkspaceHeader`, `ProductCategoryTabs`, `MetricStrip`, `ScreenerToolbar`, `ComparisonTable`, `CalculatorField`, `ResultBreakdown`, and `DisclosureNote`.

- [ ] **Step 1: Write the failing shared-contract tests**

```js
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, ROOT), "utf8");

test("investment workspace exposes reusable, accessible primitives", async () => {
  const source = await read("src/app/components/investing/InvestmentPrimitives.js");
  for (const name of ["InvestmentWorkspaceHeader", "ProductCategoryTabs", "MetricStrip", "ScreenerToolbar", "ComparisonTable", "CalculatorField", "ResultBreakdown", "DisclosureNote"]) {
    assert.match(source, new RegExp(`export function ${name}`));
  }
  assert.match(source, /aria-pressed/);
  assert.match(source, /aria-label/);
  assert.match(source, /overflow/i);
});

test("illustrative catalogues have stable explicit data contracts", async () => {
  const source = await read("src/app/components/investing/investmentData.js");
  for (const name of ["INVESTMENT_DESTINATIONS", "MUTUAL_FUNDS", "ETF_BOND_ROWS", "OPTION_CHAIN_ROWS", "PORTFOLIO_HOLDINGS", "CORPORATE_EVENTS"]) {
    assert.match(source, new RegExp(`export const ${name}`));
  }
  assert.match(source, /Illustrative/);
  assert.doesNotMatch(source, /guaranteed return/i);
});

test("investment workspace styles contain mobile and table safeguards", async () => {
  await access(new URL("src/app/components/investing/InvestmentWorkspace.module.css", ROOT));
  const styles = await read("src/app/components/investing/InvestmentWorkspace.module.css");
  assert.match(styles, /font-family:\s*var\(--font-manrope\)/);
  assert.match(styles, /overflow-x:\s*auto/);
  assert.match(styles, /@media \(max-width:\s*700px\)/);
  assert.match(styles, /font-size:\s*16px/);
  assert.match(styles, /min-height:\s*44px/);
  assert.doesNotMatch(styles, /font-size:\s*[6-9]px/);
});
```

- [ ] **Step 2: Run the contract tests to verify the shared files are absent**

Run: `node --test tests/investment-routes-render.test.mjs`

Expected: FAIL with file-not-found errors for the investing component directory.

- [ ] **Step 3: Create explicit illustrative catalogue records**

Use these exact shapes in `investmentData.js` and include at least the named records shown below:

```js
export const INVESTMENT_DESTINATIONS = [
  { title: "Mutual Funds", href: "/mutual-funds", group: "Investing", mark: "MF", description: "Screen funds, compare costs and model SIP goals." },
  { title: "ETFs & Bonds", href: "/etfs-bonds", group: "Investing", mark: "EB", description: "Compare exchange-traded diversification and fixed income." },
  { title: "Futures & Options", href: "/futures-options", group: "Trading", mark: "FO", description: "Study chains, payoffs, futures basis and leverage risk." },
  { title: "Calculators", href: "/calculators", group: "Planning", mark: "CA", description: "Model SIPs, goals, withdrawals, costs and margin." },
  { title: "Portfolio", href: "/portfolio", group: "Planning", mark: "PF", description: "Review holdings, allocation, concentration and events." },
];

export const FUND_CATEGORIES = ["All funds", "Equity", "Debt", "Hybrid", "Index", "ELSS", "International"];

export const MUTUAL_FUNDS = [
  { id: "broad-index", name: "Broad Market Index Fund", category: "Index", risk: "High", horizon: "5+ years", planType: "Direct", expenseRatio: 0.2, minimumInvestment: 500, oneYear: 12.4, threeYear: 15.1 },
  { id: "flexi-equity", name: "Flexi Cap Equity Fund", category: "Equity", risk: "Very high", horizon: "5+ years", planType: "Regular", expenseRatio: 0.64, minimumInvestment: 1000, oneYear: 14.8, threeYear: 17.2 },
  { id: "short-duration", name: "Short Duration Debt Fund", category: "Debt", risk: "Moderate", horizon: "Under 3 years", planType: "Direct", expenseRatio: 0.34, minimumInvestment: 500, oneYear: 7.1, threeYear: 6.8 },
  { id: "balanced-hybrid", name: "Balanced Hybrid Fund", category: "Hybrid", risk: "High", horizon: "3–5 years", planType: "Regular", expenseRatio: 0.58, minimumInvestment: 1000, oneYear: 10.6, threeYear: 12.2 },
  { id: "tax-saver", name: "Equity Linked Savings Fund", category: "ELSS", risk: "Very high", horizon: "5+ years", planType: "Direct", expenseRatio: 0.71, minimumInvestment: 500, oneYear: 13.3, threeYear: 16.4 },
  { id: "global-equity", name: "Global Equity Feeder Fund", category: "International", risk: "Very high", horizon: "5+ years", planType: "Regular", expenseRatio: 0.92, minimumInvestment: 1000, oneYear: 11.8, threeYear: 13.7 },
].map((fund) => ({ ...fund, sourceLabel: "Illustrative planning example" }));

export const ETF_BOND_ROWS = [
  { id: "index-etf", kind: "Index ETF", name: "Nifty 50 Index ETF", symbol: "NIFTYETF", priceNavGap: 0.08, expenseRatio: 0.06, trackingDifference: 0.18, liquidity: "High", yield: null, maturity: "Open-ended", risk: "High" },
  { id: "gold-etf", kind: "Gold ETF", name: "Domestic Gold ETF", symbol: "GOLDETF", priceNavGap: -0.12, expenseRatio: 0.5, trackingDifference: 0.62, liquidity: "High", yield: null, maturity: "Open-ended", risk: "High" },
  { id: "silver-etf", kind: "Silver ETF", name: "Domestic Silver ETF", symbol: "SILVERETF", priceNavGap: 0.22, expenseRatio: 0.56, trackingDifference: 0.71, liquidity: "Medium", yield: null, maturity: "Open-ended", risk: "Very high" },
  { id: "international-etf", kind: "International ETF", name: "Global 100 Index ETF", symbol: "GLOBAL100", priceNavGap: 0.31, expenseRatio: 0.48, trackingDifference: 0.83, liquidity: "Medium", yield: null, maturity: "Open-ended", risk: "Very high" },
  { id: "debt-etf", kind: "Debt ETF", name: "Target Maturity Debt ETF", symbol: "TMDEBT", priceNavGap: -0.05, expenseRatio: 0.16, trackingDifference: 0.24, liquidity: "Medium", yield: 7.02, maturity: "2031", risk: "Moderate" },
  { id: "gsec-2034", kind: "Government bond", name: "Government Security 2034", symbol: "GSEC34", priceNavGap: null, expenseRatio: null, trackingDifference: null, liquidity: "Medium", yield: 7.08, maturity: "2034", risk: "Sovereign" },
  { id: "aaa-2029", kind: "Corporate bond", name: "AAA Corporate Bond 2029", symbol: "AAA29", priceNavGap: null, expenseRatio: null, trackingDifference: null, liquidity: "Medium", yield: 7.72, maturity: "2029", risk: "Low credit risk" },
].map((instrument) => ({ ...instrument, sourceLabel: "Illustrative comparison" }));

export const OPTION_CHAIN_ROWS = [22400, 22450, 22500, 22550, 22600].map((strike, index) => ({
  strike,
  callOi: 182000 + index * 31000,
  callLtp: 248 - index * 44,
  putLtp: 38 + index * 39,
  putOi: 146000 + (4 - index) * 27000,
  isAtTheMoney: strike === 22500,
  sourceLabel: "Illustrative chain",
}));

export const FUTURES_ROWS = [
  { contract: "NIFTY AUG", spot: 22502.35, futures: 22547.1, basis: 44.75, lotSize: 25, expiry: "27 Aug" },
  { contract: "BANKNIFTY AUG", spot: 48214.6, futures: 48308.2, basis: 93.6, lotSize: 15, expiry: "27 Aug" },
];

export const PORTFOLIO_HOLDINGS = [
  { symbol: "RELIANCE", asset: "Equity", sector: "Energy", quantity: 24, averageCost: 2860, demoPrice: 2987.4 },
  { symbol: "TCS", asset: "Equity", sector: "Technology", quantity: 18, averageCost: 3780, demoPrice: 3912.1 },
  { symbol: "NIFTYETF", asset: "ETF", sector: "Diversified", quantity: 120, averageCost: 244.2, demoPrice: 252.8 },
  { symbol: "INDEX FUND", asset: "Mutual fund", sector: "Diversified", quantity: 410, averageCost: 182.5, demoPrice: 194.1 },
  { symbol: "GSEC34", asset: "Bond", sector: "Fixed income", quantity: 50, averageCost: 101.1, demoPrice: 102.4 },
  { symbol: "CASH", asset: "Cash", sector: "Cash", quantity: 1, averageCost: 50000, demoPrice: 50000 },
].map((holding) => ({ ...holding, sourceLabel: "Local demo holding" }));

export const CORPORATE_EVENTS = [
  { date: "12 Aug", symbol: "TCS", event: "Earnings", action: "Review position size before results" },
  { date: "16 Aug", symbol: "RELIANCE", event: "Dividend", action: "Verify ex-date and cashflow" },
  { date: "18 Aug", symbol: "WATCHLIST", event: "Split", action: "Verify ratio and record date" },
  { date: "19 Aug", symbol: "WATCHLIST", event: "Bonus", action: "Review record date and eligibility" },
  { date: "21 Aug", symbol: "WATCHLIST", event: "IPO milestone", action: "Review listing-day liquidity" },
  { date: "25 Aug", symbol: "WATCHLIST", event: "Buyback", action: "Review terms, window and tax treatment" },
];

export const INVESTMENT_LEARNING_PATHS = [
  ["01", "Fund foundations", "Mutual funds, NAV, expense ratios and risk labels", "/mutual-funds"],
  ["02", "Exchange-traded building blocks", "ETFs, bonds, liquidity and tracking difference", "/etfs-bonds"],
  ["03", "Derivatives risk", "Payoffs, leverage, expiry and assignment", "/futures-options"],
  ["04", "Portfolio construction", "Allocation, concentration, rebalancing and goals", "/portfolio"],
];

export const EVENT_ALERT_TEMPLATES = [
  ["Earnings reminder", "Event", "Educational reminder"],
  ["Dividend ex-date", "Event", "Educational reminder"],
  ["Split or bonus", "Corporate action", "Educational reminder"],
  ["Buyback window", "Corporate action", "Educational reminder"],
  ["IPO milestone", "Primary market", "Educational reminder"],
  ["SIP plan review", "Planning", "Local reminder"],
  ["Concentration warning", "Portfolio", "Local demo warning"],
];
```

- [ ] **Step 4: Create reusable semantic primitives**

Implement the exact component signatures from the Interfaces block. `ComparisonTable` must accept columns shaped as `{ key, label, render? }`, use `caption`, put the table inside `styles.tableScroller`, and use `rowKey` to produce stable keys. `CalculatorField` must render a visible label, optional prefix/suffix, numeric input, optional `min`/`max`/`step`, and optional hint. `DisclosureNote` must render `role="note"` and default its label to `Planning note`.

```js
"use client";

import Link from "next/link";
import { WorkspaceBreadcrumbs } from "../platform/WorkspacePrimitives";
import styles from "./InvestmentWorkspace.module.css";

export function InvestmentWorkspaceHeader({ eyebrow, title, description, breadcrumbs, actions }) {
  return (
    <>
      <WorkspaceBreadcrumbs items={breadcrumbs} />
      <section className={styles.workspaceHeader}>
        <div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
        {actions && <div className={styles.headerActions}>{actions}</div>}
      </section>
    </>
  );
}

export function ProductCategoryTabs({ items, active, onChange, label }) {
  return <div className={styles.categoryTabs} role="group" aria-label={label}>{items.map((item) => <button type="button" key={item} aria-pressed={item === active} onClick={() => onChange(item)}>{item}</button>)}</div>;
}

export function MetricStrip({ items }) {
  return <section className={styles.metricStrip} aria-label="Workspace summary">{items.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></article>)}</section>;
}

export function ScreenerToolbar({ children, label }) {
  return <section className={styles.screenerToolbar} aria-label={label}>{children}</section>;
}

export function ComparisonTable({ caption, columns, rows, rowKey = "id" }) {
  return <div className={styles.tableScroller} data-table-overflow="contained"><table className={styles.comparisonTable}><caption>{caption}</caption><thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[rowKey]}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : row[column.key] ?? "—"}</td>)}</tr>)}</tbody></table></div>;
}

export function CalculatorField({ label, value, onChange, prefix, suffix, hint, min = 0, max, step = 1 }) {
  return <label className={styles.calculatorField}><span>{label}</span><div>{prefix && <b>{prefix}</b>}<input type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(event) => onChange(event.target.value)} />{suffix && <b>{suffix}</b>}</div>{hint && <small>{hint}</small>}</label>;
}

export function ResultBreakdown({ title, value, items, tone = "blue" }) {
  return <aside className={styles.resultBreakdown} data-tone={tone}><span>{title}</span><strong>{value}</strong><dl>{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></aside>;
}

export function DisclosureNote({ label = "Planning note", children }) {
  return <div className={styles.disclosureNote} role="note"><strong>{label}</strong><p>{children}</p></div>;
}

export function WorkspaceLink({ href, children }) {
  return <Link className={styles.workspaceLink} href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}
```

- [ ] **Step 5: Add the shared CSS Module foundation**

Implement `.workspacePage`, `.canvas`, `.workspaceHeader`, `.headerActions`, `.categoryTabs`, `.metricStrip`, `.screenerToolbar`, `.comparisonTable`, `.tableScroller`, `.calculatorField`, `.resultBreakdown`, `.disclosureNote`, `.workspaceLink`, `.panel`, `.sectionHeader`, `.twoColumn`, `.threeColumn`, `.directoryGrid`, `.riskBadge`, and `.emptyState`. Use the spec values: white workspace, `#131722`, `#6a6d78`, `#2962ff`, `#089981`, `#f23645`, 1px `#e0e3eb`, 12px panel radius, tabular numerals, sticky table headers, restrained row hover, and restrained shadows only on lifted controls. At `max-width: 700px`, set form controls to 16px, utility copy to at least 12px, primary controls to at least 44px, collapse multi-column grids to one column, and keep tables internally scrollable.

- [ ] **Step 6: Run shared contract tests**

Run: `node --test tests/investment-routes-render.test.mjs`

Expected: PASS, 3 tests.

- [ ] **Step 7: Commit the shared investment foundation**

```bash
git add src/app/components/investing/investmentData.js src/app/components/investing/InvestmentPrimitives.js src/app/components/investing/InvestmentWorkspace.module.css tests/investment-routes-render.test.mjs
git commit -m "feat: add investment workspace foundation"
```

---

### Task 3: Mutual Funds Research and SIP Planning Workspace

**Files:**
- Create: `src/app/components/investing/MutualFundsExperience.js`
- Create: `src/app/mutual-funds/page.js`
- Modify: `tests/investment-routes-render.test.mjs`

**Interfaces:**
- Consumes: `FUND_CATEGORIES`, `MUTUAL_FUNDS`; `calculateSip`, `calculateGoal`; every shared primitive from Task 2; `SiteHeader`.
- Produces: `<MutualFundsExperience />` with `data-mutual-funds-workspace`, controlled category/risk/query filters, a controlled SIP planner, and internal links to `/calculators`, `/portfolio`, and `/etfs-bonds`.

- [ ] **Step 1: Add the failing route and content test**

```js
test("mutual funds route provides screening, planning, and education", async () => {
  const route = await read("src/app/mutual-funds/page.js");
  const source = await read("src/app/components/investing/MutualFundsExperience.js");
  assert.match(route, /metadata/);
  assert.match(route, /MutualFundsExperience/);
  for (const marker of ["data-mutual-funds-workspace", "Fund screener", "Compare funds", "SIP planner", "Goal projection", "NFO tracker", "AMC directory", "How to choose a fund", "Tax and risk notes"]) assert.match(source, new RegExp(marker));
  assert.match(source, /Illustrative planning example/);
  assert.match(source, /calculateSip/);
  assert.match(source, /calculateGoal/);
});
```

- [ ] **Step 2: Run the focused test to confirm the route is absent**

Run: `node --test --test-name-pattern="mutual funds route" tests/investment-routes-render.test.mjs`

Expected: FAIL with file-not-found for `src/app/mutual-funds/page.js`.

- [ ] **Step 3: Build the interactive mutual-fund experience**

Use `useMemo` to filter `MUTUAL_FUNDS` by query, category, risk, horizon, and plan type. The horizon control offers `Under 3 years`, `3–5 years`, and `5+ years`; the plan-type control offers `Direct` and `Regular`, with all local examples defaulting to Direct and a clear educational comparison of the two plan structures. Use controlled defaults of ₹10,000 monthly, 12% assumed annual return, 10 years, ₹50,00,000 target, and ₹5,00,000 current corpus. Render, in order:

1. `SiteHeader` and `InvestmentWorkspaceHeader` with breadcrumb `Products / Mutual Funds`.
2. Category tabs and four metrics: tracked examples, lowest cost, SIP default, planning horizon.
3. A `ScreenerToolbar` containing a labelled search input plus category, risk, horizon, and plan-type selects.
4. `Compare funds` using `ComparisonTable` columns for fund, category, risk, expense ratio, minimum investment, 1Y scenario, and 3Y scenario.
5. `SIP planner` with `CalculatorField` controls and a `ResultBreakdown` for invested value, estimated value, and estimated gain.
6. `Goal projection` using `calculateGoal`, then feeding its required monthly amount into `calculateSip` to show total contributions, estimated value, and estimated gain alongside a link to the full calculator workspace.
7. `NFO tracker` with a `Planning-only` badge, a three-step NFO evaluation checklist, and no invented live offer dates.
8. `AMC directory` containing twelve neutral asset-manager categories rather than brand endorsement.
9. `How to choose a fund` with suitability, consistency, cost, and portfolio-overlap checks.
10. `Tax and risk notes` covering market risk, debt duration/credit risk, ELSS lock-in, and tax-rule verification.
11. `DisclosureNote` stating: `Fund names and return figures on this page are illustrative planning examples, not live schemes, recommendations, or guaranteed outcomes.`

If the filters produce no rows, render `No illustrative funds match these filters. Reset category, risk, horizon, and plan type.` with a reset button.

Use the shared CSS classes and add only page-specific selectors to `InvestmentWorkspace.module.css` if the listed sections need unique grid sizing.

- [ ] **Step 4: Create the Server Component route**

```js
import MutualFundsExperience from "../components/investing/MutualFundsExperience";

export const metadata = {
  title: "Mutual Funds Research — ShareMarketAlerts",
  description: "Screen fund categories, compare costs and model SIP and goal scenarios.",
};

export default function MutualFundsPage() {
  return <MutualFundsExperience />;
}
```

- [ ] **Step 5: Run the mutual-fund test and calculator regression**

Run: `node --test --test-name-pattern="mutual funds route" tests/investment-routes-render.test.mjs && node --test tests/investment-calculators.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the mutual-fund workspace**

```bash
git add src/app/mutual-funds/page.js src/app/components/investing/MutualFundsExperience.js src/app/components/investing/InvestmentWorkspace.module.css tests/investment-routes-render.test.mjs
git commit -m "feat: add mutual funds research workspace"
```

---

### Task 4: ETFs and Bonds Comparison Workspace

**Files:**
- Create: `src/app/components/investing/EtfsBondsExperience.js`
- Create: `src/app/etfs-bonds/page.js`
- Modify: `src/app/components/investing/InvestmentWorkspace.module.css`
- Modify: `tests/investment-routes-render.test.mjs`

**Interfaces:**
- Consumes: `ETF_BOND_ROWS`; `calculateLumpSum`; shared primitives and `SiteHeader`.
- Produces: `<EtfsBondsExperience />` with `data-etfs-bonds-workspace`, asset-class filters, an ETF/bond comparison, and controlled bond-ladder allocation inputs.

- [ ] **Step 1: Add the failing ETF and bond route test**

```js
test("ETFs and bonds route covers exchange-traded and fixed-income research", async () => {
  const route = await read("src/app/etfs-bonds/page.js");
  const source = await read("src/app/components/investing/EtfsBondsExperience.js");
  assert.match(route, /EtfsBondsExperience/);
  for (const marker of ["data-etfs-bonds-workspace", "ETF screener", "Compare ETFs and bonds", "Bond ladder planner", "Allocation lab", "Tracking difference", "Fixed-income risk checklist"]) assert.match(source, new RegExp(marker));
  assert.match(source, /Illustrative comparison/);
  assert.match(source, /href="\/portfolio"/);
});
```

- [ ] **Step 2: Run the focused test to confirm failure**

Run: `node --test --test-name-pattern="ETFs and bonds route" tests/investment-routes-render.test.mjs`

Expected: FAIL with file-not-found for the route.

- [ ] **Step 3: Build the ETF and bond experience**

Render the following complete hierarchy:

1. Header and breadcrumb `Products / ETFs & Bonds`.
2. Tabs: `All instruments`, `Index ETFs`, `Gold ETFs`, `Silver ETFs`, `International ETFs`, `Debt ETFs`, `Government bonds`, `Corporate bonds`.
3. Metrics: four illustrative instruments, minimum expense ratio, highest example yield, and current ladder duration.
4. `ETF screener` with liquidity, risk, and instrument-type controls.
5. `Compare ETFs and bonds` table with name/symbol, kind, price/NAV gap, cost, tracking difference, yield, maturity, liquidity, and risk.
6. `Bond ladder planner` with short/medium/long maturity buckets, total capital input, editable illustrative yield per bucket, and allocation percentages that always sum to 100 through a normalization function local to the component.
7. `Allocation lab` using `calculateLumpSum` to compare an equity-like 12% example against a fixed-income-like 7% example; label both as scenarios.
8. An ETF due-diligence checklist for spread, assets, traded volume, index construction, tracking difference, and expense ratio.
9. `Fixed-income risk checklist` for duration, reinvestment, credit, liquidity, and taxation.
10. Links to `/markets`, `/stock-alerts`, and `/portfolio`.
11. Disclosure text: `Instrument names, yields, costs, tracking figures and maturity values are illustrative comparisons; verify live exchange and issuer information before acting.`

If the ETF/bond filters produce no rows, render `No illustrative instruments match this view. Clear filters to restore the comparison.` with a clear action.

- [ ] **Step 4: Create the Server Component route**

```js
import EtfsBondsExperience from "../components/investing/EtfsBondsExperience";

export const metadata = {
  title: "ETFs & Bonds — ShareMarketAlerts",
  description: "Compare ETF costs and liquidity, then model bond ladders and allocation scenarios.",
};

export default function EtfsBondsPage() {
  return <EtfsBondsExperience />;
}
```

- [ ] **Step 5: Run the ETF/bond route test**

Run: `node --test --test-name-pattern="ETFs and bonds route" tests/investment-routes-render.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the ETF and bond workspace**

```bash
git add src/app/etfs-bonds/page.js src/app/components/investing/EtfsBondsExperience.js src/app/components/investing/InvestmentWorkspace.module.css tests/investment-routes-render.test.mjs
git commit -m "feat: add ETF and bond research workspace"
```

---

### Task 5: Futures and Options Analysis Workspace

**Files:**
- Create: `src/app/components/investing/StrategyPayoffChart.js`
- Create: `src/app/components/investing/FuturesOptionsExperience.js`
- Create: `src/app/futures-options/page.js`
- Modify: `src/app/components/investing/InvestmentWorkspace.module.css`
- Modify: `tests/investment-routes-render.test.mjs`

**Interfaces:**
- Consumes: `OPTION_CHAIN_ROWS`, `FUTURES_ROWS`; `calculateMargin`; shared primitives and `SiteHeader`.
- Produces: `<StrategyPayoffChart data label />` using Recharts and `<FuturesOptionsExperience />` with `data-futures-options-workspace`, controlled underlying/expiry/strategy/legs, deterministic payoff points, and no transaction CTA.

- [ ] **Step 1: Add the failing derivatives route test**

```js
test("futures and options route is analytical, educational, and non-transactional", async () => {
  const route = await read("src/app/futures-options/page.js");
  const source = await read("src/app/components/investing/FuturesOptionsExperience.js");
  assert.match(route, /FuturesOptionsExperience/);
  for (const marker of ["data-futures-options-workspace", "Option chain", "Strategy payoff", "Position legs", "Futures overview", "Commodity directory", "Margin estimate", "Leverage risk"]) assert.match(source, new RegExp(marker));
  assert.match(source, /Illustrative chain/);
  assert.doesNotMatch(source, />\s*(Buy|Sell) now\s*</i);
  assert.doesNotMatch(source, /Place order|Add funds|KYC/i);
  const chart = await read("src/app/components/investing/StrategyPayoffChart.js");
  assert.match(chart, /from "recharts"/);
  assert.match(chart, /type="monotone"/);
  assert.match(chart, /strokeWidth=\{2\.75\}/);
  assert.match(chart, /dot=\{false\}/);
  assert.match(chart, /animationDuration=\{700\}/);
});
```

- [ ] **Step 2: Run the focused test to confirm failure**

Run: `node --test --test-name-pattern="futures and options route" tests/investment-routes-render.test.mjs`

Expected: FAIL with file-not-found for the route.

- [ ] **Step 3: Build deterministic strategy helpers inside the experience module**

Define `STRATEGIES` with exact templates for `Long call`, `Long put`, `Bull call spread`, `Bear put spread`, and `Long straddle`. Each leg has `{ side: "long" | "short", type: "call" | "put", strike, premium, quantity }`. Export `calculatePayoffAtExpiry(spot, legs)` for a source-contract test and compute 17 payoff points around the selected strike. The formula is intrinsic value minus premium for long legs and the negation of that result for short legs, multiplied by quantity.

- [ ] **Step 4: Render the complete derivatives workspace**

Render:

1. Header and breadcrumb `Products / Futures & Options`.
2. Underlying and expiry selectors with an `Illustrative delayed context` badge.
3. Metrics for spot, at-the-money strike, selected expiry, and estimated margin.
4. `Option chain` table with call OI, call LTP, strike, put LTP, and put OI; apply a visible ATM row state.
5. `Strategy payoff` with strategy tabs, a zero reference line, `StrategyPayoffChart`, maximum-profit/loss summary when finite, and break-even context. The chart uses Recharts `ResponsiveContainer`, `AreaChart`, `CartesianGrid vertical={false}` with 5% `#F3F4F6`, monotone area/line, 2.75px rounded semantic stroke, 18%→0% gradient, no persistent dots, a 6px active dot with white outline, a glass tooltip, generous chart margins, and 700ms animation.
6. `Position legs` editor allowing side, type, strike, premium, and quantity changes.
7. `Futures overview` table for contract, spot, futures, basis, lot size, and expiry.
8. `Margin estimate` controls using `calculateMargin`, explicitly stating it excludes broker risk add-ons.
9. `Commodity directory` for Gold, Silver, Crude oil, and Natural gas with contract drivers and risk notes, not live prices.
10. A prominent `Leverage risk` disclosure describing rapid losses, expiry, liquidity, assignment, and broker-margin differences.

- [ ] **Step 5: Create the Server Component route**

```js
import FuturesOptionsExperience from "../components/investing/FuturesOptionsExperience";

export const metadata = {
  title: "Futures & Options — ShareMarketAlerts",
  description: "Study option chains, strategy payoffs, futures basis and leverage risk.",
};

export default function FuturesOptionsPage() {
  return <FuturesOptionsExperience />;
}
```

- [ ] **Step 6: Run the derivatives route test**

Run: `node --test --test-name-pattern="futures and options route" tests/investment-routes-render.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit the derivatives workspace**

```bash
git add src/app/futures-options/page.js src/app/components/investing/StrategyPayoffChart.js src/app/components/investing/FuturesOptionsExperience.js src/app/components/investing/InvestmentWorkspace.module.css tests/investment-routes-render.test.mjs
git commit -m "feat: add futures and options workspace"
```

---

### Task 6: Complete Investment Calculator Workspace

**Files:**
- Create: `src/app/components/investing/CalculatorsExperience.js`
- Create: `src/app/calculators/page.js`
- Modify: `src/app/components/investing/InvestmentWorkspace.module.css`
- Modify: `tests/investment-routes-render.test.mjs`

**Interfaces:**
- Consumes: all eight exports from `src/lib/investing/calculators.js`; shared primitives and `SiteHeader`.
- Produces: `<CalculatorsExperience />` with `data-calculators-workspace`, a controlled active calculator, editable inputs, immediate output, assumption decomposition, and validation copy.

- [ ] **Step 1: Add the failing calculator route test**

```js
test("calculator route exposes all planning tools with transparent assumptions", async () => {
  const route = await read("src/app/calculators/page.js");
  const source = await read("src/app/components/investing/CalculatorsExperience.js");
  assert.match(route, /CalculatorsExperience/);
  for (const marker of ["data-calculators-workspace", "SIP calculator", "Lump sum calculator", "SWP calculator", "CAGR calculator", "Transaction cost estimate", "Margin estimate", "Goal planner", "Required monthly investment", "Assumptions used"]) assert.match(source, new RegExp(marker));
  for (const fn of ["calculateSip", "calculateLumpSum", "calculateSwp", "calculateCagr", "calculateTransactionCosts", "calculateMargin", "calculateGoal"]) assert.match(source, new RegExp(fn));
});
```

- [ ] **Step 2: Run the focused test to confirm failure**

Run: `node --test --test-name-pattern="calculator route" tests/investment-routes-render.test.mjs`

Expected: FAIL with file-not-found for the route.

- [ ] **Step 3: Build the calculator registry and interaction model**

Create a local `CALCULATORS` registry with the exact eight labels in the test. Store input state in one object keyed by `sip`, `lumpSum`, `swp`, `cagr`, `cost`, `margin`, and `goal`. `Required monthly investment` uses the goal function but presents only the required contribution and gap. Use a `formatInr` helper with `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })`.

Render:

1. Header and breadcrumb `Products / Calculators`.
2. An eight-item tool rail or tabs with `aria-pressed` state.
3. A calculator panel that renders the relevant `CalculatorField` controls.
4. A `ResultBreakdown` with at least three labelled output values for each tool.
5. `Assumptions used` listing annual-rate conversion, contribution timing, fee assumptions, rounding, and excluded taxes where relevant.
6. A link to `/portfolio` for applying a result to a local planning view.
7. A disclosure that projections are educational estimates, returns are not guaranteed, and tax rules/broker charges can change.

When a user enters a non-finite value or a value beyond the supported boundaries from Task 1, show `Value adjusted to the supported planning range` beside that field and use the clamped value in the result.

- [ ] **Step 4: Create the Server Component route**

```js
import CalculatorsExperience from "../components/investing/CalculatorsExperience";

export const metadata = {
  title: "Investment Calculators — ShareMarketAlerts",
  description: "Model SIPs, goals, withdrawals, growth, transaction costs and margin assumptions.",
};

export default function CalculatorsPage() {
  return <CalculatorsExperience />;
}
```

- [ ] **Step 5: Run route and formula tests**

Run: `node --test tests/investment-calculators.test.mjs tests/investment-routes-render.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the calculator workspace**

```bash
git add src/app/calculators/page.js src/app/components/investing/CalculatorsExperience.js src/app/components/investing/InvestmentWorkspace.module.css tests/investment-routes-render.test.mjs
git commit -m "feat: add investment calculator workspace"
```

---

### Task 7: Portfolio and Risk Workspace with Existing Live Quotes

**Files:**
- Create: `src/app/components/investing/PortfolioExperience.js`
- Create: `src/app/portfolio/page.js`
- Modify: `src/app/components/investing/InvestmentWorkspace.module.css`
- Modify: `tests/investment-routes-render.test.mjs`

**Interfaces:**
- Consumes: `PORTFOLIO_HOLDINGS`, `CORPORATE_EVENTS`; `useMarketData`; shared primitives and `SiteHeader`; `getHomeMarketData` and `MarketDataProvider` in the route.
- Produces: `<PortfolioExperience />` with `data-portfolio-workspace`, local component holdings state, Yahoo-backed watchlist quotes when present, computed totals/allocation/concentration, and no persistence claims.

- [ ] **Step 1: Add the failing portfolio route test**

```js
test("portfolio route preserves the live provider and labels local demo state", async () => {
  const route = await read("src/app/portfolio/page.js");
  const source = await read("src/app/components/investing/PortfolioExperience.js");
  assert.match(route, /getHomeMarketData/);
  assert.match(route, /MarketDataProvider/);
  assert.match(route, /revalidate\s*=\s*60/);
  for (const marker of ["data-portfolio-workspace", "Portfolio summary", "Holdings", "Asset allocation", "Concentration and risk", "Live watchlist", "Corporate events", "Goal buckets", "Local demo portfolio"]) assert.match(source, new RegExp(marker));
  assert.doesNotMatch(source, /Broker connected|Synced with broker|Place order/i);
});
```

- [ ] **Step 2: Run the focused test to confirm failure**

Run: `node --test --test-name-pattern="portfolio route" tests/investment-routes-render.test.mjs`

Expected: FAIL with file-not-found for the route.

- [ ] **Step 3: Build portfolio aggregation helpers**

Inside `PortfolioExperience.js`, define and export:

```js
export function summarizeHoldings(holdings) {
  const rows = holdings.map((holding) => {
    const invested = holding.quantity * holding.averageCost;
    const current = holding.quantity * holding.demoPrice;
    return { ...holding, invested, current, pnl: current - invested, returnPercent: invested ? ((current - invested) / invested) * 100 : 0 };
  });
  const invested = rows.reduce((sum, row) => sum + row.invested, 0);
  const current = rows.reduce((sum, row) => sum + row.current, 0);
  return { rows, invested, current, pnl: current - invested, returnPercent: invested ? ((current - invested) / invested) * 100 : 0 };
}
```

Derive allocation by `asset`, sector concentration by `sector`, and largest-position weight with `useMemo`. Do not mutate the imported catalogue.

Initialize local state with `useState(() => PORTFOLIO_HOLDINGS.map((holding) => ({ ...holding })))`, allow only local quantity edits and an explicit `Reset demo` action, and never write the holdings to storage or a server.

- [ ] **Step 4: Build the complete portfolio experience**

Render:

1. Header and breadcrumb `Products / Portfolio`, plus a `Local demo portfolio` badge.
2. `Portfolio summary` metrics for invested value, current value, total return, and illustrative day movement.
3. `Holdings` table for instrument, asset, quantity, average cost, demo price, current value, P&L, and contribution.
4. `Asset allocation` as proportional horizontal bars with accessible text labels.
5. `Concentration and risk` flags for any position above 25%, sector above 35%, lack of fixed income, and event proximity.
6. `Live watchlist` using the first four unique quotes from `market.gainers` and `market.losers`, with external Yahoo quote links and the existing source mode label.
7. `Corporate events` queue from `CORPORATE_EVENTS`.
8. `Goal buckets` for emergency reserve, long-term wealth, and planned purchase, plus local investment-plan reminders for monthly review and annual rebalancing; values remain local examples.
9. Links to `/calculators`, `/mutual-funds`, `/etfs-bonds`, and `/stock-alerts`.
10. Disclosure text: `Holdings, costs, allocations, goals and event actions are local demo data and reset on refresh. Watchlist quotes use the connected market snapshot and may be delayed.`

- [ ] **Step 5: Create the revalidated Server Component route**

```js
import MarketDataProvider from "../components/MarketDataProvider";
import PortfolioExperience from "../components/investing/PortfolioExperience";
import { getHomeMarketData } from "../../lib/market-data/home";

export const revalidate = 60;

export const metadata = {
  title: "Portfolio & Risk — ShareMarketAlerts",
  description: "Explore a local demo portfolio with allocation, concentration, events and a live watchlist.",
};

export default async function PortfolioPage() {
  const marketData = await getHomeMarketData();
  return <MarketDataProvider initialData={marketData}><PortfolioExperience /></MarketDataProvider>;
}
```

- [ ] **Step 6: Run the portfolio and existing provider tests**

Run: `node --test --test-name-pattern="portfolio route|market-driven routes" tests/investment-routes-render.test.mjs tests/platform-routes-render.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit the portfolio workspace**

```bash
git add src/app/portfolio/page.js src/app/components/investing/PortfolioExperience.js src/app/components/investing/InvestmentWorkspace.module.css tests/investment-routes-render.test.mjs
git commit -m "feat: add portfolio and risk workspace"
```

---

### Task 8: Complete Product Ecosystem Directory

**Files:**
- Modify: `src/app/components/platform/ProductsExperience.js:16-118`
- Modify: `src/app/components/platform/TradingWorkspace.module.css:1-981`
- Modify: `tests/investment-routes-render.test.mjs`
- Modify: `tests/platform-routes-render.test.mjs:84-100`

**Interfaces:**
- Consumes: `INVESTMENT_DESTINATIONS` from `../investing/investmentData`; existing `TOOLS`, `MARKET_TOOLKIT`, and shared platform primitives.
- Produces: a complete products catalogue grouped by `Research`, `Investing`, `Trading`, `Automation`, and `Planning`, while preserving the existing product workbench.

- [ ] **Step 1: Add failing product-directory assertions**

```js
test("Products is the complete entry point for the investment ecosystem", async () => {
  const source = await read("src/app/components/platform/ProductsExperience.js");
  for (const href of ["/mutual-funds", "/etfs-bonds", "/futures-options", "/calculators", "/portfolio"]) assert.ok(source.includes(href), `${href} is missing from Products`);
  for (const group of ["Research", "Investing", "Trading", "Automation", "Planning"]) assert.match(source, new RegExp(group));
  assert.match(source, /Complete investing ecosystem/);
});
```

- [ ] **Step 2: Run the product test to verify missing destinations**

Run: `node --test --test-name-pattern="complete entry point" tests/investment-routes-render.test.mjs`

Expected: FAIL because the five route strings and complete directory heading are absent.

- [ ] **Step 3: Extend the product catalogue without replacing the current workbench**

Import `INVESTMENT_DESTINATIONS`, add `Investing` and `Planning` to the existing workspace tabs, and extend `TOOLS` with five entries using the destination records. Add a new section after `Explore the market toolkit`:

- Heading: `Complete investing ecosystem`
- Subtitle: `Research, investing, trading, automation and planning in one connected platform`
- Five grouped columns:
  - Research: Markets, Live Markets, Insights, IPO
  - Investing: Mutual Funds, ETFs & Bonds, Portfolio
  - Trading: Futures & Options, Live Markets, Market Lens
  - Automation: Stock Alerts, event templates, watchlist alerts
  - Planning: Calculators, goal planner, portfolio risk
- Every real destination uses `Link`; explanatory entries point to the most relevant existing or new route.
- Add `Illustrative tools are clearly labelled inside each workspace` beneath the directory.

Keep `data-products-suite`, `Tool preview`, `Capability matrix`, and `Delivery surfaces` unchanged.

- [ ] **Step 4: Style the new directory using existing visual tokens**

Add `.ecosystemDirectory`, `.ecosystemGroups`, and `.ecosystemGroup` to `TradingWorkspace.module.css`. Use five desktop columns above 1100px, two columns from 701px to 1100px, and one column below 700px. Internal links must have at least a 44px interaction height on mobile.

- [ ] **Step 5: Run product and platform route tests**

Run: `node --test tests/investment-routes-render.test.mjs tests/platform-routes-render.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the complete product directory**

```bash
git add src/app/components/platform/ProductsExperience.js src/app/components/platform/TradingWorkspace.module.css tests/investment-routes-render.test.mjs tests/platform-routes-render.test.mjs
git commit -m "feat: connect complete investment product directory"
```

---

### Task 9: Contextual Entry Points Across Existing Workspaces

**Files:**
- Modify: `src/app/components/platform/MarketsExperience.js:120-154`
- Modify: `src/app/components/platform/IpoExperience.js:98-107`
- Modify: `src/app/components/platform/InsightsExperience.js:99-107`
- Modify: `src/app/components/platform/StockAlertsExperience.js:98-106`
- Modify: `src/app/components/platform/LiveMarketsExperience.js:95-104`
- Modify: `src/app/components/platform/TradingWorkspace.module.css:1-981`
- Modify: `tests/investment-routes-render.test.mjs`
- Modify: `tests/platform-routes-render.test.mjs`

**Interfaces:**
- Consumes: `INVESTMENT_LEARNING_PATHS` and `EVENT_ALERT_TEMPLATES`; `Link` and existing platform primitives.
- Produces: domain-specific navigation sections that do not change `siteNavigation.js` or the homepage.

- [ ] **Step 1: Add failing contextual-coverage tests**

```js
test("existing workspaces connect to the new tools in domain-specific ways", async () => {
  const expectations = {
    MarketsExperience: ["Investment and derivatives hubs", "/mutual-funds", "/etfs-bonds", "/futures-options"],
    IpoExperience: ["IPO application workflow", "Allotment guidance", "/portfolio", "/stock-alerts"],
    InsightsExperience: ["Investing learning paths", "/mutual-funds", "/etfs-bonds", "/futures-options", "/portfolio"],
    StockAlertsExperience: ["Event and planning templates", "Dividend ex-date", "Split or bonus", "Concentration warning"],
    LiveMarketsExperience: ["Continue your market workflow", "/etfs-bonds", "/futures-options", "/portfolio"],
  };
  for (const [component, markers] of Object.entries(expectations)) {
    const source = await read(`src/app/components/platform/${component}.js`);
    for (const marker of markers) assert.match(source, new RegExp(marker.replace("/", "\\/")));
  }
});

test("the primary navbar and homepage remain unchanged by secondary destinations", async () => {
  const navigation = await read("src/app/components/siteNavigation.js");
  const home = await read("src/app/page.js");
  for (const href of ["/mutual-funds", "/etfs-bonds", "/futures-options", "/calculators", "/portfolio"]) {
    assert.doesNotMatch(navigation, new RegExp(href.replace("/", "\\/")));
    assert.doesNotMatch(home, new RegExp(href.replace("/", "\\/")));
  }
});
```

- [ ] **Step 2: Run the contextual tests to verify the sections are absent**

Run: `node --test --test-name-pattern="existing workspaces connect|primary navbar" tests/investment-routes-render.test.mjs`

Expected: the contextual-coverage test FAILS and the primary-navbar test PASSES.

- [ ] **Step 3: Add a market workflow directory**

In `MarketsExperience`, insert `Investment and derivatives hubs` before `Market news and research`. Include nine compact entries: Mutual funds, ETFs, Bonds, Futures & Options, Dividends, Splits & bonuses, Buybacks, Stock events, and Portfolio. Link the investment entries to `/mutual-funds`, `/etfs-bonds`, and `/futures-options`; link every event entry to `/stock-alerts`; link portfolio to `/portfolio`. State that live equity/index values remain Yahoo-backed and non-equity reference values are planning context.

- [ ] **Step 4: Add an honest IPO workflow handoff**

In `IpoExperience`, add `IPO application workflow` after `Read the issue`. Render `Subscription status` education that separates institutional, non-institutional, retail, and employee categories; an `Issue document checklist` for RHP, proceeds, risks, financials, and peer valuation; and five educational steps: issue review, subscription interpretation, application through a registered broker, `Allotment guidance`, and listing/portfolio review. Link only to `/stock-alerts`, `/portfolio`, and `/insights`; do not render an apply or allotment-result form.

- [ ] **Step 5: Expand the insights learning library**

Import `INVESTMENT_LEARNING_PATHS`, add `Investing learning paths`, and render the four imported paths plus two local entries for taxation basics and risk management. Use links to `/mutual-funds`, `/etfs-bonds`, `/futures-options`, `/portfolio`, and `/calculators`. Preserve all existing stories and research sections.

- [ ] **Step 6: Expand alerts with correctly labelled templates**

Import `EVENT_ALERT_TEMPLATES` and add `Event and planning templates` beneath the existing alert library. Render all seven templates. Give price/volume templates the label `Live monitoring`; give corporate-event templates `Educational reminder`; give SIP/concentration templates `Local planning reminder`. Do not imply a scheduled backend job exists.

- [ ] **Step 7: Add live-market continuation cards**

In `LiveMarketsExperience`, add `Intraday monitor collections` and `Continue your market workflow` before the final disclaimer. The monitor collections cover opening range, unusual volume, gap continuation, sector leaders, ETF watch, and a stock-event queue; all derived interface states remain labelled. The continuation cards link ETF watch to `/etfs-bonds`, Derivatives lab to `/futures-options`, Portfolio/watchlist handoff to `/portfolio`, Stock-event alerts to `/stock-alerts`, and Research context to `/insights`. Keep the screener, live source label, and `MarketDataProvider` behavior unchanged.

- [ ] **Step 8: Style shared contextual directories**

Add `.contextDirectory`, `.contextGrid`, `.contextCard`, `.workflowSteps`, and `.templateGrid` to `TradingWorkspace.module.css`; reuse the workspace border, text, number, and responsive tokens. Ensure one-column mobile layout, at least 12px utility copy, and 44px linked rows.

- [ ] **Step 9: Run all source-contract tests**

Run: `node --test tests/investment-routes-render.test.mjs tests/platform-routes-render.test.mjs`

Expected: PASS.

- [ ] **Step 10: Commit the contextual integrations**

```bash
git add src/app/components/platform/MarketsExperience.js src/app/components/platform/IpoExperience.js src/app/components/platform/InsightsExperience.js src/app/components/platform/StockAlertsExperience.js src/app/components/platform/LiveMarketsExperience.js src/app/components/platform/TradingWorkspace.module.css tests/investment-routes-render.test.mjs tests/platform-routes-render.test.mjs
git commit -m "feat: connect investment tools across workspaces"
```

---

### Task 10: Responsive, Accessibility, and Truthfulness Hardening

**Files:**
- Modify: `src/app/components/investing/InvestmentPrimitives.js`
- Modify: `src/app/components/investing/InvestmentWorkspace.module.css`
- Modify: `src/app/components/investing/MutualFundsExperience.js`
- Modify: `src/app/components/investing/EtfsBondsExperience.js`
- Modify: `src/app/components/investing/FuturesOptionsExperience.js`
- Modify: `src/app/components/investing/CalculatorsExperience.js`
- Modify: `src/app/components/investing/PortfolioExperience.js`
- Modify: `tests/investment-routes-render.test.mjs`

**Interfaces:**
- Consumes: all five completed workspaces and shared primitives.
- Produces: consistent form labeling, keyboard state, contained overflow, actionable empty states, and two-level illustrative disclosures.

- [ ] **Step 1: Add failing accessibility and disclosure assertions**

```js
test("every investment workspace has two-level disclosures and accessible interactive state", async () => {
  for (const component of ["MutualFundsExperience", "EtfsBondsExperience", "FuturesOptionsExperience", "CalculatorsExperience", "PortfolioExperience"]) {
    const source = await read(`src/app/components/investing/${component}.js`);
    assert.match(source, /<DisclosureNote/);
    assert.match(source, /aria-label|<label/);
  }
  const data = await read("src/app/components/investing/investmentData.js");
  assert.match(data, /sourceLabel/);
});

test("investment routes are independent pages and homepage stays excluded", async () => {
  for (const folder of ["mutual-funds", "etfs-bonds", "futures-options", "calculators", "portfolio"]) await access(new URL(`src/app/${folder}/page.js`, ROOT));
  const home = await read("src/app/page.js");
  assert.doesNotMatch(home, /InvestmentPrimitives|InvestmentWorkspace|MutualFundsExperience|PortfolioExperience/);
});
```

- [ ] **Step 2: Run the new assertions and observe any missing disclosures or labels**

Run: `node --test --test-name-pattern="two-level disclosures|independent pages" tests/investment-routes-render.test.mjs`

Expected: FAIL only for genuine omissions found by the assertions.

- [ ] **Step 3: Close all accessibility and truthfulness gaps**

For each page, ensure the page header or data panel carries a compact `Illustrative`, `Planning example`, or `Local demo` status badge, and the bottom of the page contains `DisclosureNote`. Ensure each input has a visible label, each tab/filter button has `aria-pressed`, each table has a caption, empty filter results render a visible reset suggestion, and payoff/allocation visuals expose text equivalents.

- [ ] **Step 4: Audit the CSS at mobile breakpoints**

Confirm `InvestmentWorkspace.module.css` contains:

```css
@media (max-width: 700px) {
  .canvas { width: 100%; padding: 20px 16px 56px; }
  .workspaceHeader h1 { font-size: clamp(38px, 11vw, 48px); }
  .workspaceHeader p { font-size: 16px; line-height: 1.65; }
  .calculatorField input,
  .calculatorField select,
  .screenerToolbar input,
  .screenerToolbar select { min-height: 44px; font-size: 16px; }
  .categoryTabs button,
  .workspaceLink { min-height: 44px; }
  .metricStrip,
  .twoColumn,
  .threeColumn,
  .directoryGrid { grid-template-columns: 1fr; }
  .tableScroller { width: 100%; max-width: 100%; overflow-x: auto; overscroll-behavior-inline: contain; }
}
```

Keep utility labels at 12px or larger and avoid fixed content widths wider than the viewport.

- [ ] **Step 5: Run all investment tests**

Run: `node --test tests/investment-calculators.test.mjs tests/investment-routes-render.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the hardening pass**

```bash
git add src/app/components/investing tests/investment-routes-render.test.mjs
git commit -m "fix: harden investment workspace accessibility"
```

---

### Task 11: Full Regression, Build, and Visual Verification

**Files:**
- Verify: all files listed in Tasks 1–10
- Do not modify: `src/app/page.js`, `src/app/components/siteNavigation.js`, or homepage CSS/components during this task.

**Interfaces:**
- Consumes: the complete implementation.
- Produces: test, lint, production-build, desktop visual, and mobile overflow evidence.

- [ ] **Step 1: Verify the exact changed-file scope**

Run: `git status --short && git diff -- src/app/page.js src/app/components/siteNavigation.js`

Expected: the homepage and primary navigation diff is empty; only investment files, the six approved inner workspaces, their shared workspace CSS, and tests are part of this expansion.

- [ ] **Step 2: Run the complete Node test suite**

Run: `node --test tests/*.test.mjs`

Expected: every test passes, including existing chart, homepage, market-provider, and route tests.

- [ ] **Step 3: Run ESLint**

Run: `npm run lint`

Expected: exit code 0 with no errors.

- [ ] **Step 4: Run the production build through the repository Node 22 command**

Run: `/home/gaurav/.npm/_npx/52027bd8fc0022aa/node_modules/node/bin/node node_modules/next/dist/bin/next build`

Expected: build succeeds and lists `/mutual-funds`, `/etfs-bonds`, `/futures-options`, `/calculators`, and `/portfolio`; `/portfolio` remains a 60-second revalidated route.

- [ ] **Step 5: Verify desktop rendering at 1440px**

Open each new route in the existing dev server at a 1440px viewport. Confirm the unique domain hierarchy, complete content sections, contained tables, readable badges, no fake execution controls, and visual continuity with Markets/IPO/Products/Insights/Stock Alerts/Live Markets.

- [ ] **Step 6: Verify mobile rendering at 390px**

For every new route, record `document.documentElement.scrollWidth` and `window.innerWidth`; both must equal 390. Confirm page headings are at least 38px, body copy is at least 16px where primary, utility copy is at least 12px, numeric controls are 16px, primary targets are at least 44px high, and table overflow stays inside `.tableScroller`.

- [ ] **Step 7: Recheck homepage exclusion visually**

Open `/` at desktop and mobile widths and compare it with the pre-expansion baseline. Confirm no new product directory, investment workspace CSS, or secondary route links have appeared on the homepage.

- [ ] **Step 8: Commit only verification fixes if the checks exposed a defect**

```bash
git add src/app/components/investing src/app/components/platform tests
git commit -m "fix: complete investment workspace verification"
```

If no files changed during verification, do not create an empty commit.
