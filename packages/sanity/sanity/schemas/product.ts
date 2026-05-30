import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Product Slug',
      type: 'slug',
      options: {
        source: 'name',
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'megaMenuCard',
      title: 'Mega Menu Card',
      type: 'productMegaMenuCard',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'productHero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatAreCustom',
      title: 'What Are Custom',
      type: 'productWhatAreCustom',
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
      description:
        'Optional custom title for the Applications section. Defaults to "Applications" if left empty.',
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
    defineField({
      name: 'caseStudy',
      title: 'Case Study',
      type: 'productCaseStudy',
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{ type: 'productFaqItem' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
      media: 'megaMenuCard.image',
    },
  },
});
