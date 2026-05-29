import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminFaqPage() {
  const supabase = createClient()
  const { data: faqs } = await supabase
    .from('faqs')
    .select('id, question_i18n, sort_order, is_visible')
    .eq('site_id', SITE_ID)
    .order('sort_order')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Preguntas frecuentes</h1>
        <Link href="/admin/faq/nuevo" className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm">
          <Plus size={16} /> Nueva pregunta
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eaeeef] text-[#051c33] text-sm">
            <tr><th className="text-left p-4">Pregunta</th><th className="text-left p-4">Visible</th><th className="p-4" /></tr>
          </thead>
          <tbody>
            {(faqs ?? []).map((f: any) => (
              <tr key={f.id} className="border-t border-[#eaeeef]">
                <td className="p-4 text-[#051c33]">{f.question_i18n?.es ?? '—'}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${f.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{f.is_visible ? 'Visible' : 'Oculta'}</span></td>
                <td className="p-4 text-right"><Link href={`/admin/faq/${f.id}`} className="text-[#8b9fb3] hover:text-[#051c33] text-sm">Editar</Link></td>
              </tr>
            ))}
            {(faqs ?? []).length === 0 && <tr><td colSpan={3} className="p-8 text-center text-[#8b9fb3]">No hay preguntas aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
