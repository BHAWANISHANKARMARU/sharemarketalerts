import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("markets renders the reference calendar dashboard", async () => {
  const source = await readFile(
    new URL("src/app/components/platform/MarketCalendarDashboard.js", ROOT),
    "utf8",
  );
  const styles = await readFile(
    new URL("src/app/components/platform/MarketCalendarDashboard.module.css", ROOT),
    "utf8",
  );
  const data = await readFile(
    new URL("src/app/lib/market-calendar-data.js", ROOT),
    "utf8",
  );
  const implementation = `${source}\n${data}`;

  for (const copy of [
    "Market <span>Calendar",
    "Live earnings dates and analyst estimates",
    "High Impact",
    "View Full Calendar",
    "EPS Est.",
    "Revenue Est.",
    "View Full Economic Calendar",
  ]) assert.match(implementation, new RegExp(copy));

  assert.match(source, /data-market-calendar/);
  assert.match(styles, /\.calendarSection/);
  assert.match(styles, /\.calendarTable/);
  assert.match(styles, /@media \(max-width: 760px\)/);
});

test("markets renders the image-led news and research dashboard", async () => {
  const source = await readFile(
    new URL("src/app/components/platform/MarketNewsResearch.js", ROOT),
    "utf8",
  );
  const styles = await readFile(
    new URL("src/app/components/platform/MarketReferenceSections.module.css", ROOT),
    "utf8",
  );

  for (const copy of [
    "Live Market <em>Briefs",
    "Latest Market Briefs",
    "Live Session Insights",
    "NIFTY 50 is",
    "Top tracked gainer",
    "Create alerts from live conditions",
  ]) assert.match(source, new RegExp(copy));

  assert.match(source, /from "next\/image"/);
  assert.match(source, /data-market-news-research/);

  const newsLayoutBlock = [...styles.matchAll(/\.newsSection\s*\{[^}]*\}/g)]
    .map((match) => match[0])
    .find((block) => block.includes("margin: 56px 0 76px 50%"));
  assert.ok(newsLayoutBlock, "News layout block should define its vertical rhythm");
  assert.doesNotMatch(newsLayoutBlock, /left:\s*auto/);
  assert.match(newsLayoutBlock, /width:\s*89\.7vw/);
  assert.match(newsLayoutBlock, /margin:\s*56px 0 76px 50%/);
  assert.match(newsLayoutBlock, /transform:\s*translateX\(-50%\)/);
  assert.doesNotMatch(newsLayoutBlock, /width:\s*min\(100vw,\s*1408px\)/);
  assert.match(styles, /@media \(max-width: 1000px\)[\s\S]*?\.newsSection\s*\{[^}]*width:\s*min\(calc\(100vw - 28px\),\s*960px\)/);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*?\.newsSection\s*\{[^}]*width:\s*calc\(100vw - 24px\)/);
  assert.match(
    styles,
    /@media \(min-width: 1500px\)[\s\S]*?\.calendarSection\s*\{[^}]*width:\s*min\(calc\(100vw - 64px\), 1500px\)/,
  );
  assert.doesNotMatch(styles, /@media \(min-width: 1500px\)[\s\S]*?\.calendarSection,\s*\n\s*\.newsSection/);

  for (const name of ["bse", "chart", "rbi", "handshake"]) {
    await access(new URL(`public/images/market-news-${name}.png`, ROOT));
  }
});
