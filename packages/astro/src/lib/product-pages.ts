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
import { productMenuItems as localProductMenuItems } from "../data/home";
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

function mergeFaqs(
  localFaqs: ProductFaq[],
  sourceFaqs: SanityProductDocument["faqItems"] | undefined,
): ProductFaq[] {
  if (!sourceFaqs?.length) {
    return localFaqs;
  }

  const mappedFaqs = sourceFaqs
    .filter((item) => item.question?.trim() && item.answer?.trim())
    .map((item) => ({
      question: item.question!.trim(),
      answer: item.answer!.trim(),
    }));

  return mappedFaqs.length ? mappedFaqs : localFaqs;
}

function mergeCaseStudy(
  localPage: ProductPageData,
  document: SanityProductDocument,
): ProductPageData["caseStudy"] {
  const localCaseStudy = localPage.caseStudy;
  const sourceCaseStudy = document.caseStudy;

  if (!sourceCaseStudy) {
    return localCaseStudy;
  }

  return {
    ...localCaseStudy,
    title: sourceCaseStudy.title ?? localCaseStudy.title,
    description: sourceCaseStudy.description ?? localCaseStudy.description,
    image:
      sourceCaseStudy.image?.asset?._ref
        ? toSanityProductImage(
            sourceCaseStudy.image,
            sourceCaseStudy.image.alt ?? localCaseStudy.image.alt,
            `sanity.products.${localPage.slug}.caseStudy.image`,
          )
        : localCaseStudy.image,
    bullets:
      sourceCaseStudy.bullets?.length
        ? sourceCaseStudy.bullets
        : localCaseStudy.bullets,
    quote: sourceCaseStudy.quote ?? localCaseStudy.quote,
    quoteAuthor: sourceCaseStudy.quoteAuthor ?? localCaseStudy.quoteAuthor,
    challenge: sourceCaseStudy.challenge ?? localCaseStudy.challenge,
    solutionIntro:
      sourceCaseStudy.solutionIntro ?? localCaseStudy.solutionIntro,
    solutionPoints:
      sourceCaseStudy.solutionPoints?.length
        ? sourceCaseStudy.solutionPoints
        : localCaseStudy.solutionPoints,
    resultPoints:
      sourceCaseStudy.resultPoints?.length
        ? sourceCaseStudy.resultPoints
        : localCaseStudy.resultPoints,
    gallery:
      sourceCaseStudy.gallery?.length
        ? sourceCaseStudy.gallery
            .filter((image) => image.asset?._ref)
            .map((image, index) =>
              toSanityProductImage(
                image,
                image.alt ?? localCaseStudy.gallery?.[index]?.alt ?? localCaseStudy.image.alt,
                `sanity.products.${localPage.slug}.caseStudy.gallery.${index}`,
              ),
            )
        : localCaseStudy.gallery,
  };
}

function mergeLocalProductPage(
  localPage: ProductPageData,
  document: SanityProductDocument | undefined,
): ResolvedProductPageData {
  const pageTitle =
    document?.pageTitle ?? document?.hero?.title ?? localPage.title;

  return {
    ...localPage,
    navLabel: document?.name ?? localPage.navLabel,
    title: pageTitle,
    seoTitle: document?.seoTitle ?? `${pageTitle} | Tagora Packaging & Trims`,
    metaDescription: document?.metaDescription ?? localPage.metaDescription,
    subtitle: document?.hero?.description ?? localPage.subtitle,
    heroImage:
      document?.hero?.image?.asset?._ref
        ? toSanityProductImage(
            document.hero.image,
            document.hero.image.alt ?? localPage.heroImage.alt,
            `sanity.products.${localPage.slug}.hero`,
          )
        : localPage.heroImage,
    introTitle: document?.whatAreCustom?.title ?? localPage.introTitle,
    overview: document?.whatAreCustom?.overview ?? localPage.overview,
    caseStudy: mergeCaseStudy(localPage, document ?? { _id: "", _createdAt: "" }),
    faqs: mergeFaqs(localPage.faqs, document?.faqItems),
  };
}

