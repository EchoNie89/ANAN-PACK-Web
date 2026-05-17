// ─── Load .env ────────────────────────────────────────────────────────────────
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const envPath = resolve(__dirname, "..", ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* .env not found, skip */ }

import { createClient } from "@sanity/client";
import { HttpsProxyAgent } from "https-proxy-agent";
import type {
  ProductImportCard,
  ProductImportGroup,
  ProductImportManifest,
  ProductImportCustomizationGroup,
  ProductImportTextBlock,
} from "../import-data/products/types";

declare const require: any;
declare const process: {
  argv: string[];
  env: Record<string, string | undefined>;
  exit(code?: number): never;
};
declare const __dirname: string;

const fs = require("fs") as {
  existsSync(path: string): boolean;
  readFileSync(path: string): unknown;
  realpathSync: ((path: string) => string) & {
    native?: (path: string) => string;
  };
};
const path = require("path") as {
  basename(filePath: string): string;
  extname(filePath: string): string;
  isAbsolute(filePath: string): boolean;
  join(...paths: string[]): string;
  relative(from: string, to: string): string;
  resolve(...paths: string[]): string;
};
const { pathToFileURL } = require("url") as {
  pathToFileURL(filePath: string): { href: string };
};

type CliArgs = {
  slug: ProductSlug;
  dryRun: boolean;
  forceText: boolean;
};

type ProductSlug =
  | "labels"
  | "patches"
  | "ribbon"
  | "tissue-paper"
  | "tape"
  | "bag"
  | "hanging-tag"
  | "sticker";

type ImportSection = "showcaseGroups" | "applications";

type ResolvedImage = {
  manifestPath: string;
  filePath: string;
};

type ResolvedCard = ProductImportCard & {
  resolvedImagePath: string;
};

type ResolvedGroup = Omit<ProductImportGroup, "cards"> & {
  cards: ResolvedCard[];
};

type ResolvedCustomizationGroup = Omit<ProductImportCustomizationGroup, "images"> & {
  images?: ResolvedCard[];
};

type ValidatedManifest = Omit<
  ProductImportManifest,
  "showcaseGroups" | "applications" | "customizationGroups"
> & {
  showcaseGroups?: ResolvedGroup[];
  applications?: ResolvedCard[];
  customizationGroups?: ResolvedCustomizationGroup[];
};

type SanityImage = {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
};

type ExistingTextFields = {
  title?: string;
  alt?: string;
  description?: string;
};

type ExistingCustomizationGroup = {
  sourceKey?: string;
  title?: string;
  intro?: string;
  images?: Array<ExistingTextFields & { sourceKey?: string; alt?: string; image?: { asset?: { _ref?: string } } }>;
  blocks?: Array<{ title?: string; items?: string[] }>;
};

type ExistingProduct = {
  _id: string;
  _rev: string;
  title?: string;
  applicationTitle?: string;
  applicationDescription?: string;
  showcaseGroups?: Array<{
    sourceKey?: string;
    title?: string;
    cards?: Array<ExistingTextFields & { sourceKey?: string; image?: { asset?: { _ref?: string } } }>;
  }>;
  applications?: Array<ExistingTextFields & { sourceKey?: string; image?: { asset?: { _ref?: string } } }>;
  customizationGroups?: ExistingCustomizationGroup[];
};

type PatchSet = Record<string, unknown>;

const STUDIO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_DIR = path.resolve(STUDIO_ROOT, "import-data/products");
const IMPORT_ASSETS_PRODUCTS_DIR = path.resolve(
  STUDIO_ROOT,
  "import-assets/products"
);
const ASTRO_PUBLIC_DIR = path.resolve(
  STUDIO_ROOT,
  "../tagora-official-site/public"
);
const ASTRO_PUBLIC_IMAGES_DIR = path.resolve(ASTRO_PUBLIC_DIR, "images");
const ALLOWED_PRODUCT_SLUGS = new Set<ProductSlug>([
  "labels",
  "patches",
  "ribbon",
  "tissue-paper",
  "tape",
  "bag",
  "hanging-tag",
  "sticker",
]);
const ALLOWED_IMPORT_SECTIONS = new Set<ImportSection>([
  "showcaseGroups",
  "applications",
  "customizationGroups",
]);
const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
]);
const PROJECT_ID = process.env.SANITY_PROJECT_ID || "44m142o0";
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";

