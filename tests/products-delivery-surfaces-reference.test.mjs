import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("delivery surfaces renders three detailed reference previews", async () => {
  const source = await readFile(new URL("src/app/components/platform/ProductsExperience.js", ROOT), "utf8");
  const styles = await readFile(new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT), "utf8");

  assert.match(source, /data-delivery-surfaces/);
  for (const copy of ["DELIVERY SYSTEM", "Morning Market Brief", "Breakout Confirmed", "Recent outcomes", "View chart"]) {
    assert.match(source, new RegExp(copy));
  }
  assert.match(styles, /\.deliveryCards[\s\S]*?grid-template-columns:\s*repeat\(3,\s*1fr\)/);
  assert.match(styles, /\.deliveryPreview/);
  assert.match(styles, /\.messagePreview/);
  assert.match(styles, /@media \(max-width:\s*900px\)/);
});
