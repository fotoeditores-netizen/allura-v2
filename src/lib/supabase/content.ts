import { createClient } from './client'
import type { Testimonial, Faq, GalleryItem, Video, Popup, Promotion, Redirect } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    authorName: row.author_name,
    authorLocation: row.author_location ?? undefined,
    content: row.content_i18n ?? {},
    rating: row.rating ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  }))
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    question: row.question_i18n ?? {},
    answer: row.answer_i18n ?? {},
    sortOrder: row.sort_order,
  }))
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    imageUrl: row.image_url,
    alt: row.alt_i18n ?? {},
    caption: row.caption_i18n ?? {},
    category: row.category ?? undefined,
    sortOrder: row.sort_order,
  }))
}

export async function getVideos(): Promise<Video[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('videos')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title_i18n ?? {},
    url: row.url,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    sortOrder: row.sort_order,
  }))
}

export async function getActivePopup(): Promise<Popup | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('popups')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_active', true)
    .single()
  if (!data) return null
  return {
    id: data.id,
    title: data.title_i18n ?? {},
    body: data.body_i18n ?? {},
    ctaLabel: data.cta_label_i18n ?? {},
    ctaUrl: data.cta_url ?? undefined,
    imageUrl: data.image_url ?? undefined,
    delaySeconds: data.delay_seconds,
  }
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const now = new Date().toISOString()
  const supabase = createClient()
  const { data } = await supabase
    .from('promotions')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_active', true)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title_i18n ?? {},
    description: row.description_i18n ?? {},
    ctaLabel: row.cta_label_i18n ?? {},
    ctaUrl: row.cta_url ?? undefined,
    imageUrl: row.image_url ?? undefined,
    validFrom: row.valid_from ?? undefined,
    validUntil: row.valid_until ?? undefined,
  }))
}

export async function getRedirects(): Promise<Redirect[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('redirects')
    .select('from_path, to_path, status_code')
    .eq('site_id', SITE_ID)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    fromPath: row.from_path,
    toPath: row.to_path,
    statusCode: row.status_code as 301 | 302,
  }))
}
