-- supabase/migrations/015_seed_como_funciona_sections.sql
-- Seeds the Como Funciona page sections so they are editable from the admin panel.

DO $$
DECLARE
  page_id uuid;
BEGIN
  SELECT id INTO page_id
  FROM pages
  WHERE site_id = '00000000-0000-0000-0000-000000000001'
    AND slug = '/como-funciona';

  IF page_id IS NULL THEN
    RAISE EXCEPTION 'Como Funciona page not found. Run 008_seed_pages.sql first.';
  END IF;

  DELETE FROM sections WHERE page_id = page_id;

  INSERT INTO sections (page_id, type, sort_order, is_visible, settings) VALUES

  -- 1. Hero cabecera
  (page_id, 'page_header', 0, true, '{
    "style": "dark-centered",
    "eyebrow": {"es": "El proceso", "en": "The process"},
    "title": {"es": "Cómo funciona Allura", "en": "How Allura works"},
    "subtitle": {"es": "Un proceso diseñado para que tu experiencia de turismo médico sea transparente, segura y sin estrés, desde tu país hasta Medellín.", "en": "A process designed to make your medical tourism experience transparent, safe and stress-free, from your home country to Medellín."},
    "imageUrl": "",
    "ctaLabel": {"es": "", "en": ""},
    "ctaUrl": "",
    "breadcrumb": {"es": "", "en": ""}
  }'::jsonb),

  -- 2. Pasos del proceso
  (page_id, 'process', 1, true, '{
    "eyebrow": {"es": "Cómo funciona", "en": "How it works"},
    "title": {"es": "Tu proceso con Allura", "en": "Your journey with Allura"},
    "steps": [
      {
        "number": "01",
        "title": {"es": "Comparte tus necesidades", "en": "Share your needs"},
        "description": {"es": "Completa nuestro formulario de contacto con tus objetivos de salud y bienestar. El equipo Allura te responde con orientación personalizada en menos de 24 horas, sin compromiso.", "en": "Complete our contact form with your health and wellbeing goals. The Allura team responds with personalized guidance in less than 24 hours, with no commitment."}
      },
      {
        "number": "02",
        "title": {"es": "Consulta virtual con especialistas", "en": "Virtual consultation with specialists"},
        "description": {"es": "Agenda una reunión segura por videollamada con los médicos u odontólogos certificados de Allura. Recibirás un diagnóstico preliminar, opciones de tratamiento y un presupuesto claro antes de viajar.", "en": "Schedule a secure video call with Allura's certified doctors or dentists. You will receive a preliminary diagnosis, treatment options and a clear quote before traveling."}
      },
      {
        "number": "03",
        "title": {"es": "Plan médico y experiencia de viaje", "en": "Medical plan and travel experience"},
        "description": {"es": "Nuestro equipo diseña tu plan integral: citas, fechas, alojamiento recomendado y actividades opcionales en Medellín. Todo coordinado para que tu estancia sea cómoda y memorable.", "en": "Our team designs your comprehensive plan: appointments, dates, recommended accommodations and optional activities in Medellín. All coordinated so your stay is comfortable and memorable."}
      },
      {
        "number": "04",
        "title": {"es": "Procedimiento y acompañamiento total", "en": "Procedure and full support"},
        "description": {"es": "Coordinamos tu llegada, los procedimientos clínicos, la recuperación y el seguimiento post-retorno desde tu país de origen. Estamos contigo en cada etapa.", "en": "We coordinate your arrival, clinical procedures, recovery and post-return follow-up from your home country. We are with you at every stage."}
      }
    ]
  }'::jsonb),

  -- 3. FAQs (el componente carga las FAQs dinámicas de Supabase; solo el título es editable aquí)
  (page_id, 'faq', 2, true, '{
    "eyebrow": {"es": "Preguntas frecuentes", "en": "Frequently asked questions"},
    "title": {"es": "Lo que más nos preguntan", "en": "What people ask us most"}
  }'::jsonb),

  -- 4. Testimonios (el componente carga los testimonios dinámicos de Supabase)
  (page_id, 'testimonials', 3, true, '{
    "eyebrow": {"es": "Lo que dicen nuestros pacientes", "en": "Patient Stories"},
    "title": {"es": "Experiencias reales, resultados reales", "en": "Real experiences, real results"}
  }'::jsonb),

  -- 5. CTA Banner
  (page_id, 'cta', 4, true, '{
    "eyebrow": {"es": "Da el primer paso", "en": "Take the first step"},
    "title": {"es": "Transforma tu bienestar.", "en": "Transform your wellbeing."},
    "subtitle": {"es": "", "en": ""},
    "buttonLabel": {"es": "Contactar ahora", "en": "Contact us now"}
  }'::jsonb);

END $$;
