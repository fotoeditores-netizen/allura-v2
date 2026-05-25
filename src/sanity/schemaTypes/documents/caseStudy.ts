// src/sanity/schemaTypes/documents/caseStudy.ts
import { defineType, defineField } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Caso de éxito',
  type: 'document',
  icon: TrendUpwardIcon,
  groups: [
    { name: 'content', title: '📝 Contenido', default: true },
    { name: 'media', title: '🖼 Fotos antes/después' },
    { name: 'relations', title: '🔗 Relacionados' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'patientOrigin', title: 'Ciudad / País del paciente', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] }),
    defineField({ name: 'service', title: 'Servicio', type: 'reference', to: [{ type: 'service' }], validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'summary', title: 'Resumen', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }] }),
    defineField({ name: 'challenge', title: 'Desafío', type: 'localePortableText', group: 'content' }),
    defineField({ name: 'solution', title: 'Solución', type: 'localePortableText', group: 'content' }),
    defineField({ name: 'results', title: 'Resultados', type: 'localePortableText', group: 'content' }),
    defineField({ name: 'beforeImages', title: 'Imágenes ANTES', type: 'array', group: 'media', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }], validation: (Rule) => Rule.required().min(1).max(4) }),
    defineField({ name: 'afterImages', title: 'Imágenes DESPUÉS', type: 'array', group: 'media', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }], validation: (Rule) => Rule.required().min(1).max(4) }),
    defineField({ name: 'testimonial', title: 'Testimonio del paciente', type: 'reference', to: [{ type: 'testimonial' }], group: 'relations' }),
    defineField({ name: 'teamMembers', title: 'Profesionales involucrados', type: 'array', of: [{ type: 'reference', to: [{ type: 'teamMember' }] }], validation: (Rule) => Rule.max(3), group: 'relations' }),
    defineField({ name: 'isApproved', title: '✅ Aprobado para publicar', type: 'boolean', initialValue: false, description: 'SEGURIDAD: Solo Admin puede aprobar. El sitio solo muestra casos aprobados.' }),
    defineField({ name: 'publishedAt', title: 'Fecha', type: 'datetime', validation: (Rule) => Rule.required() }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', validation: (Rule) => Rule.required(), group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'service.title.es', approved: 'isApproved' },
    prepare({ title, subtitle, approved }) {
      return { title: `${approved ? '✅' : '⏳'} ${title || 'Sin título'}`, subtitle: subtitle || '' }
    },
  },
})
