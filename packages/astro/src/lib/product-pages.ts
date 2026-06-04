import {
  defaultProductBlogs,
  defaultProductHighlights,
  defaultProductProcess,
  defaultProductStats,
  productPages as localProductPages,
  type ProductFaq,
  type ProductImage,
  type ProductPageData,
} from "../data/products";
import {
  fetchSanityQuery,
  sanityImageUrl,
  type SanityImageSource,
} from "./sanity";

type SanityImageWithAlt = SanityImageSource & {
  alt?: string;
};

type SanityCaseStudy = {
  title?: string;
  description?: string;
  image?: SanityImageWithAlt;
  bullets?: string[];
  quote?: string;
  quoteAuthor?: string;
  challenge?: string;
  solutionIntro?: string;
  solutionPoints?: string[];
  resultPoints?: string[];
  gallery?: SanityImageWithAlt[];
};

type SanityProductDocument = {
  _id: string;
  _createdAt: string;
  name?: string;
  slug?: string;
  pageTitle?: string;
  seoTitle?: string;
  metaDescription?: string;
  hero?: {
    title?: string;
    description?: string;
    image?: SanityImageWithAlt;
  };
  megaMenuCard?: {
    image?: SanityImageWithAlt;
  };
  whatAreCustom?: {
    title?: string;
    overview?: string;
  };
  caseStudy?: SanityCaseStudy;
  faqItems?: Array<{
    question?: string;
    answer?: string;
  }>;
};

export type ResolvedProductPageData = ProductPageData & {
  seoTitle: string;
};

export type ProductMenuItemData = {
  title: string;
  href: string;
  alt: string;
  image: ProductImage;
};

const enableLocalProductFallback =
  import.meta.env.PUBLIC_PRODUCTS_ENABLE_LOCAL_FALLBACK?.trim().toLowerCase() !== "false";

const SANITY_PRODUCT_PAGE_FIELDS = `
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  pageTitle,
  seoTitle,
  metaDescription,
  hero{
    title,
    description,
    "image": image{
      _type,
      asset,
      alt,
      "dimensions": asset->metadata.dimensions
    }
  },
  megaMenuCard{
    "image": image{
      _type,
      asset,
      alt,
      "dimensions": asset->metadata.dimensions
    }
  },
  whatAreCustom{
    title,
    overview
  },
  caseStudy{
    title,
    description,
    "image": image{
      _type,
      asset,
      alt,
      "dimensions": asset->metadata.dimensions
    },
    bullets,
    quote,
    quoteAuthor,
    challenge,
    solutionIntro,
    solutionPoints,
    resultPoints,
    gallery[]{
      _type,
      asset,
      alt,
      "dimensions": asset->metadata.dimensions
    }
  },
  faqItems[]{
    question,
    answer
  }
`;

const SANITY_PRODUCT_PAGES_QUERY = `
  *[
    _type == "product" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ] | order(_createdAt asc) {
    ${SANITY_PRODUCT_PAGE_FIELDS}
  }
`;

let productDocumentsPromise: Promise<SanityProductDocument[]> | undefined;

function toSanityProductImage(
  source: SanityImageWithAlt,
  altFallback: string,
  sanityKey: string,
): ProductImage {
  return {
    src: sanityImageUrl(source).width(1600).auto("format").fit("max").url(),
    alt: source.alt ?? altFallback,
    sanityKey,
    sanitySource: source,
    width: source.dimensions?.width,
    height: source.dimensions?.height,
  };
}

function hasSanityImage(
  source: SanityImageWithAlt | undefined,
): source is SanityImageWithAlt {
  return Boolean(source?.asset?._ref);
}

function getProductEntryTitle(
  document: SanityProductDocument,
): string | undefined {
  return (
    document.pageTitle?.trim()
    || document.hero?.title?.trim()
    || document.name?.trim()
  );
}

function isProductEntryEligible(
  document: SanityProductDocument,
): document is SanityProductDocument & {
  slug: string;
  metaDescription: string;
  hero: { image: SanityImageWithAlt; title?: string; description?: string };
  megaMenuCard: { image: SanityImageWithAlt };
} {
  return Boolean(
    document.slug
      && getProductEntryTitle(document)
      && document.metaDescription?.trim()
      && document.hero?.image?.asset?._ref
      && document.megaMenuCard?.image?.asset?._ref,
  );
}

function mapFaqs(
  sourceFaqs: SanityProductDocument["faqItems"] | undefined,
): ProductFaq[] {
  if (!sourceFaqs?.length) {
    return [];
  }

  const mappedFaqs = sourceFaqs
    .filter((item) => item.question?.trim() && item.answer?.trim())
    .map((item) => ({
      question: item.question!.trim(),
      answer: item.answer!.trim(),
    }));

  return mappedFaqs;
}

