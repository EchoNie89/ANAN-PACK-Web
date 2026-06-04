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

test("about team role headings reserve 64px and center wrapped titles", () => {
  const source = readSource("src/components/sections/about/AboutTeam.astro");
  const roleHeadingClassMatch = source.match(/<h3 class="([^"]*)">/);

  assert.ok(roleHeadingClassMatch, "Expected the about team card to render a role heading h3");

  const roleHeadingClassName = roleHeadingClassMatch[1];

  assert.match(
    roleHeadingClassName,
    /\bmin-h-16\b/,
    "Expected the about team role heading to reserve 64px",
  );
  assert.match(
    roleHeadingClassName,
    /\bflex\b/,
    "Expected the about team role heading to use flex layout for vertical centering",
  );
  assert.match(
    roleHeadingClassName,
    /\bitems-center\b/,
    "Expected the about team role heading to vertically center wrapped titles",
  );
  assert.match(
    roleHeadingClassName,
    /\bjustify-center\b/,
    "Expected the about team role heading to keep wrapped titles centered horizontally",
  );
});
