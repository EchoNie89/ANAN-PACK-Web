import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function readSource(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("product migration scripts cover baseline export compare and batch seeding", () => {
  assert.equal(
    existsSync(new URL("../scripts/export-product-baseline.ts", import.meta.url)),
    true,
    "Expected a baseline export script before migration begins",
  );
  assert.equal(
    existsSync(new URL("../scripts/compare-product-baseline.ts", import.meta.url)),
    true,
    "Expected a compare script for baseline versus Sanity content",
  );
  assert.equal(
    existsSync(new URL("../scripts/seed-all-products.ts", import.meta.url)),
    true,
    "Expected a batch seed script for all local products",
  );

  const seedSource = readSource("scripts/seed-products.ts");
  const packageSource = readSource("package.json");

  assert.match(
    seedSource,
    /productSourcePages/,
    "Expected the seed script to read the shared local product source",
  );
  assert.match(
    seedSource,
    /hero|caseStudy|faqItems|metaDescription|megaMenuCard/,
    "Expected the seed script to patch the new product content fields",
  );
  assert.match(
    packageSource,
    /baseline:products/,
    "Expected a package script for exporting the baseline",
  );
  assert.match(
    packageSource,
    /seed:products:all/,
    "Expected a package script for batch seeding",
  );
});
