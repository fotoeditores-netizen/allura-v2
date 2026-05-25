// src/sanity/schemaTypes/documents/galleryItem.ts
import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Ítem de galería',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] }),
    defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
    defineField({ name: 'category', title: 'Categoría', type: 'string', options: { list: [{ title: 'Clínica', value: 'clinic' }, { title: 'Equipo', value: 'team' }, { title: 'Resultados', value: 'results' }, { title: 'Medellín', value: 'medellin' }, { title: 'Eventos', value: 'events' }] } }),
    defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }] }),
    defineField({ name: 'isFeatured', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'publishedAt', title: 'Fecha', type: 'datetime', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'category', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin título', subtitle: subtitle || '', media }
    },
  },
})
