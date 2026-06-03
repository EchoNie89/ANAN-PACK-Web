import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("customization runtime uses a shared block union and legacy normalizer", () => {
  const helperSource = readSource("src/lib/customization-content.ts");
  const productSource = readSource("src/data/product-source.ts");
  const productsSource = readSource("src/data/products.ts");
  const importTypesSource = readSource("../sanity/import-data/products/types.ts");
  const baselineSource = readSource("../sanity/scripts/product-content-source.ts");

  assert.match(helperSource, /export type CustomizationMarkerStyle = 'bullet' \| 'number' \| 'plain';/);
  assert.match(helperSource, /export type ProductCustomizationBlock =/);
  assert.match(helperSource, /export function normalizeLegacyCustomizationBlock/);

  assert.match(
    productSource,
    /export type ProductCustomizationBlockSeedLike =\s*\| ProductCustomizationBlockSeed\s*\| ProductLegacyCustomizationBlockSeed;/,
  );
  assert.match(
    productSource,
    /export interface ProductCustomizationGroup \{[\s\S]*blocks: ProductCustomizationBlockSeedLike\[];/,
  );
  assert.match(productsSource, /blocks: seed\.blocks\.map\(toProductCustomizationBlock\),/);
  assert.match(importTypesSource, /export type ProductImportCustomizationBlock =/);
  assert.match(baselineSource, /type ProductBaselineCustomizationBlock =/);
});
