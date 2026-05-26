# Trust Modules — Sanity Integration Design Spec

**Fecha:** 2026-05-26  
**Proyecto:** Allura Healthcare  
**Rama:** feature/sanity-cms-v1

---

## Goal

Conectar los módulos de confianza comercial (Testimonios, FAQ, Casos de éxito, Equipo) a Sanity CMS. Testimonios y FAQ aparecen en `/como-funciona`. Casos de éxito: solo verificar que el schema está registrado, sin UI. Equipo: ejecutar el plan ya escrito (`2026-05-26-equipo-sanity-integration.md`).

---

## Architecture

Mismo patrón establecido en el proyecto: thin page → async fetch desde Sanity → template con datos + fallback. La página `como-funciona/page.tsx` se convierte en async server component que fetcha en paralelo FAQs y Testimonios, y pasa los datos a `ComoFuncionaTemplate`. El template encapsula toda la UI actual (steps, FAQ, testimonios, CTA).

**Stack:** Next.js 14 App Router · next-intl · Sanity v3 / next-sanity@9 · GROQ · ISR (`revalidate=0` dev / `3600` prod) · `@portabletext/react`

---

## Scope

| Módulo | Acción |
|--------|--------|
| Testimonios | GROQ query + type + `TestimonialsCarousel` client component + sección en `ComoFuncionaTemplate` |
| FAQ | GROQ query + type + accordion con PortableText + fallback hardcoded del i18n |
| Casos de éxito | Verificar que `caseStudy` ya está registrado en `schemaTypes/index.ts` — **sin UI** |
| Equipo | Ejecutar plan `2026-05-26-equipo-sanity-integration.md` (Tasks 1–7) |

---

## Schema Sanity (sin modificar — todos ya existen y están registrados)

### `testimonial`
| Campo | Tipo | Uso |
|-------|------|-----|
| `patientName` | `string` | Nombre en card |
| `patientOrigin` | `{ es, en }` | Origen del paciente |
| `quote` | `{ es, en }` | Cita en carrusel |
| `rating` | `number` (1–5) | Estrellas |
| `photo` | `image` con `alt: string` | Avatar en card |
| `isApproved` | `boolean` | Filtro de seguridad |
| `publishedAt` | `datetime` | Orden secundario |
| `service` | ref → service | Etiqueta del servicio |

### `faq`
| Campo | Tipo | Uso |
|-------|------|-----|
| `question` | `{ es, en }` | Heading del acordeón |
| `answer` | `localePortableText` (`{ es[], en[] }`) | Cuerpo con PortableText |
| `order` | `number` | Orden ascendente |
| `isActive` | `boolean` | Filtro |

### `caseStudy`
Ya registrado en `schemaTypes/index.ts`. Sin cambios. Sin UI esta fase.

---

## GROQ Queries + TypeScript Types

**Archivo:** `src/sanity/lib/queries.ts` (append al final)

### Types nuevos

```typescript
export interface TestimonialItem {
  _id: string
  patientName: string
  patientOrigin?: { es?: string; en?: string }
  quote: { es: string; en: string }
  rating: number
  photo?: {
    asset: { url: string }
    alt?: string
  }
  service?: { title: LocaleString }
}

export interface FaqItem {
  _id: string
  question: LocaleString
  answer?: {
    es: import('@portabletext/types').PortableTextBlock[]
    en: import('@portabletext/types').PortableTextBlock[]
  }
}
```

### Queries nuevas

**`testimonialsQuery`** — aprobados, ordenados:
```groq
*[_type == "testimonial" && isApproved == true] | order(publishedAt desc) {
  _id,
  patientName,
  patientOrigin,
  quote,
  rating,
  photo { asset->{ url }, alt },
  "service": service->{ title }
}
```

**`faqsQuery`** — activas, ordenadas:
```groq
*[_type == "faq" && isActive == true] | order(order asc) {
  _id,
  question,
  answer {
    es[] { ..., markDefs[] { ..., _type == "link" => { "href": href } } },
    en[] { ..., markDefs[] { ..., _type == "link" => { "href": href } } }
  }
}
```

---

## TestimonialsCarousel Component

