import { createClient } from './client'
import type { SiteSettings, TrackingScripts } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('site_id', SITE_ID)

  if (error || !data) return null

  const map = Object.fromEntries(data.map((r: { key: string; value: unknown }) => [r.key, r.value]))

  return {
    siteName: (map.site_name as string) ?? 'Allura Healthcare',
    tagline: (map.tagline as SiteSettings['tagline']) ?? { es: '', en: '' },
    logoUrl: (map.logo_url as string) ?? '',
    logoAlt: (map.logo_alt as string) ?? 'Allura Healthcare',
    logoLightUrl: map.logo_light_url as string | undefined,
    contactEmail: (map.contact_email as string) ?? '',
    whatsappNumber: (map.whatsapp_number as string) ?? '',
    whatsappMessage: (map.whatsapp_message as SiteSettings['whatsappMessage']) ?? { es: '', en: '' },
    responseTime: (map.response_time as SiteSettings['responseTime']) ?? { es: '', en: '' },
    address: map.address as string | undefined,
    socialInstagram: map.social_instagram as string | undefined,
    socialFacebook: map.social_facebook as string | undefined,
    socialLinkedin: map.social_linkedin as string | undefined,
    socialYoutube: map.social_youtube as string | undefined,
    socialTiktok: map.social_tiktok as string | undefined,
    seoTitle: map.seo_title as SiteSettings['seoTitle'],
    seoDescription: map.seo_description as SiteSettings['seoDescription'],
    seoImageUrl: map.seo_image_url as string | undefined,
  }
}

export async function getTrackingScripts(): Promise<TrackingScripts | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('site_id', SITE_ID)
    .in('key', [
      'ga_measurement_id', 'gtm_container_id', 'meta_pixel_id',
      'tiktok_pixel_id', 'google_ads_id', 'hotjar_id', 'clarity_id',
      'google_search_console'
    ])

  if (error || !data) return null
  const map = Object.fromEntries(data.map((r: { key: string; value: unknown }) => [r.key, r.value]))

  return {
    googleAnalyticsId: map.ga_measurement_id as string | undefined,
    gtmContainerId: map.gtm_container_id as string | undefined,
    metaPixelId: map.meta_pixel_id as string | undefined,
    tiktokPixelId: map.tiktok_pixel_id as string | undefined,
    googleAdsId: map.google_ads_id as string | undefined,
    hotjarId: map.hotjar_id as string | undefined,
    clarityId: map.clarity_id as string | undefined,
    googleSearchConsoleVerification: map.google_search_console as string | undefined,
  }
}

export function buildWhatsAppUrl(settings: SiteSettings | null, locale: 'es' | 'en'): string {
  const FALLBACK = 'https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare'
  if (!settings?.whatsappNumber) return FALLBACK
  const number = settings.whatsappNumber.replace(/\D/g, '')
  const message = settings.whatsappMessage?.[locale] || settings.whatsappMessage?.es || ''
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
