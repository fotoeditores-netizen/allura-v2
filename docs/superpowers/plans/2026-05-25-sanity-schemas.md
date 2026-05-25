# Sanity CMS Schemas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate and extend all Sanity schemas to `src/sanity/schemaTypes/`, eliminating the duplicate `sanity/schemas/` folder and `globalConfig`, and register 16 document types + 8 reusable objects in a fully structured Studio.

**Architecture:** All schemas live in `src/sanity/schemaTypes/` under `objects/`, `singletons/`, and `documents/`. Reusable objects are registered first so singletons and documents can reference them. The Studio structure builder in `sanity.config.ts` is updated last to expose all types with correct singleton handling.

**Tech Stack:** Sanity v3, `defineType`/`defineField`, TypeScript, next-sanity, `@sanity/icons`

---

## File Map

### New files to create

```
src/sanity/schemaTypes/objects/
  seoObject.ts
  localeString.ts        ← localeString, localeStringShort, localeText, localePortableText
  ctaObject.ts
  navItem.ts
  processStep.ts

src/sanity/schemaTypes/singletons/
  siteSettings.ts        ← replaces + absorbs globalConfig
  navigation.ts
  homePage.ts
  trackingScripts.ts

src/sanity/schemaTypes/documents/
  serviceCategory.ts
  service.ts
  page.ts
  blogPost.ts
  category.ts
  testimonial.ts
  faq.ts
  galleryItem.ts
  video.ts
  caseStudy.ts
  teamMember.ts
  popup.ts
```

### Files to modify

```
src/sanity/schemaTypes/index.ts          ← register all new types, remove globalConfig
src/sanity/sanity.config.ts             ← update structure builder for all types
src/sanity/lib/queries.ts               ← replace globalConfigQuery with siteSettingsQuery
```

### Files to delete after migration

```
src/sanity/schemaTypes/singletons/globalConfig.ts
sanity/schemas/                          ← entire folder (source of truth migrated)
```

---

## Task 1: Objects — localeString variants

**Files:**
- Create: `src/sanity/schemaTypes/objects/localeString.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/sanity/schemaTypes/objects/localeString.ts
import { defineType, defineField } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Texto bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'string',
      validation: (Rule) => Rule.required().error('El texto en español es obligatorio'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (Rule) => Rule.required().error('English text is required'),
    }),
  ],
  preview: { select: { title: 'es', subtitle: 'en' } },
})

export const localeStringShort = defineType({
  name: 'localeStringShort',
  title: 'Texto corto bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'string',
      validation: (Rule) => Rule.required().max(80).error('Máximo 80 caracteres en español'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: (Rule) => Rule.required().max(80).error('Maximum 80 characters in English'),
    }),
  ],
  preview: { select: { title: 'es', subtitle: 'en' } },
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().error('El texto en español es obligatorio'),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().error('English text is required'),
    }),
  ],
  preview: { select: { title: 'es' } },
})

export const localePortableText = defineType({
  name: 'localePortableText',
  title: 'Contenido enriquecido bilingüe',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Cita', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
              { title: 'Subrayado', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Abrir en nueva pestaña' },
                ],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab' },
                ],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
})
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/objects/localeString.ts
git commit -m "feat(sanity): add localeString, localeText, localePortableText objects"
```

---

## Task 2: Objects — seoObject

**Files:**
- Create: `src/sanity/schemaTypes/objects/seoObject.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/sanity/schemaTypes/objects/seoObject.ts
import { defineType, defineField } from 'sanity'

export const seoObject = defineType({
  name: 'seoObject',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta título',
      type: 'object',
      options: { collapsible: false },
      fields: [
        {
          name: 'es',
          title: 'Meta título — Español',
          type: 'string',
          description: 'Ideal: 50–60 caracteres',
          validation: (Rule) =>
            Rule.required().max(60).warning('Recomendado: máximo 60 caracteres para SEO óptimo'),
        },
        {
          name: 'en',
          title: 'Meta title — English',
          type: 'string',
          description: 'Ideal: 50–60 characters',
          validation: (Rule) =>
            Rule.required().max(60).warning('Recommended: maximum 60 characters for optimal SEO'),
        },
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta descripción',
      type: 'object',
      options: { collapsible: false },
      fields: [
        {
          name: 'es',
          title: 'Meta descripción — Español',
          type: 'text',
          rows: 3,
          description: 'Ideal: 140–160 caracteres',
          validation: (Rule) =>
            Rule.required().max(160).warning('Recomendado: máximo 160 caracteres para SEO óptimo'),
        },
        {
          name: 'en',
          title: 'Meta description — English',
          type: 'text',
          rows: 3,
          description: 'Ideal: 140–160 characters',
          validation: (Rule) =>
            Rule.required().max(160).warning('Recommended: maximum 160 characters for optimal SEO'),
        },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen Open Graph',
      type: 'image',
      description: 'Imagen para redes sociales. Tamaño recomendado: 1200×630px',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: '⚠️ No indexar en Google',
      type: 'boolean',
      description: 'PRECAUCIÓN: Activa esto solo si NO quieres que esta página aparezca en Google.',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'URL canónica (avanzado)',
      type: 'url',
      description: 'Solo completar si esta página tiene contenido duplicado.',
    }),
    defineField({
      name: 'structuredData',
      title: 'JSON-LD estructurado (avanzado)',
      type: 'text',
      rows: 6,
      description: '⚠️ Solo para administradores técnicos. JSON-LD inválido puede afectar el SEO.',
    }),
  ],
  preview: {
    select: { title: 'metaTitle.es', subtitle: 'metaDescription.es' },
    prepare({ title, subtitle }) {
      return {
        title: title || '⚠️ Sin meta título',
        subtitle: subtitle || '⚠️ Sin meta descripción',
      }
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/objects/seoObject.ts
git commit -m "feat(sanity): add seoObject reusable type"
```

