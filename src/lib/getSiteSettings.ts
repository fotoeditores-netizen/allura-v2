import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/sanity/lib/queries'

const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { revalidate } }
  )
}

export function buildWhatsAppUrl(
  settings: SiteSettings | null,
  locale: 'es' | 'en'
): string {
  const FALLBACK =
    'https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare'
  if (!settings?.whatsappNumber) return FALLBACK
  const number = settings.whatsappNumber.replace(/\D/g, '')
  const message =
    settings.whatsappMessage?.[locale] || settings.whatsappMessage?.es || ''
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
