# Services Sanity Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing 4 service category pages and 24 sub-service detail pages to Sanity CMS content, with full ES/EN bilingual support and safe hardcoded fallbacks.

**Architecture:** Add GROQ queries and TypeScript types for `serviceCategory` and `service` documents; refactor the 4 category `page.tsx` files and `ServiceCategoryTemplate` to accept optional Sanity data; refactor the 24 sub-service `page.tsx` files and `ServiceDetailTemplate` to accept optional Sanity data. The existing hardcoded `contentEs`/`contentEn` objects become fallbacks when Sanity returns null. All pages remain async server components (`page.tsx`) and pass data down to templates as props. No new routes are created — existing slugs are preserved exactly as-is.

**Tech Stack:** Next.js 14 App Router, Sanity v3 / next-sanity@9, GROQ, next-intl, TypeScript, Framer Motion (client templates — no change needed)

---

## Codebase Context (read before implementing any task)

### Route structure (do NOT change slugs)
```
src/app/[locale]/servicios/
├── page.tsx                              ← main listing (already done)
├── full-mouth-reconstruction/page.tsx    ← category page
│   ├── implantes-unitarios/page.tsx
│   ├── implantes-all-on-x/page.tsx
│   ├── rehabilitacion-oral-completa/page.tsx
│   ├── protesis-fijas/page.tsx
│   ├── reemplazo-restauraciones/page.tsx
│   └── planificacion-digital-3d/page.tsx
├── smile-makeover/page.tsx
│   ├── carillas-porcelana/page.tsx
│   ├── diseno-digital-sonrisa/page.tsx
│   ├── coronas-porcelana/page.tsx
│   ├── restauraciones-esteticas/page.tsx
│   └── blanqueamiento-dental/page.tsx
├── aligners/page.tsx
│   ├── invisalign/page.tsx
│   ├── alineadores-transparentes/page.tsx
│   ├── escaneo-digital-3d/page.tsx
│   ├── planificacion-personalizada/page.tsx
│   └── seguimiento-remoto/page.tsx
└── facial-harmony/page.tsx
    ├── evaluacion-facial/page.tsx
    ├── toxina-botulinica/page.tsx
    ├── bioestimuladores/page.tsx
    ├── blefaroplastia/page.tsx
    ├── rinoplastia/page.tsx
    ├── lifting-facial/page.tsx
    ├── mentoplastia/page.tsx
    └── cirugia-maxilofacial/page.tsx
```

### Slug → Sanity category title mapping
These are the hardcoded route slugs that must match `serviceCategory.slug.current` in Sanity:
- `full-mouth-reconstruction` → "Full Mouth Reconstruction"
- `smile-makeover` → "Smile Makeover"  
- `aligners` → "Aligners"
- `facial-harmony` → "Facial Harmony"

### Key files already in place
- `src/sanity/lib/client.ts` — Sanity client (uses env vars)
- `src/sanity/lib/queries.ts` — existing `homePageQuery`, `siteSettingsQuery`; add service queries here
- `src/sanity/schemaTypes/documents/service.ts` — schema exists, fields: `title{es,en}`, `slug`, `category` (ref), `shortDescription{es,en}`, `body` (localePortableText), `benefits[]`, `process[]` (processStep objects), `ctaBanner`, `coverImage` (image + alt{es,en}), `gallery[]`, `faqs[]` (ref), `relatedServices[]` (ref), `testimonials[]` (ref), `seo` (seoObject), `publishedAt`, `isActive`
- `src/sanity/schemaTypes/documents/serviceCategory.ts` — schema exists, fields: `title{es,en}`, `slug`, `description{es,en}`, `icon`, `coverImage` (image + alt{es,en}), `order`, `seo`
- `src/sanity/schemaTypes/objects/processStep.ts` — object type, fields: `stepNumber` (string), `title{es,en}`, `description{es,en}`, `image`, `duration{es,en}`
- `src/components/templates/ServiceCategoryTemplate.tsx` — server async component, currently takes hardcoded props; extend with optional `sanityData`
- `src/components/templates/ServiceDetailTemplate.tsx` — server async component, currently takes hardcoded props; extend with optional `sanityData`
- `src/app/[locale]/page.tsx` — home page (done, do not touch)

### Pattern used in home page (follow exactly)
```typescript
// page.tsx (server component)
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const data = await client.fetch<Type | null>(query, {}, { next: { revalidate } })
  const locale = params.locale as "es" | "en"
  const title = data?.seo?.metaTitle?.[locale] ?? "fallback"
  return { title, description: ... }
}

export default async function Page({ params }: { params: { locale: string } }) {
  const data = await client.fetch<Type | null>(query, {}, { next: { revalidate } })
  return <Template sanityData={data ?? undefined} locale={params.locale} />
}
```

### seoObject fields (used in queries)
```
seo {
  metaTitle { es, en },
  metaDescription { es, en },
  ogImage { asset->{ _id, url, metadata { dimensions } } },
  noIndex,
  canonicalUrl
}
```

### processStep object fields (used in service.process[])
```
stepNumber, title { es, en }, description { es, en }, image { ... }, duration { es, en }
```

---

## Task 1: Add service GROQ queries and TypeScript types

**Files:**
- Modify: `src/sanity/lib/queries.ts`

### What to add

Add these exports after the existing `homePageQuery` export (line 225+). Do NOT modify existing exports.

- [ ] **Step 1: Open queries.ts and append the following TypeScript types**

