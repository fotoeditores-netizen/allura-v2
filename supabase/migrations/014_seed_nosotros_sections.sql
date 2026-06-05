-- supabase/migrations/014_seed_nosotros_sections.sql
-- Seeds the Nosotros page sections so they are editable from the admin panel.

DO $$
DECLARE
  nosotros_page_id uuid;
BEGIN
  SELECT id INTO nosotros_page_id
  FROM pages
  WHERE site_id = '00000000-0000-0000-0000-000000000001'
    AND slug = '/nosotros';

  IF nosotros_page_id IS NULL THEN
    RAISE EXCEPTION 'Nosotros page not found. Run 008_seed_pages.sql first.';
  END IF;

  DELETE FROM sections WHERE page_id = nosotros_page_id;

  INSERT INTO sections (page_id, type, sort_order, is_visible, settings) VALUES

  -- 1. Hero cabecera
  (nosotros_page_id, 'page_header', 0, true, '{
    "style": "dark-centered",
    "eyebrow": {"es": "Quiénes somos", "en": "Who we are"},
    "title": {"es": "Personas que cuidan personas", "en": "People caring for people"},
    "subtitle": {"es": "Allura nace de la pasión por la odontología y la medicina estética de excelencia, y del orgullo de mostrar lo mejor de Medellín al mundo.", "en": "Allura is born from a passion for excellence in dentistry and aesthetic medicine, and from the pride of showing the best of Medellín to the world."},
    "imageUrl": "",
    "ctaLabel": {"es": "", "en": ""},
    "ctaUrl": "",
    "breadcrumb": {"es": "", "en": ""}
  }'::jsonb),

  -- 2. Misión (texto + imagen)
  (nosotros_page_id, 'text_image', 1, true, '{
    "title": {"es": "El bienestar como propósito", "en": "Wellbeing as purpose"},
    "body": {"es": "En Allura creemos que la salud y el disfrute no son opuestos. Somos un destino de turismo médico especializado en odontología premium y medicina facial estética, donde cada paciente internacional recibe atención de clase mundial respaldada por tecnología de vanguardia y la calidez de Medellín.\n\nCada persona que llega a Allura no solo recupera su sonrisa o armoniza su rostro — vive una experiencia única en una de las ciudades más vibrantes de América Latina.", "en": "At Allura we believe that health and enjoyment are not opposites. We are a specialized medical tourism destination in premium dentistry and facial aesthetic medicine, where each international patient receives world-class care backed by cutting-edge technology and the warmth of Medellín.\n\nEvery person who comes to Allura does not just restore their smile or harmonize their face — they live a unique experience in one of the most vibrant cities in Latin America."},
    "imageUrl": "/images/imagenes_web/allura-healthcare-doctor-paciente.jpg",
    "imagePosition": "left"
  }'::jsonb),

  -- 3. Pilares (cards_grid)
  (nosotros_page_id, 'cards_grid', 2, true, '{
    "internalName": "Pilares de Allura",
    "eyebrow": {"es": "Cómo trabajamos", "en": "How we work"},
    "title": {"es": "Los pilares de Allura", "en": "The pillars of Allura"},
    "subtitle": {"es": "Tres principios que guían cada decisión que tomamos con nuestros pacientes.", "en": "Three principles that guide every decision we make with our patients."},
    "columns": 3,
    "bg": "light",
    "cardStyle": "bordered",
    "cards": [
      {
        "icon": "01",
        "title": {"es": "Diagnóstico honesto", "en": "Honest diagnosis"},
        "body": {"es": "Evaluamos cada caso sin apresuramiento, con diagnóstico digital 3D y opinión de especialistas.", "en": "We evaluate each case without rushing, with 3D digital diagnosis and specialist opinion."},
        "imageUrl": "", "ctaLabel": {"es": "", "en": ""}, "ctaUrl": ""
      },
      {
        "icon": "02",
        "title": {"es": "Plan personalizado", "en": "Personalized plan"},
        "body": {"es": "Diseñamos una hoja de ruta exclusiva para ti: tratamiento, alojamiento y experiencia en Medellín.", "en": "We design an exclusive roadmap for you: treatment, accommodation and experience in Medellín."},
        "imageUrl": "", "ctaLabel": {"es": "", "en": ""}, "ctaUrl": ""
      },
      {
        "icon": "03",
        "title": {"es": "Acompañamiento total", "en": "Total support"},
        "body": {"es": "Coordinamos llegada, procedimientos, recuperación y seguimiento post-retorno desde tu país.", "en": "We coordinate arrival, procedures, recovery and post-return follow-up from your home country."},
        "imageUrl": "", "ctaLabel": {"es": "", "en": ""}, "ctaUrl": ""
      }
    ]
  }'::jsonb),

  -- 4. Valores (cards_grid)
  (nosotros_page_id, 'cards_grid', 3, true, '{
    "internalName": "Valores de Allura",
    "eyebrow": {"es": "Nuestros valores", "en": "Our values"},
    "title": {"es": "Lo que nos define", "en": "What defines us"},
    "subtitle": {"es": "", "en": ""},
    "columns": 3,
    "bg": "white",
    "cardStyle": "bordered",
    "cards": [
      {
        "icon": "🏆",
        "title": {"es": "Excelencia", "en": "Excellence"},
        "body": {"es": "Cada tratamiento sigue los más altos estándares internacionales, con especialistas certificados y tecnología de vanguardia.", "en": "Every treatment follows the highest international standards, with certified specialists and cutting-edge technology."},
        "imageUrl": "", "ctaLabel": {"es": "", "en": ""}, "ctaUrl": ""
      },
      {
        "icon": "🤝",
        "title": {"es": "Empatía", "en": "Empathy"},
        "body": {"es": "Escuchamos y entendemos tu historia antes de cualquier recomendación. Tu bienestar es nuestra única prioridad.", "en": "We listen and understand your story before any recommendation. Your wellbeing is our only priority."},
        "imageUrl": "", "ctaLabel": {"es": "", "en": ""}, "ctaUrl": ""
      },
      {
        "icon": "✅",
        "title": {"es": "Transparencia", "en": "Transparency"},
        "body": {"es": "Información clara, precios reales y procesos éticos en todo momento. Sin sorpresas, sin compromisos ocultos.", "en": "Clear information, real prices and ethical processes at all times. No surprises, no hidden commitments."},
        "imageUrl": "", "ctaLabel": {"es": "", "en": ""}, "ctaUrl": ""
      }
    ]
  }'::jsonb),

  -- 5. CTA Banner
  (nosotros_page_id, 'cta', 4, true, '{
    "eyebrow": {"es": "Da el primer paso", "en": "Take the first step"},
    "title": {"es": "Transforma tu bienestar.", "en": "Transform your wellbeing."},
    "subtitle": {"es": "", "en": ""},
    "buttonLabel": {"es": "Contactar ahora", "en": "Contact us now"}
  }'::jsonb);

END $$;
