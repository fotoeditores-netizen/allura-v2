# Page Editor — Sections & Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full page editor in /admin/paginas where the client can add, reorder, show/hide and edit sections with a live iframe preview, and publish changes to the public site.

**Architecture:** Four-layer system: (1) Supabase data layer with pages/sections fetchers, (2) section-registry catalog mapping types to forms and components, (3) admin PageEditor UI with SectionTree + SectionFormRouter + iframe preview, (4) public SectionRenderer that reads from Supabase with hardcoded fallback. Preview mode bypasses ISR via `?preview=true` param.

**Tech Stack:** Next.js 14 App Router, Supabase, TypeScript, Tailwind CSS, @dnd-kit/core for drag & drop.

**Compact/Clear guidance:**
- Run `/compact` after Task 6 (midpoint — 12 forms done)
- Run `/clear` only if context is completely full and cannot compact further
- Never clear without compacting first

---

## File map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/supabase/pages.ts` | Create | All DB operations for pages, sections |
| `src/lib/section-registry.ts` | Create | Catalog: type → label, icon, defaultSettings |
| `src/app/api/preview/route.ts` | Create | Preview redirect endpoint |
| `src/components/admin/SectionTree.tsx` | Create | Drag & drop section list |
| `src/components/admin/SectionFormRouter.tsx` | Create | Routes section type → correct form |
| `src/components/admin/section-forms/HeroForm.tsx` | Create | Hero section editor |
| `src/components/admin/section-forms/BenefitsForm.tsx` | Create | Benefits editor |
| `src/components/admin/section-forms/ServicesGridForm.tsx` | Create | Services grid editor |
| `src/components/admin/section-forms/AboutTeaserForm.tsx` | Create | About teaser editor |
| `src/components/admin/section-forms/MedellinForm.tsx` | Create | Medellín section editor |
| `src/components/admin/section-forms/TeamPreviewForm.tsx` | Create | Team preview editor |
| `src/components/admin/section-forms/ProcessForm.tsx` | Create | Process steps editor |
| `src/components/admin/section-forms/CtaForm.tsx` | Create | CTA banner editor |
| `src/components/admin/section-forms/TestimonialsForm.tsx` | Create | Testimonials editor |
| `src/components/admin/section-forms/FaqForm.tsx` | Create | FAQ editor |
| `src/components/admin/section-forms/ContactFormSectionForm.tsx` | Create | Contact form section editor |
| `src/components/admin/section-forms/TextImageForm.tsx` | Create | Text + image editor |
| `src/components/admin/PageEditor.tsx` | Create | Main editor layout: panel + iframe |
| `src/app/admin/paginas/page.tsx` | Modify | Pages list (replace placeholder) |
| `src/app/admin/paginas/[slug]/page.tsx` | Create | PageEditor route |
| `src/components/sections/SectionRenderer.tsx` | Create | Maps section type → public component |
| `src/components/sections/HeroSection.tsx` | Modify | Accept optional `settings` prop |
| `src/components/sections/BenefitsSection.tsx` | Modify | Accept optional `settings` prop |
| `src/components/sections/ServicesPreview.tsx` | Modify | Accept optional `settings` prop |
| `src/components/sections/AboutTeaser.tsx` | Modify | Accept optional `settings` prop |
| `src/components/sections/MedellinSection.tsx` | Modify | Accept optional `settings` prop |
| `src/components/sections/TeamPreview.tsx` | Modify | Accept optional `settings` prop |
| `src/components/sections/ProcessSection.tsx` | Modify | Accept optional `settings` prop |
| `src/components/sections/CTABanner.tsx` | Modify | Accept optional `settings` prop |
| `src/app/[locale]/page.tsx` | Modify | Read sections from Supabase, fallback hardcoded |
| `src/app/[locale]/nosotros/page.tsx` | Modify | Same pattern |
| `src/app/[locale]/como-funciona/page.tsx` | Modify | Same pattern |
| `src/app/[locale]/contacto/page.tsx` | Modify | Same pattern |
| `src/app/[locale]/blog/page.tsx` | Modify | Same pattern (list page only) |
| `src/app/[locale]/equipo/page.tsx` | Modify | Same pattern (list page only) |
| `src/app/[locale]/galeria/page.tsx` | Modify | Same pattern |
| `supabase/migrations/008_seed_pages.sql` | Create | Seed 8 main pages into DB |

---

## Task 1: Supabase data layer

**Files:**
- Create: `src/lib/supabase/pages.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/supabase/pages.ts
import { createClient } from './client'
import { createServiceClient } from './client'
import { revalidatePath } from 'next/cache'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export interface PageRow {
  id: string
  site_id: string
  slug: string
  title_i18n: { es: string; en: string }
  type: string
  status: 'draft' | 'published' | 'archived'
  sort_order: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface SectionRow {
  id: string
  page_id: string
  type: string
  title: string | null
  sort_order: number
  is_visible: boolean
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function getPages(): Promise<PageRow[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('sort_order')
  return (data ?? []) as PageRow[]
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .single()
  return data as PageRow | null
}

export async function upsertPage(
  data: Partial<PageRow> & { slug: string }
): Promise<PageRow> {
  const supabase = createServiceClient()
  const { data: row, error } = await supabase
    .from('pages')
    .upsert({ site_id: SITE_ID, ...data }, { onConflict: 'site_id,slug' })
    .select()
    .single()
  if (error) throw error
  return row as PageRow
}

export async function getSectionsByPage(pageId: string): Promise<SectionRow[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order')
  return (data ?? []) as SectionRow[]
}

export async function upsertSection(
  data: Partial<SectionRow> & { page_id: string; type: string }
): Promise<SectionRow> {
  const supabase = createServiceClient()
  const { data: row, error } = await supabase
    .from('sections')
    .upsert(data, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return row as SectionRow
}

export async function deleteSection(id: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase.from('sections').delete().eq('id', id)
}

export async function reorderSections(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  const supabase = createServiceClient()
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('sections').update({ sort_order }).eq('id', id)
    )
  )
}

export async function publishPage(pageId: string, slug: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase
    .from('pages')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', pageId)
  revalidatePath(`/es${slug === '/' ? '' : slug}`)
  revalidatePath(`/en${slug === '/' ? '' : slug}`)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors related to pages.ts

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/pages.ts
git commit -m "feat(pages): add Supabase data layer for pages and sections"
```