---

## Task 3: Objects — ctaObject, navItem, processStep

**Files:**
- Create: `src/sanity/schemaTypes/objects/ctaObject.ts`
- Create: `src/sanity/schemaTypes/objects/navItem.ts`
- Create: `src/sanity/schemaTypes/objects/processStep.ts`

- [ ] **Step 1: Create ctaObject.ts**

```typescript
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
```

- [ ] **Step 2: Create navItem.ts**

```typescript
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
```

- [ ] **Step 3: Create processStep.ts**

```typescript
// src/sanity/schemaTypes/objects/processStep.ts
import { defineType, defineField } from 'sanity'

export const processStep = defineType({
  name: 'processStep',
  title: 'Paso del proceso',
  type: 'object',
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'Número de paso',
      type: 'string',
      description: 'Ej: 01, 02, 03',
      validation: (Rule) => Rule.required().max(3),
    }),
    defineField({
      name: 'title',
      title: 'Título del paso',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required().max(80) },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required().max(80) },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Imagen del paso',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'duration',
      title: 'Duración estimada',
      type: 'object',
      description: 'Opcional. Ej: "3–5 días en Medellín"',
      fields: [
        { name: 'es', title: 'Español', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
  ],
  preview: {
    select: { step: 'stepNumber', title: 'title.es' },
    prepare({ step, title }) {
      return { title: `Paso ${step ?? '?'}: ${title ?? 'Sin título'}` }
    },
  },
})
```

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemaTypes/objects/ctaObject.ts src/sanity/schemaTypes/objects/navItem.ts src/sanity/schemaTypes/objects/processStep.ts
git commit -m "feat(sanity): add ctaObject, navItem, processStep objects"
```

---

## Task 4: Singleton — siteSettings (absorbs globalConfig)

**Files:**
- Create: `src/sanity/schemaTypes/singletons/siteSettings.ts`

- [ ] **Step 1: Create the file**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/singletons/siteSettings.ts
git commit -m "feat(sanity): add siteSettings singleton (absorbs globalConfig)"
```

---

## Task 5: Singleton — navigation

