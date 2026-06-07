import assert from "node:assert/strict";
import test from "node:test";

test("seed customization validation rejects malformed structured blocks", async () => {
  const { validateCustomizationBlock } = await import(
    "../../sanity/scripts/customization-block-validation.ts"
  );

  assert.deepEqual(
    validateCustomizationBlock(
      {
        _type: "listBlock",
        markerStyle: "bullet",
        items: ["Classic stitched edge"],
        note: "Structured blocks may still carry a trailing note.",
      },
      "customizationGroups[0].blocks[0]",
    ),
    [],
  );

  assert.deepEqual(
    validateCustomizationBlock(
      {
        _type: "listBlock",
        items: [],
      },
      "customizationGroups[0].blocks[1]",
    ),
    [
      'customizationGroups[0].blocks[1].markerStyle must be "bullet", "number", or "plain"',
      "customizationGroups[0].blocks[1] must include intro, note, or at least one list item",
    ],
  );

  assert.deepEqual(
    validateCustomizationBlock(
      {
        _type: "listBlock",
        markerStyle: "plain",
        intro: "Die-Cut Border",
      },
      "customizationGroups[0].blocks[2]",
    ),
    [],
  );

  assert.deepEqual(
    validateCustomizationBlock(
      {
        _type: "entryListBlock",
        markerStyle: "plain",
        entries: [],
      },
      "customizationGroups[0].blocks[3]",
    ),
    [
      'customizationGroups[0].blocks[3]._type must be "paragraphBlock" or "listBlock"',
    ],
  );
});
