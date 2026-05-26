# Blog / Noticias con Sanity — Design Spec

**Fecha:** 2026-05-26  
**Proyecto:** Allura Healthcare  
**Rama:** feature/sanity-cms-v1

---

## Goal

Conectar la sección Blog/Noticias del sitio Allura a Sanity CMS. Los artículos se editan en Sanity Studio y se renderizan en `/es/blog` y `/en/blog` con soporte completo de i18n, filtro por categoría vía URL, página de detalle por slug, SEO por artículo e ISR.

---

## Architecture

Sigue el patrón ya establecido en el proyecto (servicios): **thin page → template con datos Sanity opcionales + fallback hardcoded**. Dos templates nuevos (`BlogListTemplate`, `BlogPostTemplate`) encapsulan la UI. Las páginas son async server components que hacen `client.fetch` y pasan datos a los templates.

**Stack:** Next.js 14 App Router · next-intl (`localePrefix: always`) · Sanity v3 / next-sanity@9 · GROQ · ISR (`revalidate = 0` dev / `3600` prod) · `@portabletext/react`

---

## Schemas (ya existentes — sin modificar)

Los schemas `blogPost` y `category` ya están definidos y registrados en `src/sanity/schemaTypes/index.ts`. Cubren todos los requisitos:

### `blogPost`
| Campo | Tipo | Notas |
|---|---|---|
| `title` | `{ es, en }` | Bilingüe requerido |
| `slug` | `slug` (fuente: `title.es`) | Único, usado para ambas rutas `/es` y `/en` |
| `author` | `reference → teamMember` | Requerido |
| `categories` | `array<reference → category>` | Mín. 1 |
| `publishedAt` | `datetime` | Requerido |
| `status` | `draft` \| `review` \| `published` | Filtramos por `published` en queries |
| `featuredImage` | `image` con `alt: { es, en }` | Requerido |
| `excerpt` | `{ es, en }` | Máx. 200 chars |
| `body` | `localePortableText` (`{ es[], en[] }`) | Portable Text bilingüe |
| `relatedPosts` | `array<reference → blogPost>` | Máx. 3 |
| `relatedServices` | `array<reference → service>` | Máx. 2 |
| `seo` | `seoObject` | Requerido |

### `category`
| Campo | Tipo | Notas |
|---|---|---|
| `title` | `{ es, en }` | Bilingüe requerido |
| `slug` | `slug` | Usado en query param `?categoria=<slug>` |
| `description` | `{ es, en }` | Opcional |
| `color` | `string` (hex) | Opcional, para badge de color |

---

## GROQ Queries + TypeScript Types

**Archivo:** `src/sanity/lib/queries.ts` (se añade al final, sin tocar código existente)

### Types nuevos

```typescript
export interface BlogCategory {
  _id: string
  title: LocaleString
  slug: { current: string }
  color?: string
}

export interface BlogPostListItem {
  _id: string
  title: LocaleString
  slug: { current: string }
  excerpt: LocaleString
  publishedAt: string
  featuredImage?: SanityImageLocaleAlt
  categories?: BlogCategory[]
  author?: { name: string }
}

export interface BlogPostDetail {
  _id: string
  title: LocaleString
  slug: { current: string }
  excerpt: LocaleString
  publishedAt: string
  featuredImage?: SanityImageLocaleAlt
  body?: { es: import('@portabletext/types').PortableTextBlock[]; en: import('@portabletext/types').PortableTextBlock[] }
  categories?: BlogCategory[]
  author?: { name: string; photo?: SanityImage }
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    noIndex?: boolean
    canonicalUrl?: string
  }
}
```

### Queries nuevas

**`blogCategoriesQuery`** — todas las categorías, ordenadas por título:
```groq
*[_type == "category"] | order(title.es asc) {
  _id, title, slug, color
}
```

**`blogPostListQuery`** — artículos publicados, filtro opcional por categoría:
```groq
*[_type == "blogPost" && status == "published" && (!defined($categorySlug) || $categorySlug in categories[]->slug.current)] | order(publishedAt desc) {
  _id, title, slug, excerpt, publishedAt,
  featuredImage { asset->{ _id, url, metadata { dimensions } }, alt },
  "categories": categories[]-> { _id, title, slug, color },
  "author": author->{ name }
}
```
Parámetro: `$categorySlug` (string | null).

**`blogPostBySlugQuery`** — artículo por slug:
```groq
*[_type == "blogPost" && slug.current == $slug && status == "published"][0] {
  _id, title, slug, excerpt, publishedAt,
  featuredImage { asset->{ _id, url, metadata { dimensions } }, alt },
  body { es[] { ..., markDefs[] { ..., _type == "link" => { "href": href } } }, en[] { ..., markDefs[] { ..., _type == "link" => { "href": href } } } },
  "categories": categories[]-> { _id, title, slug, color },
  "author": author->{ name, photo { asset->{ _id, url, metadata { dimensions } } } },
  seo { metaTitle, metaDescription, ogImage { asset->{ _id, url, metadata { dimensions } } }, noIndex, canonicalUrl }
}
```
Parámetro: `$slug` (string).

