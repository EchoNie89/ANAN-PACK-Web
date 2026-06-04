export type CustomizationMarkerStyle = 'bullet' | 'number' | 'plain';

export interface ParagraphBlock {
  _type: 'paragraphBlock';
  text: string;
}

export interface ListBlock {
  _type: 'listBlock';
  title?: string;
  intro?: string;
  markerStyle: CustomizationMarkerStyle;
  items: string[];
  note?: string;
}

export interface CustomizationDetailGroup {
  label?: string;
  markerStyle: CustomizationMarkerStyle;
  items: string[];
  note?: string;
}

export interface CustomizationEntry {
  title?: string;
  paragraphs?: string[];
  detailGroups?: CustomizationDetailGroup[];
  note?: string;
}

export interface EntryListBlock {
  _type: 'entryListBlock';
  title?: string;
  markerStyle: CustomizationMarkerStyle;
  entries: CustomizationEntry[];
}

export type ProductCustomizationBlock =
  | ParagraphBlock
  | ListBlock
  | EntryListBlock;
