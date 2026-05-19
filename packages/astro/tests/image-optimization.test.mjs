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

  const homeHtml = readBuiltHtml("home/index.html");

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
    const rawPaths = ["/images/solutions/"];

    if (pagePath === "solutions/index.html") {
      rawPaths.push("/images/home/solution-cosmetics-hero.png");
    }

    assertUsesAstroAssets(html, rawPaths);
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
