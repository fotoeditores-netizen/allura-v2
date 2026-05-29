import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function GaleriaPage() {
  const supabase = createClient()
  const { data: items } = await supabase
    .from('gallery_items')
    .select('id, image_url, alt_i18n, category, is_visible, sort_order')
    .eq('site_id', SITE_ID)
    .order('sort_order')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Galería</h1>
        <Link href="/admin/galeria/nuevo" className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm">
          <Plus size={16} /> Nueva imagen
        </Link>
      </div>
      {(items ?? []).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#8b9fb3]">No hay imágenes en la galería.</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {(items ?? []).map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="aspect-square bg-[#eaeeef]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.alt_i18n?.es ?? ''} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-xs text-[#8b9fb3]">{item.category ?? '—'}</span>
                <Link href={`/admin/galeria/${item.id}`} className="text-xs text-[#8b9fb3] hover:text-[#051c33]">Editar</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
