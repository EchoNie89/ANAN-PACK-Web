import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");

function readSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

test("layout exposes a keyboard-accessible skip link and pages provide a main-content target", () => {
  const layoutSource = readSource("src/layouts/Layout.astro");
  const globalStyles = readSource("src/styles/global.css");

  assert.match(
    layoutSource,
    /<a href="#main-content" class="skip-link">Skip to main content<\/a>/,
    "Expected Layout to expose a skip link before the page chrome",
  );

  assert.match(
    globalStyles,
    /\.skip-link \{/,
    "Expected global styles to define the shared skip link treatment",
  );

  assert.match(
    globalStyles,
    /\.skip-link:focus \{/,
    "Expected the skip link to become visible when keyboard users focus it",
  );

  for (const relativePath of [
    "src/pages/index.astro",
    "src/pages/about-us.astro",
    "src/pages/blog/index.astro",
    "src/pages/contact-us.astro",
    "src/pages/services.astro",
    "src/pages/services/faq.astro",
    "src/pages/thank-you.astro",
    "src/components/sections/blog/BlogPostPage.astro",
    "src/components/sections/products/ProductPage.astro",
    "src/components/sections/solutions/SolutionPage.astro",
  ]) {
    const source = readSource(relativePath);
    assert.match(
      source,
      /<main id="main-content" tabindex="-1">/,
      `Expected ${relativePath} to expose the skip-link destination on its primary main region`,
    );
  }
});

test("faq accordions share visible keyboard focus treatment across service and product pages", () => {
  const faqGroupsSource = readSource("src/components/sections/services/FAQGroups.astro");
  const productFaqSource = readSource("src/components/sections/products/ProductFaq.astro");

  assert.match(
    faqGroupsSource,
    /focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2/,
    "Expected service FAQ summaries to show an obvious focus-visible ring",
  );

  assert.match(
    productFaqSource,
    /focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2/,
    "Expected product FAQ summaries to match the service FAQ keyboard focus treatment",
  );
});

test("site chrome uses the real brand name for logo alternative text", () => {
  const headerSource = readSource("src/components/sections/Header.astro");
  const footerSource = readSource("src/components/sections/Footer.astro");

  assert.doesNotMatch(
    headerSource,
    /Logoipsum/,
    "Expected the header logo to stop exposing the placeholder Logoipsum alt text",
  );

  assert.doesNotMatch(
    footerSource,
    /Logoipsum/,
    "Expected the footer logo to stop exposing the placeholder Logoipsum alt text",
  );

  assert.match(
    headerSource,
    /alt=\{siteName\}/,
    "Expected the header logo to use the shared site name for alt text",
  );

  assert.match(
    footerSource,
    /alt=\{siteName\}/,
    "Expected the footer logo to use the shared site name for alt text",
  );
});
