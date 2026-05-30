-- ============================================================
-- Seed: categorías de servicios y subservicios (28 en total)
-- ============================================================

-- CATEGORÍAS
INSERT INTO service_categories (site_id, title_i18n, slug, description_i18n, sort_order)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"Full Mouth Reconstruction","en":"Full Mouth Reconstruction"}',
    'full-mouth-reconstruction',
    '{"es":"Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura.","en":"Comprehensive solution to restore function, stability and a smile that feels secure again."}',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"Smile Makeover","en":"Smile Makeover"}',
    'smile-makeover',
    '{"es":"Tu sonrisa, rediseñada con precisión artística. Cada detalle, pensado para ti.","en":"Your smile, redesigned with artistic precision. Every detail, crafted for you."}',
    2
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"Aligners","en":"Aligners"}',
    'aligners',
    '{"es":"Ortodoncia sin brackets, con planificación digital y seguimiento remoto para pacientes internacionales.","en":"Bracket-free orthodontics with digital planning and remote monitoring for international patients."}',
    3
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"Facial Harmony","en":"Facial Harmony"}',
    'facial-harmony',
    '{"es":"Medicina facial estética de precisión para realzar tus rasgos con naturalidad.","en":"Precision facial aesthetic medicine to enhance your features naturally."}',
    4
  )
ON CONFLICT (site_id, slug) DO UPDATE
  SET title_i18n       = EXCLUDED.title_i18n,
      description_i18n = EXCLUDED.description_i18n,
      sort_order       = EXCLUDED.sort_order;

-- ============================================================
-- SUBSERVICIOS — Full Mouth Reconstruction (6)
-- ============================================================
WITH cat AS (SELECT id FROM service_categories WHERE site_id='00000000-0000-0000-0000-000000000001' AND slug='full-mouth-reconstruction')
INSERT INTO services (site_id, category_id, title_i18n, slug, description_i18n, status, sort_order)
SELECT
  '00000000-0000-0000-0000-000000000001',
  cat.id,
  v.title_i18n, v.slug, v.description_i18n, 'published', v.sort_order
FROM cat,
(VALUES
  (
    '{"es":"Implantes Unitarios y Múltiples","en":"Single and Multiple Implants"}'::jsonb,
    'implantes-unitarios',
    '{"es":"Reemplazo de una o varias piezas dentales con implantes de titanio de alta precisión, integrados para durar toda la vida.","en":"Replacement of one or several teeth with high-precision titanium implants, integrated to last a lifetime."}'::jsonb,
    1
  ),
  (
    '{"es":"Implantes All-on-X","en":"All-on-X Implants"}'::jsonb,
    'implantes-all-on-x',
    '{"es":"Solución completa para pacientes con pérdida total o casi total de piezas: una arcada completa fija sobre 4 o 6 implantes estratégicamente ubicados.","en":"Complete solution for patients with total or near-total tooth loss: a complete fixed arch on 4 or 6 strategically placed implants."}'::jsonb,
    2
  ),
  (
    '{"es":"Rehabilitación Oral Completa","en":"Full Oral Rehabilitation"}'::jsonb,
    'rehabilitacion-oral-completa',
    '{"es":"Tratamiento integral que restaura función masticatoria, estética y salud periodontal para casos de deterioro severo o múltiple.","en":"Comprehensive treatment that restores masticatory function, aesthetics and periodontal health for cases of severe or multiple deterioration."}'::jsonb,
    3
  ),
  (
    '{"es":"Prótesis Fijas sobre Implantes","en":"Fixed Prostheses on Implants"}'::jsonb,
    'protesis-fijas',
    '{"es":"Coronas y puentes de porcelana fijados permanentemente sobre implantes. Aspecto natural, resistencia total y funcionalidad completa.","en":"Porcelain crowns and bridges permanently fixed on implants. Natural appearance, total resistance and complete functionality."}'::jsonb,
    4
  ),
  (
    '{"es":"Reemplazo de Restauraciones Fallidas","en":"Replacement of Failed Restorations"}'::jsonb,
    'reemplazo-restauraciones',
    '{"es":"Evaluación y sustitución de restauraciones antiguas, fracturadas o con infiltración. Volvemos a empezar sobre una base sana.","en":"Evaluation and replacement of old, fractured or infiltrated restorations. Starting over on a healthy foundation."}'::jsonb,
    5
  ),
  (
    '{"es":"Planificación Digital 3D","en":"3D Digital Planning"}'::jsonb,
    'planificacion-digital-3d',
    '{"es":"Simulación completa de tu caso con tecnología CAD/CAM y escáner intraoral 3D antes de comenzar cualquier procedimiento.","en":"Complete simulation of your case with CAD/CAM technology and 3D intraoral scanner before starting any procedure."}'::jsonb,
    6
  )
) AS v(title_i18n, slug, description_i18n, sort_order)
ON CONFLICT (site_id, slug) DO UPDATE
  SET title_i18n       = EXCLUDED.title_i18n,
      description_i18n = EXCLUDED.description_i18n,
      status           = EXCLUDED.status,
      sort_order       = EXCLUDED.sort_order;

