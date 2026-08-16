import assert from "node:assert/strict";
import test from "node:test";

test("products page renders both supplied reference sections", async () => {
  const response = await fetch("http://localhost:3000/products");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = html.replace(/<!--.*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  const decisions = html.indexOf('data-product-decision-tools="true"');
  const products = html.indexOf('data-platform-products="true"');
  assert.ok(decisions >= 0, "decision tools landmark is missing");
  assert.ok(products > decisions, "platform products must follow decision tools");
  assert.equal((html.match(/data-decision-tool="true"/g) || []).length, 4);
  assert.equal((html.match(/data-platform-product-card="true"/g) || []).length, 6);
  assert.equal((html.match(/data-platform-trust-item="true"/g) || []).length, 4);

  for (const copy of [
    "Built around the decision", "Four tools, one continuous workflow", "All capabilities", "For traders", "For investors",
    "Market Lens", "Signal Engine", "IPO Desk", "Alert Router",
    "All platform products", "Complete market coverage organised by the job you need to do", "Launch workspace",
    "Charting", "Screeners", "Heatmaps", "Calendars", "Research", "Alerts",
    "Multi-timeframe charts", "Technical overlays", "Drawing and annotation", "Multi-channel delivery",
  ]) assert.match(text, new RegExp(copy));
});
