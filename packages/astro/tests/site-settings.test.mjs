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
    /socialMedia\.length > 0 &&/,
    "Expected Footer to hide social media when site settings are empty",
  );
  assert.match(
    footerSource,
    /<div[^>]*>\s*<h2 class="text-base font-bold text-black">Contact Us<\/h2>[\s\S]*socialMedia\.length > 0 &&[\s\S]*>Social Media</,
    "Expected Footer Contact Us column to include a Social Media label",
  );
  assert.match(
    footerSource,
    /rounded-full bg-black\/10/,
    "Expected Footer social media icons to use circular wrappers",
  );
  assert.match(
    footerSource,
    /href=\{item\.url\}/,
    "Expected Footer social media icons to link to the Sanity-provided URL",
  );
  assert.equal(
    /rounded-\[2px\] bg-black\/10/.test(footerSource),
    false,
    "Expected Footer social media icons to stop using square corner wrappers",
  );

  for (const iconName of ["facebook", "instagram", "x", "linkedin", "twitter"]) {
    assert.match(
      symbolIconSource,
      new RegExp(`name === "${iconName}"`),
      `Expected SymbolIcon to support the ${iconName} glyph`,
    );
  }
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
    /class="mt-auto flex w-full items-center justify-center rounded-soft bg-brand/,
    "Expected the submit button to pin itself to the bottom of the form card",
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
