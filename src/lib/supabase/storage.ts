import { createBrowserSupabaseClient } from './browser-client'

const BUCKET = 'allura-media'
const SITE_ID = '00000000-0000-0000-0000-000000000001'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export function getPublicUrl(path: string): string {
  const supabase = createBrowserSupabaseClient()
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadImage(
  file: File,
  folder: 'services' | 'blog' | 'team' | 'gallery' | 'site' | 'popups'
): Promise<{ url: string; path: string } | null> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Tipo de archivo no permitido. Usa: JPG, PNG, WebP, SVG o PDF`)
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`El archivo supera el límite de 10 MB`)
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `${SITE_ID}/${folder}/${uniqueName}`

  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) return null
  return { url: getPublicUrl(path), path }
}

export async function deleteImage(path: string): Promise<boolean> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  return !error
}
