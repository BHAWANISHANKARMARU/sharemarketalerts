import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("products renders the reference workspace as an isolated interactive hero", async () => {
  const [experience, decisionTools] = await Promise.all([
    readFile(new URL("src/app/components/platform/ProductsExperience.js", ROOT), "utf8"),
    readFile(new URL("src/app/components/platform/ProductDecisionTools.js", ROOT), "utf8"),
  ]);
  const source = `${experience}\n${decisionTools}`;

  assert.match(source, /import hero from "\.\/ProductsHero\.module\.css"/);
  assert.match(source, /data-products-hero="true"/);
  assert.match(source, /<SiteHeader/);
  for (const copy of [
    "Product workspace",
    "Move from market context to a qualified alert without rebuilding the decision in another tool.",
    "Open live workspace",
    "Tool preview",
    "One shared context layer",
    "AVAILABLE NOW",
    "All systems operational",
    "Context is presented from detection through delivery.",
  ]) {
    assert.match(source, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(source, /useState\(TOOLS\[0\]\)/);
  assert.match(source, /onClick=\{\(\) => setActiveTool\(tool\)\}/);
  assert.match(source, /onClick=\{\(\) => setTab\(item\)\}/);
  assert.match(source, /Built around the decision/);
  assert.match(source, /Explore the market toolkit/);
  assert.match(source, /Capability matrix/);
  assert.match(source, /Delivery surfaces/);
});

test("products hero owns the emerald reference geometry and responsive rules", async () => {
  const styles = await readFile(
    new URL("src/app/components/platform/ProductsHero.module.css", ROOT),
    "utf8",
  );

  assert.match(styles, /--hero-green:\s*#006b3c/);
  assert.match(styles, /\.heroCanvas[\s\S]*?clip-path:\s*none/);
  assert.match(styles, /max-width:\s*1360px/);
  assert.match(styles, /\.heroField[\s\S]*?background:\s*#fff/);
  assert.match(styles, /\.workbench[\s\S]*?grid-template-columns:\s*210px\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /radial-gradient\(/);
  assert.match(styles, /@media \(max-width:\s*700px\)/);
  assert.match(styles, /@media \(min-width:\s*1500px\)/);
  assert.match(styles, /max-width:\s*1440px/);
  assert.match(styles, /overflow-x:\s*auto/);
});
