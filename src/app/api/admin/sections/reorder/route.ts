import { NextRequest, NextResponse } from 'next/server'
import { reorderSections } from '@/lib/supabase/pages'

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json()
    await reorderSections(updates)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
