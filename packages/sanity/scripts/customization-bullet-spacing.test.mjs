import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeBulletSpacingInString,
  normalizeCustomizationBulletSpacing,
} from "./customization-bullet-spacing.mjs";

test("normalizeBulletSpacingInString adds one space after leading bullets", () => {
  assert.equal(normalizeBulletSpacingInString("•Title"), "• Title");
  assert.equal(
    normalizeBulletSpacingInString("Line one\n•Item A\n  •Item B"),
    "Line one\n• Item A\n  • Item B",
  );
  assert.equal(normalizeBulletSpacingInString("• Already spaced"), "• Already spaced");
  assert.equal(normalizeBulletSpacingInString("No bullet here"), "No bullet here");
});

test("normalizeCustomizationBulletSpacing rewrites nested customization data", () => {
  const source = [
    {
      title: "•Merrow Border",
      note: "Paragraph\n•Best for hats",
      detailGroups: [
        {
          label: "Best Applications",
          items: ["•embroidered patches", "uniform patches"],
        },
      ],
    },
  ];

  const result = normalizeCustomizationBulletSpacing(source, "customizationGroups");

  assert.equal(result.changes.length, 3);
  assert.deepEqual(
    result.changes.map(({ path }) => path),
    [
      "customizationGroups[0].title",
      "customizationGroups[0].note",
      "customizationGroups[0].detailGroups[0].items[0]",
    ],
  );
  assert.deepEqual(result.value, [
    {
      title: "• Merrow Border",
      note: "Paragraph\n• Best for hats",
      detailGroups: [
        {
          label: "Best Applications",
          items: ["• embroidered patches", "uniform patches"],
        },
      ],
    },
  ]);
});
