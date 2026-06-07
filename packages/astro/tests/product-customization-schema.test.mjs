import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("customization schemas register the new block union", () => {
  const groupSource = readSource("../sanity/sanity/schemas/customizationGroup.ts");
  const indexSource = readSource("../sanity/sanity/schemas/index.ts");
  const listBlockSource = readSource("../sanity/sanity/schemas/customizationListBlock.ts");
  const legacySchemaUrl = new URL("../sanity/sanity/schemas/customizationBlock.ts", import.meta.url);
  const entryListSchemaUrl = new URL("../sanity/sanity/schemas/customizationEntryListBlock.ts", import.meta.url);
  const entrySchemaUrl = new URL("../sanity/sanity/schemas/customizationEntry.ts", import.meta.url);
  const detailGroupSchemaUrl = new URL("../sanity/sanity/schemas/customizationDetailGroup.ts", import.meta.url);

  assert.match(groupSource, /name:\s*'figmaNodeId'/);
  assert.match(groupSource, /of:\s*\[\s*\{ type: 'paragraphBlock' \},/);
  assert.match(groupSource, /\{ type: 'listBlock' \}/);
  assert.doesNotMatch(
    groupSource,
    /\{ type: 'entryListBlock' \}/,
    "Expected Customization Group content blocks to stop exposing Entry List Block in Studio",
  );
  assert.doesNotMatch(groupSource, /\{ type: 'customizationBlock' \}/);

  assert.match(indexSource, /import customizationParagraphBlock from '\.\/customizationParagraphBlock';/);
  assert.match(indexSource, /import customizationListBlock from '\.\/customizationListBlock';/);
  assert.doesNotMatch(indexSource, /import customizationEntryListBlock from '\.\/customizationEntryListBlock';/);
  assert.doesNotMatch(indexSource, /import customizationEntry from '\.\/customizationEntry';/);
  assert.doesNotMatch(indexSource, /import customizationDetailGroup from '\.\/customizationDetailGroup';/);
  assert.doesNotMatch(indexSource, /import customizationBlock from '\.\/customizationBlock';/);
  assert.match(listBlockSource, /name:\s*'intro'/);
  assert.doesNotMatch(
    listBlockSource,
    /name:\s*'items'[\s\S]*?validation:/,
    "Expected List Block items to stay optional in Studio",
  );
  assert.equal(existsSync(legacySchemaUrl), false);
  assert.equal(existsSync(entryListSchemaUrl), false);
  assert.equal(existsSync(entrySchemaUrl), false);
  assert.equal(existsSync(detailGroupSchemaUrl), false);
});
