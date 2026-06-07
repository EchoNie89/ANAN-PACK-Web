import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");
const repoRoot = join(astroDir, "..", "..");
const sanityDir = join(repoRoot, "packages", "sanity");

function readAstroSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

function readSanitySource(relativePath) {
  return readFileSync(join(sanityDir, relativePath), "utf8");
}

test("site settings schema exists for shared contact information", () => {
  assert.equal(
    existsSync(join(sanityDir, "sanity/schemas/siteSettings.ts")),
    true,
    "Expected a site settings schema for shared contact info",
  );

  const schemaIndexSource = readSanitySource("sanity/schemas/index.ts");

  assert.match(
    schemaIndexSource,
    /siteSettings/,
    "Expected Sanity schema index to register site settings",
  );

  const siteSettingsSource = readSanitySource("sanity/schemas/siteSettings.ts");

  assert.match(
    siteSettingsSource,
    /name:\s*['"]socialMedia['"]/,
    "Expected site settings schema to expose footer social media entries",
  );
  assert.match(
    siteSettingsSource,
    /title:\s*['"]YouTube['"]\s*,\s*value:\s*['"]youtube['"]/,
    "Expected site settings schema to allow YouTube links in footer social media settings",
  );
  assert.match(
    siteSettingsSource,
    /name:\s*['"]footerQrCode['"][\s\S]*type:\s*['"]image['"]/,
    "Expected site settings schema to expose a footer QR code image field",
  );
});

test("site settings fetch uses the shared timed Sanity fallback path", () => {
  const siteSettingsSource = readAstroSource("src/lib/site-settings.ts");
  const sanitySource = readAstroSource("src/lib/sanity.ts");

  assert.match(
    siteSettingsSource,
    /fetchSanityQuery/,
    "Expected site settings reads to use the shared Sanity fetch helper instead of calling the live API directly",
  );
  assert.equal(
    /sanityClient\.fetch/.test(siteSettingsSource),
    false,
    "Expected site settings to stop calling sanityClient.fetch directly so stalled live API requests do not block SSR",
  );
  assert.match(
    siteSettingsSource,
    /footerQrCode\?:\s*SanityImageSource \| null;/,
    "Expected site settings types to expose an optional footer QR code image",
  );
  assert.match(
    siteSettingsSource,
    /"footerQrCode":\s*footerQrCode\{\s*_type,\s*asset,\s*"dimensions": asset->metadata\.dimensions\s*\}/,
    "Expected site settings query to request the footer QR code image metadata",
  );
  assert.match(
    sanitySource,
    /sanityCdnClient/,
    "Expected the shared Sanity module to define a CDN fallback client for read queries",
  );
  assert.match(
    sanitySource,
    /setTimeout/,
    "Expected the shared Sanity fetch helper to enforce a timeout before falling back",
  );
  assert.match(
    sanitySource,
    /sanityCdnClient\.fetch/,
    "Expected the shared Sanity fetch helper to retry against the CDN client after a live API failure",
  );
});

test("site settings bypass module cache during local development", () => {
  const siteSettingsSource = readAstroSource("src/lib/site-settings.ts");

  assert.match(
    siteSettingsSource,
    /if\s*\(import\.meta\.env\.DEV\)\s*\{\s*return fetchSiteSettings\(\);\s*\}/,
    "Expected getSiteSettings to bypass the shared module cache in Astro dev so Sanity edits appear without restarting the server",
  );
  assert.match(
    siteSettingsSource,
    /if\s*\(siteSettingsPromise\)\s*\{\s*return siteSettingsPromise;\s*\}/,
    "Expected getSiteSettings to keep the shared module cache path for non-dev renders",
  );
});

test("footer and contact page use a shared site settings getter", () => {
  const footerSource = readAstroSource("src/components/sections/Footer.astro");
  const contactFormSource = readAstroSource("src/components/sections/contact/ContactProjectForm.astro");
  const companySource = readAstroSource("src/data/company.ts");

  assert.match(
    footerSource,
    /getSiteSettings/,
    "Expected Footer to use the shared site settings getter",
  );
  assert.match(
    footerSource,
    /const\s*\{\s*contactDetails,\s*socialMedia,\s*footerQrCode\s*\}\s*=\s*await getSiteSettings\(\);/,
    "Expected Footer to read footerQrCode from the shared site settings getter",
  );
  assert.match(
    footerSource,
    /sanityImageUrl/,
    "Expected Footer to be able to render a Sanity-managed QR code image",
  );
  assert.match(
    footerSource,
    /getLocalImage\('\/images\/home\/qr-code\.png'\)/,
    "Expected Footer to keep the local QR code asset as a fallback",
  );
  assert.match(
    footerSource,
    /footerQrCode\s*\?\s*\(/,
    "Expected Footer to render the Sanity QR code first when it exists",
  );
  assert.equal(
    /contactDetails\s*,?[\s\S]*from ['"]\.\.\/\.\.\/data\/company['"]/.test(footerSource),
    false,
    "Expected Footer to stop reading contactDetails directly from company data",
  );
  assert.equal(
    /footerSocialMedia\s*,?[\s\S]*from ['"]\.\.\/\.\.\/data\/company['"]/.test(footerSource),
    false,
    "Expected Footer to stop reading footerSocialMedia directly from company data",
  );
  assert.equal(
    /export const footerSocialMedia = \[/.test(companySource),
    false,
    "Expected company data to stop exporting the footer social media fallback list",
  );

  assert.match(
    contactFormSource,
    /getSiteContactDetails/,
    "Expected ContactProjectForm to use the shared site contact details getter",
  );
  assert.equal(
    /contactDetails\s*,?[\s\S]*from ['"]\.\.\/\.\.\/\.\.\/data\/company['"]/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to stop reading contactDetails directly from company data",
  );
});

test("footer contact column includes a social media icon row", () => {
  const footerSource = readAstroSource("src/components/sections/Footer.astro");
  const symbolIconSource = readAstroSource("src/components/ui/SymbolIcon.astro");

  assert.match(
    footerSource,
    /footerSocialMediaItems/,
    "Expected Footer to build a fixed social media icon list instead of hiding the row when Sanity has no links",
  );
  assert.match(
    footerSource,
    /<div class="w-full max-w-none lg:max-w-\[210px\]">[\s\S]*<h2 class="text-base font-bold text-black">Contact Us<\/h2>[\s\S]*<ul class="mt-4 flex flex-wrap gap-\[15px\]">/,
    "Expected Footer Contact Us column to stay full width on mobile while keeping the social media icon row below the contact details",
  );
  assert.match(
    footerSource,
    /rounded-full bg-black\/10/,
    "Expected Footer social media icons to use circular wrappers",
  );
  assert.match(
    footerSource,
    /item\.url \? \(/,
    "Expected Footer to render links only when Sanity provides a social media URL",
  );
  assert.match(
    footerSource,
    /:\s*\(\s*<span/,
    "Expected Footer to render a static icon when no social media URL is available",
  );
  assert.equal(
    /rounded-\[2px\] bg-black\/10/.test(footerSource),
    false,
    "Expected Footer social media icons to stop using square corner wrappers",
  );
  assert.match(
    footerSource,
    /\['linkedin', 'youtube', 'instagram'\] as const/,
    "Expected Footer social media defaults to keep only LinkedIn, YouTube, and Instagram",
  );

  for (const iconName of ["linkedin", "youtube", "instagram"]) {
    assert.match(
      symbolIconSource,
      new RegExp(`name === "${iconName}"`),
      `Expected SymbolIcon to support the ${iconName} glyph`,
    );
  }
});

test("footer contact items link out to their third-party destinations", () => {
  const footerSource = readAstroSource("src/components/sections/Footer.astro");

  assert.match(
    footerSource,
    /const footerEmailHref = `mailto:\$\{contactDetails\.email\}`;/,
    "Expected Footer email to link through a mailto destination",
  );

  assert.match(
    footerSource,
    /const footerWhatsappHref = `https:\/\/wa\.me\/\$\{footerWhatsappDigits\}`;/,
    "Expected Footer WhatsApp to link through a wa.me destination",
  );

  assert.match(
    footerSource,
    /const footerMapsHref = `https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=\$\{encodeURIComponent\(footerMapsQuery\)\}`;/,
    "Expected Footer location to link through a Google Maps search destination",
  );

  assert.match(
    footerSource,
    /item\.href \? \(\s*<a[\s\S]*href=\{item\.href\}/,
    "Expected Footer contact values to render clickable links when a destination exists",
  );
});

test("footer legal links use standard naming without sitemap entry", () => {
  const footerSource = readAstroSource("src/components/sections/Footer.astro");

  assert.match(
    footerSource,
    />Privacy Policy</,
    "Expected Footer to use the standard Privacy Policy label",
  );
  assert.match(
    footerSource,
    />Terms of Use</,
    "Expected Footer to use the standard Terms of Use label",
  );
  assert.equal(
    />Sitemap</.test(footerSource),
    false,
    "Expected Footer to remove the sitemap link from the legal row",
  );
});

test("contact page contact card uses the figma contact icon set", () => {
  const contactFormSource = readAstroSource("src/components/sections/contact/ContactProjectForm.astro");
  const symbolIconSource = readAstroSource("src/components/ui/SymbolIcon.astro");

  assert.match(
    contactFormSource,
    /icon:\s*['"]whatsapp['"]/,
    "Expected ContactProjectForm to use a dedicated WhatsApp icon instead of the generic phone icon",
  );
  assert.match(
    contactFormSource,
    /size-\[52px\].*rounded-full.*bg-\[#f1e9dd\]/,
    "Expected contact info icon wrappers to match the Figma 52px beige circles",
  );
  assert.match(
    contactFormSource,
    /SymbolIcon name=\{item\.icon\} class="size-\[30px\]"/,
    "Expected contact info icons to render at the 30px Figma size",
  );

  for (const iconName of ["whatsapp", "contactPhone", "contactMail", "contactLocation", "contactClock"]) {
    assert.match(
      symbolIconSource,
      new RegExp(`name === "${iconName}"`),
      `Expected SymbolIcon to support the ${iconName} contact glyph`,
    );
  }
});

test("contact project form keeps first contact simple", () => {
  const contactFormSource = readAstroSource("src/components/sections/contact/ContactProjectForm.astro");

  assert.equal(
    /id="contact-category"/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to remove the Product Category field",
  );
  assert.equal(
    /Product Category/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to stop asking for product category on first contact",
  );
  assert.equal(
    /id="contact-quantity"/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to remove the Estimated Quantity field",
  );
  assert.equal(
    /Estimated Quantity/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to stop asking for estimated quantity on first contact",
  );
  assert.match(
    contactFormSource,
    /<input[\s\S]*id="contact-country"[\s\S]*type="text"[\s\S]*placeholder="Country \/ Region"/,
    "Expected Country / Region to be a plain text input",
  );
  assert.match(
    contactFormSource,
    /<div class="md:col-span-2">[\s\S]*id="contact-email"/,
    "Expected Email to span the full row on desktop",
  );
  assert.match(
    contactFormSource,
    /<div class="md:col-span-2">[\s\S]*id="contact-phone"/,
    "Expected WhatsApp \/ Phone to span the full row on desktop",
  );
  assert.equal(
    /<select id="contact-country"/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to stop using a country dropdown",
  );
  assert.equal(
    /type="file"/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to remove file uploads",
  );
  assert.equal(
    /Upload Artwork/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to remove the upload artwork prompt",
  );
  assert.equal(
    /self-start/.test(contactFormSource),
    false,
    "Expected ContactProjectForm to stop opting out of equal-height layout",
  );
  assert.match(
    contactFormSource,
    /lg:items-stretch/,
    "Expected the desktop contact layout to stretch both columns to the same height",
  );
  assert.match(
    contactFormSource,
    /class="flex h-full flex-col rounded-soft bg-white p-6 shadow-card md:p-8"/,
    "Expected the left contact form card to fill the stretched grid height",
  );
  assert.match(
    contactFormSource,
    /<form class="mt-8 flex flex-1 flex-col/,
    "Expected the form body to grow so the CTA can sit at the bottom",
  );
  assert.match(
    contactFormSource,
    /class="mt-auto flex w-full items-center justify-center rounded-soft bg-brand-dark/,
    "Expected the submit button to pin itself to the bottom of the form card with a contrast-safe brand fill",
  );
});

test("about page schema and component wire up team members from Sanity", () => {
  assert.equal(
    existsSync(join(sanityDir, "sanity/schemas/aboutPage.ts")),
    true,
    "Expected an about page schema for team members",
  );

  const schemaIndexSource = readSanitySource("sanity/schemas/index.ts");
  const sanityConfigSource = readSanitySource("sanity.config.ts");
  const aboutTeamSource = readAstroSource("src/components/sections/about/AboutTeam.astro");
  const companySource = readAstroSource("src/data/company.ts");

  assert.match(
    schemaIndexSource,
    /aboutPage/,
    "Expected Sanity schema index to register aboutPage",
  );
  assert.match(
    sanityConfigSource,
    /schemaType\('aboutPage'\)[\s\S]*documentId\('aboutPage'\)/,
    "Expected Sanity Studio structure to expose the About Page singleton",
  );
  assert.match(
    aboutTeamSource,
    /getAboutTeamMembers/,
    "Expected AboutTeam to use the About page team members getter",
  );
  assert.equal(
    /aboutTeam\s*,?[\s\S]*from ['"]\.\.\/\.\.\/\.\.\/data\/company['"]/.test(aboutTeamSource),
    false,
    "Expected AboutTeam to stop reading aboutTeam directly from company data",
  );
  assert.match(
    companySource,
    /export const aboutTeam = \[/,
    "Expected company data to keep the local About team fallback export",
  );
});

test("about page getter uses the shared client and fails fast to fallback", () => {
  const aboutPageSource = readAstroSource("src/lib/about-page.ts");

  assert.match(
    aboutPageSource,
    /import\s+\{\s*sanityClient\s*\}\s+from\s+["']\.\/sanity["']/,
    "Expected About page getter to reuse the shared Sanity client",
  );
  assert.equal(
    /createClient\s*\(/.test(aboutPageSource),
    false,
    "Expected About page getter to avoid creating its own direct Sanity client",
  );
  assert.match(
    aboutPageSource,
    /Promise\.race/,
    "Expected About page getter to fail fast instead of hanging on a Sanity request",
  );
});

test("about team members do not require imageAlt in Sanity", () => {
  const aboutPageSchemaSource = readSanitySource("sanity/schemas/aboutPage.ts");
  const aboutPageSource = readAstroSource("src/lib/about-page.ts");
  const imageAltFieldAnchor = aboutPageSchemaSource.indexOf('name: "imageAlt"');
  const imageAltFieldWindow =
    imageAltFieldAnchor >= 0
      ? aboutPageSchemaSource.slice(imageAltFieldAnchor, imageAltFieldAnchor + 160)
      : "";

  assert.match(
    aboutPageSchemaSource,
    /name:\s*"imageAlt"/,
    "Expected About page schema to keep the imageAlt field",
  );
  assert.notEqual(
    imageAltFieldWindow,
    "",
    "Expected to locate the imageAlt field block in the About page schema",
  );
  assert.equal(
    /validation:\s*\(Rule\)\s*=>\s*Rule\.required\(\)/.test(imageAltFieldWindow),
    false,
    "Expected About page schema to stop requiring imageAlt",
  );
  assert.equal(
    /!isNonEmptyString\(member\?\.imageAlt\)/.test(aboutPageSource),
    false,
    "Expected About page normalization to stop requiring imageAlt for a valid team member",
  );
  assert.match(
    aboutPageSource,
    /imageAlt:\s*(?:isNonEmptyString\(member\?\.imageAlt\)\s*\?\s*member\.imageAlt\.trim\(\)\s*:\s*""|member\?\.imageAlt\?\.trim\(\)\s*\?\?\s*"")/,
    "Expected About page normalization to fall back to an empty imageAlt",
  );
});

test("about team cards use a white image backdrop", () => {
  const aboutTeamSource = readAstroSource("src/components/sections/about/AboutTeam.astro");

  assert.match(
    aboutTeamSource,
    /rounded-soft bg-white shadow-card/,
    "Expected About team portraits to render on a white card backdrop",
  );
  assert.equal(
    /rounded-soft bg-surface-muted shadow-card/.test(aboutTeamSource),
    false,
    "Expected About team portraits to stop using the muted background that shows through transparent PNG edges",
  );
});

test("about reasons section uses the figma card layout and local figma icon assets", () => {
  const aboutReasonsSource = readAstroSource("src/components/sections/about/AboutReasons.astro");
  const companySource = readAstroSource("src/data/company.ts");

  assert.match(
    aboutReasonsSource,
    /bg-\[#f9f9f9\]/,
    "Expected About reasons section to use the lighter Figma section background",
  );
  assert.match(
    aboutReasonsSource,
    /rounded-\[10px\] border border-black\/10 bg-white/,
    "Expected About reasons cards to use the Figma 10px rounded white cards with a light border",
  );
  assert.match(
    aboutReasonsSource,
    /LocalImage[\s\S]*size-\[60px\]/,
    "Expected About reasons cards to render the 60px local Figma icon assets",
  );
  assert.match(
    companySource,
    /about-reason-integrated\.svg/,
    "Expected company data to source the integrated sourcing icon from a local Figma SVG asset",
  );
  assert.match(
    companySource,
    /about-reason-factory\.svg/,
    "Expected company data to source the audited factory network icon from a local Figma SVG asset",
  );
  assert.match(
    companySource,
    /about-reason-project\.svg/,
    "Expected company data to source the project management icon from a local Figma SVG asset",
  );
  assert.match(
    companySource,
    /about-reason-quality\.svg/,
    "Expected company data to source the quality icon from a local Figma SVG asset",
  );
  assert.match(
    companySource,
    /title:\s*"Integrated Sourcing"/,
    "Expected the first About reasons title to match the Figma copy",
  );
});
