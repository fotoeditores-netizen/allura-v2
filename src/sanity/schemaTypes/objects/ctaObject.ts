// src/sanity/schemaTypes/objects/ctaObject.ts
import { defineType, defineField } from 'sanity'

export const ctaObject = defineType({
  name: 'ctaObject',
  title: 'Botón / CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Texto del botón',
      type: 'object',
      fields: [
        {
          name: 'es',
          title: 'Español',
          type: 'string',
          validation: (Rule) => Rule.required().max(50).error('Máximo 50 caracteres'),
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.required().max(50).error('Max 50 characters'),
        },
      ],
    }),
    defineField({
      name: 'url',
      title: 'URL de destino',
      type: 'string',
      description: 'Ruta interna (ej: /contacto) o URL externa (ej: https://wa.me/...)',
      validation: (Rule) =>
        Rule.required().custom((url: string | undefined) => {
          if (!url) return 'La URL es obligatoria'
          if (url.startsWith('/') || url.startsWith('https://') || url.startsWith('http://'))
            return true
          return 'La URL debe empezar con / o https://'
        }),
    }),
    defineField({
      name: 'style',
      title: 'Estilo visual',
      type: 'string',
      options: {
        list: [
          { title: 'Primario (azul oscuro)', value: 'primary' },
          { title: 'Secundario (contorno)', value: 'secondary' },
          { title: 'Ghost (transparente)', value: 'ghost' },
          { title: 'WhatsApp (verde)', value: 'whatsapp' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Abrir en nueva pestaña',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label.es', subtitle: 'url', style: 'style' },
    prepare({ title, subtitle, style }) {
      return {
        title: title || 'Sin etiqueta',
        subtitle: `${style ?? 'primary'} → ${subtitle ?? '#'}`,
      }
    },
  },
})
