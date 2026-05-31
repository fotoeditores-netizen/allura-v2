export interface MenuItem {
  id: string
  label: { es: string; en: string }
  href: string
  children?: MenuItem[]
}

export const defaultMenu: MenuItem[] = [
  { id: 'm1', label: { es: 'Cómo funciona', en: 'How it works' }, href: '/como-funciona' },
  { id: 'm2', label: { es: 'Nosotros', en: 'About us' }, href: '/nosotros' },
  { id: 'm3', label: { es: 'Equipo', en: 'Team' }, href: '/equipo' },
  {
    id: 'm4', label: { es: 'Servicios', en: 'Services' }, href: '/servicios',
    children: [
      { id: 'm4a', label: { es: 'Full Mouth Reconstruction', en: 'Full Mouth Reconstruction' }, href: '/servicios/full-mouth-reconstruction' },
      { id: 'm4b', label: { es: 'Smile Makeover', en: 'Smile Makeover' }, href: '/servicios/smile-makeover' },
      { id: 'm4c', label: { es: 'Aligners', en: 'Aligners' }, href: '/servicios/aligners' },
      { id: 'm4d', label: { es: 'Facial Harmony', en: 'Facial Harmony' }, href: '/servicios/facial-harmony' },
    ]
  },
  { id: 'm5', label: { es: 'Contacto', en: 'Contact' }, href: '/contacto' },
  { id: 'm6', label: { es: 'Blog', en: 'Blog' }, href: '/blog' },
]
