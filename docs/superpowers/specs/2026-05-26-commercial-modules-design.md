# Commercial Modules — Sanity Integration Design Spec

**Fecha:** 2026-05-26  
**Proyecto:** Allura Healthcare  
**Rama:** feature/sanity-cms-v1

---

## Goal

Conectar los módulos comerciales avanzados (Galería, Videos, Popup, Promociones) a Sanity CMS. Sin modificar áreas no relacionadas. Build limpio requerido.

---

## Architecture

Mismo patrón establecido: thin pages → templates con datos Sanity. Dos puntos de entrada nuevos en el layout (`PromoBanner` server component + `PopupManager` client component). Galería tiene página propia. Videos se integran en `ComoFuncionaTemplate`. Popup y PromoBanner se inyectan en `src/app/[locale]/layout.tsx`.

**Stack:** Next.js 14 App Router · next-intl · Sanity v3 / next-sanity@9 · GROQ · ISR (`revalidate=0` dev / `3600` prod) · `@portabletext/react` · Tailwind CSS

---

## Módulo 1: Galería

### Schema (ya existe — sin modificar)
`galleryItem.ts` — campos usados:

| Campo | Tipo | Uso |
|-------|------|-----|
| `title` | `{ es, en }` | Caption bajo imagen |
| `image` | image con `alt: { es, en }` | Imagen optimizada |
| `category` | string enum | Filtro (clinic/team/results/medellin/events) |
| `isFeatured` | boolean | Orden prioritario (no filtro) |
| `publishedAt` | datetime | Orden desc |

### GROQ
```groq
// galleryCategoriesQuery — lista de categorías únicas presentes
*[_type == "galleryItem"] { "category": category } 
// (agrupado en código, no en GROQ)

// galleryItemsQuery — todos los ítems, filtrado opcional por categoría
*[_type == "galleryItem" && (!defined($category) || category == $category)]
| order(isFeatured desc, publishedAt desc) {
  _id, title, category, isFeatured,
  image { asset->{ _id, url, metadata { dimensions } }, alt }
}
```

### TypeScript types
```typescript
export interface GalleryItemData {
  _id: string
  title?: { es?: string; en?: string }
  category?: string
  isFeatured?: boolean
  image: {
    asset: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } }
    alt?: { es?: string; en?: string }
  }
}
```

### Frontend
- **Página:** `src/app/[locale]/galeria/page.tsx` — async, `revalidate`, `generateMetadata`
- **Template:** `src/components/templates/GalleryTemplate.tsx` — async server component
- **UI:** Filter pills por categoría (URL `?categoria=clinic` etc.), grid masonry-like `columns-1 sm:columns-2 lg:columns-3`, `next/image` con `sizes` responsivo
- **Fallback:** si vacío → mensaje "Próximamente" centrado
- **i18n keys** a agregar en `messages/es.json` y `messages/en.json` bajo namespace `galeria`:
  ```json
  "metaTitle": "Galería — Allura Healthcare",
  "metaDesc": "...",
  "heroEyebrow": "Galería",
  "heroTitle": "Nuestra clínica y resultados",
  "heroSubtitle": "...",
  "all": "Todos",
  "clinic": "Clínica",
  "team": "Equipo",
  "results": "Resultados",
  "medellin": "Medellín",
  "events": "Eventos",
  "empty": "Próximamente"
  ```

---

## Módulo 2: Videos

### Schema (ya existe — sin modificar)
`video.ts` — campos usados:

| Campo | Tipo | Uso |
|-------|------|-----|
| `title` | `{ es, en }` | Título de la card |
| `description` | `{ es, en }` | Subtítulo |
| `platform` | `youtube\|vimeo\|instagram` | Construcción segura del embed URL |
| `videoId` | `string` | Solo el ID — nunca URL libre |
| `thumbnail` | image con `alt: { es, en }` | Miniatura de la card |
| `isFeatured` | boolean | Orden prioritario |
| `publishedAt` | datetime | Orden desc |

### GROQ
```groq
*[_type == "video"] | order(isFeatured desc, publishedAt desc) {
  _id, title, description, platform, videoId,
  thumbnail { asset->{ url }, alt },
  category, isFeatured
}
```