```typescript
// ─── Service Category ────────────────────────────────────────────────────────

export interface ServiceCategoryData {
  _id: string
  title: LocaleString
  slug: { current: string }
  description: LocaleString
  icon?: string
  coverImage?: SanityImageLocaleAlt
  order?: number
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    noIndex?: boolean
    canonicalUrl?: string
  }
  services?: ServiceListItem[]
}

export interface ServiceListItem {
  _id: string
  title: LocaleString
  slug: { current: string }
  shortDescription: LocaleString
  coverImage?: SanityImageLocaleAlt
}

// ─── Service Detail ───────────────────────────────────────────────────────────

export interface ServiceProcessStep {
  stepNumber?: string
  title: LocaleString
  description: LocaleString
  duration?: LocaleString
}

export interface ServiceBenefit {
  icon?: string
  title: LocaleString
  description: LocaleString
}

export interface ServiceDetailData {
  _id: string
  title: LocaleString
  slug: { current: string }
  shortDescription: LocaleString
  body?: unknown  // localePortableText — not rendered in this phase
  benefits?: ServiceBenefit[]
  process?: ServiceProcessStep[]
  coverImage?: SanityImageLocaleAlt
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    noIndex?: boolean
    canonicalUrl?: string
  }
  category?: {
    title: LocaleString
    slug: { current: string }
  }
}
```

- [ ] **Step 2: Append the GROQ queries**

```typescript
// ─── GROQ Queries ─────────────────────────────────────────────────────────────

export const serviceCategoryBySlugQuery = groq`
  *[_type == "serviceCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    coverImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    order,
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset->{ _id, url, metadata { dimensions } } },
      noIndex,
      canonicalUrl
    },
    "services": *[_type == "service" && category._ref == ^._id && isActive == true] | order(title.es asc) {
      _id,
      title,
      slug,
      shortDescription,
      coverImage {
        asset->{ _id, url, metadata { dimensions } },
        alt
      }
    }
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    slug,
    shortDescription,
    benefits[] {
      icon,
      title,
      description
    },
    process[] {
      stepNumber,
      title,
      description,
      duration
    },
    coverImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset->{ _id, url, metadata { dimensions } } },
      noIndex,
      canonicalUrl
    },
    "category": category-> {
      title,
      slug
    }
  }
`
```

- [ ] **Step 3: Verify the file compiles — run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors in `src/sanity/lib/queries.ts`

- [ ] **Step 4: Commit**

```bash
git add src/sanity/lib/queries.ts
git commit -m "feat(sanity): add serviceCategory and service GROQ queries and types"
```

---

## Task 2: Extend ServiceCategoryTemplate to accept optional Sanity data

**Files:**
- Modify: `src/components/templates/ServiceCategoryTemplate.tsx`

The template currently receives hardcoded props. We add an optional `sanityData` prop and a `locale` prop, then use Sanity values when available, falling back to the existing hardcoded props.

- [ ] **Step 1: Replace the file content with the following**

