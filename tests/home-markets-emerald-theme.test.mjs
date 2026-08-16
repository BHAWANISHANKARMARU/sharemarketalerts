import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

import { emeraldMarketTheme } from "../src/lib/visual-themes.js";

test("Home and Markets expose the shared emerald visual theme", () => {
  assert.deepEqual(emeraldMarketTheme.colors, {
    primary: "#006b3c",
    accent: "#007a55",
    bright: "#00a76f",
    soft: "#e8f6ef",
    ink: "#101b17",
  });

  assert.equal(emeraldMarketTheme.chart.stroke, "#007a55");
  assert.equal(emeraldMarketTheme.chart.gradientOpacity, 0.18);
  assert.deepEqual(emeraldMarketTheme.surfaces, {
    white: "#ffffff",
    soft: "linear-gradient(135deg, #ffffff 0%, #fbfdfc 38%, #f4f9f8 100%)",
  });
});

test("Home and Markets green artwork is available from stable public URLs", async () => {
  const assets = Object.values(emeraldMarketTheme.assets);
  assert.equal(assets.length, 9);
  await Promise.all(assets.map((asset) => access(new URL(`../public${asset}`, import.meta.url))));
});
