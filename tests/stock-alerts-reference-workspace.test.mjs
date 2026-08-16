import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("stock alerts integrates the alert controls into the live monitoring dashboard", async () => {
  const page = await readFile(
    new URL("src/app/components/platform/StockAlertsExperience.js", ROOT),
    "utf8",
  );
  const dashboard = await readFile(
    new URL("src/app/components/platform/LiveRuleMonitoring.js", ROOT),
    "utf8",
  );
  const dashboardStyles = await readFile(
    new URL("src/app/components/platform/LiveRuleMonitoring.module.css", ROOT),
    "utf8",
  );
  const pageStyles = await readFile(
    new URL("src/app/components/platform/StockAlertsWorkspace.module.css", ROOT),
    "utf8",
  );

  assert.doesNotMatch(page, /AlertRuleWorkspace/);
  assert.match(dashboard, /data-integrated-alert-controls="true"/);
  assert.match(dashboard, /className=\{styles\.monitorCore\}/);
  assert.match(dashboard, /className=\{styles\.alertDock\}/);
  assert.match(dashboard, /className=\{styles\.signalRule\}/);
  assert.match(dashboard, /Create alert/);
  assert.match(dashboard, /Active alerts/);
  assert.match(dashboard, /Triggered/);
  assert.match(dashboard, /Settings/);
  assert.match(dashboard, /Create price alert/);
  assert.match(dashboard, /Confirm on candle close/);
  assert.match(dashboard, /Web/);
  assert.match(dashboard, /Email/);
  assert.match(dashboard, /Messaging/);
  assert.match(dashboard, /fetch\(`\/api\/market\/chart\?symbol=/);
  assert.match(dashboardStyles, /\.dashboard\s*\{[^}]*background:\s*#fff;/);
  assert.match(dashboardStyles, /\.dashboard\s*\{[^}]*border:\s*1px solid #dfe5e3;/);
  assert.match(pageStyles, /\.unifiedCanvas\s*\{[^}]*width:\s*100vw;[^}]*margin-left:\s*calc\(50% - 50vw\);[^}]*background:\s*#fff;/);
  assert.match(dashboardStyles, /\.dashboard\s*\{[^}]*box-shadow:\s*none;/);
  assert.match(dashboardStyles, /\.monitorLayout\s*\{[^}]*overflow:\s*clip;/);
  assert.match(dashboardStyles, /\.monitorCore\s*\{[^}]*overflow:\s*visible;[^}]*box-shadow:\s*none;/);
  assert.match(dashboardStyles, /\.darkShell\s*\{[^}]*box-shadow:\s*0 0 0 100vmax #000b10;[^}]*clip-path:\s*inset\(0 -100vmax\);/);
  assert.match(dashboardStyles, /\.integratedControls\s*\{[^}]*box-shadow:\s*none;/);
  assert.match(dashboardStyles, /\.signalCard\s*\{[^}]*box-shadow:\s*none;/);
  assert.match(dashboardStyles, /\.signalComposer\s*\{[^}]*box-shadow:\s*none;/);
  assert.match(dashboardStyles, /\.alertTabState\s*\{[^}]*box-shadow:\s*none;/);
});

test("stock alerts owns a responsive reference-matched visual module", async () => {
  const styleUrl = new URL(
    "src/app/components/platform/StockAlertsWorkspace.module.css",
    ROOT,
  );
  await access(styleUrl);
  const styles = await readFile(styleUrl, "utf8");

  assert.match(styles, /--alert-accent:\s*#7000ff/);
  assert.match(styles, /width:\s*calc\(100% - 35px\)/);
  assert.match(styles, /grid-template-columns:\s*minmax\(0,\s*2\.04fr\)\s+minmax\(360px,\s*1fr\)/);
  assert.match(styles, /\.ruleFields\s*\{[\s\S]*?padding:\s*5px 15px 4px;[\s\S]*?gap:\s*4px 12px/);
  assert.match(styles, /@media \(max-width:\s*900px\)/);
  assert.match(styles, /@media \(max-width:\s*600px\)/);
});

test("premium trend charts support the visible alert rule threshold", async () => {
  const source = await readFile(
    new URL("src/app/components/platform/PremiumTrendChart.js", ROOT),
    "utf8",
  );

  assert.match(source, /ReferenceLine/);
  assert.match(source, /referenceValue/);
  assert.match(source, /ruleLevelLabel/);
});
