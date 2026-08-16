import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("community ideas renders the six-card reference board", async () => {
  const source = await readFile(new URL("src/app/components/platform/InsightsExperience.js", ROOT), "utf8");
  const styles = await readFile(new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT), "utf8");

  assert.match(source, /data-community-ideas-reference="true"/);
  assert.match(source, /COMMUNITY IDEAS/);
  assert.equal((source.match(/<IdeaSparkline/g) || []).length, 1);
  assert.match(source, /See community guidelines/);
  assert.match(source, /Do your own analysis before acting/);
  assert.match(styles, /\.communityIdeasGrid\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*1fr\)/);
  assert.match(styles, /\.communitySparkline/);
  assert.match(styles, /\.communityGuidelines/);
});
