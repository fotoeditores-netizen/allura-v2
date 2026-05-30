# Sanity Editorial UX — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar el desk structure del Sanity Studio y agregar descripciones de ayuda en 6 schemas para que el cliente editor pueda usar el CMS sin confundirse.

**Architecture:** Dos cambios independientes: (1) reemplazar el callback `structure` en `sanity.config.ts` con 14 secciones agrupadas lógicamente; (2) agregar `description` a campos específicos en 6 schemas de documentos, sin tocar validaciones ni previews existentes.

**Tech Stack:** Sanity v3 · next-sanity · `structureTool` · `defineField`

---

## File Map

| Acción | Archivo |
|--------|---------|
| Modify | `src/sanity/sanity.config.ts` |
| Modify | `src/sanity/schemaTypes/documents/service.ts` |
| Modify | `src/sanity/schemaTypes/documents/galleryItem.ts` |
| Modify | `src/sanity/schemaTypes/documents/video.ts` |
| Modify | `src/sanity/schemaTypes/documents/popup.ts` |
| Modify | `src/sanity/schemaTypes/documents/promotion.ts` |
| Modify | `src/sanity/schemaTypes/documents/teamMember.ts` |

---

## Task 1: Reorganizar desk structure en sanity.config.ts

**Files:**
- Modify: `src/sanity/sanity.config.ts`

- [ ] **Step 1: Leer el archivo actual**

Leer `src/sanity/sanity.config.ts` para confirmar la estructura actual del callback `structure`.

- [ ] **Step 2: Reemplazar el callback `structure` completo**

Reemplazar todo el bloque `structure: (S) => S.list()...` con el siguiente contenido. El resto del archivo (imports, `defineConfig`, `visionTool`) no cambia.

```typescript
structure: (S) =>
  S.list()
    .title('Contenido')
    .items([
      // ── HOME ─────────────────────────────────────────────
      S.listItem()
        .title('🏠 Página de inicio')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      // ── CONFIGURACIÓN ────────────────────────────────────
      S.listItem()
        .title('⚙️ Configuración global')
        .child(
          S.list()
            .title('Configuración global')
            .items([
              S.listItem()
                .title('Datos del sitio')
                .id('siteSettings')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Navegación')
                .id('navigation')
                .child(S.document().schemaType('navigation').documentId('navigation')),
            ])
        ),
      S.listItem()
        .title('🔍 SEO y medición')
        .child(
          S.list()
            .title('SEO y medición')
            .items([
              S.listItem()
                .title('SEO global')
                .id('siteSettings-seo')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Scripts y analítica')
                .id('trackingScripts')
                .child(
                  S.document().schemaType('trackingScripts').documentId('trackingScripts')
                ),
            ])
        ),

      S.divider(),

      // ── CONTENIDO PRINCIPAL ───────────────────────────────
      S.documentTypeListItem('page').title('📄 Páginas'),
      S.listItem()
        .title('🦷 Servicios')
        .child(
          S.list()
            .title('Servicios')
            .items([
              S.documentTypeListItem('serviceCategory').title('Categorías'),
              S.documentTypeListItem('service').title('Servicios'),
            ])
        ),
      S.listItem()
        .title('📝 Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('blogPost').title('Entradas'),
              S.documentTypeListItem('category').title('Categorías'),
            ])
        ),

      S.divider(),

      // ── SOCIAL PROOF Y MEDIA ──────────────────────────────
      S.documentTypeListItem('testimonial').title('⭐ Testimonios'),
      S.documentTypeListItem('faq').title('❓ Preguntas frecuentes'),
      S.documentTypeListItem('galleryItem').title('🖼️ Galería'),
      S.documentTypeListItem('video').title('🎬 Videos'),
      S.documentTypeListItem('caseStudy').title('🏆 Casos de éxito'),
      S.documentTypeListItem('teamMember').title('👥 Equipo'),

      S.divider(),

      // ── MARKETING ─────────────────────────────────────────
      S.listItem()
        .title('🎯 Promociones y popups')
        .child(
          S.list()
            .title('Promociones y popups')
            .items([
              S.documentTypeListItem('promotion').title('Promociones'),
              S.documentTypeListItem('popup').title('Popups'),
            ])
        ),
    ]),
```

