import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'showcaseGroup',
  title: 'Showcase Group',
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
      title: 'Group Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. Woven Labels, Printed Labels, Special Labels',
    }),
    defineField({
      name: 'description',
      title: 'Group Description',
      type: 'string',
      description: 'Optional description shown below the group title.',
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{ type: 'showcaseCard' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'cards.0.image',
    },
  },
});
