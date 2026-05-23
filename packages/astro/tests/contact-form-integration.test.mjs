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
  assert.match(source, /data-submit-label/);
  assert.match(source, /type="submit"/);

  for (const fieldName of ["name", "company", "email", "phone", "country", "message"]) {
    assert.match(source, new RegExp(`name="${fieldName}"`));
    assert.match(
      source,
      new RegExp(`data-fs-error="${fieldName}"`),
      `Expected a field-level Formspree error target for ${fieldName}`,
    );
    assert.match(
      source,
      new RegExp(`class="[^"]*empty:hidden[^"]*"[^>]*data-fs-error="${fieldName}"|data-fs-error="${fieldName}"[^>]*class="[^"]*empty:hidden[^"]*"`),
      `Expected ${fieldName} field error target to stay compact when empty but become visible when Formspree injects text`,
    );
    assert.doesNotMatch(
      source,
      new RegExp(`class="[^"]*(?:^|\\s)hidden(?:\\s|$)[^"]*"[^>]*data-fs-error="${fieldName}"|data-fs-error="${fieldName}"[^>]*class="[^"]*(?:^|\\s)hidden(?:\\s|$)[^"]*"`),
      `Expected ${fieldName} field error target to avoid a hard hidden class that Formspree cannot remove`,
    );
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
    "We've received your project details. Our team will review them and get back to you within 24 hours on business days.",
    "If your request is urgent, feel free to contact us via WhatsApp or email.",
  ]) {
    assert.match(source, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(
    source,
    /const unavailableSubmitLabel = "Inquiry Form Unavailable";/,
    "Expected a dedicated unavailable label instead of reusing the submitting label",
  );

  assert.match(
    source,
    /const setButtonState = \(\{ disabled, label \}\) => \{/,
    "Expected button state handling to distinguish disabled state from displayed label",
  );

  assert.match(
    source,
    /setButtonState\(\{[\s\S]*disabled: isSubmitting,[\s\S]*label: isSubmitting \? "Submitting\.\.\." : defaultSubmitLabel,[\s\S]*\}\);/,
    "Expected active submission state to be the only path that shows Submitting...",
  );

  assert.match(
    source,
    /if \(!formId\) \{[\s\S]*showError\("Form configuration is missing: PUBLIC_FORMSPREE_FORM_ID\."\);[\s\S]*setButtonState\(\{ disabled: true, label: unavailableSubmitLabel \}\);/,
    "Expected missing PUBLIC_FORMSPREE_FORM_ID to disable the button with an unavailable label",
  );
});

test("package test script includes the contact regression in the standard test path", () => {
  const packageSource = readSource("package.json");

  assert.match(
    packageSource,
    /"test":\s*"node --test --test-concurrency=1[\s\S]*tests\/contact-form-integration\.test\.mjs[\s\S]*tests\/seo-foundation\.test\.mjs"/,
    "Expected pnpm test to run the contact regression with the existing package-level tests",
  );
});
