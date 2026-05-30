
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'applicationCard',
  title: 'Application Card',
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
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. Fashion Apparel, Sportswear & Activewear',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility. Defaults to title if left empty.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Optional short description shown below the title.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
});
