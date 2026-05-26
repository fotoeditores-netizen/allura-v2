# SEO Dinámico y Configuración de Medición — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar SEO dinámico desde Sanity a todas las páginas e inyectar scripts de medición (GA4, GTM, Meta Pixel, etc.) de forma segura usando IDs validados por regex.

**Architecture:** Dos módulos ortogonales: (1) `generateMetadata` extendido con OG image global desde `siteSettings`, patrones uniformes en páginas de listado y legales; (2) `AnalyticsScripts` Server Component que lee `trackingScripts` de Sanity, valida cada ID con regex, y renderiza `next/script` solo para IDs válidos — GTM tiene precedencia sobre GA4 directo.

**Tech Stack:** Next.js 14 App Router · Sanity v3 · next/script · Zod-free regex validation · ISR revalidate 3600

---

## File Map

| Acción | Archivo | Responsabilidad |
|--------|---------|----------------|
| Modify | `src/sanity/schemaTypes/singletons/trackingScripts.ts` | Eliminar grupo `custom` y 3 campos de scripts libres |
| Modify | `src/sanity/lib/queries.ts` | +`trackingScriptsQuery`, +`TrackingScripts` type, ampliar `siteSettingsQuery` con `ogImage`, ampliar `SiteSettings` type |
| Create | `src/lib/getTrackingScripts.ts` | Helper ISR para fetchear `trackingScripts` de Sanity |
| Create | `src/components/analytics/AnalyticsScripts.tsx` | Server Component: valida IDs, renderiza `next/script` |
| Modify | `src/app/[locale]/layout.tsx` | `generateMetadata` desde Sanity + GSC + OG image; inyectar `<AnalyticsScripts />` |
| Modify | `src/app/[locale]/como-funciona/page.tsx` | Agregar OG image al `generateMetadata` existente |
| Modify | `src/app/[locale]/equipo/page.tsx` | Ídem |
| Modify | `src/app/[locale]/galeria/page.tsx` | Ídem |
| Modify | `src/app/[locale]/blog/page.tsx` | Ídem |
| Modify | `src/app/[locale]/contacto/page.tsx` | Ídem |
| Modify | `src/app/[locale]/politicas-de-privacidad/page.tsx` | `generateMetadata` desde `getSiteSettings` + robots noindex + OG image |
| Modify | `src/app/[locale]/terminos-y-condiciones/page.tsx` | Ídem |
| Modify | `src/app/[locale]/medical-disclaimer/page.tsx` | Ídem |
| Modify | `src/app/[locale]/accesibilidad/page.tsx` | Ídem |

---

## Task 1: Limpiar trackingScripts schema — eliminar campos de scripts libres

**Files:**
- Modify: `src/sanity/schemaTypes/singletons/trackingScripts.ts`

- [ ] **Step 1: Leer el archivo actual**

```
c:\Users\publi\Desktop\ALLURA\src\sanity\schemaTypes\singletons\trackingScripts.ts
```

Verificar que existen los campos: `customHeadScripts`, `customBodyStartScripts`, `customBodyEndScripts` y el grupo `custom`.

- [ ] **Step 2: Reemplazar el archivo completo sin los campos libres**

Escribir el archivo con este contenido exacto:

