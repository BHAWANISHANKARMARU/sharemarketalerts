import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);
const ROUTES = [
  ["Home", "/", null],
  ["Markets", "/markets", "markets"],
  ["IPO", "/ipo", "ipo"],
  ["Products", "/products", "products"],
  ["Insights", "/insights", "insights"],
  ["Stock Alerts", "/stock-alerts", "stock-alerts"],
  ["Live Markets", "/live-markets", "live-markets"],
];

test("shared navigation defines the seven product destinations", async () => {
  const source = await readFile(
    new URL("src/app/components/siteNavigation.js", ROOT),
    "utf8",
  );

  for (const [label, href] of ROUTES) {
    assert.match(source, new RegExp(`label: "${label}"`));
    assert.match(source, new RegExp(`href: "${href}"`));
  }
  assert.doesNotMatch(source, /Performance|How It Works|Results|Pricing/);
});

test("all six platform destinations have static App Router pages", async () => {
  for (const [, , folder] of ROUTES.filter((route) => route[2])) {
    await access(new URL(`src/app/${folder}/page.js`, ROOT));
  }
});

test("the inner page header uses prefetched links and marks the active route", async () => {
  const source = await readFile(
    new URL("src/app/components/SiteHeader.js", ROOT),
    "utf8",
  );

  assert.match(source, /from "next\/link"/);
  assert.match(source, /usePathname/);
  assert.match(source, /aria-current/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /NAV_ITEMS/);
  assert.match(source, /Search markets/);
});

test("each destination is an independent analytical workspace", async () => {
  const experiences = [
    ["MarketsExperience", "data-market-dashboard", /MarketsOverviewHero/, /Sector heatmap/],
    ["IpoExperience", "data-ipo-explorer", /IPO Calendar/, /IPO issue screener/],
    ["ProductsExperience", "data-products-suite", /Product workspace/, /Tool preview/],
    ["InsightsExperience", "data-insights-hub", /Research ideas/, /Market themes/],
    ["StockAlertsExperience", "data-alert-builder", /Your market, right now/, /Your rules in motion/],
    ["LiveMarketsExperience", "data-live-terminal", /Market screener/, /Column set/],
  ];

  for (const [component, landmark, ...copySignals] of experiences) {
    let source = await readFile(
      new URL(`src/app/components/platform/${component}.js`, ROOT),
      "utf8",
    );
    if (component === "StockAlertsExperience") {
      source += await readFile(new URL("src/app/components/platform/LiveRuleMonitoring.js", ROOT), "utf8");
    }
    if (component === "ProductsExperience") {
      source += await readFile(new URL("src/app/components/platform/PlatformProductsGrid.js", ROOT), "utf8");
    }
    assert.match(source, new RegExp(landmark));
    assert.match(source, /<SiteHeader/);
    if (component === "MarketsExperience") assert.match(source, /<MarketsOverviewHero/);
    else if (component === "StockAlertsExperience") assert.match(source, /<LiveRuleMonitoring/);
    else assert.match(source, /<h1/);
    if (!["ProductsExperience", "StockAlertsExperience"].includes(component)) {
      assert.match(source, /WorkspacePrimitives/);
    }
    for (const signal of copySignals) assert.match(source, signal);
  }

  await assert.rejects(access(new URL("src/app/components/PlatformPage.js", ROOT)));
  await assert.rejects(access(new URL("src/app/components/platformPageData.js", ROOT)));
});

test("market-driven routes preserve the existing live data provider", async () => {
  for (const folder of ["markets", "ipo", "stock-alerts", "live-markets"]) {
    const route = await readFile(new URL(`src/app/${folder}/page.js`, ROOT), "utf8");
    assert.match(route, /getHomeMarketData/);
    assert.match(route, /MarketDataProvider/);
    assert.match(route, /revalidate\s*=\s*60/);
  }
});