El archivo completo resultante debe ser:

```typescript
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
            // ── HOME ─────────────────────────────────────────────
            S.listItem()
              .title('🏠 Página de inicio')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),

            S.divider(),

            // ── CONFIGURACIÓN ────────────────────────────────────
            S.listItem()
              .title('⚙️ Configuración global')
              .child(
                S.list()
                  .title('Configuración global')
                  .items([
                    S.listItem()
                      .title('Datos del sitio')
                      .id('siteSettings')
                      .child(
                        S.document().schemaType('siteSettings').documentId('siteSettings')
                      ),
                    S.listItem()
                      .title('Navegación')
                      .id('navigation')
                      .child(
                        S.document().schemaType('navigation').documentId('navigation')
                      ),
                  ])
              ),
            S.listItem()
              .title('🔍 SEO y medición')
              .child(
                S.list()
                  .title('SEO y medición')
                  .items([
                    S.listItem()
                      .title('SEO global')
                      .id('siteSettings-seo')
                      .child(
                        S.document().schemaType('siteSettings').documentId('siteSettings')
                      ),
                    S.listItem()
                      .title('Scripts y analítica')
                      .id('trackingScripts')
                      .child(
                        S.document()
                          .schemaType('trackingScripts')
                          .documentId('trackingScripts')
                      ),
                  ])
              ),

            S.divider(),

            // ── CONTENIDO PRINCIPAL ───────────────────────────────
            S.documentTypeListItem('page').title('📄 Páginas'),
            S.listItem()
              .title('🦷 Servicios')
              .child(
                S.list()
                  .title('Servicios')
                  .items([
                    S.documentTypeListItem('serviceCategory').title('Categorías'),
                    S.documentTypeListItem('service').title('Servicios'),
                  ])
              ),
            S.listItem()
              .title('📝 Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.documentTypeListItem('blogPost').title('Entradas'),
                    S.documentTypeListItem('category').title('Categorías'),
                  ])
              ),

            S.divider(),

            // ── SOCIAL PROOF Y MEDIA ──────────────────────────────
            S.documentTypeListItem('testimonial').title('⭐ Testimonios'),
            S.documentTypeListItem('faq').title('❓ Preguntas frecuentes'),
            S.documentTypeListItem('galleryItem').title('🖼️ Galería'),
            S.documentTypeListItem('video').title('🎬 Videos'),
            S.documentTypeListItem('caseStudy').title('🏆 Casos de éxito'),
            S.documentTypeListItem('teamMember').title('👥 Equipo'),

            S.divider(),

            // ── MARKETING ─────────────────────────────────────────
            S.listItem()
              .title('🎯 Promociones y popups')
              .child(
                S.list()
                  .title('Promociones y popups')
                  .items([
                    S.documentTypeListItem('promotion').title('Promociones'),
                    S.documentTypeListItem('popup').title('Popups'),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
})
```

- [ ] **Step 3: Verificar TypeScript**