```typescript
import { defineType, defineField } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'

export const trackingScripts = defineType({
  name: 'trackingScripts',
  title: 'Scripts y analítica',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    { name: 'analytics', title: '📊 Analytics', default: true },
    { name: 'ads', title: '📣 Publicidad' },
    { name: 'heatmaps', title: '🔥 Mapas de calor' },
    { name: 'cookies', title: '🍪 Cookies' },
  ],
  fields: [
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics 4 — Measurement ID',
      type: 'string',
      group: 'analytics',
      description: 'Formato: G-XXXXXXXXXX',
      validation: (Rule) =>
        Rule.custom((val: string | undefined) => {
          if (!val) return true
          if (/^G-[A-Z0-9]+$/.test(val)) return true
          return 'Formato incorrecto. Debe ser G-XXXXXXXXXX'
        }),
    }),
    defineField({
      name: 'gtmContainerId',
      title: 'Google Tag Manager — Container ID',
      type: 'string',
      group: 'analytics',
      description: 'Formato: GTM-XXXXXXX',
      validation: (Rule) =>
        Rule.custom((val: string | undefined) => {
          if (!val) return true
          if (/^GTM-[A-Z0-9]+$/.test(val)) return true
          return 'Formato incorrecto. Debe ser GTM-XXXXXXX'
        }),
    }),
    defineField({
      name: 'googleSearchConsoleVerification',
      title: 'Google Search Console — Meta de verificación',
      type: 'string',
      group: 'analytics',
      description: 'Solo el código de verificación, sin etiquetas HTML.',
    }),
    defineField({
      name: 'metaPixelId',
      title: 'Meta (Facebook) Pixel ID',
      type: 'string',
      group: 'ads',
      validation: (Rule) =>
        Rule.custom((val: string | undefined) => {
          if (!val) return true
          if (/^\d+$/.test(val)) return true
          return 'El Pixel ID de Meta solo contiene números'
        }),
    }),
    defineField({
      name: 'googleAdsId',
      title: 'Google Ads — Conversion ID',
      type: 'string',
      group: 'ads',
      description: 'Formato: AW-XXXXXXXXXX',
    }),
    defineField({
      name: 'tiktokPixelId',
      title: 'TikTok Pixel ID',
      type: 'string',
      group: 'ads',
    }),
    defineField({
      name: 'hotjarId',
      title: 'Hotjar — Site ID',
      type: 'string',
      group: 'heatmaps',
    }),
    defineField({
      name: 'clarityId',
      title: 'Microsoft Clarity — Project ID',
      type: 'string',
      group: 'heatmaps',
    }),
    defineField({
      name: 'cookieConsentEnabled',
      title: 'Activar aviso de cookies',
      type: 'boolean',
      group: 'cookies',
      initialValue: false,
    }),
    defineField({
      name: 'cookieConsentText',
      title: 'Texto del aviso de cookies',
      type: 'object',
      group: 'cookies',
      hidden: ({ document }) => !document?.cookieConsentEnabled,
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 3, initialValue: 'Usamos cookies para mejorar tu experiencia.' },
        { name: 'en', title: 'English', type: 'text', rows: 3, initialValue: 'We use cookies to improve your experience.' },
      ],
    }),
    defineField({
      name: 'cookieConsentButtonLabel',
      title: 'Texto del botón "Aceptar"',
      type: 'object',
      group: 'cookies',
      hidden: ({ document }) => !document?.cookieConsentEnabled,
      fields: [
        { name: 'es', title: 'Español', type: 'string', initialValue: 'Aceptar' },
        { name: 'en', title: 'English', type: 'string', initialValue: 'Accept' },
      ],
    }),
    defineField({
      name: 'environment',
      title: 'Entorno activo',
      type: 'string',
      description: 'En "development" no se cargan scripts de analytics.',
      options: {
        list: [
          { title: 'Producción', value: 'production' },
          { title: 'Staging', value: 'staging' },
          { title: 'Desarrollo (scripts desactivados)', value: 'development' },
        ],
        layout: 'radio',
      },
      initialValue: 'production',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Scripts y analítica', subtitle: 'Google Analytics, GTM, Meta Pixel...' }
    },
  },
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
git add src/sanity/schemaTypes/singletons/trackingScripts.ts
git commit -m "feat(analytics): remove free-form script fields from trackingScripts schema"
```

---

## Task 2: Ampliar queries.ts — trackingScriptsQuery + ogImage en siteSettings

**Files:**
- Modify: `src/sanity/lib/queries.ts` (lines 4-43)

- [ ] **Step 1: Reemplazar `siteSettingsQuery` + `SiteSettings` type**

En `src/sanity/lib/queries.ts`, reemplazar el bloque de líneas 4-43 (desde `export const siteSettingsQuery` hasta el cierre de `interface SiteSettings`) con:

