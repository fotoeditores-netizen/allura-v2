// src/sanity/schemaTypes/objects/navItem.ts
import { defineType, defineField } from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Ítem de navegación',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'object',
      fields: [
        {
          name: 'es',
          title: 'Español',
          type: 'string',
          validation: (Rule) => Rule.required().max(40),
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.required().max(40),
        },
      ],
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'Ruta interna (ej: /servicios) o URL externa (ej: https://...)',
      validation: (Rule) =>
        Rule.required().custom((url: string | undefined) => {
          if (!url) return 'La URL es obligatoria'
          if (url.startsWith('/') || url.startsWith('https://') || url.startsWith('http://'))
            return true
          return 'La URL debe empezar con / o https://'
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Abrir en nueva pestaña',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isExternal',
      title: 'Es enlace externo',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'children',
      title: 'Submenú (1 nivel)',
      type: 'array',
      description: 'Máximo 8 ítems.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Etiqueta',
              type: 'object',
              fields: [
                { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() },
                { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
              ],
            },
            { name: 'url', title: 'URL', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'openInNewTab', title: 'Nueva pestaña', type: 'boolean', initialValue: false },
          ],
          preview: { select: { title: 'label.es', subtitle: 'url' } },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
  ],
  preview: {
    select: { title: 'label.es', subtitle: 'url' },
    prepare({ title, subtitle }) {
      return { title: title || 'Sin etiqueta', subtitle: subtitle || '#' }
    },
  },
})
