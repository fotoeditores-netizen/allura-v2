-- supabase/migrations/019_seed_contacto_blog_galeria_sections.sql
-- Seeds Contacto, Blog and Galeria page sections so they are editable from the admin panel.

DO $$
DECLARE
  contacto_id uuid;
  blog_id     uuid;
  galeria_id  uuid;
BEGIN

  SELECT id INTO contacto_id FROM pages WHERE site_id = '00000000-0000-0000-0000-000000000001' AND slug = '/contacto';
  SELECT id INTO blog_id     FROM pages WHERE site_id = '00000000-0000-0000-0000-000000000001' AND slug = '/blog';
  SELECT id INTO galeria_id  FROM pages WHERE site_id = '00000000-0000-0000-0000-000000000001' AND slug = '/galeria';

  IF contacto_id IS NULL THEN RAISE EXCEPTION 'Contacto page not found.'; END IF;
  IF blog_id     IS NULL THEN RAISE EXCEPTION 'Blog page not found.';     END IF;
  IF galeria_id  IS NULL THEN RAISE EXCEPTION 'Galeria page not found.';  END IF;

  DELETE FROM sections WHERE page_id IN (contacto_id, blog_id, galeria_id);

  -- ══════════════════════════════════════════════════════════════════════════════
  -- CONTACTO
  -- ══════════════════════════════════════════════════════════════════════════════
  INSERT INTO sections (page_id, type, sort_order, is_visible, settings) VALUES

  (contacto_id, 'page_header', 0, true, $j${"style":"dark-centered","eyebrow":{"es":"Hablemos","en":"Let's talk"},"title":{"es":"Comienza tu experiencia Allura","en":"Start your Allura experience"},"subtitle":{"es":"Cuéntanos qué necesitas. Te respondemos en menos de 24 horas.","en":"Tell us what you need. We will respond within 24 hours."},"imageUrl":"","ctaLabel":{"es":"","en":""},"ctaUrl":"","breadcrumb":{"es":"","en":""}}$j$::jsonb),

  (contacto_id, 'contact_form', 1, true, $j${"eyebrow":{"es":"Hablemos","en":"Let's talk"},"title":{"es":"Comienza tu experiencia Allura","en":"Start your Allura experience"},"subtitle":{"es":"Te respondemos en menos de 24 horas.","en":"We will respond within 24 hours."}}$j$::jsonb),

  (contacto_id, 'cta', 2, true, $j${"eyebrow":{"es":"Da el primer paso","en":"Take the first step"},"title":{"es":"Transforma tu bienestar.","en":"Transform your wellbeing."},"subtitle":{"es":"","en":""},"buttonLabel":{"es":"Contactar ahora","en":"Contact us now"}}$j$::jsonb);

  -- ══════════════════════════════════════════════════════════════════════════════
  -- BLOG
  -- ══════════════════════════════════════════════════════════════════════════════
  INSERT INTO sections (page_id, type, sort_order, is_visible, settings) VALUES

  (blog_id, 'page_header', 0, true, $j${"style":"dark-centered","eyebrow":{"es":"Recursos","en":"Resources"},"title":{"es":"Blog Allura","en":"Allura Blog"},"subtitle":{"es":"Información clara y confiable sobre odontología, medicina facial estética y turismo médico en Medellín.","en":"Clear and reliable information on dentistry, aesthetic facial medicine and medical tourism in Medellín."},"imageUrl":"","ctaLabel":{"es":"","en":""},"ctaUrl":"","breadcrumb":{"es":"","en":""}}$j$::jsonb),

  (blog_id, 'cta', 1, true, $j${"eyebrow":{"es":"Da el primer paso","en":"Take the first step"},"title":{"es":"Transforma tu bienestar.","en":"Transform your wellbeing."},"subtitle":{"es":"","en":""},"buttonLabel":{"es":"Contactar ahora","en":"Contact us now"}}$j$::jsonb);

  -- ══════════════════════════════════════════════════════════════════════════════
  -- GALERÍA
  -- ══════════════════════════════════════════════════════════════════════════════
  INSERT INTO sections (page_id, type, sort_order, is_visible, settings) VALUES

  (galeria_id, 'page_header', 0, true, $j${"style":"dark-centered","eyebrow":{"es":"Galería","en":"Gallery"},"title":{"es":"Nuestra clínica y resultados","en":"Our clinic and results"},"subtitle":{"es":"Imágenes reales de nuestra clínica, nuestro equipo y los resultados de nuestros pacientes en Medellín.","en":"Real images of our clinic, team, and patient results in Medellín."},"imageUrl":"","ctaLabel":{"es":"","en":""},"ctaUrl":"","breadcrumb":{"es":"","en":""}}$j$::jsonb),

  (galeria_id, 'cta', 1, true, $j${"eyebrow":{"es":"Da el primer paso","en":"Take the first step"},"title":{"es":"Transforma tu bienestar.","en":"Transform your wellbeing."},"subtitle":{"es":"","en":""},"buttonLabel":{"es":"Contactar ahora","en":"Contact us now"}}$j$::jsonb);

END $$;