```typescript
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
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset->{ url }, alt }
    }
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
    metaTitle?: { es: string; en: string }
    metaDescription?: { es: string; en: string }
    ogImage?: { asset: { url: string }; alt?: string }
  }
}
```

- [ ] **Step 2: Agregar `trackingScriptsQuery` y `TrackingScripts` type**

Después del bloque `export type GlobalConfig = SiteSettings` (línea ~48), insertar:

```typescript
export const trackingScriptsQuery = groq`
  *[_type == "trackingScripts"][0] {
    googleAnalyticsId,
    gtmContainerId,
    googleSearchConsoleVerification,
    metaPixelId,
    googleAdsId,
    tiktokPixelId,
    hotjarId,
    clarityId,
    environment
  }
`

export interface TrackingScripts {
  googleAnalyticsId?: string
  gtmContainerId?: string
  googleSearchConsoleVerification?: string
  metaPixelId?: string
  googleAdsId?: string
  tiktokPixelId?: string
  hotjarId?: string
  clarityId?: string
  environment?: 'production' | 'staging' | 'development'
}
```

- [ ] **Step 3: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```powershell
git add src/sanity/lib/queries.ts
git commit -m "feat(seo): add trackingScriptsQuery + ogImage to siteSettingsQuery"
```

---

## Task 3: Crear getTrackingScripts helper

**Files:**
- Create: `src/lib/getTrackingScripts.ts`

- [ ] **Step 1: Crear el archivo**

```typescript
import { client } from '@/sanity/lib/client'
import { trackingScriptsQuery } from '@/sanity/lib/queries'
import type { TrackingScripts } from '@/sanity/lib/queries'

const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function getTrackingScripts(): Promise<TrackingScripts | null> {
  return client.fetch<TrackingScripts>(
    trackingScriptsQuery,
    {},
    { next: { revalidate } }
  )
}
```

- [ ] **Step 2: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```powershell
git add src/lib/getTrackingScripts.ts
git commit -m "feat(analytics): add getTrackingScripts helper"
```

---

## Task 4: Crear AnalyticsScripts Server Component

**Files:**
- Create: `src/components/analytics/AnalyticsScripts.tsx`

- [ ] **Step 1: Crear el directorio y el archivo**

Crear `src/components/analytics/AnalyticsScripts.tsx` con el siguiente contenido completo:

