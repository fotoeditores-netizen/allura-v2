-- Limpiar duplicados de equipo (eliminar slugs con prefijo dr-/dra-)
DELETE FROM team_members WHERE slug IN (
  'dra-johanna-jaramillo',
  'dra-daniela-alzate',
  'dr-sebastian-munoz',
  'dr-santiago-henao',
  'dr-ivan-dario-jimenez',
  'dr-alejandro-cifuentes'
);

-- Limpiar testimonios placeholder originales
DELETE FROM testimonials WHERE author_name IN ('Sarah M.', 'Carlos R.', 'María L.');

-- Limpiar FAQs duplicadas (mantener solo las últimas 5 — el set completo del seed)
DELETE FROM faqs WHERE id IN (
  'ba752f17-c5d8-4d76-bb92-285d0c18beeb',
  'fd25e49b-9934-4492-8687-4474c7b79629',
  '908c8f90-0b0e-4aab-9a99-bce5f0592620',
  'b67759af-320b-45ac-bd0b-f0dd82b1a5dd'
);
