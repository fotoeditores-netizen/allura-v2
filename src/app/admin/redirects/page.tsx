import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function RedirectsPage() {
  const supabase = createClient()
  const { data: redirects } = await supabase
    .from('redirects')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Redirecciones SEO</h1>
        <Link href="/admin/redirects/nuevo" className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm">
          <Plus size={16} /> Nueva redirección
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaeeef] text-[#051c33]">
            <tr><th className="text-left p-4">Desde</th><th className="text-left p-4">Hacia</th><th className="text-left p-4">Código</th><th className="p-4" /></tr>
          </thead>
          <tbody>
            {(redirects ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-[#eaeeef]">
                <td className="p-4 font-mono text-xs text-[#051c33]">{r.from_path}</td>
                <td className="p-4 font-mono text-xs text-[#8b9fb3]">{r.to_path}</td>
                <td className="p-4"><span className="bg-[#eaeeef] text-[#051c33] text-xs px-2 py-1 rounded">{r.status_code}</span></td>
                <td className="p-4 text-right"><Link href={`/admin/redirects/${r.id}`} className="text-[#8b9fb3] hover:text-[#051c33] text-sm">Editar</Link></td>
              </tr>
            ))}
            {(redirects ?? []).length === 0 && <tr><td colSpan={4} className="p-8 text-center text-[#8b9fb3]">No hay redirecciones.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
