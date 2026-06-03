import {
  normalizeCustomizationBlock,
  type CustomizationMarkerStyle,
  type LegacyCustomizationBlock,
  type ProductCustomizationBlock,
} from "../../astro/src/lib/customization-content.ts";
import type { ProductImportCustomizationBlockLike } from "../import-data/products/types";

const MARKER_STYLES = new Set<CustomizationMarkerStyle>([
  "bullet",
  "number",
  "plain",
]);

function isMarkerStyle(value: unknown): value is CustomizationMarkerStyle {
  return typeof value === "string" && MARKER_STYLES.has(value as CustomizationMarkerStyle);
}

function hasNonEmptyItems(value: unknown): value is string[] {
  return Array.isArray(value)
    && value.length > 0
    && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function hasNonEmptyParagraphs(value: unknown): value is string[] {
  return Array.isArray(value)
    && value.length > 0
    && value.every((paragraph) => typeof paragraph === "string" && paragraph.trim().length > 0);
}

function pushMarkerStyleError(
  errors: string[],
  value: unknown,
  label: string,
) {
  if (!isMarkerStyle(value)) {
    errors.push(`${label}.markerStyle must be "bullet", "number", or "plain"`);
  }
}

function validateListItems(
  errors: string[],
  value: unknown,
  label: string,
) {
  if (!hasNonEmptyItems(value)) {
    errors.push(`${label}.items must include at least one item`);
  }
}

function validateStructuredBlock(
  block: ProductCustomizationBlock,
  label: string,
): string[] {
  const errors: string[] = [];

  if (block._type === "paragraphBlock") {
    if (!block.text?.trim()) {
      errors.push(`${label}.text must be non-empty`);
    }
    return errors;
  }

  pushMarkerStyleError(errors, block.markerStyle, label);

  if (block._type === "listBlock") {
    validateListItems(errors, block.items, label);
    return errors;
  }

  if (!Array.isArray(block.entries) || block.entries.length === 0) {
    errors.push(`${label}.entries must include at least one entry`);
    return errors;
  }

  block.entries.forEach((entry, entryIndex) => {
    const entryLabel = `${label}.entries[${entryIndex}]`;
    const hasParagraphs = entry.paragraphs === undefined || hasNonEmptyParagraphs(entry.paragraphs);

    if (!hasParagraphs) {
      errors.push(`${entryLabel}.paragraphs must contain only non-empty strings`);
    }

    if (!entry.title?.trim() && !entry.note?.trim() && !entry.paragraphs?.length && !entry.detailGroups?.length) {
      errors.push(`${entryLabel} must include at least one content field`);
    }

    entry.detailGroups?.forEach((detailGroup, detailGroupIndex) => {
      const detailLabel = `${entryLabel}.detailGroups[${detailGroupIndex}]`;
      pushMarkerStyleError(errors, detailGroup.markerStyle, detailLabel);
      validateListItems(errors, detailGroup.items, detailLabel);
    });
  });

  return errors;
}

export function validateCustomizationBlockLike(
  block: ProductImportCustomizationBlockLike | LegacyCustomizationBlock,
  label: string,
): string[] {
  return validateStructuredBlock(
    normalizeCustomizationBlock(
      block as ProductCustomizationBlock | LegacyCustomizationBlock,
    ),
    label,
  );
}
