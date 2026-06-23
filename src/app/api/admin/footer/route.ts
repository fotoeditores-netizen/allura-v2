import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { createClient as createCookieClient } from '@/lib/supabase/client'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

// Claves cuyo valor NUNCA se devuelve al navegador (secretos).
// El GET solo informa si estan configuradas, no su contenido.
const SECRET_KEYS = ['resend_api_key', 'hubspot_token']

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/** Verifica que haya una sesion de usuario valida (panel admin). */
async function requireAuth(): Promise<boolean> {
  try {
    const supabase = createCookieClient()
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('site_id', SITE_ID)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Redacta los secretos: no se exponen, pero se indica si tienen valor.
  const safe = (data ?? []).map((row: { key: string; value: unknown }) =>
    SECRET_KEYS.includes(row.key)
      ? { key: row.key, value: '', configured: typeof row.value === 'string' && row.value.length > 0 }
      : row
  )

  return NextResponse.json({ data: safe })
}

export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { upserts } = body as { upserts: { site_id: string; key: string; value: string; updated_at: string }[] }

  const supabase = getServiceClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert(upserts, { onConflict: 'site_id,key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/es', 'layout')
  revalidatePath('/en', 'layout')

  return NextResponse.json({ ok: true })
}
