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
} from "../import-data/products/types";
import { productSourcePages } from "../../astro/src/data/product-source";
import {
  getProductBaselineBySlug,
  type ProductBaselineEntry,
  type ProductBaselineFaqItem,
  type ProductBaselineImage,
} from "./product-content-source";

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

type ImportSection = "showcaseGroups" | "applications" | "customizationGroups";

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

type ExistingImageField = {
  asset?: { _ref?: string };
  alt?: string;
};

type ExistingCustomizationGroup = {
  sourceKey?: string;
  title?: string;
  intro?: string;
  images?: Array<ExistingTextFields & { sourceKey?: string; alt?: string; image?: ExistingImageField }>;
  blocks?: Array<{ title?: string; items?: string[] }>;
};

type ExistingProduct = {
  _id: string;
  _rev: string;
  name?: string;
  slug?: string;
  pageTitle?: string;
  seoTitle?: string;
  metaDescription?: string;
  hero?: {
    title?: string;
    description?: string;
    image?: ExistingImageField;
  };
  megaMenuCard?: {
    image?: ExistingImageField;
  };
  whatAreCustom?: {
    title?: string;
    overview?: string;
  };
  caseStudy?: {
    title?: string;
    description?: string;
    image?: ExistingImageField;
    bullets?: string[];
    quote?: string;
    quoteAuthor?: string;
    challenge?: string;
    solutionIntro?: string;
    solutionPoints?: string[];
    resultPoints?: string[];
    gallery?: ExistingImageField[];
  };
  faqItems?: Array<{ question?: string; answer?: string }>;
  applicationTitle?: string;
  applicationDescription?: string;
  showcaseGroups?: Array<{
    sourceKey?: string;
    title?: string;
    cards?: Array<ExistingTextFields & { sourceKey?: string; image?: ExistingImageField }>;
  }>;
  applications?: Array<ExistingTextFields & { sourceKey?: string; image?: ExistingImageField }>;
  customizationGroups?: ExistingCustomizationGroup[];
};

type PatchSet = Record<string, unknown>;

