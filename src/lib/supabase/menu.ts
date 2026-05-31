import { createClient, createServiceClient } from './client'
import type { MenuItem } from '@/lib/menu-defaults'
import { defaultMenu } from '@/lib/menu-defaults'

export type { MenuItem }
export { defaultMenu }

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('site_id', SITE_ID)
    .eq('key', 'menu_items')
    .single()
  if (!data?.value) return defaultMenu
  return data.value as MenuItem[]
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
  const supabase = createServiceClient()
  await supabase
    .from('site_settings')
    .upsert(
      { site_id: SITE_ID, key: 'menu_items', value: items },
      { onConflict: 'site_id,key' }
    )
}
