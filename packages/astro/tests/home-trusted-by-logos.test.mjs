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

test("home trusted by logos include the new WebP partner assets", () => {
  const homeDataSource = readSource("src/data/home.ts");

  assert.match(
    homeDataSource,
    /logo-10-twelvelittle\.webp/,
    "Expected the home logos list to include the TWELVElittle WebP asset",
  );
  assert.match(
    homeDataSource,
    /logo-11-sanrio\.webp/,
    "Expected the home logos list to include the converted Sanrio WebP asset",
  );
});
