import { createClient } from '@/lib/supabase/client'
import { VideoForm } from './VideoForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let video = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('videos').select('*').eq('id', params.id).single()
    video = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">
        {isNew ? 'Nuevo video' : 'Editar video'}
      </h1>
      <VideoForm video={video} siteId={SITE_ID} />
    </div>
  )
}
