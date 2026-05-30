import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productMegaMenuCard',
  title: 'Mega Menu Card',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'image.alt',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Mega Menu Card',
        media,
      };
    },
  },
});
