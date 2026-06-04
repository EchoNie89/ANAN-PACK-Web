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

test("product entry layers only include Sanity products with required hero and menu images", () => {
  const productPagesSource = readSource("src/lib/product-pages.ts");

  assert.match(
    productPagesSource,
    /isProductEntryEligible/,
    "Expected the product layer to define a single Sanity entry eligibility rule",
  );
  assert.match(
    productPagesSource,
    /document\.hero\?\.image\?\.asset\?\._ref/,
    "Expected product entry eligibility to require a Sanity hero image",
  );
  assert.match(
    productPagesSource,
    /document\.megaMenuCard\?\.image\?\.asset\?\._ref/,
    "Expected product entry eligibility to require a Sanity mega menu image",
  );
  assert.doesNotMatch(
    productPagesSource,
    /localProductMenuItems/,
    "Expected product entry to stop falling back to local products menu data",
  );
  assert.doesNotMatch(
    productPagesSource,
    /return \[\.\.\.mergedLocalPages, \.\.\.appendedSanityPages\]/,
    "Expected product routes to stop appending local-only product pages",
  );
});

test("product pages leave Sanity-backed fields empty instead of falling back to local content", () => {
  const productPagesSource = readSource("src/lib/product-pages.ts");

  assert.match(
    productPagesSource,
    /subtitle:\s*document\.hero\?\.description\s*\?\?\s*""/,
    "Expected hero subtitle to stay empty when Sanity has no description",
  );
  assert.match(
    productPagesSource,
    /overview:\s*document\.whatAreCustom\?\.overview\s*\?\?\s*""/,
    "Expected overview to stay empty when Sanity has no What Are Custom content",
  );
  assert.match(
    productPagesSource,
    /title:\s*document\.caseStudy\?\.title\s*\?\?\s*""/,
    "Expected Case Study title to stay empty when Sanity has no caseStudy title",
  );
  assert.match(
    productPagesSource,
    /faqs:\s*mapFaqs\(document\.faqItems\)/,
    "Expected FAQs to stop falling back to local product FAQs when Sanity has none",
  );
  assert.doesNotMatch(
    productPagesSource,
    /metaDescription:\s*document\.metaDescription\s*\?\?\s*localPage\.metaDescription/,
    "Expected meta description to stop falling back to local product content",
  );
  assert.doesNotMatch(
    productPagesSource,
    /overview:\s*document\.whatAreCustom\?\.overview\s*\?\?\s*localPage\.overview/,
    "Expected overview to stop falling back to local product content",
  );
});

test("product section components do not synthesize local fallback content for Sanity-backed sections", () => {
  const productPageSource = readSource("src/components/sections/products/ProductPage.astro");
  const productGalleryMatrixSource = readSource("src/components/sections/products/ProductGalleryMatrix.astro");
  const productApplicationsSource = readSource("src/components/sections/products/ProductApplications.astro");
  const productCustomizationSource = readSource("src/components/sections/products/ProductCustomization.astro");

  assert.doesNotMatch(
    productPageSource,
    /const showcaseGroups =[\s\S]*page\.showcaseGroups/,
    "Expected showcase groups to stop falling back to local product showcase data",
  );
  assert.doesNotMatch(
    productPageSource,
    /const applications =[\s\S]*page\.applications/,
    "Expected applications to stop falling back to local product applications data",
  );
  assert.doesNotMatch(
    productPageSource,
    /const customizationGroups =[\s\S]*page\.customizationGroups/,
    "Expected customization groups to stop falling back to local product customization data",
  );
  assert.doesNotMatch(
    productGalleryMatrixSource,
    /const fallbackGroups =/,
    "Expected ProductGalleryMatrix to stop synthesizing local showcase fallback groups",
  );
  assert.doesNotMatch(
    productApplicationsSource,
    /title = "Applications"/,
    "Expected ProductApplications to stop defaulting the section title locally",
  );
  assert.doesNotMatch(
    productCustomizationSource,
    /const customizationGroups =[\s\S]*\?\s*groups\s*:\s*\[/,
    "Expected ProductCustomization to stop synthesizing local customization fallback groups",
  );
});
