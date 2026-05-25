// src/sanity/schemaTypes/documents/testimonial.ts
import { defineType, defineField } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({ name: 'patientName', title: 'Nombre del paciente', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'patientOrigin', title: 'Ciudad / País de origen', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] }),
    defineField({ name: 'service', title: 'Servicio recibido', type: 'reference', to: [{ type: 'service' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'rating', title: 'Calificación (1–5)', type: 'number', validation: (Rule) => Rule.required().min(1).max(5).integer() }),
    defineField({ name: 'quote', title: 'Testimonio', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(300) }, { name: 'en', title: 'English', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(300) }] }),
    defineField({ name: 'photo', title: 'Foto del paciente', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] }),
    defineField({ name: 'videoUrl', title: 'URL de video testimonial', type: 'url' }),
    defineField({ name: 'isApproved', title: '✅ Aprobado para publicar', type: 'boolean', initialValue: false, description: 'SEGURIDAD: Solo Admin puede aprobar. El sitio solo muestra testimonios aprobados.' }),
    defineField({ name: 'publishedAt', title: 'Fecha', type: 'datetime', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'patientName', subtitle: 'service.title.es', media: 'photo' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin nombre', subtitle: subtitle || '', media }
    },
  },
})
