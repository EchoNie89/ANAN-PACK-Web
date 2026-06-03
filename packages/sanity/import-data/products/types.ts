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

type ProductImportCustomizationMarkerStyle = "bullet" | "number" | "plain";

export type ProductImportCustomizationBlock =
  | {
      _type: "paragraphBlock";
      text: string;
    }
  | {
      _type: "listBlock";
      title?: string;
      markerStyle: ProductImportCustomizationMarkerStyle;
      items: string[];
      note?: string;
    }
  | {
      _type: "entryListBlock";
      title?: string;
      markerStyle: ProductImportCustomizationMarkerStyle;
      entries: Array<{
        title?: string;
        paragraphs?: string[];
        detailGroups?: Array<{
          label?: string;
          markerStyle: ProductImportCustomizationMarkerStyle;
          items: string[];
          note?: string;
        }>;
        note?: string;
      }>;
    };

export interface ProductImportCustomizationGroup {
  sourceKey: string;
  title: string;
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
