import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");

function readSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

function fileSha1(relativePath) {
  return createHash("sha1")
    .update(readFileSync(join(astroDir, relativePath)))
    .digest("hex");
}

test("solution challenge icons keep the shared branches and use the redesigned figma-style strokes", () => {
  const source = readSource("src/components/ui/SolutionLineIcon.astro");
  const stackSource = readSource("public/images/solutions/icons/challenge-stack.svg");
  const sampleSource = readSource("public/images/solutions/icons/challenge-sample.svg");
  const refreshSource = readSource("public/images/solutions/icons/challenge-refresh.svg");
  const chatSource = readSource("public/images/solutions/icons/challenge-chat.svg");

  assert.match(
    source,
    /stack:\s*"\/images\/solutions\/icons\/challenge-stack\.svg"/,
    "Expected the stack icon to use the exported Figma SVG asset",
  );
  assert.match(
    source,
    /sample:\s*"\/images\/solutions\/icons\/challenge-sample\.svg"/,
    "Expected the sample icon to use the exported Figma SVG asset",
  );
  assert.match(
    source,
    /refresh:\s*"\/images\/solutions\/icons\/challenge-refresh\.svg"/,
    "Expected the refresh icon to use the exported Figma SVG asset",
  );
  assert.match(
    source,
    /chat:\s*"\/images\/solutions\/icons\/challenge-chat\.svg"/,
    "Expected the chat icon to use the exported Figma SVG asset",
  );

  assert.match(
    stackSource,
    /M0 0V13\.4733H43\.1147V0H0/,
    "Expected the stack asset to keep the original Figma top-and-bottom bar geometry",
  );
  assert.match(
    stackSource,
    /M0 0H43\.1147V5\.38934H0V0Z/,
    "Expected the stack asset to keep the original Figma center separator geometry",
  );
  assert.match(
    sampleSource,
    /M2\.27539 21\.063V33\.4973C2\.27539 35\.0171/,
    "Expected the sample asset to keep the original Figma logistics icon path",
  );
  assert.match(
    refreshSource,
    /M24\.1211 11\.2918C24\.1211 10\.8561/,
    "Expected the refresh asset to keep the original Figma calibration icon path",
  );
  assert.match(
    chatSource,
    /M31\.6247 11\.5C32\.6413 11\.5 33\.6164 11\.9039/,
    "Expected the chat asset to keep the original Figma overlapping bubbles path",
  );
});

test("home lifestyle challenge cards map to the same figma icon set as the approved design", () => {
  const solutionsSource = readSource("src/data/solutions.ts");

  assert.match(
    solutionsSource,
    /slug:\s*'home-lifestyle'[\s\S]*?icon:\s*'stack'[\s\S]*?icon:\s*'sample'[\s\S]*?icon:\s*'refresh'[\s\S]*?icon:\s*'chat'/,
    "Expected the home lifestyle challenge section to use the Figma icon mapping stack/sample/refresh/chat",
  );
});

test("every solutionImage asset referenced in solutions data has a migrated local source file", () => {
  const solutionsSource = readSource("src/data/solutions.ts");
  const referencedFiles = [...solutionsSource.matchAll(/solutionImage\('([^']+)'\)/g)].map(
    (match) => match[1],
  );

  assert.ok(referencedFiles.length > 0, "Expected solutions data to reference local solution images");

  for (const fileName of referencedFiles) {
    const assetPath = join(astroDir, "src/assets/solutions", fileName);
    assert.ok(
      existsSync(assetPath),
      `Expected migrated asset to exist for solution image ${fileName}`,
    );
  }
});

test("migrated solution source images stay in sync with the public solution image set", () => {
  const publicDir = join(astroDir, "public/images/solutions");
  const publicFiles = readdirSync(publicDir).filter((entry) =>
    statSync(join(publicDir, entry)).isFile()
  );

  assert.ok(publicFiles.length > 0, "Expected public solution images to exist");

  for (const fileName of publicFiles) {
    const publicRelativePath = `public/images/solutions/${fileName}`;
    const assetRelativePath = `src/assets/solutions/${fileName}`;

    assert.ok(
      existsSync(join(astroDir, assetRelativePath)),
      `Expected migrated asset to exist for public solution image ${fileName}`,
    );
    assert.equal(
      fileSha1(assetRelativePath),
      fileSha1(publicRelativePath),
      `Expected migrated asset ${fileName} to match the public solution image`,
    );
  }
});
