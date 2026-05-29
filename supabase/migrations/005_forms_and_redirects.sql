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
