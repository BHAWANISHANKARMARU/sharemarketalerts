import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("products toolkit matches the eight-card reference anatomy", async () => {
  const source = await readFile(new URL("src/app/components/platform/ProductsExperience.js", ROOT), "utf8");
  const styles = await readFile(new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT), "utf8");

  assert.match(source, /MARKET TOOLS/);
  assert.match(source, /data-toolkit-grid/);
  assert.match(source, /ToolkitIcon/);
  for (const item of ["Reliable data", "Real-time updates", "Custom workflows", "Secure by design"]) {
    assert.match(source, new RegExp(item));
  }
  assert.match(styles, /\.toolkitDirectory[\s\S]*?background:\s*transparent/);
  assert.match(styles, /\.toolkitDirectory[\s\S]*?box-shadow:\s*none/);
  assert.match(styles, /\.toolkitGrid[\s\S]*?grid-template-columns:\s*repeat\(4,\s*1fr\)/);
  assert.match(styles, /\.toolkitTrust/);
  assert.match(styles, /box-shadow:/);
});