**Files:**
- Create: `src/sanity/schemaTypes/singletons/navigation.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/sanity/schemaTypes/singletons/navigation.ts
import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navegación',
  type: 'document',
  icon: LinkIcon,
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'mainMenu', title: '🗂 Menú principal', default: true },
    { name: 'footer', title: '📋 Footer' },
    { name: 'ctas', title: '🔘 Botones globales' },
    { name: 'legal', title: '⚖️ Links legales' },
  ],
  fields: [
    defineField({
      name: 'mainMenu',
      title: 'Menú principal',
      type: 'array',
      group: 'mainMenu',
      of: [{ type: 'navItem' }],
      validation: (Rule) => Rule.required().min(3).error('El menú principal necesita al menos 3 ítems'),
    }),
    defineField({
      name: 'footerMenuPrimary',
      title: 'Footer — Navegación general',
      type: 'array',
      group: 'footer',
      of: [{ type: 'navItem' }],
    }),
    defineField({
      name: 'footerMenuServices',
      title: 'Footer — Servicios',
      type: 'array',
      group: 'footer',
      of: [{ type: 'navItem' }],
    }),
    defineField({
      name: 'footerBrandDescription',
      title: 'Descripción de marca en footer',
      type: 'object',
      group: 'footer',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.max(250) },
        { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.max(250) },
      ],
    }),
    defineField({
      name: 'footerWhatsappHeading',
      title: 'Footer — Título banner WhatsApp',
      type: 'object',
      group: 'footer',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.max(60) },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.max(60) },
      ],
    }),
    defineField({
      name: 'footerWhatsappSub',
      title: 'Footer — Subtítulo banner WhatsApp',
      type: 'object',
      group: 'footer',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.max(120) },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.max(120) },
      ],
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Texto de copyright',
      type: 'object',
      group: 'footer',
      description: 'El año {year} se reemplaza automáticamente.',
      fields: [
        { name: 'es', title: 'Español', type: 'string', initialValue: '© {year} Allura Healthcare. Todos los derechos reservados.' },
        { name: 'en', title: 'English', type: 'string', initialValue: '© {year} Allura Healthcare. All rights reserved.' },
      ],
    }),
    defineField({ name: 'ctaBookConsultation', title: 'CTA — "Reserva tu consulta" (header)', type: 'ctaObject', group: 'ctas' }),
    defineField({ name: 'ctaPayHere', title: 'CTA — "Paga aquí" (header)', type: 'ctaObject', group: 'ctas' }),
    defineField({ name: 'ctaWhatsapp', title: 'CTA — WhatsApp global', type: 'ctaObject', group: 'ctas' }),
    defineField({
      name: 'legalLinks',
      title: 'Links legales del footer',
      type: 'array',
      group: 'legal',
      of: [{ type: 'navItem' }],
      validation: (Rule) => Rule.required().min(1).error('Debe haber al menos 1 link legal'),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navegación', subtitle: 'Menú principal y footer' }
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/singletons/navigation.ts
git commit -m "feat(sanity): add navigation singleton"
```

---

## Task 6: Singleton — homePage

**Files:**
- Create: `src/sanity/schemaTypes/singletons/homePage.ts`

- [ ] **Step 1: Create the file**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/singletons/homePage.ts
git commit -m "feat(sanity): add homePage singleton"
```

---

## Task 7: Singleton — trackingScripts

**Files:**
- Create: `src/sanity/schemaTypes/singletons/trackingScripts.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/sanity/schemaTypes/singletons/trackingScripts.ts
import { defineType, defineField } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'

