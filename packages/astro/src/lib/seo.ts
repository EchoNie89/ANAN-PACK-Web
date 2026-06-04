import { getLocalImage, type SiteImageSource } from "./local-images";
import type { SiteSettings } from "./site-settings";

export interface SeoImageLike {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface SeoBreadcrumbItem {
  label: string;
  href?: string;
}

export interface CollectionPageItem {
  name: string;
  url: string;
}

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

const DEFAULT_SITE_NAME = "ANAN PACK";
const DEFAULT_LOCALE = "en_US";
const SITE_LOGO = getLocalImage("/images/home/anan-pack-logo.png");

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteName(): string {
  return DEFAULT_SITE_NAME;
}

export function getSiteUrl(): string | undefined {
  const value = import.meta.env.PUBLIC_SITE_URL?.trim();
  return value ? trimTrailingSlash(value) : undefined;
}

export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function toAbsoluteUrl(
  value: string,
  siteUrl = getSiteUrl(),
): string | undefined {
  if (isAbsoluteUrl(value)) {
    return value;
  }

  if (!siteUrl) {
    return undefined;
  }

  return new URL(value.startsWith("/") ? value : `/${value}`, `${siteUrl}/`).toString();
}

export function resolveSeoImage(
  value?: SiteImageSource | SeoImageLike | null,
): SeoImageLike | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return { src: value };
  }

  if ("src" in value && typeof value.src === "string") {
    return {
      src: value.src,
      width: value.width,
      height: value.height,
      alt: "alt" in value && typeof value.alt === "string" ? value.alt : undefined,
    };
  }

  return null;
}

export function buildOrganizationJsonLd(
  siteSettings: SiteSettings,
): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const logoUrl = toAbsoluteUrl(SITE_LOGO.src, siteUrl) ?? SITE_LOGO.src;
  const sameAs = siteSettings.socialMedia.map((item) => item.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: DEFAULT_SITE_NAME,
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(logoUrl
      ? {
          logo: {
            "@type": "ImageObject",
            url: logoUrl,
          },
        }
      : {}),
    email: siteSettings.contactDetails.email,
    telephone: siteSettings.contactDetails.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.contactDetails.address,
      addressLocality: siteSettings.contactDetails.location,
      addressCountry: "CN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteSettings.contactDetails.email,
        telephone: siteSettings.contactDetails.phone,
        areaServed: "Worldwide",
        availableLanguage: ["en"],
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildWebsiteJsonLd(): Record<string, unknown> | null {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: DEFAULT_SITE_NAME,
    url: siteUrl,
    inLanguage: "en",
  };
}

export function buildWebPageJsonLd({
  title,
  description,
  type = "WebPage",
  url,
  image,
}: {
  title: string;
  description: string;
  type?: string;
  url?: string;
  image?: string;
}): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    inLanguage: "en",
    ...(url ? { url } : {}),
    ...(siteUrl
      ? {
          isPartOf: {
            "@type": "WebSite",
            name: DEFAULT_SITE_NAME,
            url: siteUrl,
          },
        }
      : {}),
    ...(image ? { primaryImageOfPage: image } : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: SeoBreadcrumbItem[],
): Record<string, unknown> | null {
  if (items.length < 2) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: toAbsoluteUrl(item.href) } : {}),
    })),
  };
}

export function buildBlogPostingJsonLd({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  section,
}: {
  title: string;
  description: string;
  url?: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  section?: string;
}): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const logoUrl = toAbsoluteUrl(SITE_LOGO.src, siteUrl) ?? SITE_LOGO.src;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    ...(url ? { mainEntityOfPage: url, url } : {}),
    ...(image ? { image: [image] } : {}),
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    ...(section ? { articleSection: section } : {}),
    author: {
      "@type": "Organization",
      name: DEFAULT_SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: DEFAULT_SITE_NAME,
      ...(logoUrl
        ? {
            logo: {
              "@type": "ImageObject",
              url: logoUrl,
            },
          }
        : {}),
    },
    inLanguage: "en",
  };
}

export function buildCollectionPageJsonLd({
  title,
  description,
  url,
  items,
}: {
  title: string;
  description: string;
  url?: string;
  items: CollectionPageItem[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    ...(url ? { url } : {}),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function buildFaqJsonLd(
  items: FaqJsonLdItem[],
): Record<string, unknown> | null {
  if (!items.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildProductJsonLd({
  name,
  description,
  url,
  image,
  category,
}: {
  name: string;
  description: string;
  url?: string;
  image?: string;
  category?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(url ? { url } : {}),
    ...(image ? { image: [image] } : {}),
    ...(category ? { category } : {}),
    brand: {
      "@type": "Brand",
      name: DEFAULT_SITE_NAME,
    },
    manufacturer: {
      "@type": "Organization",
      name: DEFAULT_SITE_NAME,
    },
  };
}

export function buildServiceJsonLd({
  name,
  description,
  url,
  image,
  serviceType,
}: {
  name: string;
  description: string;
  url?: string;
  image?: string;
  serviceType?: string;
}): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    ...(url ? { url } : {}),
    ...(image ? { image: [image] } : {}),
    ...(serviceType ? { serviceType } : {}),
    provider: {
      "@type": "Organization",
      name: DEFAULT_SITE_NAME,
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    areaServed: "Worldwide",
  };
}

export function getDefaultLocale(): string {
  return DEFAULT_LOCALE;
}
