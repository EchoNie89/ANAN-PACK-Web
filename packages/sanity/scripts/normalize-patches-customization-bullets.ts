import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@sanity/client";
import { HttpsProxyAgent } from "https-proxy-agent";
import { normalizeCustomizationBulletSpacing } from "./customization-bullet-spacing.mjs";

declare const __dirname: string;
declare const process: {
  argv: string[];
  env: Record<string, string | undefined>;
  exit(code?: number): never;
};

type CliArgs = {
  outputDir?: string;
  write: boolean;
};

type ProductDocument = {
  _id: string;
  _rev: string;
  customizationGroups?: unknown[];
};

const envPath = path.resolve(__dirname, "..", ".env");

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgs(argv: string[]): CliArgs {
  let outputDir: string | undefined;
  let write = false;

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--write") {
      write = true;
      continue;
    }

    if (arg === "--output-dir") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --output-dir");
      }
      outputDir = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { outputDir, write };
}

function createOutputDir(specifiedOutputDir?: string) {
  const directory =
    specifiedOutputDir ??
    path.join(
      os.tmpdir(),
      `sanity-product-patches-customization-${Date.now()}`,
    );

  mkdirSync(directory, { recursive: true });
  return directory;
}

function writeSnapshot(outputDir: string, name: string, data: unknown) {
  const filePath = path.join(outputDir, `${name}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

async function main() {
  const args = parseArgs(process.argv);
  const outputDir = createOutputDir(args.outputDir);
  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || "44m142o0",
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_TOKEN || "",
    ...(proxyUrl ? { agent: new HttpsProxyAgent(proxyUrl) } : {}),
  });

  const documents = await client.fetch<ProductDocument[]>(
    `*[_id in ["product-patches", "drafts.product-patches"]]{_id, _rev, customizationGroups} | order(_id asc)`,
  );

  if (!documents.length) {
    throw new Error("Could not find product-patches or drafts.product-patches");
  }

  let totalChanges = 0;

  for (const document of documents) {
    const beforeFile = writeSnapshot(
      outputDir,
      `${document._id.replace(/[^a-z0-9.-]/gi, "_")}.before`,
      document.customizationGroups ?? [],
    );
    const result = normalizeCustomizationBulletSpacing(
      document.customizationGroups ?? [],
      "customizationGroups",
    );
    const afterFile = writeSnapshot(
      outputDir,
      `${document._id.replace(/[^a-z0-9.-]/gi, "_")}.after`,
      result.value,
    );

    totalChanges += result.changes.length;

    console.log(
      JSON.stringify(
        {
          documentId: document._id,
          beforeFile,
          afterFile,
          changeCount: result.changes.length,
          changes: result.changes,
        },
        null,
        2,
      ),
    );

    if (!args.write || result.changes.length === 0) {
      continue;
    }

    await client
      .patch(document._id)
      .set({ customizationGroups: result.value })
      .ifRevisionId(document._rev)
      .commit();
  }

  console.log(
    JSON.stringify(
      {
        outputDir,
        write: args.write,
        totalDocuments: documents.length,
        totalChanges,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
