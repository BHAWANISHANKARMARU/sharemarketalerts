import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("every financial line chart is rendered by the shared Recharts system", async () => {
  const response = await fetch(`${BASE_URL}/`);
  assert.equal(response.status, 200);

  const html = await response.text();
  const charts = html.match(/data-financial-chart="true"/g) ?? [];
  const rechartsCharts = html.match(/data-chart-engine="recharts"/g) ?? [];

  assert.equal(charts.length, 16, "A page chart is outside the shared chart system");
  assert.equal(rechartsCharts.length, 16, "A page chart is not rendered by Recharts");

  const positive = html.match(/data-chart-tone="positive"/g)?.length ?? 0;
  const negative = html.match(/data-chart-tone="negative"/g)?.length ?? 0;
  const brand = html.match(/data-chart-tone="brand"/g)?.length ?? 0;
  assert.equal(positive + negative + brand, 16);
  assert.equal(brand, 5);
  assert.ok(positive >= 1, "Live market data should render at least one rising chart");
  assert.ok(negative >= 1, "Live market data should render at least one falling chart");
});

test("the shared chart system uses the premium visual treatment", async () => {
  const chart = await readFile(
    new URL("../src/app/components/FinancialChart.js", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../src/app/components/FinancialChart.module.css", import.meta.url),
    "utf8",
  );

  assert.match(chart, /type="monotone"/);
  assert.match(chart, /dataKey="index"/);
  assert.match(chart, /width >= 300/);
  assert.match(chart, /strokeWidth=\{2\.75\}/);
  assert.match(chart, /stopOpacity=\{0\.18\}/);
  assert.match(chart, /stopOpacity=\{0\}/);
  assert.match(chart, /vertical=\{false\}/);
  assert.match(chart, /horizontalCoordinatesGenerator/);
  assert.match(chart, /axisLine=\{false\}/);
  assert.match(chart, /tickLine=\{false\}/);
  assert.match(chart, /dot=\{false\}/);
  assert.match(chart, /animationDuration=\{700\}/);
  assert.match(chart, /animationEasing="ease-out"/);
  assert.match(chart, /r=\{3\}/);
  assert.doesNotMatch(chart, /useEffect\(\(\) => setMounted/);
  assert.match(styles, /border-radius:\s*16px/);
  assert.match(styles, /font-family:\s*var\(--font-sans\)/);
});
