import type {
  LegacyCustomizationBlock,
  ProductCustomizationBlock,
} from "../../../astro/src/lib/customization-content.ts";

export type ProductImportSection = "showcaseGroups" | "applications" | "customizationGroups";

export interface ProductImportCard {
  sourceKey: string;
  title: string;
  imagePath: string;
  alt: string;
  description?: string;
  figmaNodeId?: string;
}

export interface ProductImportGroup {
  sourceKey: string;
  title: string;
  cards: ProductImportCard[];
  figmaNodeId?: string;
}

export type ProductImportCustomizationBlock = ProductCustomizationBlock;

export type ProductImportLegacyCustomizationBlock = LegacyCustomizationBlock;

export type ProductImportCustomizationBlockLike =
  | ProductImportCustomizationBlock
  | ProductImportLegacyCustomizationBlock;

export interface ProductImportCustomizationGroup {
  sourceKey: string;
  title: string;
  figmaNodeId?: string;
  intro?: string;
  images?: ProductImportCard[];
  blocks: ProductImportCustomizationBlockLike[];
}

export interface ProductImportManifest {
  slug: string;
  title: string;
  figmaSelectionUrl?: string;
  sections: ProductImportSection[];
  showcaseGroups?: ProductImportGroup[];
  applicationTitle?: string;
  applicationDescription?: string;
  applications?: ProductImportCard[];
  customizationGroups?: ProductImportCustomizationGroup[];
}
