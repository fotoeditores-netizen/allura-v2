import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminEquipoPage() {
  const supabase = createClient()
  const { data: members } = await supabase
    .from('team_members')
    .select('id, name, slug, role_i18n, is_visible, sort_order')
    .eq('site_id', SITE_ID)
    .order('sort_order')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Equipo</h1>
        <Link href="/admin/equipo/nuevo" className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#051c33]/90 transition-colors">
          <Plus size={16} /> Agregar miembro
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eaeeef] text-[#051c33] text-sm">
            <tr>
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Rol</th>
              <th className="text-left p-4">Visible</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {(members ?? []).map((m: any) => (
              <tr key={m.id} className="border-t border-[#eaeeef]">
                <td className="p-4 text-[#051c33] font-medium">{m.name}</td>
                <td className="p-4 text-[#8b9fb3] text-sm">{m.role_i18n?.es ?? '—'}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${m.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.is_visible ? 'Visible' : 'Oculto'}</span></td>
                <td className="p-4 text-right"><Link href={`/admin/equipo/${m.id}`} className="text-[#8b9fb3] hover:text-[#051c33] text-sm">Editar</Link></td>
              </tr>
            ))}
            {(members ?? []).length === 0 && <tr><td colSpan={4} className="p-8 text-center text-[#8b9fb3]">No hay miembros de equipo.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
