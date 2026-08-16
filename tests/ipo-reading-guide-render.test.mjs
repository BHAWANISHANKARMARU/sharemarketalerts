import assert from "node:assert/strict";
import test from "node:test";

test("IPO page renders the complete reading guide at the bottom", async () => {
  const response = await fetch("http://localhost:3000/ipo");
  assert.equal(response.status, 200);

  const html = await response.text();
  const text = html
    .replace(/<!--.*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  const guideStart = html.indexOf('data-ipo-reading-guide="true"');
  const sourceStart = html.indexOf("Source:");

  assert.ok(guideStart >= 0, "reading guide landmark is missing");
  assert.ok(sourceStart > guideStart, "reading guide must render above the source note");
  assert.equal((html.match(/data-ipo-reading-card="true"/g) || []).length, 4);
  assert.equal((html.match(/data-ipo-reading-icon="true"/g) || []).length, 4);

  for (const copy of [
    "Read the issue, not only the premium",
    "GMP reflects informal demand. It does not measure valuation, allocation probability or post-listing liquidity.",
    "Separate institutional, non-institutional and retail bids.",
    "Compare the upper band with relevant listed peers.",
    "Distinguish growth capital from shareholder exits.",
    "Review leverage, concentration and litigation disclosures.",
  ]) {
    assert.match(text, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
