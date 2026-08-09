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
    ["IpoExperience", "data-ipo-explorer", /IPO Calendar/, /Issue screener/],
    ["ProductsExperience", "data-products-suite", /Product workspace/, /Tool preview/],
    ["InsightsExperience", "data-insights-hub", /Research ideas/, /Market themes/],
    ["StockAlertsExperience", "data-alert-builder", /Alert workspace/, /Active alerts/],
    ["LiveMarketsExperience", "data-live-terminal", /Market screener/, /Column set/],
  ];

  for (const [component, landmark, ...copySignals] of experiences) {
    const source = await readFile(
      new URL(`src/app/components/platform/${component}.js`, ROOT),
      "utf8",
    );
    assert.match(source, new RegExp(landmark));
    assert.match(source, /<SiteHeader/);
    assert.match(source, component === "MarketsExperience" ? /<MarketsOverviewHero/ : /<h1/);
    assert.match(source, /WorkspacePrimitives/);
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

test("pages contain useful domain-specific tools, not repeated marketing blocks", async () => {
  const expected = {
    MarketsExperience: [/MarketsOverviewHero/, /Sector heatmap/, /Earnings watch/, /Market Everywhere/, /Market calendars/, /Market news and research/],
    IpoExperience: [/IPO Calendar/, /Offer calendar/, /Read the issue/, /All IPO market data/],
    ProductsExperience: [/Product workspace/, /Capability matrix/, /Delivery surfaces/, /Explore the market toolkit/, /All platform products/],
    InsightsExperience: [/Research ideas/, /Week ahead/, /Market themes/, /Community ideas/, /Top market stories/, /Learning library/],
    StockAlertsExperience: [/Alert workspace/, /Rule preview/, /Active alerts/, /Alert types and templates/],
    LiveMarketsExperience: [/Market screener/, /Opportunity queue/, /Column set/, /Browse every market view/],
  };

  for (const [component, patterns] of Object.entries(expected)) {
    const source = await readFile(
      new URL(`src/app/components/platform/${component}.js`, ROOT),
      "utf8",
    );
    for (const pattern of patterns) assert.match(source, pattern);
  }
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
  assert.doesNotMatch(styles, /font-size:\s*[6-9]px/);
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