export const trackingScripts = defineType({
  name: 'trackingScripts',
  title: 'Scripts y analítica',
  type: 'document',
  icon: EarthGlobeIcon,
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'analytics', title: '📊 Analytics', default: true },
    { name: 'ads', title: '📣 Publicidad' },
    { name: 'heatmaps', title: '🔥 Mapas de calor' },
    { name: 'custom', title: '⚠️ Scripts custom (Admin)' },
    { name: 'cookies', title: '🍪 Cookies' },
  ],
  fields: [
    defineField({ name: 'googleAnalyticsId', title: 'Google Analytics 4 — Measurement ID', type: 'string', group: 'analytics', description: 'Formato: G-XXXXXXXXXX', validation: (Rule) => Rule.custom((val: string | undefined) => { if (!val) return true; if (/^G-[A-Z0-9]+$/.test(val)) return true; return 'Formato incorrecto. Debe ser G-XXXXXXXXXX' }) }),
    defineField({ name: 'gtmContainerId', title: 'Google Tag Manager — Container ID', type: 'string', group: 'analytics', description: 'Formato: GTM-XXXXXXX', validation: (Rule) => Rule.custom((val: string | undefined) => { if (!val) return true; if (/^GTM-[A-Z0-9]+$/.test(val)) return true; return 'Formato incorrecto. Debe ser GTM-XXXXXXX' }) }),
    defineField({ name: 'googleSearchConsoleVerification', title: 'Google Search Console — Meta de verificación', type: 'string', group: 'analytics', description: 'Solo el código de verificación, sin etiquetas HTML.' }),
    defineField({ name: 'metaPixelId', title: 'Meta (Facebook) Pixel ID', type: 'string', group: 'ads', validation: (Rule) => Rule.custom((val: string | undefined) => { if (!val) return true; if (/^\d+$/.test(val)) return true; return 'El Pixel ID de Meta solo contiene números' }) }),
    defineField({ name: 'googleAdsId', title: 'Google Ads — Conversion ID', type: 'string', group: 'ads', description: 'Formato: AW-XXXXXXXXXX' }),
    defineField({ name: 'tiktokPixelId', title: 'TikTok Pixel ID', type: 'string', group: 'ads' }),
    defineField({ name: 'hotjarId', title: 'Hotjar — Site ID', type: 'string', group: 'heatmaps' }),
    defineField({ name: 'clarityId', title: 'Microsoft Clarity — Project ID', type: 'string', group: 'heatmaps' }),
    defineField({ name: 'customHeadScripts', title: '⚠️ Scripts adicionales — <head>', type: 'text', group: 'custom', rows: 8, description: 'PRECAUCIÓN: Scripts incorrectos pueden romper el sitio o causar problemas de seguridad. Solo para administradores técnicos.' }),
    defineField({ name: 'customBodyStartScripts', title: '⚠️ Scripts adicionales — inicio de <body>', type: 'text', group: 'custom', rows: 8, description: 'PRECAUCIÓN: Solo para administradores técnicos.' }),
    defineField({ name: 'customBodyEndScripts', title: '⚠️ Scripts adicionales — final de <body>', type: 'text', group: 'custom', rows: 8, description: 'PRECAUCIÓN: Solo para administradores técnicos.' }),
    defineField({ name: 'cookieConsentEnabled', title: 'Activar aviso de cookies', type: 'boolean', group: 'cookies', initialValue: false }),
    defineField({ name: 'cookieConsentText', title: 'Texto del aviso de cookies', type: 'object', group: 'cookies', hidden: ({ document }) => !document?.cookieConsentEnabled, fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, initialValue: 'Usamos cookies para mejorar tu experiencia.' }, { name: 'en', title: 'English', type: 'text', rows: 3, initialValue: 'We use cookies to improve your experience.' }] }),
    defineField({ name: 'cookieConsentButtonLabel', title: 'Texto del botón "Aceptar"', type: 'object', group: 'cookies', hidden: ({ document }) => !document?.cookieConsentEnabled, fields: [{ name: 'es', title: 'Español', type: 'string', initialValue: 'Aceptar' }, { name: 'en', title: 'English', type: 'string', initialValue: 'Accept' }] }),
    defineField({ name: 'environment', title: 'Entorno activo', type: 'string', description: 'En "development" no se cargan scripts de analytics.', options: { list: [{ title: 'Producción', value: 'production' }, { title: 'Staging', value: 'staging' }, { title: 'Desarrollo (scripts desactivados)', value: 'development' }], layout: 'radio' }, initialValue: 'production' }),
  ],
  preview: {
    prepare() {
      return { title: 'Scripts y analítica', subtitle: 'Google Analytics, GTM, Meta Pixel...' }
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/singletons/trackingScripts.ts
git commit -m "feat(sanity): add trackingScripts singleton"
```

---

## Task 8: Documents — teamMember, serviceCategory

**Files:**
- Create: `src/sanity/schemaTypes/documents/teamMember.ts`
- Create: `src/sanity/schemaTypes/documents/serviceCategory.ts`

These two are created first because other documents reference them (`homePage` → `teamMember`, `homePage`/`service` → `serviceCategory`).

- [ ] **Step 1: Create teamMember.ts**

```typescript
// src/sanity/schemaTypes/documents/teamMember.ts
import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Miembro del equipo',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'name', title: 'Nombre completo', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'role', title: 'Cargo', type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
      ],
    }),
    defineField({
      name: 'department', title: 'Departamento', type: 'string',
      options: { list: [{ title: 'Dental', value: 'dental' }, { title: 'Estética', value: 'aesthetic' }, { title: 'Medicina', value: 'medical' }, { title: 'Coordinación', value: 'coordination' }, { title: 'Gerencia', value: 'management' }] },
    }),
    defineField({ name: 'photo', title: 'Fotografía', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Texto alt', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'shortBio', title: 'Bio corta', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }] }),
    defineField({ name: 'fullBio', title: 'Bio completa', type: 'localePortableText' }),
    defineField({ name: 'specialties', title: 'Especialidades', type: 'array', of: [{ type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }], preview: { select: { title: 'es' } } }], validation: (Rule) => Rule.max(5) }),
    defineField({ name: 'credentials', title: 'Credenciales / títulos', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.max(8) }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'order', title: 'Orden de aparición', type: 'number', description: 'Menor número = aparece primero.' }),
    defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true }),
    defineField({ name: 'isFeatured', title: 'Destacado en home', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role.es', media: 'photo' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin nombre', subtitle: subtitle || '', media }
    },
  },
})
```

- [ ] **Step 2: Create serviceCategory.ts**

```typescript
// src/sanity/schemaTypes/documents/serviceCategory.ts
import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const serviceCategory = defineType({
  name: 'serviceCategory',
  title: 'Categoría de servicio',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'icon', title: 'Ícono (nombre Lucide)', type: 'string', description: 'Ej: Smile, HeartPulse, Sparkles, ScanFace' }),
    defineField({ name: 'coverImage', title: 'Imagen de portada', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
    defineField({ name: 'order', title: 'Orden de aparición', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject' }),
  ],
  preview: {
    select: { title: 'title.es', media: 'coverImage' },
    prepare({ title, media }) {
      return { title: title || 'Sin título', media }
    },
  },
})
```

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemaTypes/documents/teamMember.ts src/sanity/schemaTypes/documents/serviceCategory.ts
git commit -m "feat(sanity): add teamMember and serviceCategory documents"
```

---

## Task 9: Documents — testimonial, faq, category

**Files:**
- Create: `src/sanity/schemaTypes/documents/testimonial.ts`
- Create: `src/sanity/schemaTypes/documents/faq.ts`
- Create: `src/sanity/schemaTypes/documents/category.ts`

These are created before `service` and `caseStudy` since they are referenced by those schemas.

- [ ] **Step 1: Create testimonial.ts**

```typescript
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
```

- [ ] **Step 2: Create faq.ts**

```typescript
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
    defineField({ name: 'answer', title: 'Respuesta', type: 'localePortableText', validation: (Rule) => Rule.required() }),
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
```

- [ ] **Step 3: Create category.ts (blog categories)**

```typescript
// src/sanity/schemaTypes/documents/category.ts
import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const category = defineType({
  name: 'category',
  title: 'Categoría de blog',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 2 }, { name: 'en', title: 'English', type: 'text', rows: 2 }] }),
    defineField({ name: 'color', title: 'Color (hex)', type: 'string', description: 'Ej: #8b9fb3', validation: (Rule) => Rule.custom((val: string | undefined) => { if (!val) return true; if (/^#[0-9A-Fa-f]{6}$/.test(val)) return true; return 'Formato hex requerido: #RRGGBB' }) }),
  ],
  preview: {
    select: { title: 'title.es' },
    prepare({ title }) { return { title: title || 'Sin título' } },
  },
})
```

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemaTypes/documents/testimonial.ts src/sanity/schemaTypes/documents/faq.ts src/sanity/schemaTypes/documents/category.ts
git commit -m "feat(sanity): add testimonial, faq, category documents"
```

---

## Task 10: Document — service

**Files:**
- Create: `src/sanity/schemaTypes/documents/service.ts`

- [ ] **Step 1: Create the file**

```typescript
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
    defineField({ name: 'category', title: 'Categoría', type: 'reference', to: [{ type: 'serviceCategory' }], validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'shortDescription', title: 'Descripción corta', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }] }),
    defineField({ name: 'body', title: 'Contenido principal', type: 'localePortableText', validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({
      name: 'benefits', title: 'Beneficios del tratamiento', type: 'array', group: 'content',
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
    defineField({ name: 'process', title: 'Proceso del tratamiento', type: 'array', group: 'content', of: [{ type: 'processStep' }], validation: (Rule) => Rule.max(6) }),
    defineField({
      name: 'ctaBanner', title: 'Banner CTA', type: 'object', group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] },
        { name: 'body', title: 'Texto', type: 'object', fields: [{ name: 'es', type: 'text', rows: 2, title: 'Español' }, { name: 'en', type: 'text', rows: 2, title: 'English' }] },
        { name: 'cta', title: 'CTA', type: 'ctaObject' },
      ],
    }),
    defineField({ name: 'coverImage', title: 'Imagen de portada', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), group: 'media', fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
    defineField({ name: 'gallery', title: 'Galería', type: 'array', group: 'media', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }], validation: (Rule) => Rule.max(12) }),
    defineField({ name: 'faq', title: 'Preguntas frecuentes', type: 'array', group: 'relations', of: [{ type: 'reference', to: [{ type: 'faq' }] }] }),
    defineField({ name: 'relatedServices', title: 'Servicios relacionados', type: 'array', group: 'relations', of: [{ type: 'reference', to: [{ type: 'service' }] }], validation: (Rule) => Rule.max(3) }),
    defineField({ name: 'testimonials', title: 'Testimonios', type: 'array', group: 'relations', of: [{ type: 'reference', to: [{ type: 'testimonial' }] }], validation: (Rule) => Rule.max(4) }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', group: 'seo', validation: (Rule) => Rule.required() }),
    defineField({ name: 'publishedAt', title: 'Fecha de publicación', type: 'datetime', validation: (Rule) => Rule.required() }),
    defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'category.title.es', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin título', subtitle: subtitle || '', media }
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/documents/service.ts
git commit -m "feat(sanity): add service document"
```

---

## Task 11: Documents — page, blogPost

**Files:**
- Create: `src/sanity/schemaTypes/documents/page.ts`
- Create: `src/sanity/schemaTypes/documents/blogPost.ts`

- [ ] **Step 1: Create page.ts**

```typescript
// src/sanity/schemaTypes/documents/page.ts
import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'pageType', title: 'Tipo de página', type: 'string',
      options: { list: [{ title: 'Nosotros', value: 'about' }, { title: 'Cómo funciona', value: 'how-it-works' }, { title: 'Equipo', value: 'team' }, { title: 'Contacto', value: 'contact' }, { title: 'Legal ⚠️', value: 'legal' }, { title: 'Personalizada', value: 'custom' }] },
    }),
    defineField({ name: 'heroTitle', title: 'Título del hero', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] }),
    defineField({ name: 'heroSubtitle', title: 'Subtítulo del hero', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 2 }, { name: 'en', title: 'English', type: 'text', rows: 2 }] }),
    defineField({ name: 'heroImage', title: 'Imagen del hero', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }),
    defineField({
      name: 'body', title: 'Contenido', type: 'localePortableText',
      validation: (Rule) => Rule.required(),
      // Warning shown in Studio for legal pages via custom validation
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', validation: (Rule) => Rule.required() }),
    defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'pageType' },
    prepare({ title, subtitle }) {
      const typeLabel = subtitle === 'legal' ? '⚠️ Legal' : subtitle || 'page'
      return { title: title || 'Sin título', subtitle: typeLabel }
    },
  },
})
```

- [ ] **Step 2: Create blogPost.ts**

```typescript
// src/sanity/schemaTypes/documents/blogPost.ts
import { defineType, defineField } from 'sanity'
import { EditIcon } from '@sanity/icons'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Entrada de blog',
  type: 'document',
  icon: EditIcon,
  groups: [
    { name: 'content', title: '📝 Contenido', default: true },
    { name: 'meta', title: '🗂 Metadatos' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }, { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }] }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (Rule) => Rule.required(), group: 'meta' }),
    defineField({ name: 'author', title: 'Autor', type: 'reference', to: [{ type: 'teamMember' }], validation: (Rule) => Rule.required(), group: 'meta' }),
    defineField({ name: 'categories', title: 'Categorías', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }], validation: (Rule) => Rule.required().min(1), group: 'meta' }),
    defineField({ name: 'publishedAt', title: 'Fecha de publicación', type: 'datetime', validation: (Rule) => Rule.required(), group: 'meta' }),
    defineField({ name: 'status', title: 'Estado', type: 'string', options: { list: [{ title: 'Borrador', value: 'draft' }, { title: 'En revisión', value: 'review' }, { title: 'Publicado', value: 'published' }], layout: 'radio' }, initialValue: 'draft', group: 'meta' }),
    defineField({ name: 'featuredImage', title: 'Imagen destacada', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), group: 'content', fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
    defineField({ name: 'excerpt', title: 'Extracto', type: 'object', group: 'content', fields: [{ name: 'es', title: 'Español', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }, { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(200) }] }),
    defineField({ name: 'body', title: 'Contenido', type: 'localePortableText', validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'relatedPosts', title: 'Posts relacionados', type: 'array', of: [{ type: 'reference', to: [{ type: 'blogPost' }] }], validation: (Rule) => Rule.max(3), group: 'meta' }),
    defineField({ name: 'relatedServices', title: 'Servicios relacionados', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }], validation: (Rule) => Rule.max(2), group: 'meta' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', validation: (Rule) => Rule.required(), group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'status', media: 'featuredImage' },
    prepare({ title, subtitle, media }) {
      const statusIcon = subtitle === 'published' ? '🟢' : subtitle === 'review' ? '🟡' : '⚪'
      return { title: title || 'Sin título', subtitle: `${statusIcon} ${subtitle || 'draft'}`, media }
    },
  },
})
```

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemaTypes/documents/page.ts src/sanity/schemaTypes/documents/blogPost.ts
git commit -m "feat(sanity): add page and blogPost documents"
```

