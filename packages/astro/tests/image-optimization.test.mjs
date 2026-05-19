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
