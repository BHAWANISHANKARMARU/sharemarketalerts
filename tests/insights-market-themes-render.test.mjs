import assert from "node:assert/strict";
import test from "node:test";

test("insights renders the supplied market themes reference section", async () => {
  const response = await fetch("http://localhost:3000/insights");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = html.replace(/<!--.*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert.match(html, /data-market-themes="true"/);
  assert.equal((html.match(/data-market-theme="true"/g) || []).length, 4);
  assert.equal((html.match(/data-theme-status="true"/g) || []).length, 3);
  for (const copy of [
    "Market themes", "What the research desk is tracking now",
    "Broadening leadership", "Banks, autos and industrials are sharing index leadership.", "Constructive",
    "Compressed volatility", "Low implied volatility leaves less room for weak execution.", "Watch",
    "Primary-market demand", "Issue quality matters more as GMP dispersion widens.", "Selective",
    "Global technology", "Overnight strength supports domestic IT, but currency matters.",
  ]) assert.match(text, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok(text.indexOf("Broadening leadership") < text.indexOf("Compressed volatility"));
  assert.ok(text.indexOf("Compressed volatility") < text.indexOf("Primary-market demand"));
  assert.ok(text.indexOf("Primary-market demand") < text.indexOf("Global technology"));
});
