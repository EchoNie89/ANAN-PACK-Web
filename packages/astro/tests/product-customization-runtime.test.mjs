import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("customization runtime uses a shared block union and legacy normalizer", async () => {
  const helperSource = readSource("src/lib/customization-content.ts");
  const productSource = readSource("src/data/product-source.ts");
  const productsSource = readSource("src/data/products.ts");
  const sanitySource = readSource("src/lib/sanity.ts");
  const seedProductsSource = readSource("../sanity/scripts/seed-products.ts");
  const importTypesSource = readSource("../sanity/import-data/products/types.ts");
  const baselineSource = readSource("../sanity/scripts/product-content-source.ts");
  const {
    normalizeCustomizationBlock,
    normalizeLegacyCustomizationBlock,
  } = await import("../src/lib/customization-content.ts");

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
  assert.match(importTypesSource, /export type ProductImportCustomizationBlockLike =/);
  assert.match(importTypesSource, /blocks: ProductImportCustomizationBlockLike\[];/);
  assert.match(baselineSource, /type ProductBaselineCustomizationBlock =/);
  assert.match(sanitySource, /export type CustomizationBlock =/);
  assert.match(sanitySource, /_type,/);
  assert.match(sanitySource, /text,/);
  assert.match(sanitySource, /markerStyle,/);
  assert.match(sanitySource, /entries\[]\{/);
  assert.match(sanitySource, /detailGroups\[]\{/);
  assert.match(sanitySource, /note/);
  assert.match(seedProductsSource, /function buildCustomizationBlock/);
  assert.match(seedProductsSource, /_type: "paragraphBlock"/);
  assert.match(seedProductsSource, /_type: "listBlock"/);
  assert.match(seedProductsSource, /_type: "entryListBlock"/);
  assert.doesNotMatch(seedProductsSource, /_type: "customizationBlock"/);

  const legacyBlock = {
    title: "Decoration options",
    items: ["Screen print", "Foil stamp"],
  };
  const normalizedFromLegacy = normalizeLegacyCustomizationBlock(legacyBlock);

  assert.deepEqual(normalizedFromLegacy, {
    _type: "listBlock",
    title: "Decoration options",
    markerStyle: "bullet",
    items: ["Screen print", "Foil stamp"],
  });
  assert.notStrictEqual(normalizedFromLegacy.items, legacyBlock.items);

  const normalizedFromUnion = normalizeCustomizationBlock(legacyBlock);

  assert.deepEqual(normalizedFromUnion, {
    _type: "listBlock",
    title: "Decoration options",
    markerStyle: "bullet",
    items: ["Screen print", "Foil stamp"],
  });
  assert.notStrictEqual(normalizedFromUnion.items, legacyBlock.items);
});