function buildCaseStudyFromSanity(
  document: SanityProductDocument,
  slug: string,
  fallbackImage: ProductImage,
  titleFallback: string,
): ProductPageData["caseStudy"] {
  const sourceCaseStudy = document.caseStudy;

  if (!sourceCaseStudy || !hasSanityImage(sourceCaseStudy.image)) {
    return {
      title: "",
      description: "",
      image: fallbackImage,
      bullets: [],
      quote: undefined,
      quoteAuthor: undefined,
      challenge: undefined,
      solutionIntro: undefined,
      solutionPoints: undefined,
      resultPoints: undefined,
      gallery: undefined,
    };
  }

  return {
    title: document.caseStudy?.title ?? "",
    description: document.caseStudy?.description ?? "",
    image: toSanityProductImage(
      sourceCaseStudy.image,
      sourceCaseStudy.image.alt ?? titleFallback,
      `sanity.products.${slug}.caseStudy.image`,
    ),
    bullets: sourceCaseStudy.bullets ?? [],
    quote: sourceCaseStudy.quote,
    quoteAuthor: sourceCaseStudy.quoteAuthor,
    challenge: sourceCaseStudy.challenge,
    solutionIntro: sourceCaseStudy.solutionIntro,
    solutionPoints: sourceCaseStudy.solutionPoints,
    resultPoints: sourceCaseStudy.resultPoints,
    gallery: sourceCaseStudy.gallery
      ?.filter(hasSanityImage)
      .map((image, index) =>
        toSanityProductImage(
          image,
          image.alt ?? titleFallback,
          `sanity.products.${slug}.caseStudy.gallery.${index}`,
        ),
      ),
  };
}

function mergeLocalProductPage(
  localPage: ProductPageData,
  document: SanityProductDocument & {
    slug: string;
    metaDescription: string;
    hero: { image: SanityImageWithAlt; title?: string; description?: string };
  },
): ResolvedProductPageData {
  const pageTitle = getProductEntryTitle(document) ?? localPage.title;
  const heroImage = toSanityProductImage(
    document.hero.image,
    document.hero.image.alt ?? localPage.heroImage.alt,
    `sanity.products.${localPage.slug}.hero`,
  );

  return {
    ...localPage,
    navLabel: document.name?.trim() || pageTitle,
    title: pageTitle,
    seoTitle: document.seoTitle ?? `${pageTitle} | ANAN PACK`,
    metaDescription: document.metaDescription,
    subtitle: document.hero?.description ?? "",
    heroImage,
    introTitle: document.whatAreCustom?.title,
    overview: document.whatAreCustom?.overview ?? "",
    caseStudy: buildCaseStudyFromSanity(
      document,
      localPage.slug,
      heroImage,
      pageTitle,
    ),
    faqs: mapFaqs(document.faqItems),
  };
}

function buildSanityOnlyProductPage(
  document: SanityProductDocument,
): ResolvedProductPageData | null {
  const fallbackPage = enableLocalProductFallback ? localProductPages[0] : undefined;
  if (!isProductEntryEligible(document)) {
    return null;
  }

  const slug = document.slug;
  const title = getProductEntryTitle(document) ?? document.slug;
  const heroImage = toSanityProductImage(
    document.hero.image,
    document.hero.image.alt ?? title,
    `sanity.products.${slug}.hero`,
  );

  return {
    slug,
    navLabel: document.name ?? title,
    title,
    seoTitle: document.seoTitle ?? `${title} | ANAN PACK`,
    metaDescription: document.metaDescription,
    subtitle: document.hero?.description ?? "",
    heroImage,
    introTitle: document.whatAreCustom?.title,
    overview: document.whatAreCustom?.overview ?? "",
    highlights: enableLocalProductFallback ? [...defaultProductHighlights] : [],
    stats: enableLocalProductFallback ? defaultProductStats.map((item) => ({ ...item })) : [],
    featureBand: enableLocalProductFallback ? fallbackPage?.featureBand : undefined,
    categories: [],
    materials: [],
    applications: [],
    process: enableLocalProductFallback ? defaultProductProcess.map((step) => ({ ...step })) : [],
    processSubtitle: enableLocalProductFallback ? fallbackPage?.processSubtitle : undefined,
    caseStudy: buildCaseStudyFromSanity(document, slug, heroImage, title),
    blogs: enableLocalProductFallback
      ? defaultProductBlogs.map((card) => ({
          ...card,
          image: { ...card.image },
        }))
      : [],
    faqs: mapFaqs(document.faqItems),
  };
}

async function getSanityProductDocuments(): Promise<SanityProductDocument[]> {
  if (!productDocumentsPromise) {
    productDocumentsPromise = (async () => {
      try {
        return await fetchSanityQuery<SanityProductDocument[]>(
          SANITY_PRODUCT_PAGES_QUERY,
        );
      } catch {
        return [];
      }
    })();
  }

  return productDocumentsPromise;
}

export async function getAllProductPages(): Promise<ResolvedProductPageData[]> {
  const documents = (await getSanityProductDocuments()).filter(isProductEntryEligible);

  if (!enableLocalProductFallback) {
    return documents
      .map(buildSanityOnlyProductPage)
      .filter(Boolean) as ResolvedProductPageData[];
  }

  const localPagesBySlug = new Map(
    localProductPages.map((page) => [page.slug, page] as const),
  );

  return documents
    .map((document) => {
      const localPage = localPagesBySlug.get(document.slug);
      return localPage
        ? mergeLocalProductPage(localPage, document)
        : buildSanityOnlyProductPage(document);
    })
    .filter(Boolean) as ResolvedProductPageData[];
}

export async function getProductPageBySlug(
  slug: string,
): Promise<ResolvedProductPageData | null> {
  const pages = await getAllProductPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function getProductMenuItems(): Promise<ProductMenuItemData[]> {
  const documents = (await getSanityProductDocuments()).filter(isProductEntryEligible);

  return documents
    .map((document) => {
      const href = `/products/${document.slug}`;
      const title = document.name ?? getProductEntryTitle(document) ?? document.slug;
      const alt = document.megaMenuCard?.image?.alt ?? title;

      return {
        title,
        href,
        alt,
        image: toSanityProductImage(
          document.megaMenuCard!.image!,
          alt,
          `sanity.products.${document.slug}.megaMenuCard`,
        ),
      } satisfies ProductMenuItemData;
    });
}
