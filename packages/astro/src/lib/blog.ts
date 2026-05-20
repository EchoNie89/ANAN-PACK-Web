import {
  blogArticles as fallbackBlogArticles,
  blogCategories,
  getBlogCategory,
  type BlogArticle as LegacyBlogArticle,
  type BlogCategory,
  type BlogCategorySlug,
} from "../data/blog";
import type { SiteImageSource } from "./local-images";
import {
  sanityClient,
  sanityImageUrl,
  type SanityImageDimensions,
  type SanityImageSource,
} from "./sanity";

export { blogCategories, getBlogCategory };
export type { BlogCategory, BlogCategorySlug };

type ListStyle = "bullet" | "number";

interface PortableTextSpan {
  _type?: "span";
  text?: string;
  marks?: string[];
}

interface PortableTextMarkDef {
  _key?: string;
  _type?: string;
  href?: string;
  openInNewTab?: boolean;
}

interface PortableTextTextBlock {
  _key?: string;
  _type?: "block";
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
  listItem?: ListStyle;
  level?: number;
}

interface PortableTextImageBlock extends SanityImageSource {
  _key?: string;
  _type?: "image";
  alt?: string;
  caption?: string;
}

interface SanityBlogPostDocument {
  _id?: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  readTimeMinutes?: number | null;
  heroSummary?: string | null;
  heroImage?: (SanityImageSource & {
    alt?: string | null;
    caption?: string | null;
  }) | null;
  body?: Array<PortableTextTextBlock | PortableTextImageBlock | null> | null;
}

export interface BlogImage {
  src: SiteImageSource;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  sanitySource?: SanityImageSource;
}

export type BlogBodyBlock =
  | {
      _key: string;
      type: "heading";
      level: 2 | 3;
      html: string;
    }
  | {
      _key: string;
      type: "paragraph";
      html: string;
    }
  | {
      _key: string;
      type: "quote";
      html: string;
    }
  | {
      _key: string;
      type: "list";
      style: ListStyle;
      items: string[];
    }
  | {
      _key: string;
      type: "image";
      image: BlogImage;
    };

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: BlogCategorySlug;
  publishedAt: string;
  readTimeMinutes: number;
  readTime: string;
  heroImage: BlogImage;
  heroSummary?: string;
  body: BlogBodyBlock[];
}

const BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishedAt desc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    publishedAt,
    readTimeMinutes,
    heroSummary,
    "heroImage": heroImage{
      _type,
      asset,
      crop,
      hotspot,
      alt,
      caption,
      "dimensions": asset->metadata.dimensions
    },
    body[]{
      ...,
      ...select(
        _type == "image" => {
          _type,
          asset,
          crop,
          hotspot,
          alt,
          caption,
          "dimensions": asset->metadata.dimensions
        }
      )
    }
  }
