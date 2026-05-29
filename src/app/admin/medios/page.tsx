import { createClient } from '@/lib/supabase/client'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function MediosPage() {
  const supabase = createClient()
  const { data: assets } = await supabase
    .from('media_assets')
    .select('*')
    .eq('site_id', SITE_ID)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">Biblioteca de medios</h1>
      {(assets ?? []).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#8b9fb3]">
          <p>No hay archivos subidos aún.</p>
          <p className="text-sm mt-2">Sube imágenes desde el formulario de edición de cada sección.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {(assets ?? []).map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-square bg-[#eaeeef] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.file_url} alt={a.alt_text ?? ''} className="w-full h-full object-cover" />
              </div>
              <div className="p-2"><p className="text-xs text-[#8b9fb3] truncate">{a.file_name}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
