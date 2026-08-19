import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("homepage hero implements the supplied share-market reference", async () => {
  const source = await readFile(
    new URL("src/app/components/Hero.js", ROOT),
    "utf8",
  );

  assert.match(source, /data-reference-hero="true"/);
  for (const copy of [
    "SMARTER ALERTS. BETTER TRADES.",
    "Real-Time Share",
    "Market Alerts",
    "That Give You Edge",
    "Real-Time Alerts",
    "Expert Insights",
    "Actionable Signals",
    "Live Market Overview",
    "Recent Alerts",
    "Trusted by 50K+ Traders",
    "50K+",
    "98.6%",
    "24/7",
    "100+",
  ]) {
    assert.match(source, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(source, /BENEFITS\.map\(/);
  assert.match(source, /STATS\.map\(/);
  assert.match(source, /ALERTS\.map\(/);
  assert.match(source, /data-hero-benefit="true"/);
  assert.match(source, /data-hero-stat="true"/);
  assert.match(source, /data-market-alert="true"/);
  assert.equal((source.match(/data-trader-avatar="true"/g) ?? []).length, 3);
});

test("reference hero has explicit tablet and mobile reflow rules", async () => {
  const styles = await readFile(
    new URL("src/app/components/Hero.module.css", ROOT),
    "utf8",
  );

  assert.match(styles, /--section-max:\s*1920px/);
  assert.match(styles, /@media \(max-width:\s*1100px\)/);
  assert.match(styles, /@media \(max-width:\s*720px\)/);
  assert.match(styles, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /grid-template-columns:\s*1fr/);
  assert.match(styles, /overflow-x:\s*hidden/);
});

test("hero background spans the viewport while reference geometry stays capped", async () => {
  const styles = await readFile(
    new URL("src/app/components/Hero.module.css", ROOT),
    "utf8",
  );

  assert.match(styles, /\.hero\s*\{[\s\S]*?max-width:\s*none/);
  assert.match(styles, /--hero-content-max:\s*1580px/);
  assert.match(styles, /\.header,\s*\.heroBody,\s*\.stats\s*\{[\s\S]*?max-width:\s*var\(--hero-content-max\)/);
});

test("decorative chart uses two independently positioned upright candle clusters", async () => {
  const source = await readFile(
    new URL("src/app/components/Hero.js", ROOT),
    "utf8",
  );

  assert.match(source, /data-candle-cluster="left"/);
  assert.match(source, /data-candle-cluster="right"/);
  assert.match(source, /<rect x="18" y="480"/);
  assert.match(source, /<rect x="633" y="139"/);
});

test("market backdrop shares one SVG coordinate system for disc rings and candles", async () => {
  const source = await readFile(
    new URL("src/app/components/Hero.js", ROOT),
    "utf8",
  );

  assert.match(source, /function MarketBackdrop/);
  assert.match(source, /className=\{s\.marketBackdrop\}/);
  assert.match(source, /data-backdrop-ring="1"/);
  assert.match(source, /data-backdrop-ring="2"/);
  assert.match(source, /data-backdrop-ring="3"/);
  assert.match(source, /data-backdrop-disc="true"/);
  assert.match(source, /id="backdrop-ring-fade"/);
  assert.match(source, /mask="url\(#backdrop-ring-fade\)"/);
  assert.match(source, /data-backdrop-disc="true"[^>]+r="290"/);
  assert.match(source, /data-candle-cluster="left"[^>]+transform="translate\(-72 0\)"/);
  assert.match(source, /data-candle-cluster="right"[^>]+transform="translate\(28 0\)"/);
});

test("trial assurances use circular checks and reference separators", async () => {
  const [source, styles] = await Promise.all([
    readFile(new URL("src/app/components/Hero.js", ROOT), "utf8"),
    readFile(new URL("src/app/components/Hero.module.css", ROOT), "utf8"),
  ]);
  assert.equal((source.match(/className=\{s\.assuranceCheck\}/g) ?? []).length, 3);
  assert.match(styles, /\.assuranceCheck\s*\{[^}]*border-radius:\s*50%/s);
  assert.match(styles, /\.assurances span \+ span::before/);
});

test("concentric backdrop rings remain intentionally faint", async () => {
  const styles = await readFile(
    new URL("src/app/components/Hero.module.css", ROOT),
    "utf8",
  );
  assert.match(styles, /\.backdropRing\s*\{[^}]*opacity:\s*0?\.10\s*;/s);
});
