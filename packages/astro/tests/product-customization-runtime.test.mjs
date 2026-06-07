import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("customization runtime uses only structured block types", () => {
  const helperSource = readSource("src/lib/customization-content.ts");
  const productSource = readSource("src/data/product-source.ts");
  const productsSource = readSource("src/data/products.ts");
  const sanitySource = readSource("src/lib/sanity.ts");
  const seedProductsSource = readSource("../sanity/scripts/seed-products.ts");
  const importTypesSource = readSource("../sanity/import-data/products/types.ts");
  const baselineSource = readSource("../sanity/scripts/product-content-source.ts");

  assert.match(helperSource, /export type CustomizationMarkerStyle = 'bullet' \| 'number' \| 'plain';/);
  assert.match(helperSource, /export type ProductCustomizationBlock =/);
  assert.match(helperSource, /export interface ListBlock \{[\s\S]*intro\?: string;/);
  assert.match(helperSource, /export interface ListBlock \{[\s\S]*items\?: string\[];/);
  assert.doesNotMatch(helperSource, /export interface EntryListBlock/);
  assert.doesNotMatch(helperSource, /LegacyCustomizationBlock/);
  assert.doesNotMatch(helperSource, /PersistedLegacyCustomizationBlock/);
  assert.doesNotMatch(helperSource, /normalizeLegacyCustomizationBlock/);
  assert.doesNotMatch(helperSource, /normalizeCustomizationBlock/);

  assert.doesNotMatch(productSource, /LegacyCustomizationBlock/);
  assert.doesNotMatch(productSource, /ProductCustomizationBlockSeedLike/);
  assert.match(
    productSource,
    /export interface ProductCustomizationGroup \{[\s\S]*blocks: ProductCustomizationBlockSeed\[];/,
  );
  assert.match(productsSource, /blocks: seed\.blocks\.map\(toProductCustomizationBlock\),/);
  assert.doesNotMatch(productsSource, /normalizeCustomizationBlock/);
  assert.match(
    importTypesSource,
    /import type \{\s*ProductCustomizationBlock\s*\} from ["']\.\.\/\.\.\/\.\.\/astro\/src\/lib\/customization-content\.ts["'];/,
  );
  assert.doesNotMatch(importTypesSource, /LegacyCustomizationBlock/);
  assert.match(importTypesSource, /export type ProductImportCustomizationBlock =/);
  assert.doesNotMatch(importTypesSource, /ProductImportCustomizationBlockLike/);
  assert.match(
    importTypesSource,
    /export interface ProductImportCustomizationGroup \{[\s\S]*figmaNodeId\?: string;[\s\S]*blocks: ProductImportCustomizationBlock\[];/,
  );
  assert.match(baselineSource, /type ProductBaselineCustomizationBlock =/);
  assert.doesNotMatch(baselineSource, /normalizeCustomizationBlock/);
  assert.match(sanitySource, /export type CustomizationBlock =/);
  assert.doesNotMatch(sanitySource, /customizationBlock/);
  assert.match(
    sanitySource,
    /blocks\[\]\{\s*_type,\s*title,\s*text,\s*intro,\s*markerStyle,\s*items,\s*note\s*,?/,
  );
  assert.doesNotMatch(sanitySource, /entries\[\]\{/);
  assert.match(
    seedProductsSource,
    /function buildCustomizationBlock\(\s*block: ProductImportCustomizationBlock,\s*blockKey: string,\s*existingBlock: ExistingCustomizationBlock \| undefined,\s*forceText: boolean,\s*\)/,
  );
  assert.doesNotMatch(seedProductsSource, /normalizeCustomizationBlock/);
  assert.doesNotMatch(seedProductsSource, /ProductImportCustomizationBlockLike/);
  assert.doesNotMatch(seedProductsSource, /validateCustomizationBlockLike/);
  assert.match(seedProductsSource, /intro\?: string;/);
  assert.match(seedProductsSource, /_type: "paragraphBlock"/);
  assert.match(seedProductsSource, /_type: "listBlock"/);
  assert.doesNotMatch(seedProductsSource, /_type: "entryListBlock"/);
  assert.match(
    seedProductsSource,
    /text: keepExistingText\(\s*existingBlock\?\.text,\s*block\.text,\s*forceText,\s*\)/,
  );
  assert.match(
    seedProductsSource,
    /const intro = keepExistingText\(\s*existingBlock\?\.intro,\s*block\.intro,\s*forceText,\s*\);/,
  );
  assert.match(
    seedProductsSource,
    /const items = keepExistingStringArray\(\s*existingBlock\?\.items,\s*block\.items,\s*forceText,\s*\);/,
  );
  assert.match(
    seedProductsSource,
    /\.\.\.\(intro \? \{ intro \} : \{\}\),/,
  );
  assert.match(
    seedProductsSource,
    /\.\.\.\(items\?\.length \? \{ items \} : \{\}\),/,
  );
  assert.doesNotMatch(seedProductsSource, /existingEntry\?\.title/);
  assert.doesNotMatch(seedProductsSource, /existingDetailGroup\?\.items/);
  assert.doesNotMatch(seedProductsSource, /entries:\s*block\.entries/);
  assert.doesNotMatch(seedProductsSource, /detailGroups:\s*entry\.detailGroups/);
  assert.match(
    seedProductsSource,
    /buildCustomizationBlock\(\s*block,\s*`\$\{group\.sourceKey\}-block-\$\{blockIndex\}`,\s*existingGroup\?\.blocks\?\.\[blockIndex\],\s*forceText,\s*\)/,
  );
  assert.match(
    seedProductsSource,
    /\.\.\.\(group\.figmaNodeId \? \{ figmaNodeId: group\.figmaNodeId \} : \{\}\),/,
  );
  assert.doesNotMatch(seedProductsSource, /_type: "customizationBlock"/);
});
