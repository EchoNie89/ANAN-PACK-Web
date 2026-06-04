import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("product showcase group description uses 15px body text", () => {
  const productGalleryMatrixSource = readSource(
    "src/components/sections/products/ProductGalleryMatrix.astro",
  );

  assert.match(
    productGalleryMatrixSource,
    /<p class="mt-1 text-\[15px\] text-ink\/60">/,
    "Expected product showcase group description to use 15px text",
  );
});

test("product showcase card title is optional in runtime types and renderer", () => {
  const productGalleryMatrixSource = readSource(
    "src/components/sections/products/ProductGalleryMatrix.astro",
  );
  const productPageSource = readSource(
    "src/components/sections/products/ProductPage.astro",
  );
  const productsSource = readSource("src/data/products.ts");
  const productSource = readSource("src/data/product-source.ts");
  const sanitySource = readSource("src/lib/sanity.ts");

  assert.match(
    productGalleryMatrixSource,
    /card\.title\?\.trim\(\)\s*&&\s*\(/,
    "Expected product showcase card titles to render only when a non-empty title is present",
  );
  assert.match(
    productPageSource,
    /card\.alt\s*\?\?\s*card\.title\s*\?\?\s*group\.title\s*\?\?\s*page\.navLabel/,
    "Expected showcase image alt text to fall back when the card title is omitted",
  );
  assert.match(
    productsSource,
    /export interface ProductShowcaseCard extends Omit<ProductCard, 'title'> \{[\s\S]*title\?: string;/,
    "Expected runtime product showcase cards to allow an omitted title",
  );
  assert.match(
    productSource,
    /export interface ProductShowcaseCard extends Omit<ProductCard, 'title'> \{[\s\S]*title\?: string;/,
    "Expected local product showcase source cards to allow an omitted title",
  );
  assert.match(
    sanitySource,
    /export interface ShowcaseCard \{[\s\S]*title\?: string;/,
    "Expected fetched Sanity showcase cards to allow an omitted title",
  );
});
