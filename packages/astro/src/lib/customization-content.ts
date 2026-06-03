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
  title?: string;
  note?: string;
  items: string[];
}

export interface PersistedLegacyCustomizationBlock {
  _type: 'customizationBlock';
  title?: string;
  note?: string;
  items: string[];
}

export function isLegacyCustomizationBlock(
  block: ProductCustomizationBlock | LegacyCustomizationBlock | PersistedLegacyCustomizationBlock,
): block is LegacyCustomizationBlock | PersistedLegacyCustomizationBlock {
  if (!('_type' in block)) {
    return true;
  }

  return block._type === 'customizationBlock';
}

export function normalizeLegacyCustomizationBlock(
  block: LegacyCustomizationBlock | PersistedLegacyCustomizationBlock,
): ListBlock {
  return {
    _type: 'listBlock',
    markerStyle: 'bullet',
    ...(block.title ? { title: block.title } : {}),
    items: [...block.items],
    ...(block.note ? { note: block.note } : {}),
  };
}

export function normalizeCustomizationBlock(
  block: ProductCustomizationBlock | LegacyCustomizationBlock | PersistedLegacyCustomizationBlock,
): ProductCustomizationBlock {
  return isLegacyCustomizationBlock(block)
    ? normalizeLegacyCustomizationBlock(block)
    : block;
}