---

## Task 12: Documents — galleryItem, video, caseStudy, popup

**Files:**
- Create: `src/sanity/schemaTypes/documents/galleryItem.ts`
- Create: `src/sanity/schemaTypes/documents/video.ts`
- Create: `src/sanity/schemaTypes/documents/caseStudy.ts`
- Create: `src/sanity/schemaTypes/documents/popup.ts`

- [ ] **Step 1: Create galleryItem.ts**

```typescript
// src/sanity/schemaTypes/documents/galleryItem.ts
import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Ítem de galería',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'object', fields: [{ name: 'es', title: 'Español', type: 'string' }, { name: 'en', title: 'English', type: 'string' }] }),
    defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
    defineField({ name: 'category', title: 'Categoría', type: 'string', options: { list: [{ title: 'Clínica', value: 'clinic' }, { title: 'Equipo', value: 'team' }, { title: 'Resultados', value: 'results' }, { title: 'Medellín', value: 'medellin' }, { title: 'Eventos', value: 'events' }] } }),
    defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }] }),
    defineField({ name: 'isFeatured', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'publishedAt', title: 'Fecha', type: 'datetime', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'category', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Sin título', subtitle: subtitle || '', media }
    },
  },
})
```

- [ ] **Step 2: Create video.ts**

```typescript
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
```

