import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'listBlock',
  title: 'List Block',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'markerStyle',
      title: 'Marker Style',
      type: 'string',
      initialValue: 'bullet',
      options: {
        list: [
          { title: 'Bullet', value: 'bullet' },
          { title: 'Number', value: 'number' },
          { title: 'Plain', value: 'plain' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
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
});
