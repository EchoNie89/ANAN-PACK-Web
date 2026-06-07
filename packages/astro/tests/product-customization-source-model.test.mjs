import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const productsDir = new URL("../../sanity/import-data/products/", import.meta.url);

test("product manifests use explicit customization block types", async () => {
  const productFiles = readdirSync(productsDir).filter(
    (file) => file.endsWith(".ts") && file !== "types.ts",
  );
  const legacyBlocks = [];

  for (const file of productFiles) {
    const manifestModule = await import(pathToFileURL(path.join(productsDir.pathname, file)).href);
    const manifest = manifestModule.default;

    for (const group of manifest.customizationGroups ?? []) {
      for (const block of group.blocks ?? []) {
        if (!block._type) {
          legacyBlocks.push(`${file}:${group.sourceKey}:${block.title ?? "(untitled block)"}`);
        }
        if (block._type === "entryListBlock") {
          legacyBlocks.push(`${file}:${group.sourceKey}:${block.title ?? "(entry list block)"}`);
        }
      }
    }
  }

  assert.deepEqual(legacyBlocks, []);
});

test("local product source pages use explicit customization block types", async () => {
  const { productSourcePages } = await import("../src/data/product-source.ts");
  const legacyBlocks = [];

  for (const page of productSourcePages) {
    for (const group of page.customizationGroups ?? []) {
      for (const block of group.blocks ?? []) {
        if (!block._type) {
          legacyBlocks.push(`${page.slug}:${group.title}:${block.title ?? "(untitled block)"}`);
        }
        if (block._type === "entryListBlock") {
          legacyBlocks.push(`${page.slug}:${group.title}:${block.title ?? "(entry list block)"}`);
        }
      }
    }
  }

  assert.deepEqual(legacyBlocks, []);
});
