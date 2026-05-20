import { readFileSync } from "node:fs";
import { resolve } from "node:path";

declare const __dirname: string;

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
} catch {}

import { readFileSync as readFile, existsSync } from "node:fs";
import * as path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createClient } from "@sanity/client";
import { HttpsProxyAgent } from "https-proxy-agent";

type BlogCategorySlug =
  | "material-guides"
  | "production-knowledge"
  | "industry-insights";

type LegacyBlogSection = {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
};

type LegacyBlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: BlogCategorySlug;
  publishedAt: string;
  readTime: string;
  image: string;
  imageAlt: string;
  heroImage?: string;
  heroSummary?: string;
  lead: string[];
  sections: LegacyBlogSection[];
};

type PortableTextSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
};

type PortableTextMarkDef = {
  _key: string;
  _type: "link";
  href: string;
  openInNewTab: boolean;
};

type PortableTextBlock = {
  _type: "block";
  _key: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  children: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
  listItem?: "bullet" | "number";
  level?: number;
};

type PortableTextImageBlock = {
  _type: "image";
  _key: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt: string;
  caption?: string;
};

type SanityBlogDocument = {
  _id: string;
  _type: "blogPost";
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  category: BlogCategorySlug;
  publishedAt: string;
  readTimeMinutes: number;
  excerpt: string;
  heroSummary?: string;
  heroImage: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
    alt: string;
  };
  body: Array<PortableTextBlock | PortableTextImageBlock>;
};

type ExistingSanityAsset = {
  _id: string;
  originalFilename?: string | null;
};

type CliArgs = {
  dryRun: boolean;
};

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "44m142o0";
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";
const ASTRO_ROOT = path.resolve(__dirname, "../../astro");
const BLOG_DATA_PATH = path.resolve(ASTRO_ROOT, "src/data/blog.ts");
const BLOG_PUBLIC_IMAGES_DIR = path.resolve(ASTRO_ROOT, "public/images/blog");

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
  let dryRun = false;

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { dryRun };
}

function stableKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function escapeSingleQuotes(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function extractBlogArticlesFromSource(): LegacyBlogArticle[] {
  const source = readFile(BLOG_DATA_PATH, "utf-8");
  const transformedSource = source
    .replace(/import[^;]+;\n/g, "")
    .replace(
      /const blogImage = \(fileName: string\) => getLocalImage\(`\/images\/blog\/\$\{fileName\}`\);\n/,
      "const blogImage = (fileName: string) => `/images/blog/${fileName}`;\n",
    );

  const transpiled = ts.transpileModule(transformedSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: BLOG_DATA_PATH,
  });

  const module = { exports: {} as Record<string, unknown> };
  const context = vm.createContext({
    module,
    exports: module.exports,
    require: () => {
      throw new Error("Unexpected require call while loading blog.ts");
    },
    console,
  });

  new vm.Script(transpiled.outputText, { filename: BLOG_DATA_PATH }).runInContext(context);

  const exportedArticles = module.exports.blogArticles;

  if (!Array.isArray(exportedArticles)) {
    throw new Error("Failed to load blogArticles from packages/astro/src/data/blog.ts");
  }

  return exportedArticles as LegacyBlogArticle[];
}

function parseReadTimeMinutes(readTime: string): number {
  const matchedMinutes = readTime.match(/\d+/);
  const minutes = matchedMinutes ? Number.parseInt(matchedMinutes[0], 10) : NaN;

  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new Error(`Unable to parse readTime "${readTime}"`);
  }

  return minutes;
}

function toDatetimeString(dateOnly: string): string {
  return `${dateOnly}T12:00:00.000Z`;
}

function imageFileNameFromPath(imagePath: string): string {
  const fileName = path.basename(imagePath.trim());

  if (!fileName) {
    throw new Error(`Invalid image path: "${imagePath}"`);
  }

  return fileName;
}

function resolveImagePath(imagePath: string): string {
  const fileName = imageFileNameFromPath(imagePath);
  const resolvedPath = path.resolve(BLOG_PUBLIC_IMAGES_DIR, fileName);

  if (!existsSync(resolvedPath)) {
    throw new Error(`Blog image not found: ${resolvedPath}`);
  }

  return resolvedPath;
}

function collectImagePaths(articles: LegacyBlogArticle[]): Map<string, string> {
  const imagePaths = new Map<string, string>();

  for (const article of articles) {
    imagePaths.set(resolveImagePath(article.image), imageFileNameFromPath(article.image));

    if (article.heroImage) {
      imagePaths.set(resolveImagePath(article.heroImage), imageFileNameFromPath(article.heroImage));
    }

    for (const section of article.sections) {
      if (section.image?.src) {
        imagePaths.set(resolveImagePath(section.image.src), imageFileNameFromPath(section.image.src));
      }
    }
  }

  return imagePaths;
}

async function fetchExistingAssetsByFileName(fileNames: string[]): Promise<Map<string, string>> {
  if (!fileNames.length) {
    return new Map();
  }

  const assets = await client.fetch<ExistingSanityAsset[]>(
    `*[_type == "sanity.imageAsset" && originalFilename in $fileNames]{_id, originalFilename}`,
    { fileNames },
  );

  const assetMap = new Map<string, string>();

  for (const asset of assets) {
    if (asset.originalFilename && !assetMap.has(asset.originalFilename)) {
      assetMap.set(asset.originalFilename, asset._id);
    }
  }

  return assetMap;
}

