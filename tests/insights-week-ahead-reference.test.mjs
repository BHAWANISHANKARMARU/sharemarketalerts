import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("insights week-ahead section matches the tactical calendar reference anatomy", async () => {
  const [experience, calendar] = await Promise.all([
    readFile(new URL("src/app/components/platform/InsightsExperience.js", ROOT), "utf8"),
    readFile(new URL("src/app/components/platform/InsightsWeekAhead.js", ROOT), "utf8"),
  ]);

  assert.match(experience, /import InsightsWeekAhead from "\.\/InsightsWeekAhead"/);
  assert.match(experience, /<InsightsWeekAhead\s*\/>/);
  assert.match(calendar, /data-insights-week-ahead="true"/);
  assert.match(calendar, /src="\/images\/insights-tactical-calendar\.png"/);
  assert.match(calendar, /TACTICAL CALENDAR/);
  assert.match(calendar, /Events ranked by their capacity to change positioning\./);

  for (const copy of [
    "Industrial output",
    "Key indicator for manufacturing momentum and capacity utilisation.",
    "Large-bank results",
    "Result season update from major banks across the index.",
    "CPI inflation",
    "Inflation print drives rate expectations and market liquidity.",
    "Weekly institutional flows",
    "Track domestic and FII flows across cash and derivatives.",
    "Stay prepared",
    "View full market calendar",
  ]) {
    assert.match(calendar, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal((calendar.match(/data-tactical-event="true"/g) || []).length, 1);
  assert.match(calendar, /EVENTS\.map/);
  await access(new URL("public/images/insights-tactical-calendar.png", ROOT));
});

test("week-ahead reference styling preserves desktop geometry and mobile readability", async () => {
  const styles = await readFile(
    new URL("src/app/components/platform/InsightsWeekAhead.module.css", ROOT),
    "utf8",
  );

  assert.match(styles, /\.section\s*\{[\s\S]*?grid-template-columns:\s*280px\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /\.eventCard\s*\{[\s\S]*?min-height:\s*144px/);
  assert.match(styles, /\.eventCard::before/);
  assert.match(styles, /\.impactMeter/);
  assert.match(styles, /@media \(max-width:\s*760px\)/);
  assert.match(styles, /font-size:\s*clamp\(40px,/);
});