const proxyUrl =
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.http_proxy;

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: process.env.SANITY_TOKEN || "",
  ...(proxyUrl ? { agent: new HttpsProxyAgent(proxyUrl) } : {}),
});

function parseArgs(argv: string[]): CliArgs {
  let slug = "";
  let dryRun = false;
  let forceText = false;

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--slug") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --slug");
      }
      slug = value;
      index += 1;
      continue;
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--force-text") {
      forceText = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!slug) {
    throw new Error("Usage: pnpm exec tsx scripts/seed-products.ts --slug <product-slug> [--dry-run] [--force-text]");
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Invalid --slug. Use lowercase letters, numbers, and hyphens only.");
  }

  if (!isProductSlug(slug)) {
    throw new Error(`Unsupported --slug "${slug}". Allowed values: ${Array.from(ALLOWED_PRODUCT_SLUGS).join(", ")}`);
  }

  return { slug, dryRun, forceText };
}

function isProductSlug(slug: string): slug is ProductSlug {
  return ALLOWED_PRODUCT_SLUGS.has(slug as ProductSlug);
}

function isInsideDirectory(filePath: string, directory: string): boolean {
  const relativePath = path.relative(directory, filePath);

  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
}

function realpathExisting(filePath: string): string {
  const realpath = fs.realpathSync.native || fs.realpathSync;

  return realpath(filePath);
}

async function loadManifest(slug: ProductSlug): Promise<ProductImportManifest> {
  const manifestPath = path.resolve(MANIFEST_DIR, `${slug}.ts`);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  const realManifestDir = realpathExisting(MANIFEST_DIR);
  const realManifestPath = realpathExisting(manifestPath);

  if (!isInsideDirectory(realManifestPath, realManifestDir)) {
    throw new Error(`Manifest path escaped import directory: ${manifestPath}`);
  }

  const moduleUrl = pathToFileURL(realManifestPath).href;
  const module = (await import(moduleUrl)) as { default?: ProductImportManifest };

  if (!module.default) {
    throw new Error(`Manifest must default-export ProductImportManifest: ${manifestPath}`);
  }

  return module.default;
}

