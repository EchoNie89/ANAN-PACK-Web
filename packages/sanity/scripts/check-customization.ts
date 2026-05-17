import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const envPath = resolve(__dirname, "..", ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "44m142o0",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN || "",
});

async function main() {
  const query = '*[_id == "product-labels"]{title, customizationGroups[]{title, intro, blocks[]{title}, images[]{alt}}}';
  const result = await client.fetch(query);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
