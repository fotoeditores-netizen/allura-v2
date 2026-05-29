import { createClient } from '@/lib/supabase/client'
import { RedirectForm } from './RedirectForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditRedirectPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let redirect = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('redirects').select('*').eq('id', params.id).single()
    redirect = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">{isNew ? 'Nueva redirección' : 'Editar redirección'}</h1>
      <RedirectForm redirect={redirect} siteId={SITE_ID} />
    </div>
  )
}
