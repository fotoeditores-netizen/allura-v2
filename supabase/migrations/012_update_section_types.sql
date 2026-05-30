-- Actualizar constraint de tipos de sección para incluir todos los tipos del proyecto
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
ALTER TABLE sections ADD CONSTRAINT sections_type_check CHECK (type IN (
  'hero',
  'benefits',
  'services_grid',
  'about_teaser',
  'medellin',
  'team_preview',
  'process',
  'cta',
  'text_image',
  'testimonials',
  'gallery',
  'faq',
  'contact_form',
  'metrics',
  'logos',
  'team',
  'map'
));
