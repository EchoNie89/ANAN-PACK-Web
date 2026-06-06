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

test("non-home informational page heroes keep the approved fixed desktop height", () => {
  for (const relativePath of [
    "src/components/sections/about/AboutHero.astro",
    "src/components/sections/contact/ContactHero.astro",
    "src/components/sections/services/ServicesHero.astro",
    "src/components/sections/services/FAQHero.astro",
  ]) {
    const source = readSource(relativePath);

    assert.match(
      source,
      /<section[\s\S]*class="[^"]*md:h-\[474px\]/,
      `Expected ${relativePath} to keep the approved 474px desktop hero height`,
    );

    assert.doesNotMatch(
      source,
      /lg:h-\[calc\(100dvh-88px\)\]/,
      `Expected ${relativePath} to avoid the full-viewport desktop hero treatment`,
    );
  }
});

test("product hero keeps the approved fixed desktop height instead of filling the remaining viewport", () => {
  const source = readSource("src/components/sections/products/ProductHero.astro");

  assert.match(
    source,
    /section class="[^"]*md:h-\[474px\]/,
    "Expected the product hero section to keep the approved 474px desktop-height treatment",
  );

  assert.doesNotMatch(
    source,
    /lg:h-\[calc\(100dvh-88px\)\]/,
    "Expected the product hero to avoid the full-viewport desktop hero treatment",
  );
});

test("solution hero keeps the approved fixed desktop height instead of filling the remaining viewport", () => {
  const source = readSource("src/components/sections/solutions/SolutionHero.astro");

  assert.match(
    source,
    /section class="[^"]*md:h-\[474px\]/,
    "Expected the solution hero section to keep the approved 474px desktop-height treatment",
  );

  assert.doesNotMatch(
    source,
    /lg:h-\[calc\(100dvh-88px\)\]/,
    "Expected the solution hero to avoid the full-viewport desktop hero treatment",
  );
});

test("blog heroes keep the approved fixed desktop height across index and article variants", () => {
  const source = readSource("src/components/sections/blog/BlogPageHero.astro");

  assert.match(
    source,
    /<section class=.*md:h-\[474px\].*>/s,
    "Expected the blog hero section to keep a 474px desktop height for both index and article variants",
  );

  assert.match(
    source,
    /isBlogIndex\s*\?\s*"[^"]*md:h-full[^"]*"/,
    "Expected the blog index inner container to stretch to the fixed desktop hero height",
  );

  assert.match(
    source,
    /:\s*"[^"]*md:h-full[^"]*"/,
    "Expected the default blog article inner container to stretch to the fixed desktop hero height",
  );

  assert.doesNotMatch(
    source,
    /lg:h-\[calc\(100dvh-88px\)\]/,
    "Expected the blog hero to avoid the full-viewport desktop hero treatment",
  );
});
