#!/usr/bin/env npx tsx
/**
 * Figma Selection Extractor
 *
 * 从 Figma selection link 中提取文本、结构和图片。
 *
 * 用法:
 *   npx tsx scripts/figma-extract.ts --url "<figma-selection-link>" [--output-dir <dir>] [--format json|md]
 *
 * 环境变量:
 *   FIGMA_ACCESS_TOKEN  - Figma Personal Access Token（必需）
 *
 * 示例:
 *   FIGMA_TOKEN=xxx npx tsx scripts/figma-extract.ts \
 *     --url "https://www.figma.com/design/SzOlgqIXHy4MBI2QXLE08L/...?node-id=19415-1872"
 */

// ─── Load .env ────────────────────────────────────────────────────────────────
import { readFileSync as _readFileSync } from "node:fs";
import { resolve as _resolve } from "node:path";
const _envPath = _resolve(__dirname, "..", ".env");
try {
  const _envContent = _readFileSync(_envPath, "utf-8");
  for (const _line of _envContent.split("\n")) {
    const _trimmed = _line.trim();
    if (!_trimmed || _trimmed.startsWith("#")) continue;
    const _eqIdx = _trimmed.indexOf("=");
    if (_eqIdx < 0) continue;
    const _key = _trimmed.slice(0, _eqIdx).trim();
    const _val = _trimmed.slice(_eqIdx + 1).trim();
    if (!process.env[_key]) process.env[_key] = _val;
  }
} catch { /* .env not found, skip */ }
// ─── End Load .env ────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  characters?: string;
  style?: Record<string, unknown>;
  fills?: unknown[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  size?: { width: number; height: number };
  componentId?: string;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  blendMode?: string;
  effects?: unknown[];
  strokeWeight?: number;
  cornerRadius?: number;
  rectangleCornerRadii?: number[];
  layoutMode?: string;
  itemSpacing?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  fills?: Array<{ type: string; color?: { r: number; g: number; b: number; a?: number }; opacity?: number }>;
  strokes?: unknown[];
  [key: string]: unknown;
}

interface FigmaFileResponse {
  document: FigmaNode;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  styles?: Record<string, unknown>;
  components?: Record<string, unknown>;
}

interface FigmaNodeResponse {
  node: Record<string, { document: FigmaNode; styles?: Record<string, unknown> }>;
}

interface FigmaImageResponse {
  images: Record<string, string>;
}

interface ExtractedText {
  nodeId: string;
  nodeName: string;
  text: string;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    textAlignHorizontal?: string;
  };
}

interface ExtractedImage {
  nodeId: string;
  nodeName: string;
  url: string;
  localPath: string;
  width?: number;
  height?: number;
}

interface ExtractedStructure {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  children: ExtractedStructure[];
  layout?: {
    mode?: string;
    itemSpacing?: number;
    padding?: { top: number; right: number; bottom: number; left: number };
    width?: number;
    height?: number;
    cornerRadius?: number;
    primaryAxisAlignItems?: string;
    counterAxisAlignItems?: string;
  };
  fills?: Array<{ type: string; color?: string; opacity?: number }>;
}

interface ExtractionResult {
  source: {
    url: string;
    fileKey: string;
    nodeId: string;
    fileName: string;
    lastModified: string;
  };
  structure: ExtractedStructure;
  texts: ExtractedText[];
  images: ExtractedImage[];
  structured?: StructuredPageData;
}

// ─── Structured Output Types ─────────────────────────────────────────────────
// 这些类型与项目中 tagora-official-site/src/data/ 的数据结构对齐

interface StructuredImageItem {
  title: string;
  image: string;
  alt: string;
  description?: string;
  figmaNodeId?: string;
}

interface StructuredShowcaseGroup {
  title: string;
  cards: StructuredImageItem[];
  figmaNodeId?: string;
}

interface StructuredApplication {
  title: string;
  description?: string;
  image: string;
  alt: string;
  figmaNodeId?: string;
}

interface StructuredProcessStep {
  title: string;
  description: string;
  figmaNodeId?: string;
}

interface StructuredTextBlock {
  title: string;
  items: string[];
  figmaNodeId?: string;
}