const STUDIO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_DIR = path.resolve(STUDIO_ROOT, "import-data/products");
const IMPORT_ASSETS_PRODUCTS_DIR = path.resolve(
  STUDIO_ROOT,
  "import-assets/products"
);
const ASTRO_ASSETS_DIR = path.resolve(STUDIO_ROOT, "../astro/src/assets");
const ALLOWED_PRODUCT_SLUGS = new Set<ProductSlug>(
  productSourcePages.map((page) => page.slug as ProductSlug),
);
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
      ASTRO_ASSETS_DIR,
      trimmedPath.slice("/images/".length)
    );

    if (!isInsideDirectory(resolvedPath, ASTRO_ASSETS_DIR)) {
      throw new Error(`Image path escapes Astro asset directory: "${imagePath}"`);
    }

    if (fs.existsSync(resolvedPath)) {
      const realAstroImagesDir = realpathExisting(ASTRO_ASSETS_DIR);
      const realImagePath = realpathExisting(resolvedPath);

      if (!isInsideDirectory(realImagePath, realAstroImagesDir)) {
        throw new Error(`Image path escapes Astro asset directory: "${imagePath}"`);
      }

      return {
        manifestPath: imagePath,
        filePath: realImagePath,
      };
    }

    throw new Error(
      `Image not found for "${imagePath}". Compatibility /images/... paths resolve under packages/astro/src/assets.`
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
      fs.existsSync(ASTRO_ASSETS_DIR)
    ) {
      isContainedInAstroImages = isInsideDirectory(
        realImagePath,
        realpathExisting(ASTRO_ASSETS_DIR)
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
  image?: ExistingImageField;
};

type ExistingGroupWithImages = {
  sourceKey?: string;
  cards?: ExistingCardWithImage[];
};

type ResolvedBaselineImage = ProductBaselineImage & {
  resolvedImagePath: string;
};

type ResolvedProductBaseline = Omit<
  ProductBaselineEntry,
  "hero" | "megaMenuCard" | "caseStudy"
> & {
  hero: ProductBaselineEntry["hero"] & {
    image: ResolvedBaselineImage;
  };
  megaMenuCard: ProductBaselineEntry["megaMenuCard"] & {
    image: ResolvedBaselineImage;
  };
  caseStudy: Omit<ProductBaselineEntry["caseStudy"], "image" | "gallery"> & {
    image: ResolvedBaselineImage;
    gallery?: ResolvedBaselineImage[];
  };
};

type ExistingProductWithImages = ExistingProduct & {
  showcaseGroups?: ExistingGroupWithImages[];
  applications?: ExistingCardWithImage[];
};

function resolveBaselineImage(
  image: ProductBaselineImage,
  slug: ProductSlug,
): ResolvedBaselineImage {
  const resolvedImage = resolveImagePath(image.imagePath, slug);

  return {
    ...image,
    resolvedImagePath: resolvedImage.filePath,
  };
}

function resolveProductBaseline(
  baseline: ProductBaselineEntry,
): ResolvedProductBaseline {
  return {
    ...baseline,
    hero: {
      ...baseline.hero,
      image: resolveBaselineImage(baseline.hero.image, baseline.slug as ProductSlug),
    },
    megaMenuCard: {
      ...baseline.megaMenuCard,
      image: resolveBaselineImage(
        baseline.megaMenuCard.image,
        baseline.slug as ProductSlug,
      ),
    },
    caseStudy: {
      ...baseline.caseStudy,
      image: resolveBaselineImage(
        baseline.caseStudy.image,
        baseline.slug as ProductSlug,
      ),
      ...(baseline.caseStudy.gallery?.length
        ? {
            gallery: baseline.caseStudy.gallery.map((image) =>
              resolveBaselineImage(image, baseline.slug as ProductSlug),
            ),
          }
        : {}),
    },
  };
}

function keepExistingStringArray(
  existingValue: string[] | undefined,
  sourceValue: string[] | undefined,
  forceText: boolean,
): string[] | undefined {
  if (!sourceValue) {
    return sourceValue;
  }

  if (
    !forceText &&
    existingValue?.length &&
    existingValue.some((value) => value.trim().length > 0)
  ) {
    return existingValue;
  }

  return sourceValue;
}

function keepExistingFaqItems(
  existingValue: ExistingProduct["faqItems"],
  sourceValue: ProductBaselineFaqItem[],
  forceText: boolean,
): ProductBaselineFaqItem[] {
  if (
    !forceText &&
    existingValue?.length &&
    existingValue.every(
      (item) => item.question?.trim() && item.answer?.trim(),
    )
  ) {
    return existingValue.map((item) => ({
      question: item.question || "",
      answer: item.answer || "",
    }));
  }

  return sourceValue;
}

function buildImageField(
  assetId: string,
  existingAlt: string | undefined,
  sourceAlt: string,
  forceText: boolean,
) {
  return {
    ...imageRef(assetId),
    alt: keepExistingText(existingAlt, sourceAlt, forceText),
  };
}

function buildExistingAssetMap(
  manifest: ValidatedManifest,
  baseline: ResolvedProductBaseline,
  existingProduct: ExistingProductWithImages | null,
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

  const heroRef = existingProduct.hero?.image?.asset?._ref;
  if (heroRef) {
    map.set(baseline.hero.image.resolvedImagePath, heroRef);
  }

  const megaMenuCardRef = existingProduct.megaMenuCard?.image?.asset?._ref;
  if (megaMenuCardRef) {
    map.set(baseline.megaMenuCard.image.resolvedImagePath, megaMenuCardRef);
  }

  const caseStudyRef = existingProduct.caseStudy?.image?.asset?._ref;
  if (caseStudyRef) {
    map.set(baseline.caseStudy.image.resolvedImagePath, caseStudyRef);
  }

  for (const [index, image] of (baseline.caseStudy.gallery || []).entries()) {
    const existingRef = existingProduct.caseStudy?.gallery?.[index]?.asset?._ref;
    if (existingRef) {
      map.set(image.resolvedImagePath, existingRef);
    }
  }

  return map;
}

async function uploadImages(
  manifest: ValidatedManifest,
  baseline: ResolvedProductBaseline,
  existingAssetMap: Map<string, string>,
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

  imagePaths.add(baseline.hero.image.resolvedImagePath);
  imagePaths.add(baseline.megaMenuCard.image.resolvedImagePath);
  imagePaths.add(baseline.caseStudy.image.resolvedImagePath);

  for (const image of baseline.caseStudy.gallery || []) {
    imagePaths.add(image.resolvedImagePath);
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

function buildHero(
  baseline: ResolvedProductBaseline,
  existingProduct: ExistingProduct | null,
  uploadedAssets: Map<string, string>,
  forceText: boolean,
) {
  const assetId = uploadedAssets.get(baseline.hero.image.resolvedImagePath);

  if (!assetId) {
    throw new Error(`Missing uploaded asset for ${baseline.hero.image.imagePath}`);
  }

  return {
    _type: "productHero",
    title: keepExistingText(
      existingProduct?.hero?.title,
      baseline.hero.title,
      forceText,
    ),
    description: keepExistingText(
      existingProduct?.hero?.description,
      baseline.hero.description,
      forceText,
    ),
    image: buildImageField(
      assetId,
      existingProduct?.hero?.image?.alt,
      baseline.hero.image.alt,
      forceText,
    ),
  };
}

function buildMegaMenuCard(
  baseline: ResolvedProductBaseline,
  existingProduct: ExistingProduct | null,
  uploadedAssets: Map<string, string>,
  forceText: boolean,
) {
  const assetId = uploadedAssets.get(baseline.megaMenuCard.image.resolvedImagePath);

  if (!assetId) {
    throw new Error(
      `Missing uploaded asset for ${baseline.megaMenuCard.image.imagePath}`,
    );
  }

  return {
    _type: "productMegaMenuCard",
    image: buildImageField(
      assetId,
      existingProduct?.megaMenuCard?.image?.alt,
      baseline.megaMenuCard.image.alt,
      forceText,
    ),
  };
}

function buildWhatAreCustom(
  baseline: ResolvedProductBaseline,
  existingProduct: ExistingProduct | null,
  forceText: boolean,
) {
  const title = keepExistingText(
    existingProduct?.whatAreCustom?.title,
    baseline.whatAreCustom.title,
    forceText,
  );

  return {
    _type: "productWhatAreCustom",
    ...(title ? { title } : {}),
    overview: keepExistingText(
      existingProduct?.whatAreCustom?.overview,
      baseline.whatAreCustom.overview,
      forceText,
    ),
  };
}

function buildCaseStudy(
  baseline: ResolvedProductBaseline,
  existingProduct: ExistingProduct | null,
  uploadedAssets: Map<string, string>,
  forceText: boolean,
) {
  const assetId = uploadedAssets.get(baseline.caseStudy.image.resolvedImagePath);

  if (!assetId) {
    throw new Error(`Missing uploaded asset for ${baseline.caseStudy.image.imagePath}`);
  }

  const gallery = (baseline.caseStudy.gallery || []).map((image, index) => {
    const galleryAssetId = uploadedAssets.get(image.resolvedImagePath);

    if (!galleryAssetId) {
      throw new Error(`Missing uploaded asset for ${image.imagePath}`);
    }

    return {
      _key: stableKey(`${baseline.slug}-case-gallery-${index}`),
      ...buildImageField(
        galleryAssetId,
        existingProduct?.caseStudy?.gallery?.[index]?.alt,
        image.alt,
        forceText,
      ),
    };
  });

  return {
    _type: "productCaseStudy",
    title: keepExistingText(
      existingProduct?.caseStudy?.title,
      baseline.caseStudy.title,
      forceText,
    ),
    description: keepExistingText(
      existingProduct?.caseStudy?.description,
      baseline.caseStudy.description,
      forceText,
    ),
    image: buildImageField(
      assetId,
      existingProduct?.caseStudy?.image?.alt,
      baseline.caseStudy.image.alt,
      forceText,
    ),
    bullets: keepExistingStringArray(
      existingProduct?.caseStudy?.bullets,
      baseline.caseStudy.bullets,
      forceText,
    ),
    ...(keepExistingText(
      existingProduct?.caseStudy?.quote,
      baseline.caseStudy.quote,
      forceText,
    )
      ? {
          quote: keepExistingText(
            existingProduct?.caseStudy?.quote,
            baseline.caseStudy.quote,
            forceText,
          ),
        }
      : {}),
    ...(keepExistingText(
      existingProduct?.caseStudy?.quoteAuthor,
      baseline.caseStudy.quoteAuthor,
      forceText,
    )
      ? {
          quoteAuthor: keepExistingText(
            existingProduct?.caseStudy?.quoteAuthor,
            baseline.caseStudy.quoteAuthor,
            forceText,
          ),
        }
      : {}),
    ...(keepExistingText(
      existingProduct?.caseStudy?.challenge,
      baseline.caseStudy.challenge,
      forceText,
    )
      ? {
          challenge: keepExistingText(
            existingProduct?.caseStudy?.challenge,
            baseline.caseStudy.challenge,
            forceText,
          ),
        }
      : {}),
    ...(keepExistingText(
      existingProduct?.caseStudy?.solutionIntro,
      baseline.caseStudy.solutionIntro,
      forceText,
    )
      ? {
          solutionIntro: keepExistingText(
            existingProduct?.caseStudy?.solutionIntro,
            baseline.caseStudy.solutionIntro,
            forceText,
          ),
        }
      : {}),
    ...(baseline.caseStudy.solutionPoints?.length
      ? {
          solutionPoints: keepExistingStringArray(
            existingProduct?.caseStudy?.solutionPoints,
            baseline.caseStudy.solutionPoints,
            forceText,
          ),
        }
      : {}),
    ...(baseline.caseStudy.resultPoints?.length
      ? {
          resultPoints: keepExistingStringArray(
            existingProduct?.caseStudy?.resultPoints,
            baseline.caseStudy.resultPoints,
            forceText,
          ),
        }
      : {}),
    ...(gallery.length ? { gallery } : {}),
  };
}

function countImageCards(
  manifest: ValidatedManifest,
  baseline: ResolvedProductBaseline,
): number {
  let count = 3 + (baseline.caseStudy.gallery?.length || 0);

  if (manifest.sections.includes("showcaseGroups")) {
    count += (manifest.showcaseGroups || []).reduce(
      (total, group) => total + group.cards.length,
      0,
    );
  }

  if (manifest.sections.includes("applications")) {
    count += manifest.applications?.length || 0;
  }

  if (manifest.sections.includes("customizationGroups")) {
    count += (manifest.customizationGroups || []).reduce(
      (total, group) => total + (group.images?.length || 0),
      0,
    );
  }

  return count;
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

async function main() {
  const args = parseArgs(process.argv);
  const manifest = validateManifest(await loadManifest(args.slug), args.slug);
  const baseline = resolveProductBaseline(getProductBaselineBySlug(args.slug));

  if (args.dryRun) {
    console.log("Product import dry run");
    console.log(`Slug: ${manifest.slug}`);
    console.log(`Sections: ${manifest.sections.join(", ")}`);
    console.log(`Image count: ${countImageCards(manifest, baseline)}`);
    console.log("Content fields: hero, megaMenuCard, whatAreCustom, caseStudy, faqItems");
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
  const draftDocumentId = `drafts.${documentId}`;
  const productProjection = `{
      _id,
      _rev,
      name,
      "slug": coalesce(slug.current, slug),
      pageTitle,
      seoTitle,
      metaDescription,
      hero{title,description,image{asset{_ref},alt}},
      megaMenuCard{image{asset{_ref},alt}},
      whatAreCustom{title,overview},
      caseStudy{
        title,
        description,
        image{asset{_ref},alt},
        bullets,
        quote,
        quoteAuthor,
        challenge,
        solutionIntro,
        solutionPoints,
        resultPoints,
        gallery[]{asset{_ref},alt}
      },
      faqItems[]{question,answer},
      applicationTitle,
      applicationDescription,
      showcaseGroups[]{sourceKey,title,cards[]{sourceKey,title,alt,description,image{asset{_ref}}}},
      applications[]{sourceKey,title,alt,description,image{asset{_ref}}},
      customizationGroups[]{sourceKey,title,intro,images[]{sourceKey,alt,image{asset{_ref}}},blocks[]{title,items}}
    }`;

  await client.createIfNotExists({
    _id: documentId,
    _type: "product",
    name: baseline.name,
    slug: {
      _type: "slug",
      current: baseline.slug,
    },
    pageTitle: baseline.pageTitle,
    seoTitle: baseline.seoTitle,
    metaDescription: baseline.metaDescription,
  });

  const existingProduct = await client.fetch<ExistingProduct | null>(
    `*[_id == $id][0]${productProjection}`,
    { id: documentId },
  );
  const existingDraft = await client.fetch<ExistingProduct | null>(
    `*[_id == $id][0]${productProjection}`,
    { id: draftDocumentId },
  );

  if (!existingProduct?._rev) {
    throw new Error(`Product document was not found after createIfNotExists: ${documentId}`);
  }

  const existingAssetMap = buildExistingAssetMap(manifest, baseline, existingProduct);
  const uploadedAssets = await uploadImages(manifest, baseline, existingAssetMap);
  const faqItems = keepExistingFaqItems(
    existingProduct?.faqItems,
    baseline.faqItems,
    args.forceText,
  ).map((item, index) => ({
    _key: stableKey(`${baseline.slug}-faq-${index}`),
    _type: "productFaqItem",
    question: item.question,
    answer: item.answer,
  }));
  let patch = client.patch(documentId).set({
    name: keepExistingText(existingProduct?.name, baseline.name, args.forceText),
    slug: {
      _type: "slug",
      current: baseline.slug,
    },
    pageTitle: keepExistingText(
      existingProduct?.pageTitle,
      baseline.pageTitle,
      args.forceText,
    ),
    seoTitle: keepExistingText(
      existingProduct?.seoTitle,
      baseline.seoTitle,
      args.forceText,
    ),
    metaDescription: keepExistingText(
      existingProduct?.metaDescription,
      baseline.metaDescription,
      args.forceText,
    ),
    hero: buildHero(baseline, existingProduct, uploadedAssets, args.forceText),
    megaMenuCard: buildMegaMenuCard(
      baseline,
      existingProduct,
      uploadedAssets,
      args.forceText,
    ),
    whatAreCustom: buildWhatAreCustom(baseline, existingProduct, args.forceText),
    caseStudy: buildCaseStudy(
      baseline,
      existingProduct,
      uploadedAssets,
      args.forceText,
    ),
    faqItems,
  }).unset(["title"]);

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

  if (existingDraft?._rev) {
    const draftFaqItems = keepExistingFaqItems(
      existingDraft.faqItems,
      baseline.faqItems,
      args.forceText,
    ).map((item, index) => ({
      _key: stableKey(`${baseline.slug}-faq-${index}`),
      _type: "productFaqItem",
      question: item.question,
      answer: item.answer,
    }));
    let draftPatch = client.patch(draftDocumentId).set({
      name: keepExistingText(existingDraft?.name, baseline.name, args.forceText),
      slug: {
        _type: "slug",
        current: baseline.slug,
      },
      pageTitle: keepExistingText(
        existingDraft?.pageTitle,
        baseline.pageTitle,
        args.forceText,
      ),
      seoTitle: keepExistingText(
        existingDraft?.seoTitle,
        baseline.seoTitle,
        args.forceText,
      ),
      metaDescription: keepExistingText(
        existingDraft?.metaDescription,
        baseline.metaDescription,
        args.forceText,
      ),
      hero: buildHero(baseline, existingDraft, uploadedAssets, args.forceText),
      megaMenuCard: buildMegaMenuCard(
        baseline,
        existingDraft,
        uploadedAssets,
        args.forceText,
      ),
      whatAreCustom: buildWhatAreCustom(baseline, existingDraft, args.forceText),
      caseStudy: buildCaseStudy(
        baseline,
        existingDraft,
        uploadedAssets,
        args.forceText,
      ),
      faqItems: draftFaqItems,
    }).unset(["title"]);

    if (manifest.sections.includes("showcaseGroups")) {
      draftPatch = draftPatch.set({
        showcaseGroups: buildShowcaseGroups(
          manifest,
          existingDraft,
          uploadedAssets,
          args.forceText,
        ),
      });
    }

    if (manifest.sections.includes("applications")) {
      const draftApplicationsPatch: PatchSet = {
        applications: buildApplications(
          manifest,
          existingDraft,
          uploadedAssets,
          args.forceText,
        ),
      };
      const draftApplicationTitle = keepExistingText(
        existingDraft?.applicationTitle,
        manifest.applicationTitle,
        args.forceText,
      );
      const draftApplicationDescription = keepExistingText(
        existingDraft?.applicationDescription,
        manifest.applicationDescription,
        args.forceText,
      );

      if (draftApplicationTitle !== undefined) {
        draftApplicationsPatch.applicationTitle = draftApplicationTitle;
      }

      if (draftApplicationDescription !== undefined) {
        draftApplicationsPatch.applicationDescription = draftApplicationDescription;
      }

      draftPatch = draftPatch.set(draftApplicationsPatch);
    }

    if (manifest.sections.includes("customizationGroups")) {
      draftPatch = draftPatch.set({
        customizationGroups: buildCustomizationGroups(
          manifest,
          existingDraft,
          uploadedAssets,
          args.forceText,
        ),
      });
    }

    await draftPatch.ifRevisionId(existingDraft._rev).commit();
  }

  console.log(`Imported ${result._id}`);
  console.log(`Sections: ${manifest.sections.join(", ")}`);
  console.log(`Image count: ${countImageCards(manifest, baseline)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
