# Migración Sanity → Supabase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar Sanity CMS por Supabase (Postgres + Auth + Storage) en Allura Healthcare, manteniendo el frontend visualmente idéntico y agregando un panel admin en `/admin` que reemplaza Sanity Studio.

**Architecture:** El sitio público (`/es/*`, `/en/*`) sigue igual visualmente — solo cambia la capa de data-fetching de GROQ queries a funciones Supabase SDK en `src/lib/supabase/`. El panel admin vive en `src/app/admin/` con shadcn/ui, protegido por middleware. Supabase RLS garantiza seguridad a nivel de base de datos.

**Tech Stack:** Next.js 14, Supabase JS v2, shadcn/ui, Zod, React Hook Form, TypeScript, Tailwind CSS

---

## 🧠 Cuándo usar `/compact` y `/clear`

### `/compact`
Úsalo cuando el contexto de conversación se vuelve muy largo pero **necesitas mantener memoria del trabajo ya hecho**. Claude comprime el historial preservando lo esencial.

**Momentos óptimos en este plan:**
- Al terminar la Fase 2 (base de datos) antes de empezar Fase 3
- Al terminar la Fase 5 (CRUDs del panel) antes de Fase 6
- Al terminar la Fase 7 (Storage) antes de Fase 9 (RLS)
- En cualquier punto donde sientas que Claude "se olvida" de decisiones anteriores

**Señal:** La conversación tiene más de 50 mensajes o Claude empieza a contradecir decisiones ya tomadas.

### `/clear`
Úsalo cuando quieres empezar una sesión completamente limpia, **sin memoria de la conversación anterior**. Ideal para empezar una fase nueva en una sesión nueva.

**Momentos óptimos en este plan:**
- Al inicio de cada nueva sesión de trabajo (abres Claude Code al día siguiente)
- Al empezar la Fase 6 (reescritura de queries) — es el módulo más independiente
- Al empezar la Fase 9 (RLS) — trabajo puramente de SQL, no necesita contexto React
- Al empezar la Fase 10 (limpieza Sanity) — destructivo, mejor con mente fresca

**Señal:** Empiezas una nueva sesión de trabajo. Siempre carga el plan con: *"Lee el plan en `docs/superpowers/plans/2026-05-28-sanity-to-supabase-migration.md` y ejecuta la Fase X."*

---

## Mapa de archivos

### Archivos nuevos a crear
```
src/lib/supabase/
  client.ts              — cliente Supabase server-side
  types.ts               — tipos TypeScript compartidos
  siteSettings.ts        — getSiteSettings()
  navigation.ts          — getNavigation()
  homePage.ts            — getHomePage()
  services.ts            — getServices(), getServiceBySlug(), getServiceCategories()
  blog.ts                — getBlogPosts(), getBlogPostBySlug()
  team.ts                — getTeamMembers(), getTeamMemberBySlug()
  testimonials.ts        — getTestimonials()
  faq.ts                 — getFaqs()
  gallery.ts             — getGalleryItems()
  videos.ts              — getVideos()
  popups.ts              — getActivePopup()
  promotions.ts          — getActivePromotions()
  sections.ts            — getSectionsByPage(), reorderSections()
  blocks.ts              — getBlocksBySection()
  redirects.ts           — getRedirects()
  storage.ts             — uploadImage(), getPublicUrl(), deleteImage()
  tracking.ts            — getTrackingScripts()

src/app/admin/
  layout.tsx             — layout del panel con sidebar
  page.tsx               — dashboard
  login/page.tsx         — login con Supabase Auth
  paginas/page.tsx       — listado de páginas
  servicios/page.tsx     — listado de servicios
  servicios/[id]/page.tsx
  blog/page.tsx
  blog/[id]/page.tsx
  equipo/page.tsx
  equipo/[id]/page.tsx
  testimonios/page.tsx
  galeria/page.tsx
  medios/page.tsx        — biblioteca de medios
  faq/page.tsx
  formularios/page.tsx
  redirects/page.tsx
  configuracion/page.tsx
  usuarios/page.tsx

src/components/admin/
  Sidebar.tsx
  AdminHeader.tsx
  ImageUploader.tsx
  MediaLibrary.tsx
  RichTextEditor.tsx
  StatusBadge.tsx
  ConfirmDialog.tsx

supabase/migrations/
  001_sites.sql
  002_profiles_and_roles.sql
  003_pages_sections_blocks.sql
  004_content_tables.sql
  005_forms_and_redirects.sql
  006_rls_policies.sql
  007_storage_policies.sql
  seed.sql
```

### Archivos a modificar
```
src/middleware.ts                    — agregar protección /admin/*
src/app/[locale]/layout.tsx         — remover imports Sanity
src/lib/getSiteSettings.ts          — reescribir con Supabase
src/lib/getTrackingScripts.ts       — reescribir con Supabase
src/app/api/contact/route.ts        — agregar guardado en form_submissions
src/components/analytics/AnalyticsScripts.tsx — leer de Supabase
src/app/[locale]/page.tsx           — reescribir data fetching
src/app/[locale]/blog/page.tsx      — reescribir data fetching
src/app/[locale]/blog/[slug]/page.tsx
src/app/[locale]/equipo/page.tsx
src/app/[locale]/equipo/[slug]/page.tsx
src/app/[locale]/servicios/page.tsx  (y todas las subpáginas)
src/app/[locale]/galeria/page.tsx
src/app/[locale]/como-funciona/page.tsx
src/app/[locale]/contacto/page.tsx
package.json                        — agregar @supabase/supabase-js, eliminar sanity deps
```

### Archivos a eliminar (Fase 10)
```
src/sanity/                         — directorio completo
src/app/studio/                     — directorio completo
src/lib/getSiteSettings.ts          — reemplazado por src/lib/supabase/siteSettings.ts
src/lib/getTrackingScripts.ts       — reemplazado por src/lib/supabase/tracking.ts
```

---

## FASE 1 — Configuración Supabase

### Task 1: Crear rama de trabajo

- [ ] **Paso 1: Crear rama**
```bash
git checkout main
git pull origin main
git checkout -b feature/supabase-migration
```
Expected: rama `feature/supabase-migration` activa

- [ ] **Paso 2: Verificar rama**
```bash
git branch --show-current
```
Expected: `feature/supabase-migration`

---

### Task 2: Instalar dependencias Supabase y shadcn/ui

