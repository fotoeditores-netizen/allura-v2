import { createClient } from './client'
import type { TeamMember } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMember(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    role: row.role_i18n ?? {},
    bio: row.bio_i18n ?? {},
    photoUrl: row.photo_url ?? undefined,
    sortOrder: row.sort_order,
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('is_visible', true)
    .order('sort_order')
  return (data ?? []).map(mapMember)
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .single()
  return data ? mapMember(data) : null
}
