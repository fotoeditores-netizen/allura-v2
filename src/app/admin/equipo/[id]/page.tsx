import { createClient } from '@/lib/supabase/client'
import { EquipoForm } from './EquipoForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditEquipoPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let member = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('team_members').select('*').eq('id', params.id).single()
    member = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">{isNew ? 'Nuevo miembro' : 'Editar miembro'}</h1>
      <EquipoForm member={member} siteId={SITE_ID} />
    </div>
  )
}