```typescript
import { Link } from "@/navigation";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";
import type { ServiceCategoryData } from "@/sanity/lib/queries";

const WHATSAPP_URL =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

export interface SubService {
  slug: string;
  name: string;
  description: string;
}

interface ServiceCategoryTemplateProps {
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  categorySlug: string;
  heroImage: string;
  subServices: SubService[];
  sanityData?: ServiceCategoryData;
  locale?: string;
}

export async function ServiceCategoryTemplate({
  title,
  eyebrow,
  subtitle,
  description,
  categorySlug,
  heroImage,
  subServices,
  sanityData,
  locale = "es",
}: ServiceCategoryTemplateProps) {
  const t = await getTranslations("serviceTemplate");
  const loc = locale as "es" | "en";

  const resolvedTitle = sanityData?.title?.[loc] || title;
  const resolvedDescription = sanityData?.description?.[loc] || description;

  const resolvedHeroImage =
    sanityData?.coverImage?.asset?.url || heroImage;

  const resolvedSubServices: SubService[] =
    sanityData?.services && sanityData.services.length > 0
      ? sanityData.services.map((s) => ({
          slug: s.slug.current,
          name: s.title?.[loc] || s.slug.current,
          description: s.shortDescription?.[loc] || "",
        }))
      : subServices;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${resolvedHeroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/60 to-brand-navy/85" />
        <div className="relative z-10 container-allura px-6 md:px-12 text-center">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-blue mb-4">{eyebrow}</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 max-w-3xl mx-auto">
            {resolvedTitle}
          </h1>
          <p className="font-body text-base md:text-lg text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
          >
            {t("whatsapp")}
          </a>
        </div>
      </section>

      {/* Description */}
      <section className="section-padding bg-white">
        <div className="container-allura max-w-3xl">
          <p className="font-body text-lg text-brand-silver leading-relaxed">{resolvedDescription}</p>
        </div>
      </section>

      {/* Sub-services grid */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          <SectionHeading
            eyebrow={t("treatmentsLabel")}
            title={t("treatmentsTitle")}
            subtitle={t("treatmentsSubtitle")}
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {resolvedSubServices.map(({ slug, name, description: desc }, i) => (
              <Link
                key={slug}
                href={`/servicios/${categorySlug}/${slug}`}
                className={`group flex flex-col ${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'} rounded-2xl p-7 shadow-sm border border-brand-navy/20 hover:shadow-md hover:border-brand-blue/40 transition-all duration-200`}
              >
                <h3 className="font-heading text-xl text-brand-navy mb-3 group-hover:text-brand-blue transition-colors">
                  {name}
                </h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed flex-1 mb-5">{desc}</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 font-body text-sm text-[#eaeeef] bg-brand-navy px-6 py-[10px] rounded transition-all duration-300 ease-out group-hover:bg-brand-blue group-hover:text-white">
                    {t("learnMore")} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/components/templates/ServiceCategoryTemplate.tsx
git commit -m "feat(sanity): extend ServiceCategoryTemplate with optional Sanity data prop"
```

---

## Task 3: Extend ServiceDetailTemplate to accept optional Sanity data

**Files:**
- Modify: `src/components/templates/ServiceDetailTemplate.tsx`

- [ ] **Step 1: Replace the file content with the following**

```typescript
import { Link } from "@/navigation";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";
import type { ServiceDetailData } from "@/sanity/lib/queries";

const WHATSAPP_URL =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

interface Step {
  title: string;
  description: string;
}

interface ServiceDetailTemplateProps {
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  benefits: string[];
  steps: Step[];
  candidates: string[];
  timeline: string;
  specialty: "odontologia" | "facial";
  sanityData?: ServiceDetailData;
  locale?: string;
}

export async function ServiceDetailTemplate({
  category,
  categorySlug,
  title,
  description,
  benefits,
  steps,
  candidates,
  timeline,
  sanityData,
  locale = "es",
}: ServiceDetailTemplateProps) {
  const t = await getTranslations("serviceDetail");
  const loc = locale as "es" | "en";

  const resolvedTitle = sanityData?.title?.[loc] || title;
  const resolvedDescription = sanityData?.shortDescription?.[loc] || description;
  const resolvedCategory =
    sanityData?.category?.title?.[loc] || category;
  const resolvedCategorySlug =
    sanityData?.category?.slug?.current || categorySlug;

  const resolvedBenefits: string[] =
    sanityData?.benefits && sanityData.benefits.length > 0
      ? sanityData.benefits.map((b) => b.title?.[loc] || "")
      : benefits;

  const resolvedSteps: Step[] =
    sanityData?.process && sanityData.process.length > 0
      ? sanityData.process.map((s) => ({
          title: s.title?.[loc] || "",
          description: s.description?.[loc] || "",
        }))
      : steps;

  return (
    <>
      {/* Hero with breadcrumb */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12">
        <div className="container-allura">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-body text-xs text-white/50 mb-8">
            <Link href="/servicios" className="hover:text-white transition-colors">{t("breadcrumbServices")}</Link>
            <ChevronRight size={12} />
            <Link href={`/servicios/${resolvedCategorySlug}`} className="hover:text-white transition-colors">{resolvedCategory}</Link>
            <ChevronRight size={12} />
            <span className="text-white/70">{resolvedTitle}</span>
          </nav>

          <div className="max-w-2xl">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">{resolvedCategory}</p>
            <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">{resolvedTitle}</h1>
            <p className="font-body text-base text-white/70 leading-relaxed mb-10">{resolvedDescription}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              {t("whatsapp")}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <SectionHeading eyebrow={t("benefitsLabel")} title={t("benefitsTitle")} />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {resolvedBenefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                <p className="font-body text-sm text-brand-navy leading-relaxed">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          <SectionHeading eyebrow={t("processLabel")} title={t("processTitle")} centered />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {resolvedSteps.map(({ title: stepTitle, description: stepDesc }, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-brand-light">
                <p className="font-heading text-3xl text-brand-blue/25 mb-3">0{i + 1}</p>
                <h3 className="font-heading text-lg text-brand-navy mb-2">{stepTitle}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{stepDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidates + Timeline */}
      <section className="section-padding bg-white">
        <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-14">
          <div>
            <SectionHeading eyebrow={t("candidatesLabel")} title={t("candidatesTitle")} />
            <ul className="mt-8 space-y-3">
              {candidates.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                  <p className="font-body text-sm text-brand-navy">{c}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow={t("timelineLabel")} title={t("timelineTitle")} />
            <div className="mt-8 bg-brand-light rounded-2xl p-7">
              <p className="font-body text-base text-brand-navy leading-relaxed">{timeline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Allura */}
      <section className="section-padding bg-brand-navy">
        <div className="container-allura text-center max-w-2xl mx-auto">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">{t("whyLabel")}</p>
          <h2 className="font-heading text-3xl text-white mb-6">
            {t("whyTitle")}
          </h2>
          <p className="font-body text-brand-silver leading-relaxed mb-10">
            {t("whyBody")}
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
          >
            {t("whatsapp")}
          </a>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/components/templates/ServiceDetailTemplate.tsx
git commit -m "feat(sanity): extend ServiceDetailTemplate with optional Sanity data prop"
```

---

## Task 4: Connect the 4 category page.tsx files to Sanity

**Files:**
- Modify: `src/app/[locale]/servicios/full-mouth-reconstruction/page.tsx`
- Modify: `src/app/[locale]/servicios/smile-makeover/page.tsx`
- Modify: `src/app/[locale]/servicios/aligners/page.tsx`
- Modify: `src/app/[locale]/servicios/facial-harmony/page.tsx`

Each category page follows the same pattern. The full replacement for each is shown below.

### 4a — full-mouth-reconstruction/page.tsx

- [ ] **Step 1: Replace full content of `src/app/[locale]/servicios/full-mouth-reconstruction/page.tsx`**

```typescript
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceCategoryBySlugQuery, type ServiceCategoryData } from "@/sanity/lib/queries";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const CATEGORY_SLUG = "full-mouth-reconstruction";

const contentEs = {
  title: "Allura Full Mouth Reconstruction™",
  eyebrow: "Odontología Integral",
  subtitle: "Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura.",
  description: "Para pacientes que han perdido piezas, presentan deterioro severo o necesitan una rehabilitación completa, diseñamos un plan integral respaldado por tecnología 3D de última generación y un equipo de especialistas altamente certificados. Cada caso es único y cada plan es hecho a medida.",
  heroImage: "/images/imagenes_web/Allura-Full-Mouth-Reconstruction.jpg",
  subServices: [
    { slug: "implantes-unitarios", name: "Implantes Unitarios y Múltiples", description: "Reemplazo de una o varias piezas dentales con implantes de titanio de alta precisión, integrados para durar toda la vida." },
    { slug: "implantes-all-on-x", name: "Implantes All-on-X", description: "Solución completa para pacientes con pérdida total o casi total de piezas: una arcada completa fija sobre 4 o 6 implantes estratégicamente ubicados." },
    { slug: "rehabilitacion-oral-completa", name: "Rehabilitación Oral Completa", description: "Tratamiento integral que restaura función masticatoria, estética y salud periodontal para casos de deterioro severo o múltiple." },
    { slug: "protesis-fijas", name: "Prótesis Fijas sobre Implantes", description: "Coronas y puentes de porcelana fijados permanentemente sobre implantes. Aspecto natural, resistencia total y funcionalidad completa." },
    { slug: "reemplazo-restauraciones", name: "Reemplazo de Restauraciones Fallidas", description: "Evaluación y sustitución de restauraciones antiguas, fracturadas o con infiltración. Volvemos a empezar sobre una base sana." },
    { slug: "planificacion-digital-3d", name: "Planificación Digital 3D", description: "Simulación completa de tu caso con tecnología CAD/CAM y escáner intraoral 3D antes de comenzar cualquier procedimiento." },
  ],
};

const contentEn = {
  title: "Allura Full Mouth Reconstruction™",
  eyebrow: "Comprehensive Dentistry",
  subtitle: "Comprehensive solution to restore function, stability and a smile that feels secure again.",
  description: "For patients who have lost teeth, have severe deterioration, or need complete rehabilitation, we design a comprehensive plan backed by cutting-edge 3D technology and a team of highly certified specialists. Each case is unique and every plan is made to measure.",
  heroImage: "/images/imagenes_web/Allura-Full-Mouth-Reconstruction.jpg",
  subServices: [
    { slug: "implantes-unitarios", name: "Single and Multiple Implants", description: "Replacement of one or several teeth with high-precision titanium implants, integrated to last a lifetime." },
    { slug: "implantes-all-on-x", name: "All-on-X Implants", description: "Complete solution for patients with total or near-total tooth loss: a complete fixed arch on 4 or 6 strategically placed implants." },
    { slug: "rehabilitacion-oral-completa", name: "Full Oral Rehabilitation", description: "Comprehensive treatment that restores masticatory function, aesthetics and periodontal health for cases of severe or multiple deterioration." },
    { slug: "protesis-fijas", name: "Fixed Prostheses on Implants", description: "Porcelain crowns and bridges permanently fixed on implants. Natural appearance, total resistance and complete functionality." },
    { slug: "reemplazo-restauraciones", name: "Replacement of Failed Restorations", description: "Evaluation and replacement of old, fractured or infiltrated restorations. Starting over on a healthy foundation." },
    { slug: "planificacion-digital-3d", name: "3D Digital Planning", description: "Complete simulation of your case with CAD/CAM technology and 3D intraoral scanner before starting any procedure." },
  ],
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: sanityData?.seo?.metaTitle?.[loc] ?? `${content.title} — Allura Healthcare`,
    description: sanityData?.seo?.metaDescription?.[loc] ?? content.subtitle,
  };
}

export default async function FullMouthReconstructionPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug={CATEGORY_SLUG}
      sanityData={sanityData ?? undefined}
      locale={locale}
    />
  );
}
```

### 4b — smile-makeover/page.tsx

- [ ] **Step 2: Replace full content of `src/app/[locale]/servicios/smile-makeover/page.tsx`**

Read the current file first to confirm its `contentEs`/`contentEn` subServices list, then replace with:

```typescript
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceCategoryBySlugQuery, type ServiceCategoryData } from "@/sanity/lib/queries";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const CATEGORY_SLUG = "smile-makeover";

const contentEs = {
  title: "Allura Smile Makeover™",
  eyebrow: "Estética Dental",
  subtitle: "Diseñamos la sonrisa que siempre imaginaste, con resultados predecibles y un proceso completamente personalizado.",
  description: "Un Smile Makeover combina múltiples tratamientos estéticos para transformar de forma integral la apariencia de tu sonrisa. Carillas, diseño digital, blanqueamiento y más, coordinados por nuestro equipo de especialistas en estética dental avanzada.",
  heroImage: "/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg",
  subServices: [
    { slug: "carillas-porcelana", name: "Carillas de Porcelana", description: "Láminas ultrafinas de porcelana adheridas al frente de los dientes para corregir color, forma y tamaño con resultados permanentes." },
    { slug: "diseno-digital-sonrisa", name: "Diseño Digital de Sonrisa", description: "Planificación digital completa de tu nueva sonrisa antes de cualquier procedimiento. Ves el resultado final antes de comenzar." },
    { slug: "coronas-porcelana", name: "Coronas de Porcelana", description: "Restauraciones completas que cubren el diente para recuperar forma, función y estética cuando la carilla no es suficiente." },
    { slug: "restauraciones-esteticas", name: "Restauraciones Estéticas", description: "Rellenos y restauraciones en composite de alta calidad para reparar dientes fracturados, astillados o con caries visibles." },
    { slug: "blanqueamiento-dental", name: "Blanqueamiento Dental Profesional", description: "Tratamiento en consultorio con tecnología de luz LED para aclarar el tono de los dientes hasta 8 tonos en una sola sesión." },
  ],
};

const contentEn = {
  title: "Allura Smile Makeover™",
  eyebrow: "Dental Aesthetics",
  subtitle: "We design the smile you always imagined, with predictable results and a completely personalized process.",
  description: "A Smile Makeover combines multiple aesthetic treatments to comprehensively transform the appearance of your smile. Veneers, digital design, whitening and more, coordinated by our team of advanced dental aesthetics specialists.",
  heroImage: "/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg",
  subServices: [
    { slug: "carillas-porcelana", name: "Porcelain Veneers", description: "Ultra-thin porcelain sheets bonded to the front of teeth to correct color, shape and size with permanent results." },
    { slug: "diseno-digital-sonrisa", name: "Digital Smile Design", description: "Complete digital planning of your new smile before any procedure. See the final result before you start." },
    { slug: "coronas-porcelana", name: "Porcelain Crowns", description: "Complete restorations that cover the tooth to restore shape, function and aesthetics when a veneer isn't enough." },
    { slug: "restauraciones-esteticas", name: "Aesthetic Restorations", description: "High-quality composite fillings and restorations to repair fractured, chipped or visibly decayed teeth." },
    { slug: "blanqueamiento-dental", name: "Professional Teeth Whitening", description: "In-office treatment with LED light technology to lighten tooth shade up to 8 shades in a single session." },
  ],
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: sanityData?.seo?.metaTitle?.[loc] ?? `${content.title} — Allura Healthcare`,
    description: sanityData?.seo?.metaDescription?.[loc] ?? content.subtitle,
  };
}

export default async function SmileMakeoverPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug={CATEGORY_SLUG}
      sanityData={sanityData ?? undefined}
      locale={locale}
    />
  );
}
```

### 4c — aligners/page.tsx

- [ ] **Step 3: Replace full content of `src/app/[locale]/servicios/aligners/page.tsx`**

```typescript
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceCategoryBySlugQuery, type ServiceCategoryData } from "@/sanity/lib/queries";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const CATEGORY_SLUG = "aligners";

