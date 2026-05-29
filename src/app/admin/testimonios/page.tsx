import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function TestimoniosPage() {
  const supabase = createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id, author_name, content_i18n, rating, is_visible')
    .eq('site_id', SITE_ID)
    .order('sort_order')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Testimonios</h1>
        <Link href="/admin/testimonios/nuevo" className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm">
          <Plus size={16} /> Nuevo testimonio
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaeeef] text-[#051c33]">
            <tr><th className="text-left p-4">Autor</th><th className="text-left p-4">Comentario</th><th className="text-left p-4">Visible</th><th className="p-4" /></tr>
          </thead>
          <tbody>
            {(testimonials ?? []).map((t: any) => (
              <tr key={t.id} className="border-t border-[#eaeeef]">
                <td className="p-4 text-[#051c33] font-medium">{t.author_name}</td>
                <td className="p-4 text-[#8b9fb3] max-w-xs truncate">{t.content_i18n?.es ?? '—'}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${t.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.is_visible ? 'Visible' : 'Oculto'}</span></td>
                <td className="p-4 text-right"><Link href={`/admin/testimonios/${t.id}`} className="text-[#8b9fb3] hover:text-[#051c33] text-sm">Editar</Link></td>
              </tr>
            ))}
            {(testimonials ?? []).length === 0 && <tr><td colSpan={4} className="p-8 text-center text-[#8b9fb3]">No hay testimonios aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
