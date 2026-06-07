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

test("master your materials uses a mobile-only compact card height", () => {
  const pageSource = readSource("src/pages/blog/index.astro");
  const listingSource = readSource("src/components/sections/blog/BlogListingSection.astro");
  const cardSource = readSource("src/components/ui/BlogCard.astro");

  assert.match(
    pageSource,
    /<BlogListingSection\s+id="material-guides"[\s\S]*?title="Master Your Materials"[\s\S]*?cardScale="mobileCompact"/,
    "Expected Master Your Materials to opt into a mobile-only compact card treatment",
  );
  assert.doesNotMatch(
    pageSource,
    /<BlogListingSection\s+id="industry-insights"[\s\S]*?cardScale="mobileCompact"/,
    "Expected Industry Trends & Knowledge to keep its existing card sizing",
  );
  assert.match(
    listingSource,
    /cardScale\?: "regular" \| "compact" \| "mobileCompact";/,
    "Expected BlogListingSection to accept the mobile-only compact card scale",
  );
  assert.match(
    cardSource,
    /scale\?: "regular" \| "compact" \| "mobileCompact";/,
    "Expected BlogCard to expose the mobile-only compact scale",
  );
  assert.match(
    cardSource,
    /const isMobileCompactDefault = !isIndustry && scale === "mobileCompact";/,
    "Expected BlogCard to detect the mobile-only compact default variant separately from the desktop compact variant",
  );
  assert.match(
    cardSource,
    /isMobileCompactDefault\s*\?\s*"min-h-\[286px\] md:min-h-\[326px\]"/,
    "Expected the mobile-only compact blog card body to shrink on mobile while preserving the desktop height",
  );
});
