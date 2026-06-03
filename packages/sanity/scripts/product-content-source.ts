import {
  normalizeCustomizationBlock,
  type CustomizationMarkerStyle,
} from "../../astro/src/lib/customization-content";
import {
  productSourcePages,
  type ProductCard,
  type ProductCustomizationGroup,
  type ProductFaq,
  type ProductImage,
  type ProductPageData,
  type ProductShowcaseGroup,
} from "../../astro/src/data/product-source";

export type ProductBaselineImage = {
  imagePath: string;
  alt: string;
};

export type ProductBaselineCard = {
  title: string;
  description?: string;
  image: ProductBaselineImage;
};

type ProductBaselineCustomizationDetailGroup = {
  label?: string;
  markerStyle: CustomizationMarkerStyle;
  items: string[];
  note?: string;
};

type ProductBaselineCustomizationEntry = {
  title?: string;
  paragraphs?: string[];
  detailGroups?: ProductBaselineCustomizationDetailGroup[];
  note?: string;
};

export type ProductBaselineCustomizationBlock =
  | {
      _type: "paragraphBlock";
      text: string;
    }
  | {
      _type: "listBlock";
      title?: string;
      markerStyle: CustomizationMarkerStyle;
      items: string[];
      note?: string;
    }
  | {
      _type: "entryListBlock";
      title?: string;
      markerStyle: CustomizationMarkerStyle;
      entries: ProductBaselineCustomizationEntry[];
    };

export type ProductBaselineCustomizationGroup = {
  title: string;
  intro?: string;
  images?: ProductBaselineImage[];
  blocks: ProductBaselineCustomizationBlock[];
};

export type ProductBaselineFaqItem = {
  question: string;
  answer: string;
};

export type ProductBaselineEntry = {
  slug: string;
  documentId: string;
  name: string;
  pageTitle: string;
  seoTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    description: string;
    image: ProductBaselineImage;
  };
  megaMenuCard: {
    image: ProductBaselineImage;
  };
  whatAreCustom: {
    title?: string;
    overview: string;
  };
  caseStudy: {
    title: string;
    description: string;
    image: ProductBaselineImage;
    bullets: string[];
    quote?: string;
    quoteAuthor?: string;
    challenge?: string;
    solutionIntro?: string;
    solutionPoints?: string[];
    resultPoints?: string[];
    gallery?: ProductBaselineImage[];
  };
  faqItems: ProductBaselineFaqItem[];
  showcaseGroups?: Array<{
    title: string;
    cards: ProductBaselineCard[];
  }>;
  applicationTitle?: string;
  applicationDescription?: string;
  applications: ProductBaselineCard[];
  customizationGroups?: ProductBaselineCustomizationGroup[];
};

export const PRODUCT_SEO_TITLE_SUFFIX = " | Tagora Packaging & Trims";
export const PRODUCT_BASELINE_OUTPUT_PATH = "import-data/products/product-baseline.json";
export const PRODUCT_BASELINE_DIFF_PATH = "import-data/products/product-baseline-diff.json";

const megaMenuCardImageBySlug: Record<
  string,
  { imagePath: string; alt: string }
> = {
  labels: {
    imagePath: "/images/home/menu-labels.png",
    alt: "Custom woven labels",
  },
  patches: {
    imagePath: "/images/home/menu-patches.png",
    alt: "Custom embroidered patches",
  },
  ribbon: {
    imagePath: "/images/home/menu-ribbon.png",
    alt: "Printed ribbon rolls",
  },
  "tissue-paper": {
    imagePath: "/images/home/menu-tissue-paper.png",
    alt: "Custom printed tissue paper",
  },
  tape: {
    imagePath: "/images/home/menu-tape.png",
    alt: "Custom packaging tape",
  },
  bag: {
    imagePath: "/images/home/menu-bag.png",
    alt: "Custom drawstring bag",
  },
  "hanging-tag": {
    imagePath: "/images/home/menu-hanging-tag.png",
    alt: "Custom hang tag attached to apparel",
  },
  sticker: {
    imagePath: "/images/home/menu-sticker.png",
    alt: "Custom printed stickers",
  },
};

function normalizeImage(image: ProductImage): ProductBaselineImage {
  return {
    imagePath: image.imagePath,
    alt: image.alt,
  };
}

function normalizeCard(card: ProductCard): ProductBaselineCard {
  return {
    title: card.title,
    ...(card.description ? { description: card.description } : {}),
    image: normalizeImage(card.image),
  };
}

