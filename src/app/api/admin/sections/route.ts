import { NextRequest, NextResponse } from 'next/server'
import { upsertSection, deleteSection, revalidatePagePaths, getPages } from '@/lib/supabase/pages'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const section = await upsertSection(data)
    // Revalidate cache so iframe preview reflects saved changes immediately
    if (section.page_id) {
      const pages = await getPages()
      const page = pages.find(p => p.id === section.page_id)
      if (page) revalidatePagePaths(page.slug)
    }
    return NextResponse.json(section)
  } catch (error) {
    const errDetail = error instanceof Error ? error.message : JSON.stringify(error)
    return NextResponse.json({ error: errDetail }, { status: 500 })
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