### TypeScript types
```typescript
export interface VideoItem {
  _id: string
  title: { es: string; en: string }
  description?: { es?: string; en?: string }
  platform: 'youtube' | 'vimeo' | 'instagram'
  videoId: string
  thumbnail?: { asset: { url: string }; alt?: { es?: string; en?: string } }
  category?: string
  isFeatured?: boolean
}
```

### Seguridad — construcción de embed URL
```typescript
function getEmbedUrl(platform: string, videoId: string): string {
  if (platform === 'youtube') return `https://www.youtube.com/embed/${videoId}`
  if (platform === 'vimeo') return `https://player.vimeo.com/video/${videoId}`
  return '' // instagram: no embed directo, link externo
}
```
Nunca `<iframe src={campoLibre}>`. Solo se construye desde `platform` (enum validado en schema) + `videoId` (solo el ID, sin protocolo).

### Frontend
- **Sección en `ComoFuncionaTemplate`**: se agrega antes del CTA inline, solo cuando `videos.length > 0`
- **UI:** Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Cada card: thumbnail (click abre el video en iframe dentro de un dialog/modal client component), título, descripción, badge de categoría.
- **`VideoCard`:** `"use client"` component con estado `open` para mostrar/ocultar el iframe. El iframe solo se monta cuando `open === true` (performance: no carga el video hasta que el usuario haga click).
- **i18n:** heading fijo inline ternario (no requiere nuevas claves) o claves opcionales.

---

## Módulo 3: Popup

### Schema (ya existe — sin modificar)
Campos usados:

| Campo | Tipo | Uso |
|-------|------|-----|
| `title` | `{ es, en }` | Título del modal |
| `body` | `localePortableText` | Contenido con PortableText |
| `image` | image con `alt: { es, en }` | Imagen opcional |
| `cta` | `ctaObject` | Botón CTA |
| `trigger` | `on-load\|timed` | Solo estos 2 en fase 1 |
| `delaySeconds` | number | Para trigger `timed` |
| `showOnPages` | `string[]` | Rutas donde mostrar (vacío = todas) |
| `startDate` / `endDate` | datetime | Ventana de validez |
| `isActive` | boolean | Solo 1 activo a la vez |
| `frequency` | `once\|per-session\|always` | Control de repetición |

### GROQ
```groq
*[_type == "popup" && isActive == true][0] {
  _id, title, body, image { asset->{ url }, alt },
  cta, trigger, delaySeconds, showOnPages,
  startDate, endDate, frequency
}
```

### TypeScript types
```typescript
export interface ActivePopup {
  _id: string
  title: { es: string; en: string }
  body?: {
    es: import('@portabletext/types').PortableTextBlock[]
    en: import('@portabletext/types').PortableTextBlock[]
  }
  image?: { asset: { url: string }; alt?: { es?: string; en?: string } }
  cta?: {
    label: { es: string; en: string }
    url: string
    style?: string
    openInNewTab?: boolean
  }
  trigger?: 'on-load' | 'timed'
  delaySeconds?: number
  showOnPages?: string[]
  startDate?: string
  endDate?: string
  frequency?: 'once' | 'per-session' | 'always'
}
```

### Frontend — `PopupManager`
**Archivo:** `src/components/ui/PopupManager.tsx` — `"use client"`

Props: `popup: ActivePopup | null`, `locale: string`

Lógica:
1. Si `popup === null` → return null
2. Valida fechas: `startDate` y `endDate` vs `Date.now()` → si fuera de rango, return null
3. Valida `showOnPages`: si array no vacío, verifica que `usePathname()` incluya alguna ruta → si no, return null
4. Valida `frequency`:
   - `once` → `localStorage.getItem('popup_seen_' + popup._id)` → si existe, return null; al cerrar, setItem
   - `per-session` → `sessionStorage.getItem('popup_seen_' + popup._id)` → misma lógica
   - `always` → siempre muestra
5. Trigger:
   - `on-load` → `useEffect` sin delay
   - `timed` → `useEffect` con `setTimeout(delaySeconds * 1000)`
6. UI: `dialog`-like overlay `fixed inset-0 z-50 bg-black/50`, modal centrado con `max-w-lg`, botón X para cerrar, título, body con `PortableText`, imagen opcional, CTA con `Link` o `<a>` controlado
7. **Seguridad:** body renderizado con `<PortableText>` — nunca `dangerouslySetInnerHTML`. CTA construido desde `ctaObject.url` (validado en schema) + `ctaObject.openInNewTab`.

**En `layout.tsx`:** el layout server component fetcha `activePopupQuery` y pasa el resultado como prop a `<PopupManager popup={popup ?? null} locale={locale} />`.

---

## Módulo 4: Promociones

### Schema — crear nuevo
**Archivo:** `src/sanity/schemaTypes/documents/promotion.ts`

```typescript
// Campos:
name: string (interno, requerido)
title: { es: string; en: string } (requerido)
description: { es: string; en: string } (max 120 chars cada uno)
cta?: ctaObject
bgColor: 'navy' | 'blue' | 'gold' (enum, default: 'navy')
startDate?: datetime
endDate?: datetime
isActive: boolean (default: false)
order: number (para orden manual si hay múltiples futuras)
```

### GROQ
```groq
*[_type == "promotion" && isActive == true
  && (!defined(startDate) || startDate <= now())
  && (!defined(endDate) || endDate >= now())
] | order(order asc) [0] {
  _id, title, description, cta, bgColor, startDate, endDate
}
```

### TypeScript types
```typescript
export interface ActivePromotion {
  _id: string
  title: { es: string; en: string }
  description?: { es?: string; en?: string }
  cta?: {
    label: { es: string; en: string }
    url: string
    style?: string
    openInNewTab?: boolean
  }
  bgColor?: 'navy' | 'blue' | 'gold'
  startDate?: string
  endDate?: string
}
```

### Frontend — `PromoBanner`
**Archivo:** `src/components/ui/PromoBanner.tsx` — server component (NO "use client")

Props: `promotion: ActivePromotion | null`, `locale: string`

UI: barra delgada `py-2 px-4` sobre el header (en el layout, antes de `<Header>`). Fondo según `bgColor` (`bg-brand-navy` / `bg-brand-blue` / `bg-amber-600`). Texto: título + descripción en la misma línea. CTA como link inline. Sin botón de cerrar — es informativo, no invasivo. Si `promotion === null` → return null (no afecta layout).

**En `layout.tsx`:** layout server component fetcha `activePromotionQuery` en paralelo con el popup, pasa a `<PromoBanner promotion={promo ?? null} locale={locale} />` antes de `<Header>`.

---

## File Structure

### Archivos a crear
```
src/sanity/schemaTypes/documents/promotion.ts
src/components/templates/GalleryTemplate.tsx
src/components/ui/PopupManager.tsx
src/components/ui/PromoBanner.tsx
src/app/[locale]/galeria/page.tsx
```

### Archivos a modificar
```
src/sanity/schemaTypes/index.ts             — import + register promotion
src/sanity/lib/queries.ts                   — append GalleryItemData, VideoItem, ActivePopup, ActivePromotion + 4 queries
src/app/[locale]/layout.tsx                 — add PromoBanner + PopupManager fetches
src/components/templates/ComoFuncionaTemplate.tsx — add videos section + VideoCard
messages/es.json                            — add galeria namespace
messages/en.json                            — add galeria namespace
```

---

## ISR, Performance y Seguridad

- `revalidate = 0` dev / `3600` prod en todas las páginas
- `next/image` con `sizes` en todas las imágenes de galería
- Video iframes: solo se montan cuando el usuario hace click (lazy mount)
- Popup y PromoBanner en el layout: fetch con `revalidate=3600` — no bloquea el render
- Popup body: solo `PortableText` — nunca `dangerouslySetInnerHTML`
- CTA URLs del schema validadas (empiezan con `/` o `https://`) — sin eval, sin scripts
- Embed URLs construidas en código desde `platform` enum + `videoId` (solo ID)

---

## Out of Scope

- Filtro de galería por servicio referenciado
- Modal de imagen fullscreen en galería
- Videos de Instagram (no hay embed estable; se muestra como link externo)
- Popup con trigger `exit-intent` o `after-scroll`
- Múltiples promociones activas simultáneas
- Animación de transición del popup
