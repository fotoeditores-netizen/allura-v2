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