async function uploadImages(imagePaths: Map<string, string>): Promise<Map<string, string>> {
  const assetMap = await fetchExistingAssetsByFileName(Array.from(imagePaths.values()));
  const resolvedAssetMap = new Map<string, string>();
  let uploaded = 0;
  let reused = 0;

  for (const [filePath, fileName] of imagePaths.entries()) {
    const existingAssetId = assetMap.get(fileName);

    if (existingAssetId) {
      resolvedAssetMap.set(filePath, existingAssetId);
      reused += 1;
      console.log(`Reused ${fileName} -> ${existingAssetId}`);
      continue;
    }

    const asset = await client.assets.upload("image", readFile(filePath), {
      filename: fileName,
      contentType: `image/${path.extname(fileName).slice(1).replace("jpg", "jpeg")}`,
    });

    resolvedAssetMap.set(filePath, asset._id);
    uploaded += 1;
    console.log(`Uploaded ${fileName} -> ${asset._id}`);
  }

  console.log(`Image summary: ${uploaded} uploaded, ${reused} reused`);
  return resolvedAssetMap;
}

function heroAltForArticle(article: LegacyBlogArticle): string {
  if (article.heroImage && imageFileNameFromPath(article.heroImage) !== imageFileNameFromPath(article.image)) {
    return article.heroSummary?.trim() || `Hero image for ${article.title}`;
  }

  return article.imageAlt;
}

function span(text: string, key: string, marks?: string[]): PortableTextSpan {
  return {
    _type: "span",
    _key: key,
    text,
    ...(marks?.length ? { marks } : {}),
  };
}

function paragraphBlock(text: string, key: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    children: [span(text, `${key}-span`)],
    markDefs: [],
  };
}

function headingBlock(text: string, key: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "h2",
    children: [span(text, `${key}-span`)],
    markDefs: [],
  };
}

function listItemBlock(text: string, key: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [span(text, `${key}-span`)],
    markDefs: [],
  };
}

function imageBlock(
  assetId: string,
  alt: string,
  key: string,
  caption?: string,
): PortableTextImageBlock {
  return {
    _type: "image",
    _key: key,
    asset: {
      _type: "reference",
      _ref: assetId,
    },
    alt,
    ...(caption ? { caption } : {}),
  };
}

function buildBody(
  article: LegacyBlogArticle,
  uploadedAssets: Map<string, string>,
): Array<PortableTextBlock | PortableTextImageBlock> {
  const body: Array<PortableTextBlock | PortableTextImageBlock> = [];
  let blockIndex = 0;

  for (const paragraph of article.lead) {
    body.push(paragraphBlock(paragraph, stableKey(`${article.slug}-lead-${blockIndex++}`)));
  }

  for (const section of article.sections) {
    if (section.title) {
      body.push(headingBlock(section.title, stableKey(`${article.slug}-heading-${blockIndex++}`)));
    }

    if (section.image?.src) {
      const imagePath = resolveImagePath(section.image.src);
      const assetId = uploadedAssets.get(imagePath);

      if (!assetId) {
        throw new Error(`Missing uploaded asset for section image "${section.image.src}" in ${article.slug}`);
      }

      body.push(
        imageBlock(
          assetId,
          section.image.alt,
          stableKey(`${article.slug}-image-${blockIndex++}`),
          section.image.caption,
        ),
      );
    }

    for (const paragraph of section.paragraphs ?? []) {
      body.push(paragraphBlock(paragraph, stableKey(`${article.slug}-paragraph-${blockIndex++}`)));
    }

    for (const bullet of section.bullets ?? []) {
      body.push(listItemBlock(bullet, stableKey(`${article.slug}-bullet-${blockIndex++}`)));
    }
  }

  return body;
}

function buildDocuments(
  articles: LegacyBlogArticle[],
  uploadedAssets: Map<string, string>,
): SanityBlogDocument[] {
  return articles.map((article) => {
    const heroSourcePath = resolveImagePath(article.heroImage || article.image);
    const heroAssetId = uploadedAssets.get(heroSourcePath);

    if (!heroAssetId) {
      throw new Error(`Missing uploaded hero asset for article "${article.slug}"`);
    }

    return {
      _id: `blogPost-${article.slug}`,
      _type: "blogPost",
      title: article.title,
      slug: {
        _type: "slug",
        current: article.slug,
      },
      category: article.category,
      publishedAt: toDatetimeString(article.publishedAt),
      readTimeMinutes: parseReadTimeMinutes(article.readTime),
      excerpt: article.excerpt,
      ...(article.heroSummary ? { heroSummary: article.heroSummary } : {}),
      heroImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: heroAssetId,
        },
        alt: heroAltForArticle(article),
      },
      body: buildBody(article, uploadedAssets),
    };
  });
}

async function writeDocuments(documents: SanityBlogDocument[]): Promise<void> {
  for (const document of documents) {
    await client.createOrReplace(document);
    console.log(`Upserted ${document._id}`);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const articles = extractBlogArticlesFromSource();

  if (!articles.length) {
    throw new Error("No blog articles found in source data");
  }

  const imagePaths = collectImagePaths(articles);

  if (args.dryRun) {
    console.log(`Blog import dry run`);
    console.log(`Articles: ${articles.length}`);
    console.log(`Images: ${imagePaths.size}`);
    console.log(`No writes were made.`);
    return;
  }

  if (!process.env.SANITY_TOKEN) {
    throw new Error("SANITY_TOKEN is required for blog imports. Use --dry-run to validate without writing.");
  }

  console.log(`Importing ${articles.length} blog posts to Sanity`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Dataset: ${DATASET}`);

  const uploadedAssets = await uploadImages(imagePaths);
  const documents = buildDocuments(articles, uploadedAssets);
  await writeDocuments(documents);

  console.log(`Imported ${documents.length} blog posts.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