```typescript
import Script from 'next/script'
import { getTrackingScripts } from '@/lib/getTrackingScripts'

const GA_RE = /^G-[A-Z0-9]{4,12}$/
const GTM_RE = /^GTM-[A-Z0-9]{4,8}$/
const PIXEL_RE = /^\d{10,20}$/
const ADS_RE = /^AW-[0-9]{7,12}$/
const TIKTOK_RE = /^\d{15,25}$/
const HOTJAR_RE = /^\d{4,10}$/
const CLARITY_RE = /^[a-z0-9]{8,15}$/

function valid(value: string | undefined, re: RegExp): string | null {
  if (!value) return null
  return re.test(value) ? value : null
}

export async function AnalyticsScripts() {
  const tracking = await getTrackingScripts()

  if (!tracking || tracking.environment === 'development') return null

  const gtm = valid(tracking.gtmContainerId, GTM_RE)
  const ga = valid(tracking.googleAnalyticsId, GA_RE)
  const pixel = valid(tracking.metaPixelId, PIXEL_RE)
  const ads = valid(tracking.googleAdsId, ADS_RE)
  const tiktok = valid(tracking.tiktokPixelId, TIKTOK_RE)
  const hotjar = valid(tracking.hotjarId, HOTJAR_RE)
  const clarity = valid(tracking.clarityId, CLARITY_RE)

  return (
    <>
      {/* GTM — takes precedence over GA4 direct */}
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtm}');
        `}</Script>
      )}

      {/* GA4 direct — only when GTM is not configured */}
      {!gtm && ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga}');
          `}</Script>
        </>
      )}

      {/* Meta Pixel */}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixel}');
          fbq('track', 'PageView');
        `}</Script>
      )}

      {/* Google Ads */}
      {ads && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ads}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ads}');
          `}</Script>
        </>
      )}

      {/* TikTok Pixel */}
      {tiktok && (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${tiktok}');
            ttq.page();
          }(window, document, 'ttq');
        `}</Script>
      )}

      {/* Hotjar */}
      {hotjar && (
        <Script id="hotjar" strategy="lazyOnload">{`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjar},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}</Script>
      )}

      {/* Microsoft Clarity */}
      {clarity && (
        <Script id="clarity" strategy="lazyOnload">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarity}");
        `}</Script>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```powershell
git add src/components/analytics/AnalyticsScripts.tsx
git commit -m "feat(analytics): add AnalyticsScripts server component with ID validation"
```

---

## Task 5: Actualizar layout.tsx — generateMetadata desde Sanity + inyectar AnalyticsScripts

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Reemplazar el archivo completo**

El archivo actual está en `src/app/[locale]/layout.tsx`. Reemplazarlo con:

```typescript
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { PopupManager } from '@/components/ui/PopupManager'
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts'
import { client } from '@/sanity/lib/client'
import { activePromotionQuery, activePopupQuery } from '@/sanity/lib/queries'
import type { ActivePromotion, ActivePopup } from '@/sanity/lib/queries'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getTrackingScripts } from '@/lib/getTrackingScripts'
import '@/styles/globals.css'

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }]
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [settings, tracking] = await Promise.all([
    getSiteSettings(),
    getTrackingScripts(),
  ])
  const isEs = locale === 'es'
  const loc = locale as 'es' | 'en'

  const title =
    settings?.seo?.metaTitle?.[loc] ||
    (isEs
      ? 'Allura Healthcare — Turismo Médico en Medellín'
      : 'Allura Healthcare — Medical Tourism in Medellín')

  const description =
    settings?.seo?.metaDescription?.[loc] ||
    (isEs
      ? 'Allura es una marca colombiana de turismo médico en Medellín que integra tratamientos médicos, estéticos y odontológicos con la calidez y el disfrute de Colombia.'
      : 'Allura is a Colombian medical tourism brand in Medellín integrating premium dental and aesthetic treatments with the warmth of Colombia.')

  const ogImageUrl = settings?.seo?.ogImage?.asset?.url

  return {
    title,
    description,
    keywords: isEs
      ? ['turismo médico', 'Medellín', 'Colombia', 'salud', 'estética', 'odontología']
      : ['medical tourism', 'Medellín', 'Colombia', 'health', 'aesthetics', 'dentistry'],
    openGraph: {
      title,
      description,
      locale: isEs ? 'es_CO' : 'en_US',
      type: 'website',
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: settings?.seo?.ogImage?.alt || 'Allura Healthcare',
          },
        ],
      }),
    },
    alternates: {
      canonical: `https://allura.co/${locale}`,
      languages: {
        'es-CO': 'https://allura.co/es',
        en: 'https://allura.co/en',
      },
    },
    ...(tracking?.googleSearchConsoleVerification && {
      verification: { google: tracking.googleSearchConsoleVerification },
    }),
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

  const [messages, promotion, popup] = await Promise.all([
    getMessages(),
    client.fetch<ActivePromotion | null>(activePromotionQuery, {}, { next: { revalidate } }),
    client.fetch<ActivePopup | null>(activePopupQuery, {}, { next: { revalidate } }),
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
        <AnalyticsScripts />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```powershell
git add src/app/[locale]/layout.tsx
git commit -m "feat(seo): connect layout generateMetadata to Sanity + inject AnalyticsScripts"
```

---

## Task 6: Agregar OG image a páginas de listado (5 páginas)

**Files:**
- Modify: `src/app/[locale]/como-funciona/page.tsx`
- Modify: `src/app/[locale]/equipo/page.tsx`
- Modify: `src/app/[locale]/galeria/page.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`
- Modify: `src/app/[locale]/contacto/page.tsx`

Todas siguen el mismo patrón — agregar `getSiteSettings()` en paralelo con `getTranslations`, y extender el return de `generateMetadata` con `openGraph`.

- [ ] **Step 1: Actualizar `como-funciona/page.tsx`**

Leer el archivo actual. La función `generateMetadata` está en las líneas ~15-25. Reemplazarla por:

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'comoFunciona' }),
    getSiteSettings(),
  ])
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

