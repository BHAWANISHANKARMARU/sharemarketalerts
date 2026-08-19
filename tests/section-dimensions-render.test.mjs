import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../src/app/components/', import.meta.url);

for (const file of ['Hero.module.css', 'IpoMarketIntelligence.module.css', 'HowItWorks.module.css']) {
  test(`${file} follows the shared section sizing system`, async () => {
    const css = await readFile(new URL(file, root), 'utf8');
    assert.match(css, /--section-max:\s*1920px/);
    assert.match(css, /--section-u:\s*calc\(min\(100vw,\s*1920px\)\s*\/\s*994\)/);
    assert.match(css, /--section-height:\s*calc\(553\s*\*\s*var\(--section-u\)\)/);
    assert.match(css, /--section-gutter:\s*clamp\(28px,\s*5\.4vw,\s*104px\)/);
    assert.match(css, /--section-tablet-gutter:\s*32px/);
    assert.match(css, /--section-mobile-gutter:\s*20px/);
    if (file === 'Hero.module.css') {
      assert.match(css, /\.hero\s*\{[\s\S]*?max-width:\s*none/);
      assert.match(css, /\.header,\s*\.heroBody,\s*\.stats\s*\{[\s\S]*?max-width:\s*var\(--hero-content-max\)/);
    } else {
    assert.match(css, /max-width:\s*var\(--(?:section-max|section-content-max|hero-content-max)\)/);
    }
  });
}

test('What You Receive preserves its composition with the shared olive canvas', async () => {
  const css = await readFile(new URL('WhatYouReceive.module.css', root), 'utf8');
  assert.match(css, /--receive-u:\s*calc\(min\(100vw,\s*1920px\)\s*\/\s*994\)/);
  assert.match(css, /max-width:\s*1920px/);
  assert.match(css, /#657f2d/i);
  assert.doesNotMatch(css, /#3ceca8/i);
  assert.doesNotMatch(css, /#178259/i);
});
