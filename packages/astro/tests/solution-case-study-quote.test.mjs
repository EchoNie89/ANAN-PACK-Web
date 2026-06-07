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

test("solution case study uses the provided quote image asset", () => {
  const source = readSource("src/components/sections/solutions/SolutionCaseStudy.astro");

  assert.match(
    source,
    /solutionCaseStudyQuoteImage/,
    "Expected SolutionCaseStudy to import a dedicated local quote image asset",
  );
  assert.match(
    source,
    /<Image[\s\S]*src=\{solutionCaseStudyQuoteImage\}[\s\S]*alt=\"\"[\s\S]*width=\{28\}[\s\S]*height=\{22\}/,
    "Expected SolutionCaseStudy to render the provided quote image at 28x22",
  );
  assert.doesNotMatch(
    source,
    /text-\[68px\][\s\S]*“/,
    "Expected SolutionCaseStudy to stop rendering the oversized text quote glyph",
  );
});
