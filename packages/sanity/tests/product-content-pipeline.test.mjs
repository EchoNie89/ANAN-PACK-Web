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
  assert.equal(
    existsSync(new URL("../scripts/migrate-customization-blocks.ts", import.meta.url)),
    false,
    "Expected legacy customization migration scripts to be removed after structured block rollout",
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
  assert.doesNotMatch(
    packageSource,
    /migrate:customization-blocks/,
    "Expected the legacy customization migration script entry to be removed",
  );
});

test("showcase import pipeline allows cards without a title while keeping group titles required", () => {
  const seedSource = readSource("scripts/seed-products.ts");
  const importTypesSource = readSource("import-data/products/types.ts");
  const baselineSource = readSource("scripts/product-content-source.ts");

  assert.match(
    importTypesSource,
    /export interface ProductImportShowcaseCard extends Omit<ProductImportCard, 'title'> \{[\s\S]*title\?: string;/,
    "Expected showcase import cards to allow an omitted title",
  );
  assert.match(
    baselineSource,
    /type ProductBaselineShowcaseCard = Omit<ProductBaselineCard, "title"> & \{[\s\S]*title\?: string;/,
    "Expected the product baseline export type to allow showcase cards without a title",
  );
  assert.match(
    seedSource,
    /showcaseGroups\[\$\{groupIndex\}\]\.title must be non-empty/,
    "Expected the seed pipeline to keep showcase group titles required",
  );
  assert.match(
    seedSource,
    /validateAndResolveCard\(\s*card,\s*`showcaseGroups\[\$\{groupIndex\}\]\.cards\[\$\{cardIndex\}\]`,\s*slug,\s*cardSourceKeys,\s*errors,\s*false,\s*\)/,
    "Expected showcase card validation to allow an omitted title",
  );
});
