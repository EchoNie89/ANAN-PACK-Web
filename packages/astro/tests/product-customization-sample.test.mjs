import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("patches manifest demonstrates the new customization block model", () => {
  const manifestSource = readSource("../sanity/import-data/products/patches.ts");

  assert.match(manifestSource, /_type:\s*"entryListBlock"/);
  assert.match(manifestSource, /markerStyle:\s*"plain"|markerStyle:\s*"number"/);
  assert.match(manifestSource, /detailGroups:/);
  assert.match(manifestSource, /label:\s*"Best Applications"/);
  assert.match(manifestSource, /note:/);
});