- [ ] **Paso 1: Instalar Supabase JS**
```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- [ ] **Paso 2: Instalar shadcn/ui**
```bash
pnpm dlx shadcn@latest init
```
Cuando pregunte: style → `default`, base color → `slate`, CSS variables → `yes`

- [ ] **Paso 3: Instalar componentes shadcn necesarios**
```bash
pnpm dlx shadcn@latest add button input label card table badge dialog select textarea toast form
```

- [ ] **Paso 4: Verificar build**
```bash
pnpm build
```
Expected: build exitoso sin errores

- [ ] **Paso 5: Commit**
```bash
git add .
git commit -m "chore: install Supabase JS and shadcn/ui"
```

---

### Task 3: Variables de entorno

- [ ] **Paso 1: Agregar variables a `.env.local`**

Abre `.env.local` y agrega al final:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Obtén estos valores en: Supabase Dashboard → Settings → API

- [ ] **Paso 2: Verificar que `.env.local` está en `.gitignore`**
```bash
grep ".env.local" .gitignore
```
Expected: aparece `.env.local`

- [ ] **Paso 3: Crear cliente Supabase server-side**

Crea `src/lib/supabase/client.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export function createServiceClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Paso 4: Crear cliente browser-side**

Crea `src/lib/supabase/browser-client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Paso 5: Verificar build**
```bash
pnpm build
```

- [ ] **Paso 6: Commit**
```bash
git add src/lib/supabase/ .env.local
git commit -m "feat: add Supabase client setup"
```

---

## FASE 2 — Base de datos

> 💡 **Usa `/compact` al terminar esta fase** antes de empezar Fase 3.

### Task 4: Migración 001 — sites y perfiles

- [ ] **Paso 1: Crear directorio de migraciones**
```bash
mkdir -p supabase/migrations
```

- [ ] **Paso 2: Crear `supabase/migrations/001_sites_and_profiles.sql`**
```sql
-- Sites
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  domain text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles (extiende auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- site_users (rol de cada usuario en cada sitio)
create table public.site_users (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner','admin','editor','viewer')),
  created_at timestamptz not null default now(),
  unique(site_id, user_id)
);

-- trigger: auto-crear profile cuando se registra usuario
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

- [ ] **Paso 3: Ejecutar en Supabase**

Ve a Supabase Dashboard → SQL Editor → pega el contenido → Run.
Expected: "Success. No rows returned"

---

### Task 5: Migración 002 — site_settings y tracking

- [ ] **Paso 1: Crear `supabase/migrations/002_site_settings.sql`**
```sql
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  key text not null,
  value jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, key)
);

-- índice para búsqueda por clave
create index on public.site_settings(site_id, key);
```

- [ ] **Paso 2: Ejecutar en Supabase SQL Editor**
Expected: "Success. No rows returned"

---

### Task 6: Migración 003 — páginas, secciones y bloques

- [ ] **Paso 1: Crear `supabase/migrations/003_pages_sections_blocks.sql`**
```sql
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  title_i18n jsonb not null default '{}',
  slug text not null,
  type text not null default 'custom'
    check (type in ('home','landing','about','service','blog','contact','custom')),
  status text not null default 'draft'
    check (status in ('draft','published','archived')),
  seo_title_i18n jsonb default '{}',
  seo_description_i18n jsonb default '{}',
  seo_image_url text,
  sort_order int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, slug)
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null
    check (type in ('hero','text_image','services_grid','testimonials','gallery',
                    'faq','cta','contact_form','metrics','logos','team','map')),
  title text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  settings jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  type text not null,
  content jsonb default '{}',
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.pages(site_id, status);
create index on public.sections(page_id, sort_order);
create index on public.blocks(section_id, sort_order);
```

- [ ] **Paso 2: Ejecutar en Supabase SQL Editor**
Expected: "Success. No rows returned"

---

### Task 7: Migración 004 — tablas de contenido

- [ ] **Paso 1: Crear `supabase/migrations/004_content_tables.sql`**
```sql
-- Categorías de servicios
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  title_i18n jsonb not null default '{}',
  slug text not null,
  description_i18n jsonb default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique(site_id, slug)
);

-- Servicios
create table public.services (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  category_id uuid references public.service_categories(id),
  title_i18n jsonb not null default '{}',
  slug text not null,
  description_i18n jsonb default '{}',
  body_i18n jsonb default '{}',
  image_url text,
  image_alt_i18n jsonb default '{}',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order int not null default 0,
  seo_title_i18n jsonb default '{}',
  seo_description_i18n jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, slug)
);

-- Blog posts
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  title_i18n jsonb not null default '{}',
  slug text not null,
  excerpt_i18n jsonb default '{}',
  body_i18n jsonb default '{}',
  cover_image_url text,
  cover_image_alt text,
  author text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  seo_title_i18n jsonb default '{}',
  seo_description_i18n jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, slug)
);

-- Equipo
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null,
  slug text not null,
  role_i18n jsonb default '{}',
  bio_i18n jsonb default '{}',
  photo_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, slug)
);

-- Testimonios
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  author_name text not null,
  author_location text,
  content_i18n jsonb not null default '{}',
  rating int check (rating between 1 and 5),
  photo_url text,
  service_id uuid references public.services(id),
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- FAQ
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  question_i18n jsonb not null default '{}',
  answer_i18n jsonb not null default '{}',
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Galería
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  image_url text not null,
  alt_i18n jsonb default '{}',
  caption_i18n jsonb default '{}',
  category text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Videos
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  title_i18n jsonb not null default '{}',
  url text not null,
  thumbnail_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Popups
create table public.popups (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  title_i18n jsonb default '{}',
  body_i18n jsonb default '{}',
  cta_label_i18n jsonb default '{}',
  cta_url text,
  image_url text,
  is_active boolean not null default false,
  delay_seconds int not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Promociones
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  title_i18n jsonb not null default '{}',
  description_i18n jsonb default '{}',
  cta_label_i18n jsonb default '{}',
  cta_url text,
  image_url text,
  is_active boolean not null default false,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media assets
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  uploaded_by uuid references auth.users(id),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  alt_text text,
  size int,
  created_at timestamptz not null default now()
);

-- Navegación
create table public.navigation_menus (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null,
  location text not null check (location in ('header','footer','mobile')),
  created_at timestamptz not null default now()
);

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.navigation_menus(id) on delete cascade,
  label_i18n jsonb not null default '{}',
  url text,
  page_id uuid references public.pages(id),
  parent_id uuid references public.navigation_items(id),
  sort_order int not null default 0,
  open_in_new_tab boolean not null default false,
  is_visible boolean not null default true
);
```

- [ ] **Paso 2: Ejecutar en Supabase SQL Editor**
Expected: "Success. No rows returned"

---

### Task 8: Migración 005 — formularios y redirects

- [ ] **Paso 1: Crear `supabase/migrations/005_forms_and_redirects.sql`**
```sql
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  nombre text not null,
  email text not null,
  telefono text,
  servicio text,
  mensaje text,
  source_page text,
  status text not null default 'nuevo' check (status in ('nuevo','revisado','archivado')),
  created_at timestamptz not null default now()
);

create index on public.form_submissions(site_id, status, created_at desc);

create table public.redirects (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  from_path text not null,
  to_path text not null,
  status_code int not null default 301 check (status_code in (301, 302)),
  created_at timestamptz not null default now(),
  unique(site_id, from_path)
);
```

- [ ] **Paso 2: Ejecutar en Supabase SQL Editor**

- [ ] **Paso 3: Crear seed con datos iniciales**

Crea `supabase/seed.sql`:
```sql
-- Insertar sitio Allura
insert into public.sites (id, name, slug, domain, status)
values (
  '00000000-0000-0000-0000-000000000001',
  'Allura Healthcare',
  'allura',
  'localhost:3000',
  'active'
);

-- Nota: después de crear el usuario admin en Supabase Auth,
-- insertar su site_user manualmente:
-- insert into public.site_users (site_id, user_id, role)
-- values ('00000000-0000-0000-0000-000000000001', 'TU_USER_ID', 'owner');
```

- [ ] **Paso 4: Ejecutar seed en Supabase SQL Editor**

- [ ] **Paso 5: Commit migraciones**
```bash
git add supabase/
git commit -m "feat(db): add all Supabase migrations and seed"
```

> 💡 **Buen momento para `/compact`** — el contexto de migraciones es largo y ya está guardado en los archivos SQL.

---

## FASE 3 — Auth + Middleware

### Task 9: Middleware de protección `/admin`

- [ ] **Paso 1: Reemplazar `src/middleware.ts`**
```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas del panel admin — verificar sesión
  if (ADMIN_PATHS.some(p => pathname.startsWith(p)) && pathname !== '/admin/login') {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  // Rutas públicas — aplicar i18n
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return intlMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Paso 2: Verificar que el dev server arranca**
```bash
pnpm dev
```
Expected: arranca sin errores. Ve a `http://localhost:3000/admin` — debe redirigir a `/admin/login`

- [ ] **Paso 3: Commit**
```bash
git add src/middleware.ts
git commit -m "feat(auth): add admin route protection middleware"
```

---

### Task 10: Página de login

- [ ] **Paso 1: Crear `src/app/admin/login/page.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type LoginData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginData) {
    setLoading(true)
    setError(null)
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaeeef]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#051c33] text-2xl text-center">
            Panel Allura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-[#051c33]">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Paso 2: Probar login**

```bash
pnpm dev
```

1. Crea un usuario en Supabase Dashboard → Authentication → Users → Add User
2. Ve a `http://localhost:3000/admin/login`
3. Ingresa con las credenciales creadas
Expected: redirige a `/admin` (mostrará 404 por ahora — está bien)

- [ ] **Paso 3: Commit**
```bash
git add src/app/admin/
git commit -m "feat(auth): add admin login page"
```

---

### Task 11: Layout del panel admin

- [ ] **Paso 1: Crear `src/components/admin/Sidebar.tsx`**
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, Stethoscope, BookOpen,
  Users, Star, Image, HelpCircle, Mail, ArrowLeftRight,
  Settings, UserCog, LogOut, Video
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/paginas', label: 'Páginas', icon: FileText },
  { href: '/admin/servicios', label: 'Servicios', icon: Stethoscope },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/equipo', label: 'Equipo', icon: Users },
  { href: '/admin/testimonios', label: 'Testimonios', icon: Star },
  { href: '/admin/galeria', label: 'Galería', icon: Image },
  { href: '/admin/medios', label: 'Medios', icon: Video },
  { href: '/admin/faq', label: 'Preguntas frecuentes', icon: HelpCircle },
  { href: '/admin/formularios', label: 'Formularios', icon: Mail },
  { href: '/admin/redirects', label: 'Redirecciones', icon: ArrowLeftRight },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
  { href: '/admin/usuarios', label: 'Usuarios', icon: UserCog },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-[#051c33] flex flex-col">
      <div className="p-6 border-b border-[#8b9fb3]/20">
        <h1 className="text-white font-bold text-lg">Allura Panel</h1>
        <p className="text-[#8b9fb3] text-xs mt-1">Administración del sitio</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-[#8b9fb3]/20 text-white'
                  : 'text-[#8b9fb3] hover:text-white hover:bg-[#8b9fb3]/10'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-[#8b9fb3]/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8b9fb3] hover:text-white hover:bg-[#8b9fb3]/10 w-full transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Paso 2: Crear `src/app/admin/layout.tsx`**
```typescript
import { Sidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#eaeeef]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Paso 3: Crear `src/app/admin/page.tsx`**
```typescript
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">Dashboard</h1>
      <p className="text-[#8b9fb3]">Panel administrativo de Allura Healthcare.</p>
    </div>
  )
}
```

- [ ] **Paso 4: Probar en browser**
```bash
pnpm dev
```
Ve a `http://localhost:3000/admin` — debe mostrar el sidebar y el dashboard.

- [ ] **Paso 5: Commit**
```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat(admin): add admin layout and sidebar"
```

---

## FASE 4 — Capa de datos pública (Supabase SDK)

> 💡 **Usa `/clear` al empezar esta fase en una nueva sesión.** Carga el plan con: *"Lee el plan en `docs/superpowers/plans/2026-05-28-sanity-to-supabase-migration.md` y ejecuta la Fase 4."*

### Task 12: Tipos TypeScript compartidos

- [ ] **Paso 1: Crear `src/lib/supabase/types.ts`**
```typescript
export type Locale = 'es' | 'en'

export type I18nField = { es: string; en: string }

export function i18n(field: I18nField | null | undefined, locale: Locale): string {
  if (!field) return ''
  return field[locale] || field.es || ''
}

export interface SiteSettings {
  siteName: string
  tagline: I18nField
  logoUrl: string
  logoAlt: string
  logoLightUrl?: string
  contactEmail: string
  whatsappNumber: string
  whatsappMessage: I18nField
  responseTime: I18nField
  address?: string
  socialInstagram?: string
  socialFacebook?: string
  socialLinkedin?: string
  socialYoutube?: string
  socialTiktok?: string
  seoTitle?: I18nField
  seoDescription?: I18nField
  seoImageUrl?: string
}

export interface TrackingScripts {
  googleAnalyticsId?: string
  gtmContainerId?: string
  metaPixelId?: string
  tiktokPixelId?: string
  googleAdsId?: string
  hotjarId?: string
  clarityId?: string
  googleSearchConsoleVerification?: string
}

export interface Service {
  id: string
  title: I18nField
  slug: string
  description: I18nField
  body: I18nField
  imageUrl?: string
  imageAlt: I18nField
  categoryId?: string
  status: 'draft' | 'published' | 'archived'
  seoTitle: I18nField
  seoDescription: I18nField
}

export interface ServiceCategory {
  id: string
  title: I18nField
  slug: string
  description: I18nField
}

export interface BlogPost {
  id: string
  title: I18nField
  slug: string
  excerpt: I18nField
  body: I18nField
  coverImageUrl?: string
  coverImageAlt?: string
  author?: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  seoTitle: I18nField
  seoDescription: I18nField
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  role: I18nField
  bio: I18nField
  photoUrl?: string
  sortOrder: number
}

export interface Testimonial {
  id: string
  authorName: string
  authorLocation?: string
  content: I18nField
  rating?: number
  photoUrl?: string
}

export interface Faq {
  id: string
  question: I18nField
  answer: I18nField
  sortOrder: number
}

export interface GalleryItem {
  id: string
  imageUrl: string
  alt: I18nField
  caption: I18nField
  category?: string
  sortOrder: number
}

export interface Video {
  id: string
  title: I18nField
  url: string
  thumbnailUrl?: string
  sortOrder: number
}

export interface Popup {
  id: string
  title: I18nField
  body: I18nField
  ctaLabel: I18nField
  ctaUrl?: string
  imageUrl?: string
  delaySeconds: number
}

export interface Promotion {
  id: string
  title: I18nField
  description: I18nField
  ctaLabel: I18nField
  ctaUrl?: string
  imageUrl?: string
  validFrom?: string
  validUntil?: string
}

export interface FormSubmission {
  id: string
  nombre: string
  email: string
  telefono?: string
  servicio?: string
  mensaje?: string
  sourcePage?: string
  status: 'nuevo' | 'revisado' | 'archivado'
  createdAt: string
}

export interface Redirect {
  fromPath: string
  toPath: string
  statusCode: 301 | 302
}
```

- [ ] **Paso 2: Commit**
```bash
git add src/lib/supabase/types.ts
git commit -m "feat(types): add shared Supabase TypeScript types"
```

---

### Task 13: `getSiteSettings` desde Supabase

- [ ] **Paso 1: Crear `src/lib/supabase/siteSettings.ts`**
```typescript
import { createClient } from './client'
import type { SiteSettings, TrackingScripts } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('site_id', SITE_ID)

  if (error || !data) return null

  const map = Object.fromEntries(data.map(r => [r.key, r.value]))

  return {
    siteName: map.site_name ?? 'Allura Healthcare',
    tagline: map.tagline ?? { es: '', en: '' },
    logoUrl: map.logo_url ?? '',
    logoAlt: map.logo_alt ?? 'Allura Healthcare',
    logoLightUrl: map.logo_light_url,
    contactEmail: map.contact_email ?? '',
    whatsappNumber: map.whatsapp_number ?? '',
    whatsappMessage: map.whatsapp_message ?? { es: '', en: '' },
    responseTime: map.response_time ?? { es: '', en: '' },
    address: map.address,
    socialInstagram: map.social_instagram,
    socialFacebook: map.social_facebook,
    socialLinkedin: map.social_linkedin,
    socialYoutube: map.social_youtube,
    socialTiktok: map.social_tiktok,
    seoTitle: map.seo_title,
    seoDescription: map.seo_description,
    seoImageUrl: map.seo_image_url,
  }
}

export async function getTrackingScripts(): Promise<TrackingScripts | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('site_id', SITE_ID)
    .in('key', [
      'ga_measurement_id', 'gtm_container_id', 'meta_pixel_id',
      'tiktok_pixel_id', 'google_ads_id', 'hotjar_id', 'clarity_id',
      'google_search_console'
    ])

  if (error || !data) return null
  const map = Object.fromEntries(data.map(r => [r.key, r.value]))

  return {
    googleAnalyticsId: map.ga_measurement_id,
    gtmContainerId: map.gtm_container_id,
    metaPixelId: map.meta_pixel_id,
    tiktokPixelId: map.tiktok_pixel_id,
    googleAdsId: map.google_ads_id,
    hotjarId: map.hotjar_id,
    clarityId: map.clarity_id,
    googleSearchConsoleVerification: map.google_search_console,
  }
}

export function buildWhatsAppUrl(settings: SiteSettings | null, locale: 'es' | 'en'): string {
  const FALLBACK = 'https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare'
  if (!settings?.whatsappNumber) return FALLBACK
  const number = settings.whatsappNumber.replace(/\D/g, '')
  const message = settings.whatsappMessage?.[locale] || settings.whatsappMessage?.es || ''
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
```

- [ ] **Paso 2: Modificar `src/lib/getSiteSettings.ts`** para re-exportar desde Supabase (compatibilidad temporal):
```typescript
// Wrapper temporal — redirige a la implementación Supabase
export { getSiteSettings, buildWhatsAppUrl } from '@/lib/supabase/siteSettings'
```

- [ ] **Paso 3: Modificar `src/lib/getTrackingScripts.ts`**:
```typescript
export { getTrackingScripts } from '@/lib/supabase/siteSettings'
```

- [ ] **Paso 4: Verificar build**
```bash
pnpm build
```
Expected: build exitoso. Nota: el sitio mostrará valores vacíos hasta insertar datos en Supabase — es normal.

- [ ] **Paso 5: Commit**
```bash
git add src/lib/supabase/siteSettings.ts src/lib/getSiteSettings.ts src/lib/getTrackingScripts.ts
git commit -m "feat(data): getSiteSettings and getTrackingScripts from Supabase"
```

---

### Task 14: Data fetchers — servicios, blog, equipo, testimonios, FAQ, galería

- [ ] **Paso 1: Crear `src/lib/supabase/services.ts`**
```typescript
import { createClient } from './client'
import type { Service, ServiceCategory } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

function mapService(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    title: (row.title_i18n ?? {}) as Service['title'],
    slug: row.slug as string,
    description: (row.description_i18n ?? {}) as Service['description'],
    body: (row.body_i18n ?? {}) as Service['body'],
    imageUrl: row.image_url as string | undefined,
    imageAlt: (row.image_alt_i18n ?? {}) as Service['imageAlt'],
    categoryId: row.category_id as string | undefined,
    status: row.status as Service['status'],
    seoTitle: (row.seo_title_i18n ?? {}) as Service['seoTitle'],
    seoDescription: (row.seo_description_i18n ?? {}) as Service['seoDescription'],
  }
}

export async function getServices(): Promise<Service[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('status', 'published')
    .order('sort_order')
  return (data ?? []).map(mapService)
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data ? mapService(data) : null
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('service_categories')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('sort_order')
  return (data ?? []).map(row => ({
    id: row.id,
    title: row.title_i18n ?? {},
    slug: row.slug,
    description: row.description_i18n ?? {},
  }))
}
```

- [ ] **Paso 2: Crear `src/lib/supabase/blog.ts`**
```typescript
import { createClient } from './client'
import type { BlogPost } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

function mapPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    title: (row.title_i18n ?? {}) as BlogPost['title'],
    slug: row.slug as string,
    excerpt: (row.excerpt_i18n ?? {}) as BlogPost['excerpt'],
    body: (row.body_i18n ?? {}) as BlogPost['body'],
    coverImageUrl: row.cover_image_url as string | undefined,
    coverImageAlt: row.cover_image_alt as string | undefined,
    author: row.author as string | undefined,
    status: row.status as BlogPost['status'],
    publishedAt: row.published_at as string | undefined,
    seoTitle: (row.seo_title_i18n ?? {}) as BlogPost['seoTitle'],
    seoDescription: (row.seo_description_i18n ?? {}) as BlogPost['seoDescription'],
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  return (data ?? []).map(mapPost)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data ? mapPost(data) : null
}
```

- [ ] **Paso 3: Crear `src/lib/supabase/team.ts`**
```typescript
import { createClient } from './client'
import type { TeamMember } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

function mapMember(row: Record<string, unknown>): TeamMember {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    role: (row.role_i18n ?? {}) as TeamMember['role'],
    bio: (row.bio_i18n ?? {}) as TeamMember['bio'],
    photoUrl: row.photo_url as string | undefined,
    sortOrder: row.sort_order as number,
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  return (data ?? []).map(mapMember)
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .single()
  return data ? mapMember(data) : null
}
```

- [ ] **Paso 4: Crear `src/lib/supabase/content.ts`** (testimonios, FAQ, galería, videos, popups, promociones)
```typescript
import { createClient } from './client'
import type { Testimonial, Faq, GalleryItem, Video, Popup, Promotion } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  return (data ?? []).map(row => ({
    id: row.id,
    authorName: row.author_name,
    authorLocation: row.author_location,
    content: row.content_i18n ?? {},
    rating: row.rating,
    photoUrl: row.photo_url,
  }))
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  return (data ?? []).map(row => ({
    id: row.id,
    question: row.question_i18n ?? {},
    answer: row.answer_i18n ?? {},
    sortOrder: row.sort_order,
  }))
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  return (data ?? []).map(row => ({
    id: row.id,
    imageUrl: row.image_url,
    alt: row.alt_i18n ?? {},
    caption: row.caption_i18n ?? {},
    category: row.category,
    sortOrder: row.sort_order,
  }))
}

export async function getVideos(): Promise<Video[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('videos')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  return (data ?? []).map(row => ({
    id: row.id,
    title: row.title_i18n ?? {},
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    sortOrder: row.sort_order,
  }))
}

export async function getActivePopup(): Promise<Popup | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('popups')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_active', true)
    .single()
  if (!data) return null
  return {
    id: data.id,
    title: data.title_i18n ?? {},
    body: data.body_i18n ?? {},
    ctaLabel: data.cta_label_i18n ?? {},
    ctaUrl: data.cta_url,
    imageUrl: data.image_url,
    delaySeconds: data.delay_seconds,
  }
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const now = new Date().toISOString()
  const supabase = createClient()
  const { data } = await supabase
    .from('promotions')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_active', true)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
  return (data ?? []).map(row => ({
    id: row.id,
    title: row.title_i18n ?? {},
    description: row.description_i18n ?? {},
    ctaLabel: row.cta_label_i18n ?? {},
    ctaUrl: row.cta_url,
    imageUrl: row.image_url,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
  }))
}

export async function getRedirects() {
  const supabase = createClient()
  const { data } = await supabase
    .from('redirects')
    .select('from_path, to_path, status_code')
    .eq('site_id', SITE_ID)
  return (data ?? []).map(row => ({
    fromPath: row.from_path,
    toPath: row.to_path,
    statusCode: row.status_code as 301 | 302,
  }))
}
```

- [ ] **Paso 5: Verificar build**
```bash
pnpm build
```

- [ ] **Paso 6: Commit**
```bash
git add src/lib/supabase/
git commit -m "feat(data): add all Supabase data fetchers"
```

---

## FASE 5 — Actualizar páginas públicas

> 💡 **Usa `/compact` antes de esta fase si el contexto es largo.**

### Task 15: Actualizar `AnalyticsScripts` y `api/contact`

- [ ] **Paso 1: Modificar `src/components/analytics/AnalyticsScripts.tsx`**

Reemplaza la línea de import:
```typescript
// Antes:
import { getTrackingScripts } from '@/lib/getTrackingScripts'
// Después:
import { getTrackingScripts } from '@/lib/supabase/siteSettings'
```
El resto del componente queda idéntico.

- [ ] **Paso 2: Modificar `src/app/api/contact/route.ts`**

Agrega el guardado en Supabase después de la validación y antes del envío de email. Reemplaza la función `POST`:
```typescript
import { createServiceClient } from '@/lib/supabase/client'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })

  const result = contactSchema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  // Guardar lead en Supabase
  const supabase = createServiceClient()
  await supabase.from('form_submissions').insert({
    site_id: SITE_ID,
    nombre: result.data.nombre,
    email: result.data.email,
    telefono: result.data.telefono,
    servicio: result.data.servicio,
    mensaje: result.data.mensaje,
    source_page: request.headers.get('referer') ?? '',
    status: 'nuevo',
  })

  // Envío de email (código existente — sin cambios)
  const settings = await getSiteSettings()
  const toEmail = settings?.contactEmail || process.env.SMTP_USER!
  // ... resto del código de nodemailer sin cambios
```

- [ ] **Paso 3: Verificar build**
```bash
pnpm build
```

- [ ] **Paso 4: Commit**
```bash
git add src/components/analytics/ src/app/api/contact/
git commit -m "feat: connect AnalyticsScripts and contact form to Supabase"
```

---

### Task 16: Actualizar páginas de blog, equipo, galería

Las páginas de blog, equipo y galería actualmente importan desde `@/sanity/lib/`. Se actualizan para usar los nuevos fetchers.

- [ ] **Paso 1: Actualizar `src/app/[locale]/blog/page.tsx`**

Reemplaza el data fetching:
```typescript
// Antes:
import { client } from "@/sanity/lib/client"
import { blogPostsQuery } from "@/sanity/lib/queries"
// Después:
import { getBlogPosts } from "@/lib/supabase/blog"
import { i18n } from "@/lib/supabase/types"
```

En el componente, reemplaza `client.fetch(blogPostsQuery)` por `getBlogPosts()` y adapta los campos usando el helper `i18n(post.title, locale)`.

- [ ] **Paso 2: Actualizar `src/app/[locale]/blog/[slug]/page.tsx`** de la misma manera usando `getBlogPostBySlug(slug)`.

- [ ] **Paso 3: Actualizar `src/app/[locale]/equipo/page.tsx`** usando `getTeamMembers()`.

- [ ] **Paso 4: Actualizar `src/app/[locale]/equipo/[slug]/page.tsx`** usando `getTeamMemberBySlug(slug)`.

- [ ] **Paso 5: Actualizar `src/app/[locale]/galeria/page.tsx`** usando `getGalleryItems()`.

- [ ] **Paso 6: Verificar build**
```bash
pnpm build
```

- [ ] **Paso 7: Commit**
```bash
git add src/app/
git commit -m "feat(pages): update blog, team and gallery to read from Supabase"
```

---

### Task 17: Actualizar páginas de servicios y página principal

- [ ] **Paso 1: Actualizar `src/app/[locale]/servicios/page.tsx`** y todas las subpáginas de servicios (24 páginas) usando `getServices()` y `getServiceBySlug(slug)`.

- [ ] **Paso 2: Actualizar `src/app/[locale]/page.tsx`**

Reemplaza los dos `client.fetch()` por:
```typescript
import { getSiteSettings } from '@/lib/supabase/siteSettings'
import { getTestimonials } from '@/lib/supabase/content'
// Datos de secciones del home se obtienen de site_settings o hardcoded temporalmente
```

- [ ] **Paso 3: Actualizar `src/app/[locale]/como-funciona/page.tsx`** usando `getFaqs()`.

- [ ] **Paso 4: Verificar que ninguna página importa desde `@/sanity`**
```bash
grep -r "@/sanity" src/app --include="*.tsx" --include="*.ts"
```
Expected: sin resultados (excepto `src/app/studio/` que se elimina en Fase 10)

- [ ] **Paso 5: Verificar build**
```bash
pnpm build
```
Expected: build exitoso

- [ ] **Paso 6: Commit**
```bash
git add src/app/
git commit -m "feat(pages): update all public pages to read from Supabase"
```

---

## FASE 6 — Storage de imágenes

> 💡 **Usa `/clear` al empezar esta fase en sesión nueva.**

### Task 18: Configurar Supabase Storage

- [ ] **Paso 1: Crear bucket en Supabase Dashboard**

Ve a Supabase → Storage → New Bucket:
- Name: `allura-media`
- Public: ✅ (marcado)
- File size limit: `10485760` (10 MB)
- Allowed MIME types: `image/jpeg,image/png,image/webp,image/svg+xml,application/pdf`

- [ ] **Paso 2: Crear `src/lib/supabase/storage.ts`**
```typescript
import { createBrowserSupabaseClient } from './browser-client'

const BUCKET = 'allura-media'
const SITE_ID = '00000000-0000-0000-0000-000000000001'

export function getPublicUrl(path: string): string {
  const supabase = createBrowserSupabaseClient()
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadImage(
  file: File,
  folder: 'services' | 'blog' | 'team' | 'gallery' | 'site'
): Promise<{ url: string; path: string } | null> {
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!ALLOWED.includes(file.type)) throw new Error('Tipo de archivo no permitido')
  if (file.size > 10 * 1024 * 1024) throw new Error('El archivo supera 10 MB')

  const ext = file.name.split('.').pop()
  const path = `${SITE_ID}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) return null

  return { url: getPublicUrl(path), path }
}

