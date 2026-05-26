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

// Home Page Types
export type LocaleString = {
  es: string
  en: string
}

export type SanityImage = {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions?: {
        width: number
        height: number
      }
    }
  }
  alt?: string | LocaleString
}

export type CtaField = {
  label: LocaleString
  url?: string
  openInNewTab?: boolean
}

export interface HomePage {
  hero?: {
    eyebrow?: LocaleString
    headlinePart1?: LocaleString
    headlinePart2?: LocaleString
    subtext?: LocaleString
    ctaPrimary?: CtaField
    ctaSecondary?: CtaField
    backgroundImage?: SanityImage
  }
  benefitsSection?: {
    eyebrow?: LocaleString
    title?: LocaleString
    subtitle?: LocaleString
    benefits?: Array<{
      icon?: string
      title?: LocaleString
      description?: LocaleString
    }>
  }
  aboutTeaser?: {
    eyebrow?: LocaleString
    title?: LocaleString
    body?: LocaleString
    cta?: CtaField
    image?: SanityImage
  }
  medellinSection?: {
    eyebrow?: LocaleString
    title?: LocaleString
    subtitle?: LocaleString
    blocks?: Array<{
      title?: LocaleString
      text?: LocaleString
    }>
    cta?: CtaField
  }
  processSection?: {
    eyebrow?: LocaleString
    title?: LocaleString
    steps?: Array<{
      stepNumber?: number
      title?: LocaleString
      description?: LocaleString
    }>
    cta?: CtaField
  }
  ctaBanner?: {
    eyebrow?: LocaleString
    title?: LocaleString
    body?: LocaleString
    cta?: CtaField
    backgroundImage?: SanityImage
  }
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    canonicalUrl?: string
  }
}

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    hero {
      eyebrow,
      headlinePart1,
      headlinePart2,
      subtext,
      ctaPrimary { label, url, openInNewTab },
      ctaSecondary { label, url, openInNewTab },
      backgroundImage {
        asset->{ _id, url, metadata { dimensions } },
        alt
      }
    },
    benefitsSection {
      eyebrow,
      title,
      subtitle,
      benefits[] {
        icon,
        title,
        description
      }
    },
    aboutTeaser {
      eyebrow,
      title,
      body,
      cta { label, url, openInNewTab },
      image {
        asset->{ _id, url, metadata { dimensions } },
        alt
      }
    },
    medellinSection {
      eyebrow,
      title,
      subtitle,
      blocks[] {
        title,
        text
      },
      cta { label, url, openInNewTab }
    },
    processSection {
      eyebrow,
      title,
      steps[] {
        stepNumber,
        title,
        description
      },
      cta { label, url, openInNewTab }
    },
    ctaBanner {
      eyebrow,
      title,
      body,
      cta { label, url, openInNewTab },
      backgroundImage {
        asset->{ _id, url, metadata { dimensions } },
        alt
      }
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset->{ _id, url, metadata { dimensions } },
        alt
      },
      canonicalUrl
    }
  }
`
