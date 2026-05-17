import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'customizationImage',
  title: 'Customization Image',
  type: 'object',
  fields: [
    defineField({
      name: 'sourceKey',
      title: 'Source Key',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'image',
    },
  },
});
