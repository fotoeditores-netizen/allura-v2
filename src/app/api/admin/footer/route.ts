import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET() {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('site_id', SITE_ID)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: Request) {
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
