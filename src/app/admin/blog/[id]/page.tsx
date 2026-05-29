import { createClient } from '@/lib/supabase/client'
import { BlogForm } from './BlogForm'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'nuevo'
  let post = null
  if (!isNew) {
    const supabase = createClient()
    const { data } = await supabase.from('blog_posts').select('*').eq('id', params.id).single()
    post = data
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">{isNew ? 'Nuevo artículo' : 'Editar artículo'}</h1>
      <BlogForm post={post} siteId={SITE_ID} />
    </div>
  )
}
