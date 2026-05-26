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
    image?: SanityImageLocaleAlt
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

// ─── Service Category ────────────────────────────────────────────────────────

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

// ─── Service Detail ───────────────────────────────────────────────────────────

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
  body?: import('@portabletext/types').PortableTextBlock[]
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

export const serviceCategoryBySlugQuery = groq`
  *[_type == "serviceCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    coverImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    order,
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset->{ _id, url, metadata { dimensions } } },
      noIndex,
      canonicalUrl
    },
    "services": *[_type == "service" && category._ref == ^._id && isActive == true] | order(title.es asc) {
      _id,
      title,
      slug,
      shortDescription,
      coverImage {
        asset->{ _id, url, metadata { dimensions } },
        alt
      }
    }
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    slug,
    shortDescription,
    body[] {
      ...,
      markDefs[] {
        ...,
        _type == "link" => {
          "href": href
        }
      }
    },
    benefits[] {
      icon,
      title,
      description
    },
    process[] {
      stepNumber,
      title,
      description,
      duration
    },
    coverImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset->{ _id, url, metadata { dimensions } } },
      noIndex,
      canonicalUrl
    },
    "category": category-> {
      title,
      slug
    }
  }
`

// ─── Blog ────────────────────────────────────────────────────────────────────

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
    es: import('@portabletext/types').PortableTextBlock[]
    en: import('@portabletext/types').PortableTextBlock[]
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

export const blogCategoriesQuery = groq`
  *[_type == "category"] | order(title.es asc) {
    _id,
    title,
    slug,
    color
  }
`

export const blogPostListQuery = groq`
  *[
    _type == "blogPost"
    && status == "published"
    && (!defined($categorySlug) || $categorySlug in categories[]->slug.current)
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    "categories": categories[]->{ _id, title, slug, color },
    "author": author->{ name }
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    body {
      es[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      },
      en[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      }
    },
    "categories": categories[]->{ _id, title, slug, color },
    "author": author->{ name, photo { asset->{ _id, url, metadata { dimensions } } } },
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset->{ _id, url, metadata { dimensions } } },
      noIndex,
      canonicalUrl
    }
  }
`

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && status == "published"] {
    "slug": slug.current
  }
`

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

export const testimonialsQuery = groq`
  *[_type == "testimonial" && isApproved == true] | order(publishedAt desc) {
    _id,
    patientName,
    patientOrigin,
    quote,
    rating,
    photo { asset->{ url }, alt },
    "service": service->{ title }
  }
`

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export interface FaqItem {
  _id: string
  question: LocaleString
  answer?: {
    es: import('@portabletext/types').PortableTextBlock[]
    en: import('@portabletext/types').PortableTextBlock[]
  }
}

export const faqsQuery = groq`
  *[_type == "faq" && isActive == true] | order(order asc) {
    _id,
    question,
    answer {
      es[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      },
      en[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => { "href": href }
        }
      }
    }
  }
`
