// src/sanity/schemaTypes/documents/popup.ts
import { defineType, defineField } from 'sanity'
import { BellIcon } from '@sanity/icons'

export const popup = defineType({
  name: 'popup',
  title: 'Popup',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({ name: 'name', title: 'Nombre interno (no visible al paciente)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'title', title: 'Título del popup', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'body', title: 'Contenido', type: 'localePortableText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }),
    defineField({ name: 'cta', title: 'CTA', type: 'ctaObject' }),
    defineField({ name: 'trigger', title: 'Disparador', type: 'string', options: { list: [{ title: 'Al cargar la página', value: 'on-load' }, { title: 'Intención de salida', value: 'exit-intent' }, { title: 'Después de hacer scroll', value: 'after-scroll' }, { title: 'Tiempo definido', value: 'timed' }], layout: 'radio' } }),
    defineField({ name: 'delaySeconds', title: 'Segundos de espera', type: 'number', description: 'Solo aplica si el disparador es "Tiempo definido".', validation: (Rule) => Rule.min(3).integer() }),
    defineField({ name: 'showOnPages', title: 'Mostrar en páginas', type: 'array', of: [{ type: 'string' }], description: 'Rutas donde mostrar. Vacío = todas las páginas. Ej: /servicios/smile-makeover' }),
    defineField({ name: 'startDate', title: 'Fecha de inicio', type: 'datetime' }),
    defineField({ name: 'endDate', title: 'Fecha de fin', type: 'datetime' }),
    defineField({
      name: 'isActive',
      title: '🔴 Activo',
      type: 'boolean',
      initialValue: false,
      description: 'SEGURIDAD: Solo 1 popup puede estar activo a la vez. Desactiva el anterior antes de activar uno nuevo.',
      validation: (Rule) =>
        Rule.custom(async (isActive, context) => {
          if (!isActive) return true
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const rawId = (document?._id ?? '').replace(/^drafts\./, '')
          const activePopups = await client.fetch(
            `count(*[_type == "popup" && isActive == true && !(_id in [$draftId, $pubId])])`,
            { draftId: `drafts.${rawId}`, pubId: rawId }
          )
          if (activePopups > 0) return 'Ya hay un popup activo. Desactívalo antes de activar este.'
          return true
        }),
    }),
    defineField({ name: 'frequency', title: 'Frecuencia de aparición', type: 'string', options: { list: [{ title: 'Una vez (por usuario)', value: 'once' }, { title: 'Por sesión', value: 'per-session' }, { title: 'Siempre', value: 'always' }], layout: 'radio' }, initialValue: 'once' }),
  ],
  preview: {
    select: { title: 'name', active: 'isActive' },
    prepare({ title, active }) {
      return { title: `${active ? '🟢 ACTIVO' : '⚫'} ${title || 'Sin nombre'}`, subtitle: active ? 'Visible en el sitio' : 'Inactivo' }
    },
  },
})