export async function deleteImage(path: string): Promise<boolean> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  return !error
}
```

- [ ] **Paso 3: Commit**
```bash
git add src/lib/supabase/storage.ts
git commit -m "feat(storage): add Supabase Storage helpers"
```

---

### Task 19: Componente `ImageUploader`

- [ ] **Paso 1: Crear `src/components/admin/ImageUploader.tsx`**
```typescript
'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface Props {
  folder: 'services' | 'blog' | 'team' | 'gallery' | 'site'
  currentUrl?: string
  onUpload: (url: string, path: string) => void
  label?: string
}

export function ImageUploader({ folder, currentUrl, onUpload, label = 'Subir imagen' }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setLoading(true)
    try {
      const result = await uploadImage(file, folder)
      if (!result) throw new Error('Error al subir')
      setPreview(result.url)
      onUpload(result.url, result.path)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir imagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-40 h-32 rounded-lg overflow-hidden border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        <Upload size={16} className="mr-2" />
        {loading ? 'Subiendo...' : label}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

- [ ] **Paso 2: Commit**
```bash
git add src/components/admin/ImageUploader.tsx
git commit -m "feat(admin): add ImageUploader component"
```

---

## FASE 7 — CRUDs del panel admin

> 💡 **Usa `/compact` antes de esta fase.** Es la más larga — el contexto se acumula.

### Task 20: CRUD de servicios (ejemplo patrón para todos los CRUDs)

- [ ] **Paso 1: Crear `src/app/admin/servicios/page.tsx`**
```typescript
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminServicesPage() {
  const supabase = createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, title_i18n, slug, status, sort_order')
    .eq('site_id', SITE_ID)
    .order('sort_order')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Servicios</h1>
        <Link href="/admin/servicios/nuevo">
          <Button className="bg-[#051c33]">
            <Plus size={16} className="mr-2" /> Agregar servicio
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eaeeef] text-[#051c33] text-sm">
            <tr>
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">URL</th>
              <th className="text-left p-4">Estado</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {(services ?? []).map(s => (
              <tr key={s.id} className="border-t border-[#eaeeef]">
                <td className="p-4 text-[#051c33]">{s.title_i18n?.es ?? '—'}</td>
                <td className="p-4 text-[#8b9fb3] text-sm">/servicios/{s.slug}</td>
                <td className="p-4">
                  <Badge variant={s.status === 'published' ? 'default' : 'secondary'}>
                    {s.status === 'published' ? 'Publicado' : s.status === 'draft' ? 'Borrador' : 'Archivado'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/servicios/${s.id}`} className="text-[#8b9fb3] hover:text-[#051c33] text-sm">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Paso 2: Crear `src/app/admin/servicios/[id]/page.tsx`**

Este patrón se repite para blog, equipo, testimonios, FAQ, galería:
```typescript
import { createClient } from '@/lib/supabase/client'
import { ServiceForm } from './ServiceForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const isNew = params.id === 'nuevo'

  const { data: service } = isNew ? { data: null } : await supabase
    .from('services')
    .select('*')
    .eq('id', params.id)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">
        {isNew ? 'Nuevo servicio' : 'Editar servicio'}
      </h1>
      <ServiceForm service={service} siteId={SITE_ID} />
    </div>
  )
}
```

- [ ] **Paso 3: Crear `src/app/admin/servicios/[id]/ServiceForm.tsx`**
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useState } from 'react'

