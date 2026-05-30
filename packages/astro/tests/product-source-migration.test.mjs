import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");

function readSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

test("product content moves into a serializable source module", () => {
  assert.equal(
    existsSync(join(astroDir, "src/data/product-source.ts")),
    true,
    "Expected a new serializable product source module for migration scripts",
  );

  const productsSource = readSource("src/data/products.ts");

  assert.match(
    productsSource,
    /from ['"]\.\/product-source['"]/,
    "Expected products.ts to build runtime page data from the shared serializable source",
  );
  assert.match(
    productsSource,
    /productSourcePages\.map/,
    "Expected products.ts to derive productPages from productSourcePages",
  );
});
