import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

test("homepage uses one complete hero that reflows on tablet and mobile", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const section = html.match(
    /<section[^>]+data-reference-hero="true"[\s\S]*?<\/section>/,
  );
  assert.ok(section, "Missing responsive reference hero");

  const text = visibleText(html);
  for (const copy of [
    "SMARTER ALERTS. BETTER TRADES.",
    "Real-Time Share",
    "Market Alerts",
    "That Give You Edge",
    "Start Free Trial",
    "Watch Demo",
    "Live Market Overview",
    "Recent Alerts",
    "Trusted by 50K+ Traders",
  ]) {
    assert.ok(text.includes(copy), `Missing responsive hero copy: ${copy}`);
  }

  assert.equal((section[0].match(/data-hero-benefit="true"/g) ?? []).length, 3);
  assert.equal((section[0].match(/data-market-alert="true"/g) ?? []).length, 3);
});

test("hero CSS stacks without horizontal overflow on narrow devices", async () => {
  const styles = await readFile(
    new URL("src/app/components/Hero.module.css", ROOT),
    "utf8",
  );
  assert.match(styles, /@media \(max-width:\s*820px\)/);
  assert.match(styles, /@media \(max-width:\s*720px\)/);
  assert.match(styles, /\.heroBody[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(styles, /\.marketCard\s*\{\s*width:\s*100%/);
  assert.match(styles, /overflow-x:\s*hidden/);
});