const contentEs = {
  title: "Allura Aligners™",
  eyebrow: "Ortodoncia Invisible",
  subtitle: "Ortodoncia invisible con tecnología de precisión y seguimiento remoto desde cualquier parte del mundo.",
  description: "Nuestro programa de alineadores transparentes combina tecnología de escáner intraoral 3D, planificación digital personalizada y seguimiento remoto para que puedas completar parte de tu tratamiento desde casa. Sin brackets, sin visitas constantes.",
  heroImage: "/images/imagenes_web/Invisalign_Allurahealthcare_.jpg",
  subServices: [
    { slug: "invisalign", name: "Invisalign", description: "El sistema de alineadores líder a nivel mundial. Planificación digital precisa con resultados predecibles y cómodos." },
    { slug: "alineadores-transparentes", name: "Alineadores Transparentes Premium", description: "Alternativa de alta calidad a Invisalign con la misma tecnología de impresión digital y materiales de grado médico." },
    { slug: "escaneo-digital-3d", name: "Escáner Digital 3D", description: "Toma de registros sin alginato ni moldes tradicionales. Precisión milimétrica con escáner iTero de última generación." },
    { slug: "planificacion-personalizada", name: "Planificación Personalizada", description: "Diseño del movimiento dental diente a diente con software ClinCheck. Ves el resultado final antes de comenzar." },
    { slug: "seguimiento-remoto", name: "Seguimiento Remoto", description: "Monitoreo del progreso de tu tratamiento desde tu país mediante fotos y videoconsultas. Menos viajes, mismo resultado." },
  ],
};

