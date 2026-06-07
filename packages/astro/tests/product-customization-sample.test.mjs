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
  assert.equal(borderOptionsGroup.blocks.length, 16);
  assert.ok(
    borderOptionsGroup.blocks.every((block) => block._type === "listBlock"),
  );

  const merrowBorderBlock = borderOptionsGroup.blocks.find(
    ({ title }) => title === "Merrow Border",
  );

  assert.ok(merrowBorderBlock, "Expected representative Merrow Border block");
  assert.equal(merrowBorderBlock._type, "listBlock");
  assert.equal(merrowBorderBlock.markerStyle, "plain");
  assert.equal(
    merrowBorderBlock.intro,
    "A merrow border is created using a special overlock stitching machine that wraps thick thread around the edge of the patch. This stitching forms a rounded and raised edge that protects the patch from fraying.",
  );

  const bestApplicationsGroup = borderOptionsGroup.blocks.find(
    ({ title }) => title === "Best Applications",
  );

  assert.ok(
    bestApplicationsGroup,
    "Expected Best Applications detail block on representative entry",
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
  assert.equal(backingOptionsGroup.blocks.length, 20);
  assert.ok(
    backingOptionsGroup.blocks.every((block) => block._type === "listBlock"),
  );

  const sewOnEntry = backingOptionsGroup.blocks.find(
    ({ title }) => title === "Sew-On Backing",
  );

  assert.ok(sewOnEntry, "Expected Sew-On Backing structured block");
  assert.equal(sewOnEntry._type, "listBlock");
  assert.equal(
    sewOnEntry.intro,
    "Sew-on patches are stitched directly onto garments using a sewing machine or hand stitching.\n\nSew-on patches are considered the most reliable option for patches for clothing.",
  );

  const sewOnAdvantages = backingOptionsGroup.blocks.find(
    ({ title }) => title === "Advantages",
  );

  assert.ok(sewOnAdvantages, "Expected Advantages detail block on Sew-On Backing entry");
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
  assert.ok(
    patchSizeGroup.blocks.every((block) => block._type === "listBlock"),
  );

  const customPatchSizesBlock = patchSizeGroup.blocks.find(
    ({ title }) => title === "Custom Patch Sizes",
  );

  assert.ok(customPatchSizesBlock, "Expected Custom Patch Sizes structured block");
  assert.equal(customPatchSizesBlock._type, "listBlock");
  assert.equal(customPatchSizesBlock.markerStyle, "plain");
  assert.equal(
    customPatchSizesBlock.intro,
    "Patches can be produced in a wide range of sizes depending on the product and logo design.\n\nChoosing the right size ensures that the patch remains visible while maintaining a balanced look on the garment.",
  );

  const commonPatchSizes = patchSizeGroup.blocks.find(
    ({ title }) => title === "Common Patch Sizes",
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

  const customPatchSizeApplications = patchSizeGroup.blocks.find(
    ({ title }) => title === "Best Applications",
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
  assert.equal(roundedCornersBlock._type, "listBlock");
  assert.equal(
    roundedCornersBlock.intro,
    "Rounded corners and smooth edges can improve the comfort and durability of patches.\n\nThis option is often recommended for patches that will be used on garments and hats.",
  );

  const customDieCutBlock = patchSizeGroup.blocks.find(
    ({ title }) => title === "Custom Die-Cut Shapes",
  );

  assert.ok(customDieCutBlock, "Expected Custom Die-Cut Shapes structured block");
  assert.equal(customDieCutBlock._type, "listBlock");

  const customDieCutFeatures = patchSizeGroup.blocks.find(
    ({ title }) => title === "Features",
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

  const customDieCutApplications = patchSizeGroup.blocks.find(
    ({ title }) => title === "Best Applications" && Array.isArray(title),
  );
  const customDieCutApplicationsBlock = patchSizeGroup.blocks.find(
    (block) =>
      block.title === "Best Applications"
      && block.items?.includes("creative apparel designs"),
  );

  assert.ok(
    customDieCutApplicationsBlock,
    "Expected Best Applications detail block on Custom Die-Cut Shapes block",
  );
  assert.deepEqual(customDieCutApplicationsBlock.items, [
    "fashion brands",
    "streetwear labels",
    "promotional patches",
    "creative apparel designs",
  ]);

  const ironOnEntry = backingOptionsGroup.blocks.find(
    ({ title }) => title === "Iron-On Backing",
  );

  assert.ok(ironOnEntry, "Expected Iron-On Backing structured block");

  const ironOnAdvantages = backingOptionsGroup.blocks.find(
    (block) =>
      block.title === "Advantages"
      && block.items?.includes("quick application"),
  );

  assert.ok(ironOnAdvantages, "Expected Advantages detail block on Iron-On Backing entry");
  assert.deepEqual(ironOnAdvantages.items, [
    "quick application",
    "no sewing required",
    "suitable for DIY or small runs",
  ]);

  const roundedCornerAdvantages = patchSizeGroup.blocks.find(
    (block) =>
      block.title === "Advantages"
      && block.items?.includes("provides a cleaner visual appearance"),
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
