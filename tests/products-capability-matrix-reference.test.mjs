import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("products capability matrix contains the complete reference anatomy", async () => {
  const source = await readFile(new URL("src/app/components/platform/ProductsExperience.js", ROOT), "utf8");
  const styles = await readFile(new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT), "utf8");

  assert.match(source, /PLATFORM OVERVIEW/);
  assert.match(source, /data-capability-matrix/);
  for (const detail of [
    "Real-time prices, structure and momentum.",
    "Understand market rotation and strength.",
    "Track offers, terms and key milestones.",
    "Create precise rules across conditions.",
    "Clear context for better decision making.",
    "Deliver alerts where you already work.",
  ]) assert.match(source, new RegExp(detail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(styles, /\.capabilityMatrixTable/);
  assert.match(styles, /border-collapse:\s*separate/);
  assert.match(styles, /\.matrixCheck[\s\S]*?background:\s*#007342/);
  assert.match(styles, /overflow-x:\s*auto/);
});
