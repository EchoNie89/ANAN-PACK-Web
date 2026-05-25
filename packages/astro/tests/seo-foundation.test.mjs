import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");

function readSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

test("layout exposes canonical, social meta, and json-ld hooks", () => {
  const source = readSource("src/layouts/Layout.astro");

  assert.match(source, /rel="canonical"/, "Expected Layout to output a canonical link");
  assert.match(source, /property="og:title"/, "Expected Layout to output Open Graph title");
  assert.match(source, /name="twitter:card"/, "Expected Layout to output Twitter card metadata");
  assert.match(source, /application\/ld\+json/, "Expected Layout to emit JSON-LD script tags");
  assert.match(source, /name="robots"/, "Expected Layout to output robots directives");
  assert.match(
    source,
    /content=\{import\.meta\.env\.PUBLIC_GOOGLE_SITE_VERIFICATION\}/,
    "Expected Layout to bind the Google verification value instead of rendering a literal template string",
  );
  assert.match(
    source,
    /content=\{import\.meta\.env\.PUBLIC_BING_SITE_VERIFICATION\}/,
    "Expected Layout to bind the Bing verification value instead of rendering a literal template string",
  );
  assert.doesNotMatch(
    source,
    /content="\{import\.meta\.env\.PUBLIC_GOOGLE_SITE_VERIFICATION \?\? ''\}"/,
    "Expected Layout to stop rendering a quoted Astro expression for Google verification",
  );
  assert.doesNotMatch(
    source,
    /content="\{import\.meta\.env\.PUBLIC_BING_SITE_VERIFICATION \?\? ''\}"/,
    "Expected Layout to stop rendering a quoted Astro expression for Bing verification",
  );
});

test("seo support files cover site url, robots, and sitemap", () => {
  const configSource = readSource("astro.config.mjs");
  const envExampleSource = readSource(".env.example");
  const readmeSource = readSource("README.md");
  const robotsSource = readSource("src/pages/robots.txt.ts");
  const sitemapSource = readSource("src/pages/sitemap.xml.ts");

  assert.match(configSource, /PUBLIC_SITE_URL/, "Expected Astro config to read PUBLIC_SITE_URL");
  assert.match(envExampleSource, /PUBLIC_SITE_URL=/, "Expected .env.example to document PUBLIC_SITE_URL");
  assert.match(readmeSource, /PUBLIC_SITE_URL=https:\/\/www\.your-domain\.com/, "Expected README to document PUBLIC_SITE_URL");
  assert.match(robotsSource, /Sitemap:/, "Expected robots route to advertise the sitemap when the site URL is known");
  assert.match(sitemapSource, /productPages/, "Expected sitemap to include product routes");
  assert.match(sitemapSource, /solutionPages/, "Expected sitemap to include solution routes");
  assert.match(sitemapSource, /getAllBlogArticles/, "Expected sitemap to include blog article routes");
});

test("special pages include the intended indexation controls and schema", () => {
  const thankYouSource = readSource("src/pages/thank-you.astro");
  const solutionsSource = readSource("src/pages/solutions.astro");
  const blogPostSource = readSource("src/pages/blog/[slug].astro");
  const faqSource = readSource("src/pages/services/faq.astro");
  const productSource = readSource("src/pages/products/[slug].astro");
  const blogIndexSource = readSource("src/pages/blog/index.astro");
  const redirectsSource = readSource("public/_redirects");

  assert.match(thankYouSource, /noindex/, "Expected thank-you page to be marked noindex");
  assert.match(solutionsSource, /canonicalPath=\{`\/solutions\/\$\{defaultSolution\.slug\}`\}/, "Expected /solutions to canonicalize to its primary detail page");
  assert.match(solutionsSource, /noindex/, "Expected /solutions to be marked noindex because it duplicates the primary solution page");
  assert.match(blogPostSource, /openGraphType="article"/, "Expected blog posts to emit article Open Graph metadata");
  assert.match(faqSource, /buildFaqJsonLd/, "Expected FAQ page to emit FAQ schema");
  assert.match(productSource, /buildProductJsonLd/, "Expected product pages to emit product schema");
  assert.equal(
    existsSync(join(astroDir, "src/pages/home.astro")),
    false,
    "Expected the duplicate /home page source to be removed in favor of a redirect",
  );
  assert.match(
    redirectsSource,
    /^\/home \/ 301$/m,
    "Expected Cloudflare Pages to redirect /home to the canonical homepage",
  );
  assert.doesNotMatch(
    blogIndexSource,
    /\/home\b/,
    "Expected blog breadcrumbs to point to / instead of the old /home alias",
  );
});

