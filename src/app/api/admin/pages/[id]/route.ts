import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/client'

const PROTECTED_SLUGS = ['/', '/nosotros', '/servicios', '/contacto', '/blog', '/equipo', '/galeria', '/como-funciona']

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const supabase = createServiceClient()
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (body.title_i18n) update.title_i18n = body.title_i18n
    if (body.slug) update.slug = body.slug
    const { error } = await supabase
      .from('pages')
      .update(update)
      .eq('id', params.id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient()

    // Verify the page exists and is not protected
    const { data: page } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', params.id)
      .single()

    if (!page) return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 })
    if (PROTECTED_SLUGS.includes(page.slug)) {
      return NextResponse.json({ error: 'Esta página no se puede eliminar' }, { status: 403 })
    }

    // Delete sections first
    await supabase.from('sections').delete().eq('page_id', params.id)

    // Delete page
    const { error } = await supabase.from('pages').delete().eq('id', params.id)
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
