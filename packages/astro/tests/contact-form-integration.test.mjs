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

test("contact inquiry form is wired for Formspree async submission", () => {
  const source = readSource("src/components/sections/contact/ContactProjectForm.astro");

  assert.match(source, /id="contact-project-form"/);
  assert.match(source, /import\.meta\.env\.PUBLIC_FORMSPREE_FORM_ID/);
  assert.match(source, /import\s*\{\s*initForm\s*\}\s*from\s*['"]@formspree\/ajax['"]/);
  assert.match(source, /name="_gotcha"/);
  assert.match(source, /data-contact-form-error/);
  assert.match(source, /data-contact-form-success/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /data-fs-submit-btn/);
  assert.match(source, /type="submit"/);

  for (const fieldName of ["name", "company", "email", "phone", "country", "message"]) {
    assert.match(source, new RegExp(`name="${fieldName}"`));
  }

  for (const requiredFieldId of [
    "contact-name",
    "contact-company",
    "contact-email",
    "contact-message",
  ]) {
    assert.match(
      source,
      new RegExp(`id="${requiredFieldId}"[\\s\\S]*required`),
      `Expected ${requiredFieldId} to be required`,
    );
  }

  for (const copy of [
    "Thank You For Your Inquiry",
    "We've received your project details.",
    "within 24 hours on business days",
    "If your request is urgent, feel free to contact us via WhatsApp or email.",
  ]) {
    assert.match(source, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
