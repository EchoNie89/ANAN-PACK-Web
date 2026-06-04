import type { ProductCustomizationBlock } from "../../../astro/src/lib/customization-content.ts";

export type ProductImportSection = "showcaseGroups" | "applications" | "customizationGroups";

export interface ProductImportCard {
  sourceKey: string;
  title: string;
  imagePath: string;
  alt: string;
  description?: string;
  figmaNodeId?: string;
}

export interface ProductImportShowcaseCard extends Omit<ProductImportCard, 'title'> {
  title?: string;
}

export interface ProductImportGroup {
  sourceKey: string;
  title: string;
  cards: ProductImportShowcaseCard[];
  figmaNodeId?: string;
}

export type ProductImportCustomizationBlock = ProductCustomizationBlock;

export interface ProductImportCustomizationGroup {
  sourceKey: string;
  title: string;
  figmaNodeId?: string;
  intro?: string;
  images?: ProductImportCard[];
  blocks: ProductImportCustomizationBlock[];
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
