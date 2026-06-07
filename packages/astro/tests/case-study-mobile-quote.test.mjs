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

test("home case study quote clears the decorative mark on mobile", () => {
  const source = readSource("src/components/sections/CaseStudy.astro");

  assert.match(
    source,
    /absolute left-5 top-3/,
    "Expected the decorative quote mark to stay anchored near the top-left corner of the quote card",
  );
  assert.match(
    source,
    /blockquote class="[^"]*pl-\[56px\][^"]*pr-5[^"]*pt-3[^"]*pb-14[^"]*md:absolute[^"]*md:inset-\[12px_51px_54px_69px\]/,
    "Expected the mobile quote copy to reserve left padding so the decorative quote mark does not overlap the text",
  );
  assert.match(
    source,
    /<p class="[^"]*pl-\[56px\][^"]*pb-4[^"]*md:absolute[^"]*md:left-\[69px\]/,
    "Expected the mobile attribution to align with the shifted quote text instead of starting underneath the quote mark",
  );
});
