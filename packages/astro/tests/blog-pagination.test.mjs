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

test("blog listing section renders client-side pagination controls with URL state", () => {
  const source = readSource("src/components/sections/blog/BlogListingSection.astro");

  assert.match(source, /data-pagination-param=/);
  assert.match(source, /data-pagination-item/);
  assert.match(source, /data-page-target=/);
  assert.match(source, /window\.history\.pushState/);
  assert.match(source, /window\.addEventListener\("popstate"/);
});

test("blog pagination uses an explicitly centered previous arrow control", () => {
  const source = readSource("src/components/sections/blog/BlogListingSection.astro");

  assert.match(
    source,
    /<button[\s\S]*class="inline-flex size-6 items-center justify-center leading-none text-\[#333333\] transition disabled:cursor-not-allowed disabled:opacity-35"[\s\S]*data-pagination-prev/,
    "Expected the previous-page control to use an explicit square flex wrapper for icon centering",
  );
  assert.match(
    source,
    /data-pagination-prev[\s\S]*<svg class="block" width="18" height="18" viewBox="0 0 18 18" fill="none">/,
    "Expected the previous-page arrow SVG to render as a block element inside its centered wrapper",
  );
});

test("sanity-backed blog fetch no longer falls back to local articles when configured source is empty", () => {
  const source = readSource("src/lib/blog.ts");

  assert.match(source, /if \(!import\.meta\.env\.SANITY_PROJECT_ID\) \{\s*return fallbackArticles;/s);
  assert.match(source, /return normalizedArticles;/);
  assert.match(source, /catch \{\s*return \[];\s*\}/s);
});

test("blog index keeps both paginated sections wired without forcing a redirect", () => {
  const source = readSource("src/pages/blog/index.astro");

  assert.doesNotMatch(source, /Astro\.redirect\('\/home'\)/);
  assert.match(source, /paginationParam="materialsPage"/);
  assert.match(source, /paginationParam="insightsPage"/);
  assert.match(source, /pageSize=\{6\}/);
});
