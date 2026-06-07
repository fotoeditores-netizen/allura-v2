export type Locale = 'es' | 'en'

export type I18nField = { es: string; en: string }

export function i18n(field: I18nField | null | undefined, locale: Locale): string {
  if (!field) return ''
  return field[locale] || field.es || ''
}

export interface SiteSettings {
  siteName: string
  tagline: I18nField
  logoUrl: string
  logoAlt: string
  logoLightUrl?: string
  contactEmail: string
  whatsappNumber: string
  whatsappMessage: I18nField
  responseTime: I18nField
  address?: string
  socialInstagram?: string
  socialFacebook?: string
  socialLinkedin?: string
  socialYoutube?: string
  socialTiktok?: string
  seoTitle?: I18nField
  seoDescription?: I18nField
  seoImageUrl?: string
}

export interface TrackingScripts {
  googleAnalyticsId?: string
  gtmContainerId?: string
  metaPixelId?: string
  tiktokPixelId?: string
  googleAdsId?: string
  hotjarId?: string
  clarityId?: string
  googleSearchConsoleVerification?: string
}

export interface Service {
  id: string
  title: I18nField
  slug: string
  description: I18nField
  body: I18nField
  imageUrl?: string
  imageAlt: I18nField
  categoryId?: string
  status: 'draft' | 'published' | 'archived'
  seoTitle: I18nField
  seoDescription: I18nField
}

export interface ServiceCategory {
  id: string
  title: I18nField
  slug: string
  description: I18nField
}

export interface BlogPost {
  id: string
  title: I18nField
  slug: string
  excerpt: I18nField
  body: I18nField
  coverImageUrl?: string
  coverImageAlt?: string
  author?: string
  category?: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  seoTitle: I18nField
  seoDescription: I18nField
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  role: I18nField
  bio: I18nField
  photoUrl?: string
  sortOrder: number
}

export interface Testimonial {
  id: string
  authorName: string
  authorLocation?: string
  content: I18nField
  rating?: number
  photoUrl?: string
}

export interface Faq {
  id: string
  question: I18nField
  answer: I18nField
  sortOrder: number
  isOpenByDefault: boolean
}

export interface GalleryItem {
  id: string
  imageUrl: string
  alt: I18nField
  caption: I18nField
  category?: string
  sortOrder: number
}

export interface Video {
  id: string
  title: I18nField
  url: string
  thumbnailUrl?: string
  sortOrder: number
}

export interface Popup {
  id: string
  title: I18nField
  body: I18nField
  ctaLabel: I18nField
  ctaUrl?: string
  imageUrl?: string
  delaySeconds: number
}

export interface Promotion {
  id: string
  title: I18nField
  description: I18nField
  ctaLabel: I18nField
  ctaUrl?: string
  imageUrl?: string
  validFrom?: string
  validUntil?: string
}

export interface FormSubmission {
  id: string
  nombre: string
  email: string
  telefono?: string
  servicio?: string
  mensaje?: string
  sourcePage?: string
  status: 'nuevo' | 'revisado' | 'archivado'
  createdAt: string
}

export interface Redirect {
  fromPath: string
  toPath: string
  statusCode: 301 | 302
}