test("footer and blog UI no longer ship hash-placeholder links", () => {
  const footerSource = readSource("src/components/sections/Footer.astro");
  const blogPostBodySource = readSource("src/components/sections/blog/BlogPostBody.astro");
  const layoutSource = readSource("src/layouts/Layout.astro");

  assert.doesNotMatch(
    footerSource,
    /href="#"/,
    "Expected Footer to stop shipping placeholder # links",
  );
  assert.doesNotMatch(
    blogPostBodySource,
    /href="#"/,
    "Expected blog post share controls to stop shipping placeholder # links",
  );
  assert.doesNotMatch(
    blogPostBodySource,
    /Share on /,
    "Expected blog post pages to remove the share button cluster entirely",
  );
  assert.doesNotMatch(
    blogPostBodySource,
    />Share</,
    "Expected blog post pages to remove the share section label entirely",
  );
  assert.match(
    footerSource,
    /href="#site-top"/,
    "Expected the footer Back to top control to target a real in-page anchor",
  );
  assert.match(
    layoutSource,
    /<body id="site-top">/,
    "Expected Layout to expose a real in-page anchor target for Back to top",
  );
});

test("contrast-sensitive UI uses darker brand fills for interactive states", () => {
  const globalSource = readSource("src/styles/global.css");
  const buttonSource = readSource("src/components/ui/Button.astro");
  const thankYouSource = readSource("src/pages/thank-you.astro");
  const servicesDropdownSource = readSource("src/components/sections/ServicesDropdown.astro");
  const solutionsDropdownSource = readSource("src/components/sections/SolutionsDropdown.astro");
  const serviceProcessSource = readSource("src/components/sections/services/ServiceProcess.astro");
  const sourcingComparisonSource = readSource("src/components/sections/services/SourcingComparison.astro");
  const solutionStripSource = readSource("src/components/sections/solutions/SolutionStrip.astro");

  assert.match(
    globalSource,
    /--color-nav-active: #81572b;/,
    "Expected the shared nav active token to use a darker fill that keeps white text readable",
  );
  assert.match(
    buttonSource,
    /primary:\s*"bg-brand-dark text-white hover:bg-brand-deep"/,
    "Expected primary buttons to use the darker brand fill instead of the low-contrast default brand tone",
  );
  assert.match(
    thankYouSource,
    /bg-brand-dark[\s\S]*hover:bg-brand-deep/,
    "Expected the thank-you CTA to use the same contrast-safe primary button treatment",
  );
  assert.match(
    servicesDropdownSource,
    /data-\[active=true\]:bg-nav-active data-\[active=true\]:text-white/,
    "Expected active service menu items to use the darker shared nav fill",
  );
  assert.match(
    solutionsDropdownSource,
    /data-\[active=true\]:bg-nav-active data-\[active=true\]:text-white/,
    "Expected active solution menu items to use the darker shared nav fill",
  );
  assert.match(
    serviceProcessSource,
    /bg-\[#d4c2a4\][\s\S]*text-text-main/,
    "Expected the service process strapline to stop using white text on a light tan background",
  );
  assert.match(
    sourcingComparisonSource,
    /bg-nav-active[\s\S]*text-white/,
    "Expected the sourcing comparison badge to use the darker nav fill for white text",
  );
  assert.match(
    sourcingComparisonSource,
    /bg-brand-soft text-brand-dark/,
    "Expected the managed sourcing tag to use darker accent text on the soft brand background",
  );
  assert.match(
    solutionStripSource,
    /bg-brand-soft[\s\S]*text-text-main/,
    "Expected the solution strip to stop using white text on the soft brand background",
  );
});
