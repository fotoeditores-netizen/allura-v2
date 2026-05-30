import { NextRequest, NextResponse } from 'next/server'
import { upsertPage } from '@/lib/supabase/pages'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, title_i18n, type, status, sort_order } = body
    if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 })
    const page = await upsertPage({ slug, title_i18n, type, status, sort_order })
    return NextResponse.json(page)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
