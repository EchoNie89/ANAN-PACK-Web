import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'customizationGroup',
  title: 'Customization Group',
  type: 'object',
  fields: [
    defineField({
      name: 'sourceKey',
      title: 'Source Key',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'figmaNodeId',
      title: 'Figma Node ID',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'title',
      title: 'Group Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'customizationImage' }],
    }),
    defineField({
      name: 'blocks',
      title: 'Content Blocks',
      type: 'array',
      of: [
        { type: 'paragraphBlock' },
        { type: 'listBlock' },
        { type: 'entryListBlock' },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'intro',
    },
  },
});
