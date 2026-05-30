import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productWhatAreCustom',
  title: 'What Are Custom',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional. If left empty, the frontend generates the default section title.',
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
      rows: 8,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'overview',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'What Are Custom',
        subtitle,
      };
    },
  },
});