function resolveImagePath(imagePath: string, slug: ProductSlug): ResolvedImage {
  const trimmedPath = imagePath.trim();

  if (!trimmedPath) {
    throw new Error("Card imagePath must be non-empty");
  }

  const ext = path.extname(trimmedPath).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    throw new Error(
      `Unsupported image extension for "${imagePath}". Allowed extensions: ${Array.from(ALLOWED_IMAGE_EXTENSIONS).join(", ")}`
    );
  }

  if (trimmedPath.startsWith("/images/")) {
    const resolvedPath = path.resolve(
      ASTRO_PUBLIC_IMAGES_DIR,
      trimmedPath.slice("/images/".length)
    );

    if (!isInsideDirectory(resolvedPath, ASTRO_PUBLIC_IMAGES_DIR)) {
      throw new Error(`Image path escapes Astro public images directory: "${imagePath}"`);
    }

    if (fs.existsSync(resolvedPath)) {
      const realAstroImagesDir = realpathExisting(ASTRO_PUBLIC_IMAGES_DIR);
      const realImagePath = realpathExisting(resolvedPath);

      if (!isInsideDirectory(realImagePath, realAstroImagesDir)) {
        throw new Error(`Image path escapes Astro public images directory: "${imagePath}"`);
      }

      return {
        manifestPath: imagePath,
        filePath: realImagePath,
      };
    }

    throw new Error(
      `Image not found for "${imagePath}". Compatibility /images/... paths resolve under Astro public images.`
    );
  }

  const productAssetDir = path.resolve(IMPORT_ASSETS_PRODUCTS_DIR, slug);
  const resolvedPath = path.isAbsolute(trimmedPath)
    ? path.resolve(trimmedPath)
    : path.resolve(STUDIO_ROOT, trimmedPath);
  const isSafeImportAssetPath =
    !path.isAbsolute(trimmedPath) &&
    isInsideDirectory(resolvedPath, productAssetDir);

  if (!path.isAbsolute(trimmedPath) && !isSafeImportAssetPath) {
    throw new Error(
      `Image path must resolve under import-assets/products/${slug}/ or /images/: "${imagePath}"`
    );
  }

  if (fs.existsSync(resolvedPath)) {
    const realImagePath = realpathExisting(resolvedPath);
    let isContainedInProductAssets = false;
    let isContainedInAstroImages = false;

    if (fs.existsSync(productAssetDir)) {
      isContainedInProductAssets = isInsideDirectory(
        realImagePath,
        realpathExisting(productAssetDir)
      );
    }

    if (
      path.isAbsolute(trimmedPath) &&
      fs.existsSync(ASTRO_PUBLIC_IMAGES_DIR)
    ) {
      isContainedInAstroImages = isInsideDirectory(
        realImagePath,
        realpathExisting(ASTRO_PUBLIC_IMAGES_DIR)
      );
    }

    if (!isContainedInProductAssets && !isContainedInAstroImages) {
      throw new Error(
        `Image path must resolve under import-assets/products/${slug}/ or /images/: "${imagePath}"`
      );
    }

    return {
      manifestPath: imagePath,
      filePath: realImagePath,
    };
  }

  throw new Error(
    `Image not found for "${imagePath}". Preferred path convention: import-assets/products/${slug}/<filename>. Compatibility fallback: /images/... under Astro public.`
  );
}

