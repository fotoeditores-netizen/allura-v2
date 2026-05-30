export interface SectionDefinition {
  type: string
  label: string
  icon: string
  defaultSettings: Record<string, unknown>
}

export const SECTION_REGISTRY: SectionDefinition[] = [
  {
    type: 'hero',
    label: 'Hero principal',
    icon: '🏠',
    defaultSettings: {
      eyebrow: { es: '', en: '' },
      headline1: { es: 'Salud que inspira,', en: 'Health that inspires,' },
      headline2: { es: 'viajes que transforman', en: 'journeys that transform' },
      subtitle: { es: '', en: '' },
      ctaPrimary: { es: 'Conoce nuestros servicios', en: 'Explore our services' },
      ctaSecondary: { es: '¿Cómo funciona?', en: 'How does it work?' },
      imageUrl: '',
    },
  },
  {
    type: 'benefits',
    label: 'Beneficios',
    icon: '✨',
    defaultSettings: {
      eyebrow: { es: 'Por qué elegirnos', en: 'Why choose us' },
      title: { es: 'Una experiencia diseñada para ti', en: 'An experience designed for you' },
      subtitle: { es: '', en: '' },
      items: [
        { icon: '🏆', title: { es: 'Excelencia Profesional', en: 'Professional Excellence' }, description: { es: '', en: '' } },
        { icon: '🤝', title: { es: 'Acompañamiento Personalizado', en: 'Personalized Support' }, description: { es: '', en: '' } },
        { icon: '🔬', title: { es: 'Tecnología y Ética', en: 'Technology & Ethics' }, description: { es: '', en: '' } },
      ],
    },
  },
  {
    type: 'services_grid',
    label: 'Servicios',
    icon: '⚕️',
    defaultSettings: {
      eyebrow: { es: 'Nuestros servicios', en: 'Our services' },
      title: { es: 'Especialidades Allura', en: 'Allura Specialties' },
      subtitle: { es: '', en: '' },
    },
  },
  {
    type: 'about_teaser',
    label: 'Sobre nosotros',
    icon: '🏥',
    defaultSettings: {
      eyebrow: { es: 'Nuestra filosofía', en: 'Our philosophy' },
      title: { es: '', en: '' },
      subtitle: { es: '', en: '' },
      body: { es: '', en: '' },
      imageUrl: '',
      ctaLabel: { es: 'Conoce nuestro equipo', en: 'Meet our team' },
    },
  },
  {
    type: 'medellin',
    label: 'Medellín',
    icon: '🌆',
    defaultSettings: {
      eyebrow: { es: 'Por qué Medellín', en: 'Why Medellín' },
      title: { es: '', en: '' },
      subtitle: { es: '', en: '' },
      items: [
        { icon: '🏥', title: { es: 'Excelencia médica', en: 'Medical excellence' }, description: { es: '', en: '' } },
        { icon: '🌤️', title: { es: 'Recuperación más cómoda', en: 'More comfortable recovery' }, description: { es: '', en: '' } },
        { icon: '✈️', title: { es: 'Conectividad y logística', en: 'Connectivity and logistics' }, description: { es: '', en: '' } },
        { icon: '🌿', title: { es: 'Bienestar y experiencia', en: 'Wellness and experience' }, description: { es: '', en: '' } },
      ],
    },
  },
  {
    type: 'team_preview',
    label: 'Equipo',
    icon: '👨‍⚕️',
    defaultSettings: {
      eyebrow: { es: 'Nuestro equipo', en: 'Our team' },
      title: { es: 'Conoce nuestro equipo experto', en: 'Meet our expert team' },
      subtitle: { es: '', en: '' },
    },
  },
  {
    type: 'process',
    label: 'Proceso',
    icon: '📋',
    defaultSettings: {
      eyebrow: { es: 'Cómo funciona', en: 'How it works' },
      title: { es: 'Tu proceso con Allura', en: 'Your journey with Allura' },
      steps: [
        { number: '01', title: { es: 'Cuéntanos tu objetivo', en: 'Share your goals' }, description: { es: '', en: '' } },
        { number: '02', title: { es: 'Consulta virtual', en: 'Virtual consultation' }, description: { es: '', en: '' } },
        { number: '03', title: { es: 'Plan personalizado', en: 'Personalized plan' }, description: { es: '', en: '' } },
        { number: '04', title: { es: 'Tratamiento experto', en: 'Expert treatment' }, description: { es: '', en: '' } },
      ],
    },
  },
  {
    type: 'cta',
    label: 'CTA Banner',
    icon: '📣',
    defaultSettings: {
      eyebrow: { es: 'Da el primer paso', en: 'Take the first step' },
      title: { es: 'Transforma tu bienestar.', en: 'Transform your wellbeing.' },
      subtitle: { es: '', en: '' },
      buttonLabel: { es: 'Contactar ahora', en: 'Contact us now' },
    },
  },
  {
    type: 'testimonials',
    label: 'Testimonios',
    icon: '⭐',
    defaultSettings: {
      eyebrow: { es: 'Lo que dicen nuestros pacientes', en: 'What our patients say' },
      title: { es: 'Experiencias reales, resultados reales', en: 'Real experiences, real results' },
    },
  },
  {
    type: 'faq',
    label: 'Preguntas frecuentes',
    icon: '❓',
    defaultSettings: {
      eyebrow: { es: 'Preguntas frecuentes', en: 'FAQ' },
      title: { es: 'Lo que más nos preguntan', en: 'What people ask us most' },
    },
  },
  {
    type: 'contact_form',
    label: 'Formulario de contacto',
    icon: '📬',
    defaultSettings: {
      eyebrow: { es: 'Hablemos', en: "Let's talk" },
      title: { es: 'Comienza tu experiencia Allura', en: 'Start your Allura experience' },
      subtitle: { es: 'Te respondemos en menos de 24 horas.', en: "We'll respond within 24 hours." },
    },
  },
  {
    type: 'text_image',
    label: 'Texto + imagen',
    icon: '🖼️',
    defaultSettings: {
      title: { es: '', en: '' },
      body: { es: '', en: '' },
      imageUrl: '',
      imagePosition: 'right',
    },
  },
  {
    type: 'cards_grid',
    label: 'Grid de tarjetas',
    icon: '🃏',
    defaultSettings: {
      internalName: 'Grid de tarjetas',
      eyebrow: { es: '', en: '' },
      title: { es: '', en: '' },
      subtitle: { es: '', en: '' },
      columns: 3,
      bg: 'white',
      cardStyle: 'bordered',
      cards: [
        { icon: '⭐', title: { es: 'Tarjeta 1', en: 'Card 1' }, body: { es: '', en: '' }, imageUrl: '', ctaLabel: { es: '', en: '' }, ctaUrl: '' },
        { icon: '🏆', title: { es: 'Tarjeta 2', en: 'Card 2' }, body: { es: '', en: '' }, imageUrl: '', ctaLabel: { es: '', en: '' }, ctaUrl: '' },
        { icon: '❤️', title: { es: 'Tarjeta 3', en: 'Card 3' }, body: { es: '', en: '' }, imageUrl: '', ctaLabel: { es: '', en: '' }, ctaUrl: '' },
      ],
    },
  },
  {
    type: 'custom_form',
    label: 'Formulario personalizado',
    icon: '📬',
    defaultSettings: {
      internalName: 'Formulario de contacto',
      eyebrow: { es: 'Escríbenos', en: 'Contact us' },
      title: { es: 'Cuéntanos en qué podemos ayudarte', en: 'Tell us how we can help you' },
      subtitle: { es: '', en: '' },
      submitLabel: { es: 'Enviar mensaje', en: 'Send message' },
      successMessage: { es: '¡Gracias! Te contactaremos pronto.', en: 'Thank you! We will contact you soon.' },
      toEmail: '',
      bg: 'light',
      fields: [
        { id: 'f1', type: 'text',  label: { es: 'Nombre', en: 'Name' }, placeholder: { es: 'Tu nombre completo', en: 'Your full name' }, required: true, options: '' },
        { id: 'f2', type: 'email', label: { es: 'Email', en: 'Email' }, placeholder: { es: 'tu@email.com', en: 'your@email.com' }, required: true, options: '' },
        { id: 'f3', type: 'phone', label: { es: 'Teléfono', en: 'Phone' }, placeholder: { es: '+57 300 000 0000', en: '+1 000 000 0000' }, required: false, options: '' },
        { id: 'f4', type: 'textarea', label: { es: 'Mensaje', en: 'Message' }, placeholder: { es: '¿En qué podemos ayudarte?', en: 'How can we help you?' }, required: true, options: '' },
      ],
    },
  },
  {
    type: 'custom',
    label: 'Sección personalizada',
    icon: '🎨',
    defaultSettings: {
      internalName: 'Mi sección',
      layout: 'text-center',
      bg: 'white',
      padding: 'normal',
      align: 'center',
      eyebrow: { es: '', en: '' },
      title: { es: '', en: '' },
      subtitle: { es: '', en: '' },
      body: { es: '', en: '' },
      imageUrl: '',
      imagePosition: 'right',
      ctaLabel: { es: '', en: '' },
      ctaUrl: '',
      ctaStyle: 'primary',
    },
  },
]

export function getSectionDef(type: string): SectionDefinition | undefined {
  return SECTION_REGISTRY.find(s => s.type === type)
}
