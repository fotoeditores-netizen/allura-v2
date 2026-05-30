# Equipo — Sanity Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the Equipo (Team) section of Allura Healthcare to Sanity CMS, with a listing page at `/equipo` and individual member profiles at `/equipo/[slug]`, both bilingual and with hardcoded i18n fallbacks.

**Architecture:** Same pattern as services and blog — thin async page components fetch from Sanity and pass data to templates. `TeamCard` client component gets optional Sanity props while keeping full backward compatibility with existing hardcoded data. Two new templates (`TeamListTemplate`, `TeamMemberTemplate`) encapsulate the UI. Schema `teamMember` already exists and requires no changes.

**Tech Stack:** Next.js 14 App Router · next-intl · Sanity v3 / next-sanity@9 · GROQ · `@portabletext/react` · ISR (`revalidate=0` dev / `3600` prod) · Tailwind CSS

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/sanity/lib/queries.ts` | Modify (append) | 2 new types + 3 new GROQ queries |
| `src/components/sections/TeamCard.tsx` | Modify | Add optional Sanity props, keep backward compat |
| `src/components/templates/TeamListTemplate.tsx` | Create | Team listing UI with Sanity/fallback logic |
| `src/components/templates/TeamMemberTemplate.tsx` | Create | Member profile UI with PortableText bio |
| `src/app/[locale]/equipo/page.tsx` | Replace | Fetch from Sanity, pass to TeamListTemplate |
| `src/app/[locale]/equipo/[slug]/page.tsx` | Create | Profile page with generateStaticParams + SEO |

---

## Task 1: Add GROQ queries and TypeScript types

**Files:**
- Modify: `src/sanity/lib/queries.ts` (append after line 485)

### Context
The file ends at line 485 with `blogPostSlugsQuery`. Append the team section after it. The file already defines `LocaleString`, `SanityImage`, `SanityImageLocaleAlt` — use `LocaleString` for bilingual fields. The `teamMember` schema has `credentials[]` as `string[]` (NOT bilingual) and `specialties[]` as `{ es, en }[]` (bilingual). The `photo` field has a single `alt: string` (NOT bilingual — unlike `SanityImageLocaleAlt`).

- [ ] **Step 1: Append the following block at the very end of `src/sanity/lib/queries.ts`**

```typescript
// ─── Team ─────────────────────────────────────────────────────────────────────

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

export const teamMembersQuery = groq`
  *[_type == "teamMember" && isActive == true] | order(order asc, name asc) {
    _id,
    name,
    slug,
    role,
    photo {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    specialties[] { es, en },
    credentials
  }
`

export const teamMemberBySlugQuery = groq`
  *[_type == "teamMember" && slug.current == $slug && isActive == true][0] {
    _id,
    name,
    slug,
    role,
    photo {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    shortBio,
    fullBio {
      es[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      },
      en[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      }
    },
    specialties[] { es, en },
    credentials,
    linkedinUrl
  }
`

export const teamMemberSlugsQuery = groq`
  *[_type == "teamMember" && isActive == true] {
    "slug": slug.current
  }
`
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:\Users\publi\Desktop\ALLURA && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd c:\Users\publi\Desktop\ALLURA
git add src/sanity/lib/queries.ts
git commit -m "feat(equipo): add GROQ queries and TypeScript types for team"
```

---

## Task 2: Extend TeamCard with optional Sanity props

**Files:**
- Modify: `src/components/sections/TeamCard.tsx`

### Context
`TeamCard` is a `"use client"` component. Current props: `name`, `specialty`, `image`, `formacion`, `reconocimiento?`, `enfoque`, `bgLight?`. We add optional `sanityMember?: TeamMemberListItem`, `locale?: string`, `slug?: string`.

Resolution logic:
- `resolvedSpecialty` = `sanityMember?.role?.[loc]` || `specialty`
- `resolvedImage` = `sanityMember?.photo?.asset?.url` || `image`
- `resolvedFormacion` = `sanityMember.credentials` if non-empty, else `formacion`
- `resolvedEnfoque` = `sanityMember.specialties.map(s => s[loc])` if non-empty, else `enfoque`
- When Sanity data present, `reconocimiento` section is hidden (Sanity schema has no reconocimiento field)
- When `slug` prop present, the member name at the bottom becomes a `<Link href="/equipo/[slug]">`

The existing behavior when no Sanity props are passed must be **identical to today**.

- [ ] **Step 1: Replace the entire content of `src/components/sections/TeamCard.tsx` with**

```typescript
'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import type { TeamMemberListItem } from '@/sanity/lib/queries';