function validateManifest(
  manifest: ProductImportManifest,
  slug: ProductSlug
): ValidatedManifest {
  const errors: string[] = [];
  const cardSourceKeys = new Set<string>();
  const groupSourceKeys = new Set<string>();
  const sections = new Set<ImportSection>();
  const rawSections = (manifest.sections || []) as string[];

  for (const section of rawSections) {
    if (!ALLOWED_IMPORT_SECTIONS.has(section as ImportSection)) {
      errors.push(`manifest.sections includes unsupported section "${section}"`);
      continue;
    }

    if (sections.has(section as ImportSection)) {
      errors.push(`manifest.sections includes duplicate section "${section}"`);
      continue;
    }

    sections.add(section as ImportSection);
  }

  if (manifest.slug !== slug) {
    errors.push(`manifest.slug "${manifest.slug}" does not match --slug "${slug}"`);
  }

  if (!manifest.title?.trim()) {
    errors.push("manifest.title must be non-empty");
  }

  if (!manifest.sections?.length) {
    errors.push("manifest.sections must include at least one section");
  }

  const resolvedShowcaseGroups: ResolvedGroup[] | undefined = manifest.showcaseGroups?.map(
    (group, groupIndex) => {
      const sourceKey = group.sourceKey?.trim() || "";

      if (!sourceKey) {
        errors.push(`showcaseGroups[${groupIndex}].sourceKey must be non-empty`);
      } else if (groupSourceKeys.has(sourceKey)) {
        errors.push(`showcaseGroups[${groupIndex}].sourceKey "${sourceKey}" is duplicated`);
      } else {
        groupSourceKeys.add(sourceKey);
      }

      if (!group.title?.trim()) {
        errors.push(`showcaseGroups[${groupIndex}].title must be non-empty`);
      }

      if (!group.cards?.length) {
        errors.push(`showcaseGroups[${groupIndex}].cards must include at least one card`);
      }

      const cards = (group.cards || []).map((card, cardIndex) =>
        validateAndResolveCard(
          card,
          `showcaseGroups[${groupIndex}].cards[${cardIndex}]`,
          slug,
          cardSourceKeys,
          errors
        )
      );

      return {
        ...group,
        sourceKey,
        cards,
      };
    }
  );

  const resolvedApplications: ResolvedCard[] | undefined = manifest.applications?.map(
    (card, cardIndex) =>
      validateAndResolveCard(
        card,
        `applications[${cardIndex}]`,
        slug,
        cardSourceKeys,
        errors
      )
  );

  if (sections.has("showcaseGroups") && !resolvedShowcaseGroups?.length) {
    errors.push('manifest.sections includes "showcaseGroups", but showcaseGroups is missing or empty');
  }

  if (sections.has("applications") && !resolvedApplications?.length) {
    errors.push('manifest.sections includes "applications", but applications is missing or empty');
  }

  // Validate customizationGroups
  const resolvedCustomizationGroups: ResolvedCustomizationGroup[] | undefined = manifest.customizationGroups?.map(
    (group, groupIndex) => {
      const sourceKey = group.sourceKey?.trim() || "";

      if (!sourceKey) {
        errors.push(`customizationGroups[${groupIndex}].sourceKey must be non-empty`);
      } else if (groupSourceKeys.has(sourceKey)) {
        errors.push(`customizationGroups[${groupIndex}].sourceKey "${sourceKey}" is duplicated`);
      } else {
        groupSourceKeys.add(sourceKey);
      }

      if (!group.title?.trim()) {
        errors.push(`customizationGroups[${groupIndex}].title must be non-empty`);
      }

      if (!group.blocks?.length) {
        errors.push(`customizationGroups[${groupIndex}].blocks must include at least one block`);
      }

      const images = (group.images || []).map((img, imgIndex) =>
        validateAndResolveCard(
          img,
          `customizationGroups[${groupIndex}].images[${imgIndex}]`,
          slug,
          cardSourceKeys,
          errors
        )
      );

      return {
        ...group,
        sourceKey,
        images: images.length ? images : undefined,
      };
    }
  );

  if (sections.has("customizationGroups") && !resolvedCustomizationGroups?.length) {
    errors.push('manifest.sections includes "customizationGroups", but customizationGroups is missing or empty');
  }

  const importedImageCardCount =
    (sections.has("showcaseGroups")
      ? (resolvedShowcaseGroups || []).reduce(
          (count, group) => count + group.cards.length,
          0
        )
      : 0) + (sections.has("applications") ? resolvedApplications?.length || 0 : 0)
      + (sections.has("customizationGroups")
        ? (resolvedCustomizationGroups || []).reduce(
            (count, group) => count + (group.images?.length || 0),
            0
          )
        : 0);

  if (importedImageCardCount === 0) {
    errors.push("Manifest must include at least one image card across imported sections");
  }

  if (errors.length > 0) {
    throw new Error(`Manifest validation failed:\n- ${errors.join("\n- ")}`);
  }

  return {
    ...manifest,
    showcaseGroups: resolvedShowcaseGroups,
    applications: resolvedApplications,
    customizationGroups: resolvedCustomizationGroups,
  };
}

