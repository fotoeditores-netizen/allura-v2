import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    logo { asset, alt },
    logoLight { asset, alt },
    contactEmail,
    whatsappNumber,
    whatsappMessage,
    responseTime,
    address,
    socialInstagram,
    socialFacebook,
    socialLinkedin,
    socialYoutube,
    socialTiktok,
    seo
  }
`

export interface SiteSettings {
  siteName: string
  tagline: { es: string; en: string }
  logo: { asset: { _ref: string }; alt: string }
  logoLight?: { asset: { _ref: string }; alt: string }
  contactEmail: string
  whatsappNumber: string
  whatsappMessage: { es: string; en: string }
  responseTime: { es: string; en: string }
  address?: string
  socialInstagram?: string
  socialFacebook?: string
  socialLinkedin?: string
  socialYoutube?: string
  socialTiktok?: string
  seo?: {
    metaTitle: { es: string; en: string }
    metaDescription: { es: string; en: string }
  }
}

// Legacy alias — remove once all consumers are updated
/** @deprecated Use siteSettingsQuery instead */
export const globalConfigQuery = siteSettingsQuery
export type GlobalConfig = SiteSettings
