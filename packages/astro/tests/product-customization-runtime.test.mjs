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
    /blocks\[\]\{\s*_type,\s*title,\s*text,\s*intro,\s*markerStyle,\s*items,\s*note,/,
  );
  assert.match(
    sanitySource,
    /blocks\[\]\{[\s\S]*?entries\[\]\{\s*title,\s*paragraphs,\s*note,\s*detailGroups\[\]\{\s*label,\s*markerStyle,\s*items,\s*note\s*\}\s*\}/,
  );
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
  assert.match(seedProductsSource, /_type: "entryListBlock"/);
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
    /const items = keepExistingStringArray\(\s*existingBlock\?\.items,\s*block\.items,\s*forceText,\s*\)\s*\|\|\s*\[\.\.\.block\.items\];/,
  );
  assert.match(
    seedProductsSource,
    /\.\.\.\(intro \? \{ intro \} : \{\}\),/,
  );
  assert.match(
    seedProductsSource,
    /const entryTitle = keepExistingText\(\s*existingEntry\?\.title,\s*entry\.title,\s*forceText,\s*\);/,
  );
  assert.match(
    seedProductsSource,
    /const items = keepExistingStringArray\(\s*existingDetailGroup\?\.items,\s*detailGroup\.items,\s*forceText,\s*\)\s*\|\|\s*\[\.\.\.detailGroup\.items\];/,
  );
  assert.match(
    seedProductsSource,
    /entries:\s*block\.entries\.map\(\(entry,\s*entryIndex\)\s*=>\s*\{[\s\S]*?_type: "customizationEntry"/,
  );
  assert.match(
    seedProductsSource,
    /detailGroups:\s*entry\.detailGroups\.map\(\(detailGroup,\s*detailGroupIndex\)\s*=>\s*\{[\s\S]*?_type: "customizationDetailGroup"/,
  );
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
