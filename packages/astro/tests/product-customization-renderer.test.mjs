import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("product customization renderer handles structured blocks directly", () => {
  const productPageSource = readSource(
    "src/components/sections/products/ProductPage.astro",
  );
  const productFeatureBandSource = readSource(
    "src/components/sections/products/ProductFeatureBand.astro",
  );
  const customizationSource = readSource(
    "src/components/sections/products/ProductCustomization.astro",
  );

  assert.doesNotMatch(productPageSource, /normalizeCustomizationBlock/);
  assert.match(productPageSource, /blocks:\s*group\.blocks,/);
  assert.match(
    productPageSource,
    /const showcaseGroups = sanityShowcaseGroups\?\.length\s*\?\s*sanityShowcaseGroups\s*:\s*enableLocalProductFallback\s*\?\s*page\.showcaseGroups\s*:\s*\[];/,
  );
  assert.match(
    productPageSource,
    /const applicationTitle = sanityApplicationsData\?\.applicationTitle\s*\?\?\s*\(enableLocalProductFallback \? page\.applicationTitle : undefined\);/,
  );
  assert.match(
    productPageSource,
    /const applicationDescription = sanityApplicationsData\?\.applicationDescription\s*\?\?\s*\(enableLocalProductFallback \? page\.applicationDescription : undefined\);/,
  );
  assert.match(
    productPageSource,
    /const applications = sanityApplications\?\.length\s*\?\s*sanityApplications\s*:\s*enableLocalProductFallback\s*\?\s*page\.applications\s*:\s*\[];/,
  );
  assert.match(
    productPageSource,
    /const customizationGroups = sanityCustomizationGroups\?\.length\s*\?\s*sanityCustomizationGroups\s*:\s*enableLocalProductFallback\s*\?\s*page\.customizationGroups\s*:\s*\[];/,
  );
  assert.doesNotMatch(
    productPageSource,
    /const hasFeatureBand =/,
    "Expected product pages to stop conditionally hiding the shared feature band",
  );
  assert.match(
    productPageSource,
    /<ProductFeatureBand \/>\s*/,
    "Expected product pages to always render the shared trust-signal feature band below the hero",
  );

  assert.match(
    productFeatureBandSource,
    /const defaultFeatures = \[/,
    "Expected ProductFeatureBand to keep the fixed three-card feature content locally",
  );
  assert.doesNotMatch(
    productFeatureBandSource,
    /interface Props|Astro\.props|features = defaultFeatures/,
    "Expected ProductFeatureBand to stop accepting page-managed feature data",
  );

  assert.match(customizationSource, /block\._type === "paragraphBlock"/);
  assert.match(customizationSource, /block\._type === "listBlock"/);
  assert.doesNotMatch(customizationSource, /block\._type === "entryListBlock"/);
  assert.match(customizationSource, /markerStyle === "number"/);
  assert.match(customizationSource, /markerStyle === "bullet"/);
  assert.match(customizationSource, /markerStyle === "plain"/);
  assert.match(customizationSource, /block\.intro/);
  assert.match(customizationSource, /block\.note/);
  assert.doesNotMatch(customizationSource, /entry\.note/);
  assert.doesNotMatch(customizationSource, /detailGroup\.note/);
  assert.match(
    customizationSource,
    /group\.intro && \(\s*<p class="whitespace-pre-line text-sm leading-\[24px\] text-text-main md:text-\[15px\] md:leading-\[25px\]">\s*\{group\.intro\}\s*<\/p>\s*\)/,
  );
  assert.match(
    customizationSource,
    /block\.intro && <p class="whitespace-pre-line">\{block\.intro\}<\/p>/,
  );
  assert.match(
    customizationSource,
    /\(block\.items \?\? \[\]\)\.filter\(\(item\) => item\.trim\(\)\.length > 0\)/,
  );
  assert.match(
    customizationSource,
    /block\.note && <p class="whitespace-pre-line">\{block\.note\}<\/p>/,
  );
  assert.match(customizationSource, /leading-tight tracking-\[0\.01em\] text-text-main md:text-\[32px\]/);
  assert.match(customizationSource, /index === 0 \? "mt-3 md:mt-4" : "mt-12 md:mt-14"/);
  assert.match(customizationSource, /text-\[20px\] font-semibold leading-tight text-text-main md:text-\[24px\]/);
  assert.match(customizationSource, /text-sm leading-\[24px\] text-text-main md:text-\[15px\] md:leading-\[25px\]/);
  assert.match(customizationSource, /mt-4 grid gap-5 text-sm leading-\[24px\] text-text-main md:text-\[15px\] md:leading-\[25px\]/);
  assert.match(customizationSource, /<section class="grid gap-1\.5">/);
  assert.doesNotMatch(customizationSource, /<section class="grid gap-3">/);
  assert.doesNotMatch(customizationSource, /<li class="space-y-2\.5">/);
  assert.doesNotMatch(customizationSource, /<div class="space-y-1\.5">/);
});
