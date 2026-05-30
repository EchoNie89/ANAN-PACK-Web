import { spawnSync } from "node:child_process";
import path from "node:path";
import { productBaselineEntries } from "./product-content-source";

declare const __dirname: string;

function main() {
  const passthroughArgs = process.argv.slice(2);
  const studioRoot = path.resolve(__dirname, "..");

  for (const product of productBaselineEntries) {
    const result = spawnSync(
      "pnpm",
      [
        "exec",
        "tsx",
        "scripts/seed-products.ts",
        "--slug",
        product.slug,
        ...passthroughArgs,
      ],
      {
        cwd: studioRoot,
        stdio: "inherit",
      },
    );

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}

main();