Agregar el import de `getSiteSettings` al inicio del archivo:
```typescript
import { getSiteSettings } from '@/lib/getSiteSettings'
```

- [ ] **Step 2: Actualizar `equipo/page.tsx`**

Mismo patrón. Agregar `import { getSiteSettings } from '@/lib/getSiteSettings'`. Reemplazar `generateMetadata`:

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'equipo' }),
    getSiteSettings(),
  ])
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 3: Actualizar `galeria/page.tsx`**

Mismo patrón. Namespace: `'galeria'`.

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'galeria' }),
    getSiteSettings(),
  ])
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 4: Actualizar `blog/page.tsx`**

Mismo patrón. Namespace: `'blog'`.

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getSiteSettings(),
  ])
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 5: Actualizar `contacto/page.tsx`**

El archivo ya importa `getSiteSettings`. Solo modificar `generateMetadata`:

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'contacto' }),
    getSiteSettings(),
  ])
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 6: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 7: Commit**

```powershell
git add src/app/[locale]/como-funciona/page.tsx src/app/[locale]/equipo/page.tsx src/app/[locale]/galeria/page.tsx src/app/[locale]/blog/page.tsx src/app/[locale]/contacto/page.tsx
git commit -m "feat(seo): add OG image to listing page metadata"
```

---

## Task 7: Actualizar páginas legales — generateMetadata desde getSiteSettings

**Files:**
- Modify: `src/app/[locale]/politicas-de-privacidad/page.tsx`
- Modify: `src/app/[locale]/terminos-y-condiciones/page.tsx`
- Modify: `src/app/[locale]/medical-disclaimer/page.tsx`
- Modify: `src/app/[locale]/accesibilidad/page.tsx`

Todas ya importan `getSiteSettings` y ya son `async`. Solo se actualiza `generateMetadata` en cada una para usar Sanity con fallback + añadir `robots: noindex` + OG image.

- [ ] **Step 1: Actualizar `generateMetadata` en `politicas-de-privacidad/page.tsx`**

Reemplazar la función `generateMetadata` existente (líneas 4-16) con:

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const isEn = locale === 'en'
  const siteName = settings?.siteName || 'Allura Healthcare'
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = isEn
    ? `Privacy Policy | ${siteName}`
    : `Políticas de privacidad | ${siteName}`
  const description = isEn
    ? 'Privacy policy and personal data processing at Allura Healthcare.'
    : 'Política de privacidad y tratamiento de datos personales de Allura Healthcare.'
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 2: Actualizar `generateMetadata` en `terminos-y-condiciones/page.tsx`**

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const isEn = locale === 'en'
  const siteName = settings?.siteName || 'Allura Healthcare'
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = isEn
    ? `Terms and Conditions | ${siteName}`
    : `Términos y condiciones | ${siteName}`
  const description = isEn
    ? 'Terms and conditions of use for Allura Healthcare services.'
    : 'Términos y condiciones de uso de los servicios de Allura Healthcare.'
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 3: Actualizar `generateMetadata` en `medical-disclaimer/page.tsx`**

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const isEn = locale === 'en'
  const siteName = settings?.siteName || 'Allura Healthcare'
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = isEn
    ? `Medical Disclaimer | ${siteName}`
    : `Aviso médico | ${siteName}`
  const description = isEn
    ? 'Medical disclaimer and limitations of liability for Allura Healthcare.'
    : 'Aviso médico y limitaciones de responsabilidad de Allura Healthcare.'
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 4: Actualizar `generateMetadata` en `accesibilidad/page.tsx`**

