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
  items?: string[];
  note?: string;
}

export type ProductCustomizationBlock =
  | ParagraphBlock
  | ListBlock;
