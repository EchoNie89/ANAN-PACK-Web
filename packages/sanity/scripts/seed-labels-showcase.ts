/**
 * Seed script: Import Labels Showcase data from Astro project into Sanity
 *
 * Usage:
 *   npx tsx scripts/seed-labels-showcase.ts
 *
 * Prerequisites:
 *   - Set SANITY_PROJECT_ID in your environment or .env file
 *   - Sanity dataset must exist (default: production)
 *   - Run `npx sanity cors add http://localhost:3333` if needed
 */

import { createClient } from "@sanity/client";
import { HttpsProxyAgent } from "https-proxy-agent";
import * as fs from "fs";
import * as path from "path";

// --- Configuration ---
const PROJECT_ID = process.env.SANITY_PROJECT_ID || "";
const DATASET = process.env.SANITY_DATASET || "production";
const ASTRO_PUBLIC_DIR = path.resolve(
  __dirname,
  "../../tagora-official-site/public"
);

if (!PROJECT_ID) {
  console.error("❌ SANITY_PROJECT_ID is required. Set it in environment or .env");
  process.exit(1);
}

// Proxy support for environments behind firewall
const proxyUrl =
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.http_proxy;

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN || "", // Needs write access token
  ...(proxyUrl ? { agent: new HttpsProxyAgent(proxyUrl) } : {}),
});

// --- Source Data (from labelsProduct.ts) ---
interface LabelImageItem {
  title: string;
  image: string;
  alt: string;
  description?: string;
}

interface LabelShowcaseGroup {
  title: string;
  cards: LabelImageItem[];
}

const labelShowcaseGroups: LabelShowcaseGroup[] = [
  {
    title: "Woven Labels",
    cards: [
      {
        title: "Damask Woven Labels",
        image: "/images/home/product-woven-labels.png",
        alt: "Damask woven labels with stitched logo details",
      },
      {
        title: "Satin Woven Labels",
        image: "/images/solutions/home-lifestyle-kit-2.png",
        alt: "Satin woven label samples",
      },
      {
        title: "Taffeta Woven Labels",
        image: "/images/solutions/fashion-gallery-3.png",
        alt: "Taffeta woven label detail",
      },
      {
        title: "High Density Woven Labels",
        image: "/images/home/menu-labels.png",
        alt: "High density woven label samples",
      },
    ],
  },
  {
    title: "Printed Labels",
    cards: [
      {
        title: "Satin Printed Labels",
        image: "/images/solutions/home-lifestyle-kit-2.png",
        alt: "Satin printed label material",
      },
      {
        title: "Cotton Printed Labels",
        image: "/images/solutions/fashion-kit-2.png",
        alt: "Cotton printed clothing label cards",
      },
      {
        title: "Nylon Care Labels",
        image: "/images/solutions/home-lifestyle-gallery-2.png",
        alt: "Nylon care label roll",
      },
      {
        title: "Color Printed Labels",
        image: "/images/solutions/cosmetics-gallery-1.png",
        alt: "Color printed label samples",
      },
    ],
  },
  {
    title: "Special Labels",
    cards: [
      {
        title: "Leather Labels",
        image: "/images/home/product-patches.png",
        alt: "Leather label and patch samples",
      },
      {
        title: "Rubber Labels",
        image: "/images/solutions/jewelry-luxury-kit-1.png",
        alt: "Rubber label and accessory trim",
      },
      {
        title: "Silicone Labels",
        image: "/images/solutions/jewelry-luxury-gallery-2.png",
        alt: "Silicone label sample",
      },
      {
        title: "PVC Labels",
        image: "/images/solutions/cosmetics-kit-2.png",
        alt: "PVC label style sample",
      },
    ],
  },
  {
    title: "Eco & Cotton Labels",
    cards: [
      {
        title: "Recycled Labels",
        image: "/images/blog/article-fsc-popular.jpg",
        alt: "Recycled material label reference",
      },
      {
        title: "Organic Cotton Labels",
        image: "/images/solutions/home-lifestyle-kit-3.png",
        alt: "Organic cotton label sample",
      },
      {
        title: "Cotton Labels",
        image: "/images/solutions/home-lifestyle-kit-2.png",
        alt: "Cotton fabric labels for apparel",
      },
      {
        title: "Natural Fabric Labels",
        image: "/images/solutions/home-lifestyle-kit-1.png",
        alt: "Natural fabric label samples",
      },
    ],
  },
  {
    title: "Brand Label Styles",
    cards: [
      {
        title: "Logo Labels",
        image: "/images/home/menu-labels.png",
        alt: "Logo label samples",
      },
      {
        title: "Patch Labels",
        image: "/images/home/menu-patches.png",
        alt: "Patch label samples",
      },
      {
        title: "Woven Badges",
        image: "/images/home/product-patches.png",
        alt: "Woven badge and label samples",
      },
      {
        title: "Main Labels",
        image: "/images/home/product-woven-labels.png",
        alt: "Main apparel label samples",
      },
    ],
  },
  {
    title: "Application Labels",
    cards: [
      {
        title: "Neck Labels",
        image: "/images/solutions/fashion-why.png",
        alt: "Neck label applied on apparel",
      },
      {
        title: "Size Labels",
        image: "/images/solutions/home-lifestyle-gallery-1.png",
        alt: "Small size labels for garments",
      },
      {
        title: "Hem Labels",
        image: "/images/solutions/fashion-gallery-4.png",
        alt: "Small hem label on garment edge",
      },
      {
        title: "Care Labels",
        image: "/images/solutions/home-lifestyle-gallery-2.png",
        alt: "Care instruction labels for garments",
      },
    ],
  },
  {
    title: "Backing & Fold Options",
    cards: [
      {
        title: "Iron-on Labels",
        image: "/images/solutions/cosmetics-gallery-4.png",
        alt: "Iron-on label sample",
      },
      {
        title: "Adhesive Labels",
        image: "/images/home/product-stickers.png",
        alt: "Adhesive label and sticker sheet",
      },
      {
        title: "Loop Labels",
        image: "/images/solutions/fashion-kit-3.png",
        alt: "Loop fold label sample",
      },
      {
        title: "Packaging Labels",
        image: "/images/home/product-packaging-tape.png",
        alt: "Packaging label and tape sample",
      },
    ],
  },
];

