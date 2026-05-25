// src/sanity/schemaTypes/singletons/homePage.ts
import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Página de inicio',
  type: 'document',
  icon: HomeIcon,
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: '🦸 Hero', default: true },
    { name: 'benefits', title: '✅ Beneficios' },
    { name: 'services', title: '🦷 Servicios' },
    { name: 'about', title: '🏥 Nosotros teaser' },
    { name: 'medellin', title: '🏙 Medellín' },
    { name: 'team', title: '👥 Equipo' },
    { name: 'process', title: '🔄 Proceso' },
    { name: 'ctaBanner', title: '📣 Banner CTA' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Sección Hero',
      type: 'object',
      group: 'hero',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.max(60) }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.max(60) }] },
        { name: 'headlinePart1', title: 'Titular — línea 1', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required().max(50) }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required().max(50) }] },
        { name: 'headlinePart2', title: 'Titular — línea 2', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required().max(50) }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required().max(50) }] },
        { name: 'subtext', title: 'Subtexto / descripción', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 2, validation: (Rule) => Rule.required().max(200) }, { name: 'en', title: 'English', type: 'text', rows: 2, validation: (Rule) => Rule.required().max(200) }] },
        { name: 'ctaPrimary', title: 'CTA primario', type: 'ctaObject', validation: (Rule) => Rule.required() },
        { name: 'ctaSecondary', title: 'CTA secundario', type: 'ctaObject' },
        { name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] },
      ],
    }),
    defineField({
      name: 'benefitsSection',
      title: 'Sección Beneficios',
      type: 'object',
      group: 'benefits',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] },
        { name: 'subtitle', title: 'Subtítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        {
          name: 'benefits', title: 'Beneficios', type: 'array',
          of: [{
            type: 'object', name: 'benefit',
            fields: [
              { name: 'icon', title: 'Ícono (nombre Lucide)', type: 'string', description: 'Ej: Award, HeartHandshake, ShieldCheck', validation: (Rule) => Rule.required() },
              { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] },
              { name: 'description', title: 'Descripción', type: 'object', fields: [{ name: 'es', type: 'text', rows: 3, title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'text', rows: 3, title: 'English', validation: (Rule) => Rule.required() }] },
            ],
            preview: { select: { title: 'title.es', subtitle: 'icon' } },
          }],
          validation: (Rule) => Rule.min(2).max(6),
        },
      ],
    }),
    defineField({
      name: 'servicesSection',
      title: 'Sección Servicios',
      type: 'object',
      group: 'services',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] },
        { name: 'subtitle', title: 'Subtítulo', type: 'object', fields: [{ name: 'es', type: 'text', rows: 2, title: 'Español' }, { name: 'en', type: 'text', rows: 2, title: 'English' }] },
        {
          name: 'featuredCategories',
          title: 'Categorías de servicio destacadas',
          type: 'array',
          description: 'Selecciona 2 a 4 categorías para mostrar en el home.',
          of: [{ type: 'reference', to: [{ type: 'serviceCategory' }] }],
          validation: (Rule) => Rule.required().min(2).max(4),
        },
      ],
    }),
    defineField({
      name: 'aboutTeaser',
      title: 'Sección Nosotros (teaser)',
      type: 'object',
      group: 'about',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] },
        { name: 'body', title: 'Descripción', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 4, validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'text', rows: 4, validation: (Rule) => Rule.required() }] },
        { name: 'cta', title: 'CTA', type: 'ctaObject' },
        { name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] },
      ],
    }),
    defineField({
      name: 'medellinSection',
      title: 'Sección Medellín',
      type: 'object',
      group: 'medellin',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] },
        { name: 'subtitle', title: 'Subtítulo', type: 'object', fields: [{ name: 'es', type: 'text', rows: 2, title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'text', rows: 2, title: 'English', validation: (Rule) => Rule.required() }] },
        {
          name: 'blocks', title: 'Bloques de beneficios', type: 'array',
          of: [{
            type: 'object', name: 'block',
            fields: [
              { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] },
              { name: 'text', title: 'Texto', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] },
            ],
            preview: { select: { title: 'title.es' } },
          }],
          validation: (Rule) => Rule.min(2).max(6),
        },
        { name: 'cta', title: 'CTA', type: 'ctaObject' },
      ],
    }),
    defineField({
      name: 'teamSection',
      title: 'Sección Equipo',
      type: 'object',
      group: 'team',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] },
        { name: 'subtitle', title: 'Subtítulo', type: 'object', fields: [{ name: 'es', type: 'text', rows: 2, title: 'Español' }, { name: 'en', type: 'text', rows: 2, title: 'English' }] },
        { name: 'featuredMembers', title: 'Miembros destacados', type: 'array', description: 'Selecciona 2 a 8 miembros del equipo.', of: [{ type: 'reference', to: [{ type: 'teamMember' }] }], validation: (Rule) => Rule.min(2).max(8) },
        { name: 'cta', title: 'CTA', type: 'ctaObject' },
      ],
    }),
    defineField({
      name: 'processSection',
      title: 'Sección Proceso (Cómo funciona)',
      type: 'object',
      group: 'process',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] },
        { name: 'steps', title: 'Pasos del proceso', type: 'array', of: [{ type: 'processStep' }], validation: (Rule) => Rule.required().min(2).max(6) },
        { name: 'cta', title: 'CTA', type: 'ctaObject' },
      ],
    }),
    defineField({
      name: 'ctaBanner',
      title: 'Banner CTA final',
      type: 'object',
      group: 'ctaBanner',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'eyebrow', title: 'Supratítulo', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] },
        { name: 'body', title: 'Cuerpo', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 2, validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'text', rows: 2, validation: (Rule) => Rule.required() }] },
        { name: 'cta', title: 'CTA', type: 'ctaObject', validation: (Rule) => Rule.required() },
        { name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', group: 'seo' }),
  ],
  preview: {
    prepare() {
      return { title: 'Página de inicio', subtitle: 'Home — Allura Healthcare' }
    },
  },
})
