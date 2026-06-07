import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");
const distDir = join(astroDir, "dist");

let built = false;

function buildSiteOnce() {
  if (built) return;

  rmSync(distDir, { recursive: true, force: true });
  execFileSync("pnpm", ["build"], {
    cwd: astroDir,
    stdio: "pipe",
  });
  built = true;
}

function readBuiltHtml(relativePath) {
  const filePath = join(distDir, relativePath);

  assert.equal(existsSync(filePath), true, `Expected build artifact: ${relativePath}`);

  return readFileSync(filePath, "utf8");
}

function readSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

function assertUsesAstroAssets(html, rawPaths) {
  for (const rawPath of rawPaths) {
    assert.equal(
      html.includes(rawPath),
      false,
      `Expected optimized output instead of raw asset path: ${rawPath}`,
    );
  }

  assert.match(html, /\/_astro\//, "Expected Astro asset URLs in built HTML");
  assert.match(html, /srcset=/, "Expected responsive image output in built HTML");
}

function assertNoRawRasterImagePaths(html, pagePath) {
  const rawRasterPathPattern =
    /\/images\/(?:products|blog|services|home|solutions|contact|about)\/[^"' )]+\.(?:png|jpe?g|webp|avif)/g;
  const matches = html.match(rawRasterPathPattern) ?? [];

  assert.equal(
    matches.length,
    0,
    `Expected optimized raster assets for ${pagePath}, found raw paths: ${matches.join(", ")}`,
  );
  assert.match(html, /srcset=/, `Expected responsive image output in built HTML for ${pagePath}`);
}

test("home page optimizes core local imagery", () => {
  buildSiteOnce();

  const homeHtml = readBuiltHtml("index.html");

  assertUsesAstroAssets(homeHtml, [
    "/images/home/hero-packaging.png",
    "/images/home/industry-fashion.png",
    "/images/home/product-woven-labels.png",
    "/images/home/trust-qc.png",
    "/images/home/about-factory.png",
    "/images/home/case-study.png",
    "/images/home/logo-01.png",
    "/images/home/cert-fsc.png",
  ]);
});

test("solutions pages optimize local imagery", () => {
  buildSiteOnce();

  const pagePaths = [
    "solutions/index.html",
    "solutions/fashion-apparel/index.html",
    "solutions/cosmetics-beauty/index.html",
    "solutions/home-lifestyle/index.html",
    "solutions/jewelry-luxury/index.html",
  ];

  for (const pagePath of pagePaths) {
    const html = readBuiltHtml(pagePath);
    assertNoRawRasterImagePaths(html, pagePath);
  }
});

test("about page optimizes local imagery", () => {
  buildSiteOnce();

  const aboutHtml = readBuiltHtml("about-us/index.html");

  assertUsesAstroAssets(aboutHtml, [
    "/images/about/about-hero.png",
    "/images/about/about-story-flatlay.png",
    "/images/about/about-story-packing.png",
    "/images/about/about-team-avatar.png",
    "/images/about/about-network-map.png",
  ]);
});

test("services pages optimize local imagery", () => {
  buildSiteOnce();

  const pageExpectations = [
    {
      path: "services/index.html",
      rawPaths: [
        "/images/services/hero-logistics-figma-layer.png",
        "/images/services/sourcing.png",
        "/images/services/product-development.png",
        "/images/services/quality.png",
        "/images/services/warehouse-assembly.png",
        "/images/services/delivery-bg.png",
      ],
    },
    {
      path: "services/faq/index.html",
      rawPaths: ["/images/services/faq-hero.png"],
    },
  ];

  for (const { path, rawPaths } of pageExpectations) {
    const html = readBuiltHtml(path);
    assertUsesAstroAssets(html, rawPaths);
  }
});

test("blog pages optimize local hero imagery and render Sanity-hosted blog assets", () => {
  buildSiteOnce();

  const indexHtml = readBuiltHtml("blog/index.html");
  assertUsesAstroAssets(indexHtml, ["/images/blog/material-guide-hero.jpg"]);
  assert.equal(
    indexHtml.includes("/images/blog/article-"),
    false,
    "Expected the blog index to stop shipping legacy local blog card image paths",
  );

  if (indexHtml.includes('data-blog-pagination-root="materialsPage"')) {
    assert.match(
      indexHtml,
      /https:\/\/cdn\.sanity\.io\/images\//,
      "Expected the blog index to render blog card imagery from Sanity when cards are present",
    );
  }

  const articlePath = "blog/best-paper-materials-for-luxury-brand-packaging/index.html";

  if (existsSync(join(distDir, articlePath))) {
    const articleHtml = readBuiltHtml(articlePath);
    assert.equal(
      articleHtml.includes("/images/blog/"),
      false,
      "Expected blog article pages to stop shipping legacy local blog image paths",
    );
    assert.match(
      articleHtml,
      /https:\/\/cdn\.sanity\.io\/images\//,
      "Expected blog article pages to render Sanity-hosted imagery",
    );
  }
});

test("contact page optimizes local imagery", () => {
  buildSiteOnce();

  const contactHtml = readBuiltHtml("contact-us/index.html");

  assertUsesAstroAssets(contactHtml, ["/images/contact/contact-hero.png"]);
});

test("product pages optimize local raster imagery", () => {
  buildSiteOnce();

  const pagePaths = [
    "products/hanging-tag/index.html",
    "products/bag/index.html",
    "products/labels/index.html",
    "products/ribbon/index.html",
    "products/tape/index.html",
    "products/sticker/index.html",
    "products/patches/index.html",
    "products/tissue-paper/index.html",
  ];

  for (const pagePath of pagePaths) {
    const html = readBuiltHtml(pagePath);
    assertNoRawRasterImagePaths(html, pagePath);
  }
});

test("product pages no longer depend on the legacy labels component chain", () => {
  const legacyFiles = [
    "src/data/labelsProduct.ts",
    "src/components/sections/products/LabelsApplications.astro",
    "src/components/sections/products/LabelsCaseStudy.astro",
    "src/components/sections/products/LabelsCustomization.astro",
    "src/components/sections/products/LabelsFaq.astro",
    "src/components/sections/products/LabelsFeatureBand.astro",
    "src/components/sections/products/LabelsIntro.astro",
    "src/components/sections/products/LabelsProcess.astro",
    "src/components/sections/products/LabelsProductPage.astro",
    "src/components/sections/products/LabelsShowcase.astro",
    "src/components/sections/products/LabelsStyles.astro",
    "src/components/sections/products/LabelsWhyChoose.astro",
  ];

  for (const relativePath of legacyFiles) {
    assert.equal(
      existsSync(join(astroDir, relativePath)),
      false,
      `Expected legacy labels file to be removed: ${relativePath}`,
    );
  }

  const productPageSource = readSource("src/components/sections/products/ProductPage.astro");

  assert.equal(
    /Labels(?:Applications|Customization|Showcase|CaseStudy|Faq|FeatureBand|Intro|Process|ProductPage|Styles|WhyChoose)/.test(productPageSource),
    false,
    "Expected ProductPage to stop importing legacy labels components",
  );
});

test("product applications keeps the four-column desktop grid from the legacy layout", () => {
  const productApplicationsSource = readSource("src/components/sections/products/ProductApplications.astro");

  assert.match(
    productApplicationsSource,
    /lg:grid-cols-4/,
    "Expected desktop applications layout to keep four columns",
  );
});

test("product applications adds a dedicated three-card layout for three-item sets", () => {
  const productApplicationsSource = readSource("src/components/sections/products/ProductApplications.astro");

  assert.match(
    productApplicationsSource,
    /applications\.length === 3/,
    "Expected applications layout to special-case three-item sets",
  );
  assert.match(
    productApplicationsSource,
    /lg:grid-cols-3/,
    "Expected three-item applications layout to use a three-column desktop grid",
  );
  assert.match(
    productApplicationsSource,
    /aspect-\[378\/265\]/,
    "Expected three-item applications cards to use the Figma image ratio",
  );
});

test("product applications intro description uses lighter body typography", () => {
  const productApplicationsSource = readSource("src/components/sections/products/ProductApplications.astro");

  assert.match(
    productApplicationsSource,
    /description && \(\s*<p class="mx-auto mt-5 max-w-\[760px\] text-sm leading-6 text-text-main md:text-\[15px\] md:leading-7">/,
    "Expected applications intro description to use smaller regular body text",
  );
  assert.doesNotMatch(
    productApplicationsSource,
    /description && \(\s*<p class="mx-auto mt-5 text-base font-semibold leading-7 text-text-main md:text-2xl md:leading-9">/,
    "Expected applications intro description to stop using the bold oversized treatment",
  );
});

test("product case study uses the figma top layout with a fixed view more button", () => {
  const productCaseStudySource = readSource("src/components/sections/products/ProductCaseStudy.astro");

  assert.match(
    productCaseStudySource,
    /aspect-\[531\/545\]/,
    "Expected product case study image to use the squarer Figma ratio",
  );
  assert.match(
    productCaseStudySource,
    /md:text-\[24px\]/,
    "Expected product case study headline to match the Figma title scale",
  );
  assert.match(
    productCaseStudySource,
    /h-\[50px\] w-\[180px\]/,
    "Expected product case study button to use the fixed Figma dimensions",
  );
  assert.doesNotMatch(
    productCaseStudySource,
    /w-full px-9 py-3 text-sm normal-case/,
    "Expected product case study button to stop using the old fluid button sizing",
  );
});

test("product customization process icons use local figma svg assets", () => {
  const productProcessIconSource = readSource("src/components/sections/products/ProductProcessIcon.astro");

  assert.match(
    productProcessIconSource,
    /\/images\/products\/process\/concept\.svg/,
    "Expected product process icons to reference local Figma svg assets",
  );
  assert.match(
    productProcessIconSource,
    /\/images\/products\/process\/guaranteeing\.svg/,
    "Expected guaranteeing icon to come from the local Figma asset set",
  );
  assert.doesNotMatch(
    productProcessIconSource,
    /M32 7c-11 0-20 8\.4-20 19/,
    "Expected old inline concept icon path to be removed",
  );
});

test("home case study follows the dedicated figma card layout", () => {
  const homeCaseStudySource = readSource("src/components/sections/CaseStudy.astro");

  assert.match(
    homeCaseStudySource,
    /aspect-\[562\/486\]/,
    "Expected the home case study image to use the Figma landscape ratio",
  );
  assert.match(
    homeCaseStudySource,
    /uppercase tracking-\[0\.03em\] text-\[#A67237\]/,
    "Expected the home case study kicker to use the Figma brand accent styling",
  );
  assert.match(
    homeCaseStudySource,
    /bg-\[#F6F4EF\]/,
    "Expected the home case study quote to sit inside the warm Figma card",
  );
  assert.match(
    homeCaseStudySource,
    /case-study-quote\.png/,
    "Expected the home case study quote mark to use the downloaded Figma asset",
  );
  assert.match(
    homeCaseStudySource,
    /View More Case Studies/,
    "Expected the home case study CTA copy to match the Figma button label",
  );
  assert.match(
    homeCaseStudySource,
    /SymbolIcon name=\"arrowLongRight\"/,
    "Expected the home case study CTA to use the same long right arrow icon as the About Us button",
  );
  assert.match(
    homeCaseStudySource,
    /max-w-\[300px\][\s\S]*md:w-\[300px\]/,
    "Expected the home case study CTA to use the fixed Figma width",
  );
});

test("solution case study section still mirrors the product figma layout", () => {
  const solutionCaseStudySource = readSource("src/components/sections/solutions/SolutionCaseStudy.astro");

  assert.match(
    solutionCaseStudySource,
    /aspect-\[531\/545\]/,
    "Expected solution case study images to use the product figma ratio",
  );
  assert.match(
    solutionCaseStudySource,
    /md:text-\[24px\]/,
    "Expected solution case study headlines to match the product title scale",
  );
  assert.match(
    solutionCaseStudySource,
    /h-\[50px\] w-\[180px\]/,
    "Expected solution case study buttons to use the fixed product dimensions",
  );
});
