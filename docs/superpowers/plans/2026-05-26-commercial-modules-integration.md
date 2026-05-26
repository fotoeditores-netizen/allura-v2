# Commercial Modules — Sanity Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect Galería, Videos, Popup, and Promociones to Sanity CMS, adding a gallery page, a video section in `/como-funciona`, and layout-level Popup + PromoBanner components.

**Architecture:** Thin pages fetch from Sanity via GROQ and pass typed props to server/client templates — the same pattern used across all existing Sanity modules. PromoBanner is a server component injected before `<Header>` in `layout.tsx`; PopupManager is a `"use client"` component injected after `<Header>`. Gallery gets its own `/galeria` page. Videos appear as a new section in `ComoFuncionaTemplate`. The new `promotion` Sanity schema is created and registered before any frontend work.

**Tech Stack:** Next.js 14 App Router · next-intl · Sanity v3 / next-sanity@9 · GROQ · `@portabletext/react` · Tailwind CSS · ISR (`revalidate=0` dev / `3600` prod)

---

## File Structure

### New files
```
src/sanity/schemaTypes/documents/promotion.ts
src/components/templates/GalleryTemplate.tsx
src/components/ui/PopupManager.tsx
src/components/ui/PromoBanner.tsx
src/app/[locale]/galeria/page.tsx
```

### Modified files
```
src/sanity/schemaTypes/index.ts                         — import + register promotion
src/sanity/lib/queries.ts                               — append 4 types + 4 queries
src/app/[locale]/layout.tsx                             — add PromoBanner + PopupManager
src/components/templates/ComoFuncionaTemplate.tsx       — add VideoCard + videos section
messages/es.json                                        — add galeria namespace
messages/en.json                                        — add galeria namespace
```

---

## Task 1: Promotion Sanity Schema

**Files:**
- Create: `src/sanity/schemaTypes/documents/promotion.ts`
- Modify: `src/sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create the promotion schema file**

Create `src/sanity/schemaTypes/documents/promotion.ts` with this exact content:

```typescript
import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const promotion = defineType({
  name: 'promotion',
  title: 'Promoción',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre interno (no visible al paciente)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        { name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 2, validation: (Rule) => Rule.max(120) },
        { name: 'en', title: 'English', type: 'text', rows: 2, validation: (Rule) => Rule.max(120) },
      ],
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'ctaObject' }),
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
    defineField({ name: 'startDate', title: 'Fecha de inicio', type: 'datetime' }),
    defineField({ name: 'endDate', title: 'Fecha de fin', type: 'datetime' }),
    defineField({
      name: 'isActive',
      title: '🔴 Activo',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Menor número = mayor prioridad',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'name', active: 'isActive' },
    prepare({ title, active }) {
      return {
        title: `${active ? '🟢 ACTIVO' : '⚫'} ${title || 'Sin nombre'}`,
        subtitle: active ? 'Visible en el sitio' : 'Inactiva',
      }
    },
  },
})
```

- [ ] **Step 2: Register promotion in schemaTypes/index.ts**

Open `src/sanity/schemaTypes/index.ts`. It currently ends at line 56. Add the import after line 26 (after `import { popup }`) and add the registration before the closing `]`.

The file should look like this after editing:

```typescript
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
import { promotion } from './documents/promotion'

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
  promotion,
]
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```powershell
npx tsc --noEmit
```
Expected: no errors related to promotion.ts or index.ts.

- [ ] **Step 4: Commit**

```powershell
git add src/sanity/schemaTypes/documents/promotion.ts src/sanity/schemaTypes/index.ts
git commit -m "feat(sanity): add promotion schema and register in schemaTypes"
```

---

## Task 2: Append Types and Queries to queries.ts

**Files:**
- Modify: `src/sanity/lib/queries.ts` (append at end, currently ends at line 635)

- [ ] **Step 1: Append the 4 types and 4 queries**