interface TeamCardProps {
  name: string;
  specialty: string;
  image: string;
  formacion: string[];
  reconocimiento?: string[];
  enfoque: string[];
  bgLight?: boolean;
  sanityMember?: TeamMemberListItem;
  locale?: string;
  slug?: string;
}

export function TeamCard({
  name,
  specialty,
  image,
  formacion,
  reconocimiento,
  enfoque,
  bgLight = false,
  sanityMember,
  locale = 'es',
  slug,
}: TeamCardProps) {
  const [active, setActive] = useState(false);
  const t = useTranslations('teamCard');
  const loc = locale as 'es' | 'en';

  const resolvedSpecialty = sanityMember?.role?.[loc] || specialty;
  const resolvedImage = sanityMember?.photo?.asset?.url || image;
  const resolvedFormacion =
    sanityMember?.credentials && sanityMember.credentials.length > 0
      ? sanityMember.credentials
      : formacion;
  const resolvedEnfoque =
    sanityMember?.specialties && sanityMember.specialties.length > 0
      ? sanityMember.specialties.map((s) => s[loc] || s.es)
      : enfoque;
  const hasSanityData = !!sanityMember;

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      setActive((prev) => !prev);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-brand-navy/20 bg-white">
      <div
        className="relative aspect-square cursor-pointer select-none"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onClick={handleClick}
        role="img"
        aria-label={`${t('ariaDetail')} ${name}`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${resolvedImage}')` }}
        />

        <div
          aria-hidden={!active}
          className={[
            'absolute inset-0 bg-brand-navy/[0.93] p-5 overflow-y-auto flex flex-col gap-3',
            'transition-all duration-500 ease-in-out',
            active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
          ].join(' ')}
        >
          <button
            className="md:hidden self-end text-white/50 hover:text-white p-1 -mt-1 -mr-1 flex-shrink-0"
            onClick={(e) => { e.stopPropagation(); setActive(false); }}
            aria-label={t('ariaClose')}
          >
            <X size={14} />
          </button>

          <div>
            <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
              {t('formacion')}
            </p>
            <ul className="space-y-1">
              {resolvedFormacion.map((item) => (
                <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                  <span className="text-brand-blue flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {!hasSanityData && reconocimiento && reconocimiento.length > 0 && (
            <div>
              <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
                {t('reconocimiento')}
              </p>
              <ul className="space-y-1">
                {reconocimiento.map((item) => (
                  <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                    <span className="text-brand-blue flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
              {t('enfoque')}
            </p>
            <ul className="space-y-1">
              {resolvedEnfoque.map((item) => (
                <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                  <span className="text-brand-blue flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={`p-6 ${bgLight ? 'bg-brand-light' : 'bg-white'}`}>
        {slug ? (
          <Link href={`/equipo/${slug}`}>
            <h3 className="font-heading text-lg text-brand-navy mb-1 hover:text-brand-blue transition-colors">
              {name}
            </h3>
          </Link>
        ) : (
          <h3 className="font-heading text-lg text-brand-navy mb-1">{name}</h3>
        )}
        <p className="font-body text-xs text-brand-blue tracking-wide leading-relaxed">{resolvedSpecialty}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:\Users\publi\Desktop\ALLURA && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify no visual regression on existing equipo page**

Start dev server if not running: `npm run dev`
Open `http://localhost:3000/es/equipo` — should look identical to before (all 6 cards, hover overlay working).

- [ ] **Step 4: Commit**

```bash
cd c:\Users\publi\Desktop\ALLURA
git add src/components/sections/TeamCard.tsx
git commit -m "feat(equipo): extend TeamCard with optional Sanity props (backward compatible)"
```

---

## Task 3: Create TeamListTemplate

**Files:**
- Create: `src/components/templates/TeamListTemplate.tsx`

### Context
Async server component. Uses `getTranslations("equipo")`. When `members` array is non-empty (Sanity has data), renders Sanity members mapped to `TeamCard` with `sanityMember` prop. When empty, renders the hardcoded fallback exactly as the current page does (using `t.raw("members")` and local `teamImages`).

The local fallback images array:
```typescript
const teamImages = [
  "/images/equipo/Dra-Johanna-Jaramillo-Allura.avif",
  "/images/equipo/Dra-Daniela-Alzate-Allura.avif",
  "/images/equipo/Dr-Sebastian-Munoz-Allura.avif",
  "/images/equipo/Dr-Santiago-Henao-Allura.avif",
  "/images/equipo/Dr-Ivan-Jimenez-Allura.avif",
  "/images/equipo/Dr-Alejandro-Cifuentes-Allura.avif",
];
```

- [ ] **Step 1: Create `src/components/templates/TeamListTemplate.tsx` with the following content**

```typescript
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTABanner } from '@/components/sections/CTABanner';
import { TeamCard } from '@/components/sections/TeamCard';
import { getTranslations } from 'next-intl/server';
import type { TeamMemberListItem } from '@/sanity/lib/queries';

const teamImages = [
  '/images/equipo/Dra-Johanna-Jaramillo-Allura.avif',
  '/images/equipo/Dra-Daniela-Alzate-Allura.avif',
  '/images/equipo/Dr-Sebastian-Munoz-Allura.avif',
  '/images/equipo/Dr-Santiago-Henao-Allura.avif',
  '/images/equipo/Dr-Ivan-Jimenez-Allura.avif',
  '/images/equipo/Dr-Alejandro-Cifuentes-Allura.avif',
];

interface TeamListTemplateProps {
  members: TeamMemberListItem[];
  locale: string;
}

export async function TeamListTemplate({ members, locale }: TeamListTemplateProps) {
  const t = await getTranslations('equipo');

  const hasSanityMembers = members.length > 0;

  const hardcodedMembers = hasSanityMembers
    ? []
    : (t.raw('members') as Array<{
        name: string;
        specialty: string;
        formacion: string[];
        reconocimiento?: string[];
        enfoque: string[];
      }>);

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

      {/* Team grid */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hasSanityMembers
              ? members.map((member, i) => (
                  <TeamCard
                    key={member._id}
                    name={member.name}
                    specialty={member.role?.[locale as 'es' | 'en'] || member.role?.es || ''}
                    image={member.photo?.asset?.url || teamImages[i] || teamImages[0]}
                    formacion={[]}
                    enfoque={[]}
                    bgLight={i % 2 !== 0}
                    sanityMember={member}
                    locale={locale}
                    slug={member.slug.current}
                  />
                ))
              : hardcodedMembers.map((member, i) => (
                  <TeamCard
                    key={member.name}
                    {...member}
                    image={teamImages[i]}
                    bgLight={i % 2 !== 0}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura max-w-2xl text-center mx-auto">
          <SectionHeading
            eyebrow={t('certificationsLabel')}
            title={t('certificationsTitle')}
            subtitle={t('certificationsSubtitle')}
            centered
          />
        </div>
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:\Users\publi\Desktop\ALLURA && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd c:\Users\publi\Desktop\ALLURA
git add src/components/templates/TeamListTemplate.tsx
git commit -m "feat(equipo): add TeamListTemplate with Sanity/fallback logic"
```

---

## Task 4: Create TeamMemberTemplate

**Files:**
- Create: `src/components/templates/TeamMemberTemplate.tsx`

### Context
Sync (non-async) server component. Renders the full profile of a team member. Uses `@portabletext/react` (already installed). The `fullBio` field is `{ es: PortableTextBlock[]; en: PortableTextBlock[] }` — access with `member.fullBio?.[loc] ?? []`. LinkedIn icon from `lucide-react` (`Linkedin`).

- [ ] **Step 1: Create `src/components/templates/TeamMemberTemplate.tsx` with the following content**

```typescript
import Image from 'next/image';
import { Link } from '@/navigation';
import { CTABanner } from '@/components/sections/CTABanner';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { ChevronLeft, Linkedin } from 'lucide-react';
import type { TeamMemberDetail } from '@/sanity/lib/queries';

interface TeamMemberTemplateProps {
  member: TeamMemberDetail;
  locale: string;
}

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-heading text-2xl md:text-3xl text-brand-navy mt-10 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-heading text-xl text-brand-navy mt-8 mb-3 leading-tight">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-base text-brand-silver leading-relaxed mb-5">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-brand-blue pl-5 my-6 italic font-body text-brand-silver">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-brand-navy">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
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
};

export function TeamMemberTemplate({ member, locale }: TeamMemberTemplateProps) {
  const loc = locale as 'es' | 'en';
  const role = member.role?.[loc] || member.role?.es || '';
  const shortBio = member.shortBio?.[loc] || member.shortBio?.es || '';
  const fullBioBlocks: PortableTextBlock[] = (member.fullBio?.[loc] ?? []) as PortableTextBlock[];
  const photoUrl = member.photo?.asset?.url;
  const photoAlt = member.photo?.alt || member.name;

  return (
    <>
      {/* Hero with photo */}
      <section className="relative pt-40 pb-24 overflow-hidden min-h-[420px]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={photoAlt}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/50 to-brand-navy/85" />

        <div className="relative z-10 container-allura px-6 md:px-12">
          <Link
            href="/equipo"
            className="inline-flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft size={16} />
            {loc === 'en' ? 'Back to Team' : 'Volver al Equipo'}
          </Link>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3">
            {member.name}
          </h1>
          <p className="font-body text-base text-brand-blue tracking-wide">
            {role}
          </p>
        </div>
      </section>

      {/* Profile content */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {member.credentials && member.credentials.length > 0 && (
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">
                    {loc === 'en' ? 'Education' : 'Formación'}
                  </p>
                  <ul className="space-y-2">
                    {member.credentials.map((cred) => (
                      <li key={cred} className="font-body text-sm text-brand-silver leading-snug flex gap-2">
                        <span className="text-brand-blue flex-shrink-0 mt-0.5">—</span>
                        <span>{cred}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.specialties && member.specialties.length > 0 && (
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">
                    {loc === 'en' ? 'Focus Areas' : 'Enfoque'}
                  </p>
                  <ul className="space-y-2">
                    {member.specialties.map((s) => (
                      <li key={s.es} className="font-body text-sm text-brand-silver leading-snug flex gap-2">
                        <span className="text-brand-blue flex-shrink-0 mt-0.5">—</span>
                        <span>{s[loc] || s.es}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm text-brand-navy hover:text-brand-blue transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              )}
            </aside>

            {/* Main content */}
            <div className="lg:col-span-2">
              {shortBio && (
                <p className="font-body text-lg text-brand-silver leading-relaxed mb-8 pb-8 border-b border-brand-light">
                  {shortBio}
                </p>
              )}

              {fullBioBlocks.length > 0 ? (
                <PortableText
                  value={fullBioBlocks}
                  components={portableTextComponents}
                />
              ) : !shortBio ? (
                <p className="font-body text-brand-silver italic">
                  {loc === 'en' ? 'Profile coming soon.' : 'Perfil próximamente.'}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:\Users\publi\Desktop\ALLURA && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd c:\Users\publi\Desktop\ALLURA
git add src/components/templates/TeamMemberTemplate.tsx
git commit -m "feat(equipo): add TeamMemberTemplate with PortableText bio and sidebar"
```

---

## Task 5: Replace equipo listing page

**Files:**
- Replace: `src/app/[locale]/equipo/page.tsx`

### Context
Current file uses hardcoded i18n data. Replace entirely with Sanity-powered version. The `TeamListTemplate` handles the fallback when `members` is empty — the page just passes what Sanity returns.

- [ ] **Step 1: Replace the entire content of `src/app/[locale]/equipo/page.tsx` with**

```typescript
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import { teamMembersQuery, type TeamMemberListItem } from '@/sanity/lib/queries';
import { TeamListTemplate } from '@/components/templates/TeamListTemplate';

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'equipo' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  };
}

export default async function EquipoPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const members = await client.fetch<TeamMemberListItem[]>(
    teamMembersQuery,
    {},
    { next: { revalidate } }
  );

  return <TeamListTemplate members={members ?? []} locale={locale} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:\Users\publi\Desktop\ALLURA && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd c:\Users\publi\Desktop\ALLURA
git add "src/app/[locale]/equipo/page.tsx"
git commit -m "feat(equipo): connect equipo listing page to Sanity"
```

---

## Task 6: Create team member profile page

**Files:**
- Create: `src/app/[locale]/equipo/[slug]/page.tsx`

### Context
New dynamic route for individual member profiles. Same pattern as `blog/[slug]/page.tsx`. `generateStaticParams` pre-builds all active member slugs. `generateMetadata` uses `name + role`. If member not found → `notFound()`.

- [ ] **Step 1: Create directory and file**

Create directory first (PowerShell):
```powershell
New-Item -ItemType Directory -Force "c:\Users\publi\Desktop\ALLURA\src\app\[locale]\equipo\[slug]"
```

Then create `src/app/[locale]/equipo/[slug]/page.tsx` with:

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import {
  teamMemberBySlugQuery,
  teamMemberSlugsQuery,
  type TeamMemberDetail,
} from '@/sanity/lib/queries';
import { TeamMemberTemplate } from '@/components/templates/TeamMemberTemplate';

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    teamMemberSlugsQuery,
    {},
    { next: { revalidate } }
  );
  return (slugs ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const member = await client.fetch<TeamMemberDetail | null>(
    teamMemberBySlugQuery,
    { slug },
    { next: { revalidate } }
  );

  if (!member) return { title: 'Not Found' };

  const loc = locale as 'es' | 'en';
  return {
    title: `${member.name} — ${member.role?.[loc] || member.role?.es} | Allura Healthcare`,
    description: member.shortBio?.[loc] || member.shortBio?.es,
  };
}

export default async function TeamMemberPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const member = await client.fetch<TeamMemberDetail | null>(
    teamMemberBySlugQuery,
    { slug },
    { next: { revalidate } }
  );

  if (!member) notFound();

  return <TeamMemberTemplate member={member} locale={locale} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:\Users\publi\Desktop\ALLURA && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd c:\Users\publi\Desktop\ALLURA
git add "src/app/[locale]/equipo/[slug]/page.tsx"
git commit -m "feat(equipo): add team member profile page with generateStaticParams and SEO"
```

---

## Task 7: Run build and local verification

**Files:** None — build + verification only

- [ ] **Step 1: Run full Next.js build**

```bash
cd c:\Users\publi\Desktop\ALLURA && npm run build
```

Expected: build completes with no TypeScript errors. New routes visible:
```
/[locale]/equipo
/[locale]/equipo/[slug]
```

- [ ] **Step 2: If build fails with .next cache error**

```powershell
Remove-Item -Recurse -Force "c:\Users\publi\Desktop\ALLURA\.next"
npm run build
```

- [ ] **Step 3: Start dev server and verify URLs**

```bash
npm run dev
```

| URL | Expected |
|-----|----------|
| `http://localhost:3000/es/equipo` | Grid de 6 cards (fallback hardcoded si Sanity vacío) |
| `http://localhost:3000/en/equipo` | Same in English |
| `http://localhost:3000/es/equipo/slug-inexistente` | 404 page |
| `http://localhost:3000/es/servicios` | Sin regresiones |
| `http://localhost:3000/es/blog` | Sin regresiones |

- [ ] **Step 4: Verify TeamCard hover overlay still works**

Hover sobre cualquier card en `/es/equipo` — debe mostrar el overlay con Formación y Enfoque.

- [ ] **Step 5: Commit build artifacts if any (usually none)**

If `package.json` or `package-lock.json` changed: commit them. Otherwise skip.

---

## Self-Review Checklist

**Spec coverage:**
- [x] Schema `teamMember` — no changes needed (Task 1 context)
- [x] Types `TeamMemberListItem` + `TeamMemberDetail` (Task 1)
- [x] GROQ: `teamMembersQuery`, `teamMemberBySlugQuery`, `teamMemberSlugsQuery` (Task 1)
- [x] `TeamCard` extensión retrocompatible con `sanityMember`, `locale`, `slug` props (Task 2)
- [x] `credentials[]` → Formación, `specialties[]` → Enfoque (Task 2)
- [x] `reconocimiento` solo aparece cuando no hay datos Sanity (Task 2)
- [x] `TeamListTemplate` con fallback hardcoded cuando Sanity vacío (Task 3)
- [x] `TeamMemberTemplate` con PortableText bio, sidebar (Task 4)
- [x] `/equipo/page.tsx` reemplazado (Task 5)
- [x] `/equipo/[slug]/page.tsx` creado con `generateStaticParams` + SEO (Task 6)
- [x] ISR `revalidate` en todas las páginas (Tasks 5, 6)
- [x] `notFound()` si miembro no encontrado (Task 6)
- [x] Build y verificación local (Task 7)
