import assert from "node:assert/strict";
import test from "node:test";

test("insights renders the supplied learning library in guide order", async () => {
  const response = await fetch("http://127.0.0.1:3000/insights");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = html.replace(/<!--.*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  assert.match(html, /data-insights-learning-library="true"/);
  assert.equal((html.match(/data-learning-guide="true"/g) || []).length, 4);
  assert.equal((text.match(/Open guide ↗/g) || []).length, 4);

  const copy = [
    "Learning library",
    "Build a better market process",
    "Short guides connect each workspace to the decision it is designed to support.",
    "Reading market breadth",
    "Understand how participation confirms—or contradicts—the index.",
    "Building a price alert",
    "Turn a thesis into a condition, confirmation rule and delivery path.",
    "Comparing IPO demand",
    "Separate issue terms, bidder categories, GMP and listing expectations.",
    "Using a stock screener",
    "Move from a broad universe to a ranked, reviewable opportunity queue.",
  ];
  for (const value of copy) assert.ok(text.includes(value), `missing copy: ${value}`);
  for (let index = 1; index < copy.length; index += 1) {
    assert.ok(text.indexOf(copy[index - 1]) < text.indexOf(copy[index]), `copy order: ${copy[index - 1]}`);
  }
});