---

## Task 2: Section registry

**Files:**
- Create: `src/lib/section-registry.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/section-registry.ts
export interface SectionDefinition {
  type: string
  label: string
  icon: string
  defaultSettings: Record<string, unknown>
}

export const SECTION_REGISTRY: SectionDefinition[] = [
  {
    type: 'hero',
    label: 'Hero principal',
    icon: '🏠',
    defaultSettings: {
      eyebrow: { es: '', en: '' },
      headline1: { es: 'Salud que inspira,', en: 'Health that inspires,' },
      headline2: { es: 'viajes que transforman', en: 'journeys that transform' },
      subtitle: { es: '', en: '' },
      ctaPrimary: { es: 'Conoce nuestros servicios', en: 'Explore our services' },
      ctaSecondary: { es: '¿Cómo funciona?', en: 'How does it work?' },
      imageUrl: '',
    },
  },
  {
    type: 'benefits',
    label: 'Beneficios',
    icon: '✨',
    defaultSettings: {
      eyebrow: { es: 'Por qué elegirnos', en: 'Why choose us' },
      title: { es: 'Una experiencia diseñada para ti', en: 'An experience designed for you' },
      subtitle: { es: '', en: '' },
      items: [
        { icon: '🏆', title: { es: 'Excelencia Profesional', en: 'Professional Excellence' }, description: { es: '', en: '' } },
        { icon: '🤝', title: { es: 'Acompañamiento Personalizado', en: 'Personalized Support' }, description: { es: '', en: '' } },
        { icon: '🔬', title: { es: 'Tecnología y Ética', en: 'Technology & Ethics' }, description: { es: '', en: '' } },
      ],
    },
  },
  {
    type: 'services_grid',
    label: 'Servicios',
    icon: '⚕️',
    defaultSettings: {
      eyebrow: { es: 'Nuestros servicios', en: 'Our services' },
      title: { es: 'Especialidades Allura', en: 'Allura Specialties' },
      subtitle: { es: '', en: '' },
    },
  },
  {
    type: 'about_teaser',
    label: 'Sobre nosotros',
    icon: '🏥',
    defaultSettings: {
      eyebrow: { es: 'Nuestra filosofía', en: 'Our philosophy' },
      title: { es: '', en: '' },
      subtitle: { es: '', en: '' },
      body: { es: '', en: '' },
      imageUrl: '',
      ctaLabel: { es: 'Conoce nuestro equipo', en: 'Meet our team' },
    },
  },
  {
    type: 'medellin',
    label: 'Medellín',
    icon: '🌆',
    defaultSettings: {
      eyebrow: { es: 'Por qué Medellín', en: 'Why Medellín' },
      title: { es: '', en: '' },
      subtitle: { es: '', en: '' },
      items: [
        { icon: '🏥', title: { es: 'Excelencia médica', en: 'Medical excellence' }, description: { es: '', en: '' } },
        { icon: '🌤️', title: { es: 'Recuperación más cómoda', en: 'More comfortable recovery' }, description: { es: '', en: '' } },
        { icon: '✈️', title: { es: 'Conectividad y logística', en: 'Connectivity and logistics' }, description: { es: '', en: '' } },
        { icon: '🌿', title: { es: 'Bienestar y experiencia', en: 'Wellness and experience' }, description: { es: '', en: '' } },
      ],
    },
  },
  {
    type: 'team_preview',
    label: 'Equipo',
    icon: '👨‍⚕️',
    defaultSettings: {
      eyebrow: { es: 'Nuestro equipo', en: 'Our team' },
      title: { es: 'Conoce nuestro equipo experto', en: 'Meet our expert team' },
      subtitle: { es: '', en: '' },
    },
  },
  {
    type: 'process',
    label: 'Proceso',
    icon: '📋',
    defaultSettings: {
      eyebrow: { es: 'Cómo funciona', en: 'How it works' },
      title: { es: 'Tu proceso con Allura', en: 'Your journey with Allura' },
      steps: [
        { number: '01', title: { es: 'Cuéntanos tu objetivo', en: 'Share your goals' }, description: { es: '', en: '' } },
        { number: '02', title: { es: 'Consulta virtual', en: 'Virtual consultation' }, description: { es: '', en: '' } },
        { number: '03', title: { es: 'Plan personalizado', en: 'Personalized plan' }, description: { es: '', en: '' } },
        { number: '04', title: { es: 'Tratamiento experto', en: 'Expert treatment' }, description: { es: '', en: '' } },
      ],
    },
  },
  {
    type: 'cta',
    label: 'CTA Banner',
    icon: '📣',
    defaultSettings: {
      eyebrow: { es: 'Da el primer paso', en: 'Take the first step' },
      title: { es: 'Transforma tu bienestar.', en: 'Transform your wellbeing.' },
      subtitle: { es: '', en: '' },
      buttonLabel: { es: 'Contactar ahora', en: 'Contact us now' },
    },
  },
  {
    type: 'testimonials',
    label: 'Testimonios',
    icon: '⭐',
    defaultSettings: {
      eyebrow: { es: 'Lo que dicen nuestros pacientes', en: 'What our patients say' },
      title: { es: 'Experiencias reales, resultados reales', en: 'Real experiences, real results' },
    },
  },
  {
    type: 'faq',
    label: 'Preguntas frecuentes',
    icon: '❓',
    defaultSettings: {
      eyebrow: { es: 'Preguntas frecuentes', en: 'FAQ' },
      title: { es: 'Lo que más nos preguntan', en: 'What people ask us most' },
    },
  },
  {
    type: 'contact_form',
    label: 'Formulario de contacto',
    icon: '📬',
    defaultSettings: {
      eyebrow: { es: 'Hablemos', en: "Let's talk" },
      title: { es: 'Comienza tu experiencia Allura', en: 'Start your Allura experience' },
      subtitle: { es: 'Te respondemos en menos de 24 horas.', en: "We'll respond within 24 hours." },
    },
  },
  {
    type: 'text_image',
    label: 'Texto + imagen',
    icon: '🖼️',
    defaultSettings: {
      title: { es: '', en: '' },
      body: { es: '', en: '' },
      imageUrl: '',
      imagePosition: 'right',
    },
  },
]

export function getSectionDef(type: string): SectionDefinition | undefined {
  return SECTION_REGISTRY.find(s => s.type === type)
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build 2>&1 | grep -E "error|Error" | head -10
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/section-registry.ts
git commit -m "feat(pages): add section registry with 12 section types"
```