const contentEn = {
  title: "Allura Aligners™",
  eyebrow: "Invisible Orthodontics",
  subtitle: "Invisible orthodontics with precision technology and remote monitoring from anywhere in the world.",
  description: "Our clear aligner program combines 3D intraoral scanner technology, personalized digital planning and remote monitoring so you can complete part of your treatment from home. No braces, no constant visits.",
  heroImage: "/images/imagenes_web/Invisalign_Allurahealthcare_.jpg",
  subServices: [
    { slug: "invisalign", name: "Invisalign", description: "The world's leading aligner system. Precise digital planning with predictable and comfortable results." },
    { slug: "alineadores-transparentes", name: "Premium Clear Aligners", description: "High-quality alternative to Invisalign with the same digital printing technology and medical-grade materials." },
    { slug: "escaneo-digital-3d", name: "3D Digital Scanner", description: "Records taken without alginate or traditional molds. Millimeter precision with the latest generation iTero scanner." },
    { slug: "planificacion-personalizada", name: "Personalized Planning", description: "Tooth-by-tooth dental movement design with ClinCheck software. See the final result before you start." },
    { slug: "seguimiento-remoto", name: "Remote Monitoring", description: "Track your treatment progress from your country via photos and video consultations. Fewer trips, same result." },
  ],
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: sanityData?.seo?.metaTitle?.[loc] ?? `${content.title} — Allura Healthcare`,
    description: sanityData?.seo?.metaDescription?.[loc] ?? content.subtitle,
  };
}