```powershell
cd "c:\Users\publi\Desktop\ALLURA"
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```powershell
git add src/sanity/sanity.config.ts
git commit -m "feat(studio): reorganize desk structure with logical grouping and Spanish labels"
```

---

## Task 2: Agregar descripciones a service.ts

**Files:**
- Modify: `src/sanity/schemaTypes/documents/service.ts`

El archivo actual tiene los siguientes campos SIN descripción que necesitan una:
- `category` (línea 19)
- `benefits` (líneas 22-34)
- `process` (línea 35)
- `gallery` (línea 45)
- `faqs` (línea 46)
- `relatedServices` (línea 47)
- `isActive` (línea 51)

- [ ] **Step 1: Agregar `description` al campo `category` (línea 19)**

Reemplazar:
```typescript
defineField({ name: 'category', title: 'Categoría', type: 'reference', to: [{ type: 'serviceCategory' }], validation: (Rule) => Rule.required(), group: 'content' }),
```

Con:
```typescript
defineField({ name: 'category', title: 'Categoría', type: 'reference', to: [{ type: 'serviceCategory' }], description: 'Categoría principal del servicio. Define en qué sección del menú aparece.', validation: (Rule) => Rule.required(), group: 'content' }),
```

- [ ] **Step 2: Agregar `description` al campo `benefits` (línea 22)**

Reemplazar la línea de apertura:
```typescript
    defineField({
      name: 'benefits', title: 'Beneficios del tratamiento', type: 'array', group: 'content',
```

Con:
```typescript
    defineField({
      name: 'benefits', title: 'Beneficios del tratamiento', type: 'array', group: 'content',
      description: 'Lista de beneficios que aparecen destacados en la página del servicio. Máximo 8.',
```

- [ ] **Step 3: Agregar `description` al campo `process` (línea 35)**

Reemplazar:
```typescript
defineField({ name: 'process', title: 'Proceso del tratamiento', type: 'array', group: 'content', of: [{ type: 'processStep' }], validation: (Rule) => Rule.max(6) }),
```

Con:
```typescript
defineField({ name: 'process', title: 'Proceso del tratamiento', type: 'array', group: 'content', description: 'Pasos del procedimiento explicados al paciente. Aparecen en la sección ¿Cómo funciona? Máximo 6.', of: [{ type: 'processStep' }], validation: (Rule) => Rule.max(6) }),
```

- [ ] **Step 4: Agregar `description` al campo `gallery` (línea 45)**

Reemplazar:
```typescript
defineField({ name: 'gallery', title: 'Galería', type: 'array', group: 'media', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }], validation: (Rule) => Rule.max(12) }),
```

Con:
```typescript
defineField({ name: 'gallery', title: 'Galería', type: 'array', group: 'media', description: 'Fotos adicionales del procedimiento. Se muestran en la página del servicio. Máximo 12 imágenes.', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }], validation: (Rule) => Rule.max(12) }),
```

- [ ] **Step 5: Agregar `description` al campo `faqs` (línea 46)**

Reemplazar:
```typescript
defineField({ name: 'faqs', title: 'Preguntas frecuentes', type: 'array', group: 'relations', of: [{ type: 'reference', to: [{ type: 'faq' }] }] }),
```

Con:
```typescript
defineField({ name: 'faqs', title: 'Preguntas frecuentes', type: 'array', group: 'relations', description: 'Preguntas frecuentes asociadas a este servicio específico.', of: [{ type: 'reference', to: [{ type: 'faq' }] }] }),
```

- [ ] **Step 6: Agregar `description` al campo `relatedServices` (línea 47)**

Reemplazar:
```typescript
defineField({ name: 'relatedServices', title: 'Servicios relacionados', type: 'array', group: 'relations', of: [{ type: 'reference', to: [{ type: 'service' }] }], validation: (Rule) => Rule.max(3) }),
```

Con:
```typescript
defineField({ name: 'relatedServices', title: 'Servicios relacionados', type: 'array', group: 'relations', description: 'Servicios relacionados que se muestran al final de la página. Máximo 3.', of: [{ type: 'reference', to: [{ type: 'service' }] }], validation: (Rule) => Rule.max(3) }),
```

- [ ] **Step 7: Agregar `description` al campo `isActive` (línea 51)**

Reemplazar:
```typescript
defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true }),
```

Con:
```typescript
defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true, description: 'Desactivar oculta el servicio del sitio sin eliminarlo.' }),
```

- [ ] **Step 8: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 9: Commit**

```powershell
git add src/sanity/schemaTypes/documents/service.ts
git commit -m "feat(studio): add field descriptions to service schema"
```

---

## Task 3: Agregar descripciones a galleryItem.ts, video.ts

**Files:**
- Modify: `src/sanity/schemaTypes/documents/galleryItem.ts`
- Modify: `src/sanity/schemaTypes/documents/video.ts`

### galleryItem.ts — 4 campos

- [ ] **Step 1: Agregar `description` al campo `image` (línea 12)**

Reemplazar:
```typescript
defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
```

Con:
```typescript
defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, description: 'Imagen principal de la galería. Mínimo 800×600px. Formato JPG o WebP recomendado.', validation: (Rule) => Rule.required(), fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }] }] }),
```

- [ ] **Step 2: Agregar `description` al campo `category` (línea 13)**

Reemplazar:
```typescript
defineField({ name: 'category', title: 'Categoría', type: 'string', options: { list: [{ title: 'Clínica', value: 'clinic' }, { title: 'Equipo', value: 'team' }, { title: 'Resultados', value: 'results' }, { title: 'Medellín', value: 'medellin' }, { title: 'Eventos', value: 'events' }] } }),
```

Con:
```typescript
defineField({ name: 'category', title: 'Categoría', type: 'string', description: 'Categoría para filtrar en la galería pública. Ej: Clínica, Resultados.', options: { list: [{ title: 'Clínica', value: 'clinic' }, { title: 'Equipo', value: 'team' }, { title: 'Resultados', value: 'results' }, { title: 'Medellín', value: 'medellin' }, { title: 'Eventos', value: 'events' }] } }),
```

- [ ] **Step 3: Agregar `description` al campo `service` (línea 14)**

Reemplazar:
```typescript
defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }] }),
```

Con:
```typescript
defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }], description: 'Servicio relacionado con esta imagen (opcional).' }),
```

- [ ] **Step 4: Agregar `description` al campo `isFeatured` (línea 15)**

Reemplazar:
```typescript
defineField({ name: 'isFeatured', title: 'Destacado', type: 'boolean', initialValue: false }),
```

Con:
```typescript
defineField({ name: 'isFeatured', title: 'Destacado', type: 'boolean', initialValue: false, description: 'Las imágenes destacadas aparecen primero en la galería.' }),
```

### video.ts — 4 campos

- [ ] **Step 5: Agregar `description` al campo `platform` (línea 13)**

Reemplazar:
```typescript
defineField({ name: 'platform', title: 'Plataforma', type: 'string', options: { list: [{ title: 'YouTube', value: 'youtube' }, { title: 'Vimeo', value: 'vimeo' }, { title: 'Instagram', value: 'instagram' }], layout: 'radio' }, validation: (Rule) => Rule.required() }),
```

Con:
```typescript
defineField({ name: 'platform', title: 'Plataforma', type: 'string', description: 'Plataforma donde está alojado el video.', options: { list: [{ title: 'YouTube', value: 'youtube' }, { title: 'Vimeo', value: 'vimeo' }, { title: 'Instagram', value: 'instagram' }], layout: 'radio' }, validation: (Rule) => Rule.required() }),
```

- [ ] **Step 6: Agregar `description` al campo `thumbnail` (línea 15)**

Reemplazar:
```typescript
defineField({ name: 'thumbnail', title: 'Miniatura personalizada', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }),
```

Con:
```typescript
defineField({ name: 'thumbnail', title: 'Miniatura personalizada', type: 'image', options: { hotspot: true }, description: 'Imagen de portada del video. Si no se define, se usa la miniatura automática de la plataforma.', fields: [{ name: 'alt', title: 'Alt text', type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'English' }] }] }),
```

- [ ] **Step 7: Agregar `description` al campo `service` de video.ts (línea 16)**

Reemplazar:
```typescript
defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }] }),
```

Con:
```typescript
defineField({ name: 'service', title: 'Servicio relacionado', type: 'reference', to: [{ type: 'service' }], description: 'Servicio relacionado con este video (opcional).' }),
```

- [ ] **Step 8: Agregar `description` al campo `isFeatured` de video.ts (línea 18)**

Reemplazar:
```typescript
defineField({ name: 'isFeatured', title: 'Destacado', type: 'boolean', initialValue: false }),
```

Con:
```typescript
defineField({ name: 'isFeatured', title: 'Destacado', type: 'boolean', initialValue: false, description: 'Los videos destacados aparecen primero en la sección de videos.' }),
```

- [ ] **Step 9: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 10: Commit**

```powershell
git add src/sanity/schemaTypes/documents/galleryItem.ts src/sanity/schemaTypes/documents/video.ts
git commit -m "feat(studio): add field descriptions to galleryItem and video schemas"
```

---

## Task 4: Agregar descripciones a popup.ts y promotion.ts

**Files:**
- Modify: `src/sanity/schemaTypes/documents/popup.ts`
- Modify: `src/sanity/schemaTypes/documents/promotion.ts`

### popup.ts — 4 campos (trigger, startDate, endDate, frequency)

Los campos `delaySeconds`, `showOnPages`, e `isActive` ya tienen descripción — NO se tocan.

- [ ] **Step 1: Agregar `description` al campo `trigger` (línea 16)**

Reemplazar:
```typescript
defineField({ name: 'trigger', title: 'Disparador', type: 'string', options: { list: [{ title: 'Al cargar la página', value: 'on-load' }, { title: 'Intención de salida', value: 'exit-intent' }, { title: 'Después de hacer scroll', value: 'after-scroll' }, { title: 'Tiempo definido', value: 'timed' }], layout: 'radio' } }),
```

Con:
```typescript
defineField({ name: 'trigger', title: 'Disparador', type: 'string', description: 'Cuándo aparece el popup: al cargar la página, después de un tiempo, o al intentar salir.', options: { list: [{ title: 'Al cargar la página', value: 'on-load' }, { title: 'Intención de salida', value: 'exit-intent' }, { title: 'Después de hacer scroll', value: 'after-scroll' }, { title: 'Tiempo definido', value: 'timed' }], layout: 'radio' } }),
```

- [ ] **Step 2: Agregar `description` al campo `startDate` de popup.ts (línea 19)**

Reemplazar:
```typescript
defineField({ name: 'startDate', title: 'Fecha de inicio', type: 'datetime' }),
```

Con:
```typescript
defineField({ name: 'startDate', title: 'Fecha de inicio', type: 'datetime', description: 'Fecha desde la que el popup puede aparecer (opcional). Dejar vacío para activar inmediatamente.' }),
```

- [ ] **Step 3: Agregar `description` al campo `endDate` de popup.ts (línea 20)**

Reemplazar:
```typescript
defineField({ name: 'endDate', title: 'Fecha de fin', type: 'datetime' }),
```

Con:
```typescript
defineField({ name: 'endDate', title: 'Fecha de fin', type: 'datetime', description: 'Fecha límite del popup (opcional). Dejar vacío para que no expire.' }),
```

- [ ] **Step 4: Agregar `description` al campo `frequency` (línea 41)**

Reemplazar:
```typescript
defineField({ name: 'frequency', title: 'Frecuencia de aparición', type: 'string', options: { list: [{ title: 'Una vez (por usuario)', value: 'once' }, { title: 'Por sesión', value: 'per-session' }, { title: 'Siempre', value: 'always' }], layout: 'radio' }, initialValue: 'once' }),
```

Con:
```typescript
defineField({ name: 'frequency', title: 'Frecuencia de aparición', type: 'string', description: 'Con qué frecuencia se muestra al mismo visitante: una vez, por sesión, o siempre.', options: { list: [{ title: 'Una vez (por usuario)', value: 'once' }, { title: 'Por sesión', value: 'per-session' }, { title: 'Siempre', value: 'always' }], layout: 'radio' }, initialValue: 'once' }),
```

### promotion.ts — 5 campos (description, bgColor, startDate, endDate, isActive)

El campo `order` ya tiene descripción — NO se toca.

- [ ] **Step 5: Agregar `description` al campo `description` de promotion.ts (líneas 26-33)**

Reemplazar el bloque completo:
```typescript
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 2, validation: (Rule) => Rule.max(120) },
        { name: 'en', title: 'English', type: 'text', rows: 2, validation: (Rule) => Rule.max(120) },
      ],
    }),
