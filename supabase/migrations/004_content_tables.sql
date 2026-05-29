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