---

## Task 3: Preview API route

**Files:**
- Create: `src/app/api/preview/route.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') || '/'
  const locale = request.nextUrl.searchParams.get('locale') || 'es'
  const redirectUrl = new URL(
    `/${locale}${slug === '/' ? '' : slug}?preview=true`,
    request.url
  )
  return NextResponse.redirect(redirectUrl)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/preview/route.ts
git commit -m "feat(pages): add preview API route"
```

---

## Task 4: Seed pages into Supabase

**Files:**
- Create: `supabase/migrations/008_seed_pages.sql`

- [ ] **Step 1: Create the SQL file**

```sql
-- supabase/migrations/008_seed_pages.sql
-- Seeds the 8 main pages so they appear in /admin/paginas

INSERT INTO pages (site_id, title_i18n, slug, type, status, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', '{"es":"Inicio","en":"Home"}',               '/',              'home',    'published', 1),
  ('00000000-0000-0000-0000-000000000001', '{"es":"Sobre nosotros","en":"About us"}',    '/nosotros',      'about',   'published', 2),
  ('00000000-0000-0000-0000-000000000001', '{"es":"Cómo funciona","en":"How it works"}', '/como-funciona', 'landing', 'published', 3),
  ('00000000-0000-0000-0000-000000000001', '{"es":"Contacto","en":"Contact"}',            '/contacto',      'contact', 'published', 4),
  ('00000000-0000-0000-0000-000000000001', '{"es":"Servicios","en":"Services"}',          '/servicios',     'landing', 'published', 5),
  ('00000000-0000-0000-0000-000000000001', '{"es":"Blog","en":"Blog"}',                   '/blog',          'blog',    'published', 6),
  ('00000000-0000-0000-0000-000000000001', '{"es":"Equipo","en":"Team"}',                 '/equipo',        'landing', 'published', 7),
  ('00000000-0000-0000-0000-000000000001', '{"es":"Galería","en":"Gallery"}',             '/galeria',       'landing', 'published', 8)
ON CONFLICT (site_id, slug) DO UPDATE SET title_i18n = EXCLUDED.title_i18n;
```

- [ ] **Step 2: Execute in Supabase SQL Editor**

Copy the SQL above and run it in the Supabase Dashboard → SQL Editor. Expected: 8 rows inserted/updated.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/008_seed_pages.sql
git commit -m "feat(pages): seed 8 main pages into Supabase"
```

---

## Task 5: Install dnd-kit and create SectionTree

**Files:**
- Create: `src/components/admin/SectionTree.tsx`

- [ ] **Step 1: Install drag & drop library**

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 2: Create SectionTree**

```typescript
// src/components/admin/SectionTree.tsx
'use client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getSectionDef } from '@/lib/section-registry'
import type { SectionRow } from '@/lib/supabase/pages'

interface SectionTreeProps {
  sections: SectionRow[]
  activeSectionId: string | null
  onSelect: (section: SectionRow) => void
  onToggleVisible: (id: string, visible: boolean) => void
  onDelete: (id: string) => void
  onReorder: (sections: SectionRow[]) => void
  onAddSection: () => void
}

