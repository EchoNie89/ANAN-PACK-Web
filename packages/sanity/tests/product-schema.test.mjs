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

test("nested product content schemas preserve hidden import metadata fields", () => {
  const applicationCardSchema = readSource("sanity/schemas/applicationCard.ts");
  const showcaseGroupSchema = readSource("sanity/schemas/showcaseGroup.ts");
  const showcaseCardSchema = readSource("sanity/schemas/showcaseCard.ts");
  const customizationGroupSchema = readSource("sanity/schemas/customizationGroup.ts");

  assert.match(
    applicationCardSchema,
    /name: 'sourceKey'[\s\S]*hidden: true/,
    "Expected application cards to keep sourceKey as a hidden metadata field",
  );
  assert.match(
    applicationCardSchema,
    /name: 'figmaNodeId'[\s\S]*hidden: true/,
    "Expected application cards to keep figmaNodeId as a hidden metadata field",
  );
  assert.match(
    showcaseGroupSchema,
    /name: 'sourceKey'[\s\S]*hidden: true/,
    "Expected showcase groups to keep sourceKey as a hidden metadata field",
  );
  assert.match(
    showcaseGroupSchema,
    /name: 'figmaNodeId'[\s\S]*hidden: true/,
    "Expected showcase groups to keep figmaNodeId as a hidden metadata field",
  );
  assert.match(
    showcaseCardSchema,
    /name: 'sourceKey'[\s\S]*hidden: true/,
    "Expected showcase cards to keep sourceKey as a hidden metadata field",
  );
  assert.match(
    showcaseCardSchema,
    /name: 'figmaNodeId'[\s\S]*hidden: true/,
    "Expected showcase cards to keep figmaNodeId as a hidden metadata field",
  );
  assert.match(
    customizationGroupSchema,
    /name: 'sourceKey'[\s\S]*hidden: true/,
    "Expected customization groups to keep sourceKey as a hidden metadata field",
  );
});
