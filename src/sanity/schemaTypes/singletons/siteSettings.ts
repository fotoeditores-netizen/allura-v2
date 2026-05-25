// src/sanity/schemaTypes/singletons/siteSettings.ts
import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'brand', title: '🎨 Marca e identidad', default: true },
    { name: 'contact', title: '📞 Contacto' },
    { name: 'social', title: '📱 Redes sociales' },
    { name: 'partners', title: '🤝 Socios y certificaciones' },
    { name: 'seo', title: '🔍 SEO global' },
    { name: 'colors', title: '🎨 Colores (solo Admin)' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nombre del sitio',
      type: 'string',
      group: 'brand',
      validation: (Rule) => Rule.required().max(60).error('El nombre del sitio es obligatorio'),
      initialValue: 'Allura Healthcare',
    }),
    defineField({
      name: 'tagline',
      title: 'Eslogan',
      type: 'object',
      group: 'brand',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required().max(100) },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required().max(100) },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo principal',
      type: 'image',
      group: 'brand',
      description: 'Logo sobre fondo oscuro. Preferiblemente PNG o SVG.',
      options: { hotspot: false },
      validation: (Rule) => Rule.required().error('El logo principal es obligatorio'),
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string', initialValue: 'Allura Healthcare', validation: (Rule) => Rule.required() }],
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo variante clara',
      type: 'image',
      group: 'brand',
      description: 'Logo sobre fondo blanco o claro.',
      options: { hotspot: false },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string', initialValue: 'Allura Healthcare' }],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon / Isotipo',
      type: 'image',
      group: 'brand',
      description: 'Icono cuadrado mínimo 32×32px.',
      validation: (Rule) => Rule.required().error('El favicon es obligatorio'),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contacto',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required().email().error('Ingresa un email válido'),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'Número WhatsApp',
      type: 'string',
      group: 'contact',
      description: 'Formato internacional con código de país. Ej: +17862087572',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\+[1-9]\d{7,14}$/, { name: 'phone', invert: false })
          .error('Formato requerido: +17862087572 (con código de país)'),
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'Mensaje default de WhatsApp',
      type: 'object',
      group: 'contact',
      description: 'Texto pre-cargado cuando el paciente hace clic en "Chat por WhatsApp".',
      fields: [
        {
          name: 'es', title: 'Español', type: 'string',
          validation: (Rule) => Rule.required().max(200),
          initialValue: 'Hola, me interesa conocer más sobre los servicios de Allura Healthcare',
        },
        {
          name: 'en', title: 'English', type: 'string',
          validation: (Rule) => Rule.required().max(200),
          initialValue: "Hi, I'm interested in learning more about Allura Healthcare's services",
        },
      ],
    }),
    defineField({
      name: 'responseTime',
      title: 'Tiempo de respuesta',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required().max(50), initialValue: 'Menos de 24 horas' },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required().max(50), initialValue: 'Less than 24 hours' },
      ],
    }),
    defineField({
      name: 'address',
      title: 'Dirección física',
      type: 'string',
      group: 'contact',
      initialValue: 'Medellín, Antioquia, Colombia',
    }),
    defineField({
      name: 'socialInstagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
      validation: (Rule) => Rule.uri({ allowRelative: false }).warning('Asegúrate que sea una URL válida'),
    }),
    defineField({ name: 'socialFacebook', title: 'Facebook URL', type: 'url', group: 'social' }),
    defineField({ name: 'socialLinkedin', title: 'LinkedIn URL', type: 'url', group: 'social' }),
    defineField({ name: 'socialYoutube', title: 'YouTube URL', type: 'url', group: 'social' }),
    defineField({ name: 'socialTiktok', title: 'TikTok URL', type: 'url', group: 'social' }),
    defineField({
      name: 'partners',
      title: 'Logos de socios',
      type: 'array',
      group: 'partners',
      description: 'Logos que aparecen en el footer del sitio.',
      of: [{
        type: 'object',
        name: 'partner',
        fields: [
          { name: 'name', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required() },
          { name: 'logo', title: 'Logo', type: 'image', validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Texto alt', type: 'string', validation: (Rule) => Rule.required() }] },
          { name: 'url', title: 'URL del socio', type: 'url' },
        ],
        preview: { select: { title: 'name', media: 'logo' } },
      }],
    }),
    defineField({
      name: 'certifications',
      title: 'Certificaciones y acreditaciones',
      type: 'array',
      group: 'partners',
      of: [{
        type: 'object',
        name: 'certification',
        fields: [
          { name: 'name', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required() },
          { name: 'logo', title: 'Logo', type: 'image', validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Texto alt', type: 'string', validation: (Rule) => Rule.required() }] },
          { name: 'url', title: 'URL', type: 'url' },
        ],
        preview: { select: { title: 'name', media: 'logo' } },
      }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO global (fallback)',
      type: 'seoObject',
      group: 'seo',
      description: 'Estos valores se usan cuando una página no tiene su propio SEO configurado.',
    }),
    defineField({
      name: 'brandColors',
      title: '⚠️ Colores de marca (solo Admin)',
      type: 'object',
      group: 'colors',
      description: 'PRECAUCIÓN: Cambiar estos colores afecta el diseño de TODO el sitio. Solo para administradores técnicos.',
      fields: [
        { name: 'primary', title: 'Color primario (Navy)', type: 'string', description: 'Formato hex: #051c33', initialValue: '#051c33', validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Formato hex requerido: #051c33') },
        { name: 'secondary', title: 'Color secundario (Blue)', type: 'string', description: 'Formato hex: #8b9fb3', initialValue: '#8b9fb3', validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Formato hex requerido') },
        { name: 'accent', title: 'Color acento (Silver)', type: 'string', description: 'Formato hex: #abacae', initialValue: '#abacae', validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Formato hex requerido') },
        { name: 'light', title: 'Color claro (Background)', type: 'string', description: 'Formato hex: #eaeeef', initialValue: '#eaeeef', validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex' }).error('Formato hex requerido') },
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName', media: 'logo' },
    prepare({ title, media }) {
      return { title: title || 'Configuración del sitio', subtitle: 'Configuración global', media }
    },
  },
})