`;

const BLOG_FETCH_TIMEOUT_MS = 5000;

let blogArticlesPromise: Promise<BlogArticle[]> | null = null;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("\n", "<br />");
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function createBlockKey(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

function isBlogCategorySlug(value: string): value is BlogCategorySlug {
  return value === "material-guides" || value === "production-knowledge" || value === "industry-insights";
}

function buildReadTime(minutes: number): string {
  return `${minutes} min read`;
}

function parseLegacyReadTime(readTime: string): number {
  const matchedMinutes = readTime.match(/\d+/);
  const minutes = matchedMinutes ? Number.parseInt(matchedMinutes[0], 10) : 0;
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 1;
}

function mapLocalImage(source: SiteImageSource, alt: string, caption?: string): BlogImage {
  return {
    src: source,
    alt,
    caption,
    width: typeof source === "string" ? undefined : source.width,
    height: typeof source === "string" ? undefined : source.height,
  };
}

function mapSanityImage(
  source: SanityImageSource,
  alt: string,
  options?: { caption?: string; width?: number },
): BlogImage {
  const targetWidth = options?.width ?? 1600;

  return {
    src: sanityImageUrl(source).width(targetWidth).auto("format").fit("max").url(),
    alt,
    caption: options?.caption,
    width: source.dimensions?.width,
    height: source.dimensions?.height,
    sanitySource: source,
  };
}

function normalizeLegacyBody(article: LegacyBlogArticle): BlogBodyBlock[] {
  const blocks: BlogBodyBlock[] = [];
  let blockIndex = 0;

  for (const paragraph of article.lead) {
    blocks.push({
      _key: createBlockKey(article.slug, blockIndex++),
      type: "paragraph",
      html: escapeHtml(paragraph),
    });
  }

  for (const section of article.sections) {
    if (section.title) {
      blocks.push({
        _key: createBlockKey(article.slug, blockIndex++),
        type: "heading",
        level: 2,
        html: escapeHtml(section.title),
      });
    }

    if (section.image) {
      blocks.push({
        _key: createBlockKey(article.slug, blockIndex++),
        type: "image",
        image: mapLocalImage(section.image.src, section.image.alt, section.image.caption),
      });
    }

    for (const paragraph of section.paragraphs ?? []) {
      blocks.push({
        _key: createBlockKey(article.slug, blockIndex++),
        type: "paragraph",
        html: escapeHtml(paragraph),
      });
    }

    if (section.bullets?.length) {
      blocks.push({
        _key: createBlockKey(article.slug, blockIndex++),
        type: "list",
        style: "bullet",
        items: section.bullets.map((bullet) => escapeHtml(bullet)),
      });
    }
  }

  return blocks;
}

function normalizeFallbackArticle(article: LegacyBlogArticle): BlogArticle {
  const readTimeMinutes = parseLegacyReadTime(article.readTime);
  const heroSource = article.heroImage ?? article.image;

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    metaDescription: article.metaDescription || article.excerpt,
    category: article.category,
    publishedAt: article.publishedAt,
    readTimeMinutes,
    readTime: buildReadTime(readTimeMinutes),
    heroImage: mapLocalImage(heroSource, article.imageAlt),
    heroSummary: article.heroSummary,
    body: normalizeLegacyBody(article),
  };
}

function renderPortableTextChildrenToHtml(
  children: PortableTextSpan[] = [],
  markDefs: PortableTextMarkDef[] = [],
): string {
  const markDefMap = new Map(
    markDefs
      .filter((definition): definition is PortableTextMarkDef & { _key: string } => Boolean(definition?._key))
      .map((definition) => [definition._key, definition]),
  );

  return children
    .map((child) => {
      let html = escapeHtml(child.text ?? "");

      for (const mark of child.marks ?? []) {
        if (mark === "strong") {
          html = `<strong>${html}</strong>`;
          continue;
        }

        if (mark === "em") {
          html = `<em>${html}</em>`;
          continue;
        }

        if (mark === "code") {
          html = `<code class="rounded bg-surface-muted px-1.5 py-0.5 text-[0.95em] text-ink">${html}</code>`;
          continue;
        }

        const definition = markDefMap.get(mark);

        if (definition?._type === "link" && definition.href) {
          const target = definition.openInNewTab ? ' target="_blank" rel="noreferrer noopener"' : "";
          html = `<a href="${escapeAttribute(definition.href)}" class="text-brand underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand"${target}>${html}</a>`;
        }
      }

      return html;
    })
    .join("");
}

function normalizePortableTextBody(
  body: Array<PortableTextTextBlock | PortableTextImageBlock | null> | null | undefined,
): BlogBodyBlock[] {
  const normalizedBlocks: BlogBodyBlock[] = [];
  let blockIndex = 0;
  let pendingList:
    | {
        style: ListStyle;
        level: number;
        items: string[];
        key: string;
      }
    | null = null;

  const flushList = () => {
    if (!pendingList || !pendingList.items.length) {
      pendingList = null;
      return;
    }

    normalizedBlocks.push({
      _key: pendingList.key,
      type: "list",
      style: pendingList.style,
      items: pendingList.items,
    });
    pendingList = null;
  };

  for (const block of body ?? []) {
    if (!block) continue;

    if (block._type === "image" && block.asset?._ref) {
      flushList();
      normalizedBlocks.push({
        _key: block._key ?? createBlockKey("blog-image", blockIndex++),
        type: "image",
        image: mapSanityImage(block, block.alt?.trim() || "", {
          caption: block.caption?.trim(),
          width: 1280,
        }),
      });
      continue;
    }

    if (block._type !== "block") {
      continue;
    }

    const html = renderPortableTextChildrenToHtml(block.children, block.markDefs).trim();

    if (!html) {
      if (!block.listItem) {
        flushList();
      }
      continue;
    }

    if (block.listItem === "bullet" || block.listItem === "number") {
      if (
        !pendingList ||
        pendingList.style !== block.listItem ||
        pendingList.level !== (block.level ?? 1)
      ) {
        flushList();
        pendingList = {
          style: block.listItem,
          level: block.level ?? 1,
          items: [],
          key: block._key ?? createBlockKey("blog-list", blockIndex++),
        };
      }

      pendingList.items.push(html);
      continue;
    }

    flushList();

    if (block.style === "h2" || block.style === "h3") {
      normalizedBlocks.push({
        _key: block._key ?? createBlockKey("blog-heading", blockIndex++),
        type: "heading",
        level: block.style === "h2" ? 2 : 3,
        html,
      });
      continue;
    }

    if (block.style === "blockquote") {
      normalizedBlocks.push({
        _key: block._key ?? createBlockKey("blog-quote", blockIndex++),
        type: "quote",
        html,
      });
      continue;
    }

    normalizedBlocks.push({
      _key: block._key ?? createBlockKey("blog-paragraph", blockIndex++),
      type: "paragraph",
      html,
    });
  }

  flushList();
  return normalizedBlocks;
}

function normalizeSanityArticle(article: SanityBlogPostDocument): BlogArticle | null {
  const slug = article.slug?.trim();
  const title = article.title?.trim();
  const excerpt = article.excerpt?.trim();
  const category = article.category?.trim();
  const publishedAt = article.publishedAt?.trim();
  const readTimeMinutes = article.readTimeMinutes ?? 0;
  const heroImage = article.heroImage;

  if (
    !slug ||
    !title ||
    !excerpt ||
    !publishedAt ||
    !category ||
    !isBlogCategorySlug(category) ||
    !Number.isFinite(readTimeMinutes) ||
    readTimeMinutes <= 0 ||
    !heroImage?.asset?._ref
  ) {
    return null;
  }

  return {
    slug,
    title,
    excerpt,
    metaDescription: excerpt,
    category,
    publishedAt,
    readTimeMinutes,
    readTime: buildReadTime(readTimeMinutes),
    heroImage: mapSanityImage(heroImage, heroImage.alt?.trim() || title, {
      caption: heroImage.caption?.trim(),
      width: 1600,
    }),
    heroSummary: article.heroSummary?.trim() || undefined,
    body: normalizePortableTextBody(article.body),
  };
}

const fallbackArticles = fallbackBlogArticles.map(normalizeFallbackArticle);

async function fetchSanityBlogArticles(): Promise<BlogArticle[]> {
  if (!import.meta.env.SANITY_PROJECT_ID) {
    return fallbackArticles;
  }

  try {
    const documents = await Promise.race([
      sanityClient.fetch<SanityBlogPostDocument[]>(BLOG_POSTS_QUERY),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timed out fetching blog posts")), BLOG_FETCH_TIMEOUT_MS),
      ),
    ]);

    const normalizedArticles = documents
      .map((document) => normalizeSanityArticle(document))
      .filter((article): article is BlogArticle => Boolean(article));

    return normalizedArticles.length ? normalizedArticles : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export async function getAllBlogArticles(): Promise<BlogArticle[]> {
  if (!blogArticlesPromise) {
    blogArticlesPromise = fetchSanityBlogArticles();
  }

  return blogArticlesPromise;
}

export async function getBlogArticleBySlug(slug: string): Promise<BlogArticle | undefined> {
  return (await getAllBlogArticles()).find((article) => article.slug === slug);
}

export function getFeaturedBlogArticles(articles: BlogArticle[]): BlogArticle[] {
  return articles.filter((article) =>
    ["material-guides", "production-knowledge"].includes(article.category),
  );
}

export function getIndustryInsightArticles(articles: BlogArticle[]): BlogArticle[] {
  return articles.filter((article) => article.category === "industry-insights");
}

export function parsePublishedDate(publishedAt: string): Date {
  const normalizedDate = publishedAt.slice(0, 10);
  return new Date(`${normalizedDate}T00:00:00`);
}
