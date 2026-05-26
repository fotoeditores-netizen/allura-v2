// src/sanity/schemaTypes/objects/localeString.ts
import { defineType, defineField } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Texto bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'string',
      validation: (Rule) => Rule.required().error('El texto en español es obligatorio'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (Rule) => Rule.required().error('English text is required'),
    }),
  ],
  preview: { select: { title: 'es', subtitle: 'en' } },
})

export const localeStringShort = defineType({
  name: 'localeStringShort',
  title: 'Texto corto bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'string',
      validation: (Rule) => Rule.required().max(80).error('Máximo 80 caracteres en español'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (Rule) => Rule.required().max(80).error('Maximum 80 characters in English'),
    }),
  ],
  preview: { select: { title: 'es', subtitle: 'en' } },
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().error('El texto en español es obligatorio'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().error('English text is required'),
    }),
  ],
  preview: { select: { title: 'es' } },
})

const portableTextBlock = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'H4', value: 'h4' },
    { title: 'Quote', value: 'blockquote' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Underline', value: 'underline' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          { name: 'href', type: 'url', title: 'URL' },
          { name: 'blank', type: 'boolean', title: 'Open in new tab' },
        ],
      },
    ],
  },
}

export const localePortableText = defineType({
  name: 'localePortableText',
  title: 'Contenido enriquecido bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [portableTextBlock, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [portableTextBlock, { type: 'image', options: { hotspot: true } }],
    }),
  ],
})
