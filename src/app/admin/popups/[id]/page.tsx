import { createClient } from '@/lib/supabase/client'
import { PopupForm } from './PopupForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditPopupPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let popup = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('popups').select('*').eq('id', params.id).single()
    popup = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">
        {isNew ? 'Nuevo popup' : 'Editar popup'}
      </h1>
      <PopupForm popup={popup} siteId={SITE_ID} />
    </div>
  )
}
