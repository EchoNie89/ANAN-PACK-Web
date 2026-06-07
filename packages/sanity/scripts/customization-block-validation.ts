import {
  type CustomizationMarkerStyle,
  type ProductCustomizationBlock,
} from "../../astro/src/lib/customization-content.ts";
import type { ProductImportCustomizationBlock } from "../import-data/products/types";

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

function pushMarkerStyleError(
  errors: string[],
  value: unknown,
  label: string,
) {
  if (!isMarkerStyle(value)) {
    errors.push(`${label}.markerStyle must be "bullet", "number", or "plain"`);
  }
}

function hasTextContent(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function validateStructuredBlock(
  block: ProductCustomizationBlock | ProductImportCustomizationBlock,
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
    if (
      !hasNonEmptyItems(block.items)
      && !hasTextContent(block.intro)
      && !hasTextContent(block.note)
    ) {
      errors.push(`${label} must include intro, note, or at least one list item`);
    }
    return errors;
  }

  errors.push(`${label}._type must be "paragraphBlock" or "listBlock"`);
  return errors;
}

export function validateCustomizationBlock(
  block: ProductImportCustomizationBlock,
  label: string,
): string[] {
  return validateStructuredBlock(block, label);
}
