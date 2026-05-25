// src/sanity/schemaTypes/documents/serviceCategory.ts
import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const serviceCategory = defineType({
  name: 'serviceCategory',
  title: 'Categoría de servicio',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'icon', title: 'Ícono (nombre Lucide)', type: 'string', description: 'Ej: Smile, HeartPulse, Sparkles, ScanFace' }),
    defineField({ name: 'coverImage', title: 'Imagen de portada', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
    defineField({ name: 'order', title: 'Orden de aparición', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject' }),
  ],
  preview: {
    select: { title: 'title.es', media: 'coverImage' },
    prepare({ title, media }) {
      return { title: title || 'Sin título', media }
    },
  },
})
