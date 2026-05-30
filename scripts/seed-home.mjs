import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://fokazpfycsdzvogjlolf.supabase.co',
  'sb_secret_iLB6e2XGnMQH4QEZRBjgPw__DhOIcrY',
  { auth: { persistSession: false } }
)

const PAGE_ID = '864822e7-bc94-4e6d-9014-24cf7a49e452'
const SITE_ID = '00000000-0000-0000-0000-000000000001'

const sections = [
  {
    page_id: PAGE_ID, type: 'hero', sort_order: 0, is_visible: true,
    settings: {
      eyebrow: { es: 'Medellín, Colombia · Pacientes Internacionales', en: 'Medellín, Colombia · International Patients' },
      headline1: { es: 'Salud que inspira,', en: 'Health that inspires,' },
      headline2: { es: 'viajes que transforman', en: 'journeys that transform' },
      subtitle: { es: 'Atención médica y odontológica premium en Medellín, con acompañamiento personalizado para pacientes internacionales.', en: 'Premium dental and medical care in Medellín, with personalized support for international patients.' },
      ctaPrimary: { es: 'Conoce nuestros servicios', en: 'Explore our services' },
      ctaSecondary: { es: '¿Cómo funciona?', en: 'How does it work?' },
      imageUrl: ''
    }
  },
  {
    page_id: PAGE_ID, type: 'benefits', sort_order: 1, is_visible: true,
    settings: {
      eyebrow: { es: 'Por qué elegirnos', en: 'Why choose us' },
      title: { es: 'Una experiencia diseñada para ti', en: 'An experience designed for you' },
      subtitle: { es: 'En Allura, tu bienestar es nuestra única prioridad.', en: 'At Allura, your wellbeing is our only priority.' },
      items: [
        { icon: '🏆', title: { es: 'Excelencia Profesional', en: 'Professional Excellence' }, description: { es: 'Trabajamos con especialistas certificados internacionalmente que combinan rigor científico con una atención cercana y personalizada.', en: 'We work with internationally certified specialists who combine scientific rigor with close, personalized attention.' } },
        { icon: '🤝', title: { es: 'Acompañamiento Personalizado', en: 'Personalized Support' }, description: { es: 'Coordinamos cada detalle de tu experiencia: desde la llegada a Medellín hasta el alta médica, para que solo te preocupes por sanar y disfrutar.', en: 'We coordinate every detail of your experience: from arrival in Medellín to discharge, so you only focus on healing and enjoying.' } },
        { icon: '🔬', title: { es: 'Tecnología y Ética', en: 'Technology & Ethics' }, description: { es: 'Utilizamos equipos de última generación bajo protocolos internacionales, con total transparencia en cada etapa de tu tratamiento.', en: 'We use state-of-the-art equipment under international protocols, with full transparency at every stage of your treatment.' } }
      ]
    }
  },
  {
    page_id: PAGE_ID, type: 'services_grid', sort_order: 2, is_visible: true,
    settings: {
      eyebrow: { es: 'Nuestros servicios', en: 'Our services' },
      title: { es: 'Especialidades Allura', en: 'Allura Specialties' },
      subtitle: { es: 'Odontología premium y medicina facial estética para pacientes internacionales.', en: 'Premium dentistry and aesthetic facial medicine for international patients.' }
    }
  },
  {
    page_id: PAGE_ID, type: 'about_teaser', sort_order: 3, is_visible: true,
    settings: {
      eyebrow: { es: 'Nuestra filosofía', en: 'Our philosophy' },
      title: { es: 'Medellín como destino, el bienestar como propósito', en: 'Medellín as a destination, wellbeing as purpose' },
      subtitle: { es: 'Allura nace de la convicción de que la salud y el disfrute no son opuestos. Combinamos la excelencia médica colombiana con la experiencia única de vivir Medellín — su clima, su cultura y su calidez humana.', en: 'Allura is born from the conviction that health and enjoyment are not opposites. We combine Colombian medical excellence with the unique experience of living Medellín — its climate, culture and human warmth.' },
      ctaLabel: { es: 'Conoce nuestro equipo', en: 'Meet our team' },
      imageUrl: ''
    }
  },
  {
    page_id: PAGE_ID, type: 'medellin', sort_order: 4, is_visible: true,
    settings: {
      eyebrow: { es: 'Por qué Medellín', en: 'Why Medellín' },
      title: { es: 'Medellín como destino, el bienestar como propósito', en: 'Medellín as a destination, wellbeing as purpose' },
      subtitle: { es: 'Una ciudad moderna, hospitalaria y bien conectada, ideal para pacientes internacionales que buscan atención de alto nivel y una recuperación más cómoda.', en: 'A modern, welcoming and well-connected city, ideal for international patients seeking world-class care and a more comfortable recovery.' },
      items: [
        { icon: '🏥', title: { es: 'Excelencia médica', en: 'Medical excellence' }, description: { es: 'Especialistas, infraestructura moderna y tecnología de última generación.', en: 'Specialists, modern infrastructure and state-of-the-art technology.' } },
        { icon: '🌤️', title: { es: 'Recuperación más cómoda', en: 'More comfortable recovery' }, description: { es: 'Clima templado, hospitalidad local y estancias diseñadas para pacientes extranjeros.', en: 'Temperate climate, local hospitality and stays designed for international patients.' } },
        { icon: '✈️', title: { es: 'Conectividad y logística', en: 'Connectivity and logistics' }, description: { es: 'Vuelos desde ciudades clave, alojamientos boutique y apoyo durante todo el viaje.', en: 'Flights from key cities, boutique accommodations and support throughout the journey.' } },
        { icon: '🌿', title: { es: 'Bienestar y experiencia', en: 'Wellness and experience' }, description: { es: 'Paisaje, gastronomía y una energía urbana que acompaña el proceso de transformación.', en: 'Scenery, gastronomy and urban energy that accompanies the transformation process.' } }
      ]
    }
  },
  {
    page_id: PAGE_ID, type: 'team_preview', sort_order: 5, is_visible: true,
    settings: {
      eyebrow: { es: 'Nuestro equipo', en: 'Our team' },
      title: { es: 'Conoce nuestro equipo experto', en: 'Meet our expert team' },
      subtitle: { es: 'Conoce a los profesionales que acompañan cada proceso con criterio clínico, experiencia internacional y atención personalizada.', en: 'Meet the professionals who guide each journey with clinical expertise, international experience and personalized attention.' }
    }
  },
  {
    page_id: PAGE_ID, type: 'process', sort_order: 6, is_visible: true,
    settings: {
      eyebrow: { es: 'Cómo funciona', en: 'How it works' },
      title: { es: 'Tu proceso con Allura: simple, seguro y humano', en: 'Your journey with Allura: simple, safe and human' },
      steps: [
        { number: '01', title: { es: 'Cuéntanos tu objetivo', en: 'Share your goals' }, description: { es: 'Te guiaremos en los primeros pasos', en: 'We will guide you through the first steps' } },
        { number: '02', title: { es: 'Consulta virtual', en: 'Virtual consultation' }, description: { es: 'Evaluación inicial con un especialista', en: 'Initial evaluation with a specialist' } },
        { number: '03', title: { es: 'Plan personalizado', en: 'Personalized plan' }, description: { es: 'Recibe un itinerario y plan detallado', en: 'Receive a detailed itinerary and plan' } },
        { number: '04', title: { es: 'Tratamiento experto', en: 'Expert treatment' }, description: { es: 'Atención de excelencia y seguimiento continuo', en: 'Excellence in care and continuous follow-up' } }
      ]
    }
  },
  {
    page_id: PAGE_ID, type: 'cta', sort_order: 7, is_visible: true,
    settings: {
      eyebrow: { es: 'Da el primer paso', en: 'Take the first step' },
      title: { es: 'Transforma tu bienestar. Agenda tu consulta hoy.', en: 'Transform your wellbeing. Book your consultation today.' },
      subtitle: { es: 'Nuestro equipo te acompañará en cada etapa. Sin compromisos, con total transparencia.', en: 'Our team will be with you at every stage. No commitments, complete transparency.' },
      buttonLabel: { es: 'Contactar ahora', en: 'Contact us now' }
    }
  }
]

async function seed() {
  const { error: delErr } = await sb.from('sections').delete().eq('page_id', PAGE_ID)
  if (delErr) { console.log('Error borrando:', delErr.message); process.exit(1) }
  console.log('Secciones anteriores eliminadas')

  const { data, error } = await sb.from('sections').insert(sections).select('id,type')
  if (error) { console.log('Error insertando:', error.message); process.exit(1) }
  console.log('Secciones insertadas:', data.map(s => s.type).join(', '))

  const { error: pubErr } = await sb.from('pages')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', PAGE_ID)
  if (pubErr) { console.log('Error publicando:', pubErr.message); process.exit(1) }
  console.log('Página publicada OK — abre http://localhost:3001/es')
}

seed()