function validateAndResolveCard(
  card: ProductImportCard,
  label: string,
  slug: ProductSlug,
  sourceKeys: Set<string>,
  errors: string[]
): ResolvedCard {
  const sourceKey = card.sourceKey?.trim() || "";

  if (!sourceKey) {
    errors.push(`${label}.sourceKey must be non-empty`);
  } else if (sourceKeys.has(sourceKey)) {
    errors.push(`${label}.sourceKey "${sourceKey}" is duplicated`);
  } else {
    sourceKeys.add(sourceKey);
  }

  if (!card.title?.trim()) {
    errors.push(`${label}.title must be non-empty`);
  }

  if (!card.alt?.trim()) {
    errors.push(`${label}.alt must be non-empty`);
  }

  try {
    const resolvedImage = resolveImagePath(card.imagePath, slug);
    return {
      ...card,
      sourceKey,
      resolvedImagePath: resolvedImage.filePath,
    };
  } catch (error) {
    errors.push(`${label}.${(error as Error).message}`);
    return {
      ...card,
      sourceKey,
      resolvedImagePath: "",
    };
  }
}

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".jpg" || ext === ".jpeg") {
    return "image/jpeg";
  }

  if (ext === ".webp") {
    return "image/webp";
  }

  if (ext === ".gif") {
    return "image/gif";
  }

  if (ext === ".svg") {
    return "image/svg+xml";
  }

  return "image/png";
}

function stableKey(sourceKey: string): string {
  const slug = sourceKey
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  let hash = 0;

  for (let index = 0; index < sourceKey.length; index += 1) {
    hash = (hash * 31 + sourceKey.charCodeAt(index)) >>> 0;
  }

  return `${slug || "imported-item"}-${hash.toString(36)}`;
}

function keepExistingText(
  existingValue: string | undefined,
  manifestValue: string | undefined,
  forceText: boolean
): string | undefined {
  // Preserve editor-owned Sanity text when it is non-empty. Empty or whitespace-only
  // strings are treated as unfilled and may be replaced by manifest text.
  if (!forceText && existingValue?.trim()) {
    return existingValue;
  }

  return manifestValue;
}

function indexCardsBySourceKey(
  cards: Array<ExistingTextFields & { sourceKey?: string }> | undefined
): Map<string, ExistingTextFields> {
  const bySourceKey = new Map<string, ExistingTextFields>();

  for (const card of cards || []) {
    const sourceKey = card.sourceKey?.trim();

    if (sourceKey) {
      bySourceKey.set(sourceKey, card);
    }
  }

  return bySourceKey;
}

function indexGroupsBySourceKey(
  groups: ExistingProduct["showcaseGroups"]
): Map<string, NonNullable<ExistingProduct["showcaseGroups"]>[number]> {
  const bySourceKey = new Map<string, NonNullable<ExistingProduct["showcaseGroups"]>[number]>();

  for (const group of groups || []) {
    const sourceKey = group.sourceKey?.trim();

    if (sourceKey) {
      bySourceKey.set(sourceKey, group);
    }
  }

  return bySourceKey;
}

type ExistingCardWithImage = {
  sourceKey?: string;
  image?: { asset?: { _ref?: string } };
};

type ExistingGroupWithImages = {
  sourceKey?: string;
  cards?: ExistingCardWithImage[];
};

type ExistingProductWithImages = {
  _id: string;
  _rev: string;
  title?: string;
  applicationTitle?: string;
  applicationDescription?: string;
  showcaseGroups?: ExistingGroupWithImages[];
  applications?: ExistingCardWithImage[];
};

/**
 * Build a map from resolvedImagePath -> existing Sanity asset _id
 * by matching manifest cards to existing product cards via sourceKey.
 */
