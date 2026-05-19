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
});

test("footer and contact page use a shared site settings getter", () => {
  const footerSource = readAstroSource("src/components/sections/Footer.astro");
  const contactFormSource = readAstroSource("src/components/sections/contact/ContactProjectForm.astro");

  assert.match(
    footerSource,
    /getSiteContactDetails/,
    "Expected Footer to use the shared site contact details getter",
  );
  assert.equal(
    /contactDetails\s*,?[\s\S]*from ['"]\.\.\/\.\.\/data\/company['"]/.test(footerSource),
    false,
    "Expected Footer to stop reading contactDetails directly from company data",
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
