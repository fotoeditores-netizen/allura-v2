-- supabase/migrations/016_seed_equipo_sections.sql
-- Seeds the Equipo page sections so they are editable from the admin panel.

DO $$
DECLARE
  p_id uuid;
BEGIN
  SELECT id INTO p_id
  FROM pages
  WHERE site_id = '00000000-0000-0000-0000-000000000001'
    AND slug = '/equipo';

  IF p_id IS NULL THEN
    RAISE EXCEPTION 'Equipo page not found. Run 008_seed_pages.sql first.';
  END IF;

  DELETE FROM sections WHERE page_id = p_id;

  INSERT INTO sections (page_id, type, sort_order, is_visible, settings) VALUES

  (p_id, 'page_header', 0, true, $j${"style":"dark-centered","eyebrow":{"es":"Nuestro equipo","en":"Our team"},"title":{"es":"Especialistas de primer nivel","en":"World-class specialists"},"subtitle":{"es":"Un equipo certificado internacionalmente, comprometido con la excelencia y el bienestar de cada paciente.","en":"An internationally certified team, committed to excellence and the wellbeing of every patient."},"imageUrl":"","ctaLabel":{"es":"","en":""},"ctaUrl":"","breadcrumb":{"es":"","en":""}}$j$::jsonb),

  (p_id, 'team_preview', 1, true, $j${"eyebrow":{"es":"Nuestro equipo","en":"Our team"},"title":{"es":"Conoce nuestro equipo experto","en":"Meet our expert team"},"subtitle":{"es":"","en":""}}$j$::jsonb),

  (p_id, 'cards_grid', 2, true, $j${"internalName":"Certificaciones","eyebrow":{"es":"Certificaciones","en":"Certifications"},"title":{"es":"Formación de clase mundial","en":"World-class training"},"subtitle":{"es":"Nuestros especialistas tienen formación en las mejores instituciones de Colombia, América y Europa, y participan activamente en congresos internacionales de odontología y medicina facial.","en":"Our specialists have trained at the best institutions in Colombia, the Americas and Europe, and actively participate in international dentistry and facial medicine conferences."},"columns":1,"bg":"light","cardStyle":"bordered","cards":[]}$j$::jsonb),

  (p_id, 'cta', 3, true, $j${"eyebrow":{"es":"Da el primer paso","en":"Take the first step"},"title":{"es":"Transforma tu bienestar.","en":"Transform your wellbeing."},"subtitle":{"es":"","en":""},"buttonLabel":{"es":"Contactar ahora","en":"Contact us now"}}$j$::jsonb);

END $$;
