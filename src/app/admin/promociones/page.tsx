import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function PromocionesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('promotions')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('created_at', { ascending: false })

  const promos = data ?? []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#051c33]">Promociones</h1>
          <p className="text-sm text-[#8b9fb3] mt-1">Barra de anuncio visible en la parte superior del sitio</p>
        </div>
        <Link
          href="/admin/promociones/nueva"
          className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#051c33]/90 transition-colors"
        >
          <Plus size={16} /> Nueva promoción
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaeeef] text-[#051c33]">
            <tr>
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Vigencia</th>
              <th className="text-left p-4">Estado</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {promos.map((p: any) => (
              <tr key={p.id} className="border-t border-[#eaeeef]">
                <td className="p-4 font-medium text-[#051c33]">{p.title_i18n?.es ?? '—'}</td>
                <td className="p-4 text-[#8b9fb3]">
                  {p.valid_from ? new Date(p.valid_from).toLocaleDateString('es-CO') : '—'}
                  {' → '}
                  {p.valid_until ? new Date(p.valid_until).toLocaleDateString('es-CO') : 'Sin fin'}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/promociones/${p.id}`} className="text-[#8b9fb3] hover:text-[#051c33]">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#8b9fb3]">
                  No hay promociones. Crea una para mostrar un anuncio en la parte superior del sitio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
