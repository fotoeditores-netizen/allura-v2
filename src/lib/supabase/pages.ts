import { createClient, createServiceClient } from './client'
import { revalidatePath } from 'next/cache'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export interface PageRow {
  id: string
  site_id: string
  slug: string
  title_i18n: { es: string; en: string }
  type: string
  status: 'draft' | 'published' | 'archived'
  sort_order: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface SectionRow {
  id: string
  page_id: string
  type: string
  title: string | null
  sort_order: number
  is_visible: boolean
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function getPages(): Promise<PageRow[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('sort_order')
  return (data ?? []) as PageRow[]
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .maybeSingle()
  return data as PageRow | null
}

export async function upsertPage(
  data: Partial<PageRow> & { slug: string }
): Promise<PageRow> {
  const supabase = createServiceClient()
  const { data: row, error } = await supabase
    .from('pages')
    .upsert({ site_id: SITE_ID, ...data }, { onConflict: 'site_id,slug' })
    .select()
    .single()
  if (error) throw error
  return row as PageRow
}

export async function getSectionsByPage(pageId: string): Promise<SectionRow[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order')
  return (data ?? []) as SectionRow[]
}

export async function upsertSection(
  data: Partial<SectionRow> & { page_id: string; type: string }
): Promise<SectionRow> {
  const supabase = createServiceClient()
  const payload = data.id ? data : { ...data }
  const { data: row, error } = await supabase
    .from('sections')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return row as SectionRow
}

export async function deleteSection(id: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase.from('sections').delete().eq('id', id)
}

export async function reorderSections(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  const supabase = createServiceClient()
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('sections').update({ sort_order }).eq('id', id)
    )
  )
}

export async function publishPage(pageId: string, slug: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase
    .from('pages')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', pageId)
  revalidatePath(`/es${slug === '/' ? '' : slug}`)
  revalidatePath(`/en${slug === '/' ? '' : slug}`)
}