function buildExistingAssetMap(
  manifest: ValidatedManifest,
  existingProduct: ExistingProductWithImages | null
): Map<string, string> {
  const map = new Map<string, string>();

  if (!existingProduct) return map;

  // Index existing showcase cards by sourceKey
  const existingShowcaseCards = new Map<string, ExistingCardWithImage>();
  for (const group of existingProduct.showcaseGroups || []) {
    for (const card of group.cards || []) {
      const key = card.sourceKey?.trim();
      if (key) existingShowcaseCards.set(key, card);
    }
  }

  // Match manifest showcase cards
  if (manifest.sections.includes("showcaseGroups")) {
    for (const group of manifest.showcaseGroups || []) {
      for (const card of group.cards) {
        const existing = existingShowcaseCards.get(card.sourceKey);
        const ref = existing?.image?.asset?._ref;
        if (ref) {
          map.set(card.resolvedImagePath, ref);
        }
      }
    }
  }

  // Index existing application cards by sourceKey
  const existingAppCards = new Map<string, ExistingCardWithImage>();
  for (const card of existingProduct.applications || []) {
    const key = card.sourceKey?.trim();
    if (key) existingAppCards.set(key, card);
  }

  // Match manifest application cards
  if (manifest.sections.includes("applications")) {
    for (const card of manifest.applications || []) {
      const existing = existingAppCards.get(card.sourceKey);
      const ref = existing?.image?.asset?._ref;
      if (ref) {
        map.set(card.resolvedImagePath, ref);
      }
    }
  }

  // Index existing customization group images by sourceKey
  const existingCustomizationImages = new Map<string, ExistingCardWithImage>();
  for (const group of existingProduct.customizationGroups || []) {
    for (const img of group.images || []) {
      const key = img.sourceKey?.trim();
      if (key) existingCustomizationImages.set(key, img);
    }
  }

  // Match manifest customization group images
  if (manifest.sections.includes("customizationGroups")) {
    for (const group of manifest.customizationGroups || []) {
      for (const img of group.images || []) {
        const existing = existingCustomizationImages.get(img.sourceKey);
        const ref = existing?.image?.asset?._ref;
        if (ref) {
          map.set(img.resolvedImagePath, ref);
        }
      }
    }
  }

  return map;
}

async function uploadImages(
  manifest: ValidatedManifest,
  existingAssetMap: Map<string, string>
): Promise<Map<string, string>> {
  const imagePaths = new Set<string>();

  if (manifest.sections.includes("showcaseGroups")) {
    for (const group of manifest.showcaseGroups || []) {
      for (const card of group.cards) {
        imagePaths.add(card.resolvedImagePath);
      }
    }
  }

  if (manifest.sections.includes("applications")) {
    for (const card of manifest.applications || []) {
      imagePaths.add(card.resolvedImagePath);
    }
  }

  if (manifest.sections.includes("customizationGroups")) {
    for (const group of manifest.customizationGroups || []) {
      for (const img of group.images || []) {
        imagePaths.add(img.resolvedImagePath);
      }
    }
  }

  const uploadedAssets = new Map<string, string>();
  let skipped = 0;
  let uploaded = 0;

  for (const imagePath of imagePaths) {
    const existingRef = existingAssetMap.get(imagePath);

    if (existingRef) {
      uploadedAssets.set(imagePath, existingRef);
      skipped++;
      console.log(`Skipped (already exists) ${path.basename(imagePath)} -> ${existingRef}`);
      continue;
    }

    const asset = await client.assets.upload("image", fs.readFileSync(imagePath), {
      contentType: contentTypeFor(imagePath),
      filename: path.basename(imagePath),
    });
    uploadedAssets.set(imagePath, asset._id);
    uploaded++;
    console.log(`Uploaded ${imagePath} -> ${asset._id}`);
  }

  console.log(`Image summary: ${uploaded} uploaded, ${skipped} skipped (already exist)`);
  return uploadedAssets;
}

function imageRef(assetId: string): SanityImage {
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetId,
    },
  };
}

