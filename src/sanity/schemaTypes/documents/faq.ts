// src/sanity/schemaTypes/documents/faq.ts
import { defineType, defineField } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

export const faq = defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'question', title: 'Pregunta', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'answer', title: 'Respuesta', type: 'localePortableText' }),
    defineField({
      name: 'category', title: 'Categoría', type: 'string',
      options: { list: [{ title: 'General', value: 'general' }, { title: 'Servicios', value: 'servicios' }, { title: 'Viaje y alojamiento', value: 'viaje' }, { title: 'Pagos', value: 'pagos' }, { title: 'Post-tratamiento', value: 'post-tratamiento' }] },
    }),
    defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }] }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
    defineField({ name: 'isActive', title: 'Activo', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'question.es', subtitle: 'category' },
    prepare({ title, subtitle }) {
      return { title: title || 'Sin pregunta', subtitle: subtitle || '' }
    },
  },
})