function SortableItem({
  section,
  isActive,
  onSelect,
  onToggleVisible,
  onDelete,
}: {
  section: SectionRow
  isActive: boolean
  onSelect: () => void
  onToggleVisible: (visible: boolean) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const def = getSectionDef(section.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm mb-1 ${
        isActive ? 'border-[#051c33] bg-[#051c33]/5' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <span {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 select-none">☰</span>
      <span className="text-base">{def?.icon ?? '📄'}</span>
      <span className={`flex-1 font-medium ${isActive ? 'text-[#051c33]' : 'text-gray-700'}`}>
        {def?.label ?? section.type}
      </span>
      <button
        onClick={e => { e.stopPropagation(); onToggleVisible(!section.is_visible) }}
        className="text-gray-400 hover:text-gray-700 text-xs px-1"
        title={section.is_visible ? 'Ocultar' : 'Mostrar'}
      >
        {section.is_visible ? '👁' : '🚫'}
      </button>
      <button
        onClick={e => {
          e.stopPropagation()
          if (confirm('¿Eliminar esta sección?')) onDelete()
        }}
        className="text-red-400 hover:text-red-600 text-xs px-1"
      >
        🗑️
      </button>
    </div>
  )
}

export function SectionTree({
  sections,
  activeSectionId,
  onSelect,
  onToggleVisible,
  onDelete,
  onReorder,
  onAddSection,
}: SectionTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex(s => s.id === active.id)
    const newIndex = sections.findIndex(s => s.id === over.id)
    const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
      ...s,
      sort_order: i,
    }))
    onReorder(reordered)
  }

  return (
    <div>
      <button
        onClick={onAddSection}
        className="w-full mb-3 py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#051c33] hover:text-[#051c33] transition-colors"
      >
        + Agregar sección
      </button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map(section => (
            <SortableItem
              key={section.id}
              section={section}
              isActive={section.id === activeSectionId}
              onSelect={() => onSelect(section)}
              onToggleVisible={v => onToggleVisible(section.id, v)}
              onDelete={() => onDelete(section.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
      {sections.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No hay secciones aún.<br/>Haz clic en "+ Agregar sección".</p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm build 2>&1 | grep -E "error|Error" | head -10
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/SectionTree.tsx
git commit -m "feat(pages): add SectionTree with drag & drop"
```

---

## Task 6: Section form components (12 forms)

**Files:**
- Create: `src/components/admin/section-forms/HeroForm.tsx`
- Create: `src/components/admin/section-forms/BenefitsForm.tsx`
- Create: `src/components/admin/section-forms/ServicesGridForm.tsx`
- Create: `src/components/admin/section-forms/AboutTeaserForm.tsx`
- Create: `src/components/admin/section-forms/MedellinForm.tsx`
- Create: `src/components/admin/section-forms/TeamPreviewForm.tsx`
- Create: `src/components/admin/section-forms/ProcessForm.tsx`
- Create: `src/components/admin/section-forms/CtaForm.tsx`
- Create: `src/components/admin/section-forms/TestimonialsForm.tsx`
- Create: `src/components/admin/section-forms/FaqForm.tsx`
- Create: `src/components/admin/section-forms/ContactFormSectionForm.tsx`
- Create: `src/components/admin/section-forms/TextImageForm.tsx`

All forms share this interface:
```typescript
interface FormProps {
  settings: Record<string, unknown>
  onChange: (settings: Record<string, unknown>) => void
}
```

All forms have ES/EN language tabs. Helper pattern for i18n fields:
```typescript
function updateI18n(settings: Record<string, unknown>, field: string, lang: string, value: string) {
  return { ...settings, [field]: { ...(settings[field] as object), [lang]: value } }
}
```

- [ ] **Step 1: Create HeroForm**

```typescript
// src/components/admin/section-forms/HeroForm.tsx
'use client'
import { useState } from 'react'

interface HeroFormProps {
  settings: Record<string, unknown>
  onChange: (settings: Record<string, unknown>) => void
}

type I18n = { es: string; en: string }
type HeroSettings = {
  eyebrow: I18n; headline1: I18n; headline2: I18n
  subtitle: I18n; ctaPrimary: I18n; ctaSecondary: I18n; imageUrl: string
}

export function HeroForm({ settings, onChange }: HeroFormProps) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as HeroSettings

  const upd = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object), [lang]: value } })

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es','en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>
            {l}
          </button>
        ))}
      </div>
      {[
        ['eyebrow', 'Eyebrow'],
        ['headline1', 'Título línea 1'],
        ['headline2', 'Título línea 2'],
        ['ctaPrimary', 'Botón primario'],
        ['ctaSecondary', 'Botón secundario'],
      ].map(([field, label]) => (
        <div key={field}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[field as keyof HeroSettings] as I18n)?.[lang] ?? ''}
            onChange={e => upd(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Subtítulo</label>
        <textarea value={s.subtitle?.[lang] ?? ''} onChange={e => upd('subtitle', e.target.value)}
          rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">URL imagen de fondo</label>
        <input value={s.imageUrl ?? ''} onChange={e => onChange({ ...settings, imageUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]"
          placeholder="/images/..." />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create BenefitsForm**

```typescript
// src/components/admin/section-forms/BenefitsForm.tsx
'use client'
import { useState } from 'react'

interface BenefitsFormProps { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }
type I18n = { es: string; en: string }

export function BenefitsForm({ settings, onChange }: BenefitsFormProps) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; subtitle: I18n; items: { icon: string; title: I18n; description: I18n }[] }

  const upd = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object), [lang]: value } })
  const updItem = (i: number, field: string, value: string) => {
    const items = [...(s.items ?? [])]
    items[i] = { ...items[i], [field]: { ...(items[i][field as 'title' | 'description'] as object), [lang]: value } }
    onChange({ ...settings, items })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es','en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>
      {[['eyebrow','Eyebrow'],['title','Título'],['subtitle','Subtítulo']].map(([f,label]) => (
        <div key={f}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as keyof typeof s] as I18n)?.[lang] ?? ''} onChange={e => upd(f, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
        </div>
      ))}
      <p className="text-xs font-semibold text-gray-500 uppercase mt-2">Tarjetas</p>
      {(s.items ?? []).map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="text-xs text-gray-400">Tarjeta {i + 1}</p>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Título</label>
            <input value={item.title?.[lang] ?? ''} onChange={e => updItem(i, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#051c33]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Descripción</label>
            <textarea value={item.description?.[lang] ?? ''} onChange={e => updItem(i, 'description', e.target.value)}
              rows={2} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#051c33]" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create simple forms (eyebrow + title only)**

For ServicesGridForm, TeamPreviewForm, TestimonialsForm, FaqForm, ContactFormSectionForm — all follow this same pattern:

```typescript
// src/components/admin/section-forms/ServicesGridForm.tsx
'use client'
import { useState } from 'react'
type I18n = { es: string; en: string }

export function ServicesGridForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; subtitle: I18n }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object), [lang]: v } })
  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es','en'] as const).map(l => <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang===l?'bg-[#051c33] text-white':'bg-gray-100 text-gray-500'}`}>{l}</button>)}
      </div>
      <p className="text-xs text-gray-400">Las tarjetas de servicios se cargan automáticamente de la base de datos.</p>
      {[['eyebrow','Eyebrow'],['title','Título'],['subtitle','Subtítulo']].map(([f,label]) => (
        <div key={f}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as keyof typeof s] as I18n)?.[lang]??''} onChange={e=>upd(f,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
        </div>
      ))}
    </div>
  )
}
```

Create identical files for TeamPreviewForm, TestimonialsForm, FaqForm, ContactFormSectionForm — changing only the export function name, the note text, and the fields shown (TestimonialsForm and FaqForm have only eyebrow+title; ContactFormSectionForm has eyebrow+title+subtitle).

- [ ] **Step 4: Create AboutTeaserForm**

```typescript
// src/components/admin/section-forms/AboutTeaserForm.tsx
'use client'
import { useState } from 'react'
type I18n = { es: string; en: string }

