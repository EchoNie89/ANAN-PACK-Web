export type CustomizationMarkerStyle = 'bullet' | 'number' | 'plain';

export interface ParagraphBlock {
  _type: 'paragraphBlock';
  text: string;
}

export interface ListBlock {
  _type: 'listBlock';
  title?: string;
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

export interface LegacyCustomizationBlock {
  title: string;
  items: string[];
}

export function isLegacyCustomizationBlock(
  block: ProductCustomizationBlock | LegacyCustomizationBlock,
): block is LegacyCustomizationBlock {
  return !('_type' in block);
}

export function normalizeLegacyCustomizationBlock(
  block: LegacyCustomizationBlock,
): ListBlock {
  return {
    _type: 'listBlock',
    title: block.title,
    markerStyle: 'bullet',
    items: [...block.items],
  };
}

export function normalizeCustomizationBlock(
  block: ProductCustomizationBlock | LegacyCustomizationBlock,
): ProductCustomizationBlock {
  return isLegacyCustomizationBlock(block)
    ? normalizeLegacyCustomizationBlock(block)
    : block;
}
