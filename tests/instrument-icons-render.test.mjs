import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ROOT = new URL("../", import.meta.url);

test("real brand logos render large without decorative icon tiles", async () => {
  const styles = await readFile(
    new URL("src/app/components/platform/TradingWorkspace.module.css", ROOT),
    "utf8",
  );

  assert.match(styles, /\.instrumentMark\[data-instrument-logo="brand"\][^{]*\{[^}]*background:\s*transparent\s*!important/);
  assert.match(styles, /\.instrumentLogo\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%/);
});

test("API-backed stocks and indices render their real brand logos", async () => {
  const response = await fetch("http://localhost:3000/markets");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /data-instrument-symbol="TCS" data-instrument-kind="technology" data-instrument-logo="brand"[^>]*><img[^>]+src="\/api\/market\/logo\?symbol=TCS\.NS"/,
  );
  assert.match(
    html,
    /data-instrument-symbol="RELIANCE" data-instrument-kind="energy" data-instrument-logo="brand"[^>]*><img[^>]+src="\/api\/market\/logo\?symbol=RELIANCE\.NS"/,
  );
  assert.match(
    html,
    /data-instrument-symbol="\^NSEI"[^>]+data-instrument-logo="brand"[^>]*><img[^>]+src="\/api\/market\/logo\?symbol=%5ENSEI"/,
  );
  assert.match(
    html,
    /data-instrument-symbol="\^BSESN"[^>]+data-instrument-logo="brand"[^>]*><img[^>]+src="\/api\/market\/logo\?symbol=%5EBSESN"/,
  );
});

test("instrument logo API resolves arbitrary Indian stock symbols without a manual allowlist", async () => {
  for (const symbol of ["TCS.NS", "TATAMOTORS.NS", "SBIN.NS", "ITC.NS", "^NSEI", "^BSESN"]) {
    const response = await fetch(
      `http://localhost:3000/api/market/logo?symbol=${encodeURIComponent(symbol)}`,
    );

    assert.equal(response.status, 200, `${symbol} logo should load`);
    assert.match(response.headers.get("content-type") || "", /^image\//, `${symbol} should return an image`);
    assert.ok((await response.arrayBuffer()).byteLength > 100, `${symbol} logo should not be empty`);
  }
});
