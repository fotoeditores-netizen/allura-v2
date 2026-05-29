import { NextRequest, NextResponse } from 'next/server'
import { publishPage, getPages } from '@/lib/supabase/pages'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pages = await getPages()
    const page = pages.find(p => p.id === params.id)
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    await publishPage(page.id, page.slug)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