-- ============================================================
-- SUBSERVICIOS — Smile Makeover (5)
-- ============================================================
WITH cat AS (SELECT id FROM service_categories WHERE site_id='00000000-0000-0000-0000-000000000001' AND slug='smile-makeover')
INSERT INTO services (site_id, category_id, title_i18n, slug, description_i18n, status, sort_order)
SELECT
  '00000000-0000-0000-0000-000000000001',
  cat.id,
  v.title_i18n, v.slug, v.description_i18n, 'published', v.sort_order
FROM cat,
(VALUES
  (
    '{"es":"Carillas en Porcelana","en":"Porcelain Veneers"}'::jsonb,
    'carillas-porcelana',
    '{"es":"Láminas ultrafinas de porcelana adheridas a los dientes para transformar color, forma y alineación con resultados ultranatural.","en":"Ultra-thin porcelain wafers bonded to teeth to transform color, shape and alignment with ultra-natural results."}'::jsonb,
    1
  ),
  (
    '{"es":"Diseño Digital de Sonrisa","en":"Digital Smile Design"}'::jsonb,
    'diseno-digital-sonrisa',
    '{"es":"Simulación digital de tu nueva sonrisa antes de comenzar. Ves el resultado final y apruebas cada detalle antes del primer procedimiento.","en":"Digital simulation of your new smile before you begin. See the final result and approve every detail before the first procedure."}'::jsonb,
    2
  ),
  (
    '{"es":"Coronas en Porcelana","en":"Porcelain Crowns"}'::jsonb,
    'coronas-porcelana',
    '{"es":"Fundas de porcelana de alta resistencia que restauran dientes dañados devolviéndoles apariencia, función y resistencia totales.","en":"High-strength porcelain caps that restore damaged teeth, returning their appearance, function and resistance."}'::jsonb,
    3
  ),
  (
    '{"es":"Restauraciones Estéticas Avanzadas","en":"Advanced Aesthetic Restorations"}'::jsonb,
    'restauraciones-esteticas',
    '{"es":"Técnicas adhesivas de última generación para corregir fracturas, manchas, diastemas y deformidades con mínima invasión.","en":"State-of-the-art adhesive techniques to correct fractures, stains, diastemas and deformities with minimal invasion."}'::jsonb,
    4
  ),
  (
    '{"es":"Blanqueamiento Dental Profesional","en":"Professional Teeth Whitening"}'::jsonb,
    'blanqueamiento-dental',
    '{"es":"Protocolo clínico de blanqueamiento supervisado por especialistas para resultados seguros, uniformes y duraderos.","en":"Clinical whitening protocol supervised by specialists for safe, uniform and lasting results."}'::jsonb,
    5
  )
) AS v(title_i18n, slug, description_i18n, sort_order)
ON CONFLICT (site_id, slug) DO UPDATE
  SET title_i18n       = EXCLUDED.title_i18n,
      description_i18n = EXCLUDED.description_i18n,
      status           = EXCLUDED.status,
      sort_order       = EXCLUDED.sort_order;

-- ============================================================
-- SUBSERVICIOS — Aligners (5)
-- ============================================================
WITH cat AS (SELECT id FROM service_categories WHERE site_id='00000000-0000-0000-0000-000000000001' AND slug='aligners')
INSERT INTO services (site_id, category_id, title_i18n, slug, description_i18n, status, sort_order)
SELECT
  '00000000-0000-0000-0000-000000000001',
  cat.id,
  v.title_i18n, v.slug, v.description_i18n, 'published', v.sort_order
FROM cat,
(VALUES
  (
    '{"es":"Invisalign","en":"Invisalign"}'::jsonb,
    'invisalign',
    '{"es":"Proveedor oficial Invisalign con especialistas certificados Diamond Top Doctor. Planificación digital precisa para tu caso.","en":"Official Invisalign provider with Diamond Top Doctor-certified specialists. Precise digital planning for your case."}'::jsonb,
    1
  ),
  (
    '{"es":"Alineadores Transparentes","en":"Clear Aligners"}'::jsonb,
    'alineadores-transparentes',
    '{"es":"Ortodoncia con alineadores como alternativa o complemento a Invisalign, personalizada para cada paciente.","en":"Clear aligner orthodontics as an alternative or complement to Invisalign, personalized for each patient."}'::jsonb,
    2
  ),
  (
    '{"es":"Escaneo Digital 3D","en":"3D Digital Scanning"}'::jsonb,
    'escaneo-digital-3d',
    '{"es":"Escáner intraoral 3D para tomar impresiones digitales completas: adiós a los moldes tradicionales.","en":"3D intraoral scanning for complete digital impressions: no more traditional molds."}'::jsonb,
    3
  ),
  (
    '{"es":"Planificación Personalizada","en":"Personalized Planning"}'::jsonb,
    'planificacion-personalizada',
    '{"es":"Simulación digital completa del movimiento de tu sonrisa, caso a caso, antes de comenzar el tratamiento.","en":"Complete digital simulation of your smile movement, case by case, before starting treatment."}'::jsonb,
    4
  ),
  (
    '{"es":"Seguimiento Remoto","en":"Remote Monitoring"}'::jsonb,
    'seguimiento-remoto',
    '{"es":"Control post-tratamiento internacional mediante fotos, escaneos y videollamadas con tu especialista.","en":"International post-treatment follow-up via photos, scans and video calls with your specialist."}'::jsonb,
    5
  )
) AS v(title_i18n, slug, description_i18n, sort_order)
ON CONFLICT (site_id, slug) DO UPDATE
  SET title_i18n       = EXCLUDED.title_i18n,
      description_i18n = EXCLUDED.description_i18n,
      status           = EXCLUDED.status,
      sort_order       = EXCLUDED.sort_order;