interface StructuredSection {
  type: "hero" | "showcase" | "applications" | "process" | "features" | "text-blocks" | "cta" | "faq" | "testimonials" | "metrics" | "other";
  title?: string;
  subtitle?: string;
  description?: string;
  figmaNodeId?: string;
  showcaseGroups?: StructuredShowcaseGroup[];
  applications?: StructuredApplication[];
  processSteps?: StructuredProcessStep[];
  features?: StructuredTextBlock[];
  items?: StructuredImageItem[];
}

interface StructuredPageData {
  pageName: string;
  figmaUrl: string;
  figmaNodeId: string;
  sections: StructuredSection[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseFigmaUrl(url: string): { fileKey: string; nodeId: string } {
  // 支持多种 Figma URL 格式:
  // https://www.figma.com/design/FILE_KEY/...?node-id=NODE_ID
  // https://www.figma.com/file/FILE_KEY/...?node-id=NODE_ID
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // /design/FILE_KEY/... 或 /file/FILE_KEY/...
  let fileKey = "";
  for (let i = 0; i < segments.length - 1; i++) {
    if (segments[i] === "design" || segments[i] === "file") {
      fileKey = segments[i + 1];
      break;
    }
  }

  if (!fileKey) {
    throw new Error("无法从 URL 中提取 fileKey，请检查链接格式");
  }

  // node-id 参数，格式可能是 19415-1872（需要转为 19415:1872）
  let nodeId = urlObj.searchParams.get("node-id") || "";
  if (nodeId) {
    nodeId = nodeId.replace(/-/g, ":");
  }

  if (!nodeId) {
    throw new Error("无法从 URL 中提取 node-id，请确保链接包含 node-id 参数");
  }

  return { fileKey, nodeId };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => {
    const hex = Math.round(v * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ─── Figma API Client ───────────────────────────────────────────────────────

class FigmaClient {
  private token: string;
  private baseUrl = "https://api.figma.com/v1";
  private dispatcher: unknown = undefined;

  constructor(token: string) {
    this.token = token;
    // 初始化代理
    const proxyUrl =
      process.env.HTTPS_PROXY ||
      process.env.https_proxy ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy;
    if (proxyUrl) {
      try {
        // 动态导入，如果失败也不阻塞
        const mod = require("https-proxy-agent");
        this.dispatcher = new mod.HttpsProxyAgent(proxyUrl);
        console.log(`🔄 Figma API 使用代理: ${proxyUrl.replace(/\/\/.*@/, "//***@")}`);
      } catch {
        console.warn("⚠️ https-proxy-agent 未安装，Figma API 不使用代理");
      }
    }
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const urlObj = new URL(url);

    const headers: Record<string, string> = {
      "X-Figma-Token": this.token,
    };

    // 使用 node:https + HttpsProxyAgent 替代内置 fetch（内置 fetch 不支持 dispatcher）
    const https = await import("node:https");
    const options: Record<string, unknown> = { headers };
    if (this.dispatcher) {
      options.agent = this.dispatcher;
    }

    return new Promise<T>((resolve, reject) => {
      const req = https.get(urlObj, options, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // 跟随重定向
          const redirectUrl = new URL(res.headers.location, url);
          const redirectReq = https.get(redirectUrl, { ...options, agent: this.dispatcher || undefined }, (redirectRes) => {
            let body = "";
            redirectRes.on("data", (chunk: Buffer) => { body += chunk.toString(); });
            redirectRes.on("end", () => {
              if (redirectRes.statusCode && redirectRes.statusCode >= 400) {
                reject(new Error(`Figma API 错误 (${redirectRes.statusCode}): ${body}`));
              } else {
                resolve(JSON.parse(body) as T);
              }
            });
          });
          redirectReq.on("error", reject);
          return;
        }

        let body = "";
        res.on("data", (chunk: Buffer) => { body += chunk.toString(); });
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Figma API 错误 (${res.statusCode}): ${body}`));
          } else {
            resolve(JSON.parse(body) as T);
          }
        });
      });
      req.on("error", reject);
    });
  }

  /** 获取整个文件信息 */
  async getFile(fileKey: string): Promise<FigmaFileResponse> {
    return this.fetch<FigmaFileResponse>(`/files/${fileKey}`);
  }

  /** 获取指定节点信息（含子节点） */
  async getNode(fileKey: string, nodeId: string, depth: number = 5): Promise<FigmaNode> {
    // Figma API 的 nodes 端点要求 ids 参数使用 "-" 分隔符（如 21421-1832）
    // 而不是 ":" 分隔符。同时 encodeURIComponent 会把 ":" 编码为 %3A，
    // 某些情况下 Figma API 无法正确识别，因此直接用 "-" 格式传递。
    const apiNodeId = nodeId.replace(/:/g, "-");
    const resp = await this.fetch<Record<string, { document: FigmaNode }>>(
      `/files/${fileKey}/nodes?ids=${apiNodeId}&depth=${depth}`
    );

    // Figma API 返回格式: { name, lastModified, ..., nodes: { "node-id": { document: ... } } }
    // 节点数据在 resp.nodes 字段中
    const nodeMap = (resp as Record<string, unknown>).nodes as Record<string, { document: FigmaNode }>;
    const dataKeys = Object.keys(nodeMap || {});
    console.log(`   nodes keys: [${dataKeys.join(", ")}]`);

    // 尝试多种 key 格式匹配返回数据
    const candidates = [
      apiNodeId,                          // 21421-1832
      nodeId,                             // 21421:1832
    ];

    for (const key of candidates) {
      if (nodeMap[key]?.document) {
        return nodeMap[key].document;
      }
    }

    // 如果都匹配不到，取第一个可用的节点
    if (dataKeys.length > 0 && nodeMap[dataKeys[0]]?.document) {
      console.warn(`⚠️ 节点 ID 匹配使用了回退策略: 请求 ${apiNodeId}, 实际 ${dataKeys[0]}`);
      return nodeMap[dataKeys[0]].document;
    }

    throw new Error(`未找到节点: ${nodeId} (nodes keys: [${dataKeys.join(", ")}])`);
  }

  /** 导出节点为图片 */
  async exportImages(
    fileKey: string,
    nodeIds: string[],
    format: "png" | "jpg" | "svg" = "png",
    scale: number = 2
  ): Promise<Record<string, string>> {
    const ids = nodeIds.join(",");
    const resp = await this.fetch<FigmaImageResponse>(
      `/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=${format}&scale=${scale}`
    );
    return resp.images;
  }
}

// ─── Extraction Logic ────────────────────────────────────────────────────────

/** 递归提取文本节点 */
function extractTexts(node: FigmaNode, texts: ExtractedText[] = []): ExtractedText[] {
  if (node.type === "TEXT" && node.characters) {
    const fill = (node.fills as Array<{ type: string; color?: { r: number; g: number; b: number; a?: number }; opacity?: number }> | undefined)?.find(
      (f) => f.type === "SOLID" && f.color
    );

    texts.push({
      nodeId: node.id,
      nodeName: node.name,
      text: node.characters,
      style: {
        fontFamily: (node.style as Record<string, unknown>)?.fontFamily as string | undefined,
        fontSize: (node.style as Record<string, unknown>)?.fontSize as number | undefined,
        fontWeight: (node.style as Record<string, unknown>)?.fontWeight as number | undefined,
        color: fill?.color ? rgbToHex(fill.color.r, fill.color.g, fill.color.b) : undefined,
        textAlignHorizontal: (node.style as Record<string, unknown>)?.textAlignHorizontal as string | undefined,
      },
    });
  }

  if (node.children) {
    for (const child of node.children) {
      extractTexts(child, texts);
    }
  }

  return texts;
}

/** 递归提取结构（简化版，去除过多细节） */
function extractStructure(node: FigmaNode, depth: number = 0, maxDepth: number = 10): ExtractedStructure {
  const structure: ExtractedStructure = {
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    children: [],
  };

  // 添加布局信息（仅对有布局的节点）
  if (node.layoutMode || node.absoluteBoundingBox) {
    structure.layout = {
      mode: node.layoutMode || undefined,
      itemSpacing: node.itemSpacing ?? undefined,
      padding: node.paddingLeft != null
        ? {
            top: node.paddingTop ?? 0,
            right: node.paddingRight ?? 0,
            bottom: node.paddingBottom ?? 0,
            left: node.paddingLeft ?? 0,
          }
        : undefined,
      width: node.absoluteBoundingBox?.width,
      height: node.absoluteBoundingBox?.height,
      cornerRadius: node.cornerRadius ?? undefined,
      primaryAxisAlignItems: node.primaryAxisAlignItems || undefined,
      counterAxisAlignItems: node.counterAxisAlignItems || undefined,
    };
  }

  // 添加填充色信息
  if (node.fills && Array.isArray(node.fills)) {
    const solidFills = (node.fills as Array<{ type: string; color?: { r: number; g: number; b: number; a?: number }; opacity?: number }>)
      .filter((f) => f.type === "SOLID" && f.color)
      .map((f) => ({
        type: f.type,
        color: rgbToHex(f.color!.r, f.color!.g, f.color!.b),
        opacity: f.opacity ?? 1,
      }));
    if (solidFills.length > 0) {
      structure.fills = solidFills;
    }
  }

  if (node.children && depth < maxDepth) {
    structure.children = node.children.map((child) => extractStructure(child, depth + 1, maxDepth));
  }

  return structure;
}

/** 收集可导出图片的节点（IMAGE 类型的 fill 或带图片的节点） */
function collectImageNodes(node: FigmaNode, images: { nodeId: string; nodeName: string }[] = []): { nodeId: string; nodeName: string }[] {
  // 检查是否有图片填充
  const hasImageFill = (node.fills as Array<{ type: string }> | undefined)?.some((f) => f.type === "IMAGE") ?? false;

  // 也收集 RECTANGLE / ELLIPSE / VECTOR 等可能有图片的节点
  if (hasImageFill && node.type !== "TEXT") {
    images.push({ nodeId: node.id, nodeName: node.name });
  }

  if (node.children) {
    for (const child of node.children) {
      collectImageNodes(child, images);
    }
  }

  return images;
}

/** 收集所有可导出的节点（包含图片填充的节点 + 整体截图） */
function collectExportableNodes(node: FigmaNode, nodes: { nodeId: string; nodeName: string; reason: string }[] = []): { nodeId: string; nodeName: string; reason: string }[] {
  const hasImageFill = (node.fills as Array<{ type: string }> | undefined)?.some((f) => f.type === "IMAGE") ?? false;

  if (hasImageFill && node.type !== "TEXT") {
    nodes.push({ nodeId: node.id, nodeName: node.name, reason: "image-fill" });
  }

  // FRAME / COMPONENT / INSTANCE 等容器节点可以作为整体导出
  if (
    (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") &&
    node.children &&
    node.children.length > 0 &&
    node.absoluteBoundingBox &&
    node.absoluteBoundingBox.width > 50 &&
    node.absoluteBoundingBox.height > 50
  ) {
    // 只收集包含图片的 frame
    const hasImageInChildren = (n: FigmaNode): boolean => {
      if ((n.fills as Array<{ type: string }> | undefined)?.some((f) => f.type === "IMAGE")) return true;
      return n.children?.some(hasImageInChildren) ?? false;
    };

    if (hasImageInChildren(node)) {
      // 避免重复添加（如果子节点已经单独添加了）
      const isParentOfAlreadyAdded = nodes.some((n) => n.nodeId.startsWith(node.id + ":"));
      if (!isParentOfAlreadyAdded) {
        nodes.push({ nodeId: node.id, nodeName: node.name, reason: "image-container" });
      }
    }
  }

  if (node.children) {
    for (const child of node.children) {
      collectExportableNodes(child, nodes);
    }
  }

  return nodes;
}

// ─── Output Formatters ───────────────────────────────────────────────────────

function resultToJson(result: ExtractionResult): string {
  return JSON.stringify(result, null, 2);
}

function resultToMarkdown(result: ExtractionResult): string {
  const lines: string[] = [];

  lines.push("# Figma Selection 提取结果");
  lines.push("");
  lines.push("## 基本信息");
  lines.push("");
  lines.push(`- **文件**: ${result.source.fileName}`);
  lines.push(`- **File Key**: ${result.source.fileKey}`);
  lines.push(`- **Node ID**: ${result.source.nodeId}`);
  lines.push(`- **最后修改**: ${result.source.lastModified}`);
  lines.push(`- **原始链接**: ${result.source.url}`);
  lines.push("");

  // 文本内容
  lines.push("## 文本内容");
  lines.push("");
  if (result.texts.length === 0) {
    lines.push("_未找到文本节点_");
  } else {
    for (const t of result.texts) {
      lines.push(`### ${t.nodeName} (\`${t.nodeId}\`)`);
      lines.push("");
      lines.push(`> ${t.text}`);
      lines.push("");
      if (t.style) {
        const styleParts: string[] = [];
        if (t.style.fontFamily) styleParts.push(`字体: ${t.style.fontFamily}`);
        if (t.style.fontSize) styleParts.push(`字号: ${t.style.fontSize}px`);
        if (t.style.fontWeight) styleParts.push(`字重: ${t.style.fontWeight}`);
        if (t.style.color) styleParts.push(`颜色: \`${t.style.color}\``);
        if (t.style.textAlignHorizontal) styleParts.push(`对齐: ${t.style.textAlignHorizontal}`);
        if (styleParts.length > 0) {
          lines.push(`- ${styleParts.join(" / ")}`);
          lines.push("");
        }
      }
    }
  }

  // 结构
  lines.push("## 节点结构");
  lines.push("");
  lines.push("```");
  lines.push(formatStructureTree(result.structure));
  lines.push("```");
  lines.push("");

  // 图片
  lines.push("## 图片资源");
  lines.push("");
  if (result.images.length === 0) {
    lines.push("_未找到图片节点_");
  } else {
    lines.push("| # | 节点名 | Node ID | 本地路径 |");
    lines.push("|---|--------|---------|----------|");
    result.images.forEach((img, i) => {
      lines.push(`| ${i + 1} | ${img.nodeName} | \`${img.nodeId}\` | \`${img.localPath}\` |`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

function formatStructureTree(node: ExtractedStructure, indent: string = "", isLast: boolean = true): string {
  const connector = indent === "" ? "" : isLast ? "└── " : "├── ";
  const typeLabel = node.nodeType !== node.nodeName ? ` [${node.nodeType}]` : "";
  let line = `${indent}${connector}${node.nodeName}${typeLabel}`;

  // 添加尺寸信息
  if (node.layout?.width && node.layout?.height) {
    line += ` (${node.layout.width}×${node.layout.height})`;
  }
  // 添加布局模式
  if (node.layout?.mode) {
    line += ` {${node.layout.mode}}`;
  }

  const lines = [line];

  if (node.children.length > 0) {
    const childIndent = indent + (indent === "" ? "" : isLast ? "    " : "│   ");
    node.children.forEach((child, i) => {
      const childIsLast = i === node.children.length - 1;
      lines.push(formatStructureTree(child, childIndent, childIsLast));
    });
  }

  return lines.join("\n");
}

// ─── Download Helper ─────────────────────────────────────────────────────────

async function downloadImage(url: string, destPath: string, retries: number = 5): Promise<void> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const https = await import("node:https");

  const dir = path.dirname(destPath);
  await fs.mkdir(dir, { recursive: true });

  // 代理支持：读取 HTTPS_PROXY / HTTP_PROXY 环境变量
  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  let agent: unknown = undefined;
  if (proxyUrl) {
    try {
      const { HttpsProxyAgent } = await import("https-proxy-agent");
      agent = new HttpsProxyAgent(proxyUrl);
    } catch {
      console.warn("   ⚠️ https-proxy-agent 未安装，跳过代理");
    }
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("下载超时 (60s)")), 60_000);

        const req = https.get(url, { agent: agent || undefined }, (res) => {
          // 跟随重定向
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            clearTimeout(timer);
            const redirectUrl = res.headers.location;
            https.get(redirectUrl, { agent: agent || undefined }, (redirectRes) => {
              const chunks: Buffer[] = [];
              redirectRes.on("data", (chunk: Buffer) => chunks.push(chunk));
              redirectRes.on("end", () => resolve(Buffer.concat(chunks)));
              redirectRes.on("error", reject);
            }).on("error", reject);
            return;
          }

          if (res.statusCode && res.statusCode >= 400) {
            clearTimeout(timer);
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }

          const chunks: Buffer[] = [];
          res.on("data", (chunk: Buffer) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        });
        req.on("error", (err) => { clearTimeout(timer); reject(err); });
      });

      await fs.writeFile(destPath, buffer);
      return; // 成功则直接返回
    } catch (err) {
      const isLastAttempt = attempt === retries;
      const errMsg = (err as Error).message || String(err);

      if (isLastAttempt) {
        throw new Error(`下载图片失败 (${retries}次重试后): ${errMsg} - ${url}`);
      }

      // 超时或网络错误，等待后重试
      const waitMs = attempt * 2000;
      console.warn(`   ⚠️ 下载失败 (尝试 ${attempt}/${retries}): ${errMsg}，${waitMs / 1000}s 后重试...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

async function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);
  let figmaUrl = "";
  let outputDir = "";
  let format: "json" | "md" | "both" = "both";
  let maxDepth = 8;
  let exportScale = 2;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--url":
        figmaUrl = args[++i];
        break;
      case "--output-dir":
        outputDir = args[++i];
        break;
      case "--format":
        format = args[++i] as "json" | "md" | "both";
        break;
      case "--depth":
        maxDepth = parseInt(args[++i], 10);
        break;
      case "--scale":
        exportScale = parseInt(args[++i], 10);
        break;
      case "--help":
      case "-h":
        console.log(`
Figma Selection Extractor

用法:
  npx tsx scripts/figma-extract.ts --url "<figma-url>" [选项]

选项:
  --url <url>          Figma selection link（必需）
  --output-dir <dir>   输出目录（默认: ./figma-export-YYYYMMDDHHmmss，自动带时间戳）
  --format <format>    输出格式: json | md | both（默认: both）
  --depth <n>          结构提取深度（默认: 8）
  --scale <n>          图片导出倍率（默认: 2）
  --help               显示帮助信息

环境变量:
  FIGMA_ACCESS_TOKEN   Figma Personal Access Token（必需）

示例:
  FIGMA_ACCESS_TOKEN=xxx npx tsx scripts/figma-extract.ts \
    --url "https://www.figma.com/design/XXXXX?node-id=123-456"
        `);
        process.exit(0);
    }
  }

  if (!figmaUrl) {
    console.error("错误: 请提供 Figma selection link (--url)");
    process.exit(1);
  }

  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error("错误: 请设置 FIGMA_ACCESS_TOKEN 环境变量");
    console.error("获取方式: Figma → Settings → Personal access tokens → Generate new token");
    process.exit(1);
  }

  // 解析 URL
  let fileKey: string;
  let nodeId: string;
  try {
    ({ fileKey, nodeId } = parseFigmaUrl(figmaUrl));
    console.log(`📄 File Key: ${fileKey}`);
    console.log(`🎯 Node ID: ${nodeId}`);
  } catch (err) {
    console.error(`错误: ${(err as Error).message}`);
    process.exit(1);
  }

  const client = new FigmaClient(token);
  const path = await import("node:path");
  const fs = await import("node:fs/promises");

  // 自动生成输出目录（带时间戳，避免覆盖之前的导出）
  if (!outputDir) {
    const now = new Date();
    const ts = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");
    outputDir = `./figma-export-${ts}`;
  }

  // 1. 获取文件信息
  console.log("\n⏳ 正在获取文件信息...");
  let fileInfo: FigmaFileResponse;
  try {
    fileInfo = await client.getFile(fileKey);
  } catch (err) {
    console.error(`获取文件信息失败: ${(err as Error).message}`);
    process.exit(1);
  }
  console.log(`✅ 文件: ${fileInfo.name} (最后修改: ${fileInfo.lastModified})`);

  // 2. 获取节点详情
  console.log("\n⏳ 正在获取节点结构...");
  let node: FigmaNode;
  try {
    node = await client.getNode(fileKey, nodeId, maxDepth);
  } catch (err) {
    console.error(`获取节点失败: ${(err as Error).message}`);
    process.exit(1);
  }
  console.log(`✅ 节点: ${node.name} (${node.type})`);

  // 3. 提取文本
  console.log("\n⏳ 正在提取文本...");
  const texts = extractTexts(node);
  console.log(`✅ 找到 ${texts.length} 个文本节点`);
  texts.forEach((t, i) => {
    const preview = t.text.length > 60 ? t.text.slice(0, 60) + "..." : t.text;
    console.log(`   ${i + 1}. [${t.nodeId}] ${preview}`);
  });

  // 4. 提取结构
  console.log("\n⏳ 正在提取结构...");
  const structure = extractStructure(node, 0, maxDepth);
  console.log(`✅ 结构提取完成`);

  // 5. 提取图片
  console.log("\n⏳ 正在提取图片资源...");
  const imageNodes = collectExportableNodes(node);
  console.log(`   找到 ${imageNodes.length} 个图片相关节点`);

  const images: ExtractedImage[] = [];

  if (imageNodes.length > 0) {
    // 批量导出图片（每次最多 50 个）
    const batchSize = 50;
    for (let i = 0; i < imageNodes.length; i += batchSize) {
      const batch = imageNodes.slice(i, i + batchSize);
      const nodeIds = batch.map((n) => n.nodeId);

      try {
        console.log(`   导出批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(imageNodes.length / batchSize)}...`);
        const imageUrls = await client.exportImages(fileKey, nodeIds, "png", exportScale);

        for (const item of batch) {
          const imageUrl = imageUrls[item.nodeId] || imageUrls[item.nodeId.replace(/:/g, "-")];
          if (imageUrl) {
            // 生成语义化的文件名
            const safeName = item.nodeName
              .replace(/[^a-zA-Z0-9一-鿿-]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "")
              .slice(0, 50);
            const localPath = path.join(outputDir, "images", `${safeName}-${item.nodeId.replace(/:/g, "-")}.png`);

            images.push({
              nodeId: item.nodeId,
              nodeName: item.nodeName,
              url: imageUrl,
              localPath,
            });
          }
        }
      } catch (err) {
        console.warn(`   ⚠️ 图片导出失败: ${(err as Error).message}`);
      }
    }
  }

  // 同时导出选中节点的整体截图
  console.log("\n⏳ 正在导出整体截图...");
  try {
    const rootUrls = await client.exportImages(fileKey, [nodeId], "png", exportScale);
    const rootUrl = rootUrls[nodeId.replace(/:/g, "-")] || rootUrls[nodeId];
    if (rootUrl) {
      const localPath = path.join(outputDir, "images", `full-selection-${nodeId.replace(/:/g, "-")}.png`);
      images.unshift({
        nodeId,
        nodeName: `${node.name} (整体截图)`,
        url: rootUrl,
        localPath,
      });
      console.log(`✅ 整体截图已获取`);
    }
  } catch (err) {
    console.warn(`⚠️ 整体截图导出失败: ${(err as Error).message}`);
  }

  console.log(`✅ 共 ${images.length} 个图片资源`);

  // 6. 下载图片
  console.log("\n⏳ 正在下载图片...");
  for (const img of images) {
    try {
      await downloadImage(img.url, img.localPath);
      console.log(`   ✅ ${path.basename(img.localPath)}`);
    } catch (err) {
      console.warn(`   ⚠️ 下载失败 ${path.basename(img.localPath)}: ${(err as Error).message}`);
    }
  }

  // 7. 组装结果
  const result: ExtractionResult = {
    source: {
      url: figmaUrl,
      fileKey,
      nodeId,
      fileName: fileInfo.name,
      lastModified: fileInfo.lastModified,
    },
    structure,
    texts,
    images: images.map((img) => ({
      nodeId: img.nodeId,
      nodeName: img.nodeName,
      url: img.url,
      localPath: img.localPath,
    })),
  };

  // 8. 写入文件
  await fs.mkdir(outputDir, { recursive: true });

  if (format === "json" || format === "both") {
    const jsonPath = path.join(outputDir, "extraction-result.json");
    await fs.writeFile(jsonPath, resultToJson(result), "utf-8");
    console.log(`\n📝 JSON 结果已保存: ${jsonPath}`);
  }

  if (format === "md" || format === "both") {
    const mdPath = path.join(outputDir, "extraction-result.md");
    await fs.writeFile(mdPath, resultToMarkdown(result), "utf-8");
    console.log(`📝 Markdown 结果已保存: ${mdPath}`);
  }

  // 9. 输出摘要
  console.log("\n" + "═".repeat(60));
  console.log("📊 提取摘要");
  console.log("═".repeat(60));
  console.log(`  文件: ${fileInfo.name}`);
  console.log(`  节点: ${node.name} (${node.type})`);
  console.log(`  文本节点: ${texts.length}`);
  console.log(`  图片资源: ${images.length}`);
  console.log(`  输出目录: ${outputDir}`);
  console.log("═".repeat(60));

  // 输出所有文本的汇总
  if (texts.length > 0) {
    console.log("\n📝 所有文本汇总:");
    console.log("─".repeat(40));
    texts.forEach((t) => {
      console.log(`  ${t.text}`);
    });
    console.log("─".repeat(40));
  }
}

main().catch((err) => {
  console.error("致命错误:", err);
  process.exit(1);
});
