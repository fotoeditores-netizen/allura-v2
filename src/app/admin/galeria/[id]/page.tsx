import { createClient } from '@/lib/supabase/client'
import { GaleriaForm } from './GaleriaForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditGaleriaPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let item = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('gallery_items').select('*').eq('id', params.id).single()
    item = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">{isNew ? 'Nueva imagen' : 'Editar imagen'}</h1>
      <GaleriaForm item={item} siteId={SITE_ID} />
    </div>
  )
}
