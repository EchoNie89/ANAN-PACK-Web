import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'customizationBlock',
  title: 'Legacy Customization Block',
  type: 'object',
  description:
    'Deprecated compatibility type for older product customization data. Migrate items to the structured block types.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'markerStyle',
      title: 'Marker Style',
      type: 'string',
      options: {
        list: [
          { title: 'Bullet', value: 'bullet' },
          { title: 'Number', value: 'number' },
          { title: 'Plain', value: 'plain' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'note',
      title: 'Trailing Note',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({
      title,
      items,
    }: {
      title?: string;
      items?: string[];
    }) {
      return {
        title: title || 'Legacy customization block',
        subtitle: Array.isArray(items) ? `${items.length} item(s)` : 'No items',
      };
    },
  },
});
