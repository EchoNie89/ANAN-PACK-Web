// One-off: replace "| Tagora Packaging & Trims" suffix in product seoTitle with "| ANAN PACK".
// Only mutates the seoTitle field; leaves everything else untouched.
// Run from packages/sanity:  node scripts/fix-tagora-seo-titles.mjs [--dry-run]
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { HttpsProxyAgent } from "https-proxy-agent";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load packages/sanity/.env (same pattern as the seed scripts)
try {
  const envContent = readFileSync(resolve(__dirname, "..", ".env"), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

const OLD = "Tagora Packaging & Trims";
const NEW = "ANAN PACK";
const dryRun = process.argv.includes("--dry-run");

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("Missing SANITY_TOKEN in packages/sanity/.env");
  process.exit(1);
}

const proxyUrl =
  process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "44m142o0",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
  ...(proxyUrl ? { agent: new HttpsProxyAgent(proxyUrl) } : {}),
});

const products = await client.fetch(
  `*[_type == "product" && defined(seoTitle) && seoTitle match "*${OLD}*"]{_id, "slug": slug.current, seoTitle}`,
);

if (!products.length) {
  console.log("No product seoTitle contains the Tagora suffix. Nothing to do.");
  process.exit(0);
}

console.log(`Found ${products.length} product(s) to fix:`);
let tx = client.transaction();
for (const p of products) {
  const next = p.seoTitle.split(OLD).join(NEW);
  console.log(`- ${p.slug}\n    ${p.seoTitle}\n  → ${next}`);
  tx = tx.patch(p._id, (patch) => patch.set({ seoTitle: next }));
}

if (dryRun) {
  console.log("\nDry run — no writes made.");
  process.exit(0);
}

await tx.commit();
console.log(`\n✓ Updated ${products.length} product seoTitle(s).`);