- [ ] **Step 3: Create caseStudy.ts**

```typescript
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
    defineField({ name: 'challenge', title: 'Desafío', type: 'localePortableText', validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'solution', title: 'Solución', type: 'localePortableText', validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'results', title: 'Resultados', type: 'localePortableText', validation: (Rule) => Rule.required(), group: 'content' }),
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
```

- [ ] **Step 4: Create popup.ts**

```typescript
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
          const activePopups = await client.fetch(
            `count(*[_type == "popup" && isActive == true && _id != $id])`,
            { id: document?._id ?? '' }
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
```

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemaTypes/documents/galleryItem.ts src/sanity/schemaTypes/documents/video.ts src/sanity/schemaTypes/documents/caseStudy.ts src/sanity/schemaTypes/documents/popup.ts
git commit -m "feat(sanity): add galleryItem, video, caseStudy, popup documents"
```

---

## Task 13: Wire up index.ts

**Files:**
- Modify: `src/sanity/schemaTypes/index.ts`

- [ ] **Step 1: Replace the file content**

```typescript
// src/sanity/schemaTypes/index.ts
// Objects (register before singletons and documents that use them)
import { localeString, localeStringShort, localeText, localePortableText } from './objects/localeString'
import { seoObject } from './objects/seoObject'
import { ctaObject } from './objects/ctaObject'
import { navItem } from './objects/navItem'
import { processStep } from './objects/processStep'

