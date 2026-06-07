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

test("industry blog cards float the frosted date badge outside the image crop", () => {
  const cardSource = readSource("src/components/ui/BlogCard.astro");

  assert.match(
    cardSource,
    /<div class="relative aspect-\[374\/228\]">/,
    "Expected the industry card to use a non-clipping positioning wrapper for the hero area",
  );
  assert.match(
    cardSource,
    /<div class="size-full overflow-hidden bg-surface-muted">[\s\S]*<LocalImage/,
    "Expected the industry card image crop to live in its own overflow-hidden child wrapper",
  );
  assert.match(
    cardSource,
    /absolute left-5 top-\[142px\] z-10 flex h-\[113px\] w-\[70px\]/,
    "Expected the frosted date badge to stay absolutely positioned above the image/body seam with an explicit stacking context",
  );
  assert.doesNotMatch(
    cardSource,
    /<div class="relative aspect-\[374\/228\] overflow-hidden bg-surface-muted">/,
    "Expected the industry card positioning wrapper to stop clipping the floating date badge",
  );
});