```

Con:
```typescript
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'object',
      description: 'Texto secundario del banner. Aparece debajo del título principal (opcional).',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 2, validation: (Rule) => Rule.max(120) },
        { name: 'en', title: 'English', type: 'text', rows: 2, validation: (Rule) => Rule.max(120) },
      ],
    }),
```

- [ ] **Step 6: Agregar `description` al campo `bgColor` de promotion.ts (líneas 35-47)**

Reemplazar el bloque completo:
```typescript
    defineField({
      name: 'bgColor',
      title: 'Color de fondo',
      type: 'string',
      options: {
        list: [
          { title: 'Azul oscuro (Navy)', value: 'navy' },
          { title: 'Azul claro (Blue)', value: 'blue' },
          { title: 'Dorado (Gold)', value: 'gold' },
        ],
        layout: 'radio',
      },
      initialValue: 'navy',
    }),
```

Con:
```typescript
    defineField({
      name: 'bgColor',
      title: 'Color de fondo',
      type: 'string',
      description: 'Color de fondo del banner de promoción.',
      options: {
        list: [
          { title: 'Azul oscuro (Navy)', value: 'navy' },
          { title: 'Azul claro (Blue)', value: 'blue' },
          { title: 'Dorado (Gold)', value: 'gold' },
        ],
        layout: 'radio',
      },
      initialValue: 'navy',
    }),
