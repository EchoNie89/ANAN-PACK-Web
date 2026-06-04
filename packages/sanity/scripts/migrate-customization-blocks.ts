import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(scriptDir, "..", ".env");
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
} catch {
  // .env is optional for dry-run reads
}

import { createClient } from "@sanity/client";
import {
  normalizeCustomizationBlock,
  type PersistedLegacyCustomizationBlock,
  type ProductCustomizationBlock,
} from "../../astro/src/lib/customization-content.ts";

declare const process: {
  argv: string[];
  env: Record<string, string | undefined>;
  exit(code?: number): never;
};
type MigrationCustomizationBlock = ProductCustomizationBlock & {
  _key?: string;
};

type MigrationInputBlock =
  | (PersistedLegacyCustomizationBlock & { _key?: string })
  | MigrationCustomizationBlock;

type MigrationCustomizationGroup = {
  _key?: string;
  title?: string;
  blocks?: MigrationInputBlock[];
  [key: string]: unknown;
};

type ProductDocument = {
  _id: string;
  _rev?: string;
  name?: string;
  slug?: string;
  customizationGroups?: MigrationCustomizationGroup[];
};

type MigrationResult = {
  groups: MigrationCustomizationGroup[];
  migratedBlockCount: number;
};

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "44m142o0";
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: process.env.SANITY_TOKEN || "",
});

function parseArgs(argv: string[]) {
  let write = false;

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--write") {
      write = true;
      continue;
    }

    if (arg === "--dry-run") {
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { write };
}

export function normalizeCustomizationGroupsForMigration(
  groups: MigrationCustomizationGroup[] = [],
): MigrationResult {
  let migratedBlockCount = 0;

  const normalizedGroups = groups.map((group) => ({
    ...group,
    blocks: group.blocks?.map((block) => {
      if (block?._type !== "customizationBlock") {
        return block;
      }

      migratedBlockCount += 1;
      const normalizedBlock = normalizeCustomizationBlock(block);

      return {
        ...(block._key ? { _key: block._key } : {}),
        _type: normalizedBlock._type,
        ...(normalizedBlock.title ? { title: normalizedBlock.title } : {}),
        markerStyle: normalizedBlock.markerStyle,
        items: [...normalizedBlock.items],
        ...(normalizedBlock.note ? { note: normalizedBlock.note } : {}),
      };
    }),
  }));

  return {
    groups: normalizedGroups,
    migratedBlockCount,
  };
}

async function fetchProductDocuments() {
  return client.fetch<ProductDocument[]>(
    `*[
      _type == "product" &&
      count(customizationGroups[].blocks[_type == "customizationBlock"]) > 0
    ]{
      _id,
      _rev,
      name,
      "slug": coalesce(slug.current, slug),
      customizationGroups[]{
        ...,
        blocks[]{
          ...,
          items[]
        }
      }
    }`,
  );
}

async function main() {
  const { write } = parseArgs(process.argv);
  const documents = await fetchProductDocuments();

  let matchedDocuments = 0;
  let migratedBlocks = 0;

  const updates = documents
    .map((document) => {
      const { groups, migratedBlockCount } = normalizeCustomizationGroupsForMigration(
        document.customizationGroups || [],
      );

      if (migratedBlockCount === 0) {
        return null;
      }

      matchedDocuments += 1;
      migratedBlocks += migratedBlockCount;

      return {
        ...document,
        customizationGroups: groups,
      };
    })
    .filter(Boolean) as Array<
      ProductDocument & { customizationGroups: MigrationCustomizationGroup[] }
    >;

  console.log(`Matched documents: ${matchedDocuments}`);
  console.log(`Legacy blocks to migrate: ${migratedBlocks}`);

  if (!write) {
    for (const document of updates) {
      console.log(
        `- ${document._id} (${document.slug || document.name || "unnamed"})`,
      );
    }
    console.log("Dry run only. Re-run with --write to apply the migration.");
    return;
  }

  if (!process.env.SANITY_TOKEN) {
    throw new Error("SANITY_TOKEN is required when running with --write.");
  }

  for (const document of updates) {
    const patch = client.patch(document._id).set({
      customizationGroups: document.customizationGroups,
    });

    if (document._rev) {
      await patch.ifRevisionId(document._rev).commit();
    } else {
      await patch.commit();
    }

    console.log(`Migrated ${document._id}`);
  }
}

const entryHref =
  typeof process.argv[1] === "string"
    ? pathToFileURL(resolve(process.argv[1])).href
    : "";

if (import.meta.url === entryHref) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
