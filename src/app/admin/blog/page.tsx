import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminBlogPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title_i18n, slug, status, published_at')
    .eq('site_id', SITE_ID)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Blog</h1>
        <Link href="/admin/blog/nuevo" className="flex items-center gap-2 bg-[#051c33] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#051c33]/90 transition-colors">
          <Plus size={16} /> Nuevo artículo
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#eaeeef] text-[#051c33] text-sm">
            <tr>
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Slug</th>
              <th className="text-left p-4">Estado</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((p: any) => (
              <tr key={p.id} className="border-t border-[#eaeeef]">
                <td className="p-4 text-[#051c33] font-medium">{p.title_i18n?.es ?? '—'}</td>
                <td className="p-4 text-[#8b9fb3] text-sm">{p.slug}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status === 'published' ? 'Publicado' : 'Borrador'}</span></td>
                <td className="p-4 text-right"><Link href={`/admin/blog/${p.id}`} className="text-[#8b9fb3] hover:text-[#051c33] text-sm">Editar</Link></td>
              </tr>
            ))}
            {(posts ?? []).length === 0 && <tr><td colSpan={4} className="p-8 text-center text-[#8b9fb3]">No hay artículos aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
