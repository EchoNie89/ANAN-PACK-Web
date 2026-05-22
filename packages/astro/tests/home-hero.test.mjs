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

test("home hero matches the approved redesign content and structure", () => {
  const source = readSource("src/components/sections/Hero.astro");

  for (const copy of [
    "PACKAGING & TRIMS SOURCING PARTNER",
    "One-Stop Packaging & Trims",
    "Supply Chain Partner For Fashion, Home",
    "Textile, And Lifestyle Brands.",
    "From hang tags and woven labels to bags, stickers, and tissue paper, we coordinate sourcing, development, sampling, and quality control for your brand.",
    "REQUEST A QUOTE",
    "EXPLORE SOLUTIONS",
  ]) {
    assert.match(
      source,
      new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `Expected hero source to include approved copy: ${copy}`,
    );
  }

  assert.match(
    source,
    /font-display/,
    "Expected the hero headline to use the site display font stack",
  );

  assert.match(
    source,
    /bg-\[linear-gradient\(/,
    "Expected the hero overlay to use a custom gradient closer to the Figma composition",
  );

  assert.match(
    source,
    /md:min-h-\[766px\]/,
    "Expected the desktop hero height to be tuned to the Figma composition instead of the old generic height",
  );

  assert.match(
    source,
    /href:\s*"\/contact-us#project-form"/,
    "Expected the primary CTA destination to remain the contact inquiry form",
  );

  assert.match(
    source,
    /href:\s*"#solutions"/,
    "Expected the secondary CTA destination to remain the solutions section",
  );
});
