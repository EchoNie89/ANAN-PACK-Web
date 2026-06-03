import assert from "node:assert/strict";
import test from "node:test";

test("seed customization validation rejects malformed structured blocks and keeps broad legacy compatibility", async () => {
  const { validateCustomizationBlockLike } = await import(
    "../../sanity/scripts/customization-block-validation.ts"
  );

  assert.deepEqual(
    validateCustomizationBlockLike(
      {
        items: ["Classic stitched edge"],
        note: "Legacy blocks may still carry a trailing note.",
      },
      "customizationGroups[0].blocks[0]",
    ),
    [],
  );

  assert.deepEqual(
    validateCustomizationBlockLike(
      {
        _type: "listBlock",
        items: [],
      },
      "customizationGroups[0].blocks[1]",
    ),
    [
      'customizationGroups[0].blocks[1].markerStyle must be "bullet", "number", or "plain"',
      "customizationGroups[0].blocks[1].items must include at least one item",
    ],
  );

  assert.deepEqual(
    validateCustomizationBlockLike(
      {
        _type: "entryListBlock",
        markerStyle: "plain",
        entries: [
          {
            title: "Die-Cut Border",
            detailGroups: [
              {
                label: "Best Applications",
                markerStyle: "bullet",
                items: [],
              },
            ],
          },
        ],
      },
      "customizationGroups[0].blocks[2]",
    ),
    [
      "customizationGroups[0].blocks[2].entries[0].detailGroups[0].items must include at least one item",
    ],
  );
});
