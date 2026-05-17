import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'customizationBlock',
  title: 'Customization Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'items',
    },
    prepare({ title, items }: { title: string; items: string[] }) {
      return {
        title,
        subtitle: items?.length ? `${items.length} items` : 'No items',
      };
    },
  },
});