```

- [ ] **Step 7: Agregar `description` a `startDate` y `endDate` de promotion.ts (líneas 48-49)**

Reemplazar:
```typescript
    defineField({ name: 'startDate', title: 'Fecha de inicio', type: 'datetime' }),
    defineField({ name: 'endDate', title: 'Fecha de fin', type: 'datetime' }),
```

Con:
```typescript
    defineField({ name: 'startDate', title: 'Fecha de inicio', type: 'datetime', description: 'Fecha desde la que se muestra el banner (opcional).' }),
    defineField({ name: 'endDate', title: 'Fecha de fin', type: 'datetime', description: 'Fecha límite del banner (opcional). Dejar vacío para que no expire.' }),
```

- [ ] **Step 8: Agregar `description` al campo `isActive` de promotion.ts (líneas 50-55)**

Reemplazar:
```typescript
    defineField({
      name: 'isActive',
      title: '🔴 Activo',
      type: 'boolean',
      initialValue: false,
    }),
```

Con:
```typescript
    defineField({
      name: 'isActive',
      title: '🔴 Activo',
      type: 'boolean',
      initialValue: false,
      description: 'Solo puede haber una promoción activa a la vez. Desactiva la anterior antes de activar esta.',
    }),
```

- [ ] **Step 9: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 10: Commit**

```powershell
git add src/sanity/schemaTypes/documents/popup.ts src/sanity/schemaTypes/documents/promotion.ts
git commit -m "feat(studio): add field descriptions to popup and promotion schemas"
```

---

## Task 5: Agregar descripciones a teamMember.ts

**Files:**
- Modify: `src/sanity/schemaTypes/documents/teamMember.ts`

7 campos sin descripción: `role`, `department`, `specialties`, `credentials`, `linkedinUrl`, `isActive`, `isFeatured`.
El campo `order` ya tiene descripción — NO se toca.

- [ ] **Step 1: Agregar `description` al campo `role` (líneas 13-19)**

Reemplazar:
```typescript
    defineField({
      name: 'role', title: 'Cargo', type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
      ],
    }),