function normalizeProductCustomizationBlock(
  block: ProductCustomizationGroup["blocks"][number],
): ProductBaselineCustomizationBlock {
  const normalized = normalizeCustomizationBlock(block);

  if (normalized._type === "paragraphBlock") {
    return { ...normalized };
  }

  if (normalized._type === "listBlock") {
    return {
      ...normalized,
      items: [...normalized.items],
    };
  }

  return {
    ...normalized,
    entries: normalized.entries.map((entry) => ({
      ...entry,
      paragraphs: entry.paragraphs ? [...entry.paragraphs] : undefined,
      detailGroups: entry.detailGroups?.map((detailGroup) => ({
        ...detailGroup,
        items: [...detailGroup.items],
      })),
    })),
  };
}

function normalizeCustomizationGroup(
  group: ProductCustomizationGroup,
): ProductBaselineCustomizationGroup {
  return {
    title: group.title,
    ...(group.intro ? { intro: group.intro } : {}),
    ...(group.images?.length
      ? { images: group.images.map(normalizeImage) }
      : {}),
    blocks: group.blocks.map(normalizeProductCustomizationBlock),
  };
}

function normalizeFaqItem(faq: ProductFaq): ProductBaselineFaqItem {
  return {
    question: faq.question,
    answer: faq.answer,
  };
}

function buildMegaMenuCard(page: ProductPageData) {
  const mapped = megaMenuCardImageBySlug[page.slug];

  if (!mapped) {
    throw new Error(`Missing mega menu image mapping for product slug "${page.slug}"`);
  }

  return {
    image: {
      imagePath: mapped.imagePath,
      alt: mapped.alt,
    },
  };
}

export function buildProductBaselineEntry(
  page: ProductPageData,
): ProductBaselineEntry {
  return {
    slug: page.slug,
    documentId: `product-${page.slug}`,
    name: page.navLabel,
    pageTitle: page.title,
    seoTitle: `${page.title}${PRODUCT_SEO_TITLE_SUFFIX}`,
    metaDescription: page.metaDescription,
    hero: {
      title: page.title,
      description: page.subtitle,
      image: normalizeImage(page.heroImage),
    },
    megaMenuCard: buildMegaMenuCard(page),
    whatAreCustom: {
      ...(page.introTitle ? { title: page.introTitle } : {}),
      overview: page.overview,
    },
    caseStudy: {
      title: page.caseStudy.title,
      description: page.caseStudy.description,
      image: normalizeImage(page.caseStudy.image),
      bullets: [...page.caseStudy.bullets],
      ...(page.caseStudy.quote ? { quote: page.caseStudy.quote } : {}),
      ...(page.caseStudy.quoteAuthor
        ? { quoteAuthor: page.caseStudy.quoteAuthor }
        : {}),
      ...(page.caseStudy.challenge
        ? { challenge: page.caseStudy.challenge }
        : {}),
      ...(page.caseStudy.solutionIntro
        ? { solutionIntro: page.caseStudy.solutionIntro }
        : {}),
      ...(page.caseStudy.solutionPoints?.length
        ? { solutionPoints: [...page.caseStudy.solutionPoints] }
        : {}),
      ...(page.caseStudy.resultPoints?.length
        ? { resultPoints: [...page.caseStudy.resultPoints] }
        : {}),
      ...(page.caseStudy.gallery?.length
        ? { gallery: page.caseStudy.gallery.map(normalizeImage) }
        : {}),
    },
    faqItems: page.faqs.map(normalizeFaqItem),
    ...(page.showcaseGroups?.length
      ? {
          showcaseGroups: page.showcaseGroups.map((group: ProductShowcaseGroup) => ({
            title: group.title,
            cards: group.cards.map(normalizeCard),
          })),
        }
      : {}),
    ...(page.applicationTitle ? { applicationTitle: page.applicationTitle } : {}),
    ...(page.applicationDescription
      ? { applicationDescription: page.applicationDescription }
      : {}),
    applications: page.applications.map(normalizeCard),
    ...(page.customizationGroups?.length
      ? {
          customizationGroups: page.customizationGroups.map(
            normalizeCustomizationGroup,
          ),
        }
      : {}),
  };
}

export const productBaselineEntries = productSourcePages.map(
  buildProductBaselineEntry,
);

export const productBaselineBySlug = new Map(
  productBaselineEntries.map((entry) => [entry.slug, entry]),
);

export function getProductBaselineBySlug(slug: string): ProductBaselineEntry {
  const entry = productBaselineBySlug.get(slug);

  if (!entry) {
    throw new Error(`Unsupported product slug "${slug}" in local product baseline`);
  }

  return entry;
}
