import assert from "node:assert/strict";
import test from "node:test";

test("patches manifest demonstrates the new customization block model", async () => {
  const { default: manifest } = await import(
    "../../sanity/import-data/products/patches.ts"
  );
  const borderOptionsGroup = manifest.customizationGroups?.find(
    ({ sourceKey }) => sourceKey === "patches-customization-border-options",
  );

  assert.ok(borderOptionsGroup, "Expected a representative migrated border options group");
  assert.equal(borderOptionsGroup.blocks.length, 1);

  const [block] = borderOptionsGroup.blocks;

  assert.equal(block._type, "entryListBlock");
  assert.equal(block.markerStyle, "plain");
  assert.ok(Array.isArray(block.entries));
  assert.ok(block.entries.length >= 4);

  const merrowBorderEntry = block.entries.find(
    ({ title }) => title === "Merrow Border",
  );

  assert.ok(merrowBorderEntry, "Expected representative Merrow Border entry");
  assert.deepEqual(merrowBorderEntry.paragraphs, [
    "A merrow border is created using a special overlock stitching machine that wraps thick thread around the edge of the patch. This stitching forms a rounded and raised edge that protects the patch from fraying.",
  ]);

  const bestApplicationsGroup = merrowBorderEntry.detailGroups?.find(
    ({ label }) => label === "Best Applications",
  );

  assert.ok(
    bestApplicationsGroup,
    "Expected Best Applications detail group on representative entry",
  );
  assert.equal(bestApplicationsGroup.markerStyle, "bullet");
  assert.deepEqual(bestApplicationsGroup.items, [
    "embroidered patches",
    "uniform patches",
    "hat patches",
    "traditional logo patches",
  ]);
  assert.equal(
    bestApplicationsGroup.note,
    "Merrow borders are one of the most common finishes used in embroidered patches for clothing.",
  );
});