function buildSanityOnlyProductPage(
  document: SanityProductDocument,
): ResolvedProductPageData | null {
  const fallbackPage = enableLocalProductFallback ? localProductPages[0] : undefined;
  const slug = document.slug;
  const title = document.pageTitle ?? document.hero?.title ?? document.name;
  const heroImage = document.hero?.image?.asset?._ref
    ? toSanityProductImage(
        document.hero.image,
        document.hero.image.alt ?? title ?? document.slug ?? "Product hero image",
        `sanity.products.${slug}.hero`,
      )
    : fallbackPage?.heroImage;

  if (!slug || !title || !heroImage || !document.metaDescription) {
    return null;
  }

  return {
    slug,
    navLabel: document.name ?? title,
    title,
    seoTitle: document.seoTitle ?? `${title} | Tagora Packaging & Trims`,
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
    caseStudy: {
      title: enableLocalProductFallback
        ? document.caseStudy?.title ?? title
        : document.caseStudy?.title ?? "",
      description: document.caseStudy?.description ?? "",
      image:
        document.caseStudy?.image?.asset?._ref
          ? toSanityProductImage(
              document.caseStudy.image,
              document.caseStudy.image.alt ?? title,
              `sanity.products.${slug}.caseStudy.image`,
            )
          : heroImage,
      bullets: document.caseStudy?.bullets ?? [],
      quote: document.caseStudy?.quote,
      quoteAuthor: document.caseStudy?.quoteAuthor,
      challenge: document.caseStudy?.challenge,
      solutionIntro: document.caseStudy?.solutionIntro,
      solutionPoints: document.caseStudy?.solutionPoints,
      resultPoints: document.caseStudy?.resultPoints,
      gallery: document.caseStudy?.gallery
        ?.filter((image) => image.asset?._ref)
        .map((image, index) =>
          toSanityProductImage(
            image,
            image.alt ?? title,
            `sanity.products.${slug}.caseStudy.gallery.${index}`,
          ),
        ),
    },
    blogs: enableLocalProductFallback
      ? defaultProductBlogs.map((card) => ({
          ...card,
          image: { ...card.image },
        }))
      : [],
    faqs: mergeFaqs([], document.faqItems),
  };
}

function mapLocalMenuImage(
  title: string,
  href: string,
  alt: string,
  src: ProductMenuItemData["image"]["src"],
): ProductMenuItemData {
  return {
    title,
    href,
    alt,
    image: {
      src,
      alt,
      sanityKey: `local.products.menu.${href}`,
    },
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
  const documents = await getSanityProductDocuments();
  const sanityOnlyPages = documents
    .map(buildSanityOnlyProductPage)
    .filter(Boolean) as ResolvedProductPageData[];

  if (!enableLocalProductFallback) {
    return sanityOnlyPages;
  }

  const documentsBySlug = new Map(
    documents
      .filter((document) => document.slug)
      .map((document) => [document.slug!, document]),
  );
  const mergedLocalPages = localProductPages.map((page) =>
    mergeLocalProductPage(page, documentsBySlug.get(page.slug)),
  );
  const localSlugs = new Set(localProductPages.map((page) => page.slug));
  const appendedSanityPages = documents
    .filter((document) => document.slug && !localSlugs.has(document.slug))
    .map(buildSanityOnlyProductPage)
    .filter(Boolean) as ResolvedProductPageData[];

  return [...mergedLocalPages, ...appendedSanityPages];
}

export async function getProductPageBySlug(
  slug: string,
): Promise<ResolvedProductPageData | null> {
  const pages = await getAllProductPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function getProductMenuItems(): Promise<ProductMenuItemData[]> {
  const documents = await getSanityProductDocuments();
  const sanityOnlyItems = documents
    .filter((document) => document.slug && document.megaMenuCard?.image?.asset?._ref)
    .map((document) => {
      const href = `/products/${document.slug}`;
      const title = document.name ?? document.pageTitle ?? document.slug!;
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

  if (!enableLocalProductFallback) {
    return sanityOnlyItems;
  }

  const localBySlug = new Map(
    localProductMenuItems.map((item) => {
      const slug = item.href.replace(/^\/products\//, "");
      return [
        slug,
        mapLocalMenuImage(item.title, item.href, item.alt, item.image),
      ] as const;
    }),
  );
  const mergedLocalItems = localProductMenuItems.map((item) => {
    const slug = item.href.replace(/^\/products\//, "");
    const document = documents.find((entry) => entry.slug === slug);

    if (!document?.megaMenuCard?.image?.asset?._ref) {
      return localBySlug.get(slug)!;
    }

    const title = document.name ?? item.title;
    const alt = document.megaMenuCard.image.alt ?? item.alt;

    return {
      title,
      href: item.href,
      alt,
      image: toSanityProductImage(
        document.megaMenuCard.image,
        alt,
        `sanity.products.${slug}.megaMenuCard`,
      ),
    } satisfies ProductMenuItemData;
  });
  const localSlugs = new Set(localProductMenuItems.map((item) => item.href.replace(/^\/products\//, "")));
  const appendedSanityItems = documents
    .filter((document) => document.slug && !localSlugs.has(document.slug))
    .filter((document) => document.megaMenuCard?.image?.asset?._ref)
    .map((document) => {
      const href = `/products/${document.slug}`;
      const title = document.name ?? document.pageTitle ?? document.slug!;
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

  return [...mergedLocalItems, ...appendedSanityItems];
}
