-- ============================================================
-- Seed: equipo, testimonios, FAQs
-- ============================================================

-- EQUIPO (6 doctores reales de Allura Healthcare)
INSERT INTO team_members (site_id, name, slug, role_i18n, bio_i18n, sort_order, is_visible)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Dra. Johanna Jaramillo',
    'johanna-jaramillo',
    '{"es":"Especialista en Prótesis Periodontal","en":"Periodontal Prosthetics Specialist"}',
    '{"es":"Especialista en rehabilitación oral y periodoncia con enfoque en estética dental avanzada. Más de 10 años acompañando a pacientes nacionales e internacionales en su transformación de sonrisa.","en":"Specialist in oral rehabilitation and periodontics with a focus on advanced dental aesthetics. Over 10 years accompanying national and international patients in their smile transformation."}',
    1, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Dra. Daniela Alzate',
    'daniela-alzate',
    '{"es":"Ortodoncista y MSc.","en":"Orthodontist and MSc."}',
    '{"es":"Maestría en Ortodoncia con énfasis en tratamientos de alineación invisible. Especialista en Invisalign y planificación digital de sonrisas para pacientes adultos.","en":"Master''s degree in Orthodontics with emphasis on invisible alignment treatments. Invisalign specialist and digital smile planning for adult patients."}',
    2, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Dr. Sebastián Muñoz',
    'sebastian-munoz',
    '{"es":"Especialista en Prótesis Periodontal","en":"Periodontal Prosthetics Specialist"}',
    '{"es":"Especialista en implantes dentales y prótesis fijas. Amplia experiencia en rehabilitaciones completas All-on-4 y All-on-6 para pacientes de turismo médico.","en":"Specialist in dental implants and fixed prosthetics. Extensive experience in full-arch All-on-4 and All-on-6 rehabilitations for medical tourism patients."}',
    3, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Dr. Santiago Henao',
    'santiago-henao',
    '{"es":"Ortodoncista — Diamond Top Doctor Invisalign","en":"Orthodontist — Diamond Top Doctor Invisalign"}',
    '{"es":"Reconocido como Diamond Top Doctor por Invisalign, la distinción más alta otorgada a ortodoncistas de excelencia. Pionero en tratamientos de ortodoncia invisible en Colombia.","en":"Recognized as Diamond Top Doctor by Invisalign, the highest distinction awarded to excellence orthodontists. Pioneer in invisible orthodontic treatments in Colombia."}',
    4, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Dr. Iván Darío Jiménez',
    'ivan-dario-jimenez',
    '{"es":"Ortodoncista y MSc.","en":"Orthodontist and MSc."}',
    '{"es":"Maestría en Ortodoncia con especialización en casos complejos de maloclusión y tratamientos interdisciplinarios. Referente en planificación digital de casos ortognáticos.","en":"Master''s degree in Orthodontics specializing in complex malocclusion cases and interdisciplinary treatments. Reference in digital planning of orthognathic cases."}',
    5, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Dr. Alejandro Cifuentes',
    'alejandro-cifuentes',
    '{"es":"Especialista en Rehabilitación Oral","en":"Oral Rehabilitation Specialist"}',
    '{"es":"Especialista en rehabilitación oral integral con enfoque en estética y funcionalidad. Experto en diseño digital de sonrisa y restauraciones en porcelana de alta estética.","en":"Specialist in comprehensive oral rehabilitation with a focus on aesthetics and functionality. Expert in digital smile design and high-aesthetic porcelain restorations."}',
    6, true
  )
ON CONFLICT (site_id, slug) DO UPDATE
  SET role_i18n = EXCLUDED.role_i18n,
      bio_i18n  = EXCLUDED.bio_i18n,
      sort_order = EXCLUDED.sort_order,
      is_visible = EXCLUDED.is_visible;


-- TESTIMONIOS (4 pacientes internacionales representativos)
INSERT INTO testimonials (site_id, author_name, author_location, content_i18n, rating, is_visible, sort_order)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Carolina Méndez',
    'Miami, FL',
    '{"es":"Vine a Allura buscando un cambio de sonrisa completo y superó todas mis expectativas. El equipo es increíblemente profesional, el trato fue cálido desde el primer momento y el resultado es simplemente hermoso. ¡Regreso el año que viene por mis carillas!","en":"I came to Allura looking for a complete smile makeover and it exceeded all my expectations. The team is incredibly professional, the treatment was warm from the first moment and the result is simply beautiful. I''m coming back next year for my veneers!"}',
    5, true, 1
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'James Thornton',
    'Toronto, Canada',
    '{"es":"Como paciente internacional, tenía muchas dudas sobre viajar a Colombia para tratamiento dental. Allura disipó todos mis miedos. Coordinación impecable, instalaciones de primer nivel y el Dr. Henao es un maestro con Invisalign. Economicé más del 60% vs Canadá.","en":"As an international patient, I had many doubts about traveling to Colombia for dental treatment. Allura dispelled all my fears. Impeccable coordination, top-tier facilities, and Dr. Henao is a master with Invisalign. I saved more than 60% compared to Canada."}',
    5, true, 2
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Valentina Rojas',
    'Bogotá, Colombia',
    '{"es":"Me realizaron un diseño digital de sonrisa y restauraciones en porcelana con el Dr. Cifuentes. La planificación fue detallada, me mostraron exactamente cómo quedaría antes de iniciar. El resultado final es exactamente lo que soñé. Totalmente recomendado.","en":"I had a digital smile design and porcelain restorations with Dr. Cifuentes. The planning was detailed, they showed me exactly how it would look before starting. The final result is exactly what I dreamed of. Totally recommended."}',
    5, true, 3
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Robert Sullivan',
    'New York, USA',
    '{"es":"Viajé a Medellín específicamente por Allura para un All-on-6. En Estados Unidos me cotizaron el doble. La experiencia fue excepcional: recogida en el aeropuerto, alojamiento coordinado, seguimiento post-operatorio por WhatsApp. Cinco estrellas sin dudarlo.","en":"I traveled to Medellín specifically for Allura for an All-on-6. In the United States they quoted me twice the price. The experience was exceptional: airport pickup, coordinated accommodation, post-operative follow-up via WhatsApp. Five stars without hesitation."}',
    5, true, 4
  )
