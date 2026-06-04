import assert from "node:assert/strict";
import test from "node:test";

test("customization migration rewrites persisted legacy blocks to structured blocks", async () => {
  const { normalizeCustomizationGroupsForMigration } = await import(
    "../../sanity/scripts/migrate-customization-blocks.ts"
  );

  const inputGroups = [
    {
      _key: "group-1",
      title: "Materials",
      blocks: [
        {
          _key: "legacy-block",
          _type: "customizationBlock",
          title: "Paper",
          items: ["Cotton paper", "Kraft paper"],
          note: "Old persisted list block",
        },
        {
          _key: "structured-block",
          _type: "paragraphBlock",
          text: "Already migrated",
        },
      ],
    },
  ];

  const { groups, migratedBlockCount } =
    normalizeCustomizationGroupsForMigration(inputGroups);

  assert.equal(migratedBlockCount, 1);
  assert.deepEqual(groups, [
    {
      _key: "group-1",
      title: "Materials",
      blocks: [
        {
          _key: "legacy-block",
          _type: "listBlock",
          title: "Paper",
          markerStyle: "bullet",
          items: ["Cotton paper", "Kraft paper"],
          note: "Old persisted list block",
        },
        {
          _key: "structured-block",
          _type: "paragraphBlock",
          text: "Already migrated",
        },
      ],
    },
  ]);
});
