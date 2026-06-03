import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("customization schemas register the new block union", () => {
  const groupSource = readSource("../sanity/sanity/schemas/customizationGroup.ts");
  const indexSource = readSource("../sanity/sanity/schemas/index.ts");

  assert.match(groupSource, /name:\s*'figmaNodeId'/);
  assert.match(groupSource, /of:\s*\[\s*\{ type: 'paragraphBlock' \},/);
  assert.match(groupSource, /\{ type: 'listBlock' \}/);
  assert.match(groupSource, /\{ type: 'entryListBlock' \}/);

  assert.match(indexSource, /import customizationParagraphBlock from '\.\/customizationParagraphBlock';/);
  assert.match(indexSource, /import customizationListBlock from '\.\/customizationListBlock';/);
  assert.match(indexSource, /import customizationEntryListBlock from '\.\/customizationEntryListBlock';/);
  assert.match(indexSource, /import customizationEntry from '\.\/customizationEntry';/);
  assert.match(indexSource, /import customizationDetailGroup from '\.\/customizationDetailGroup';/);

  assert.doesNotMatch(
    indexSource,
    /import customizationBlock from '\.\/customizationBlock';/,
  );
});
