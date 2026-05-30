import { createClient } from '@/lib/supabase/client'
import { ServiceForm } from './ServiceForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditServicioPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  const supabase = createClient()

  const [serviceRes, categoriesRes] = await Promise.all([
    isNew
      ? Promise.resolve({ data: null })
      : supabase.from('services').select('*').eq('id', params.id).single(),
    supabase
      .from('service_categories')
      .select('id, title_i18n, slug')
      .eq('site_id', SITE_ID)
      .order('sort_order'),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">
        {isNew ? 'Nuevo servicio' : 'Editar servicio'}
      </h1>
      <ServiceForm
        service={serviceRes.data}
        siteId={SITE_ID}
        categories={categoriesRes.data ?? []}
      />
    </div>
  )
}
