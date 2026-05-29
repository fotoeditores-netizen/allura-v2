import { createClient } from '@/lib/supabase/client'
import { TestimonioForm } from './TestimonioForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditTestimonioPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let testimonio = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('testimonials').select('*').eq('id', params.id).single()
    testimonio = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">{isNew ? 'Nuevo testimonio' : 'Editar testimonio'}</h1>
      <TestimonioForm testimonio={testimonio} siteId={SITE_ID} />
    </div>
  )
}
