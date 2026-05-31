import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSanityCliEnv,
  readDotEnvFile,
  readMacOsSystemProxyOutput,
} from "./sanity-cli-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..");
const sanityBin = path.resolve(studioRoot, "node_modules", ".bin", "sanity");
const envFilePath = path.resolve(studioRoot, ".env");

const env = buildSanityCliEnv({
  baseEnv: process.env,
  envFileContent: readDotEnvFile(envFilePath),
  platform: process.platform,
  scutilOutput: readMacOsSystemProxyOutput(),
});

const child = spawn(sanityBin, process.argv.slice(2), {
  cwd: studioRoot,
  env,
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
