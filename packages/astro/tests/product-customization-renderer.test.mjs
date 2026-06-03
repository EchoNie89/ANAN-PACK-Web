import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("product customization renderer handles normalized structured blocks", () => {
  const productPageSource = readSource(
    "src/components/sections/products/ProductPage.astro",
  );
  const customizationSource = readSource(
    "src/components/sections/products/ProductCustomization.astro",
  );

  assert.match(
    productPageSource,
    /import\s*\{[^}]*normalizeCustomizationBlock[^}]*\}\s*from\s*["']\.\.\/\.\.\/\.\.\/lib\/customization-content["'];/,
  );
  assert.match(
    productPageSource,
    /blocks:\s*group\.blocks\.map\(\(block\)\s*=>\s*normalizeCustomizationBlock\(block\)\)/,
  );

  assert.match(customizationSource, /block\._type === "paragraphBlock"/);
  assert.match(customizationSource, /block\._type === "listBlock"/);
  assert.match(customizationSource, /block\._type === "entryListBlock"/);
  assert.match(customizationSource, /markerStyle === "number"/);
  assert.match(customizationSource, /markerStyle === "bullet"/);
  assert.match(customizationSource, /block\.note/);
  assert.match(customizationSource, /detailGroup\.note/);
});
