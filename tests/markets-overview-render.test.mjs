import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("markets route renders the complete reference dashboard before lower sections", async () => {
  const hero = await readFile(
    new URL("src/app/components/platform/MarketsOverviewHero.js", ROOT),
    "utf8",
  );
  const experience = await readFile(
    new URL("src/app/components/platform/MarketsExperience.js", ROOT),
    "utf8",
  );
  const styles = await readFile(
    new URL("src/app/components/platform/MarketsOverviewHero.module.css", ROOT),
    "utf8",
  );

  assert.match(hero, /data-markets-overview-hero/);
  assert.match(hero, /Indian Stocks/);
  assert.match(hero, /Track the Market\./);
  assert.match(hero, /<em>Smarter\.<\/em>/);
  assert.match(hero, /Live market updates, sector trends and everything you need to stay ahead\./);
  assert.match(hero, /Market Today/);
  assert.match(hero, /Sector Performance/);
  assert.match(hero, /data-panel-tab="Key Indices"/);
  assert.match(hero, /data-panel-tab="Top Gainers"/);
  assert.match(hero, /data-panel-tab="Top Losers"/);
  assert.match(hero, /Never miss a market move/);
  assert.match(hero, /Create Watchlist/);
  assert.match(hero, /Tech stocks are leading the market today/);
  for (const label of ["Open", "High", "Low", "Prev. Close"]) assert.match(hero, new RegExp(`>${label}<`));
  assert.match(hero, /Market participation indicators/);
  assert.match(hero, /\/api\/market\/chart/);
  assert.match(hero, /data-chart-engine="recharts"/);
  assert.match(hero, /from "next\/image"/);
  assert.match(hero, /ChatGPT Image Aug 9, 2026, 06_43_08 PM\.png/);
  assert.doesNotMatch(hero, /<mask/);
  assert.match(hero, /sourceMode/);
  assert.match(hero, /aria-expanded/);
  assert.match(hero, /role="menu"/);
  assert.match(hero, /data-source-mode/);
  assert.match(hero, /aria-live="polite"/);
  assert.match(hero, /const displayedChart/);
  assert.doesNotMatch(hero, /if \(period === "1D"\) setChart/);
  assert.match(styles, /width:\s*100vw/);
  assert.match(styles, /transform:\s*translateX\(-50%\)/);
  assert.match(styles, /margin:\s*0 0 48px 50%/);
  assert.match(styles, /border-radius:\s*0/);
  assert.match(styles, /\.overviewHero::before\s*\{[\s\S]*?width:\s*100vw/);
  assert.match(styles, /min-height:\s*calc\(100svh - 65px\)/);
  assert.match(styles, /\.heroHeader\s*\{[^}]*height:\s*108px/s);
  assert.match(styles, /\.marketSummaryCard\s*\{[^}]*min-height:\s*298px/s);
  assert.match(styles, /\.metricStrip\s*\{[^}]*grid-template-columns:\s*repeat\(6,/s);
  assert.match(styles, /\.dashboardGrid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.76fr\)\s+minmax\(260px,\s*\.98fr\)\s+minmax\(248px,\s*\.94fr\)/s);
  assert.match(styles, /@media\s*\(min-width:\s*1600px\)/);
  assert.match(styles, /\.heroTitle\s*\{[^}]*font-size:\s*57px/s);
  assert.match(styles, /\.marketSummaryCard\s*\{\s*min-height:\s*468px/);
  assert.match(styles, /\.heroArtwork\s*\{[\s\S]*?top:\s*-14px;[\s\S]*?right:\s*calc\(50% - 50vw - 32px\);[\s\S]*?width:\s*60%;[\s\S]*?height:\s*210px/);
  assert.match(styles, /\.statusCard\s*\{[\s\S]*?top:\s*40px;[\s\S]*?left:\s*51%/);
  assert.match(styles, /\.heroArtwork img\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%/);
  assert.match(styles, /object-fit:\s*fill/);
  assert.match(styles, /\.headerPopover/);
  assert.match(styles, /\.overviewSelector/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);

  assert.match(experience, /import MarketsOverviewHero/);
  assert.match(experience, /<MarketsOverviewHero/);
  assert.match(experience, /sourceMode=\{sources\.yahoo\.mode\}/);
  assert.match(experience, /marketBoards/);
  assert.match(experience, /Sector heatmap/);
  assert.doesNotMatch(experience, /<section className=\{s\.marketSummary\}/);

  await access(new URL("ChatGPT Image Aug 9, 2026, 06_43_08 PM.png", ROOT));
});

test("markets renders the quote board and earnings timeline as distinct live workspaces", async () => {
  const response = await fetch("http://localhost:3000/markets");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /data-market-board="quotes"/);
  assert.match(html, /data-market-board="earnings"/);
  assert.match(html, /data-market-board-row="quote"/);
  assert.match(html, /data-market-board-row="earnings"/);
  assert.match(html, /data-market-board-icon="activity"/);
  assert.match(html, /data-market-board-icon="calendar"/);
  assert.match(html, /Open Market screener/);
  assert.match(html, /The week ahead/);
});

test("global and regional market cards render exact index brand marks instead of country flags", async () => {
  const response = await fetch("http://localhost:3000/markets");
  assert.equal(response.status, 200);

  const html = await response.text();
  for (const symbol of [
    "^GSPC", "^NDX", "^FTSE", "^GDAXI", "^N225", "^NSEI",
    "^HSI", "000001.SS", "^KS11", "^AXJO", "^STI", "^FCHI",
    "^STOXX50E", "^IBEX", "FTSEMIB.MI", "^SSMI",
  ]) {
    assert.match(html, new RegExp(`/api/market/logo\\?symbol=${encodeURIComponent(symbol)}`));
  }
});

test("every markets workspace below the hero uses the same responsive viewport frame", async () => {
  const workspaceStyles = await readFile(
    new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT),
    "utf8",
  );
  const calendarStyles = await readFile(
    new URL("src/app/components/platform/MarketCalendarDashboard.module.css", ROOT),
    "utf8",
  );
  const referenceStyles = await readFile(
    new URL("src/app/components/platform/MarketReferenceSections.module.css", ROOT),
    "utf8",
  );

  assert.match(workspaceStyles, /\.marketsWorkspace\s*>\s*\.canvas\s*\{[^}]*width:\s*100%[^}]*max-width:\s*none/s);
  assert.match(workspaceStyles, /\.marketBoards\s*\{[^}]*width:\s*89\.7vw[^}]*margin-inline:\s*auto/s);
  assert.match(workspaceStyles, /\.marketHeatShell[\s\S]*?width:\s*89\.7vw/);
  assert.match(workspaceStyles, /\.globalMarketDashboard\s*\{[^}]*--global-gutter:\s*5\.15vw/s);
  assert.match(calendarStyles, /\.calendarSection\s*\{[^}]*width:\s*89\.7vw/s);
  assert.match(referenceStyles, /\.newsSection\s*\{[^}]*width:\s*89\.7vw/s);
  assert.match(workspaceStyles, /@media\s*\(min-width:\s*1600px\)[\s\S]*?\.marketBoards\s*>\s*article\s*\{[^}]*min-height:\s*580px/);
  assert.match(workspaceStyles, /@media\s*\(min-width:\s*1600px\)[\s\S]*?\.marketHeatTitle h2\s*\{[^}]*font-size:\s*28px/);
  assert.match(calendarStyles, /@media\s*\(min-width:\s*1600px\)[\s\S]*?\.titleGroup h2\s*\{[^}]*font-size:\s*32px/);
});
