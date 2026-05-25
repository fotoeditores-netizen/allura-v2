# Spec: Integración Sanity CMS — Allura Healthcare
**Fecha:** 2026-05-22
**Rama:** feature/sanity-cms-v1
**Estado:** Aprobado por usuario

---

## 1. Objetivo

Integrar Sanity como CMS profesional para que el cliente pueda administrar todo el contenido comercial visible del sitio sin depender de un programador. El sitio actualmente es frontend estático con contenido hardcoded en `messages/es.json`, `messages/en.json`, y en cada `page.tsx`.

---

## 2. Decisiones de diseño (confirmadas por usuario)

| Pregunta | Decisión |
|---|---|
| Nivel de autonomía del cliente | Nivel completo: textos, imágenes, equipo, blog, menú, SEO, config global |
| Estrategia i18n en Sanity | Un documento, dos campos (`titulo_es`, `titulo_en`) |
| Blog en esta integración | Sí, blog completo con Portable Text y rutas dinámicas |
| Ubicación del Studio | Embebido en el mismo proyecto en `/studio` |
| Gate de avance entre fases | No avanzar hasta compilación + funcionamiento local + aprobación explícita |

---

## 3. Arquitectura

### 3.1 Estructura de carpetas nueva

```
src/
├── sanity/
│   ├── lib/
│   │   ├── client.ts          ← createClient (projectId, dataset, useCdn, token)
│   │   ├── queries.ts         ← GROQ queries tipadas y reutilizables
│   │   └── image.ts           ← urlFor() helper
│   ├── schemaTypes/
│   │   ├── singletons/
│   │   │   ├── globalConfig.ts
│   │   │   ├── homePage.ts
│   │   │   ├── nosotros.ts
│   │   │   ├── comoFunciona.ts
│   │   │   └── menu.ts
│   │   ├── collections/
│   │   │   ├── servicioCategoria.ts
│   │   │   ├── servicioDetalle.ts
│   │   │   ├── miembro.ts
│   │   │   ├── blogPost.ts
│   │   │   └── aliado.ts
│   │   └── index.ts           ← exporta todos los schemas
│   └── sanity.config.ts       ← config del Studio (projectId, dataset, schemas, plugins)
└── app/
    └── studio/
        └── [[...tool]]/
            └── page.tsx       ← NextStudio embebido

sanity.config.ts               ← re-export desde src/sanity/sanity.config.ts
```

