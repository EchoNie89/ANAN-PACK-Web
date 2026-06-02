import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'entryListBlock',
  title: 'Entry List Block',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'markerStyle',
      title: 'Marker Style',
      type: 'string',
      initialValue: 'number',
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
      name: 'entries',
      title: 'Entries',
      type: 'array',
      of: [{ type: 'customizationEntry' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
