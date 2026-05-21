#!/usr/bin/env npx tsx
/**
 * 导出 blog 分类卡片图标
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Load .env
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

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = "SzOlgqIXHy4MBI2QXLE08L";
const PROXY = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "http://127.0.0.1:7897";

// 图标节点
const icons = [
  { name: "icon-material-guides", nodeId: "19442:1304" },
  { name: "icon-production-knowledge", nodeId: "19442:1353" },
  { name: "icon-industry-insights", nodeId: "19442:1335" },
];

async function exportIcon(nodeId: string, name: string) {
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeId}&format=svg&use_absolute_bounds=true`;
  
  const res = await fetch(url, {
    headers: { "X-Figma-Token": FIGMA_TOKEN! },
  });
  
  if (!res.ok) {
    throw new Error(`Figma API error: ${res.status} ${await res.text()}`);
  }
  
  const data = await res.json();
  const imageUrl = data.images?.[nodeId];
  
  if (!imageUrl) {
    throw new Error(`No image URL for ${nodeId}`);
  }
  
  // 下载 SVG
  const svgRes = await fetch(imageUrl);
  if (!svgRes.ok) {
    throw new Error(`Failed to download SVG: ${svgRes.status}`);
  }
  
  const svgContent = await svgRes.text();
  return svgContent;
}

async function main() {
  const outputDir = resolve(__dirname, "../../astro/src/assets/blog/icons");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  for (const icon of icons) {
    console.log(`Exporting ${icon.name}...`);
    try {
      const svg = await exportIcon(icon.nodeId, icon.name);
      const filePath = resolve(outputDir, `${icon.name}.svg`);
      writeFileSync(filePath, svg);
      console.log(`  ✅ Saved: ${filePath}`);
    } catch (err) {
      console.error(`  ❌ Error: ${err}`);
    }
  }
  
  console.log("\nDone!");
}

main();
