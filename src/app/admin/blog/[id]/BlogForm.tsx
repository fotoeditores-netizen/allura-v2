'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { ImageUploader } from '@/components/admin/ImageUploader'

const schema = z.object({
  title_es: z.string().min(2, 'Requerido'),
  title_en: z.string().min(2, 'Requerido'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  excerpt_es: z.string().optional(),
  excerpt_en: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function BlogForm({ post, siteId }: { post: any; siteId: string }) {
  const router = useRouter()
  const [coverUrl, setCoverUrl] = useState<string>(post?.cover_image_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_es: post?.title_i18n?.es ?? '',
      title_en: post?.title_i18n?.en ?? '',
      slug: post?.slug ?? '',
      excerpt_es: post?.excerpt_i18n?.es ?? '',
      excerpt_en: post?.excerpt_i18n?.en ?? '',
      status: post?.status ?? 'draft',
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      title_i18n: { es: data.title_es, en: data.title_en },
      slug: data.slug,
      excerpt_i18n: { es: data.excerpt_es ?? '', en: data.excerpt_en ?? '' },
      status: data.status,
      cover_image_url: coverUrl || null,
      published_at: data.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }
    const { error: err } = post
      ? await supabase.from('blog_posts').update(payload).eq('id', post.id)
      : await supabase.from('blog_posts').insert(payload)
    if (err) { setError('Error al guardar'); setSaving(false); return }
    router.push('/admin/blog'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Título (Español)</label><input {...register('title_es')} className={inputCls} />{errors.title_es && <p className="text-red-500 text-xs mt-1">{errors.title_es.message}</p>}</div>
        <div><label className={labelCls}>Title (English)</label><input {...register('title_en')} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>URL (slug)</label><input {...register('slug')} className={inputCls} />{errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}</div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Resumen (Español)</label><textarea {...register('excerpt_es')} rows={3} className={inputCls} /></div>
        <div><label className={labelCls}>Excerpt (English)</label><textarea {...register('excerpt_en')} rows={3} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Imagen de portada</label><ImageUploader folder="blog" currentUrl={coverUrl} onUpload={(url) => setCoverUrl(url)} /></div>
      <div><label className={labelCls}>Estado</label>
        <select {...register('status')} className="border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm">
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => router.push('/admin/blog')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  )
}
