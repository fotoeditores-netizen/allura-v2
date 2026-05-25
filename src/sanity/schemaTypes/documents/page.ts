// src/sanity/schemaTypes/documents/page.ts
import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'pageType', title: 'Tipo de página', type: 'string',
      options: { list: [{ title: 'Nosotros', value: 'about' }, { title: 'Cómo funciona', value: 'how-it-works' }, { title: 'Equipo', value: 'team' }, { title: 'Contacto', value: 'contact' }, { title: 'Legal ⚠️', value: 'legal' }, { title: 'Personalizada', value: 'custom' }] },
    }),
    defineField({ name: 'heroTitle', title: 'Título del hero', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] }),
    defineField({ name: 'heroSubtitle', title: 'Subtítulo del hero', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 2 }, { name: 'en', title: 'English', type: 'text', rows: 2 }] }),
    defineField({ name: 'heroImage', title: 'Imagen del hero', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }),
    defineField({ name: 'body', title: 'Contenido', type: 'localePortableText' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', validation: (Rule) => Rule.required() }),
    defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'pageType' },
    prepare({ title, subtitle }) {
      const typeLabel = subtitle === 'legal' ? '⚠️ Legal' : subtitle || 'page'
      return { title: title || 'Sin título', subtitle: typeLabel }
    },
  },
})
