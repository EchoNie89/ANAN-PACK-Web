import type { APIRoute } from "astro";
import { getSiteUrl } from "../lib/seo";

export const GET: APIRoute = () => {
  const siteUrl = getSiteUrl();
  const sitemapLine = siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : "";

  return new Response(`User-agent: *\nAllow: /\n${sitemapLine}`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
