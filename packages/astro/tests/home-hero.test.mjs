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
    /section class="[^"]*lg:h-\[calc\(100dvh-88px\)\]/,
    "Expected the hero section itself to own the desktop viewport-height sizing beneath the sticky 88px header",
  );

  assert.match(
    source,
    /lg:h-full lg:min-h-0/,
    "Expected the inner hero container to stretch to the section height instead of competing with it via a desktop min-height",
  );

  assert.doesNotMatch(
    source,
    /lg:min-h-\[calc\(100dvh-88px\)\]/,
    "Expected the desktop viewport-height rule to move off the inner container so it can take effect on the visible hero block",
  );

  assert.match(
    source,
    /lg:pt-24 lg:pb-16/,
    "Expected the desktop hero to reduce its vertical padding so the content can fit inside the viewport-driven height on common laptop screens",
  );

  assert.match(
    source,
    /md:max-w-\[52rem\]/,
    "Expected the desktop hero content block to widen so each headline line carries more text",
  );

  assert.match(
    source,
    /md:text-\[3\.25rem\]/,
    "Expected the desktop hero headline to be slightly smaller than the previous 64px treatment",
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
