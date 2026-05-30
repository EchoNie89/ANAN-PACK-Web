import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("product pages and menus route through the Sanity-first product layer", () => {
  assert.equal(
    existsSync(new URL("../src/lib/product-pages.ts", import.meta.url)),
    true,
    "Expected a product-pages lib to assemble Sanity and local fallback data",
  );

  const routeSource = readSource("src/pages/products/[slug].astro");
  const headerSource = readSource("src/components/sections/Header.astro");
  const megaMenuSource = readSource("src/components/sections/ProductsMegaMenu.astro");

  assert.match(
    routeSource,
    /from "\.\.\/\.\.\/lib\/product-pages"/,
    "Expected the product route to read from the new product-pages lib",
  );
  assert.match(
    headerSource,
    /getProductMenuItems/,
    "Expected the header to build product menus from the shared product-pages lib",
  );
  assert.match(
    megaMenuSource,
    /items\.length > 8|overflow-y-auto/,
    "Expected the desktop products mega menu to support scrolling when the list grows",
  );
});

test("sanity-only product pages do not require a hero description", () => {
  const productPagesSource = readSource("src/lib/product-pages.ts");

  assert.doesNotMatch(
    productPagesSource,
    /!document\.hero\?\.description/,
    "Expected sanity-only product pages to remain buildable when Hero description is empty",
  );
  assert.match(
    productPagesSource,
    /subtitle:\s*document\.hero\?\.description\s*\?\?\s*""/,
    "Expected sanity-only product pages to default Hero description to an empty string",
  );
});

test("product fallback can be disabled with a public env switch", () => {
  const productPagesSource = readSource("src/lib/product-pages.ts");
  const productPageSource = readSource("src/components/sections/products/ProductPage.astro");

  assert.match(
    productPagesSource,
    /PUBLIC_PRODUCTS_ENABLE_LOCAL_FALLBACK/,
    "Expected the Sanity product layer to read a PUBLIC_PRODUCTS_ENABLE_LOCAL_FALLBACK env switch",
  );
  assert.match(
    productPagesSource,
    /if \(!enableLocalProductFallback\) \{\s*return sanityOnlyPages;/,
    "Expected product page assembly to skip local page fallback when the env switch is off",
  );
  assert.match(
    productPagesSource,
    /if \(!enableLocalProductFallback\) \{\s*return sanityOnlyItems;/,
    "Expected product menu assembly to skip local menu fallback when the env switch is off",
  );
  assert.match(
    productPageSource,
    /PUBLIC_PRODUCTS_ENABLE_LOCAL_FALLBACK/,
    "Expected product page sections to read the same fallback env switch",
  );
  assert.match(
    productPageSource,
    /const applications =[\s\S]*enableLocalProductFallback[\s\S]*page\.applications[\s\S]*:\s*\[\]/,
    "Expected applications to stay empty instead of falling back to local data when the switch is off",
  );
  assert.match(
    productPageSource,
    /const customizationGroups =[\s\S]*enableLocalProductFallback[\s\S]*page\.customizationGroups[\s\S]*:\s*\[\]/,
    "Expected customization groups to stay empty instead of falling back to local data when the switch is off",
  );
  assert.match(
    productPagesSource,
    /title:\s*enableLocalProductFallback\s*\?\s*document\.caseStudy\?\.title\s*\?\?\s*title\s*:\s*document\.caseStudy\?\.title\s*\?\?\s*""/,
    "Expected strict Sanity mode to leave Case Study empty when Sanity has no caseStudy title",
  );
});