export default async function AlignersPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug={CATEGORY_SLUG}
      sanityData={sanityData ?? undefined}
      locale={locale}
    />
  );
}
```

### 4d — facial-harmony/page.tsx

- [ ] **Step 4: Replace full content of `src/app/[locale]/servicios/facial-harmony/page.tsx`**

```typescript
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceCategoryBySlugQuery, type ServiceCategoryData } from "@/sanity/lib/queries";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const CATEGORY_SLUG = "facial-harmony";

const contentEs = {
  title: "Allura Facial Harmony™",
  eyebrow: "Medicina Estética Facial",
  subtitle: "Procedimientos de medicina estética facial para realzar tu armonía natural con resultados refinados y naturales.",
  description: "Nuestro enfoque de Facial Harmony integra procedimientos mínimamente invasivos y cirugía de alto nivel para equilibrar los rasgos faciales de forma natural. Cada plan es diseñado por especialistas con formación internacional, combinando técnica quirúrgica y criterio estético avanzado.",
  heroImage: "/images/imagenes_web/cirugia-estetica-facial-allurahealthcare.png",
  subServices: [
    { slug: "evaluacion-facial", name: "Evaluación Facial Integral", description: "Análisis completo de proporciones y armonía facial para diseñar un plan de tratamiento personalizado y realista." },
    { slug: "toxina-botulinica", name: "Toxina Botulínica (Bótox)", description: "Relajación muscular selectiva para suavizar líneas de expresión y prevenir el envejecimiento dinámico con resultados naturales." },
    { slug: "bioestimuladores", name: "Bioestimuladores de Colágeno", description: "Estimulación de la producción natural de colágeno para recuperar volumen, firmeza y luminosidad en la piel." },
    { slug: "blefaroplastia", name: "Blefaroplastia", description: "Cirugía de párpados para eliminar el exceso de piel y grasa que envejece la mirada, con recuperación rápida." },
    { slug: "rinoplastia", name: "Rinoplastia", description: "Cirugía de nariz para corregir proporciones, mejorar la función respiratoria o ambas, con resultados permanentes." },
    { slug: "lifting-facial", name: "Lifting Facial", description: "Procedimiento quirúrgico para reposicionar tejidos y piel del rostro con resultados duraderos y de aspecto natural." },
    { slug: "mentoplastia", name: "Mentoplastia", description: "Cirugía de mentón para mejorar el perfil facial y lograr una armonía proporcional entre los rasgos." },
    { slug: "cirugia-maxilofacial", name: "Cirugía Maxilofacial", description: "Corrección de deformidades esqueléticas faciales que afectan función y estética con un enfoque interdisciplinario." },
  ],
};

const contentEn = {
  title: "Allura Facial Harmony™",
  eyebrow: "Facial Aesthetic Medicine",
  subtitle: "Facial aesthetic medicine procedures to enhance your natural harmony with refined and natural results.",
  description: "Our Facial Harmony approach integrates minimally invasive procedures and high-level surgery to naturally balance facial features. Each plan is designed by internationally trained specialists, combining surgical technique and advanced aesthetic judgment.",
  heroImage: "/images/imagenes_web/cirugia-estetica-facial-allurahealthcare.png",
  subServices: [
    { slug: "evaluacion-facial", name: "Comprehensive Facial Assessment", description: "Complete analysis of facial proportions and harmony to design a personalized and realistic treatment plan." },
    { slug: "toxina-botulinica", name: "Botulinum Toxin (Botox)", description: "Selective muscle relaxation to smooth expression lines and prevent dynamic aging with natural results." },
    { slug: "bioestimuladores", name: "Collagen Biostimulators", description: "Stimulation of natural collagen production to restore volume, firmness and luminosity to the skin." },
    { slug: "blefaroplastia", name: "Blepharoplasty", description: "Eyelid surgery to remove excess skin and fat that ages the eyes, with fast recovery." },
    { slug: "rinoplastia", name: "Rhinoplasty", description: "Nose surgery to correct proportions, improve respiratory function or both, with permanent results." },
    { slug: "lifting-facial", name: "Facelift", description: "Surgical procedure to reposition facial tissues and skin with long-lasting and natural-looking results." },
    { slug: "mentoplastia", name: "Mentoplasty", description: "Chin surgery to improve facial profile and achieve proportional harmony between features." },
    { slug: "cirugia-maxilofacial", name: "Maxillofacial Surgery", description: "Correction of facial skeletal deformities affecting function and aesthetics with an interdisciplinary approach." },
  ],
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: sanityData?.seo?.metaTitle?.[loc] ?? `${content.title} — Allura Healthcare`,
    description: sanityData?.seo?.metaDescription?.[loc] ?? content.subtitle,
  };
}

export default async function FacialHarmonyPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug={CATEGORY_SLUG}
      sanityData={sanityData ?? undefined}
      locale={locale}
    />
  );
}
```

- [ ] **Step 5: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/servicios/full-mouth-reconstruction/page.tsx
git add src/app/[locale]/servicios/smile-makeover/page.tsx
git add src/app/[locale]/servicios/aligners/page.tsx
git add src/app/[locale]/servicios/facial-harmony/page.tsx
git commit -m "feat(sanity): connect 4 service category pages to Sanity with hardcoded fallbacks"
```

---

## Task 5: Connect the 6 Full Mouth Reconstruction sub-service pages