const serviceSchema = z.object({
  title_es: z.string().min(2, 'Requerido'),
  title_en: z.string().min(2, 'Requerido'),
  slug: z.string().min(2, 'Requerido').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})
type ServiceFormData = z.infer<typeof serviceSchema>

interface Props {
  service: Record<string, unknown> | null
  siteId: string
}

export function ServiceForm({ service, siteId }: Props) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(service?.image_url as string ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title_es: (service?.title_i18n as Record<string, string>)?.es ?? '',
      title_en: (service?.title_i18n as Record<string, string>)?.en ?? '',
      slug: service?.slug as string ?? '',
      description_es: (service?.description_i18n as Record<string, string>)?.es ?? '',
      description_en: (service?.description_i18n as Record<string, string>)?.en ?? '',
      status: (service?.status as ServiceFormData['status']) ?? 'draft',
    },
  })

  async function onSubmit(data: ServiceFormData) {
    setSaving(true)
    setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      title_i18n: { es: data.title_es, en: data.title_en },
      slug: data.slug,
      description_i18n: { es: data.description_es ?? '', en: data.description_en ?? '' },
      status: data.status,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    }
    const { error } = service
      ? await supabase.from('services').update(payload).eq('id', service.id)
      : await supabase.from('services').insert({ ...payload })
    if (error) { setError('Error al guardar'); setSaving(false); return }
    router.push('/admin/servicios')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Título (Español)</Label>
          <Input {...register('title_es')} />
          {errors.title_es && <p className="text-red-500 text-sm">{errors.title_es.message}</p>}
        </div>
        <div>
          <Label>Title (English)</Label>
          <Input {...register('title_en')} />
          {errors.title_en && <p className="text-red-500 text-sm">{errors.title_en.message}</p>}
        </div>
      </div>
      <div>
        <Label>URL del servicio (slug)</Label>
        <Input {...register('slug')} placeholder="ej: implantes-dentales" />
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Descripción (Español)</Label>
          <Textarea {...register('description_es')} rows={4} />
        </div>
        <div>
          <Label>Description (English)</Label>
          <Textarea {...register('description_en')} rows={4} />
        </div>
      </div>
      <div>
        <Label>Imagen principal</Label>
        <ImageUploader
          folder="services"
          currentUrl={imageUrl}
          onUpload={(url) => setImageUrl(url)}
        />
      </div>
      <div>
        <Label>Estado</Label>
        <Select
          defaultValue={service?.status as string ?? 'draft'}
          onValueChange={(v) => setValue('status', v as ServiceFormData['status'])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="archived">Archivado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-[#051c33]">
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/servicios')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Paso 4: Aplicar el mismo patrón (listado + form) para:**
  - `/admin/blog` — usando `blog_posts`
  - `/admin/equipo` — usando `team_members`
  - `/admin/testimonios` — usando `testimonials`
  - `/admin/faq` — usando `faqs`
  - `/admin/galeria` — usando `gallery_items`

- [ ] **Paso 5: Crear `src/app/admin/formularios/page.tsx`**
```typescript
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function FormuliosPage() {
  const supabase = createClient()
  const { data: leads } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">Formularios recibidos</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaeeef] text-[#051c33]">
            <tr>
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Servicio</th>
              <th className="text-left p-4">Fecha</th>
              <th className="text-left p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map(lead => (
              <tr key={lead.id} className="border-t border-[#eaeeef]">
                <td className="p-4 text-[#051c33]">{lead.nombre}</td>
                <td className="p-4 text-[#8b9fb3]">{lead.email}</td>
                <td className="p-4 text-[#8b9fb3]">{lead.servicio ?? '—'}</td>
                <td className="p-4 text-[#8b9fb3]">
                  {new Date(lead.created_at).toLocaleDateString('es-CO')}
                </td>
                <td className="p-4">
                  <Badge variant={lead.status === 'nuevo' ? 'default' : 'secondary'}>
                    {lead.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Paso 6: Crear `src/app/admin/configuracion/page.tsx`**

Formulario que lee y escribe claves de `site_settings` (siteName, logo, contactEmail, whatsappNumber, redes sociales, analytics IDs). Usa el mismo patrón de form con `react-hook-form` + `zod` + `createBrowserSupabaseClient()` para hacer upsert en la tabla `site_settings`.

- [ ] **Paso 7: Crear `src/app/admin/usuarios/page.tsx`**

Lista usuarios de `site_users` con sus roles. Permite cambiar rol (select) y eliminar (solo visible para owner/admin). Valida rol en server component antes de renderizar opciones de administración.

- [ ] **Paso 8: Verificar build**
```bash
pnpm build
```

- [ ] **Paso 9: Commit**
```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat(admin): add CRUD pages for all content types"
```

---

## FASE 8 — RLS

> 💡 **Usa `/clear` al empezar esta fase.** Es puramente SQL — contexto React no necesario.

### Task 21: Políticas RLS

- [ ] **Paso 1: Crear `supabase/migrations/006_rls_policies.sql`**
```sql
-- Activar RLS en todas las tablas
alter table public.sites enable row level security;
alter table public.profiles enable row level security;
alter table public.site_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.sections enable row level security;
alter table public.blocks enable row level security;
alter table public.services enable row level security;
alter table public.service_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.gallery_items enable row level security;
alter table public.videos enable row level security;
alter table public.popups enable row level security;
alter table public.promotions enable row level security;
alter table public.media_assets enable row level security;
alter table public.navigation_menus enable row level security;
alter table public.navigation_items enable row level security;
alter table public.form_submissions enable row level security;
alter table public.redirects enable row level security;

-- Helper: obtener rol del usuario en un sitio
create or replace function public.get_user_role(p_site_id uuid)
returns text language sql security definer stable
as $$
  select role from public.site_users
  where site_id = p_site_id and user_id = auth.uid()
  limit 1;
$$;

-- LECTURA PÚBLICA — sitio público puede leer contenido publicado
create policy "public_read_published_pages" on public.pages
  for select using (status = 'published');

create policy "public_read_published_services" on public.services
  for select using (status = 'published');

create policy "public_read_published_blog" on public.blog_posts
  for select using (status = 'published');

create policy "public_read_visible_sections" on public.sections
  for select using (is_visible = true);

create policy "public_read_visible_blocks" on public.blocks
  for select using (is_visible = true);

create policy "public_read_visible_team" on public.team_members
  for select using (is_visible = true);

create policy "public_read_visible_testimonials" on public.testimonials
  for select using (is_visible = true);

create policy "public_read_visible_faqs" on public.faqs
  for select using (is_visible = true);

create policy "public_read_visible_gallery" on public.gallery_items
  for select using (is_visible = true);

create policy "public_read_visible_videos" on public.videos
  for select using (is_visible = true);

create policy "public_read_active_popups" on public.popups
  for select using (is_active = true);

create policy "public_read_active_promotions" on public.promotions
  for select using (is_active = true);

create policy "public_read_service_categories" on public.service_categories
  for select using (true);

create policy "public_read_nav_menus" on public.navigation_menus
  for select using (true);

create policy "public_read_nav_items" on public.navigation_items
  for select using (is_visible = true);

create policy "public_read_site_settings" on public.site_settings
  for select using (true);

create policy "public_read_redirects" on public.redirects
  for select using (true);

-- FORMULARIOS — visitante puede insertar, no leer
create policy "public_insert_form_submissions" on public.form_submissions
  for insert with check (true);

create policy "admin_read_form_submissions" on public.form_submissions
  for select using (
    get_user_role(site_id) in ('owner', 'admin', 'editor', 'viewer')
  );

create policy "admin_update_form_submission_status" on public.form_submissions
  for update using (
    get_user_role(site_id) in ('owner', 'admin', 'editor')
  );

-- PANEL ADMIN — usuarios autenticados pueden editar su sitio
create policy "site_users_read_own" on public.site_users
  for select using (user_id = auth.uid());

create policy "editor_write_services" on public.services
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_blog" on public.blog_posts
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_team" on public.team_members
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_testimonials" on public.testimonials
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_faqs" on public.faqs
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_gallery" on public.gallery_items
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_videos" on public.videos
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_pages" on public.pages
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

create policy "editor_write_sections" on public.sections
  for all using (
    get_user_role((select site_id from public.pages where id = sections.page_id)) in ('owner','admin','editor')
  );

create policy "editor_write_media" on public.media_assets
  for all using (get_user_role(site_id) in ('owner', 'admin', 'editor'));

-- ADMIN — solo owner/admin pueden cambiar configuración y usuarios
create policy "admin_write_site_settings" on public.site_settings
  for all using (get_user_role(site_id) in ('owner', 'admin'));

create policy "admin_write_site_users" on public.site_users
  for all using (get_user_role(site_id) in ('owner', 'admin'));

create policy "admin_write_popups" on public.popups
  for all using (get_user_role(site_id) in ('owner', 'admin'));

create policy "admin_write_promotions" on public.promotions
  for all using (get_user_role(site_id) in ('owner', 'admin'));

create policy "admin_write_redirects" on public.redirects
  for all using (get_user_role(site_id) in ('owner', 'admin'));
```

- [ ] **Paso 2: Ejecutar en Supabase SQL Editor**
Expected: "Success. No rows returned"

- [ ] **Paso 3: Probar que el sitio público sigue funcionando**
```bash
pnpm dev
```
Ve a `http://localhost:3000/es` — debe cargar normalmente.

- [ ] **Paso 4: Crear `supabase/migrations/007_storage_policies.sql`**
```sql
-- Políticas para el bucket allura-media
insert into storage.buckets (id, name, public)
values ('allura-media', 'allura-media', true)
on conflict (id) do nothing;

create policy "public_read_media" on storage.objects
  for select using (bucket_id = 'allura-media');

create policy "auth_upload_media" on storage.objects
  for insert with check (
    bucket_id = 'allura-media'
    and auth.role() = 'authenticated'
  );

create policy "auth_delete_own_media" on storage.objects
  for delete using (
    bucket_id = 'allura-media'
    and auth.uid() = owner
  );
```

- [ ] **Paso 5: Ejecutar en Supabase SQL Editor**

- [ ] **Paso 6: Commit**
```bash
git add supabase/migrations/
git commit -m "feat(security): add RLS policies and storage policies"
```

---

## FASE 9 — Limpieza Sanity

> 💡 **Usa `/clear` al empezar esta fase.** Es destructiva — mejor con contexto limpio.

### Task 22: Eliminar dependencias Sanity

- [ ] **Paso 1: Verificar que ninguna página pública usa Sanity**
```bash
grep -r "from '@/sanity" src/app/[[]locale[]] --include="*.tsx" --include="*.ts"
grep -r "from 'next-sanity'" src --include="*.tsx" --include="*.ts"
grep -r "from 'sanity'" src/app --include="*.tsx" --include="*.ts"
```
Expected: sin resultados fuera de `src/app/studio/`

- [ ] **Paso 2: Eliminar directorio Studio**
```bash
Remove-Item -Recurse -Force src/app/studio
```

- [ ] **Paso 3: Eliminar directorio Sanity**
```bash
Remove-Item -Recurse -Force src/sanity
```

- [ ] **Paso 4: Eliminar archivos de lib Sanity**
```bash
Remove-Item src/lib/getSiteSettings.ts
Remove-Item src/lib/getTrackingScripts.ts
```

- [ ] **Paso 5: Actualizar imports que usaban los lib wrappers**

Busca cualquier import de `@/lib/getSiteSettings` o `@/lib/getTrackingScripts` y cámbialos a `@/lib/supabase/siteSettings`:
```bash
grep -r "getSiteSettings\|getTrackingScripts" src --include="*.tsx" --include="*.ts"
```

- [ ] **Paso 6: Desinstalar dependencias Sanity de `package.json`**
```bash
pnpm remove sanity next-sanity @sanity/image-url @sanity/vision @sanity/types @portabletext/react @portabletext/types
```

- [ ] **Paso 7: Actualizar `src/middleware.ts`** para eliminar el matcher de `/studio`:
El matcher ya no necesita excluir `/studio` — está eliminado.

- [ ] **Paso 8: Verificar build final**
```bash
pnpm build
```
Expected: build exitoso sin ninguna referencia a Sanity.

- [ ] **Paso 9: Verificar sitio en browser**
```bash
pnpm dev
```
Revisa:
- `http://localhost:3000/es` — carga home
- `http://localhost:3000/es/servicios` — carga servicios
- `http://localhost:3000/es/blog` — carga blog
- `http://localhost:3000/admin` — carga panel admin
- `http://localhost:3000/es/contacto` — formulario funciona

- [ ] **Paso 10: Commit final**
```bash
git add .
git commit -m "feat: complete Sanity removal — Allura fully migrated to Supabase"
```

---

## FASE 10 — Merge a main

### Task 23: Pull Request

- [ ] **Paso 1: Verificar build final limpio**
```bash
pnpm build
```
Expected: 0 errores, 0 warnings de Sanity

- [ ] **Paso 2: Revisar checklist de entrega del spec**

Verificar punto por punto la sección "Checklist de entrega al cliente" en el spec.

- [ ] **Paso 3: Crear Pull Request**
```bash
git push origin feature/supabase-migration
gh pr create --title "feat: migrate Allura from Sanity to Supabase" --body "$(cat <<'EOF'
## Resumen
- Reemplaza Sanity CMS por Supabase (Postgres + Auth + Storage)
- Agrega panel administrativo en /admin con shadcn/ui
- Mantiene el frontend visualmente idéntico al prototipo aprobado
- RLS activo en todas las tablas
- 10 fases implementadas según spec en docs/superpowers/specs/

## Test plan
- [ ] pnpm build sin errores
- [ ] Todas las páginas públicas cargan
- [ ] Login/logout del panel admin funciona
- [ ] CRUDs de servicios, blog, equipo funcionan
- [ ] Formulario de contacto guarda en Supabase
- [ ] Imágenes cargan desde Supabase Storage
- [ ] Usuario sin sesión no accede a /admin
EOF
)"
```

---

## Resumen de puntos `/compact` y `/clear`

| Momento | Comando | Razón |
|---------|---------|-------|
| Al terminar Fase 2 (migraciones SQL) | `/compact` | Contexto SQL largo, preservar decisiones de arquitectura |
| Al empezar Fase 4 en nueva sesión | `/clear` | Fase independiente — solo necesita el plan |
| Al terminar Fase 5 (CRUDs) | `/compact` | Contexto muy largo antes de queries públicas |
| Al empezar Fase 8 (RLS) en nueva sesión | `/clear` | Trabajo SQL puro, sin contexto React |
| Al empezar Fase 9 (limpieza) en nueva sesión | `/clear` | Acción destructiva — mejor mente fresca |
| Cuando Claude contradice decisiones ya tomadas | `/compact` | El contexto se corrompió |
| Al empezar el día siguiente | `/clear` + cargar plan | Sesión nueva, contexto limpio |
