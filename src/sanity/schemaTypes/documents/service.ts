// src/sanity/schemaTypes/documents/service.ts
import { defineType, defineField } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  icon: SparklesIcon,
  groups: [
    { name: 'content', title: '📝 Contenido', default: true },
    { name: 'media', title: '🖼 Media' },
    { name: 'relations', title: '🔗 Relacionados' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'category', title: 'Categoría', type: 'reference', description: 'Categoría principal del servicio. Define en qué sección del menú aparece.', to: [{ type: 'serviceCategory' }], validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'shortDescription', title: 'Descripción corta', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }] }),
    defineField({ name: 'body', title: 'Contenido principal', type: 'localePortableText', group: 'content' }),
    defineField({
      name: 'benefits', title: 'Beneficios del tratamiento', type: 'array', description: 'Lista de beneficios que aparecen destacados en la página del servicio.', group: 'content',
      of: [{
        type: 'object', name: 'benefit',
        fields: [
          { name: 'icon', title: 'Ícono (Lucide)', type: 'string', validation: (Rule) => Rule.required() },
          { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] },
          { name: 'description', title: 'Descripción', type: 'object', fields: [{ name: 'es', type: 'text', rows: 2, title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'text', rows: 2, title: 'English', validation: (Rule) => Rule.required() }] },
        ],
        preview: { select: { title: 'title.es', subtitle: 'icon' } },
      }],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({ name: 'process', title: 'Proceso del tratamiento', type: 'array', description: "Pasos del procedimiento explicados al paciente. Aparecen en la sección '¿Cómo funciona?'.", group: 'content', of: [{ type: 'processStep' }], validation: (Rule) => Rule.max(6) }),
    defineField({
      name: 'ctaBanner', title: 'Banner CTA', type: 'object', group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'body', title: 'Texto', type: 'object', fields: [{ name: 'es', type: 'text', rows: 2, title: 'Español' }, { name: 'en', type: 'text', rows: 2, title: 'English' }] },
        { name: 'cta', title: 'CTA', type: 'ctaObject' },
      ],
    }),
    defineField({ name: 'coverImage', title: 'Imagen de portada', type: 'image', options: { hotspot: true }, group: 'media', fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }),
    defineField({ name: 'gallery', title: 'Galería', type: 'array', description: 'Fotos adicionales del procedimiento. Se muestran en la página del servicio. Máximo 10 imágenes.', group: 'media', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }], validation: (Rule) => Rule.max(12) }),
    defineField({ name: 'faqs', title: 'Preguntas frecuentes', type: 'array', description: 'Preguntas frecuentes asociadas a este servicio específico.', group: 'relations', of: [{ type: 'reference', to: [{ type: 'faq' }] }] }),
    defineField({ name: 'relatedServices', title: 'Servicios relacionados', type: 'array', description: 'Servicios relacionados que se muestran al final de la página. Máximo 3.', group: 'relations', of: [{ type: 'reference', to: [{ type: 'service' }] }], validation: (Rule) => Rule.max(3) }),
    defineField({ name: 'testimonials', title: 'Testimonios', type: 'array', group: 'relations', of: [{ type: 'reference', to: [{ type: 'testimonial' }] }], validation: (Rule) => Rule.max(4) }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', group: 'seo' }),
    defineField({ name: 'publishedAt', title: 'Fecha de publicación', type: 'datetime' }),
    defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', description: 'Desactivar oculta el servicio del sitio sin eliminarlo.', initialValue: true }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'category.title.es', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin título', subtitle: subtitle || '', media }
    },
  },
})
