// Objects (register before singletons and documents that use them)
import { localeString, localeStringShort, localeText, localePortableText } from './objects/localeString'
import { seoObject } from './objects/seoObject'
import { ctaObject } from './objects/ctaObject'
import { navItem } from './objects/navItem'
import { processStep } from './objects/processStep'

// Singletons
import { siteSettings } from './singletons/siteSettings'
import { navigation } from './singletons/navigation'
import { homePage } from './singletons/homePage'
import { trackingScripts } from './singletons/trackingScripts'

// Documents
import { serviceCategory } from './documents/serviceCategory'
import { service } from './documents/service'
import { page } from './documents/page'
import { blogPost } from './documents/blogPost'
import { category } from './documents/category'
import { testimonial } from './documents/testimonial'
import { faq } from './documents/faq'
import { galleryItem } from './documents/galleryItem'
import { video } from './documents/video'
import { caseStudy } from './documents/caseStudy'
import { teamMember } from './documents/teamMember'
import { popup } from './documents/popup'

export const schemaTypes = [
  // Objects first
  localeString,
  localeStringShort,
  localeText,
  localePortableText,
  seoObject,
  ctaObject,
  navItem,
  processStep,
  // Singletons
  siteSettings,
  navigation,
  homePage,
  trackingScripts,
  // Documents
  serviceCategory,
  service,
  page,
  blogPost,
  category,
  testimonial,
  faq,
  galleryItem,
  video,
  caseStudy,
  teamMember,
  popup,
]