function buildShowcaseGroups(
  manifest: ValidatedManifest,
  existingProduct: ExistingProduct | null,
  uploadedAssets: Map<string, string>,
  forceText: boolean
) {
  const existingGroups = indexGroupsBySourceKey(existingProduct?.showcaseGroups);

  return (manifest.showcaseGroups || []).map((group) => {
    const existingGroup = existingGroups.get(group.sourceKey);
    const existingCards = indexCardsBySourceKey(existingGroup?.cards);

    return {
      _key: stableKey(group.sourceKey),
      _type: "showcaseGroup",
      sourceKey: group.sourceKey,
      ...(group.figmaNodeId ? { figmaNodeId: group.figmaNodeId } : {}),
      title: keepExistingText(existingGroup?.title, group.title, forceText),
      cards: group.cards.map((card) => {
        const existingCard = existingCards.get(card.sourceKey);
        const assetId = uploadedAssets.get(card.resolvedImagePath);

        if (!assetId) {
          throw new Error(`Missing uploaded asset for ${card.imagePath}`);
        }

        return {
          _key: stableKey(card.sourceKey),
          _type: "showcaseCard",
          sourceKey: card.sourceKey,
          ...(card.figmaNodeId ? { figmaNodeId: card.figmaNodeId } : {}),
          title: keepExistingText(existingCard?.title, card.title, forceText),
          image: imageRef(assetId),
          alt: keepExistingText(existingCard?.alt, card.alt, forceText),
          ...(keepExistingText(existingCard?.description, card.description, forceText)
            ? {
                description: keepExistingText(
                  existingCard?.description,
                  card.description,
                  forceText
                ),
              }
            : {}),
        };
      }),
    };
  });
}

function buildApplications(
  manifest: ValidatedManifest,
  existingProduct: ExistingProduct | null,
  uploadedAssets: Map<string, string>,
  forceText: boolean
) {
  const existingCards = indexCardsBySourceKey(existingProduct?.applications);

  return (manifest.applications || []).map((card) => {
    const existingCard = existingCards.get(card.sourceKey);
    const assetId = uploadedAssets.get(card.resolvedImagePath);

    if (!assetId) {
      throw new Error(`Missing uploaded asset for ${card.imagePath}`);
    }

    return {
      _key: stableKey(card.sourceKey),
      _type: "applicationCard",
      sourceKey: card.sourceKey,
      ...(card.figmaNodeId ? { figmaNodeId: card.figmaNodeId } : {}),
      title: keepExistingText(existingCard?.title, card.title, forceText),
      image: imageRef(assetId),
      alt: keepExistingText(existingCard?.alt, card.alt, forceText),
      ...(keepExistingText(existingCard?.description, card.description, forceText)
        ? {
            description: keepExistingText(
              existingCard?.description,
              card.description,
              forceText
            ),
          }
        : {}),
    };
  });
}

function buildCustomizationGroups(
  manifest: ValidatedManifest,
  existingProduct: ExistingProduct | null,
  uploadedAssets: Map<string, string>,
  forceText: boolean
) {
  const existingGroups = new Map<string, ExistingCustomizationGroup>();
  for (const group of existingProduct?.customizationGroups || []) {
    const key = group.sourceKey?.trim();
    if (key) existingGroups.set(key, group);
  }

  return (manifest.customizationGroups || []).map((group) => {
    const existingGroup = existingGroups.get(group.sourceKey);

    const images = (group.images || []).map((img) => {
      const assetId = uploadedAssets.get(img.resolvedImagePath);
      if (!assetId) {
        throw new Error(`Missing uploaded asset for ${img.imagePath}`);
      }
      return {
        _key: stableKey(img.sourceKey),
        _type: "customizationImage",
        sourceKey: img.sourceKey,
        image: imageRef(assetId),
        alt: img.alt,
      };
    });

    const blocks = (group.blocks || []).map((block, blockIndex) => ({
      _key: stableKey(`${group.sourceKey}-block-${blockIndex}`),
      _type: "customizationBlock",
      title: block.title,
      items: block.items,
    }));

    return {
      _key: stableKey(group.sourceKey),
      _type: "customizationGroup",
      sourceKey: group.sourceKey,
      title: keepExistingText(existingGroup?.title, group.title, forceText),
      ...(group.intro ? { intro: keepExistingText(existingGroup?.intro, group.intro, forceText) } : {}),
      ...(images.length ? { images } : {}),
      blocks,
    };
  });
}