Open `src/sanity/lib/queries.ts` and append the following block at the very end of the file (after line 635):

```typescript

// ─── Commercial Modules ───────────────────────────────────────────────────────

export interface GalleryItemData {
  _id: string
  title?: { es?: string; en?: string }
  category?: string
  isFeatured?: boolean
  image: {
    asset: {
      _id: string
      url: string
      metadata?: { dimensions?: { width: number; height: number } }
    }
    alt?: { es?: string; en?: string }
  }
}

export const galleryItemsQuery = groq`
  *[_type == "galleryItem" && (!defined($category) || category == $category)]
  | order(isFeatured desc, publishedAt desc) {
    _id,
    title,
    category,
    isFeatured,
    image {
      asset->{ _id, url, metadata { dimensions } },
      alt
    }
  }
`

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

export const videosQuery = groq`
  *[_type == "video"] | order(isFeatured desc, publishedAt desc) {
    _id,
    title,
    description,
    platform,
    videoId,
    thumbnail { asset->{ url }, alt },
    category,
    isFeatured
  }
`

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

export const activePopupQuery = groq`
  *[_type == "popup" && isActive == true][0] {
    _id,
    title,
    body,
    image { asset->{ url }, alt },
    cta,
    trigger,
    delaySeconds,
    showOnPages,
    startDate,
    endDate,
    frequency
  }
`

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

export const activePromotionQuery = groq`
  *[_type == "promotion" && isActive == true
    && (!defined(startDate) || startDate <= now())
    && (!defined(endDate) || endDate >= now())
  ] | order(order asc) [0] {
    _id,
    title,
    description,
    cta,
    bgColor,
    startDate,
    endDate
  }
`
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/sanity/lib/queries.ts
git commit -m "feat(sanity): add GalleryItemData, VideoItem, ActivePopup, ActivePromotion types and queries"
```

---

## Task 3: Add galeria i18n Namespace

**Files:**
- Modify: `messages/es.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add galeria namespace to es.json**

Open `messages/es.json`. Find the closing `}` of the top-level JSON object. Before it, add a `"galeria"` key (add a comma after the last existing key first):

```json
  "galeria": {
    "metaTitle": "Galería — Allura Healthcare",
    "metaDesc": "Conoce nuestra clínica, nuestro equipo y los resultados de nuestros pacientes en Medellín.",
    "heroEyebrow": "Galería",
    "heroTitle": "Nuestra clínica y resultados",
    "heroSubtitle": "Imágenes reales de nuestra clínica, nuestro equipo y los resultados de nuestros pacientes en Medellín.",
    "all": "Todos",
    "clinic": "Clínica",
    "team": "Equipo",
    "results": "Resultados",
    "medellin": "Medellín",
    "events": "Eventos",
    "empty": "Próximamente"
  }
```

- [ ] **Step 2: Add galeria namespace to en.json**

Open `messages/en.json`. Add before the closing `}`:

```json
  "galeria": {
    "metaTitle": "Gallery — Allura Healthcare",
    "metaDesc": "See our clinic, team, and patient results in Medellín.",
    "heroEyebrow": "Gallery",
    "heroTitle": "Our clinic and results",
    "heroSubtitle": "Real images of our clinic, team, and patient results in Medellín.",
    "all": "All",
    "clinic": "Clinic",
    "team": "Team",
    "results": "Results",
    "medellin": "Medellín",
    "events": "Events",
    "empty": "Coming soon"
  }
```

- [ ] **Step 3: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```powershell
git add messages/es.json messages/en.json
git commit -m "feat(i18n): add galeria namespace to es and en message files"
```

---

## Task 4: GalleryTemplate Component

**Files:**
- Create: `src/components/templates/GalleryTemplate.tsx`

- [ ] **Step 1: Create GalleryTemplate.tsx**

Create `src/components/templates/GalleryTemplate.tsx`:

```typescript
import Image from 'next/image'
import { Link } from '@/navigation'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getTranslations } from 'next-intl/server'
import type { GalleryItemData } from '@/sanity/lib/queries'