**`blogPostSlugsQuery`** — todos los slugs publicados (para `generateStaticParams`):
```groq
*[_type == "blogPost" && status == "published"] { "slug": slug.current }
```

---

## File Structure

### Nuevos archivos a crear
```
src/components/templates/BlogListTemplate.tsx
src/components/templates/BlogPostTemplate.tsx
src/app/[locale]/blog/[slug]/page.tsx
```

### Archivos a modificar
```
src/sanity/lib/queries.ts          — añadir types + queries
src/app/[locale]/blog/page.tsx     — reemplazar con versión Sanity
```

---

## Pages

### `/[locale]/blog/page.tsx` — Listado

- Server component async
- Lee `searchParams.categoria` (string | undefined)
- Hace dos fetches en paralelo (`Promise.all`): categorías + posts filtrados
- `export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600`
- `generateMetadata` usa textos hardcoded (no depende de Sanity para el listado)
- Pasa datos a `<BlogListTemplate>`

```typescript
// Firma del page
export default async function BlogPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { categoria?: string }
})
```

### `/[locale]/blog/[slug]/page.tsx` — Detalle

- Server component async
- `generateStaticParams` precarga todos los slugs publicados
- `generateMetadata` usa `seo.metaTitle` / `seo.metaDescription` de Sanity con fallback a `title[locale]`
- Si `sanityData` es null → `notFound()`
- Pasa datos a `<BlogPostTemplate>`

---

## Templates

### `BlogListTemplate`

Props:
```typescript
interface BlogListTemplateProps {
  posts: BlogPostListItem[]
  categories: BlogCategory[]
  activeCategorySlug?: string
  locale: string
}
```

Secciones:
1. **Hero** — fondo `bg-brand-navy`, `SectionHeading` con eyebrow/title/subtitle hardcoded en el template (usando `getTranslations("blog")` igual que la página actual)
2. **Filtro de categorías** — barra con "Todos" + una pastilla por categoría; cada una es `<Link href="?categoria=<slug>">` (o `href="/[locale]/blog"` para "Todos"); pastilla activa `bg-brand-navy text-white`, inactiva `bg-brand-light hover:bg-brand-blue/20`
3. **Grid de artículos** — 3 columnas en desktop, 1 en mobile; cada card muestra imagen, categoría (con color de badge), título, extracto, fecha, autor
4. **Empty state** — si `posts.length === 0`: mensaje "Próximamente" + CTA a servicios
5. **CTABanner** al final

### `BlogPostTemplate`

Props:
```typescript
interface BlogPostTemplateProps {
  post: BlogPostDetail
  locale: string
}
```

Secciones:
1. **Hero con imagen destacada** — imagen full-width con overlay oscuro, título del artículo encima, categorías como badges
2. **Meta bar** — fecha formateada, nombre del autor
3. **Cuerpo del artículo** — `<PortableText value={post.body?.[loc] ?? []} />` con componentes custom para `h2`, `h3`, `p`, links. Estilos consistentes con la tipografía del sitio (`font-heading`, `font-body`, colores de marca)
4. **CTABanner** al final

---

## i18n

- Rutas: `/es/blog`, `/en/blog`, `/es/blog/:slug`, `/en/blog/:slug`
- El mismo slug funciona en ambos idiomas (opción A acordada)
- Textos UI del listado (eyebrow, title, filtros) vienen de `messages/es.json` y `messages/en.json` bajo el namespace `blog` (ya existe)
- Contenido del artículo (título, extracto, body) se resuelve con `post.title[locale]`, `post.excerpt[locale]`, `post.body?.[locale]`

---

## Error Handling

| Caso | Comportamiento |
|---|---|
| Sin artículos publicados | Empty state con mensaje + CTA |
| Artículo no encontrado (slug inválido) | `notFound()` → 404 |
| Sanity retorna null | `notFound()` en detalle; empty state en listado |
| Sin imagen destacada | Placeholder con fondo `bg-brand-light` |
| Sin body en locale | `<PortableText value={[]} />` (no renderiza nada) |

---

## ISR y Build

- `export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600`
- `generateStaticParams` en `/blog/[slug]/page.tsx` pre-renderiza todos los artículos publicados
- `npm run build` debe pasar sin errores TypeScript
- Con 0 artículos en Sanity, `generateStaticParams` retorna `[]` (build pasa igual)

---

## Out of Scope

- Paginación (se puede añadir después)
- Búsqueda full-text
- Comentarios
- RSS feed
- Posts relacionados en la UI (el campo existe en schema pero no se renderiza en esta fase)
- Servicios relacionados en la UI (mismo caso)
- Filtro cliente-side / sin recarga
