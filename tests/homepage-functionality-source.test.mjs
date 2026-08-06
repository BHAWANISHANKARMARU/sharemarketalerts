import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = (name) =>
  readFile(new URL(`../src/app/components/${name}`, import.meta.url), "utf8");

test("homepage controls no longer use placeholder links or read-only email inputs", async () => {
  const sources = await Promise.all([
    component("Hero.js"),
    component("MobileHero.js"),
    component("MarketIntelligence.js"),
    component("MarketCoverage.js"),
    component("Pricing.js"),
    component("GrowthCta.js"),
    component("Footer.js"),
  ]);
  const source = sources.join("\n");

  assert.doesNotMatch(source, /href=["']#["']/);
  assert.doesNotMatch(source, /\breadOnly\b/);
  assert.match(source, /#pricing/);
  assert.match(source, /#market-intelligence/);
  assert.match(source, /type="submit"/);
  assert.match(source, /aria-label="Previous opportunity"/);
  assert.match(source, /aria-label="Next opportunity"/);
  assert.match(source, /className=\{styles\.coverageLink\}/);
});

test("live market, chart, and search route handlers are present", async () => {
  const [homeRoute, chartRoute, searchRoute] = await Promise.all([
    readFile(
      new URL("../src/app/api/market/home/route.js", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/app/api/market/chart/route.js", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/app/api/market/search/route.js", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(homeRoute, /export async function GET/);
  assert.match(homeRoute, /getHomeMarketData/);
  assert.match(chartRoute, /export async function GET/);
  assert.match(chartRoute, /getMarketChart/);
  assert.match(searchRoute, /export async function GET/);
  assert.match(searchRoute, /searchMarketSymbols/);
});
