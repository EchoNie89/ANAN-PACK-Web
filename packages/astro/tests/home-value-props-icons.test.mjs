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

test("home value props use dedicated Figma icon assets", () => {
  const source = readSource("src/data/home.ts");

  for (const assetName of [
    "icons/icon-low-moq.svg",
    "icons/icon-rapid-sampling.svg",
    "icons/icon-factory-pricing.svg",
    "icons/icon-eco-certified.svg",
  ]) {
    assert.match(
      source,
      new RegExp(assetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `Expected Home value props to reference ${assetName}`,
    );
  }

  assert.match(
    source,
    /export const valueProps = \[\s*\{\s*icon: \{/s,
    "Expected Home value props to use structured icon image data",
  );
});

test("icon feature supports image-based icons for Figma-matched sections", () => {
  const source = readSource("src/components/ui/IconFeature.astro");

  assert.match(source, /import LocalImage from "\.\/LocalImage\.astro";/);
  assert.match(source, /import type \{ SiteImageSource \} from "\.\.\/\.\.\/lib\/local-images";/);
  assert.match(source, /interface IconImage \{/);
  assert.match(source, /icon: IconToken \| IconImage;/);
  assert.match(source, /typeof icon === "string"/);
  assert.match(source, /<LocalImage/);
});
