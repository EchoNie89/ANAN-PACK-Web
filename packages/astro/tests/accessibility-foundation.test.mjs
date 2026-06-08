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
    headerSource,
    /class="h-\[33px\] w-auto"/,
    "Expected the header logo to render about 10% larger at 33px tall",
  );

  assert.match(
    headerSource,
    /sizes="167px"/,
    "Expected the header logo responsive size hint to scale with the larger header mark",
  );

  assert.match(
    headerSource,
    /widths=\{\[167, 334\]\}/,
    "Expected the header logo source widths to match the larger rendered mark",
  );

  assert.match(
    footerSource,
    /alt=\{siteName\}/,
    "Expected the footer logo to use the shared site name for alt text",
  );

  assert.match(
    footerSource,
    /class="h-\[40px\] w-auto max-w-full"/,
    "Expected the footer logo to render at 40px tall",
  );
});

test("testimonial star ratings expose an accessible image role instead of an invalid aria label on a plain div", () => {
  const ratingStarsSource = readSource("src/components/ui/RatingStars.astro");

  assert.match(
    ratingStarsSource,
    /role="img"/,
    "Expected the testimonial star rating wrapper to expose an image role for assistive technology",
  );

  assert.match(
    ratingStarsSource,
    /aria-label=\{`\$\{rating\} out of 5 stars`\}/,
    "Expected the testimonial star rating wrapper to keep the spoken star summary",
  );
});

test("home value props section defines a parent h2 before its h3 feature titles", () => {
  const valuePropsSource = readSource("src/components/sections/ValueProps.astro");

  assert.match(
    valuePropsSource,
    /<h2 class="sr-only">/,
    "Expected the home value props section to define a hidden h2 before the feature card h3 headings",
  );
});

test("small uppercase brand labels use the deeper accessible brand color token", () => {
  const globalStyles = readSource("src/styles/global.css");
  const badgeSource = readSource("src/components/ui/Badge.astro");
  const imageCardSource = readSource("src/components/ui/ImageCard.astro");
  const thankYouSource = readSource("src/pages/thank-you.astro");
  const contactFormSource = readSource("src/components/sections/contact/ContactProjectForm.astro");
  const legalLayoutSource = readSource("src/layouts/LegalLayout.astro");
  const blogSidebarSource = readSource("src/components/sections/blog/BlogSidebar.astro");

  assert.match(
    globalStyles,
    /--color-brand-contrast:\s*#A67237;/,
    "Expected the shared theme to expose the deeper contrast-safe small brand text token",
  );

  for (const [source, label] of [
    [badgeSource, "Badge"],
    [imageCardSource, "ImageCard"],
    [thankYouSource, "thank-you page"],
    [contactFormSource, "contact form success state"],
    [legalLayoutSource, "legal layout eyebrow"],
    [blogSidebarSource, "blog sidebar dates"],
  ]) {
    assert.match(
      source,
      /text-brand-contrast/,
      `Expected ${label} to switch small brand labels to the deeper contrast token`,
    );
  }
});