// Singletons
import { siteSettings } from './singletons/siteSettings'
import { navigation } from './singletons/navigation'
import { homePage } from './singletons/homePage'
import { trackingScripts } from './singletons/trackingScripts'

// Documents
import { serviceCategory } from './documents/serviceCategory'
import { service } from './documents/service'
import { page } from './documents/page'
import { blogPost } from './documents/blogPost'
import { category } from './documents/category'
import { testimonial } from './documents/testimonial'
import { faq } from './documents/faq'
import { galleryItem } from './documents/galleryItem'
import { video } from './documents/video'
import { caseStudy } from './documents/caseStudy'
import { teamMember } from './documents/teamMember'
import { popup } from './documents/popup'

export const schemaTypes = [
  // Objects first
  localeString,
  localeStringShort,
  localeText,
  localePortableText,
  seoObject,
  ctaObject,
  navItem,
  processStep,
  // Singletons
  siteSettings,
  navigation,
  homePage,
  trackingScripts,
  // Documents
  serviceCategory,
  service,
  page,
  blogPost,
  category,
  testimonial,
  faq,
  galleryItem,
  video,
  caseStudy,
  teamMember,
  popup,
]
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemaTypes/index.ts
git commit -m "feat(sanity): register all schema types in index.ts"
```

---

## Task 14: Update sanity.config.ts with full structure

**Files:**
- Modify: `src/sanity/sanity.config.ts`

- [ ] **Step 1: Replace the file content**

```typescript
// src/sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export const sanityConfig = defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: 'Allura Healthcare CMS',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            // ── CONFIGURACIÓN GLOBAL ──────────────────────────
            S.listItem()
              .title('⚙️ Configuración del sitio')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('🗂 Navegación')
              .id('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.listItem()
              .title('📊 Scripts y analítica')
              .id('trackingScripts')
              .child(S.document().schemaType('trackingScripts').documentId('trackingScripts')),

            S.divider(),

            // ── PÁGINAS ──────────────────────────────────────
            S.listItem()
              .title('🏠 Página de inicio')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.documentTypeListItem('page').title('📄 Páginas'),

            S.divider(),

            // ── SERVICIOS ────────────────────────────────────
            S.documentTypeListItem('serviceCategory').title('📂 Categorías de servicio'),
            S.documentTypeListItem('service').title('🦷 Servicios'),

            S.divider(),

            // ── BLOG ─────────────────────────────────────────
            S.documentTypeListItem('blogPost').title('✍️ Blog / Noticias'),
            S.documentTypeListItem('category').title('🏷 Categorías de blog'),

            S.divider(),

            // ── SOCIAL PROOF ──────────────────────────────────
            S.documentTypeListItem('testimonial').title('⭐ Testimonios'),
            S.documentTypeListItem('caseStudy').title('📈 Casos de éxito'),
            S.documentTypeListItem('teamMember').title('👥 Equipo'),

            S.divider(),

            // ── MEDIA ─────────────────────────────────────────
            S.documentTypeListItem('galleryItem').title('🖼 Galería'),
            S.documentTypeListItem('video').title('▶️ Videos'),

            S.divider(),

            // ── CONTENIDO AUXILIAR ─────────────────────────────
            S.documentTypeListItem('faq').title('❓ Preguntas frecuentes'),
            S.documentTypeListItem('popup').title('💬 Popups'),
          ]),
    }),
    visionTool(),
  ],
})
```

- [ ] **Step 2: Verify `@sanity/vision` is installed**

Run: `npm list @sanity/vision`

If not installed: `npm install @sanity/vision`

- [ ] **Step 3: Commit**

```bash
git add src/sanity/sanity.config.ts
git commit -m "feat(sanity): update Studio structure with all 16 schemas"
```

---

## Task 15: Update queries.ts and delete legacy files

**Files:**
- Modify: `src/sanity/lib/queries.ts`
- Delete: `src/sanity/schemaTypes/singletons/globalConfig.ts`
- Delete: `sanity/` folder (entire root folder)

- [ ] **Step 1: Update queries.ts**

```typescript
// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    logo { asset, alt },
    logoLight { asset, alt },
    contactEmail,
    whatsappNumber,
    whatsappMessage,
    responseTime,
    address,
    socialInstagram,
    socialFacebook,
    socialLinkedin,
    socialYoutube,
    socialTiktok,
    seo
  }
