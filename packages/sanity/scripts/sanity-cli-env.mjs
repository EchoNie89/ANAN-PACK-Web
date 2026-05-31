import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function parseEnvContent(content) {
  const entries = {};

  for (const line of content.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
    const separatorIndex = normalized.indexOf("=");
    if (separatorIndex < 0) continue;

    const key = normalized.slice(0, separatorIndex).trim();
    const rawValue = normalized.slice(separatorIndex + 1).trim();
    if (!key) continue;

    entries[key] = stripWrappingQuotes(rawValue);
  }

  return entries;
}

export function parseScutilProxyOutput(output) {
  const proxyEnv = {};

  const capture = (name) => {
    const match = output.match(new RegExp(`\\b${name}\\s*:\\s*([^\\n]+)`));
    return match ? match[1].trim() : "";
  };

  const buildUrl = (scheme, hostKey, portKey, enabledKey) => {
    const enabled = capture(enabledKey);
    const host = capture(hostKey);
    const port = capture(portKey);
    if (enabled !== "1" || !host || !port) {
      return "";
    }

    return `${scheme}://${host}:${port}`;
  };

  const httpProxy = buildUrl("http", "HTTPProxy", "HTTPPort", "HTTPEnable");
  if (httpProxy) {
    proxyEnv.HTTP_PROXY = httpProxy;
  }

  const httpsProxy = buildUrl("http", "HTTPSProxy", "HTTPSPort", "HTTPSEnable");
  if (httpsProxy) {
    proxyEnv.HTTPS_PROXY = httpsProxy;
  }

  return proxyEnv;
}

function hasExplicitProxy(env) {
  return Boolean(
    env.HTTPS_PROXY ||
      env.https_proxy ||
      env.HTTP_PROXY ||
      env.http_proxy ||
      env.ALL_PROXY ||
      env.all_proxy,
  );
}

function addProxyAliases(env, proxyEnv) {
  if (proxyEnv.HTTP_PROXY && !env.HTTP_PROXY) env.HTTP_PROXY = proxyEnv.HTTP_PROXY;
  if (proxyEnv.HTTP_PROXY && !env.http_proxy) env.http_proxy = proxyEnv.HTTP_PROXY;
  if (proxyEnv.HTTPS_PROXY && !env.HTTPS_PROXY) env.HTTPS_PROXY = proxyEnv.HTTPS_PROXY;
  if (proxyEnv.HTTPS_PROXY && !env.https_proxy) env.https_proxy = proxyEnv.HTTPS_PROXY;
}

export function readDotEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return "";
  }

  return readFileSync(filePath, "utf8");
}

export function readMacOsSystemProxyOutput() {
  try {
    return execFileSync("scutil", ["--proxy"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

export function buildSanityCliEnv({
  baseEnv = process.env,
  envFileContent = "",
  platform = process.platform,
  scutilOutput = "",
} = {}) {
  const env = { ...baseEnv };
  const envEntries = parseEnvContent(envFileContent);

  for (const [key, value] of Object.entries(envEntries)) {
    if (!env[key]) {
      env[key] = value;
    }
  }

  if (!hasExplicitProxy(env) && platform === "darwin") {
    addProxyAliases(env, parseScutilProxyOutput(scutilOutput));
  }

  return env;
}