function countImageCards(manifest: ValidatedManifest): number {
  let count = 0;

  if (manifest.sections.includes("showcaseGroups")) {
    count += (manifest.showcaseGroups || []).reduce(
      (total, group) => total + group.cards.length,
      0
    );
  }

  if (manifest.sections.includes("applications")) {
    count += manifest.applications?.length || 0;
  }

  if (manifest.sections.includes("customizationGroups")) {
    count += (manifest.customizationGroups || []).reduce(
      (total, group) => total + (group.images?.length || 0),
      0
    );
  }

  return count;
}

async function main() {
  const args = parseArgs(process.argv);
  const manifest = validateManifest(await loadManifest(args.slug), args.slug);

  if (args.dryRun) {
    console.log("Product import dry run");
    console.log(`Slug: ${manifest.slug}`);
    console.log(`Sections: ${manifest.sections.join(", ")}`);
    console.log(`Image count: ${countImageCards(manifest)}`);
    console.log("No writes were made.");
    return;
  }

  if (!process.env.SANITY_TOKEN) {
    throw new Error("SANITY_TOKEN is required for real imports. Use --dry-run to validate without writing.");
  }

  console.log(`Importing product "${manifest.slug}" to Sanity`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Dataset: ${DATASET}`);

  const documentId = `product-${manifest.slug}`;

  await client.createIfNotExists({
    _id: documentId,
    _type: "product",
    slug: manifest.slug,
    title: manifest.title,
  });

  const existingProduct = await client.fetch<ExistingProduct | null>(
    `*[_id == $id][0]{_id,_rev,title,applicationTitle,applicationDescription,showcaseGroups[]{sourceKey,title,cards[]{sourceKey,title,alt,description,image{asset{_ref}}}},applications[]{sourceKey,title,alt,description,image{asset{_ref}}},customizationGroups[]{sourceKey,title,intro,images[]{sourceKey,alt,image{asset{_ref}}},blocks[]{title,items}}}`,
    { id: documentId }
  );

  if (!existingProduct?._rev) {
    throw new Error(`Product document was not found after createIfNotExists: ${documentId}`);
  }

  const existingAssetMap = buildExistingAssetMap(manifest, existingProduct);
  const uploadedAssets = await uploadImages(manifest, existingAssetMap);
  let patch = client.patch(documentId);

  if (manifest.sections.includes("showcaseGroups")) {
    patch = patch.set({
      showcaseGroups: buildShowcaseGroups(
        manifest,
        existingProduct,
        uploadedAssets,
        args.forceText
      ),
    });
  }

  if (manifest.sections.includes("applications")) {
    const applicationsPatch: PatchSet = {
      applications: buildApplications(
        manifest,
        existingProduct,
        uploadedAssets,
        args.forceText
      ),
    };
    const applicationTitle = keepExistingText(
      existingProduct?.applicationTitle,
      manifest.applicationTitle,
      args.forceText
    );
    const applicationDescription = keepExistingText(
      existingProduct?.applicationDescription,
      manifest.applicationDescription,
      args.forceText
    );

    if (applicationTitle !== undefined) {
      applicationsPatch.applicationTitle = applicationTitle;
    }

    if (applicationDescription !== undefined) {
      applicationsPatch.applicationDescription = applicationDescription;
    }

    patch = patch.set(applicationsPatch);
  }

  if (manifest.sections.includes("customizationGroups")) {
    patch = patch.set({
      customizationGroups: buildCustomizationGroups(
        manifest,
        existingProduct,
        uploadedAssets,
        args.forceText
      ),
    });
  }

  const result = await patch.ifRevisionId(existingProduct._rev).commit();
  console.log(`Imported ${result._id}`);
  console.log(`Sections: ${manifest.sections.join(", ")}`);
  console.log(`Image count: ${countImageCards(manifest)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
