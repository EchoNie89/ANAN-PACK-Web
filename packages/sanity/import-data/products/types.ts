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

export interface ProductImportTextBlock {
  title: string;
  items: string[];
}

export interface ProductImportCustomizationGroup {
  sourceKey: string;
  title: string;
  intro?: string;
  images?: ProductImportCard[];
  blocks: ProductImportTextBlock[];
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
