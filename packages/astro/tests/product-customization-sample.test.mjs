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

  const backingOptionsGroup = manifest.customizationGroups?.find(
    ({ sourceKey }) => sourceKey === "patches-customization-backing-options",
  );

  assert.ok(backingOptionsGroup, "Expected representative backing options group");
  assert.equal(backingOptionsGroup.blocks.length, 1);
  assert.equal(backingOptionsGroup.blocks[0]._type, "entryListBlock");

  const backingBlock = backingOptionsGroup.blocks[0];

  assert.equal(backingBlock.markerStyle, "plain");
  assert.ok(Array.isArray(backingBlock.entries));

  const sewOnEntry = backingBlock.entries.find(
    ({ title }) => title === "Sew-On Backing",
  );

  assert.ok(sewOnEntry, "Expected Sew-On Backing structured entry");
  assert.deepEqual(sewOnEntry.paragraphs, [
    "Sew-on patches are stitched directly onto garments using a sewing machine or hand stitching.",
    "Sew-on patches are considered the most reliable option for patches for clothing.",
  ]);

  const sewOnAdvantages = sewOnEntry.detailGroups?.find(
    ({ label }) => label === "Advantages",
  );

  assert.ok(sewOnAdvantages, "Expected Advantages detail group on Sew-On Backing entry");
  assert.equal(sewOnAdvantages.markerStyle, "bullet");
  assert.deepEqual(sewOnAdvantages.items, [
    "Strongest and most durable attachment",
    "Suitable for repeated washing",
    "Works on almost all fabrics",
  ]);

  const patchSizeGroup = manifest.customizationGroups?.find(
    ({ sourceKey }) => sourceKey === "patches-customization-size-shape",
  );

  assert.ok(patchSizeGroup, "Expected representative patch size and shape group");

  const customPatchSizesBlock = patchSizeGroup.blocks.find(
    ({ title }) => title === "Custom Patch Sizes",
  );

  assert.ok(customPatchSizesBlock, "Expected Custom Patch Sizes structured block");
  assert.equal(customPatchSizesBlock._type, "entryListBlock");
  assert.equal(customPatchSizesBlock.markerStyle, "plain");
  assert.deepEqual(customPatchSizesBlock.entries[0].paragraphs, [
    "Patches can be produced in a wide range of sizes depending on the product and logo design.",
    "Choosing the right size ensures that the patch remains visible while maintaining a balanced look on the garment.",
  ]);

  const commonPatchSizes = customPatchSizesBlock.entries[0].detailGroups?.find(
    ({ label }) => label === "Common Patch Sizes",
  );

  assert.ok(
    commonPatchSizes,
    "Expected Common Patch Sizes detail group on Custom Patch Sizes block",
  );
  assert.deepEqual(commonPatchSizes.items, [
    "Small patches (2–5 cm)",
    "Medium patches (5–8 cm)",
    "Large patches (8–12 cm or larger)",
  ]);

  const customPatchSizeApplications = customPatchSizesBlock.entries[0].detailGroups?.find(
    ({ label }) => label === "Best Applications",
  );

  assert.ok(
    customPatchSizeApplications,
    "Expected Best Applications detail group on Custom Patch Sizes block",
  );
  assert.deepEqual(customPatchSizeApplications.items, [
    "Small patches — hats, caps, labels",
    "Medium patches — sleeves, chest logos",
    "Large patches — jacket backs and statement designs",
  ]);

  const roundedCornersBlock = patchSizeGroup.blocks.find(
    ({ title }) => title === "Rounded Corners & Edge Finishing",
  );

  assert.ok(roundedCornersBlock, "Expected Rounded Corners & Edge Finishing structured block");
  assert.equal(roundedCornersBlock._type, "entryListBlock");

  const roundedCornersEntry = roundedCornersBlock.entries[0];

  assert.deepEqual(roundedCornersEntry.paragraphs, [
    "Rounded corners and smooth edges can improve the comfort and durability of patches.",
    "This option is often recommended for patches that will be used on garments and hats.",
  ]);

  const customDieCutBlock = patchSizeGroup.blocks.find(
    ({ title }) => title === "Custom Die-Cut Shapes",
  );

  assert.ok(customDieCutBlock, "Expected Custom Die-Cut Shapes structured block");
  assert.equal(customDieCutBlock._type, "entryListBlock");

  const customDieCutFeatures = customDieCutBlock.entries[0].detailGroups?.find(
    ({ label }) => label === "Features",
  );

  assert.ok(
    customDieCutFeatures,
    "Expected Features detail group on Custom Die-Cut Shapes block",
  );
  assert.deepEqual(customDieCutFeatures.items, [
    "unique and creative patch shapes",
    "stronger brand recognition",
    "more distinctive product appearance",
  ]);

  const customDieCutApplications = customDieCutBlock.entries[0].detailGroups?.find(
    ({ label }) => label === "Best Applications",
  );

  assert.ok(
    customDieCutApplications,
    "Expected Best Applications detail group on Custom Die-Cut Shapes block",
  );
  assert.deepEqual(customDieCutApplications.items, [
    "fashion brands",
    "streetwear labels",
    "promotional patches",
    "creative apparel designs",
  ]);

  const ironOnEntry = backingBlock.entries.find(
    ({ title }) => title === "Iron-On Backing",
  );

  assert.ok(ironOnEntry, "Expected Iron-On Backing structured entry");

  const ironOnAdvantages = ironOnEntry.detailGroups?.find(
    ({ label }) => label === "Advantages",
  );

  assert.ok(ironOnAdvantages, "Expected Advantages detail group on Iron-On Backing entry");
  assert.deepEqual(ironOnAdvantages.items, [
    "quick application",
    "no sewing required",
    "suitable for DIY or small runs",
  ]);

  const roundedCornerAdvantages = roundedCornersEntry.detailGroups?.find(
    ({ label }) => label === "Advantages",
  );

  assert.ok(
    roundedCornerAdvantages,
    "Expected Advantages detail group on Rounded Corners & Edge Finishing block",
  );
  assert.deepEqual(roundedCornerAdvantages.items, [
    "reduces sharp edges",
    "improves sewing durability",
    "provides a cleaner visual appearance",
  ]);
});
