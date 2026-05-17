#!/usr/bin/env npx tsx
/**
 * Figma Extraction → Product Import Manifest Bridge
 *
 * 将 figma-extract.ts 的提取结果转换为 ProductImportManifest，
 * 并将图片复制到 import-assets/products/<slug>/ 目录。
 *
 * 用法:
 *   npx tsx scripts/figma-to-product.ts \
 *     --slug <product-slug> \
 *     --extraction <path-to-extraction-result.json> \
 *     [--output <path>] \
 *     [--interactive]
 *
 * 环境变量:
 *   无特殊要求
 *
 * 工作流程:
 *   1. 运行 figma-extract.ts 获取 extraction-result.json
 *   2. 运行本脚本将提取结果转换为 product manifest
 *   3. 检查生成的 manifest 文件
 *   4. 运行 seed-products.ts --slug <slug> --dry-run 验证
 *   5. 运行 seed-products.ts --slug <slug> 正式导入
 */

import type {
  ProductImportCard,
  ProductImportGroup,
  ProductImportManifest,
} from "../import-data/products/types";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Types (mirrored from figma-extract.ts) ─────────────────────────────────

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
}

// ─── CLI Args ────────────────────────────────────────────────────────────────

interface CliArgs {
  slug: string;
  extractionPath: string;
  outputPath?: string;
  interactive: boolean;
  upload: boolean; // 自动进行 dry-run 并询问确认后上传
}

const PRODUCT_SLUGS = [
  "labels",
  "patches",
  "ribbon",
  "tissue-paper",
  "tape",
  "bag",
  "hanging-tag",
  "sticker",
] as const;

type ProductSlug = (typeof PRODUCT_SLUGS)[number];