ON CONFLICT DO NOTHING;


-- FAQs (preguntas reales de turismo médico dental)
INSERT INTO faqs (site_id, question_i18n, answer_i18n, sort_order, is_visible)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"¿Cuánto tiempo necesito estar en Medellín para mi tratamiento?","en":"How long do I need to stay in Medellín for my treatment?"}',
    '{"es":"Depende del tratamiento. Para diseños de sonrisa con carillas o coronas: entre 7 y 12 días. Para implantes unitarios: 5 a 7 días para la primera fase, con una segunda visita en 3 a 6 meses. Para Invisalign solo necesitas una visita inicial y el resto del seguimiento puede ser remoto. Te entregamos un cronograma detallado antes de viajar.","en":"It depends on the treatment. For smile designs with veneers or crowns: between 7 and 12 days. For single implants: 5 to 7 days for the first phase, with a second visit in 3 to 6 months. For Invisalign you only need an initial visit and the rest of the follow-up can be done remotely. We provide a detailed schedule before you travel."}',
    1, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"¿Cuánto ahorro al hacerme el tratamiento en Medellín vs. Estados Unidos o Canadá?","en":"How much do I save by getting treatment in Medellín vs. the United States or Canada?"}',
    '{"es":"En promedio, nuestros pacientes internacionales ahorran entre el 50% y el 70% en comparación con los precios de Estados Unidos, Canadá o Europa, incluyendo vuelos y alojamiento. Por ejemplo, un All-on-4 que cuesta USD 30.000 en EE.UU. puede costar entre USD 9.000 y USD 13.000 en Allura, con la misma calidad de materiales e implantes.","en":"On average, our international patients save between 50% and 70% compared to prices in the United States, Canada or Europe, including flights and accommodation. For example, an All-on-4 that costs USD 30,000 in the US can cost between USD 9,000 and USD 13,000 at Allura, with the same quality of materials and implants."}',
    2, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"¿Cómo es el proceso para agendar desde el exterior?","en":"What is the process for scheduling from abroad?"}',
    '{"es":"Es muy sencillo: 1) Contáctanos por WhatsApp o formulario con fotos o radiografías de tu caso. 2) En 24-48 horas recibes un diagnóstico preliminar y cotización personalizada. 3) Defines fecha de viaje y coordinamos alojamiento, traslados y agenda clínica. 4) Llegas a Medellín con todo organizado. Tenemos coordinadores bilingües disponibles.","en":"It''s very simple: 1) Contact us via WhatsApp or form with photos or X-rays of your case. 2) Within 24-48 hours you receive a preliminary diagnosis and personalized quote. 3) You set your travel date and we coordinate accommodation, transfers and clinical schedule. 4) You arrive in Medellín with everything organized. We have bilingual coordinators available."}',
    3, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"¿Los materiales e implantes que usan son de calidad internacional?","en":"Are the materials and implants you use of international quality?"}',
    '{"es":"Absolutamente. Trabajamos exclusivamente con marcas líderes mundiales: implantes Nobel Biocare y Straumann, cerámicas IPS e.max y Zirconia, y alineadores Invisalign originales. Los mismos materiales que se usan en clínicas de Miami, Nueva York o Zúrich, a una fracción del costo.","en":"Absolutely. We work exclusively with world-leading brands: Nobel Biocare and Straumann implants, IPS e.max and Zirconia ceramics, and original Invisalign aligners. The same materials used in clinics in Miami, New York or Zurich, at a fraction of the cost."}',
    4, true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '{"es":"¿Qué pasa si necesito seguimiento después de regresar a mi país?","en":"What happens if I need follow-up after returning to my country?"}',
    '{"es":"Ofrecemos seguimiento remoto por WhatsApp y videollamada sin costo adicional. Para casos de Invisalign, el monitoreo puede ser 100% remoto tras la visita inicial. En caso de necesitar atención presencial urgente, tenemos red de clínicas aliadas internacionales y garantizamos respuesta en menos de 24 horas.","en":"We offer remote follow-up via WhatsApp and video call at no additional cost. For Invisalign cases, monitoring can be 100% remote after the initial visit. In case of urgent in-person care, we have a network of international allied clinics and guarantee a response within 24 hours."}',
    5, true
  )
ON CONFLICT DO NOTHING;
