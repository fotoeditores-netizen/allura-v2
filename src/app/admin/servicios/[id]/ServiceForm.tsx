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
  title_en: z.string().min(2, 'Requerido'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

interface Category { id: string; title_i18n: { es: string; en: string }; slug: string }

export function ServiceForm({ service, siteId, categories = [] }: { service: any; siteId: string; categories?: Category[] }) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(service?.image_url ?? '')
  const [bodyEs, setBodyEs] = useState<string>(service?.body_i18n?.es ?? '')
  const [bodyEn, setBodyEn] = useState<string>(service?.body_i18n?.en ?? '')
  const [bodyTab, setBodyTab] = useState<'es' | 'en'>('es')
  const [categoryId, setCategoryId] = useState<string>(service?.category_id ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_es: service?.title_i18n?.es ?? '',
      title_en: service?.title_i18n?.en ?? '',
      slug: service?.slug ?? '',
      description_es: service?.description_i18n?.es ?? '',
      description_en: service?.description_i18n?.en ?? '',
      status: service?.status ?? 'published',
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      category_id: categoryId || null,
      title_i18n: { es: data.title_es, en: data.title_en },
      slug: data.slug,
      description_i18n: { es: data.description_es ?? '', en: data.description_en ?? '' },
      body_i18n: { es: bodyEs, en: bodyEn },
      status: data.status,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    }
    const { error: err } = service
      ? await supabase.from('services').update(payload).eq('id', service.id)
      : await supabase.from('services').insert(payload)
    if (err) { setError('Error al guardar: ' + err.message); setSaving(false); return }
    router.push('/admin/servicios'); router.refresh()
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
          <label className={labelCls}>Title (English) *</label>
          <input {...register('title_en')} className={inputCls} />
          {errors.title_en && <p className="text-red-500 text-xs mt-1">{errors.title_en.message}</p>}
        </div>
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls}>URL (slug) *</label>
        <input {...register('slug')} placeholder="ej: implantes-all-on-x" className={inputCls} />
        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
      </div>

      {/* Categoría */}
      <div>
        <label className={labelCls}>Categoría (ubicación en el sitio) *</label>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 mt-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm text-left transition-colors ${
                  categoryId === cat.id
                    ? 'border-[#051c33] bg-[#051c33] text-white'
                    : 'border-[#8b9fb3]/40 text-[#051c33] hover:border-[#051c33]'
                }`}
              >
                <span className="font-medium">{cat.title_i18n?.es ?? cat.slug}</span>
                {categoryId === cat.id && <span className="ml-auto text-xs opacity-70">✓</span>}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8b9fb3] mt-1">No hay categorías disponibles.</p>
        )}
        {!categoryId && (
          <p className="text-amber-600 text-xs mt-1">⚠ Sin categoría el servicio no aparecerá en ninguna página.</p>
        )}
      </div>

      {/* Descripción corta */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Descripción corta (Español)</label>
          <textarea {...register('description_es')} rows={3} className={inputCls} placeholder="Aparece en la tarjeta del servicio" />
        </div>
        <div>
          <label className={labelCls}>Short description (English)</label>
          <textarea {...register('description_en')} rows={3} className={inputCls} />
        </div>
      </div>

      {/* Editor de contenido largo */}
      <div>
        <label className={labelCls}>Contenido detallado del servicio</label>
        <p className="text-xs text-[#8b9fb3] mb-2">Aparece en la página individual del servicio. Soporta Markdown: ## títulos, **negrita**, listas, etc.</p>
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
            <MDEditor value={bodyEs} onChange={(v) => setBodyEs(v ?? '')} height={350} preview="edit" />
          ) : (
            <MDEditor value={bodyEn} onChange={(v) => setBodyEn(v ?? '')} height={350} preview="edit" />
          )}
        </div>
      </div>

      {/* Imagen */}
      <div>
        <label className={labelCls}>Imagen principal</label>
        <ImageUploader folder="services" currentUrl={imageUrl} onUpload={(url) => setImageUrl(url)} />
      </div>

      {/* Estado */}
      <div>
        <label className={labelCls}>Estado</label>
        <select {...register('status')} className="border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]">
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
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
          {saving ? 'Guardando...' : 'Guardar servicio'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/servicios')}
          className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm hover:bg-[#eaeeef] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
