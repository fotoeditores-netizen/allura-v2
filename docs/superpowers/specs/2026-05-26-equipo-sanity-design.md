# Equipo — Sanity Integration Design Spec

**Fecha:** 2026-05-26  
**Proyecto:** Allura Healthcare  
**Rama:** feature/sanity-cms-v1

---

## Goal

Conectar la sección Equipo de Allura a Sanity CMS. La página `/equipo` muestra el grid de miembros desde el CMS con fallback al i18n hardcodeado. Cada miembro tiene perfil individual en `/equipo/[slug]` con bio completa PortableText bilingüe.

---

## Architecture

Mismo patrón establecido en el proyecto: thin page → template con datos Sanity opcionales + fallback hardcoded. Dos templates nuevos (`TeamListTemplate`, `TeamMemberTemplate`). `TeamCard` se extiende con props opcionales de Sanity manteniendo retrocompatibilidad total.

**Stack:** Next.js 14 App Router · next-intl · Sanity v3 / next-sanity@9 · GROQ · ISR (`revalidate=0` dev / `3600` prod) · `@portabletext/react`

---

## Schema (ya existe — sin modificar)

`teamMember.ts` ya está completo y registrado. Campos utilizados:

| Campo | Tipo | Uso |
|-------|------|-----|
| `name` | `string` | Nombre en card y perfil |
| `slug` | `slug` | URL del perfil `/equipo/[slug]` |
| `role` | `{ es, en }` | Cargo en card y perfil |
| `photo` | `image` con `alt: string` | Foto en card y hero del perfil |
| `shortBio` | `{ es, en }` | Bio corta (no se renderiza en card, sí en perfil) |
| `fullBio` | `localePortableText` (`{ es[], en[] }`) | Bio completa en perfil |
| `specialties[]` | `array<{ es, en }>` | → Sección "Enfoque" en card overlay |
| `credentials[]` | `array<string>` | → Sección "Formación" en card overlay |
| `linkedinUrl` | `url` | Link en perfil (opcional) |
| `order` | `number` | Orden ascendente en grid |
| `isActive` | `boolean` | Filtro en query |
| `isFeatured` | `boolean` | No usado en esta fase (para home) |

---

## GROQ Queries + TypeScript Types

**Archivo:** `src/sanity/lib/queries.ts` (append al final)

### Types nuevos

```typescript
export interface TeamMemberListItem {
  _id: string
  name: string
  slug: { current: string }
  role: LocaleString
  photo?: {
    asset: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } }
    alt?: string
  }
  specialties?: Array<{ es: string; en: string }>
  credentials?: string[]
}

export interface TeamMemberDetail {
  _id: string
  name: string
  slug: { current: string }
  role: LocaleString
  photo?: {
    asset: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } }
    alt?: string
  }
  shortBio?: LocaleString
  fullBio?: {
    es: import('@portabletext/types').PortableTextBlock[]
    en: import('@portabletext/types').PortableTextBlock[]
  }
  specialties?: Array<{ es: string; en: string }>
  credentials?: string[]
  linkedinUrl?: string
}
```

### Queries nuevas

**`teamMembersQuery`** — todos los activos ordenados:
```groq
*[_type == "teamMember" && isActive == true] | order(order asc, name asc) {
  _id,
  name,
  slug,
  role,
  photo { asset->{ _id, url, metadata { dimensions } }, alt },
  specialties[] { es, en },
  credentials
}
```

**`teamMemberBySlugQuery`** — perfil completo:
```groq
*[_type == "teamMember" && slug.current == $slug && isActive == true][0] {
  _id,
  name,
  slug,
  role,
  photo { asset->{ _id, url, metadata { dimensions } }, alt },
  shortBio,
  fullBio {
    es[] { ..., markDefs[] { ..., _type == "link" => { "href": href } } },
    en[] { ..., markDefs[] { ..., _type == "link" => { "href": href } } }
  },
  specialties[] { es, en },
  credentials,
  linkedinUrl
}
```

**`teamMemberSlugsQuery`** — para `generateStaticParams`:
```groq
*[_type == "teamMember" && isActive == true] { "slug": slug.current }
```

---

## TeamCard — Extensión (retrocompatible)

**Archivo:** `src/components/sections/TeamCard.tsx` (modificar)

Añadir props opcionales sin romper la interfaz existente:

