/**
 * CMS-agnostic type definitions.
 * Previously imported from @/sanity/lib/queries — now standalone.
 */
import type { PortableTextBlock } from '@portabletext/types'

// ─── Primitive shared types ───────────────────────────────────────────────────

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
  alt?: string
}

export type SanityImageLocaleAlt = {
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
  alt?: LocaleString
}

export type CtaField = {
  label: LocaleString
  url?: string
  openInNewTab?: boolean
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export interface GlobalConfig {
  siteName: string
  tagline?: { es: string; en: string }
  contactEmail?: string
  whatsappNumber?: string
  socialInstagram?: string
  socialFacebook?: string
  socialLinkedin?: string
}

// ─── Service Types ────────────────────────────────────────────────────────────

export interface ServiceCategoryData {
  _id: string
  title: LocaleString
  slug: { current: string }
  description: LocaleString
  icon?: string
  coverImage?: SanityImageLocaleAlt
  order?: number
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    noIndex?: boolean
    canonicalUrl?: string
  }
  services?: ServiceListItem[]
}

export interface ServiceListItem {
  _id: string
  title: LocaleString
  slug: { current: string }
  shortDescription: LocaleString
  coverImage?: SanityImageLocaleAlt
}

export interface ServiceProcessStep {
  stepNumber?: string
  title: LocaleString
  description: LocaleString
  duration?: LocaleString
}

export interface ServiceBenefit {
  icon?: string
  title: LocaleString
  description: LocaleString
}

export interface ServiceDetailData {
  _id: string
  title: LocaleString
  slug: { current: string }
  shortDescription: LocaleString
  body?: PortableTextBlock[]
  benefits?: ServiceBenefit[]
  process?: ServiceProcessStep[]
  coverImage?: SanityImageLocaleAlt
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    noIndex?: boolean
    canonicalUrl?: string
  }
  category?: {
    title: LocaleString
    slug: { current: string }
  }
}

// ─── Blog Types ───────────────────────────────────────────────────────────────

export interface BlogCategory {
  _id: string
  title: LocaleString
  slug: { current: string }
  color?: string
}

export interface BlogPostListItem {
  _id: string
  title: LocaleString
  slug: { current: string }
  excerpt?: LocaleString
  publishedAt: string
  featuredImage?: SanityImageLocaleAlt
  categories?: BlogCategory[]
  author?: { name: string }
}

export interface BlogPostDetail {
  _id: string
  title: LocaleString
  slug: { current: string }
  excerpt?: LocaleString
  publishedAt: string
  featuredImage?: SanityImageLocaleAlt
  body?: {
    es: PortableTextBlock[]
    en: PortableTextBlock[]
  }
  categories?: BlogCategory[]
  author?: {
    name: string
    photo?: SanityImage
  }
  seo?: {
    metaTitle?: LocaleString
    metaDescription?: LocaleString
    ogImage?: SanityImage
    noIndex?: boolean
    canonicalUrl?: string
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface TestimonialItem {
  _id: string
  patientName: string
  patientOrigin?: LocaleString
  quote: { es: string; en: string }
  rating: number
  photo?: {
    asset: { url: string }
    alt?: string
  }
  service?: { title: LocaleString }
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export interface FaqItem {
  _id: string
  question: LocaleString
  answer?: {
    es: PortableTextBlock[]
    en: PortableTextBlock[]
  }
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface TeamMemberListItem {
  _id: string
  name: string
  slug: { current: string }
  role: LocaleString
  photo?: {
    asset: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } }
    alt?: string
  }
  specialties?: Array<{ es: string; en: string }>
  credentials?: string[]
}

export interface TeamMemberDetail {
  _id: string
  name: string
  slug: { current: string }
  role: LocaleString
  photo?: {
    asset: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } }
    alt?: string
  }
  shortBio?: LocaleString
  fullBio?: {
    es: PortableTextBlock[]
    en: PortableTextBlock[]
  }
  specialties?: Array<{ es: string; en: string }>
  credentials?: string[]
  linkedinUrl?: string
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export interface GalleryItemData {
  _id: string
  title?: { es?: string; en?: string }
  category?: string
  isFeatured?: boolean
  image: {
    asset: {
      _id: string
      url: string
      metadata?: { dimensions?: { width: number; height: number } }
    }
    alt?: { es?: string; en?: string }
  }
}

// ─── Video ────────────────────────────────────────────────────────────────────

export interface VideoItem {
  _id: string
  title: { es: string; en: string }
  description?: { es?: string; en?: string }
  platform: 'youtube' | 'vimeo' | 'instagram'
  videoId: string
  thumbnail?: { asset: { url: string }; alt?: { es?: string; en?: string } }
  category?: string
  isFeatured?: boolean
}

// ─── Popup ────────────────────────────────────────────────────────────────────

export interface ActivePopup {
  _id: string
  title: { es: string; en: string }
  body?: {
    es: PortableTextBlock[]
    en: PortableTextBlock[]
  }
  image?: { asset: { url: string }; alt?: { es?: string; en?: string } }
  cta?: {
    label: { es: string; en: string }
    url: string
    style?: string
    openInNewTab?: boolean
  }
  trigger?: 'on-load' | 'timed'
  delaySeconds?: number
  showOnPages?: string[]
  startDate?: string
  endDate?: string
  frequency?: 'once' | 'per-session' | 'always'
}

// ─── Promotion ────────────────────────────────────────────────────────────────

export interface ActivePromotion {
  _id: string
  title: { es: string; en: string }
  description?: { es?: string; en?: string }
  cta?: {
    label: { es: string; en: string }
    url: string
    style?: string
    openInNewTab?: boolean
  }
  bgColor?: 'navy' | 'blue' | 'gold'
  startDate?: string
  endDate?: string
}
