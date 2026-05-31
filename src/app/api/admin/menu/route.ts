import { NextRequest, NextResponse } from 'next/server'
import { saveMenuItems } from '@/lib/supabase/menu'

export async function POST(req: NextRequest) {
  try {
    const items = await req.json()
    await saveMenuItems(items)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
