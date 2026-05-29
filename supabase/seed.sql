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
-- insertar su site_user manualmente con:
-- insert into public.site_users (site_id, user_id, role)
-- values ('00000000-0000-0000-0000-000000000001', 'TU_USER_ID_AQUI', 'owner');
