import { createClient } from '@/lib/supabase/client'
import { PromoForm } from './PromoForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditPromoPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nueva'
  let promo = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('promotions').select('*').eq('id', params.id).single()
    promo = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">
        {isNew ? 'Nueva promoción' : 'Editar promoción'}
      </h1>
      <PromoForm promo={promo} siteId={SITE_ID} />
    </div>
  )
}
