import type { SiteImageSource } from '../lib/local-images';
import { resolveLocalImageSource } from '../lib/local-images';
import type { SanityImageSource } from '../lib/sanity';
import type { ProductCustomizationBlock } from '../lib/customization-content';
import {
  commonBlogs as commonBlogSeeds,
  defaultProductWhyChoose as defaultProductWhyChooseSeeds,
  productShell,
  productSourcePages,
  type ProductCard as ProductCardSeed,
  type ProductCustomizationGroup as ProductCustomizationGroupSeed,
  type ProductFaq as ProductFaqSeed,
  type ProductFeature as ProductFeatureSeed,
  type ProductImage as ProductImageSeed,
  type ProductPageData as ProductPageSourceData,
  type ProductProcessIcon as ProductProcessIconSeed,
  type ProductProcessStep as ProductProcessStepSeed,
  type ProductShowcaseCard as ProductShowcaseCardSeed,
  type ProductShowcaseGroup as ProductShowcaseGroupSeed,
} from './product-source';

export type { ProductCustomizationBlock } from '../lib/customization-content';

export interface ProductImage {
  src: SiteImageSource;
  alt: string;
  sanityKey: string;
  sanitySource?: SanityImageSource;
  width?: number;
  height?: number;
}

export interface ProductCard {
  title: string;
  description?: string;
  image: ProductImage;
}

export interface ProductShowcaseCard extends Omit<ProductCard, 'title'> {
  title?: string;
}

export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export type ProductProcessIcon = ProductProcessIconSeed;

export interface ProductProcessStep {
  title: string;
  description: string;
  icon?: ProductProcessIcon;
}

export interface ProductShowcaseGroup {
  title: string;
  description?: string;
  cards: ProductShowcaseCard[];
}

export interface ProductCustomizationGroup {
  title: string;
  intro?: string;
  images?: ProductImage[];
  blocks: ProductCustomizationBlock[];
}

export interface ProductCtaData {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  note?: string;
}

export interface ProductPageData {
  slug: string;
  navLabel: string;
  title: string;
  metaDescription: string;
  subtitle: string;
  heroTone?: 'dark' | 'warm';
  heroAlign?: 'center' | 'left';
  heroOverlay?: 'default' | 'labels' | 'none';
  heroButtonPlacement?: 'default' | 'high';
  heroTitleLines?: string[];
  heroImage: ProductImage;
  introTitle?: string;
  overview: string;
  highlights: string[];
  stats: Array<{ value: string; label: string }>;
  featureBand?: ProductFeature[];
  showcaseGroups?: ProductShowcaseGroup[];
  applicationTitle?: string;
  applicationDescription?: string;
  applicationLayout?: 'grid' | 'balanced';
  categories: ProductCard[];
  materials: ProductCard[];
  applications: ProductCard[];
  customizationGroups?: ProductCustomizationGroup[];
  process: ProductProcessStep[];
  processSubtitle?: string;
  whyChooseTitle?: string;
  whyChoose?: ProductCard[];
  caseStudy: {
    title: string;
    description: string;
    image: ProductImage;
    bullets: string[];
    quote?: string;
    quoteAuthor?: string;
    challenge?: string;
    solutionIntro?: string;
    solutionPoints?: string[];
    resultPoints?: string[];
    gallery?: ProductImage[];
  };
  blogs: ProductCard[];
  faqs: ProductFaq[];
  cta?: ProductCtaData;
}

function toProductImage(seed: ProductImageSeed): ProductImage {
  return {
    src: resolveLocalImageSource(seed.imagePath),
    alt: seed.alt,
    sanityKey: seed.sanityKey,
    width: seed.width,
    height: seed.height,
  };
}

function toProductCard(seed: ProductCardSeed): ProductCard {
  return {
    title: seed.title,
    description: seed.description,
    image: toProductImage(seed.image),
  };
}

function toProductShowcaseCard(seed: ProductShowcaseCardSeed): ProductShowcaseCard {
  return {
    title: seed.title,
    description: seed.description,
    image: toProductImage(seed.image),
  };
}

function toProductFeature(seed: ProductFeatureSeed): ProductFeature {
  return { ...seed };
}

function toProductFaq(seed: ProductFaqSeed): ProductFaq {
  return { ...seed };
}

function toProductCustomizationBlock(
  seed: ProductCustomizationGroupSeed['blocks'][number],
): ProductCustomizationBlock {
  const block = seed;

  if (block._type === 'paragraphBlock') {
    return { ...block };
  }

  if (block._type === 'listBlock') {
    return {
      ...block,
      items: block.items ? [...block.items] : undefined,
    };
  }
}

function toProductCustomizationGroup(
  seed: ProductCustomizationGroupSeed,
): ProductCustomizationGroup {
  return {
    title: seed.title,
    intro: seed.intro,
    images: seed.images?.map(toProductImage),
    blocks: seed.blocks.map(toProductCustomizationBlock),
  };
}

function toProductShowcaseGroup(
  seed: ProductShowcaseGroupSeed,
): ProductShowcaseGroup {
  return {
    title: seed.title,
    description: seed.description,
    cards: seed.cards.map(toProductShowcaseCard),
  };
}

function toProductProcessStep(seed: ProductProcessStepSeed): ProductProcessStep {
  return { ...seed };
}

function toRuntimeProductPage(page: ProductPageSourceData): ProductPageData {
  return {
    ...page,
    heroImage: toProductImage(page.heroImage),
    highlights: [...page.highlights],
    stats: page.stats.map((item) => ({ ...item })),
    featureBand: page.featureBand?.map(toProductFeature),
    showcaseGroups: page.showcaseGroups?.map(toProductShowcaseGroup),
    categories: page.categories.map(toProductCard),
    materials: page.materials.map(toProductCard),
    applications: page.applications.map(toProductCard),
    customizationGroups: page.customizationGroups?.map(
      toProductCustomizationGroup,
    ),
    process: page.process.map(toProductProcessStep),
    whyChoose: page.whyChoose?.map(toProductCard),
    caseStudy: {
      ...page.caseStudy,
      bullets: [...page.caseStudy.bullets],
      solutionPoints: page.caseStudy.solutionPoints
        ? [...page.caseStudy.solutionPoints]
        : undefined,
      resultPoints: page.caseStudy.resultPoints
        ? [...page.caseStudy.resultPoints]
        : undefined,
      image: toProductImage(page.caseStudy.image),
      gallery: page.caseStudy.gallery?.map(toProductImage),
    },
    blogs: page.blogs.map(toProductCard),
    faqs: page.faqs.map(toProductFaq),
    cta: page.cta ? { ...page.cta } : undefined,
  };
}

export const defaultProductStats = productShell.stats.map((item) => ({
  ...item,
}));

export const defaultProductHighlights = [...productShell.highlights];

export const defaultProductProcess = productShell.process.map((step) =>
  toProductProcessStep(step),
);

export const defaultProductBlogs = commonBlogSeeds.map((card) =>
  toProductCard(card),
);

export const defaultProductWhyChoose = defaultProductWhyChooseSeeds.map((card) =>
  toProductCard(card),
);

export const productPages: ProductPageData[] = productSourcePages.map(
  toRuntimeProductPage,
);

export const getProductBySlug = (slug: string) =>
  productPages.find((product) => product.slug === slug);
