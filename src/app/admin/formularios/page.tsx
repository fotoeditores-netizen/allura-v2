import { createClient } from '@/lib/supabase/client'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function FormulariosPage() {
  const supabase = createClient()
  const { data: leads } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">Formularios recibidos</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaeeef] text-[#051c33]">
            <tr>
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Servicio</th>
              <th className="text-left p-4">Fecha</th>
              <th className="text-left p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead: any) => (
              <tr key={lead.id} className="border-t border-[#eaeeef]">
                <td className="p-4 text-[#051c33] font-medium">{lead.nombre}</td>
                <td className="p-4 text-[#8b9fb3]">{lead.email}</td>
                <td className="p-4 text-[#8b9fb3]">{lead.servicio ?? '—'}</td>
                <td className="p-4 text-[#8b9fb3]">{new Date(lead.created_at).toLocaleDateString('es-CO')}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${lead.status === 'nuevo' ? 'bg-blue-100 text-blue-700' : lead.status === 'revisado' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
            {(leads ?? []).length === 0 && <tr><td colSpan={5} className="p-8 text-center text-[#8b9fb3]">No hay formularios recibidos aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
