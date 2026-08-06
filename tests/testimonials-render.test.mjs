import assert from "node:assert/strict";
import test from "node:test";

const REQUIRED_COPY = [
  "TESTIMONIALS",
  "Why serious traders stay with ShareMarketAlerts.",
  "Traders rely on us for IPO GMP clarity, real-time alerts, and the confidence to act before the market moves.",
  "4.9/5",
  "average rating",
  "25,000+",
  "active traders",
  "1.2M+",
  "alerts delivered",
  "92%",
  "users continue trading with us",
];

const REQUIRED_IMAGES = [
  "ChatGPT Image Aug 4, 2026, 12_48_36 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_48_25 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_48_53 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_48_09 AM.png",
  "ChatGPT Image Aug 4, 2026, 12_47_43 AM.png",
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

test("Testimonials renders after Market Coverage with the approved content and artwork", async () => {
  const response = await fetch("http://127.0.0.1:3000/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const sectionMatch = html.match(
    /<section[^>]*data-section="testimonials"[\s\S]*?<\/section>/,
  );
  assert.ok(sectionMatch, "Testimonials section is missing");
  assert.match(sectionMatch[0], /id="testimonials"/);
  assert.match(sectionMatch[0], /aria-labelledby="testimonials-title"/);

  const sectionText = visibleText(sectionMatch[0]);
  for (const copy of REQUIRED_COPY) {
    assert.ok(sectionText.includes(copy), `Missing from Testimonials: ${copy}`);
  }

  for (const filename of REQUIRED_IMAGES) {
    assert.ok(
      sectionMatch[0].includes(`/images/${filename}`),
      `Missing testimonial artwork: ${filename}`,
    );
  }

  const metrics = sectionMatch[0].match(
    /<ul[^>]*aria-label="Trader trust statistics"[\s\S]*?<\/ul>/,
  );
  assert.ok(metrics, "Trader trust statistics must be a named list");
  assert.equal(metrics[0].match(/<li\b/g)?.length ?? 0, 4);

  assert.ok(
    html.indexOf('data-section="testimonials"') >
      html.indexOf('data-section="market-coverage"'),
    "Testimonials must render after Market Coverage",
  );
});