**Files (all modify):**
- `src/app/[locale]/servicios/full-mouth-reconstruction/implantes-unitarios/page.tsx`
- `src/app/[locale]/servicios/full-mouth-reconstruction/implantes-all-on-x/page.tsx`
- `src/app/[locale]/servicios/full-mouth-reconstruction/rehabilitacion-oral-completa/page.tsx`
- `src/app/[locale]/servicios/full-mouth-reconstruction/protesis-fijas/page.tsx`
- `src/app/[locale]/servicios/full-mouth-reconstruction/reemplazo-restauraciones/page.tsx`
- `src/app/[locale]/servicios/full-mouth-reconstruction/planificacion-digital-3d/page.tsx`

Each file follows this exact pattern. The only differences are `SERVICE_SLUG` and the `contentEs`/`contentEn` objects (which stay unchanged from their current values — only add the Sanity fetch wiring).

**Pattern to apply to every sub-service page.tsx:**

```typescript
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceBySlugQuery, type ServiceDetailData } from "@/sanity/lib/queries";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "<kebab-slug-here>";  // e.g. "implantes-unitarios"

// ... keep existing contentEs and contentEn objects exactly as they are ...

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: sanityData?.seo?.metaTitle?.[loc] ?? `${content.title} — Allura Healthcare`,
    description: sanityData?.seo?.metaDescription?.[loc] ?? content.description,
  };
}

export default async function <PageName>({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} sanityData={sanityData ?? undefined} locale={locale} />;
}
```

- [ ] **Step 1: Apply pattern to `implantes-unitarios/page.tsx`**

Replace the imports, add `revalidate` and `SERVICE_SLUG = "implantes-unitarios"`, keep `contentEs`/`contentEn` intact, replace `generateMetadata` and page component with the pattern above (component name: `ImplantesUnitariosPage`).

- [ ] **Step 2: Apply pattern to `implantes-all-on-x/page.tsx`**

`SERVICE_SLUG = "implantes-all-on-x"`, component name `ImplantesAllOnXPage`.

- [ ] **Step 3: Apply pattern to `rehabilitacion-oral-completa/page.tsx`**

`SERVICE_SLUG = "rehabilitacion-oral-completa"`, component name `RehabilitacionOralPage`.

- [ ] **Step 4: Apply pattern to `protesis-fijas/page.tsx`**

`SERVICE_SLUG = "protesis-fijas"`, component name `ProtesisFijasPage`.

- [ ] **Step 5: Apply pattern to `reemplazo-restauraciones/page.tsx`**

`SERVICE_SLUG = "reemplazo-restauraciones"`, component name `ReemplazoRestauracionesPage`.

- [ ] **Step 6: Apply pattern to `planificacion-digital-3d/page.tsx`**

`SERVICE_SLUG = "planificacion-digital-3d"`, component name `PlanificacionDigital3DPage`.

- [ ] **Step 7: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors

- [ ] **Step 8: Commit**

```bash
git add src/app/[locale]/servicios/full-mouth-reconstruction/
git commit -m "feat(sanity): connect Full Mouth Reconstruction sub-service pages to Sanity"
```

---

## Task 6: Connect the 5 Smile Makeover sub-service pages

**Files (all modify):**
- `src/app/[locale]/servicios/smile-makeover/carillas-porcelana/page.tsx`
- `src/app/[locale]/servicios/smile-makeover/diseno-digital-sonrisa/page.tsx`
- `src/app/[locale]/servicios/smile-makeover/coronas-porcelana/page.tsx`
- `src/app/[locale]/servicios/smile-makeover/restauraciones-esteticas/page.tsx`
- `src/app/[locale]/servicios/smile-makeover/blanqueamiento-dental/page.tsx`

Apply the same pattern from Task 5. Slugs:
- `carillas-porcelana` → component `CarillasPorcelanaPage`
- `diseno-digital-sonrisa` → component `DisenoDigitalSonrisaPage`
- `coronas-porcelana` → component `CoronasPorcelanaPage`
- `restauraciones-esteticas` → component `RestauracionesEsteticasPage`
- `blanqueamiento-dental` → component `BlanqueamientoDentalPage`

- [ ] **Step 1: Apply pattern to all 5 smile-makeover sub-service pages** (one at a time, reading current contentEs/contentEn before replacing)

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/servicios/smile-makeover/
git commit -m "feat(sanity): connect Smile Makeover sub-service pages to Sanity"
```

---

## Task 7: Connect the 5 Aligners sub-service pages

**Files (all modify):**
- `src/app/[locale]/servicios/aligners/invisalign/page.tsx`
- `src/app/[locale]/servicios/aligners/alineadores-transparentes/page.tsx`
- `src/app/[locale]/servicios/aligners/escaneo-digital-3d/page.tsx`
- `src/app/[locale]/servicios/aligners/planificacion-personalizada/page.tsx`
- `src/app/[locale]/servicios/aligners/seguimiento-remoto/page.tsx`

Apply the same pattern from Task 5. Slugs:
- `invisalign` → component `InvisalignPage`
- `alineadores-transparentes` → component `AlineadoresTransparentesPage`
- `escaneo-digital-3d` → component `EscaneoDigital3DPage`
- `planificacion-personalizada` → component `PlanificacionPersonalizadaPage`
- `seguimiento-remoto` → component `SeguimientoRemotoPage`

- [ ] **Step 1: Apply pattern to all 5 aligners sub-service pages**

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/servicios/aligners/
git commit -m "feat(sanity): connect Aligners sub-service pages to Sanity"
```

