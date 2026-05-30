import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function VideosPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('videos')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('sort_order')

  const videos = data ?? []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#051c33]">Videos</h1>
          <p className="text-sm text-[#8b9fb3] mt-1">Aparecen en la sección "Cómo funciona"</p>
        </div>
        <Link
          href="/admin/videos/nuevo"
          className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#051c33]/90 transition-colors"
        >
          <Plus size={16} /> Nuevo video
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaeeef] text-[#051c33]">
            <tr>
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">URL</th>
              <th className="text-left p-4">Orden</th>
              <th className="text-left p-4">Estado</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {videos.map((v: any) => (
              <tr key={v.id} className="border-t border-[#eaeeef]">
                <td className="p-4 font-medium text-[#051c33]">{v.title_i18n?.es ?? '—'}</td>
                <td className="p-4 text-[#8b9fb3] max-w-xs truncate">{v.url}</td>
                <td className="p-4 text-[#8b9fb3]">{v.sort_order}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${v.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {v.is_visible ? 'Visible' : 'Oculto'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/videos/${v.id}`} className="text-[#8b9fb3] hover:text-[#051c33]">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#8b9fb3]">
                  No hay videos. Agrega uno para que aparezca en "Cómo funciona".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
