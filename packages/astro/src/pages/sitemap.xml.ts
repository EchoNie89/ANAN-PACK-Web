import type { APIRoute } from "astro";
import { productPages } from "../data/products";
import { solutionPages } from "../data/solutions";
import { getAllBlogArticles } from "../lib/blog";
import { getSiteUrl, toAbsoluteUrl } from "../lib/seo";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  priority?: string;
  changefreq?: string;
}

function buildUrlTag(entry: SitemapEntry): string {
  const parts = [`<loc>${entry.path}</loc>`];
  if (entry.lastmod) parts.push(`<lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq) parts.push(`<changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority) parts.push(`<priority>${entry.priority}</priority>`);
  return `<url>${parts.join("")}</url>`;
}

function resolveUrl(path: string, siteUrl: string): string | null {
  return toAbsoluteUrl(path, siteUrl);
}

const emptySitemap =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';

export const GET: APIRoute = async () => {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return new Response(emptySitemap, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }

  const today = new Date().toISOString().split("T")[0];
  const blogArticles = await getAllBlogArticles();

  const staticEntries: SitemapEntry[] = [
    { path: "/home", priority: "1.0", changefreq: "weekly" },
    { path: "/about-us", priority: "0.8", changefreq: "monthly" },
    { path: "/contact-us", priority: "0.9", changefreq: "monthly" },
    { path: "/services", priority: "0.8", changefreq: "weekly" },
    { path: "/services/faq", priority: "0.7", changefreq: "monthly" },
    { path: "/blog", priority: "0.8", changefreq: "weekly" },
  ];

  const entries: SitemapEntry[] = [
    ...staticEntries,
    ...productPages.map((p): SitemapEntry => ({
      path: `/products/${p.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    })),
    ...solutionPages.map((s): SitemapEntry => ({
      path: `/solutions/${s.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    })),
    ...blogArticles.map((a): SitemapEntry => ({
      path: `/blog/${a.slug}`,
      lastmod: a.publishedAt,
      priority: "0.6",
      changefreq: "monthly",
    })),
  ];

  const urls = entries
    .map((entry) => {
      const loc = resolveUrl(entry.path, siteUrl);
      return loc ? buildUrlTag({ ...entry, path: loc }) : null;
    })
    .filter(Boolean);

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls.join("") +
    "</urlset>";

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
