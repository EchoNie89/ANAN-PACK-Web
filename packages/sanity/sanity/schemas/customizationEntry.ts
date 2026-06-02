import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'customizationEntry',
  title: 'Customization Entry',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'detailGroups',
      title: 'Detail Groups',
      type: 'array',
      of: [{ type: 'customizationDetailGroup' }],
    }),
    defineField({
      name: 'note',
      title: 'Trailing Note',
      type: 'text',
      rows: 3,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value || typeof value !== 'object') return 'Entry is required';
      const entry = value as {
        title?: string;
        paragraphs?: string[];
        detailGroups?: unknown[];
        note?: string;
      };
      return entry.title || entry.paragraphs?.length || entry.detailGroups?.length || entry.note
        ? true
        : 'Entry must include at least one content field';
    }),
});
