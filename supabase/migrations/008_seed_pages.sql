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