```typescript
interface TeamCardProps {
  name: string
  specialty: string          // existente — fallback hardcoded
  image: string              // existente — imagen local fallback
  formacion: string[]        // existente — fallback hardcoded
  reconocimiento?: string[]  // existente — fallback hardcoded
  enfoque: string[]          // existente — fallback hardcoded
  bgLight?: boolean          // existente
  // Nuevas props opcionales de Sanity:
  sanityMember?: TeamMemberListItem
  locale?: string
  slug?: string              // para link al perfil
}
```

Lógica de resolución dentro del componente:
- `resolvedSpecialty` = `sanityMember?.role?.[loc]` || `specialty`
- `resolvedImage` = `sanityMember?.photo?.asset?.url` || `image`
- `resolvedFormacion` = `sanityMember?.credentials` (si non-empty) || `formacion`
- `resolvedEnfoque` = `sanityMember?.specialties?.map(s => s[loc])` (si non-empty) || `enfoque`
- Si `slug` prop presente → el card tiene `<Link href="/equipo/[slug]">` en el nombre

**Nota:** `TeamCard` es un `"use client"` component. Las props nuevas son pasadas desde el server component padre — no se hace fetch dentro de TeamCard.

---

## File Structure

### Nuevos archivos
```
src/components/templates/TeamListTemplate.tsx
src/components/templates/TeamMemberTemplate.tsx
src/app/[locale]/equipo/[slug]/page.tsx
```

### Archivos a modificar
```
src/sanity/lib/queries.ts          — append types + queries
src/components/sections/TeamCard.tsx — añadir props opcionales
src/app/[locale]/equipo/page.tsx   — reemplazar con versión Sanity
```

---

## Templates

### `TeamListTemplate` (async server component)

Props:
```typescript
interface TeamListTemplateProps {
  members: TeamMemberListItem[]  // vacío si Sanity sin datos
  locale: string
}
```

Secciones:
1. **Hero** — `bg-brand-navy`, `SectionHeading` con `t("heroEyebrow")`, `t("heroTitle")`, `t("heroSubtitle")`
2. **Grid** — 3 columnas. Si `members.length > 0`: usa datos Sanity pasados a `TeamCard` via `sanityMember`. Si vacío: usa el fallback hardcoded del i18n (array `members` + `teamImages` como hoy)
3. **Sección Certificaciones** — hardcoded del i18n (no cambia, igual que hoy)
4. **CTABanner**

### `TeamMemberTemplate` (sync server component)

Props:
```typescript
interface TeamMemberTemplateProps {
  member: TeamMemberDetail
  locale: string
}
```

Secciones:
1. **Hero** — foto del miembro con overlay de nombre y cargo. Sin foto: fondo `bg-brand-navy` sólido.
2. **Contenido principal** — dos columnas en desktop: izq. (specialties como lista, credentials como lista, LinkedIn si existe), der. (shortBio + fullBio con PortableText)
3. **Back link** — `<Link href="/equipo">` al inicio de la página
4. **CTABanner**

---

## Pages

### `/[locale]/equipo/page.tsx` — Listado

- `export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600`
- `generateMetadata` mantiene las mismas claves i18n (`equipo.metaTitle`, `equipo.metaDesc`)
- Fetch `teamMembersQuery`; si retorna vacío o null → pasa `members=[]` al template (template usa fallback)
- Renderiza `<TeamListTemplate members={members ?? []} locale={locale} />`

### `/[locale]/equipo/[slug]/page.tsx` — Perfil

- `generateStaticParams` — fetcha `teamMemberSlugsQuery`
- `generateMetadata` — usa `member.role[loc]` + `member.name` con fallback hardcoded
- Si member null → `notFound()`
- Renderiza `<TeamMemberTemplate member={member} locale={locale} />`

---

## Fallbacks

| Caso | Comportamiento |
|------|----------------|
| Sin miembros en Sanity | Grid usa hardcoded del i18n (6 miembros actuales) |
| Sin foto en Sanity | Imagen local `/images/equipo/...` (fallback por índice) |
| Perfil no encontrado | `notFound()` → 404 |
| Sin fullBio | Solo shortBio; si tampoco hay shortBio, sección vacía |
| Sin specialties/credentials | Fallback a props hardcoded del i18n |

---

## ISR y SEO

- `revalidate = 0` en dev, `3600` en prod
- `generateStaticParams` pre-renderiza todos los perfiles activos
- `generateMetadata` en perfil: `${member.name} — ${member.role[loc]} | Allura Healthcare`

---

## Out of Scope

- Filtro por departamento
- Páginas de perfiles en modo preview de Sanity
- `isFeatured` home section (fase posterior)
- Formulario de contacto directo al especialista