-- ============================================================
-- SUBSERVICIOS — Facial Harmony (8)
-- ============================================================
WITH cat AS (SELECT id FROM service_categories WHERE site_id='00000000-0000-0000-0000-000000000001' AND slug='facial-harmony')
INSERT INTO services (site_id, category_id, title_i18n, slug, description_i18n, status, sort_order)
SELECT
  '00000000-0000-0000-0000-000000000001',
  cat.id,
  v.title_i18n, v.slug, v.description_i18n, 'published', v.sort_order
FROM cat,
(VALUES
  (
    '{"es":"Evaluación Facial Estructural","en":"Structural Facial Assessment"}'::jsonb,
    'evaluacion-facial',
    '{"es":"Análisis detallado de proporciones, volúmenes y dinámica facial para diseñar un plan personalizado y natural.","en":"Detailed analysis of proportions, volumes and facial dynamics to design a personalized and natural plan."}'::jsonb,
    1
  ),
  (
    '{"es":"Toxina Botulínica y Rellenos","en":"Botulinum Toxin and Fillers"}'::jsonb,
    'toxina-botulinica',
    '{"es":"Protocolos de aplicación precisa para suavizar líneas de expresión y restaurar volúmenes faciales con aspecto natural.","en":"Precise application protocols for softening expression lines and restoring facial volumes with a natural look."}'::jsonb,
    2
  ),
  (
    '{"es":"Bioestimuladores y Rejuvenecimiento","en":"Biostimulators and Rejuvenation"}'::jsonb,
    'bioestimuladores',
    '{"es":"Tratamientos para regenerar colágeno y mejorar la calidad de la piel desde adentro: firmeza, luminosidad y textura.","en":"Treatments to regenerate collagen and improve skin quality from within: firmness, luminosity and texture."}'::jsonb,
    3
  ),
  (
    '{"es":"Blefaroplastia","en":"Blepharoplasty"}'::jsonb,
    'blefaroplastia',
    '{"es":"Corrección quirúrgica de párpados para una mirada más descansada y juvenil, con resultados naturales y recuperación rápida.","en":"Surgical correction of eyelids for a more rested and youthful look, with natural results and fast recovery."}'::jsonb,
    4
  ),
  (
    '{"es":"Rinoplastia","en":"Rhinoplasty"}'::jsonb,
    'rinoplastia',
    '{"es":"Remodelación nasal con técnica abierta o cerrada, adaptada a cada estructura facial para resultados armoniosos y naturales.","en":"Nasal remodeling with open or closed technique, adapted to each facial structure for harmonious and natural results."}'::jsonb,
    5
  ),
  (
    '{"es":"Lifting Facial","en":"Facelift"}'::jsonb,
    'lifting-facial',
    '{"es":"Rejuvenecimiento facial quirúrgico que reposiciona tejidos y reduce signos visibles de envejecimiento sin aspecto artificial.","en":"Surgical facial rejuvenation that repositions tissues and reduces visible signs of aging without an artificial look."}'::jsonb,
    6
  ),
  (
    '{"es":"Mentoplastia","en":"Mentoplasty"}'::jsonb,
    'mentoplastia',
    '{"es":"Aumento o reducción del mentón para mejorar las proporciones faciales y fortalecer el perfil mentón-cuello.","en":"Chin augmentation or reduction to improve facial proportions and strengthen the chin-neck profile."}'::jsonb,
    7
  ),
  (
    '{"es":"Coordinación con Cirugía Maxilofacial","en":"Maxillofacial Surgery Coordination"}'::jsonb,
    'cirugia-maxilofacial',
    '{"es":"Coordinación con cirujanos maxilofaciales para casos complejos que combinan correcciones estéticas y funcionales.","en":"Coordination with maxillofacial surgeons for complex cases combining aesthetic and functional corrections."}'::jsonb,
    8
  )
) AS v(title_i18n, slug, description_i18n, sort_order)
ON CONFLICT (site_id, slug) DO UPDATE
  SET title_i18n       = EXCLUDED.title_i18n,
      description_i18n = EXCLUDED.description_i18n,
      status           = EXCLUDED.status,
      sort_order       = EXCLUDED.sort_order;