export function AboutTeaserForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; subtitle: I18n; body: I18n; imageUrl: string; ctaLabel: I18n }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object), [lang]: v } })
  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es','en'] as const).map(l => <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang===l?'bg-[#051c33] text-white':'bg-gray-100 text-gray-500'}`}>{l}</button>)}
      </div>
      {[['eyebrow','Eyebrow'],['title','Título'],['subtitle','Subtítulo'],['ctaLabel','Texto botón']].map(([f,label]) => (
        <div key={f}><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as keyof typeof s] as I18n)?.[lang]??''} onChange={e=>upd(f,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" /></div>
      ))}
      <div><label className="block text-xs font-medium text-gray-500 mb-1">Cuerpo de texto</label>
        <textarea value={s.body?.[lang]??''} onChange={e=>upd('body',e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" /></div>
      <div><label className="block text-xs font-medium text-gray-500 mb-1">URL imagen</label>
        <input value={s.imageUrl??''} onChange={e=>onChange({...settings,imageUrl:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" placeholder="/images/..." /></div>
    </div>
  )
}
```

- [ ] **Step 5: Create MedellinForm**

Same structure as BenefitsForm but with 4 items (icon, title, description). Copy BenefitsForm pattern, rename to MedellinForm, change field labels accordingly.

- [ ] **Step 6: Create ProcessForm**

Same structure but items have `number`, `title`, `description` fields (4 steps):

```typescript
// src/components/admin/section-forms/ProcessForm.tsx
'use client'
import { useState } from 'react'
type I18n = { es: string; en: string }
type Step = { number: string; title: I18n; description: I18n }

export function ProcessForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; steps: Step[] }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object), [lang]: v } })
  const updStep = (i: number, field: string, value: string) => {
    const steps = [...(s.steps ?? [])]
    steps[i] = { ...steps[i], [field]: { ...(steps[i][field as 'title'|'description'] as object), [lang]: value } }
    onChange({ ...settings, steps })
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es','en'] as const).map(l => <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang===l?'bg-[#051c33] text-white':'bg-gray-100 text-gray-500'}`}>{l}</button>)}
      </div>
      {[['eyebrow','Eyebrow'],['title','Título']].map(([f,label]) => (
        <div key={f}><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as keyof typeof s] as I18n)?.[lang]??''} onChange={e=>upd(f,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" /></div>
      ))}
      <p className="text-xs font-semibold text-gray-500 uppercase mt-2">Pasos</p>
      {(s.steps??[]).map((step,i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="text-xs text-gray-400">Paso {step.number}</p>
          <div><label className="block text-xs text-gray-500 mb-1">Título</label>
            <input value={step.title?.[lang]??''} onChange={e=>updStep(i,'title',e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#051c33]" /></div>
          <div><label className="block text-xs text-gray-500 mb-1">Descripción</label>
            <textarea value={step.description?.[lang]??''} onChange={e=>updStep(i,'description',e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#051c33]" /></div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 7: Create CtaForm**

```typescript
// src/components/admin/section-forms/CtaForm.tsx
'use client'
import { useState } from 'react'
type I18n = { es: string; en: string }

export function CtaForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; subtitle: I18n; buttonLabel: I18n }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object), [lang]: v } })
  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es','en'] as const).map(l => <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang===l?'bg-[#051c33] text-white':'bg-gray-100 text-gray-500'}`}>{l}</button>)}
      </div>
      {[['eyebrow','Eyebrow'],['title','Título'],['subtitle','Subtítulo'],['buttonLabel','Texto del botón']].map(([f,label]) => (
        <div key={f}><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as keyof typeof s] as I18n)?.[lang]??''} onChange={e=>upd(f,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" /></div>
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Create TextImageForm**

```typescript
// src/components/admin/section-forms/TextImageForm.tsx
'use client'
import { useState } from 'react'
type I18n = { es: string; en: string }

export function TextImageForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { title: I18n; body: I18n; imageUrl: string; imagePosition: 'left' | 'right' }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object), [lang]: v } })
  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es','en'] as const).map(l => <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang===l?'bg-[#051c33] text-white':'bg-gray-100 text-gray-500'}`}>{l}</button>)}
      </div>
      <div><label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
        <input value={s.title?.[lang]??''} onChange={e=>upd('title',e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" /></div>
      <div><label className="block text-xs font-medium text-gray-500 mb-1">Texto</label>
        <textarea value={s.body?.[lang]??''} onChange={e=>upd('body',e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" /></div>
      <div><label className="block text-xs font-medium text-gray-500 mb-1">URL imagen</label>
        <input value={s.imageUrl??''} onChange={e=>onChange({...settings,imageUrl:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" placeholder="/images/..." /></div>
      <div><label className="block text-xs font-medium text-gray-500 mb-1">Posición imagen</label>
        <select value={s.imagePosition??'right'} onChange={e=>onChange({...settings,imagePosition:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]">
          <option value="right">Derecha</option>
          <option value="left">Izquierda</option>
        </select></div>
    </div>
  )
}
```

- [ ] **Step 9: Verify build**

```bash
pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors

- [ ] **Step 10: Commit**

```bash
git add src/components/admin/section-forms/
git commit -m "feat(pages): add 12 section form components"
```

> **💡 /compact recomendado aquí** — punto medio del plan, contexto acumulado considerable.

---

## Task 7: SectionFormRouter

**Files:**
- Create: `src/components/admin/SectionFormRouter.tsx`

- [ ] **Step 1: Create the file**

```typescript
// src/components/admin/SectionFormRouter.tsx
'use client'
import { HeroForm } from './section-forms/HeroForm'
import { BenefitsForm } from './section-forms/BenefitsForm'
import { ServicesGridForm } from './section-forms/ServicesGridForm'
import { AboutTeaserForm } from './section-forms/AboutTeaserForm'
import { MedellinForm } from './section-forms/MedellinForm'
import { TeamPreviewForm } from './section-forms/TeamPreviewForm'
import { ProcessForm } from './section-forms/ProcessForm'
import { CtaForm } from './section-forms/CtaForm'
import { TestimonialsForm } from './section-forms/TestimonialsForm'
import { FaqForm } from './section-forms/FaqForm'
import { ContactFormSectionForm } from './section-forms/ContactFormSectionForm'
import { TextImageForm } from './section-forms/TextImageForm'

interface SectionFormRouterProps {
  type: string
  settings: Record<string, unknown>
  onChange: (settings: Record<string, unknown>) => void
}

export function SectionFormRouter({ type, settings, onChange }: SectionFormRouterProps) {
  const props = { settings, onChange }
  switch (type) {
    case 'hero': return <HeroForm {...props} />
    case 'benefits': return <BenefitsForm {...props} />
    case 'services_grid': return <ServicesGridForm {...props} />
    case 'about_teaser': return <AboutTeaserForm {...props} />
    case 'medellin': return <MedellinForm {...props} />
    case 'team_preview': return <TeamPreviewForm {...props} />
    case 'process': return <ProcessForm {...props} />
    case 'cta': return <CtaForm {...props} />
    case 'testimonials': return <TestimonialsForm {...props} />
    case 'faq': return <FaqForm {...props} />
    case 'contact_form': return <ContactFormSectionForm {...props} />
    case 'text_image': return <TextImageForm {...props} />
    default: return <p className="text-sm text-gray-400 italic">Tipo no reconocido: {type}</p>
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/SectionFormRouter.tsx
git commit -m "feat(pages): add SectionFormRouter"
```

---

## Task 8: PageEditor main component

**Files:**
- Create: `src/components/admin/PageEditor.tsx`

- [ ] **Step 1: Create the file**

```typescript
// src/components/admin/PageEditor.tsx
'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { PageRow, SectionRow } from '@/lib/supabase/pages'
import { SECTION_REGISTRY } from '@/lib/section-registry'
import { SectionTree } from './SectionTree'
import { SectionFormRouter } from './SectionFormRouter'

interface PageEditorProps {
  page: PageRow
  initialSections: SectionRow[]
}

export function PageEditor({ page, initialSections }: PageEditorProps) {
  const router = useRouter()
  const [sections, setSections] = useState<SectionRow[]>(initialSections)
  const [activeSection, setActiveSection] = useState<SectionRow | null>(null)
  const [activeSettings, setActiveSettings] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [previewKey, setPreviewKey] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)

  const locale = 'es'
  const previewUrl = `http://localhost:3000/${locale}${page.slug === '/' ? '' : page.slug}?preview=true`

  function handleSelect(section: SectionRow) {
    setActiveSection(section)
    setActiveSettings(section.settings ?? {})
    setMessage(null)
  }

  async function handleSave() {
    if (!activeSection) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...activeSection, settings: activeSettings }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      const updated: SectionRow = await res.json()
      setSections(prev => prev.map(s => s.id === updated.id ? updated : s))
      setActiveSection(updated)
      setPreviewKey(k => k + 1)
      setMessage('✅ Guardado')
    } catch {
      setMessage('❌ Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleVisible(id: string, visible: boolean) {
    const section = sections.find(s => s.id === id)
    if (!section) return
    await fetch('/api/admin/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...section, is_visible: visible }),
    })
    setSections(prev => prev.map(s => s.id === id ? { ...s, is_visible: visible } : s))
    setPreviewKey(k => k + 1)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/sections?id=${id}`, { method: 'DELETE' })
    setSections(prev => prev.filter(s => s.id !== id))
    if (activeSection?.id === id) { setActiveSection(null); setActiveSettings({}) }
    setPreviewKey(k => k + 1)
  }

  async function handleReorder(reordered: SectionRow[]) {
    setSections(reordered)
    await fetch('/api/admin/sections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reordered.map(s => ({ id: s.id, sort_order: s.sort_order }))),
    })
    setPreviewKey(k => k + 1)
  }

  async function handleAddSection(type: string) {
    const def = SECTION_REGISTRY.find(d => d.type === type)
    if (!def) return
    setShowAddModal(false)
    const res = await fetch('/api/admin/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_id: page.id,
        type,
        sort_order: sections.length,
        is_visible: true,
        settings: def.defaultSettings,
      }),
    })
    const newSection: SectionRow = await res.json()
    setSections(prev => [...prev, newSection])
    handleSelect(newSection)
    setPreviewKey(k => k + 1)
  }

  async function handlePublish() {
    setPublishing(true)
    await fetch(`/api/admin/pages/${page.id}/publish`, { method: 'POST' })
    setPublishing(false)
    setMessage('🚀 Publicado')
    router.refresh()
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left panel */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <button onClick={() => router.push('/admin/paginas')} className="text-gray-400 hover:text-gray-700 text-sm">← Volver</button>
          <span className="text-sm font-semibold text-[#051c33] truncate">{page.title_i18n?.es ?? page.slug}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <SectionTree
            sections={sections}
            activeSectionId={activeSection?.id ?? null}
            onSelect={handleSelect}
            onToggleVisible={handleToggleVisible}
            onDelete={handleDelete}
            onReorder={handleReorder}
            onAddSection={() => setShowAddModal(true)}
          />

          {activeSection && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Editar: {SECTION_REGISTRY.find(d => d.type === activeSection.type)?.label ?? activeSection.type}
              </p>
              <SectionFormRouter
                type={activeSection.type}
                settings={activeSettings}
                onChange={setActiveSettings}
              />
              {message && <p className="text-xs mt-2">{message}</p>}
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-3 w-full py-2 bg-[#051c33] text-white text-sm font-medium rounded-lg hover:bg-[#051c33]/90 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar sección'}
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            {publishing ? 'Publicando...' : '🚀 Publicar página'}
          </button>
        </div>
      </div>

      {/* Right panel — iframe preview */}
      <div className="flex-1 bg-gray-100 relative">
        <iframe
          key={previewKey}
          src={previewUrl}
          className="w-full h-full border-0"
          title="Preview"
        />
      </div>

      {/* Add section modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-[#051c33] mb-4">Agregar sección</h2>
            <div className="grid grid-cols-2 gap-2">
              {SECTION_REGISTRY.map(def => (
                <button
                  key={def.type}
                  onClick={() => handleAddSection(def.type)}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-[#051c33] hover:bg-[#051c33]/5 text-sm text-left transition-colors"
                >
                  <span className="text-xl">{def.icon}</span>
                  <span className="text-gray-700 font-medium">{def.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddModal(false)} className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/PageEditor.tsx
git commit -m "feat(pages): add PageEditor main component with iframe preview"
```

---

## Task 9: Admin API routes for sections

**Files:**
- Create: `src/app/api/admin/sections/route.ts`
- Create: `src/app/api/admin/sections/reorder/route.ts`
- Create: `src/app/api/admin/pages/[id]/publish/route.ts`

The PageEditor calls these API routes (server actions would cause issues in client components).

- [ ] **Step 1: Create sections route**

```typescript
// src/app/api/admin/sections/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { upsertSection, deleteSection } from '@/lib/supabase/pages'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const section = await upsertSection(data)
  return NextResponse.json(section)
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')!
  await deleteSection(id)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Create reorder route**

```typescript
// src/app/api/admin/sections/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { reorderSections } from '@/lib/supabase/pages'

export async function POST(request: NextRequest) {
  const updates = await request.json()
  await reorderSections(updates)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Create publish route**

```typescript
// src/app/api/admin/pages/[id]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { publishPage, getPages } from '@/lib/supabase/pages'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pages = await getPages()
  const page = pages.find(p => p.id === params.id)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await publishPage(page.id, page.slug)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Verify build**

```bash
pnpm build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat(pages): add admin API routes for sections and publish"
```

---

## Task 10: Admin pages list and editor route

**Files:**
- Modify: `src/app/admin/paginas/page.tsx`
- Create: `src/app/admin/paginas/[slug]/page.tsx`

- [ ] **Step 1: Replace pages list placeholder**

```typescript
// src/app/admin/paginas/page.tsx
import { getPages } from '@/lib/supabase/pages'
import Link from 'next/link'

export default async function PaginasPage() {
  const pages = await getPages()

  const statusLabel: Record<string, string> = {
    published: 'Publicada',
    draft: 'Borrador',
    archived: 'Archivada',
  }
  const statusColor: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-600',
    archived: 'bg-red-100 text-red-600',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#051c33]">Páginas</h1>
          <p className="text-sm text-[#8b9fb3] mt-1">Edita el contenido y las secciones de cada página del sitio.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Página</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#051c33]">{page.title_i18n?.es ?? page.slug}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{page.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[page.status] ?? statusColor.draft}`}>
                    {statusLabel[page.status] ?? page.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/paginas/${page.slug === '/' ? 'home' : page.slug.replace(/\//g, '--').replace(/^--/, '')}`}
                    className="px-4 py-2 bg-[#051c33] text-white text-xs font-medium rounded-lg hover:bg-[#051c33]/90"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No hay páginas aún. Ejecuta el seed SQL en Supabase.
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create editor route**

```typescript
// src/app/admin/paginas/[slug]/page.tsx
import { getPageBySlug, getSectionsByPage, upsertPage } from '@/lib/supabase/pages'
import { PageEditor } from '@/components/admin/PageEditor'

export default async function PageEditorRoute({
  params,
}: {
  params: { slug: string }
}) {
  // Convert URL slug back to page slug
  // 'home' → '/', 'nosotros' → '/nosotros', 'servicios--full-mouth-reconstruction' → '/servicios/full-mouth-reconstruction'
  const rawSlug = params.slug
  const pageSlug = rawSlug === 'home' ? '/' : '/' + rawSlug.replace(/--/g, '/')

  let page = await getPageBySlug(pageSlug)
  if (!page) {
    page = await upsertPage({
      slug: pageSlug,
      title_i18n: { es: pageSlug, en: pageSlug },
      type: 'custom',
      status: 'draft',
      sort_order: 99,
    })
  }

  const sections = await getSectionsByPage(page.id)
  return <PageEditor page={page} initialSections={sections} />
}
```

- [ ] **Step 3: Verify build and test navigation**

```bash
pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Open `http://localhost:3000/admin/paginas` — should show the 8 pages list. Click "Editar" on Inicio — should open the editor with iframe preview.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/paginas/
git commit -m "feat(pages): implement admin pages list and PageEditor route"
```

---

## Task 11: Update public section components to accept settings prop

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/BenefitsSection.tsx`
- Modify: `src/components/sections/ServicesPreview.tsx`
- Modify: `src/components/sections/AboutTeaser.tsx`
- Modify: `src/components/sections/MedellinSection.tsx`
- Modify: `src/components/sections/TeamPreview.tsx`
- Modify: `src/components/sections/ProcessSection.tsx`
- Modify: `src/components/sections/CTABanner.tsx`

Each component needs an optional `settings` prop. When settings is provided, use it. When not, fall back to i18n.

- [ ] **Step 1: Read current HeroSection implementation**

Read `src/components/sections/HeroSection.tsx` to understand the current prop structure and i18n usage.

- [ ] **Step 2: Update HeroSection**

Add optional `settings` prop. For each text field, use pattern:
```typescript
const eyebrow = settings?.eyebrow?.[locale as 'es'|'en'] ?? t('heroEyebrow')
const headline1 = settings?.headline1?.[locale as 'es'|'en'] ?? t('heroHeadline1')
```

Full updated signature:
```typescript
interface HeroSectionProps {
  locale: string
  settings?: {
    eyebrow?: { es: string; en: string }
    headline1?: { es: string; en: string }
    headline2?: { es: string; en: string }
    subtitle?: { es: string; en: string }
    ctaPrimary?: { es: string; en: string }
    ctaSecondary?: { es: string; en: string }
    imageUrl?: string
  }
}
```

- [ ] **Step 3: Apply same pattern to all 8 components**

For each component, read the file first, identify all i18n keys used (via `t('...')`), then add the `settings` prop and override each key with `settings?.field?.[locale] ?? t('key')`.

- [ ] **Step 4: Verify build**

```bash
pnpm build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/
git commit -m "feat(pages): add optional settings prop to all public section components"
```

---

## Task 12: SectionRenderer and dynamic public pages

**Files:**
- Create: `src/components/sections/SectionRenderer.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/nosotros/page.tsx`
- Modify: `src/app/[locale]/como-funciona/page.tsx`
- Modify: `src/app/[locale]/contacto/page.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`
- Modify: `src/app/[locale]/equipo/page.tsx`
- Modify: `src/app/[locale]/galeria/page.tsx`

- [ ] **Step 1: Create SectionRenderer**

```typescript
// src/components/sections/SectionRenderer.tsx
import type { SectionRow } from '@/lib/supabase/pages'
import { HeroSection } from './HeroSection'
import { BenefitsSection } from './BenefitsSection'
import { ServicesPreview } from './ServicesPreview'
import { AboutTeaser } from './AboutTeaser'
import { MedellinSection } from './MedellinSection'
import { TeamPreview } from './TeamPreview'
import { ProcessSection } from './ProcessSection'
import { CTABanner } from './CTABanner'

interface SectionRendererProps {
  section: SectionRow
  locale: string
}

export function SectionRenderer({ section, locale }: SectionRendererProps) {
  if (!section.is_visible) return null
  const s = section.settings

  switch (section.type) {
    case 'hero':
      return <HeroSection locale={locale} settings={s as Parameters<typeof HeroSection>[0]['settings']} />
    case 'benefits':
      return <BenefitsSection locale={locale} settings={s as Parameters<typeof BenefitsSection>[0]['settings']} />
    case 'services_grid':
      return <ServicesPreview locale={locale} settings={s as Parameters<typeof ServicesPreview>[0]['settings']} />
    case 'about_teaser':
      return <AboutTeaser locale={locale} settings={s as Parameters<typeof AboutTeaser>[0]['settings']} />
    case 'medellin':
      return <MedellinSection locale={locale} settings={s as Parameters<typeof MedellinSection>[0]['settings']} />
    case 'team_preview':
      return <TeamPreview locale={locale} settings={s as Parameters<typeof TeamPreview>[0]['settings']} />
    case 'process':
      return <ProcessSection locale={locale} settings={s as Parameters<typeof ProcessSection>[0]['settings']} />
    case 'cta':
      return <CTABanner locale={locale} settings={s as Parameters<typeof CTABanner>[0]['settings']} />
    default:
      return null
  }
}
```

- [ ] **Step 2: Update home page**

Read `src/app/[locale]/page.tsx` first, then update:

```typescript
// At the top, add:
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

// In the page component, before the existing return:
const page = await getPageBySlug('/')
const sections = page ? await getSectionsByPage(page.id) : []

if (sections.length > 0) {
  return (
    <>
      {sections.map(section => (
        <SectionRenderer key={section.id} section={section} locale={locale} />
      ))}
    </>
  )
}

// Keep existing hardcoded return as fallback
```

- [ ] **Step 3: Apply same pattern to 6 other pages**

For each page (nosotros, como-funciona, contacto, blog list, equipo list, galeria):
1. Read the file
2. Add import for `getPageBySlug`, `getSectionsByPage`, `SectionRenderer`
3. Fetch page + sections by the page's slug
4. If sections.length > 0: render via SectionRenderer
5. Else: keep existing hardcoded components as fallback

- [ ] **Step 4: Final build check**

```bash
pnpm build
```

Expected: 0 errors, same page count as before (98+)

- [ ] **Step 5: Manual test**

1. Open `http://localhost:3000/admin/paginas` — see 8 pages
2. Click Editar on "Inicio"
3. Click "+ Agregar sección" → select "Hero principal"
4. Edit the eyebrow field → click "Guardar sección"
5. iframe should refresh and show updated text
6. Click "🚀 Publicar página"
7. Open `http://localhost:3000/es` — should show the new content

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/SectionRenderer.tsx
git add src/app/[locale]/page.tsx
git add src/app/[locale]/nosotros/page.tsx
git add src/app/[locale]/como-funciona/page.tsx
git add src/app/[locale]/contacto/page.tsx
git add src/app/[locale]/blog/page.tsx
git add src/app/[locale]/equipo/page.tsx
git add src/app/[locale]/galeria/page.tsx
git commit -m "feat(pages): add SectionRenderer and wire dynamic sections to all public pages"
```

---

## Self-review

**Spec coverage check:**
- ✅ Panel izquierdo + iframe preview → Task 8 (PageEditor)
- ✅ Drag & drop reorder → Task 5 (SectionTree + dnd-kit)
- ✅ Show/hide toggle → Task 5 (SectionTree onToggleVisible)
- ✅ Add section from catalog → Task 8 (modal with SECTION_REGISTRY)
- ✅ 12 section types → Task 6 (12 forms)
- ✅ Bilingüe ES/EN → All forms have lang tabs
- ✅ Preview en iframe → Task 8 (previewKey refresh pattern)
- ✅ Guardar vs Publicar → Task 8 + Task 9 (publish route)
- ✅ Retrocompatibilidad fallback → Task 11 + Task 12
- ✅ Extensibilidad → Task 2 (section-registry.ts) + Task 7 (SectionFormRouter)
- ✅ Seed páginas Supabase → Task 4
- ✅ Blog/Equipo: lista editable desde paginas, detalle desde su CRUD → Task 12 (blog/page.tsx, equipo/page.tsx)

**No placeholders found.**

**Type consistency:** `SectionRow` defined in Task 1, used consistently in Tasks 5, 7, 8, 11, 12. `PageRow` same. `getSectionDef()` defined in Task 2, used in Task 5.
