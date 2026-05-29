import { createClient } from './client'
import type { Service, ServiceCategory } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapService(row: any): Service {
  return {
    id: row.id,
    title: row.title_i18n ?? {},
    slug: row.slug,
    description: row.description_i18n ?? {},
    body: row.body_i18n ?? {},
    imageUrl: row.image_url ?? undefined,
    imageAlt: row.image_alt_i18n ?? {},
    categoryId: row.category_id ?? undefined,
    status: row.status,
    seoTitle: row.seo_title_i18n ?? {},
    seoDescription: row.seo_description_i18n ?? {},
  }
}

export async function getServices(): Promise<Service[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('status', 'published')
    .order('sort_order')
  return (data ?? []).map(mapService)
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data ? mapService(data) : null
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('service_categories')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('sort_order')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title_i18n ?? {},
    slug: row.slug,
    description: row.description_i18n ?? {},
  }))
}
