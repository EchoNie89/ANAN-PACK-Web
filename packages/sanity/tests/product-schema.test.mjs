import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readSource(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("product schema exposes the new Sanity-managed product sections", () => {
  const productSchema = readSource("sanity/schemas/product.ts");
  const schemaIndex = readSource("sanity/schemas/index.ts");

  assert.match(
    productSchema,
    /name: 'name'/,
    "Expected product documents to store the product name separately from the page title",
  );
  assert.match(
    productSchema,
    /type: 'slug'/,
    "Expected product slug to use Sanity's slug field type",
  );
  assert.match(
    productSchema,
    /name: 'pageTitle'/,
    "Expected a pageTitle field for the hero heading",
  );
  assert.match(
    productSchema,
    /name: 'seoTitle'/,
    "Expected a dedicated seoTitle field",
  );
  assert.match(
    productSchema,
    /name: 'metaDescription'/,
    "Expected a metaDescription field",
  );
  assert.match(
    productSchema,
    /name: 'hero'/,
    "Expected a hero field",
  );
  assert.match(
    productSchema,
    /name: 'whatAreCustom'/,
    "Expected a whatAreCustom field",
  );
  assert.match(
    productSchema,
    /name: 'caseStudy'/,
    "Expected a caseStudy field",
  );
  assert.match(
    productSchema,
    /name: 'faqItems'/,
    "Expected a faqItems field",
  );
  assert.match(
    productSchema,
    /name: 'megaMenuCard'/,
    "Expected a megaMenuCard field for dropdown media",
  );
  assert.match(
    schemaIndex,
    /productHero/,
    "Expected the product hero object schema to be registered",
  );
  assert.match(
    schemaIndex,
    /productCaseStudy/,
    "Expected the product case study object schema to be registered",
  );
  assert.match(
    schemaIndex,
    /productMegaMenuCard/,
    "Expected the mega menu card object schema to be registered",
  );
});