```

Con:
```typescript
    defineField({
      name: 'role', title: 'Cargo', type: 'object',
      description: 'Cargo que aparece debajo del nombre en la página del equipo. Ej: Directora Médica.',
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
      ],
    }),
```

- [ ] **Step 2: Agregar `description` al campo `department` (líneas 20-22)**

Reemplazar:
```typescript
    defineField({
      name: 'department', title: 'Departamento', type: 'string',
      options: { list: [{ title: 'Dental', value: 'dental' }, { title: 'Estética', value: 'aesthetic' }, { title: 'Medicina', value: 'medical' }, { title: 'Coordinación', value: 'coordination' }, { title: 'Gerencia', value: 'management' }] },
    }),
```

Con:
```typescript
    defineField({
      name: 'department', title: 'Departamento', type: 'string',
      description: 'Área o especialidad del equipo al que pertenece.',
      options: { list: [{ title: 'Dental', value: 'dental' }, { title: 'Estética', value: 'aesthetic' }, { title: 'Medicina', value: 'medical' }, { title: 'Coordinación', value: 'coordination' }, { title: 'Gerencia', value: 'management' }] },
    }),
```

- [ ] **Step 3: Agregar `description` al campo `specialties` (línea 26)**

Reemplazar:
```typescript
defineField({ name: 'specialties', title: 'Especialidades', type: 'array', of: [{ type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }], preview: { select: { title: 'es' } } }], validation: (Rule) => Rule.max(5) }),
```

Con:
```typescript
defineField({ name: 'specialties', title: 'Especialidades', type: 'array', description: 'Especialidades médicas o áreas de expertise. Se muestran en el perfil del profesional. Máximo 5.', of: [{ type: 'object', fields: [{ name: 'es', type: 'string', title: 'Español', validation: (Rule) => Rule.required() }, { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() }], preview: { select: { title: 'es' } } }], validation: (Rule) => Rule.max(5) }),
```

- [ ] **Step 4: Agregar `description` al campo `credentials` (línea 27)**

Reemplazar:
```typescript
defineField({ name: 'credentials', title: 'Credenciales / títulos', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.max(8) }),
```

Con:
```typescript
defineField({ name: 'credentials', title: 'Credenciales / títulos', type: 'array', description: 'Títulos, certificaciones y registros médicos. Máximo 8.', of: [{ type: 'string' }], validation: (Rule) => Rule.max(8) }),
```

- [ ] **Step 5: Agregar `description` al campo `linkedinUrl` (línea 28)**

Reemplazar:
```typescript
defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
```

Con:
```typescript
defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url', description: 'URL del perfil de LinkedIn (opcional).' }),
```

- [ ] **Step 6: Agregar `description` al campo `isActive` (línea 30)**

Reemplazar:
```typescript
defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true }),
```

Con:
```typescript
defineField({ name: 'isActive', title: 'Activo en el sitio', type: 'boolean', initialValue: true, description: 'Desactivar oculta el miembro del sitio sin eliminarlo.' }),
```

- [ ] **Step 7: Agregar `description` al campo `isFeatured` (línea 31)**

Reemplazar:
```typescript
defineField({ name: 'isFeatured', title: 'Destacado en home', type: 'boolean', initialValue: false }),
```

Con:
```typescript
defineField({ name: 'isFeatured', title: 'Destacado en home', type: 'boolean', initialValue: false, description: 'Los miembros destacados aparecen primero en la página del equipo.' }),
```

- [ ] **Step 8: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 9: Commit**

```powershell
git add src/sanity/schemaTypes/documents/teamMember.ts
git commit -m "feat(studio): add field descriptions to teamMember schema"
```

---

## Task 6: Build final + verificación

- [ ] **Step 1: Build de producción**

```powershell
cd "c:\Users\publi\Desktop\ALLURA"
npx next build
```

Expected: 0 errores, mismo número de páginas que antes (~84).

- [ ] **Step 2: Verificar Studio en dev**

```powershell
npx next dev
```

Abrir `http://localhost:3000/studio` y verificar:

1. El sidebar izquierdo muestra la nueva estructura:
   - 🏠 Página de inicio (ítem directo)
   - ⚙️ Configuración global (subgrupo)
   - 🔍 SEO y medición (subgrupo)
   - 📄 Páginas
   - 🦷 Servicios (subgrupo)
   - 📝 Blog (subgrupo)
   - ⭐ Testimonios
   - ❓ Preguntas frecuentes
   - 🖼️ Galería
   - 🎬 Videos
   - 🏆 Casos de éxito
   - 👥 Equipo
   - 🎯 Promociones y popups (subgrupo)

2. Abrir un Servicio → verificar que los campos `category`, `benefits`, `process`, `gallery` muestran texto de ayuda debajo del label.

3. Abrir una Galería → verificar descripción en campo `image`.

4. Abrir un Popup → verificar descripción en campo `trigger`.

5. Abrir un miembro del Equipo → verificar descripción en campo `role`.

- [ ] **Step 3: No se requiere commit adicional si build está limpio**

```powershell
git status
```

Expected: working tree clean.
