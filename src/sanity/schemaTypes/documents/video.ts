// src/sanity/schemaTypes/documents/video.ts
import { defineType, defineField } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'description', title: 'Descripción', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 2 }, { name: 'en', title: 'English', type: 'text', rows: 2 }] }),
    defineField({ name: 'platform', title: 'Plataforma', type: 'string', options: { list: [{ title: 'YouTube', value: 'youtube' }, { title: 'Vimeo', value: 'vimeo' }, { title: 'Instagram', value: 'instagram' }], layout: 'radio' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'videoId', title: 'ID del video', type: 'string', description: 'Solo el ID, no la URL completa. Ej para YouTube: dQw4w9WgXcQ', validation: (Rule) => Rule.required() }),
    defineField({ name: 'thumbnail', title: 'Miniatura personalizada', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }),
    defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }] }),
    defineField({ name: 'category', title: 'Tipo de video', type: 'string', options: { list: [{ title: 'Testimonio', value: 'testimonial' }, { title: 'Educativo', value: 'education' }, { title: 'Tour de clínica', value: 'clinic-tour' }, { title: 'Resultados', value: 'results' }] } }),
    defineField({ name: 'isFeatured', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'publishedAt', title: 'Fecha', type: 'datetime', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'platform', media: 'thumbnail' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin título', subtitle: subtitle || '', media }
    },
  },
})
