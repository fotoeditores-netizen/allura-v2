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
  title_en: z.string().optional(),
  url: z.string().url('Debe ser una URL válida (YouTube, Vimeo, Instagram)'),
  sort_order: z.coerce.number().min(0),
  is_visible: z.boolean(),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function VideoForm({ video, siteId }: { video: any; siteId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(video?.thumbnail_url ?? '')

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_es: video?.title_i18n?.es ?? '',
      title_en: video?.title_i18n?.en ?? '',
      url: video?.url ?? '',
      sort_order: video?.sort_order ?? 0,
      is_visible: video?.is_visible ?? true,
    },
  })

  const urlValue = watch('url')

  function getEmbedPreview(url: string) {
    if (!url) return null
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      if (match) return `https://www.youtube.com/embed/${match[1]}`
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/)
      if (match) return `https://player.vimeo.com/video/${match[1]}`
    }
    return null
  }

  const embedUrl = getEmbedPreview(urlValue)

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      title_i18n: { es: data.title_es, en: data.title_en ?? '' },
      url: data.url,
      thumbnail_url: thumbnailUrl || null,
      sort_order: data.sort_order,
      is_visible: data.is_visible,
    }
    const { error: err } = video
      ? await supabase.from('videos').update(payload).eq('id', video.id)
      : await supabase.from('videos').insert(payload)
    if (err) { setError('Error al guardar: ' + err.message); setSaving(false); return }
    router.push('/admin/videos'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Vista previa embed */}
      {embedUrl && (
        <div className="rounded-xl overflow-hidden border border-[#eaeeef]">
          <p className="text-xs font-medium text-[#8b9fb3] px-4 pt-3 pb-2">Vista previa</p>
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {/* Títulos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Título (Español) *</label>
            <input {...register('title_es')} className={inputCls} placeholder="Ej: Cómo es tu primera consulta" />
            {errors.title_es && <p className="text-red-500 text-xs mt-1">{errors.title_es.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Title (English)</label>
            <input {...register('title_en')} className={inputCls} placeholder="Ex: What your first consultation looks like" />
          </div>
        </div>

        {/* URL */}
        <div>
          <label className={labelCls}>URL del video *</label>
          <input
            {...register('url')}
            className={inputCls}
            placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
          />
          {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
          <p className="text-xs text-[#8b9fb3] mt-1">Compatible con YouTube y Vimeo. La vista previa aparece al pegar la URL.</p>
        </div>

        {/* Thumbnail opcional */}
        <div>
          <label className={labelCls}>Miniatura (opcional)</label>
          <ImageUploader
            folder="site"
            currentUrl={thumbnailUrl}
            onUpload={(url) => setThumbnailUrl(url)}
            label="Subir miniatura del video"
          />
        </div>

        {/* Orden y visibilidad */}
        <div className="flex gap-6 items-end">
          <div>
            <label className={labelCls}>Orden</label>
            <input type="number" {...register('sort_order')} min={0} className="w-24 border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer pb-1">
            <input type="checkbox" {...register('is_visible')} className="w-4 h-4 accent-[#051c33]" />
            <span className="text-sm font-medium text-[#051c33]">Visible en el sitio</span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-[#051c33]/90 transition-colors">
            {saving ? 'Guardando...' : 'Guardar video'}
          </button>
          <button type="button" onClick={() => router.push('/admin/videos')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm hover:bg-[#eaeeef] transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </form>
  )
}