interface GalleryTemplateProps {
  items: GalleryItemData[]
  locale: string
  activeCategory?: string
}

const CATEGORIES = ['clinic', 'team', 'results', 'medellin', 'events'] as const

export async function GalleryTemplate({ items, locale, activeCategory }: GalleryTemplateProps) {
  const t = await getTranslations('galeria')
  const loc = locale as 'es' | 'en'

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t('heroEyebrow')}
          title={t('heroTitle')}
          subtitle={t('heroSubtitle')}
          centered
          light
        />
      </section>

      {/* Category filter */}
      <section className="bg-white py-8 px-6 md:px-12 border-b border-brand-light">
        <div className="container-allura">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/galeria"
              className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                !activeCategory
                  ? 'bg-brand-navy text-white'
                  : 'bg-brand-light text-brand-navy hover:bg-brand-navy/10'
              }`}
            >
              {t('all')}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/galeria?categoria=${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-navy text-white'
                    : 'bg-brand-light text-brand-navy hover:bg-brand-navy/10'
                }`}
              >
                {t(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          {items.length === 0 ? (
            <p className="text-center font-body text-brand-silver py-16">{t('empty')}</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {items.map((item) => {
                const altText =
                  item.image.alt?.[loc] ||
                  item.image.alt?.es ||
                  item.title?.[loc] ||
                  item.title?.es ||
                  ''
                const caption = item.title?.[loc] || item.title?.es
                const { width, height } = item.image.asset.metadata?.dimensions ?? {
                  width: 800,
                  height: 600,
                }
                return (
                  <div
                    key={item._id}
                    className="break-inside-avoid rounded-2xl overflow-hidden bg-white shadow-sm group"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.image.asset.url}
                        alt={altText}
                        width={width}
                        height={height}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {caption && (
                      <p className="px-4 py-3 font-body text-sm text-brand-navy">{caption}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/components/templates/GalleryTemplate.tsx
git commit -m "feat(gallery): add GalleryTemplate server component with category filter and masonry grid"
```

---

## Task 5: Gallery Page

**Files:**
- Create: `src/app/[locale]/galeria/page.tsx`

- [ ] **Step 1: Create the galeria page**

Create `src/app/[locale]/galeria/page.tsx`:

```typescript
import { client } from '@/sanity/lib/client'
import { galleryItemsQuery } from '@/sanity/lib/queries'
import type { GalleryItemData } from '@/sanity/lib/queries'
import { GalleryTemplate } from '@/components/templates/GalleryTemplate'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'galeria' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  }
}

export default async function GaleriaPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { categoria?: string }
}) {
  const activeCategory = searchParams.categoria ?? null

  const items = await client.fetch<GalleryItemData[]>(
    galleryItemsQuery,
    { category: activeCategory },
    { next: { revalidate } }
  )

  return (
    <GalleryTemplate
      items={items}
      locale={locale}
      activeCategory={activeCategory ?? undefined}
    />
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/app/[locale]/galeria/page.tsx
git commit -m "feat(gallery): add /galeria page with Sanity fetch and category filter via searchParams"
```

---

## Task 6: PromoBanner Server Component

**Files:**
- Create: `src/components/ui/PromoBanner.tsx`

- [ ] **Step 1: Create PromoBanner.tsx**

Create `src/components/ui/PromoBanner.tsx`:

```typescript
import { Link } from '@/navigation'
import type { ActivePromotion } from '@/sanity/lib/queries'

interface PromoBannerProps {
  promotion: ActivePromotion | null
  locale: string
}

const BG_CLASSES: Record<string, string> = {
  navy: 'bg-brand-navy text-white',
  blue: 'bg-brand-blue text-white',
  gold: 'bg-amber-600 text-white',
}

export function PromoBanner({ promotion, locale }: PromoBannerProps) {
  if (!promotion) return null

  const loc = locale as 'es' | 'en'
  const bg = BG_CLASSES[promotion.bgColor ?? 'navy'] ?? BG_CLASSES.navy
  const title = promotion.title[loc] || promotion.title.es
  const description = promotion.description?.[loc] || promotion.description?.es
  const ctaLabel = promotion.cta?.label?.[loc] || promotion.cta?.label?.es

  return (
    <div className={`py-2 px-4 text-center text-sm font-body ${bg}`}>
      <span className="font-semibold">{title}</span>
      {description && <span className="mx-2 opacity-90">{description}</span>}
      {promotion.cta?.url && ctaLabel && (
        <>
          {promotion.cta.openInNewTab ? (
            <a
              href={promotion.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 underline font-semibold hover:opacity-80 transition-opacity"
            >
              {ctaLabel}
            </a>
          ) : (
            <Link
              href={promotion.cta.url as `/${string}`}
              className="ml-3 underline font-semibold hover:opacity-80 transition-opacity"
            >
              {ctaLabel}
            </Link>
          )}
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/components/ui/PromoBanner.tsx
git commit -m "feat(promo): add PromoBanner server component with bgColor variants and CTA link"
```

---

## Task 7: PopupManager Client Component

**Files:**
- Create: `src/components/ui/PopupManager.tsx`

- [ ] **Step 1: Create PopupManager.tsx**

Create `src/components/ui/PopupManager.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import type { ActivePopup } from '@/sanity/lib/queries'

interface PopupManagerProps {
  popup: ActivePopup | null
  locale: string
}

const popupPortableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-sm text-brand-silver leading-relaxed mb-3 last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-brand-navy">{children}</strong>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-blue underline hover:text-brand-navy transition-colors"
      >
        {children}
      </a>
    ),
  },
}

export function PopupManager({ popup, locale }: PopupManagerProps) {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!popup) return

    // Validate date range
    const now = Date.now()
    if (popup.startDate && new Date(popup.startDate).getTime() > now) return
    if (popup.endDate && new Date(popup.endDate).getTime() < now) return

    // Validate page targeting
    if (popup.showOnPages && popup.showOnPages.length > 0) {
      const matches = popup.showOnPages.some((p) => pathname.includes(p))
      if (!matches) return
    }

    // Validate frequency
    const storageKey = `popup_seen_${popup._id}`
    if (popup.frequency === 'once') {
      if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) return
    } else if (popup.frequency === 'per-session') {
      if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) return
    }

    // Trigger
    if (popup.trigger === 'timed' && popup.delaySeconds) {
      const timer = setTimeout(() => setVisible(true), popup.delaySeconds * 1000)
      return () => clearTimeout(timer)
    } else {
      setVisible(true)
    }
  }, [popup, pathname])

  function handleClose() {
    setVisible(false)
    if (!popup) return
    const storageKey = `popup_seen_${popup._id}`
    if (popup.frequency === 'once') {
      localStorage.setItem(storageKey, '1')
    } else if (popup.frequency === 'per-session') {
      sessionStorage.setItem(storageKey, '1')
    }
  }

  if (!visible || !popup) return null

  const loc = locale as 'es' | 'en'
  const title = popup.title[loc] || popup.title.es
  const bodyBlocks = (popup.body?.[loc] ?? popup.body?.es ?? []) as PortableTextBlock[]
  const ctaLabel = popup.cta?.label?.[loc] || popup.cta?.label?.es
  const altText = popup.image?.alt?.[loc] || popup.image?.alt?.es || ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Cerrar popup"
          className="absolute top-4 right-4 text-brand-silver hover:text-brand-navy transition-colors text-xl font-bold leading-none"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="font-heading text-2xl text-brand-navy mb-4 pr-6">{title}</h2>

        {/* Optional image */}
        {popup.image?.asset?.url && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
            <Image
              src={popup.image.asset.url}
              alt={altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>
        )}

        {/* Body */}
        {bodyBlocks.length > 0 && (
          <div className="mb-6">
            <PortableText value={bodyBlocks} components={popupPortableTextComponents} />
          </div>
        )}

        {/* CTA */}
        {popup.cta?.url && ctaLabel && (
          <a
            href={popup.cta.url}
            target={popup.cta.openInNewTab ? '_blank' : '_self'}
            rel={popup.cta.openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={handleClose}
            className="block w-full text-center bg-brand-navy text-white font-body font-semibold py-3 px-6 rounded-xl hover:bg-brand-blue transition-colors"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/components/ui/PopupManager.tsx
git commit -m "feat(popup): add PopupManager client component with frequency/date/page validation and PortableText body"
```

---

## Task 8: Update layout.tsx with PromoBanner + PopupManager

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

The current layout (`src/app/[locale]/layout.tsx`) has no Sanity fetches. It will now fetch `activePromotionQuery` and `activePopupQuery` in parallel, then render `PromoBanner` before `<Header>` and `PopupManager` anywhere inside `<NextIntlClientProvider>` (after `<Footer>` is fine).

- [ ] **Step 1: Replace layout.tsx**

Replace the entire content of `src/app/[locale]/layout.tsx` with:

```typescript
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { PopupManager } from '@/components/ui/PopupManager'
import { client } from '@/sanity/lib/client'
import { activePromotionQuery, activePopupQuery } from '@/sanity/lib/queries'
import type { ActivePromotion, ActivePopup } from '@/sanity/lib/queries'
import '@/styles/globals.css'

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }]
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const isEs = locale === 'es'
  return {
    title: isEs
      ? 'Allura Healthcare — Turismo Médico en Medellín'
      : 'Allura Healthcare — Medical Tourism in Medellín',
    description: isEs
      ? 'Allura es una marca colombiana de turismo médico en Medellín que integra tratamientos médicos, estéticos y odontológicos con la calidez y el disfrute de Colombia.'
      : 'Allura is a Colombian medical tourism brand in Medellín integrating premium dental and aesthetic treatments with the warmth of Colombia.',
    keywords: isEs
      ? ['turismo médico', 'Medellín', 'Colombia', 'salud', 'estética', 'odontología']
      : ['medical tourism', 'Medellín', 'Colombia', 'health', 'aesthetics', 'dentistry'],
    openGraph: {
      title: 'Allura Healthcare',
      description: isEs
        ? 'Tu transformación comienza en Medellín'
        : 'Your transformation starts in Medellín',
      locale: isEs ? 'es_CO' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `https://allura.co/${locale}`,
      languages: {
        'es-CO': 'https://allura.co/es',
        en: 'https://allura.co/en',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const [messages, promotion, popup] = await Promise.all([
    getMessages(),
    client.fetch<ActivePromotion | null>(activePromotionQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600 } }),
    client.fetch<ActivePopup | null>(activePopupQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600 } }),
  ])

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PromoBanner promotion={promotion ?? null} locale={locale} />
          <Header />
          <main>{children}</main>
          <Footer />
          <PopupManager popup={popup ?? null} locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```powershell
git add src/app/[locale]/layout.tsx
git commit -m "feat(layout): inject PromoBanner and PopupManager with parallel Sanity fetches"
```

---

## Task 9: Videos Section in ComoFuncionaTemplate

**Files:**
- Modify: `src/components/templates/ComoFuncionaTemplate.tsx`

The current `ComoFuncionaTemplate` has props `{ testimonials, faqs, locale }`. We extend it to accept `videos: VideoItem[]` and add a VideoCard inline client component in the same file, then render the video grid section between the Testimonials section and the CTA.

`VideoCard` must be in a separate file because it uses `"use client"` and `ComoFuncionaTemplate` is a server component.

- [ ] **Step 1: Create VideoCard client component**

Create `src/components/ui/VideoCard.tsx`:

```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { VideoItem } from '@/sanity/lib/queries'

interface VideoCardProps {
  video: VideoItem
  locale: string
}

function getEmbedUrl(platform: string, videoId: string): string {
  if (platform === 'youtube') return `https://www.youtube.com/embed/${videoId}`
  if (platform === 'vimeo') return `https://player.vimeo.com/video/${videoId}`
  return ''
}

export function VideoCard({ video, locale }: VideoCardProps) {
  const [open, setOpen] = useState(false)
  const loc = locale as 'es' | 'en'

  const title = video.title[loc] || video.title.es
  const description = video.description?.[loc] || video.description?.es
  const thumbnailUrl = video.thumbnail?.asset?.url
  const altText = video.thumbnail?.alt?.[loc] || video.thumbnail?.alt?.es || title
  const embedUrl = getEmbedUrl(video.platform, video.videoId)
  const isInstagram = video.platform === 'instagram'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm group">
      {/* Thumbnail / Player */}
      <div className="relative aspect-video bg-brand-navy overflow-hidden">
        {open && embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => !isInstagram && setOpen(true)}
            aria-label={`Ver video: ${title}`}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={altText}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-navy/80" />
            )}
            {isInstagram ? (
              <a
                href={`https://www.instagram.com/p/${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 bg-white/90 rounded-full px-4 py-2 text-brand-navy text-sm font-body font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                Ver en Instagram ↗
              </a>
            ) : (
              <span className="relative z-10 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-brand-navy ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-heading text-base text-brand-navy mb-1 line-clamp-2">{title}</h3>
        {description && (
          <p className="font-body text-sm text-brand-silver line-clamp-2">{description}</p>
        )}
        {video.category && (
          <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-brand-light text-brand-navy text-xs font-body">
            {video.category}
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update ComoFuncionaTemplate to accept videos prop and render the section**

Open `src/components/templates/ComoFuncionaTemplate.tsx`.

Add `VideoItem` to the existing import from `@/sanity/lib/queries`:
```typescript
import type { TestimonialItem, FaqItem, VideoItem } from '@/sanity/lib/queries'
```

Add the `VideoCard` import after the existing imports:
```typescript
import { VideoCard } from '@/components/ui/VideoCard'
```

Extend the props interface (currently at line ~48):
```typescript
interface ComoFuncionaTemplateProps {
  testimonials: TestimonialItem[]
  faqs: FaqItem[]
  videos: VideoItem[]
  locale: string
}
```

Update the function signature:
```typescript
export async function ComoFuncionaTemplate({
  testimonials,
  faqs,
  videos,
  locale,
}: ComoFuncionaTemplateProps) {
```

Add `const hasVideos = videos.length > 0` alongside the existing booleans (`hasSanityFaqs`, `hasTestimonials`).

Add the videos section **after the Testimonios section and before the CTA section**. Find the `{/* CTA */}` comment and insert this block before it:

```typescript
      {/* Videos */}
      {hasVideos && (
        <section className="section-padding bg-brand-light">
          <div className="container-allura">
            <SectionHeading
              eyebrow={locale === 'en' ? 'Watch' : 'Ver'}
              title={locale === 'en' ? 'Videos' : 'Videos'}
              centered
            />
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
```

- [ ] **Step 3: Update the como-funciona page to also fetch videos**

Open `src/app/[locale]/como-funciona/page.tsx`.

Add `videosQuery` and `VideoItem` to the import from `@/sanity/lib/queries`.

Change the `Promise.all` fetch to include videos:
```typescript
const [testimonials, faqs, videos] = await Promise.all([
  client.fetch<TestimonialItem[]>(testimonialsQuery, {}, { next: { revalidate } }),
  client.fetch<FaqItem[]>(faqsQuery, {}, { next: { revalidate } }),
  client.fetch<VideoItem[]>(videosQuery, {}, { next: { revalidate } }),
])
```

Pass `videos` to the template:
```typescript
return (
  <ComoFuncionaTemplate
    testimonials={testimonials}
    faqs={faqs}
    videos={videos}
    locale={locale}
  />
)
```

- [ ] **Step 4: Verify TypeScript compiles**

```powershell
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```powershell
git add src/components/ui/VideoCard.tsx src/components/templates/ComoFuncionaTemplate.tsx src/app/[locale]/como-funciona/page.tsx
git commit -m "feat(videos): add VideoCard client component and videos section to ComoFuncionaTemplate"
```

---

## Task 10: Final Build Verification

**Files:** no new files — verification only.

- [ ] **Step 1: Delete .next cache**

```powershell
Remove-Item -Recurse -Force .next
```

- [ ] **Step 2: Run production build**

```powershell
npm run build
```
Expected output:
- No TypeScript errors
- No "Module not found" errors
- All routes compile (including `/[locale]/galeria`)
- Route `/[locale]/como-funciona` shows no errors
- Build completes with "Route (app)" table showing all pages

- [ ] **Step 3: Start dev server and verify visually**

```powershell
npm run dev
```

Open the following URLs in a browser and verify:

| URL | Expected |
|-----|----------|
| `http://localhost:3000/es/galeria` | Hero + filter pills + empty state "Próximamente" (no Sanity items yet) |
| `http://localhost:3000/en/galeria` | Same in English |
| `http://localhost:3000/es/como-funciona` | All sections including videos (empty = no videos section shown) |
| `http://localhost:3000/es` (any page) | No PromoBanner (no active promotion) — layout unchanged visually |

- [ ] **Step 4: Commit if any last-minute fixes were needed**

If any runtime issue required a small fix, commit it:
```powershell
git add -A
git commit -m "fix(commercial-modules): address build/runtime issues"
```

---

## Self-Review Checklist

### Spec Coverage

| Spec requirement | Covered by task |
|-----------------|-----------------|
| `promotion.ts` schema (name, title, desc, cta, bgColor, startDate, endDate, isActive, order) | Task 1 |
| Register promotion in schemaTypes/index.ts | Task 1 |
| GalleryItemData type + galleryItemsQuery | Task 2 |
| VideoItem type + videosQuery | Task 2 |
| ActivePopup type + activePopupQuery | Task 2 |
| ActivePromotion type + activePromotionQuery | Task 2 |
| galeria i18n namespace (es + en) | Task 3 |
| GalleryTemplate: Hero, filter pills, masonry grid, next/image with sizes, empty state | Task 4 |
| /galeria page: revalidate, generateMetadata, searchParams for category | Task 5 |
| PromoBanner: server component, bgColor variants, title+desc+CTA, null → return null | Task 6 |
| PopupManager: "use client", date range, page targeting, frequency (once/per-session/always), on-load + timed, PortableText body, no dangerouslySetInnerHTML | Task 7 |
| layout.tsx: Promise.all fetch, PromoBanner before Header, PopupManager inside provider | Task 8 |
| VideoCard: "use client", lazy iframe (only mounts on click), Instagram link-only fallback, embed URL from platform+videoId | Task 9 Step 1 |
| ComoFuncionaTemplate: videos prop + videos section before CTA | Task 9 Step 2 |
| como-funciona page: fetches videosQuery in parallel | Task 9 Step 3 |
| Build clean + local verification | Task 10 |

### Security Checklist

- ✅ Video iframe `src` constructed from `platform` enum + `videoId` only — never from a free URL field
- ✅ Popup body rendered with `<PortableText>` — never `dangerouslySetInnerHTML`
- ✅ Popup CTA uses `popup.cta.url` from schema (validated as URL) — no eval, no inline scripts
- ✅ PromoBanner CTA: external links use `target="_blank" rel="noopener noreferrer"`; internal use `<Link>`
- ✅ `next/image` used for all images (Gallery, Popup, VideoCard thumbnails)
