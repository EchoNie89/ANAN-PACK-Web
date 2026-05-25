import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Site Settings',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactDetails',
      title: 'Contact Details',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'businessHours',
          title: 'Business Hours',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'location',
          title: 'Location',
          type: 'string',
          description: 'Short location label used in the footer, e.g. Guangzhou, China',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      description:
        'Optional footer social media links. The footer always shows the platform icons; saved URLs make the matching icon clickable.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Instagram', value: 'instagram' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
            prepare(selection) {
              const title = typeof selection.title === 'string' ? selection.title : 'Social link';
              return {
                title: title.charAt(0).toUpperCase() + title.slice(1),
                subtitle: selection.subtitle,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'contactDetails.email',
    },
  },
});