**Archivo:** `src/components/ui/TestimonialsCarousel.tsx`  
**Tipo:** `"use client"` component

Props:
```typescript
interface TestimonialsCarouselProps {
  testimonials: TestimonialItem[]
  locale: string
}
```

UI:
- Estado `activeIndex` con `useState`
- Botones prev/next (`ChevronLeft`, `ChevronRight` de lucide-react)
- Dots de navegación clickeables
- Por cada testimonial: foto (o avatar placeholder con inicial), nombre, origen localizado, estrellas (rating × ★), cita entre comillas, etiqueta del servicio
- Sin librería de carrusel externa — lógica pura React
- Accesibilidad: `aria-label` en botones, `role="group"` en cada slide

---

## ComoFuncionaTemplate

**Archivo:** `src/components/templates/ComoFuncionaTemplate.tsx`  
**Tipo:** async server component

Props:
```typescript
interface ComoFuncionaTemplateProps {
  testimonials: TestimonialItem[]
  faqs: FaqItem[]
  locale: string
}
```

Secciones (en orden):
1. **Hero** — idéntico al actual (`bg-brand-navy`, `SectionHeading`)
2. **Steps** — idéntico al actual (imágenes locales, i18n)
3. **FAQ** — Si `faqs.length > 0`: renders Sanity FAQs con PortableText accordion. Si vacío: fallback al array hardcoded del i18n. Mismo estilo visual: `bg-brand-light`, cards `bg-white`, `rounded-2xl`.
4. **Testimonios** — Solo se renderiza si `testimonials.length > 0`. `bg-white`, `SectionHeading` + `TestimonialsCarousel`.
5. **CTA** — idéntico al actual (WhatsApp + contacto)
6. **CTABanner**

**Nota de orden:** Testimonios va DESPUÉS de FAQ, antes del CTA — flujo lógico: proceso → preguntas → validación social → acción.

---

## Page: `/[locale]/como-funciona/page.tsx`

- `export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600`
- `generateMetadata` mantiene las mismas claves i18n (`comoFunciona.metaTitle`, `comoFunciona.metaDesc`)
- `Promise.all([client.fetch(testimonialsQuery), client.fetch(faqsQuery)])`
- Renderiza `<ComoFuncionaTemplate testimonials={...} faqs={...} locale={locale} />`

---

## File Structure

### Archivos a crear
```
src/components/ui/TestimonialsCarousel.tsx
src/components/templates/ComoFuncionaTemplate.tsx
```

### Archivos a modificar
```
src/sanity/lib/queries.ts             — append 2 types + 2 queries
src/app/[locale]/como-funciona/page.tsx — reemplazar con versión Sanity
```

### Archivos del plan de Equipo (plan ya escrito)
```
src/sanity/lib/queries.ts             — append team types + queries (Task 1)
src/components/sections/TeamCard.tsx  — optional Sanity props (Task 2)
src/components/templates/TeamListTemplate.tsx — crear (Task 3)
src/components/templates/TeamMemberTemplate.tsx — crear (Task 4)
src/app/[locale]/equipo/page.tsx      — reemplazar (Task 5)
src/app/[locale]/equipo/[slug]/page.tsx — crear (Task 6)
```

---

## Fallbacks

| Caso | Comportamiento |
|------|----------------|
| Sin testimonios en Sanity | Sección testimonios oculta completamente |
| Sin FAQs en Sanity | Muestra las 4 FAQs hardcodeadas del i18n |
| Sin foto en testimonio | Avatar con inicial del nombre (`bg-brand-light`, `text-brand-navy`) |
| FAQ sin answer PortableText | No renderiza body (solo heading) |

---

## ISR y accesibilidad

- `revalidate = 0` en dev, `3600` en prod
- Carrusel: `aria-label` en prev/next, `aria-current="true"` en dot activo
- Imágenes de testimonio: `alt` text del campo Sanity o `"Foto de {patientName}"`

---

## Out of Scope

- Página dedicada `/testimonios` o `/casos`
- UI de Casos de éxito
- Filtro de FAQ por categoría
- Animación de carrusel (solo cambio de índice)
- Formulario de contacto directo al especialista
