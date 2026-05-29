import { createClient } from '@/lib/supabase/client'
import { ServiceForm } from './ServiceForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditServicioPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let service = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('services').select('*').eq('id', params.id).single()
    service = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">{isNew ? 'Nuevo servicio' : 'Editar servicio'}</h1>
      <ServiceForm service={service} siteId={SITE_ID} />
    </div>
  )
}
