import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'paragraphBlock',
  title: 'Paragraph Block',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare({ title }: { title?: string }) {
      return {
        title: 'Paragraph',
        subtitle: title?.slice(0, 80) || 'No text',
      };
    },
  },
});
