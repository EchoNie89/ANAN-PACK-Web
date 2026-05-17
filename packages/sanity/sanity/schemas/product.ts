import { defineField, defineType } from 'sanity';

const PRODUCT_SLUGS = [
  { title: 'Labels', value: 'labels' },
  { title: 'Patches', value: 'patches' },
  { title: 'Ribbon', value: 'ribbon' },
  { title: 'Tissue Paper', value: 'tissue-paper' },
  { title: 'Tape', value: 'tape' },
  { title: 'Bag', value: 'bag' },
  { title: 'Hanging Tag', value: 'hanging-tag' },
  { title: 'Sticker', value: 'sticker' },
] as const;

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Product Slug',
      type: 'string',
      options: {
        list: [...PRODUCT_SLUGS],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showcaseGroups',
      title: 'Product Showcase Groups',
      type: 'array',
      of: [{ type: 'showcaseGroup' }],
    }),
    defineField({
      name: 'applicationTitle',
      title: 'Applications Section Title',
      type: 'string',
      description: 'Optional custom title for the Applications section. Defaults to "Applications" if left empty.',
    }),
    defineField({
      name: 'applicationDescription',
      title: 'Applications Section Description',
      type: 'string',
      description: 'Optional description text shown below the section title.',
    }),

    defineField({
      name: 'applications',
      title: 'Applications',
      type: 'array',
      of: [{ type: 'applicationCard' }],
    }),
    defineField({
      name: 'customizationGroups',
      title: 'Customization Groups',
      type: 'array',
      of: [{ type: 'customizationGroup' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug',
    },
  },
});
