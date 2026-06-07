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

test("about values inlines the Figma icon and keeps it static on hover", () => {
  const sectionSource = readSource("src/components/sections/about/AboutValues.astro");

  assert.match(
    sectionSource,
    /<svg[^>]*viewBox="0 0 46 46"/,
    "Expected AboutValues to inline the Figma icon SVG instead of routing it through the image component",
  );
  assert.doesNotMatch(
    sectionSource,
    /LocalImage|getLocalImage|about-values-stack\.svg/,
    "Expected AboutValues to avoid the image-component asset path for the icon",
  );
  assert.match(
    sectionSource,
    /about-values-card/,
    "Expected AboutValues cards to expose a dedicated styling hook",
  );
  assert.match(
    sectionSource,
    /rounded-full bg-white shadow-\[0_4px_5px_rgba\(0,0,0,0\.05\)\]/,
    "Expected AboutValues to preserve the floating white icon circle from Figma",
  );
  assert.match(
    sectionSource,
    /background-color:\s*#fffff9|bg-\[#fffff9\]/,
    "Expected AboutValues hover styling to use the Figma warm white card surface",
  );
  assert.match(
    sectionSource,
    /box-shadow:\s*0 4px 20px rgba\(0,\s*0,\s*0,\s*0\.1\)|shadow-\[0_4px_20px_rgba\(0,0,0,0\.1\)\]/,
    "Expected AboutValues hover styling to match the Figma card shadow",
  );
  assert.match(
    sectionSource,
    /border-bottom-color:\s*#000|border-black/,
    "Expected AboutValues hover styling to restore the black bottom border from Figma",
  );
  assert.doesNotMatch(
    sectionSource,
    /\.about-values-card:hover \.about-values-card-icon[\s\S]*transform:/,
    "Expected AboutValues hover styling to keep the icon fixed instead of moving it",
  );
});
