import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const helperModuleUrl = new URL("../scripts/sanity-cli-env.mjs", import.meta.url);

test("sanity CLI env helper loads .env values without overriding existing shell values", async () => {
  const { buildSanityCliEnv } = await import(helperModuleUrl);

  const env = buildSanityCliEnv({
    baseEnv: {
      SANITY_TOKEN: "from-shell",
      HTTPS_PROXY: "http://127.0.0.1:9000",
    },
    envFileContent: [
      "SANITY_TOKEN=from-dotenv",
      "SANITY_DATASET=production",
      "HTTPS_PROXY=http://127.0.0.1:7897",
    ].join("\n"),
    platform: "darwin",
    scutilOutput: "",
  });

  assert.equal(env.SANITY_TOKEN, "from-shell");
  assert.equal(env.SANITY_DATASET, "production");
  assert.equal(env.HTTPS_PROXY, "http://127.0.0.1:9000");
});

test("sanity CLI env helper falls back to the macOS system proxy when shell and .env omit it", async () => {
  const { buildSanityCliEnv } = await import(helperModuleUrl);

  const env = buildSanityCliEnv({
    baseEnv: {},
    envFileContent: "SANITY_PROJECT_ID=44m142o0\n",
    platform: "darwin",
    scutilOutput: `
<dictionary> {
  HTTPEnable : 1
  HTTPPort : 7897
  HTTPProxy : 127.0.0.1
  HTTPSEnable : 1
  HTTPSPort : 7897
  HTTPSProxy : 127.0.0.1
}
    `,
  });

  assert.equal(env.SANITY_PROJECT_ID, "44m142o0");
  assert.equal(env.HTTP_PROXY, "http://127.0.0.1:7897");
  assert.equal(env.HTTPS_PROXY, "http://127.0.0.1:7897");
});

test("sanity package scripts route CLI commands through the proxy-aware wrapper", () => {
  const packageSource = readFileSync(new URL("../package.json", import.meta.url), "utf8");

  assert.match(packageSource, /"dev": "node \.\/scripts\/run-sanity-cli\.mjs dev"/);
  assert.match(packageSource, /"build": "node \.\/scripts\/run-sanity-cli\.mjs build"/);
  assert.match(packageSource, /"start": "node \.\/scripts\/run-sanity-cli\.mjs start"/);
  assert.match(packageSource, /"deploy": "node \.\/scripts\/run-sanity-cli\.mjs deploy"/);
});
