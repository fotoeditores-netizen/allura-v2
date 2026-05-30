'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { ImageUploader } from '@/components/admin/ImageUploader'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const schema = z.object({
  title_es: z.string().min(2, 'Requerido'),
  title_en: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  excerpt_es: z.string().optional(),
  excerpt_en: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function BlogForm({ post, siteId }: { post: any; siteId: string }) {
  const router = useRouter()
  const [coverUrl, setCoverUrl] = useState<string>(post?.cover_image_url ?? '')
  const [bodyEs, setBodyEs] = useState<string>(post?.body_i18n?.es ?? '')
  const [bodyEn, setBodyEn] = useState<string>(post?.body_i18n?.en ?? '')
  const [bodyTab, setBodyTab] = useState<'es' | 'en'>('es')
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
      author: post?.author ?? '',
      status: post?.status ?? 'draft',
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      title_i18n: { es: data.title_es, en: data.title_en ?? '' },
      slug: data.slug,
      excerpt_i18n: { es: data.excerpt_es ?? '', en: data.excerpt_en ?? '' },
      body_i18n: { es: bodyEs, en: bodyEn },
      author: data.author ?? null,
      status: data.status,
      cover_image_url: coverUrl || null,
      published_at: data.status === 'published' ? (post?.published_at ?? new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    }
    const { error: err } = post
      ? await supabase.from('blog_posts').update(payload).eq('id', post.id)
      : await supabase.from('blog_posts').insert(payload)
    if (err) { setError('Error al guardar: ' + err.message); setSaving(false); return }
    router.push('/admin/blog'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-4xl">
      {/* Títulos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Título (Español) *</label>
          <input {...register('title_es')} className={inputCls} />
          {errors.title_es && <p className="text-red-500 text-xs mt-1">{errors.title_es.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Title (English)</label>
          <input {...register('title_en')} className={inputCls} />
        </div>
      </div>

      {/* Slug + Autor */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>URL (slug) *</label>
          <input {...register('slug')} className={inputCls} placeholder="mi-articulo" />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Autor</label>
          <input {...register('author')} className={inputCls} placeholder="Dra. Johanna Jaramillo" />
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Resumen (Español)</label>
          <textarea {...register('excerpt_es')} rows={3} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Excerpt (English)</label>
          <textarea {...register('excerpt_en')} rows={3} className={inputCls} />
        </div>
      </div>

      {/* Editor de contenido */}
      <div>
        <label className={labelCls}>Contenido del artículo</label>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setBodyTab('es')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${bodyTab === 'es' ? 'bg-[#051c33] text-white' : 'bg-[#eaeeef] text-[#051c33]'}`}
          >
            Español
          </button>
          <button
            type="button"
            onClick={() => setBodyTab('en')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${bodyTab === 'en' ? 'bg-[#051c33] text-white' : 'bg-[#eaeeef] text-[#051c33]'}`}
          >
            English
          </button>
        </div>
        <div data-color-mode="light">
          {bodyTab === 'es' ? (
            <MDEditor
              value={bodyEs}
              onChange={(v) => setBodyEs(v ?? '')}
              height={400}
              preview="edit"
            />
          ) : (
            <MDEditor
              value={bodyEn}
              onChange={(v) => setBodyEn(v ?? '')}
              height={400}
              preview="edit"
            />
          )}
        </div>
        <p className="text-xs text-[#8b9fb3] mt-1">Soporta Markdown: **negrita**, *cursiva*, ## títulos, [enlace](url)</p>
      </div>

      {/* Imagen de portada */}
      <div>
        <label className={labelCls}>Imagen de portada</label>
        <ImageUploader folder="blog" currentUrl={coverUrl} onUpload={(url) => setCoverUrl(url)} />
      </div>

      {/* Estado */}
      <div>
        <label className={labelCls}>Estado</label>
        <select {...register('status')} className="border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm">
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#051c33] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-[#051c33]/90 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar artículo'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm hover:bg-[#eaeeef] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