### 3.2 Variables de entorno requeridas

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxxx          # solo server-side, para writes y draft preview
SANITY_WEBHOOK_SECRET=xxxx     # para revalidación por webhook
```

### 3.3 Estrategia de fetching

- **Server Components** (`page.tsx`): `fetch()` con GROQ query + `revalidate: 3600`
- **Webhooks**: Sanity → `/api/revalidate` → `revalidatePath()` para cambios inmediatos
- **Sin `use client`** para fetching — los datos bajan como props a componentes client si necesitan interactividad

### 3.4 Convención de campos bilingües

Todos los campos de texto editables por el cliente siguen el patrón:
```typescript
{ name: 'titulo_es', title: 'Título (Español)', type: 'string' }
{ name: 'titulo_en', title: 'Title (English)', type: 'string' }
```

En las páginas, la selección es:
```typescript
const content = locale === 'en' ? data.titulo_en : data.titulo_es
```

---

## 4. Schemas de Sanity

### 4.1 `globalConfig` (singleton)
Campos: `whatsappUrl`, `email`, `instagram`, `facebook`, `linkedin`, `tiktok`, `logo` (image), `copyright_es`, `copyright_en`

### 4.2 `homePage` (singleton)
Secciones: hero (eyebrow, headline 1+2, subtexto, imagen/video fondo, cta1Label, cta2Label — todo ×2 idiomas), benefits (título, 3 ítems), cta banner (título, cuerpo, botón — ×2 idiomas)

### 4.3 `nosotros` (singleton)
Campos: heroEyebrow, heroTitle, heroSubtitle, missionTitle, missionBody1, missionBody2, imagen, pillars[] (number, title, description), values[] (title, description) — todo ×2 idiomas

### 4.4 `comoFunciona` (singleton)
Campos: heroTitle, heroSubtitle, steps[] (number, title, description, imagen), faqs[] (q, a), ctaTitle, ctaSubtitle — todo ×2 idiomas

### 4.5 `menu` (singleton)
Campos: serviceItems[] (href, label_es, label_en), ctaLabel_es, ctaLabel_en, payLabel_es, payLabel_en

### 4.6 `servicioCategoria` (collection)
Campos: slug (fixed, no editable), title_es, title_en, eyebrow_es, eyebrow_en, subtitle_es, subtitle_en, description_es, description_en, heroImage (image), metaTitle_es, metaTitle_en, metaDesc_es, metaDesc_en

### 4.7 `servicioDetalle` (collection)
Campos: slug (fixed), categoria (reference → servicioCategoria), title_es, title_en, description_es, description_en, benefits_es[] (string), benefits_en[] (string), steps_es[] (title+description), steps_en[] (title+description), candidates_es[] (string), candidates_en[] (string), timeline_es, timeline_en, imagen (image), metaTitle_es, metaTitle_en, metaDesc_es, metaDesc_en

### 4.8 `miembro` (collection)
Campos: name, slug, specialty_es, specialty_en, formacion[] (string), reconocimiento[] (string), enfoque_es[] (string), enfoque_en[] (string), foto (image), orden (number), metaTitle_es, metaTitle_en

### 4.9 `blogPost` (collection)
Campos: title_es, title_en, slug, categoria_es, categoria_en, extracto_es, extracto_en, imagenDestacada (image), fecha (date), tiempoLectura, cuerpo_es (array de Portable Text blocks), cuerpo_en (array de Portable Text blocks), metaTitle_es, metaTitle_en, metaDesc_es, metaDesc_en, publicado (boolean)

### 4.10 `aliado` (collection)
Campos: nombre, logo (image), url, orden (number)

---

## 5. Rutas nuevas

| Ruta | Descripción |
|---|---|
| `/studio` | Sanity Studio embebido (Next.js App Router) |
| `/[locale]/blog/[slug]` | Post individual de blog (dinámica, nueva) |
| `/api/revalidate` | Webhook endpoint para ISR on-demand |

---

## 6. Fases de implementación

### Fase 1 — Infraestructura base
**Entregable:** Studio accesible en `/studio`, `globalConfig` conectado al Footer y Header (WhatsApp URL, email, redes sociales).
**Archivos nuevos:** `src/sanity/lib/client.ts`, `src/sanity/lib/image.ts`, `src/sanity/lib/queries.ts`, `src/sanity/schemaTypes/singletons/globalConfig.ts`, `src/sanity/schemaTypes/index.ts`, `src/sanity/sanity.config.ts`, `src/app/studio/[[...tool]]/page.tsx`, `sanity.config.ts`, `.env.local`
**Archivos modificados:** `src/components/layout/Footer.tsx` (WhatsApp URL desde Sanity), `src/components/layout/Header.tsx` (idem)
**Gate:** Studio carga en `/studio`, WhatsApp URL se lee desde Sanity, compilación TypeScript limpia.

### Fase 2 — Singletons principales (Home, Cómo Funciona, Nosotros)
**Entregable:** Las tres páginas leen todo su contenido desde Sanity. `messages/es.json` y `messages/en.json` conservan solo traducciones de UI (labels de botones, breadcrumbs, etc.).
**Gate:** Las tres páginas renderizan correctamente en `/es` y `/en`.

### Fase 3 — Equipo
**Entregable:** `/equipo` renderiza desde colección `miembro` en Sanity. Fotos servidas desde Sanity Assets con `urlFor()`.
**Gate:** Grid de médicos carga desde Sanity con imágenes.

### Fase 4 — Servicios (4 categorías + 24 subpáginas)
**Entregable:** Todas las páginas de servicios leen desde Sanity. Slugs siguen siendo fijos en el código (no controlados por Sanity) para preservar SEO.
**Gate:** Las 28 rutas de servicios compilan y renderizan correctamente en ambos idiomas.

### Fase 5 — Blog completo
**Entregable:** Lista de posts dinámica, rutas individuales `/[locale]/blog/[slug]`, Portable Text renderer con estilos del brandbook, SEO por post.
**Gate:** Un post de prueba publicado en Sanity aparece en `/es/blog` y en `/es/blog/[slug]`.

### Fase 6 — Menú y Aliados
**Entregable:** `serviceItems` del Nav/Header y logos de partners editables desde Sanity.
**Gate:** Cambiar un label en Sanity se refleja en la navegación sin tocar código.

### Fase 7 — Webhooks, SEO dinámico y Sitemap
**Entregable:** Webhook de Sanity activa `revalidatePath()`, `sitemap.xml` dinámico generado desde Sanity, SEO open graph por página.
**Gate:** Editar un título en Sanity actualiza la página en producción en <10 segundos.

---

## 7. Contenido NO editable (permanece en código)

- Estructura de rutas URL (slugs de servicios)
- Paleta de colores Tailwind y tipografías
- Animaciones Framer Motion
- Páginas legales (T&C, Disclaimer, Privacidad, Accesibilidad)
- Lógica del formulario de contacto
- Configuración de next-intl y routing
- Variables de entorno y API keys

---

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| 24 subpáginas de servicios — migración extensa | Seed script para poblar Sanity desde el JSON existente |
| Slugs de servicios desincronizados | Slugs fijos en código; Sanity solo provee contenido |
| Blog Portable Text — estilos del brandbook | `PortableTextComponents` con Tailwind del proyecto |
| Imágenes en `public/` — migración | Progresiva fase por fase, no de golpe |
| ISR + cambios en Sanity no inmediatos | Webhook → `revalidatePath()` en Fase 7 |
| Studio expuesto en mismo dominio | Acceso controlado por autenticación de cuenta Sanity |

---

## 9. Paquetes a instalar (Fase 1)

```bash
npm install next-sanity @sanity/image-url
npm install --save-dev @sanity/types
```

`next-sanity` incluye: cliente GROQ, Visual Editing helpers, `NextStudio` component.
