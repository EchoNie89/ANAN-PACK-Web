import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { HttpsProxyAgent } from "https-proxy-agent";
import {
  PRODUCT_BASELINE_DIFF_PATH,
  PRODUCT_BASELINE_OUTPUT_PATH,
  type ProductBaselineEntry,
  productBaselineEntries,
} from "./product-content-source";

declare const __dirname: string;

type BaselineCompareArgs = {
  baselinePath: string;
  reportPath: string;
};

type ProductDocument = {
  _id: string;
  name?: string;
  slug?: string;
  pageTitle?: string;
  seoTitle?: string;
  metaDescription?: string;
  hero?: {
    title?: string;
    description?: string;
    image?: { asset?: { _ref?: string }; alt?: string };
  };
  megaMenuCard?: {
    image?: { asset?: { _ref?: string }; alt?: string };
  };
  whatAreCustom?: {
    title?: string;
    overview?: string;
  };
  caseStudy?: {
    title?: string;
    description?: string;
    image?: { asset?: { _ref?: string }; alt?: string };
    bullets?: string[];
    quote?: string;
    quoteAuthor?: string;
    challenge?: string;
    solutionIntro?: string;
    solutionPoints?: string[];
    resultPoints?: string[];
    gallery?: Array<{ asset?: { _ref?: string }; alt?: string }>;
  };
  faqItems?: Array<{ question?: string; answer?: string }>;
};

type Difference = {
  slug: string;
  field: string;
  expected: unknown;
  actual: unknown;
};

const envPath = path.resolve(__dirname, "..", ".env");

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const proxyUrl =
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.http_proxy;

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "44m142o0",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN || "",
  ...(proxyUrl ? { agent: new HttpsProxyAgent(proxyUrl) } : {}),
});

function parseArgs(argv: string[]): BaselineCompareArgs {
  let baselinePath = PRODUCT_BASELINE_OUTPUT_PATH;
  let reportPath = PRODUCT_BASELINE_DIFF_PATH;

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--baseline") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --baseline");
      }
      baselinePath = value;
      index += 1;
      continue;
    }

    if (arg === "--report") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --report");
      }
      reportPath = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { baselinePath, reportPath };
}

function loadBaseline(relativeBaselinePath: string): ProductBaselineEntry[] {
  const absoluteBaselinePath = path.resolve(__dirname, "..", relativeBaselinePath);

  if (!existsSync(absoluteBaselinePath)) {
    return productBaselineEntries;
  }

  return JSON.parse(readFileSync(absoluteBaselinePath, "utf8")) as ProductBaselineEntry[];
}

function pushIfDifferent(
  differences: Difference[],
  slug: string,
  field: string,
  expected: unknown,
  actual: unknown,
) {
  const normalizedExpected = expected === null ? undefined : expected;
  const normalizedActual = actual === null ? undefined : actual;

  if (JSON.stringify(normalizedExpected) === JSON.stringify(normalizedActual)) {
    return;
  }

  differences.push({
    slug,
    field,
    expected: normalizedExpected,
    actual: normalizedActual,
  });
}

function compareProduct(
  baseline: ProductBaselineEntry,
  document: ProductDocument | undefined,
): Difference[] {
  const differences: Difference[] = [];

  if (!document) {
    differences.push({
      slug: baseline.slug,
      field: "document",
      expected: "present",
      actual: "missing",
    });
    return differences;
  }

  pushIfDifferent(differences, baseline.slug, "name", baseline.name, document.name);
  pushIfDifferent(
    differences,
    baseline.slug,
    "slug",
    baseline.slug,
    document.slug,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "pageTitle",
    baseline.pageTitle,
    document.pageTitle,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "seoTitle",
    baseline.seoTitle,
    document.seoTitle,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "metaDescription",
    baseline.metaDescription,
    document.metaDescription,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "hero.title",
    baseline.hero.title,
    document.hero?.title,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "hero.description",
    baseline.hero.description,
    document.hero?.description,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "hero.image.alt",
    baseline.hero.image.alt,
    document.hero?.image?.alt,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "hero.image.asset",
    true,
    Boolean(document.hero?.image?.asset?._ref),
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "megaMenuCard.image.alt",
    baseline.megaMenuCard.image.alt,
    document.megaMenuCard?.image?.alt,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "megaMenuCard.image.asset",
    true,
    Boolean(document.megaMenuCard?.image?.asset?._ref),
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "whatAreCustom.title",
    baseline.whatAreCustom.title,
    document.whatAreCustom?.title,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "whatAreCustom.overview",
    baseline.whatAreCustom.overview,
    document.whatAreCustom?.overview,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.title",
    baseline.caseStudy.title,
    document.caseStudy?.title,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.description",
    baseline.caseStudy.description,
    document.caseStudy?.description,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.image.alt",
    baseline.caseStudy.image.alt,
    document.caseStudy?.image?.alt,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.image.asset",
    true,
    Boolean(document.caseStudy?.image?.asset?._ref),
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.bullets",
    baseline.caseStudy.bullets,
    document.caseStudy?.bullets,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.quote",
    baseline.caseStudy.quote,
    document.caseStudy?.quote,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.quoteAuthor",
    baseline.caseStudy.quoteAuthor,
    document.caseStudy?.quoteAuthor,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.challenge",
    baseline.caseStudy.challenge,
    document.caseStudy?.challenge,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.solutionIntro",
    baseline.caseStudy.solutionIntro,
    document.caseStudy?.solutionIntro,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.solutionPoints",
    baseline.caseStudy.solutionPoints,
    document.caseStudy?.solutionPoints,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.resultPoints",
    baseline.caseStudy.resultPoints,
    document.caseStudy?.resultPoints,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.gallery.count",
    baseline.caseStudy.gallery?.length || 0,
    document.caseStudy?.gallery?.length || 0,
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.gallery.alt",
    baseline.caseStudy.gallery?.map((image) => image.alt) || [],
    document.caseStudy?.gallery?.map((image) => image.alt) || [],
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "caseStudy.gallery.assets",
    baseline.caseStudy.gallery?.map(() => true) || [],
    document.caseStudy?.gallery?.map((image) => Boolean(image.asset?._ref)) || [],
  );
  pushIfDifferent(
    differences,
    baseline.slug,
    "faqItems",
    baseline.faqItems,
    (document.faqItems || []).map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return differences;
}

async function main() {
  const args = parseArgs(process.argv);
  const baseline = loadBaseline(args.baselinePath);
  const productIds = baseline.map((entry) => entry.documentId);
  const documents = await client.fetch<ProductDocument[]>(
    `*[_type == "product" && _id in $ids]{
      _id,
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
      faqItems[]{question,answer}
    }`,
    { ids: productIds },
  );
  const byId = new Map(documents.map((document) => [document._id, document]));
  const differences = baseline.flatMap((entry) =>
    compareProduct(entry, byId.get(entry.documentId)),
  );
  const absoluteReportPath = path.resolve(__dirname, "..", args.reportPath);

  writeFileSync(
    absoluteReportPath,
    `${JSON.stringify(differences, null, 2)}\n`,
    "utf8",
  );

  if (differences.length > 0) {
    console.error(
      `Found ${differences.length} product baseline differences. Report: ${absoluteReportPath}`,
    );
    process.exit(1);
  }

  console.log(`Baseline matches for ${baseline.length} products`);
  console.log(`Report file: ${absoluteReportPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
