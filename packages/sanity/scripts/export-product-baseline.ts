import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  PRODUCT_BASELINE_OUTPUT_PATH,
  productBaselineEntries,
} from "./product-content-source";

declare const __dirname: string;

function parseOutputPath(argv: string[]): string {
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--out") {
      const value = argv[index + 1];

      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --out");
      }

      return value;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return PRODUCT_BASELINE_OUTPUT_PATH;
}

function main() {
  const relativeOutputPath = parseOutputPath(process.argv);
  const absoluteOutputPath = path.resolve(__dirname, "..", relativeOutputPath);
  mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
  writeFileSync(
    absoluteOutputPath,
    `${JSON.stringify(productBaselineEntries, null, 2)}\n`,
    "utf8",
  );

  console.log(`Exported ${productBaselineEntries.length} products`);
  console.log(`Baseline file: ${absoluteOutputPath}`);
}

main();
