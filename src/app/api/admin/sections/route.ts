import { NextRequest, NextResponse } from 'next/server'
import { upsertSection, deleteSection } from '@/lib/supabase/pages'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const section = await upsertSection(data)
    return NextResponse.json(section)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await deleteSection(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