function parseArgs(argv: string[]): CliArgs {
  let slug = "";
  let extractionPath = "";
  let outputPath: string | undefined;
  let interactive = false;
  let upload = false;

  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case "--slug":
        slug = argv[++i];
        break;
      case "--extraction":
        extractionPath = argv[++i];
        break;
      case "--output":
        outputPath = argv[++i];
        break;
      case "--interactive":
        interactive = true;
        break;
      case "--upload":
        upload = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Figma Extraction → Product Import Manifest Bridge

用法:
  npx tsx scripts/figma-to-product.ts \
    --slug <product-slug> \
    --extraction <path-to-extraction-result.json> \
    [--output <path>] \
    [--interactive] \
    [--upload]

选项:
  --slug <slug>            Product slug（必需）: ${PRODUCT_SLUGS.join(", ")}
  --extraction <path>      figma-extract.ts 的 JSON 输出路径（必需）
  --output <path>          Manifest 输出路径（默认: import-data/products/<slug>.ts）
  --interactive            交互模式，逐步确认每个映射
  --upload                 自动进行 dry-run 验证，并在确认后上传到 Sanity
  --help                   显示帮助信息

工作流程:
  方式1 (手动步骤):
    1. figma-extract.ts 提取数据
    2. 本脚本生成 manifest
    3. 手动 dry-run 验证
    4. 手动上传

  方式2 (自动化):
    npx tsx scripts/figma-to-product.ts --slug bag --extraction ./figma-export/extraction-result.json --upload
    → 自动: dry-run → 询问确认 → 上传
        `);
        process.exit(0);
      default:
        console.error(`未知参数: ${argv[i]}`);
        process.exit(1);
    }
  }

  if (!slug) {
    console.error("错误: 请提供 --slug 参数");
    process.exit(1);
  }

  if (!PRODUCT_SLUGS.includes(slug as ProductSlug)) {
    console.error(`错误: 不支持的 slug "${slug}"。允许值: ${PRODUCT_SLUGS.join(", ")}`);
    process.exit(1);
  }

  if (!extractionPath) {
    console.error("错误: 请提供 --extraction 参数（figma-extract.ts 的 JSON 输出路径）");
    process.exit(1);
  }

  return { slug, extractionPath, outputPath, interactive, upload };
}

// ─── Image Mapping ───────────────────────────────────────────────────────────

/** 为图片生成语义化的文件名 */
function generateImageFileName(
  slug: string,
  nodeId: string,
  nodeName: string,
  index: number,
  ext: string = ".png"
): string {
  const safeName = nodeName
    .replace(/[^a-zA-Z0-9一-鿿-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
    .toLowerCase();

  const safeNodeId = nodeId.replace(/:/g, "-");
  const paddedIndex = String(index + 1).padStart(2, "0");

  return `${slug}-${paddedIndex}-${safeName || "image"}-${safeNodeId}${ext}`;
}

/** 在 images 数组中查找与 nodeId 最匹配的图片 */
function findImageForNode(
  images: ExtractedImage[],
  nodeId: string
): ExtractedImage | undefined {
  // 精确匹配
  let img = images.find((i) => i.nodeId === nodeId);
  if (img) return img;

  // 替换分隔符后匹配
  const normalizedId = nodeId.replace(/:/g, "-");
  img = images.find((i) => i.nodeId.replace(/:/g, "-") === normalizedId);
  if (img) return img;

  // 前缀匹配（子节点可能继承了父节点的图片）
  img = images.find((i) => i.nodeId.startsWith(nodeId.replace(/:/g, "-")));
  if (img) return img;

  return undefined;
}

// ─── Structure Analysis ──────────────────────────────────────────────────────

/**
 * 分析 Figma 结构，识别 showcase groups 和 applications
 *
 * 启发式规则:
 * - 名字中包含 "showcase"/"product"/"group" 的 FRAME → showcaseGroup
 * - 名字中包含 "application"/"use case"/"scenario" 的 FRAME → applications
 * - 包含图片的子节点 → 卡片
 * - 最近的 TEXT 兄弟节点 → 卡片标题/描述
 */
interface AnalyzedSection {
  type: "showcaseGroups" | "applications";
  groups?: {
    title: string;
    nodeId: string;
    cards: {
      title: string;
      nodeId: string;
      imageNodeId?: string;
      description?: string;
    }[];
  }[];
  cards?: {
    title: string;
    nodeId: string;
    imageNodeId?: string;
    description?: string;
  }[];
  sectionTitle?: string;
  sectionDescription?: string;
}

/** 从 texts 中查找属于某个 nodeId 区域的文本 */
function findTextsInRegion(
  texts: ExtractedText[],
  parentNodeId: string,
  allNodeIds?: Set<string>
): ExtractedText[] {
  const prefix = parentNodeId.replace(/:/g, "-");
  return texts.filter((t) => {
    const tid = t.nodeId.replace(/:/g, "-");
    return tid.startsWith(prefix);
  });
}

/** 智能识别节点的标题文本（通常是最大/最粗的文本） */
function findTitleFromTexts(texts: ExtractedText[]): string {
  if (texts.length === 0) return "";
  if (texts.length === 1) return texts[0].text.trim();

  // 优先选择字重最大或字号最大的文本作为标题
  const sorted = [...texts].sort((a, b) => {
    const weightA = a.style?.fontWeight ?? 400;
    const weightB = b.style?.fontWeight ?? 400;
    if (weightA !== weightB) return weightB - weightA;

    const sizeA = a.style?.fontSize ?? 0;
    const sizeB = b.style?.fontSize ?? 0;
    return sizeB - sizeA;
  });

  return sorted[0].text.trim();
}

/** 智能识别描述文本（排除标题后的其他文本） */
function findDescriptionFromTexts(texts: ExtractedText[], title: string): string | undefined {
  const otherTexts = texts.filter((t) => t.text.trim() !== title);
  if (otherTexts.length === 0) return undefined;
  return otherTexts.map((t) => t.text.trim()).join(" ");
}

/** 判断节点名是否匹配 showcase 相关关键词 */
function isShowcaseRelated(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return (
    lower.includes("showcase") ||
    lower.includes("product") ||
    lower.includes("group") ||
    lower.includes("gallery") ||
    lower.includes("display") ||
    lower.includes("collection") ||
    lower.includes("系列") ||
    lower.includes("展示") ||
    lower.includes("产品") ||
    lower.includes("分组")
  );
}

/** 判断节点名是否匹配 application 相关关键词 */
function isApplicationRelated(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return (
    lower.includes("application") ||
    lower.includes("use case") ||
    lower.includes("scenario") ||
    lower.includes("usage") ||
    lower.includes("industry") ||
    lower.includes("应用") ||
    lower.includes("场景") ||
    lower.includes("用途") ||
    lower.includes("行业")
  );
}

/** 收集结构树中包含图片填充的节点 ID */
function collectImageNodeIds(structure: ExtractedStructure): Set<string> {
  const ids = new Set<string>();
  // 图片信息在 extraction result 的 images 数组中，不在 structure 里
  // 我们通过 structure 的类型和名称来推断
  if (
    structure.nodeType === "RECTANGLE" ||
    structure.nodeType === "ELLIPSE" ||
    structure.nodeType === "VECTOR"
  ) {
    ids.add(structure.nodeId);
  }
  for (const child of structure.children || []) {
    const childIds = collectImageNodeIds(child);
    for (const id of childIds) ids.add(id);
  }
  return ids;
}

/** 查找与某个卡片节点关联的图片节点 */
function findCardImageNodeId(
  cardNode: ExtractedStructure,
  images: ExtractedImage[]
): string | undefined {
  // 检查卡片本身是否就是图片节点
  const directMatch = images.find((img) => img.nodeId === cardNode.nodeId);
  if (directMatch) return cardNode.nodeId;

  // 检查子节点
  for (const child of cardNode.children || []) {
    const childMatch = images.find((img) => img.nodeId === child.nodeId);
    if (childMatch) return child.nodeId;

    // 递归查找
    const deepMatch = findCardImageNodeId(child, images);
    if (deepMatch) return deepMatch;
  }

  return undefined;
}

/**
 * 分析 Figma 提取结果，识别产品页面结构
 */
function analyzeExtractionResult(
  result: ExtractionResult
): AnalyzedSection[] {
  const sections: AnalyzedSection[] = [];
  const { structure, texts, images } = result;

  // 策略1: 通过节点名称关键词识别 section
  const sectionNodes = findSectionNodes(structure);

  if (sectionNodes.length > 0) {
    for (const sectionNode of sectionNodes) {
      const sectionTexts = findTextsInRegion(texts, sectionNode.nodeId);
      const isApp = isApplicationRelated(sectionNode.name);

      if (isApp) {
        // Application section
        const cards = buildApplicationCards(sectionNode, texts, images);
        const sectionTitle = findTitleFromTexts(sectionTexts.slice(0, 1));
        const otherTexts = sectionTitle
          ? sectionTexts.filter((t) => t.text.trim() !== sectionTitle)
          : sectionTexts;

        sections.push({
          type: "applications",
          cards,
          sectionTitle: sectionTitle || undefined,
          sectionDescription: otherTexts.length > 0
            ? otherTexts.map((t) => t.text.trim()).join(" ")
            : undefined,
        });
      } else {
        // Showcase section
        const groups = buildShowcaseGroups(sectionNode, texts, images);
        sections.push({
          type: "showcaseGroups",
          groups,
        });
      }
    }
  }

  // 策略2: 如果没有通过关键词识别到 section，尝试整体分析
  if (sections.length === 0) {
    // 将整个结构作为一个 showcase section
    const groups = buildShowcaseGroups(structure, texts, images);
    if (groups.length > 0) {
      sections.push({
        type: "showcaseGroups",
        groups,
      });
    }

    // 如果有图片但没有分组，将所有图片作为 applications
    const unassignedImages = images.filter(
      (img) => !sections.some((s) =>
        s.groups?.some((g) =>
          g.cards.some((c) => c.imageNodeId === img.nodeId)
        ) ||
        s.cards?.some((c) => c.imageNodeId === img.nodeId)
      )
    );

    if (unassignedImages.length > 0) {
      const cards = unassignedImages.map((img, i) => {
        const regionTexts = findTextsInRegion(texts, img.nodeId);
        const title = findTitleFromTexts(regionTexts) || img.nodeName;
        const description = findDescriptionFromTexts(regionTexts, title);

        return {
          title,
          nodeId: img.nodeId,
          imageNodeId: img.nodeId,
          description,
        };
      });

      sections.push({
        type: "applications",
        cards,
      });
    }
  }

  return sections;
}

/** 查找结构中的 section 级别节点 */
function findSectionNodes(
  structure: ExtractedStructure,
  depth: number = 0
): ExtractedStructure[] {
  const results: ExtractedStructure[] = [];

  // 只在较浅的层级查找 section（通常是第1-3层）
  if (depth <= 3) {
    const isSection =
      structure.nodeType === "FRAME" &&
      structure.children &&
      structure.children.length > 0 &&
      (isShowcaseRelated(structure.name) || isApplicationRelated(structure.name));

    if (isSection) {
      results.push(structure);
    } else {
      for (const child of structure.children || []) {
        results.push(...findSectionNodes(child, depth + 1));
      }
    }
  }

  return results;
}

/** 从 section 节点构建 showcase groups */
function buildShowcaseGroups(
  sectionNode: ExtractedStructure,
  texts: ExtractedText[],
  images: ExtractedImage[]
): AnalyzedSection["groups"] {
  const groups: NonNullable<AnalyzedSection["groups"]> = [];

  // 查找 section 下的直接 FRAME 子节点作为 group
  const candidateGroups = (sectionNode.children || []).filter(
    (child) =>
      child.nodeType === "FRAME" &&
      child.children &&
      child.children.length > 0
  );

  if (candidateGroups.length === 0) {
    // 整个 section 作为一个 group
    const sectionTexts = findTextsInRegion(texts, sectionNode.nodeId);
    const groupTitle = findTitleFromTexts(sectionTexts.slice(0, 1)) || sectionNode.name;
    const cards = buildShowcaseCards(sectionNode, texts, images);

    if (cards.length > 0) {
      groups.push({
        title: groupTitle,
        nodeId: sectionNode.nodeId,
        cards,
      });
    }
  } else {
    for (const groupNode of candidateGroups) {
      const groupTexts = findTextsInRegion(texts, groupNode.nodeId);
      const groupTitle = findTitleFromTexts(groupTexts.slice(0, 1)) || groupNode.name;
      const cards = buildShowcaseCards(groupNode, texts, images);

      if (cards.length > 0) {
        groups.push({
          title: groupTitle,
          nodeId: groupNode.nodeId,
          cards,
        });
      }
    }
  }

  return groups;
}

/** 从 group 节点构建 showcase cards */
function buildShowcaseCards(
  groupNode: ExtractedStructure,
  texts: ExtractedText[],
  images: ExtractedImage[]
): AnalyzedSection["groups"] extends Array<infer T> | undefined
  ? T extends { cards: Array<infer C> }
    ? C
    : never
  : never {
  const cards: Array<{
    title: string;
    nodeId: string;
    imageNodeId?: string;
    description?: string;
  }> = [];

  // 查找 group 下的直接子节点作为 card
  const candidateCards = (groupNode.children || []).filter(
    (child) =>
      child.nodeType === "FRAME" ||
      child.nodeType === "COMPONENT" ||
      child.nodeType === "INSTANCE" ||
      child.nodeType === "RECTANGLE"
  );

  for (const cardNode of candidateCards) {
    const cardTexts = findTextsInRegion(texts, cardNode.nodeId);
    const imageNodeId = findCardImageNodeId(cardNode, images);

    // 只有包含图片的节点才作为卡片
    if (imageNodeId) {
      const title = findTitleFromTexts(cardTexts) || cardNode.name;
      const description = findDescriptionFromTexts(cardTexts, title);

      cards.push({
        title,
        nodeId: cardNode.nodeId,
        imageNodeId,
        description,
      });
    }
  }

  // 如果没有找到带图片的卡片，尝试用图片节点本身
  if (cards.length === 0) {
    for (const img of images) {
      if (img.nodeId.startsWith(groupNode.nodeId.replace(/:/g, "-"))) {
        const regionTexts = findTextsInRegion(texts, img.nodeId);
        const title = findTitleFromTexts(regionTexts) || img.nodeName;

        cards.push({
          title,
          nodeId: img.nodeId,
          imageNodeId: img.nodeId,
        });
      }
    }
  }

  return cards as any;
}

/** 从 section 节点构建 application cards */
function buildApplicationCards(
  sectionNode: ExtractedStructure,
  texts: ExtractedText[],
  images: ExtractedImage[]
): AnalyzedSection["cards"] {
  const cards: NonNullable<AnalyzedSection["cards"]> = [];

  // 查找 section 下的直接子节点作为 card
  const candidateCards = (sectionNode.children || []).filter(
    (child) =>
      child.nodeType === "FRAME" ||
      child.nodeType === "COMPONENT" ||
      child.nodeType === "INSTANCE"
  );

  for (const cardNode of candidateCards) {
    const cardTexts = findTextsInRegion(texts, cardNode.nodeId);
    const imageNodeId = findCardImageNodeId(cardNode, images);

    if (imageNodeId) {
      const title = findTitleFromTexts(cardTexts) || cardNode.name;
      const description = findDescriptionFromTexts(cardTexts, title);

      cards.push({
        title,
        nodeId: cardNode.nodeId,
        imageNodeId,
        description,
      });
    }
  }

  return cards;
}

// ─── Manifest Generation ─────────────────────────────────────────────────────

async function generateManifest(
  slug: string,
  result: ExtractionResult,
  sections: AnalyzedSection[],
  outputDir: string
): Promise<{
  manifest: ProductImportManifest;
  imageCopies: { src: string; dest: string; manifestPath: string }[];
}> {
  const fs = await import("node:fs/promises");

  const imageCopies: { src: string; dest: string; manifestPath: string }[] = [];
  let imageIndex = 0;

  const showcaseGroups: ProductImportGroup[] = [];
  const applications: ProductImportCard[] = [];
  let applicationTitle: string | undefined;
  let applicationDescription: string | undefined;
  const importSections: ProductImportSection[] = [];

  for (const section of sections) {
    if (section.type === "showcaseGroups" && section.groups && section.groups.length > 0) {
      if (!importSections.includes("showcaseGroups")) {
        importSections.push("showcaseGroups");
      }

      for (const group of section.groups) {
        const groupSourceKey = `${slug}-showcase-${group.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 30)}`;

        const cards: ProductImportCard[] = [];

        for (const card of group.cards) {
          const image = card.imageNodeId
            ? findImageForNode(result.images, card.imageNodeId)
            : undefined;

          if (!image) {
            console.warn(
              `  ⚠️ 卡片 "${card.title}" (${card.nodeId}) 没有找到对应图片，跳过`
            );
            continue;
          }

          const fileName = generateImageFileName(slug, card.nodeId, card.title, imageIndex);
          const destPath = path.join(outputDir, "import-assets", "products", slug, fileName);
          const manifestPath = fileName; // 相对于 import-assets/products/<slug>/

          const cardSourceKey = `${slug}-card-${card.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 30)}-${imageIndex}`;

          cards.push({
            sourceKey: cardSourceKey,
            title: card.title,
            imagePath: manifestPath,
            alt: card.title,
            description: card.description,
            figmaNodeId: card.nodeId,
          });

          imageCopies.push({
            src: image.localPath,
            dest: destPath,
            manifestPath,
          });

          imageIndex++;
        }

        if (cards.length > 0) {
          showcaseGroups.push({
            sourceKey: groupSourceKey,
            title: group.title,
            cards,
            figmaNodeId: group.nodeId,
          });
        }
      }
    }

    if (section.type === "applications" && section.cards && section.cards.length > 0) {
      if (!importSections.includes("applications")) {
        importSections.push("applications");
      }

      if (section.sectionTitle) {
        applicationTitle = section.sectionTitle;
      }
      if (section.sectionDescription) {
        applicationDescription = section.sectionDescription;
      }

      for (const card of section.cards) {
        const image = card.imageNodeId
          ? findImageForNode(result.images, card.imageNodeId)
          : undefined;

        if (!image) {
          console.warn(
            `  ⚠️ 应用卡片 "${card.title}" (${card.nodeId}) 没有找到对应图片，跳过`
          );
          continue;
        }

        const fileName = generateImageFileName(slug, card.nodeId, card.title, imageIndex);
        const destPath = path.join(outputDir, "import-assets", "products", slug, fileName);
        const manifestPath = fileName;

        const cardSourceKey = `${slug}-app-${card.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 30)}-${imageIndex}`;

        applications.push({
          sourceKey: cardSourceKey,
          title: card.title,
          imagePath: manifestPath,
          alt: card.title,
          description: card.description,
          figmaNodeId: card.nodeId,
        });

        imageCopies.push({
          src: image.localPath,
          dest: destPath,
          manifestPath,
        });

        imageIndex++;
      }
    }
  }

  // 获取产品标题：优先用 Figma 文件名，或用 slug
  const productTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const manifest: ProductImportManifest = {
    slug,
    title: productTitle,
    figmaSelectionUrl: result.source.url,
    sections: importSections,
    ...(showcaseGroups.length > 0 ? { showcaseGroups } : {}),
    ...(applicationTitle ? { applicationTitle } : {}),
    ...(applicationDescription ? { applicationDescription } : {}),
    ...(applications.length > 0 ? { applications } : {}),
  };

  return { manifest, imageCopies };
}

// ─── Manifest File Writer ────────────────────────────────────────────────────

function manifestToTs(manifest: ProductImportManifest): string {
  const lines: string[] = [];

  lines.push(`import type { ProductImportManifest } from "./types";`);
  lines.push(``);
  lines.push(`const manifest: ProductImportManifest = ${JSON.stringify(manifest, null, 2)};`);
  lines.push(``);
  lines.push(`export default manifest;`);
  lines.push(``);

  return lines.join("\n");
}

// ─── Interactive Mode ────────────────────────────────────────────────────────

async function confirmMapping(
  sections: AnalyzedSection[],
  result: ExtractionResult
): Promise<AnalyzedSection[]> {
  const readline = await import("node:readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  console.log("\n📋 映射预览:");
  console.log("═".repeat(60));

  const confirmedSections: AnalyzedSection[] = [];

  for (const section of sections) {
    console.log(
      `\n🔍 Section 类型: ${section.type === "showcaseGroups" ? "Showcase Groups" : "Applications"}`
    );

    if (section.type === "showcaseGroups" && section.groups) {
      for (const group of section.groups) {
        console.log(`  📁 Group: "${group.title}" (${group.nodeId})`);
        for (const card of group.cards) {
          const image = card.imageNodeId
            ? findImageForNode(result.images, card.imageNodeId)
            : undefined;
          console.log(`    🖼️  Card: "${card.title}" → ${image?.localPath || "无图片"}`);
          if (card.description) {
            console.log(`       描述: "${card.description}"`);
          }
        }
      }
    }

    if (section.type === "applications" && section.cards) {
      if (section.sectionTitle) {
        console.log(`  标题: "${section.sectionTitle}"`);
      }
      for (const card of section.cards) {
        const image = card.imageNodeId
          ? findImageForNode(result.images, card.imageNodeId)
          : undefined;
        console.log(`    🖼️  Card: "${card.title}" → ${image?.localPath || "无图片"}`);
        if (card.description) {
          console.log(`       描述: "${card.description}"`);
        }
      }
    }

    const answer = await question("\n  ✅ 确认此 Section? [Y/n/s=skip]: ");
    const trimmed = answer.trim().toLowerCase();

    if (trimmed === "s" || trimmed === "skip") {
      console.log("  ⏭️  跳过");
      continue;
    }

    if (trimmed === "n" || trimmed === "no") {
      // 允许切换类型
      const newType = await question(
        `  切换类型? [showcase/applications/skip]: `
      );
      if (newType.trim().toLowerCase() === "showcase") {
        confirmedSections.push({ ...section, type: "showcaseGroups" });
      } else if (newType.trim().toLowerCase() === "applications") {
        confirmedSections.push({ ...section, type: "applications" });
      } else {
        console.log("  ⏭️  跳过");
        continue;
      }
    } else {
      confirmedSections.push(section);
    }
  }

  rl.close();
  return confirmedSections;
}

// ─── Upload Helpers ──────────────────────────────────────────────────────────

/** 运行 seed-products.ts 脚本 */
async function runSeedProducts(
  slug: string,
  dryRun: boolean
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const seedArgs = [
      "scripts/seed-products.ts",
      "--slug",
      slug,
    ];

    if (dryRun) {
      seedArgs.push("--dry-run");
    }

    const studioRoot = path.resolve(__dirname, "..");
    const child = spawn("./node_modules/.bin/tsx", seedArgs, {
      cwd: studioRoot,
      shell: false,
    });

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      const str = data.toString();
      output += str;
      process.stdout.write(str); // 实时输出
    });

    child.stderr.on("data", (data) => {
      const str = data.toString();
      errorOutput += str;
      process.stderr.write(str); // 实时输出错误
    });

    child.on("close", (code) => {
      resolve({
        success: code === 0,
        output: output + errorOutput,
      });
    });
  });
}

/** 询问用户确认 */
async function askConfirmation(prompt: string): Promise<boolean> {
  const readline = await import("node:readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      resolve(trimmed === "y" || trimmed === "yes" || trimmed === "");
    });
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);
  const fs = await import("node:fs/promises");

  // 1. 读取 extraction result
  console.log(`📖 读取提取结果: ${args.extractionPath}`);
  let result: ExtractionResult;
  try {
    const raw = await fs.readFile(args.extractionPath, "utf-8");
    result = JSON.parse(raw) as ExtractionResult;
  } catch (err) {
    console.error(`错误: 无法读取提取结果文件: ${(err as Error).message}`);
    process.exit(1);
  }

  console.log(`  文件: ${result.source.fileName}`);
  console.log(`  Node ID: ${result.source.nodeId}`);
  console.log(`  文本节点: ${result.texts.length}`);
  console.log(`  图片资源: ${result.images.length}`);

  // 2. 分析结构
  console.log("\n🔍 分析 Figma 结构...");
  const sections = analyzeExtractionResult(result);

  if (sections.length === 0) {
    console.error("错误: 未能从提取结果中识别出任何 product section");
    console.error("提示: 请确保 Figma 选中区域包含 showcase 或 application 相关内容");
    process.exit(1);
  }

  console.log(`  识别到 ${sections.length} 个 section:`);
  for (const section of sections) {
    const cardCount =
      section.type === "showcaseGroups"
        ? section.groups?.reduce((sum, g) => sum + g.cards.length, 0) ?? 0
        : section.cards?.length ?? 0;
    console.log(
      `  - ${section.type}: ${cardCount} 张卡片` +
        (section.type === "showcaseGroups"
          ? ` (${section.groups?.length ?? 0} 个分组)`
          : "")
    );
  }

  // 3. 交互模式确认
  let finalSections = sections;
  if (args.interactive) {
    finalSections = await confirmMapping(sections, result);
  }

  if (finalSections.length === 0) {
    console.log("\n⏭️  没有确认的 section，退出");
    process.exit(0);
  }

  // 4. 生成 manifest
  const studioRoot = path.resolve(__dirname, "..");
  const { manifest, imageCopies } = await generateManifest(
    args.slug,
    result,
    finalSections,
    studioRoot
  );

  // 5. 复制图片
  console.log("\n📁 复制图片到 import-assets...");
  for (const copy of imageCopies) {
    try {
      await fs.mkdir(path.dirname(copy.dest), { recursive: true });
      await fs.copyFile(copy.src, copy.dest);
      console.log(`  ✅ ${path.basename(copy.dest)}`);
    } catch (err) {
      console.warn(
        `  ⚠️ 复制失败 ${path.basename(copy.dest)}: ${(err as Error).message}`
      );
    }
  }

  // 6. 写入 manifest
  const manifestPath =
    args.outputPath ||
    path.join(studioRoot, "import-data", "products", `${args.slug}.ts`);

  console.log(`\n📝 写入 manifest: ${manifestPath}`);
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, manifestToTs(manifest), "utf-8");

  // 7. 输出摘要
  console.log("\n" + "═".repeat(60));
  console.log("📊 转换摘要");
  console.log("═".repeat(60));
  console.log(`  Product Slug: ${manifest.slug}`);
  console.log(`  Product Title: ${manifest.title}`);
  console.log(`  Figma URL: ${manifest.figmaSelectionUrl}`);
  console.log(`  Sections: ${manifest.sections.join(", ")}`);

  if (manifest.showcaseGroups) {
    console.log(`  Showcase Groups: ${manifest.showcaseGroups.length}`);
    for (const group of manifest.showcaseGroups) {
      console.log(`    - ${group.title} (${group.cards.length} cards)`);
    }
  }

  if (manifest.applications) {
    console.log(`  Applications: ${manifest.applications.length} cards`);
  }

  console.log(`  图片复制: ${imageCopies.length} 个`);
  console.log(`  Manifest 文件: ${manifestPath}`);
  console.log("═".repeat(60));

  // 8. 自动上传流程
  if (args.upload) {
    console.log("\n🔄 自动上传模式启用");
    console.log("─".repeat(60));

    // 8.1 Dry-run 验证
    console.log("\n📋 Step 1: Dry-run 验证...");
    const dryRunResult = await runSeedProducts(args.slug, true);

    if (!dryRunResult.success) {
      console.error("\n❌ Dry-run 验证失败，请检查 manifest 文件");
      console.log(`\n💡 你可以手动检查: ${manifestPath}`);
      process.exit(1);
    }

    console.log("\n✅ Dry-run 验证通过");

    // 8.2 询问确认
    console.log("\n" + "─".repeat(60));
    console.log("📋 Step 2: 确认上传");
    console.log("─".repeat(60));
    console.log(`\n即将上传以下数据到 Sanity:`);
    console.log(`  - Product: ${manifest.title} (${manifest.slug})`);
    console.log(`  - Sections: ${manifest.sections.join(", ")}`);
    console.log(`  - 图片数量: ${imageCopies.length}`);

    const confirmed = await askConfirmation("\n🤔 确认上传到 Sanity? [Y/n]: ");

    if (!confirmed) {
      console.log("\n⏭️  已取消上传");
      console.log(`💡 你可以稍后手动上传: pnpm exec tsx scripts/seed-products.ts --slug ${args.slug}`);
      process.exit(0);
    }

    // 8.3 正式上传
    console.log("\n📤 Step 3: 上传到 Sanity...");
    const uploadResult = await runSeedProducts(args.slug, false);

    if (!uploadResult.success) {
      console.error("\n❌ 上传失败");
      process.exit(1);
    }

    console.log("\n" + "═".repeat(60));
    console.log("🎉 上传完成！");
    console.log("═".repeat(60));
    console.log(`\n✅ ${manifest.title} 产品数据已成功导入 Sanity`);
    console.log(`\n💡 建议在 Sanity Studio 中检查:`);
    console.log(`   - 确认 showcaseGroups/applications 显示正确`);
    console.log(`   - 检查图片顺序和描述文案`);
  } else {
    // 手动模式：提示下一步
    console.log("\n🚀 下一步:");
    console.log(`  1. 检查 manifest 文件: ${manifestPath}`);
    console.log(`  2. 验证 (dry-run): pnpm exec tsx scripts/seed-products.ts --slug ${args.slug} --dry-run`);
    console.log(`  3. 正式导入: pnpm exec tsx scripts/seed-products.ts --slug ${args.slug}`);
    console.log(`\n💡 提示: 使用 --upload 参数可自动完成验证和上传`);
  }
}

main().catch((err) => {
  console.error("致命错误:", err);
  process.exit(1);
});

