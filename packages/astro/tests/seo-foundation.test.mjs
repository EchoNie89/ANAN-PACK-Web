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

test("tailored solutions and footer use the refreshed neutral surface colors", () => {
  const globalSource = readSource("src/styles/global.css");
  const industrySolutionsSource = readSource("src/components/sections/IndustrySolutions.astro");
  const footerSource = readSource("src/components/sections/Footer.astro");

  assert.match(
    globalSource,
    /--color-surface-muted: #F9F9F9;/,
    "Expected the shared muted surface token to keep the requested F9F9F9 value",
  );
  assert.match(
    industrySolutionsSource,
    /<section id="solutions" class="bg-surface-muted py-16 md:py-20">/,
    "Expected the Tailored Solutions section to keep using the muted surface background token",
  );
  assert.match(
    globalSource,
    /--color-footer-surface: #F6F5F1;/,
    "Expected a dedicated footer surface token for the requested F6F5F1 background",
  );
  assert.match(
    footerSource,
    /<footer class="bg-footer-surface" id="footer">/,
    "Expected Footer to use the dedicated footer surface background token",
  );
});

test("desktop navigation active states use the amber highlight while dropdown items use the tan fill", () => {
  const globalSource = readSource("src/styles/global.css");
  const headerSource = readSource("src/components/sections/Header.astro");
  const productsMegaMenuSource = readSource("src/components/sections/ProductsMegaMenu.astro");
  const megaMenuCardSource = readSource("src/components/ui/MegaMenuCard.astro");
  const servicesDropdownSource = readSource("src/components/sections/ServicesDropdown.astro");
  const solutionsDropdownSource = readSource("src/components/sections/SolutionsDropdown.astro");

  assert.match(
    globalSource,
    /--color-nav-highlight: #BE6C0D;/,
    "Expected a dedicated amber highlight token for the primary navigation active state",
  );
  assert.match(
    globalSource,
    /--color-nav-dropdown-active: #D4AA77;/,
    "Expected a dedicated dropdown active token for the selected menu item background",
  );
  assert.match(
    headerSource,
    /class="hidden h-full items-center gap-5 text-base font-bold lg:flex"/,
    "Expected the desktop primary navigation to keep the 16px text size",
  );
  assert.match(
    headerSource,
    /activeNav === ['"]Products['"]\s*\?\s*['"]text-nav-highlight['"]\s*:\s*['"]text-ink hover:text-brand['"]/,
    "Expected the active Products trigger to use the amber highlight text color",
  );
  assert.match(
    headerSource,
    /activeNav === ['"]Solutions['"]\s*\?\s*['"]text-nav-highlight['"]\s*:\s*['"]text-ink hover:text-brand['"]/,
    "Expected the active Solutions trigger to use the amber highlight text color",
  );
  assert.match(
    headerSource,
    /activeNav === ['"]Services['"]\s*\?\s*['"]text-nav-highlight['"]\s*:\s*['"]text-ink hover:text-brand['"]/,
    "Expected the active Services trigger to use the amber highlight text color",
  );
  assert.match(
    headerSource,
    /<span[\s\S]*after:bg-nav-highlight[\s\S]*after:opacity-100[\s\S]*after:opacity-0[\s\S]*\{item\.label\}[\s\S]*<\/span>/,
    "Expected menu triggers with arrows to render the underline on a dedicated text span instead of stretching it across the arrow",
  );
  assert.match(
    headerSource,
    /activeNav === item\.label\s*\?\s*['"]text-nav-highlight after:opacity-100['"]\s*:\s*['"]text-ink after:opacity-0 hover:text-brand['"]/,
    "Expected the active top-level nav links to use the amber highlight text color and underline",
  );
  assert.match(
    servicesDropdownSource,
    /data-\[active=true\]:bg-nav-dropdown-active data-\[active=true\]:text-white/,
    "Expected active service dropdown items to use the requested tan fill with white text",
  );
  assert.match(
    solutionsDropdownSource,
    /data-\[active=true\]:bg-nav-dropdown-active data-\[active=true\]:text-white/,
    "Expected active solution dropdown items to use the requested tan fill with white text",
  );
  assert.doesNotMatch(
    solutionsDropdownSource,
    /data-\[active=true\]:underline/,
    "Expected active solution dropdown items to avoid adding an underline",
  );
  assert.doesNotMatch(
    servicesDropdownSource,
    /data-\[active=true\]:underline/,
    "Expected active service dropdown items to avoid adding an underline",
  );
  assert.match(
    megaMenuCardSource,
    /focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2/,
    "Expected product mega menu cards to keep keyboard focus treatment without showing a click border",
  );
  assert.match(
    solutionsDropdownSource,
    /focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset/,
    "Expected solution dropdown items to reserve the focus ring for keyboard-visible focus only",
  );
  assert.match(
    servicesDropdownSource,
    /focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset/,
    "Expected service dropdown items to reserve the focus ring for keyboard-visible focus only",
  );
  assert.doesNotMatch(
    megaMenuCardSource,
    /focus:ring-2 focus:ring-brand focus:ring-offset-2/,
    "Expected product mega menu cards to stop showing a ring on mouse click",
  );
  assert.doesNotMatch(
    solutionsDropdownSource,
    /focus:ring-2 focus:ring-brand focus:ring-inset/,
    "Expected solution dropdown items to stop showing a ring on mouse click",
  );
  assert.doesNotMatch(
    servicesDropdownSource,
    /focus:ring-2 focus:ring-brand focus:ring-inset/,
    "Expected service dropdown items to stop showing a ring on mouse click",
  );
  assert.match(
    productsMegaMenuSource,
    /class=\{`absolute left-1\/2 top-full z-50 w-\[912px\] -translate-x-1\/2 transition duration-200 \$\{visibilityClass\}`\}/,
    "Expected the products mega menu to center itself under the active menu trigger instead of using a viewport-based offset",
  );
  assert.match(
    solutionsDropdownSource,
    /class=\{`absolute left-1\/2 top-full z-50 w-\[266px\] -translate-x-1\/2 overflow-hidden bg-\[#fffffa\] shadow-\[-4px_4px_20px_rgba\(0,0,0,0\.1\)\] transition duration-200 \$\{visibilityClass\}`\}/,
    "Expected the solutions dropdown to center itself under the active menu trigger instead of using a viewport-based offset",
  );
  assert.match(
    servicesDropdownSource,
    /class=\{`absolute left-1\/2 top-full z-50 w-\[226px\] -translate-x-1\/2 overflow-hidden bg-\[#fffffa\] shadow-\[-4px_4px_20px_rgba\(0,0,0,0\.1\)\] transition duration-200 \$\{visibilityClass\}`\}/,
    "Expected the services dropdown to center itself under the active menu trigger instead of using a viewport-based offset",
  );
  assert.doesNotMatch(
    productsMegaMenuSource,
    /xl:left=\[calc/,
    "Expected the products mega menu to stop using hard-coded desktop offsets",
  );
  assert.doesNotMatch(
    solutionsDropdownSource,
    /xl:left=\[calc/,
    "Expected the solutions dropdown to stop using hard-coded desktop offsets",
  );
  assert.doesNotMatch(
    servicesDropdownSource,
    /xl:left=\[calc/,
    "Expected the services dropdown to stop using hard-coded desktop offsets",
  );
});

test("brand contact CTA headline uses the heaviest approved weight", () => {
  const ctaSource = readSource("src/components/sections/CTA.astro");

  assert.match(
    ctaSource,
    /Need Packaging & Trim Solutions For Your Brand\?/,
    "Expected the CTA headline copy to remain unchanged",
  );
  assert.match(
    ctaSource,
    /<h2 class="text-2xl font-black text-ink">/,
    "Expected the CTA headline to use the heavier font-black weight",
  );
  assert.match(
    ctaSource,
    /<div class="rounded-\[6px\] bg-\[#E6DBCA\] px-6 py-8 md:px-10 md:py-9">/,
    "Expected the CTA panel to use the requested 6px border radius instead of the shared panel token",
  );
  assert.match(
    ctaSource,
    /We'll reply within 6 hours\./,
    "Expected the CTA button stack to show the same response-time helper copy used on other pages",
  );
  assert.match(
    ctaSource,
    /<SymbolIcon name="clock" class="size-4" \/>/,
    "Expected the CTA helper copy to reuse the clock icon pattern from the shared PageCTA component",
  );
});

test("shared page ctas now mirror the home CTA surface and title weight", () => {
  const pageCtaSource = readSource("src/components/sections/PageCTA.astro");

  assert.match(
    pageCtaSource,
    /<h2 class="text-2xl font-black tracking-tight text-ink md:text-\[28px\]">/,
    "Expected shared page CTA headings to use the same heavier weight as the home CTA",
  );
  assert.match(
    pageCtaSource,
    /<div class=\{`rounded-\[6px\] px-6 py-7 md:px-10 md:py-8 \$\{toneClass\}`\}>/,
    "Expected shared page CTA cards to use the same 6px radius as the home CTA",
  );
  assert.match(
    pageCtaSource,
    /const toneClass = "bg-\[#E6DBCA\]";/,
    "Expected shared page CTA cards to use the same tan background as the home CTA",
  );
});

test("about page section menu mirrors the dropdown hover and active treatment", () => {
  const aboutHeroSource = readSource("src/components/sections/about/AboutHero.astro");

  assert.match(
    aboutHeroSource,
    /data-about-menu/,
    "Expected the About page section menu to expose a root hook for syncing active items",
  );
  assert.match(
    aboutHeroSource,
    /data-about-menu-link/,
    "Expected the About page section menu links to expose hooks for active-state syncing",
  );
  assert.match(
    aboutHeroSource,
    /bg-white px-4 text-center text-base font-bold text-black transition hover:brightness-95 data-\[active=true\]:bg-nav-dropdown-active data-\[active=true\]:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset/,
    "Expected the About page section menu links to share the dropdown hover and active styling",
  );
  assert.match(
    aboutHeroSource,
    /window\.addEventListener\('hashchange', syncAboutMenuLinks\);/,
    "Expected the About page section menu to resync its active item when the hash changes",
  );
  assert.match(
    aboutHeroSource,
    /const currentHash = window\.location\.hash \|\| '#our-story';/,
    "Expected the About page section menu to default to Our Story when no hash is present",
  );
});