---

## Task 8: Connect the 8 Facial Harmony sub-service pages

**Files (all modify):**
- `src/app/[locale]/servicios/facial-harmony/evaluacion-facial/page.tsx`
- `src/app/[locale]/servicios/facial-harmony/toxina-botulinica/page.tsx`
- `src/app/[locale]/servicios/facial-harmony/bioestimuladores/page.tsx`
- `src/app/[locale]/servicios/facial-harmony/blefaroplastia/page.tsx`
- `src/app/[locale]/servicios/facial-harmony/rinoplastia/page.tsx`
- `src/app/[locale]/servicios/facial-harmony/lifting-facial/page.tsx`
- `src/app/[locale]/servicios/facial-harmony/mentoplastia/page.tsx`
- `src/app/[locale]/servicios/facial-harmony/cirugia-maxilofacial/page.tsx`

Apply the same pattern from Task 5. Slugs match folder names exactly:
- `evaluacion-facial` → component `EvaluacionFacialPage`
- `toxina-botulinica` → component `ToxinaBotulinicaPage`
- `bioestimuladores` → component `BioestimuladoresPage`
- `blefaroplastia` → component `BlefaroplastiaPage`
- `rinoplastia` → component `RinoplastiaPage`
- `lifting-facial` → component `LiftingFacialPage`
- `mentoplastia` → component `MentoplastiaPage`
- `cirugia-maxilofacial` → component `CirugiaMaxilofacialPage`

- [ ] **Step 1: Apply pattern to all 8 facial-harmony sub-service pages**

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/servicios/facial-harmony/
git commit -m "feat(sanity): connect Facial Harmony sub-service pages to Sanity"
```

---

## Task 9: Run full build and verify

**Files:** No file changes — verification only.

- [ ] **Step 1: Run full Next.js build**

```bash
npm run build
```

Expected output includes:
- `✓ Compiled successfully`
- `✓ Generating static pages` — all service pages listed with no errors
- Zero TypeScript errors
- No `NEXT_PUBLIC_SANITY_PROJECT_ID` warnings that block build (env vars may show as warning, not error)

If build fails due to missing Sanity env vars at build time, verify `.env.local` contains:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 2: Start dev server and test ES routes**

```bash
npm run dev
```

Open these URLs and confirm each renders with the hardcoded content (Sanity data is empty, fallbacks should show):
- `http://localhost:3000/es/servicios`
- `http://localhost:3000/es/servicios/full-mouth-reconstruction`
- `http://localhost:3000/es/servicios/full-mouth-reconstruction/implantes-unitarios`
- `http://localhost:3000/es/servicios/smile-makeover`
- `http://localhost:3000/es/servicios/aligners`
- `http://localhost:3000/es/servicios/facial-harmony`

- [ ] **Step 3: Test EN routes**

Open:
- `http://localhost:3000/en/servicios/full-mouth-reconstruction`
- `http://localhost:3000/en/servicios/smile-makeover/carillas-porcelana`
- `http://localhost:3000/en/servicios/facial-harmony/rinoplastia`

Confirm English content renders correctly (hardcoded EN fallbacks).

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix(sanity): resolve build issues in services Sanity integration"
```

---

## Self-Review Checklist

**Spec coverage:**
1. ✅ Schema `service` — exists in `service.ts`, not modified (already compliant)
2. ✅ Schema `serviceCategory` — exists in `serviceCategory.ts`, not modified
3. ✅ ES/EN bilingual content — all fields use `{ es, en }` LocaleString pattern; locale-resolved in templates
4. ✅ Slug per language — single `slug.current` used; route slugs are Spanish kebab-case (existing convention)
5. ✅ Image with alt text — `coverImage { asset->{ _id, url }, alt { es, en } }` queried; template uses `asset.url`
6. ✅ Short and long description — `shortDescription` in list items; `body` (localePortableText) is fetched but not rendered yet (out of scope per spec: "connect listados y páginas detalle")
7. ✅ Price/promo — NOT in current schema; `isActive` boolean handles active/inactive toggle; price is out of scope (not in schema)
8. ✅ CTA — `ctaBanner.cta` exists in schema; templates use hardcoded WhatsApp CTA (safe fallback; Sanity ctaBanner not wired to override WhatsApp — acceptable for this phase)
9. ✅ FAQs — fetched via `faqs[]` ref array; not rendered (no FAQ component exists yet — out of scope for this phase)
10. ✅ SEO per service — `seo { metaTitle, metaDescription }` wired into `generateMetadata`
11. ✅ Listing pages — category pages show sub-services from Sanity `services` reverse-ref array
12. ✅ Detail pages — individual service pages fetch by slug and pass to `ServiceDetailTemplate`
13. ✅ App Router — all pages are async server components, no `use client` added
14. ✅ next-intl — all `getTranslations` calls preserved; template i18n keys unchanged
15. ✅ Hardcoded fallbacks — all `contentEs`/`contentEn` preserved; Sanity data only overrides when non-null
16. ✅ Build must pass — Task 9 verifies full build

**Note on price field:** The `service.ts` schema does not include a price or `promoActive` field. The spec asked for "precio o texto de precio" and "promoción activa/inactiva". The schema has `isActive` for active/inactive. If price and promo fields are needed, they should be added to the `service.ts` schema — this is a schema gap, not a frontend gap. Task 1 does not add price/promo because the schema doesn't define them and adding undocumented fields to the schema is out of scope for this implementation task. Flag this to the user before proceeding.
