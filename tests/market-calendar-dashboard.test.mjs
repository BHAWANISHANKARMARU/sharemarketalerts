import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("live Indian revenue estimates format identically on server and browser", async () => {
  const { formatIndianRevenue } = await import("../src/app/lib/market-formatters.js");

  assert.equal(formatIndianRevenue(722_000_000_000), "₹72.2KCr");
  assert.equal(formatIndianRevenue(72_200_000_000_000), "₹72.2LCr");
  assert.equal(formatIndianRevenue(450_000_000), "₹45Cr");
  assert.equal(formatIndianRevenue(null), "—");
});

test("market calendar model exposes the complete reference week and grouped events", async () => {
  const {
    CALENDAR_DAYS,
    ECONOMIC_CALENDAR_GROUPS,
    moveCalendarSelection,
  } = await import("../src/app/lib/market-calendar-data.js");

  assert.deepEqual(
    CALENDAR_DAYS.map(({ weekday, day, month }) => [weekday, day, month]),
    [
      ["Mon", 12, "May"],
      ["Tue", 13, "May"],
      ["Wed", 14, "May"],
      ["Today", 15, "May"],
      ["Fri", 16, "May"],
      ["Sat", 17, "May"],
      ["Sun", 18, "May"],
    ],
  );
  assert.equal(ECONOMIC_CALENDAR_GROUPS.length, 3);
  assert.equal(
    ECONOMIC_CALENDAR_GROUPS.flatMap(({ events }) => events).length,
    7,
  );
  assert.deepEqual(
    ECONOMIC_CALENDAR_GROUPS.flatMap(({ events }) => events).map(({ event }) => event),
    [
      "WPI Inflation (YoY)",
      "CPI Inflation (YoY)",
      "Industrial Production (YoY)",
      "RBI Monetary Policy Meeting Minutes",
      "Trade Balance",
      "Forex Reserves",
      "GDP Growth Rate (YoY)",
    ],
  );
  assert.equal(moveCalendarSelection(3, -1), 2);
  assert.equal(moveCalendarSelection(0, -1), 0);
  assert.equal(moveCalendarSelection(6, 1), 6);
});

test("markets route uses the responsive reference calendar dashboard", async () => {
  const experience = await readFile(
    new URL("src/app/components/platform/MarketsExperience.js", ROOT),
    "utf8",
  );
  const component = await readFile(
    new URL("src/app/components/platform/MarketCalendarDashboard.js", ROOT),
    "utf8",
  );
  const styles = await readFile(
    new URL("src/app/components/platform/MarketCalendarDashboard.module.css", ROOT),
    "utf8",
  );

  assert.match(experience, /import MarketCalendarDashboard/);
  assert.match(experience, /<MarketCalendarDashboard\s+ariaLabel="Market calendars"\s*\/>/);
  assert.match(component, /Market <span>Calendar<\/span>/);
  assert.match(component, /Live earnings dates and analyst estimates/);
  assert.match(component, /High Impact/);
  assert.match(component, /Medium Impact/);
  assert.match(component, /Low Impact/);
  assert.match(component, /View Full Economic Calendar/);
  assert.match(component, /aria-label="Previous calendar day"/);
  assert.match(component, /aria-label="Next calendar day"/);
  assert.match(styles, /grid-template-columns:\s*112px minmax\(260px,\s*37\.66%\) 86px minmax\(264px,\s*1fr\)/);
  assert.match(styles, /\.eventValues\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(88px,\s*1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*760px\)/);
  assert.match(styles, /\.eventRow\s*\{[\s\S]*?grid-template-columns:\s*82px minmax\(0,\s*1fr\)/);
});
