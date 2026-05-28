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

test("blog pages optimize local imagery", () => {
  buildSiteOnce();

  const pageExpectations = [
    {
      path: "blog/index.html",
      rawPaths: [
        "/images/blog/material-guides-hero.jpg",
        "/images/blog/article-luxury-paper.jpg",
        "/images/blog/article-kraft-paper.jpg",
        "/images/blog/article-biodegradable-packaging.jpg",
      ],
    },
    {
      path: "blog/best-paper-materials-for-luxury-brand-packaging/index.html",
      rawPaths: [
        "/images/blog/material-guides-hero.jpg",
        "/images/blog/article-luxury-paper.jpg",
      ],
    },
  ];

  for (const { path, rawPaths } of pageExpectations) {
    const html = readBuiltHtml(path);
    assertUsesAstroAssets(html, rawPaths);
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

test("home and solutions case study sections mirror the product figma layout", () => {
  const homeCaseStudySource = readSource("src/components/sections/CaseStudy.astro");
  const solutionCaseStudySource = readSource("src/components/sections/solutions/SolutionCaseStudy.astro");

  for (const source of [homeCaseStudySource, solutionCaseStudySource]) {
    assert.match(
      source,
      /aspect-\[531\/545\]/,
      "Expected home and solution case study images to use the product figma ratio",
    );
    assert.match(
      source,
      /md:text-\[24px\]/,
      "Expected home and solution case study headlines to match the product title scale",
    );
    assert.match(
      source,
      /h-\[50px\] w-\[180px\]/,
      "Expected home and solution case study buttons to use the fixed product dimensions",
    );
  }
});