```typescript
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const isEn = locale === 'en'
  const siteName = settings?.siteName || 'Allura Healthcare'
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url
  const title = isEn
    ? `Accessibility Statement | ${siteName}`
    : `Declaración de accesibilidad | ${siteName}`
  const description = isEn
    ? 'Accessibility statement and commitment to inclusive design at Allura Healthcare.'
    : 'Declaración de accesibilidad y compromiso con el diseño inclusivo de Allura Healthcare.'
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}
```

- [ ] **Step 5: Verificar TypeScript**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```powershell
git add src/app/[locale]/politicas-de-privacidad/page.tsx src/app/[locale]/terminos-y-condiciones/page.tsx src/app/[locale]/medical-disclaimer/page.tsx src/app/[locale]/accesibilidad/page.tsx
git commit -m "feat(seo): update legal pages generateMetadata with Sanity fallback and robots noindex"
```

---

## Task 8: Build final + verificación

**Files:** ninguno nuevo

- [ ] **Step 1: Build de producción**

```powershell
cd "c:\Users\publi\Desktop\ALLURA"
npx next build
```

Expected:
- 0 errores de compilación
- `src/app/api/contact` sigue listado como `ƒ (Dynamic)`
- Todas las páginas del locale `/es` y `/en` presentes
- No warnings de TypeScript

- [ ] **Step 2: Verificar metadata generada en dev**

```powershell
npx next dev
```

Abrir en browser:
- `http://localhost:3000/es` → `view-source:` o DevTools → verificar `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:image">` (vacío si no hay imagen configurada en Sanity — es correcto)
- `http://localhost:3000/es/politicas-de-privacidad` → verificar `<meta name="robots" content="noindex, nofollow">`
- `http://localhost:3000/es/como-funciona` → verificar `<title>` desde i18n

- [ ] **Step 3: Verificar que no hay scripts duplicados**

En DevTools → Network → filtrar por tipo `Script`:
- Si `gtmContainerId` no está configurado en Sanity: no debe aparecer ningún script de GTM/GA
- No debe haber dos instancias del mismo script

- [ ] **Step 4: Commit final (solo si no hay cambios pendientes)**

```powershell
git status
```

Si todo está limpio: no hay commit necesario.

---

## Ejemplos de metadata generada

### Homepage ES (con OG image configurada en Sanity)
```html
<title>Allura Healthcare — Turismo Médico en Medellín</title>
<meta name="description" content="Allura es una marca colombiana...">
<meta property="og:title" content="Allura Healthcare — Turismo Médico en Medellín">
<meta property="og:image" content="https://cdn.sanity.io/images/.../og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="es_CO">
<link rel="canonical" href="https://allura.co/es">
<link rel="alternate" hreflang="es-CO" href="https://allura.co/es">
<link rel="alternate" hreflang="en" href="https://allura.co/en">
```

### Página legal (politicas-de-privacidad ES)
```html
<title>Políticas de privacidad | Allura Healthcare</title>
<meta name="description" content="Política de privacidad y tratamiento de datos...">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="Políticas de privacidad | Allura Healthcare">
```

### Layout con GTM configurado (inspeccionado en body)
```html
<script id="gtm">(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

### Layout sin scripts configurados
```html
<!-- AnalyticsScripts renders null — ningún script inyectado -->
```

---

## Cómo probar metadata

**Opción 1 — view-source en browser:**
```
view-source:http://localhost:3000/es
```
Buscar: `<title>`, `<meta name="description">`, `<meta property="og:`.

**Opción 2 — curl:**
```powershell
curl -s http://localhost:3000/es | Select-String -Pattern "og:|description|title" | Select-Object -First 20
```

**Opción 3 — herramientas online (con sitio en producción):**
- [metatags.io](https://metatags.io) — preview de OG cards
- [opengraph.xyz](https://opengraph.xyz) — verifica OG tags
- Google Rich Results Test — verifica structured data

**Verificar scripts de analytics:**
- DevTools → Sources → buscar `gtag`, `fbq`, `ttq`
- DevTools → Network → filtrar "script" → verificar que solo cargan los configurados
