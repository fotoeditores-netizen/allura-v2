import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { SiteSettings, TrackingScripts } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

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
    socialX: map.social_x as string | undefined,
    seoTitle: map.seo_title as SiteSettings['seoTitle'],
    seoDescription: map.seo_description as SiteSettings['seoDescription'],
    seoImageUrl: map.seo_image_url as string | undefined,
    footerSlogan: { es: (map.footer_slogan_es as string) ?? '', en: (map.footer_slogan_en as string) ?? '' },
    footerBrandText: { es: (map.footer_brand_text_es as string) ?? '', en: (map.footer_brand_text_en as string) ?? '' },
    footerWaHeading: { es: (map.footer_wa_heading_es as string) ?? '', en: (map.footer_wa_heading_en as string) ?? '' },
    footerWaSub: { es: (map.footer_wa_sub_es as string) ?? '', en: (map.footer_wa_sub_en as string) ?? '' },
    footerWaCta: { es: (map.footer_wa_cta_es as string) ?? '', en: (map.footer_wa_cta_en as string) ?? '' },
    footerCopyright: { es: (map.footer_copyright_es as string) ?? '', en: (map.footer_copyright_en as string) ?? '' },
    footerNavSectionTitle: { es: (map.footer_nav_section_es as string) ?? '', en: (map.footer_nav_section_en as string) ?? '' },
    footerServicesSectionTitle: { es: (map.footer_services_section_es as string) ?? '', en: (map.footer_services_section_en as string) ?? '' },
    footerContactSectionTitle: { es: (map.footer_contact_section_es as string) ?? '', en: (map.footer_contact_section_en as string) ?? '' },
    footerLocation: { es: (map.footer_location_es as string) ?? '', en: (map.footer_location_en as string) ?? '' },
    footerWaAvail: { es: (map.footer_wa_avail_es as string) ?? '', en: (map.footer_wa_avail_en as string) ?? '' },
    footerLegalPrivacy: { es: (map.footer_legal_privacy_es as string) ?? '', en: (map.footer_legal_privacy_en as string) ?? '' },
    footerLegalTerms: { es: (map.footer_legal_terms_es as string) ?? '', en: (map.footer_legal_terms_en as string) ?? '' },
    footerLegalMedical: { es: (map.footer_legal_medical_es as string) ?? '', en: (map.footer_legal_medical_en as string) ?? '' },
    footerLegalAccess: { es: (map.footer_legal_access_es as string) ?? '', en: (map.footer_legal_access_en as string) ?? '' },
    footerNavItemsEs: (map.footer_nav_items_es as string) ?? '',
    footerNavItemsEn: (map.footer_nav_items_en as string) ?? '',
    footerServiceItems: (map.footer_service_items as string) ?? '',
    footerPartners: (map.footer_partners as string) ?? '',
    footerQualityLogos: (map.footer_quality_logos as string) ?? '',
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
