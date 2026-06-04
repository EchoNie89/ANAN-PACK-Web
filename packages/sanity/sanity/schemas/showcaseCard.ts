import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'showcaseCard',
  title: 'Showcase Card',
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
      description: 'Optional image title, e.g. Damask Woven Labels, Satin Printed Labels.',
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
      description: 'Optional short description shown below the image.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
});