test("stock alerts renders the unified live rule monitoring dashboard", async () => {
  const response = await fetch("http://localhost:3000/stock-alerts");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /data-live-rule-monitoring="true"/);
  assert.match(html, /data-monitoring-featured-rule="true"/);
  assert.equal((html.match(/data-watched-rule="true"/g) || []).length, 4);
  assert.match(html, /data-rule-summary="true"/);
  assert.match(html, /data-rule-activity="true"/);
  assert.match(html, /Your market, right now/);
  assert.match(html, /Price crossed your breakout level/);
  assert.match(html, /What just happened/);
  assert.match(html, /Your rules in motion/);
  assert.match(html, /data-integrated-alert-controls="true"/);
  assert.doesNotMatch(html, /data-alert-rule-workspace="true"/);
});

test("stock alerts restores the site shell and lower tools with a legible desktop layout", async () => {
  const page = await readFile(
    new URL("src/app/components/platform/StockAlertsExperience.js", ROOT),
    "utf8",
  );
  const dashboard = await readFile(
    new URL("src/app/components/platform/LiveRuleMonitoring.js", ROOT),
    "utf8",
  );
  const pageStyles = await readFile(
    new URL("src/app/components/platform/StockAlertsWorkspace.module.css", ROOT),
    "utf8",
  );
  const dashboardStyles = await readFile(
    new URL("src/app/components/platform/LiveRuleMonitoring.module.css", ROOT),
    "utf8",
  );

  assert.match(page, /<SiteHeader/);
  assert.match(page, /Alert types and templates/);
  assert.match(page, /Live signal queue/);
  assert.match(page, /Market feed health/);
  assert.doesNotMatch(page, /AlertRuleWorkspace/);
  assert.match(dashboard, /fetch\(`\/api\/market\/chart\?symbol=/);
  assert.match(dashboard, /Create alert/);
  assert.match(dashboard, /Active alerts/);
  assert.match(dashboard, /Triggered/);
  assert.match(dashboard, /Settings/);
  assert.match(dashboard, /1m/);
  assert.match(dashboard, /15m/);
  assert.match(dashboard, /Create price alert/);
  assert.match(dashboard, /<Area type="monotone"/);
  assert.match(dashboard, /const\s+\[chart,\s*setChart\]\s*=\s*useState\(\[\]\)/);
  assert.match(dashboardStyles, /\.mapTrack[\s\S]*?mask:\s*repeating-linear-gradient/);
  assert.match(dashboardStyles, /\.darkShell\s*>\s*\*[\s\S]*?max-width:\s*980px/);
  assert.match(pageStyles, /\.page\s*>\s*header\s*\{\s*display:\s*block/);
  assert.match(pageStyles, /\.unifiedCanvas[\s\S]*?width:\s*100%[\s\S]*?max-width:\s*none/);
  assert.match(dashboardStyles, /\.activityCard time\s*\{[^}]*font-size:\s*11px/);
  assert.match(dashboardStyles, /\.rulesCard li > p strong\s*\{[^}]*font-size:\s*13px/);
});

test("pages contain useful domain-specific tools, not repeated marketing blocks", async () => {
  const expected = {
    MarketsExperience: [/MarketsOverviewHero/, /Sector heatmap/, /Earnings watch/, /Market Everywhere/, /Market calendars/, /Market news and research/],
    IpoExperience: [/IPO Calendar/, /Offer calendar/, /IpoReadingGuide/, /ALL IPO MARKET DATA/],
    ProductsExperience: [/Product workspace/, /Capability matrix/, /Delivery surfaces/, /Explore the market toolkit/, /All platform products/],
    InsightsExperience: [/Research ideas/, /Week ahead/, /Market themes/, /Community ideas/, /Top market stories/, /Learning library/],
    StockAlertsExperience: [/Your market, right now/, /Price crossed your breakout level/, /What just happened/, /Your rules in motion/],
    LiveMarketsExperience: [/Market screener/, /Opportunity queue/, /Column set/, /Browse every market view/],
  };

  for (const [component, patterns] of Object.entries(expected)) {
    let source = await readFile(
      new URL(`src/app/components/platform/${component}.js`, ROOT),
      "utf8",
    );
    if (component === "StockAlertsExperience") {
      source += await readFile(new URL("src/app/components/platform/LiveRuleMonitoring.js", ROOT), "utf8");
    }
    if (component === "ProductsExperience") {
      source += await readFile(new URL("src/app/components/platform/PlatformProductsGrid.js", ROOT), "utf8");
    }
    for (const pattern of patterns) assert.match(source, pattern);
  }
});

test("ipo renders the market data hub directly beneath the offer calendar", async () => {
  const response = await fetch("http://localhost:3000/ipo");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /data-ipo-data-hub="true"/);
  assert.equal((html.match(/data-ipo-data-card="true"/g) || []).length, 5);
  assert.match(html, /data-ipo-workflow="true"/);
  assert.match(html, /Read primary-market research/);
  assert.match(html, /Review terms/);
  assert.match(html, /Check demand/);
  assert.match(html, /Plan listing/);
  const calendarIndex = html.indexOf("data-ipo-calendar-board");
  const hubIndex = html.indexOf("data-ipo-data-hub");
  const screenerIndex = html.indexOf('id="issue-screener"');
  assert.ok(calendarIndex < hubIndex, "the IPO data hub should render after the offer calendar");
  assert.ok(hubIndex < screenerIndex, "the IPO data hub should render before the issue screener");
});

test("insights renders the complete reference research workspace", async () => {
  const response = await fetch("http://localhost:3000/insights");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /data-insights-reference-hero="true"/);
  assert.match(html, /data-featured-research="true"/);
  assert.match(html, /PARTICIPATION INDEX/);
  assert.match(html, /Breadth is improving beneath a quiet headline index/);
  assert.match(html, /What changed/);
  assert.match(html, /Confirmation/);
  assert.match(html, /Invalidation/);
  assert.match(html, /data-latest-research="true"/);
  assert.equal((html.match(/data-latest-research-item="true"/g) || []).length, 6);
});

test("insights research workspace uses a wide canvas and readable responsive type scale", async () => {
  const workspaceStyles = await readFile(
    new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT),
    "utf8",
  );
  const researchStyles = await readFile(
    new URL("src/app/components/platform/InsightsResearchHero.module.css", ROOT),
    "utf8",
  );

  assert.match(workspaceStyles, /\.insightsWorkspace\s*>\s*\.canvas\s*\{/);
  assert.match(workspaceStyles, /\.insightsWorkspace\s*>\s*\.canvas[\s\S]*?max-width:\s*1600px/);
  assert.match(researchStyles, /--research-body-size:\s*clamp\(13px,\s*\.83vw,\s*15px\)/);
  assert.match(researchStyles, /--research-detail-size:\s*clamp\(11px,\s*\.72vw,\s*13px\)/);
  assert.match(researchStyles, /\.latest article\s*\{[\s\S]*?min-height:\s*64px/);
  const tabletStyles = researchStyles.slice(
    researchStyles.indexOf("@media (max-width: 900px)"),
    researchStyles.indexOf("@media (max-width: 700px)"),
  );
  assert.match(tabletStyles, /\.latest\s*>\s*div\s*\{\s*grid-template-columns:\s*1fr/);
});

test("insights renders the reference market stories panel", async () => {
  const response = await fetch("http://localhost:3000/insights");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /data-insights-market-stories="true"/);
  assert.equal((html.match(/data-market-story="true"/g) || []).length, 5);
  assert.match(html, /Banks and autos carry a broader session advance/);
  assert.match(html, /Volatility stays contained while small-cap dispersion widens/);
  assert.match(html, /data-market-stories-subscribe="true"/);
  assert.match(html, /Never miss a market moving story\./);
});

test("markets sector heatmap exposes the reference dashboard controls and card anatomy", async () => {
  const source = await readFile(
    new URL("src/app/components/platform/MarketsExperience.js", ROOT),
    "utf8",
  );
  const styles = await readFile(
    new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT),
    "utf8",
  );

  assert.match(source, /Live performance of Indian market sectors/);
  assert.match(source, /aria-label="Sector heatmap range"/);
  for (const range of ["1D", "1W", "1M", "3M", "1Y"]) {
    assert.match(source, new RegExp(`"${range}"`));
  }
  assert.match(source, /Market Cap/);
  assert.match(source, /SectorIcon/);
  assert.match(source, /SectorSparkline/);
  assert.match(source, /from "recharts"/);
  assert.match(source, /function SectorSparkline[\s\S]*?<ResponsiveContainer[\s\S]*?<AreaChart/);
  assert.match(source, /data-chart-engine="recharts"/);
  assert.doesNotMatch(source, /className=\{s\.sectorSparkLine\}/);
  assert.match(source, /aria-label="Heatmap view"/);
  assert.match(styles, /\.sectorHeatCardFeatured/);
  assert.match(styles, /\.sectorSparkline/);
  assert.match(styles, /linear-gradient\(/);
});

test("markets global coverage renders the complete reference dashboard", async () => {
  const source = await readFile(
    new URL("src/app/components/platform/MarketsExperience.js", ROOT),
    "utf8",
  );

  for (const copy of [
    "Market Everywhere",
    "Global markets at a glance",
    "All times are local",
    "Global Overview",
    "Market Status",
    "Asia Markets",
    "Europe Markets",
    "Market Movers",
    "Global Snapshot",
    "See full market coverage",
  ]) {
    assert.match(source, new RegExp(copy));
  }

  assert.match(source, /worldMapImage/);
  assert.match(source, /aria-label="Global market views"/);
});

test("the workspace visual system is compact, responsive, and data-first", async () => {
  const styles = await readFile(
    new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT),
    "utf8",
  );

  assert.match(styles, /--workspace-blue:\s*#2962ff/);
  assert.match(styles, /border-radius:\s*12px/);
  assert.match(styles, /overflow-x:\s*auto/);
  assert.match(styles, /font-variant-numeric:\s*tabular-nums/);
  assert.match(styles, /@media \(max-width:\s*700px\)/);
  assert.match(styles, /font-size:\s*16px/);
  assert.match(styles, /\.workspacePage small,[\s\S]*?font-size:\s*12px\s*!important/);
});

test("the homepage stays outside the analytical workspace system", async () => {
  const home = await readFile(new URL("src/app/page.js", ROOT), "utf8");
  assert.doesNotMatch(home, /WorkspacePrimitives|TradingWorkspace|SiteHeader/);
});

test("homepage-only conversion sections do not repeat on platform routes", async () => {
  const home = await readFile(new URL("src/app/page.js", ROOT), "utf8");
  const template = await readFile(new URL("src/app/template.js", ROOT), "utf8");

  assert.match(home, /import Pricing/);
  assert.match(home, /import GrowthCta/);
  assert.match(home, /<Pricing/);
  assert.match(home, /<GrowthCta/);
  assert.doesNotMatch(template, /Pricing/);
  assert.doesNotMatch(template, /GrowthCta/);
  assert.match(template, /<Footer/);
});

test("homepage desktop and mobile navigation consume the shared destinations", async () => {
  const hero = await readFile(
    new URL("src/app/components/Hero.js", ROOT),
    "utf8",
  );
  const mobile = await readFile(
    new URL("src/app/components/MobileHero.js", ROOT),
    "utf8",
  );

  assert.match(hero, /NAV_ITEMS/);
  assert.match(mobile, /NAV_ITEMS/);
  assert.doesNotMatch(hero, /\["Performance"|\["Pricing"|\["How It Works"/);
  assert.doesNotMatch(mobile, />Pricing<|>How It Works</);
});

test("homepage mobile navigation remains readable with seven destinations", async () => {
  const styles = await readFile(
    new URL("src/app/components/MobileHero.module.css", ROOT),
    "utf8",
  );

  assert.match(styles, /\.mobileMenu\s*\{[\s\S]*?width:\s*calc\(230 \* var\(--m\)\)/);
  assert.match(styles, /\.mobileMenu a\s*\{[\s\S]*?font-size:\s*calc\(14\.5 \* var\(--m\)\)/);
});

test("footer navigation points to real platform routes from every page", async () => {
  const footer = await readFile(
    new URL("src/app/components/Footer.js", ROOT),
    "utf8",
  );

  for (const [, href] of ROUTES.slice(1)) {
    assert.match(footer, new RegExp(`"${href}"`));
  }
  assert.match(footer, /<Link/);
});