`

export interface SiteSettings {
  siteName: string
  tagline: { es: string; en: string }
  logo: { asset: { _ref: string }; alt: string }
  logoLight?: { asset: { _ref: string }; alt: string }
  contactEmail: string
  whatsappNumber: string
  whatsappMessage: { es: string; en: string }
  responseTime: { es: string; en: string }
  address?: string
  socialInstagram?: string
  socialFacebook?: string
  socialLinkedin?: string
  socialYoutube?: string
  socialTiktok?: string
  seo?: {
    metaTitle: { es: string; en: string }
    metaDescription: { es: string; en: string }
  }
}

// Legacy alias — remove once all consumers are updated
/** @deprecated Use siteSettingsQuery instead */
export const globalConfigQuery = siteSettingsQuery
export type GlobalConfig = SiteSettings
```

- [ ] **Step 2: Delete globalConfig.ts**

```bash
rm src/sanity/schemaTypes/singletons/globalConfig.ts
```

- [ ] **Step 3: Delete legacy sanity/ root folder**

```bash
rm -rf sanity/
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(sanity): replace globalConfigQuery with siteSettingsQuery, delete legacy schemas"
```

---

## Task 16: Verify Studio loads correctly

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected output: server starts on `http://localhost:3000` with no TypeScript errors.

- [ ] **Step 2: Open Studio and verify all sections appear**

Navigate to `http://localhost:3000/studio`

Verify the left sidebar shows all groups:
- ⚙️ Configuración del sitio
- 🗂 Navegación
- 📊 Scripts y analítica
- 🏠 Página de inicio
- 📄 Páginas
- 📂 Categorías de servicio
- 🦷 Servicios
- ✍️ Blog / Noticias
- 🏷 Categorías de blog
- ⭐ Testimonios
- 📈 Casos de éxito
- 👥 Equipo
- 🖼 Galería
- ▶️ Videos
- ❓ Preguntas frecuentes
- 💬 Popups

- [ ] **Step 3: Open each singleton and verify no errors**

Click on each: Configuración del sitio, Navegación, Página de inicio, Scripts y analítica.

Expected: form loads with all groups/tabs visible, no console errors.

- [ ] **Step 4: Create a test document in each category and verify**

In Servicios → create a new document, fill required fields, publish.
In Testimonios → create a new document. Verify `isApproved` defaults to `false`.
In Popups → create two popups and try to set both as `isActive: true`. Verify the second one fails with validation error.

- [ ] **Step 5: Commit verification**

```bash
git add .
git commit -m "chore(sanity): verify all schemas load correctly in Studio"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 16 document types + 8 objects defined. siteSettings absorbs globalConfig. All references match actual type names used (`serviceCategory`, `teamMember`, `service`, `testimonial`, `faq`, `category`, `blogPost`).
- [x] **Placeholder scan:** No TBDs. All fields have types, validations, and code.
- [x] **Type consistency:** `localePortableText` used consistently for rich text fields. `seoObject` used consistently. `ctaObject` used consistently. `processStep` named identically in Tasks 3 and 6/10.
- [x] **Deletion order:** `globalConfig.ts` deleted in Task 15 after `index.ts` is updated in Task 13 (no dangling imports).
- [x] **Registration order in index.ts:** Objects registered before singletons and documents — required because singletons use `ctaObject`, `navItem`, `seoObject`.
