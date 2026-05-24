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

test("non-article page heroes fill the remaining desktop viewport beneath the sticky header", () => {
  for (const relativePath of [
    "src/components/sections/about/AboutHero.astro",
    "src/components/sections/contact/ContactHero.astro",
    "src/components/sections/services/ServicesHero.astro",
    "src/components/sections/services/FAQHero.astro",
  ]) {
    const source = readSource(relativePath);

    assert.match(
      source,
      /section class="[^"]*lg:h-\[calc\(100dvh-88px\)\]/,
      `Expected ${relativePath} to size the outer hero section to the remaining desktop viewport height`,
    );

    assert.match(
      source,
      /lg:h-full/,
      `Expected ${relativePath} to have an inner hero container that stretches to the desktop hero height`,
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

test("blog listing hero fills the desktop viewport without forcing article heroes full-screen", () => {
  const source = readSource("src/components/sections/blog/BlogPageHero.astro");

  assert.match(
    source,
    /isBlogIndex\s*\?\s*"[^"]*lg:h-\[calc\(100dvh-88px\)\][^"]*"/,
    "Expected the blog index hero variant to opt into the remaining desktop viewport height",
  );

  assert.doesNotMatch(
    source,
    /:\s*"[^"]*lg:h-\[calc\(100dvh-88px\)\][^"]*"/,
    "Expected the default blog article hero variant to keep its existing non-fullscreen height behavior",
  );

  assert.match(
    source,
    /isBlogIndex\s*\?\s*"[^"]*lg:h-full[^"]*"/,
    "Expected the blog index inner container to stretch to the full desktop hero height",
  );
});