// --- Image upload cache (avoid uploading same image twice) ---
const imageAssetCache = new Map<string, string>(); // localPath -> assetId

async function uploadImage(localPath: string): Promise<string | null> {
  const fullPath = path.join(ASTRO_PUBLIC_DIR, localPath);

  if (imageAssetCache.has(localPath)) {
    console.log(`  ⏭️  Using cached asset for: ${localPath}`);
    return imageAssetCache.get(localPath)!;
  }

  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠️  Image not found, skipping: ${fullPath}`);
    return null;
  }

  const ext = path.extname(localPath).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
          ? "image/webp"
          : "image/png";

  const buffer = fs.readFileSync(fullPath);

  try {
    const asset = await client.assets.upload("image", buffer, {
      contentType,
      filename: path.basename(localPath),
    });
    imageAssetCache.set(localPath, asset._id);
    console.log(`  ✅ Uploaded: ${localPath} → ${asset._id}`);
    return asset._id;
  } catch (err) {
    console.error(`  ❌ Failed to upload ${localPath}:`, err);
    return null;
  }
}

// --- Main ---
async function main() {
  console.log("🚀 Seeding Labels Showcase data to Sanity...\n");
  console.log(`   Project: ${PROJECT_ID}`);
  console.log(`   Dataset: ${DATASET}\n`);

  // 1. Upload all unique images first
  const uniqueImages = new Set<string>();
  for (const group of labelShowcaseGroups) {
    for (const card of group.cards) {
      uniqueImages.add(card.image);
    }
  }

  console.log(`📸 Uploading ${uniqueImages.size} unique images...\n`);

  for (const imgPath of uniqueImages) {
    await uploadImage(imgPath);
  }

  console.log("\n📁 Building document...\n");

  // 2. Build showcaseGroups with uploaded image references
  const showcaseGroups = [];
  for (const group of labelShowcaseGroups) {
    const cards = [];
    for (const card of group.cards) {
      const assetId = imageAssetCache.get(card.image);
      if (!assetId) {
        console.warn(`  ⚠️  Skipping card "${card.title}" - image not uploaded`);
        continue;
      }
      cards.push({
        _type: "showcaseCard",
        title: card.title,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: assetId,
          },
        },
        alt: card.alt,
        ...(card.description ? { description: card.description } : {}),
      });
    }
    showcaseGroups.push({
      _type: "showcaseGroup",
      title: group.title,
      cards,
    });
  }

  // 3. Create or replace the Product document
  const docId = "product-labels";
  const doc = {
    _id: docId,
    _type: "product",
    slug: "labels",
    title: "Labels",
    showcaseGroups,
  };

  try {
    const result = await client.createOrReplace(doc);
    console.log(`\n✅ Document created/replaced: ${result._id}`);
    console.log(
      `   Groups: ${result.showcaseGroups?.length}, Total cards: ${result.showcaseGroups?.reduce((sum: number, g: any) => sum + (g.cards?.length || 0), 0)}`
    );
  } catch (err) {
    console.error("\n❌ Failed to create document:", err);
    process.exit(1);
  }

  console.log("\n🎉 Seed complete!");
}

main();
