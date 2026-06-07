import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");

function readSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

test("testimonials section matches the Figma heading and metrics bar layout", () => {
  const sectionSource = readSource("src/components/sections/Testimonials.astro");

  assert.match(sectionSource, /Voices Of Our Partners/);
  assert.match(sectionSource, /lg:divide-x/);
  assert.match(sectionSource, /rounded-\[10px\] border border-border bg-surface/);
});

test("testimonial cards use inline author icons instead of floating icons", () => {
  const cardSource = readSource("src/components/ui/TestimonialCard.astro");
  const ratingSource = readSource("src/components/ui/RatingStars.astro");

  assert.match(cardSource, /border-t border-border/);
  assert.match(cardSource, /rounded-full border border-border bg-surface/);
  assert.match(cardSource, /Used For:/);
  assert.doesNotMatch(cardSource, /absolute right-5 bottom-5/);
  assert.match(
    cardSource,
    /testimonialQuoteImage/,
    "Expected TestimonialCard to replace the text quote mark with the provided local quote image asset",
  );
  assert.match(
    cardSource,
    /<Image[\s\S]*src=\{testimonialQuoteImage\}[\s\S]*alt=""[\s\S]*width=\{28\}[\s\S]*height=\{22\}/,
    "Expected TestimonialCard to render the local quote image at its intended dimensions",
  );
  assert.doesNotMatch(
    cardSource,
    /text-\[64px\][\s\S]*“/,
    "Expected TestimonialCard to stop rendering the oversized text quote glyph",
  );

  assert.match(ratingSource, /gap-2/);
  assert.match(ratingSource, /size-\[18\.532px\]/);
});

test("testimonial cards keep the author block pinned and reserve a consistent bottom area", () => {
  const cardSource = readSource("src/components/ui/TestimonialCard.astro");

  assert.match(cardSource, /mt-auto/);
  assert.match(cardSource, /min-h-\[88px\]/);
});
