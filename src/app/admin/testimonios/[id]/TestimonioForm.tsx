'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { ImageUploader } from '@/components/admin/ImageUploader'

const schema = z.object({
  author_name: z.string().min(2, 'Requerido'),
  author_location: z.string().optional(),
  content_es: z.string().min(5, 'Requerido'),
  content_en: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  is_visible: z.boolean(),
})
type FormData = z.infer<typeof schema>
const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function TestimonioForm({ testimonio, siteId }: { testimonio: any; siteId: string }) {
  const router = useRouter()
  const [photoUrl, setPhotoUrl] = useState<string>(testimonio?.photo_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      author_name: testimonio?.author_name ?? '',
      author_location: testimonio?.author_location ?? '',
      content_es: testimonio?.content_i18n?.es ?? '',
      content_en: testimonio?.content_i18n?.en ?? '',
      rating: testimonio?.rating ?? 5,
      is_visible: testimonio?.is_visible ?? true,
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      author_name: data.author_name,
      author_location: data.author_location || null,
      content_i18n: { es: data.content_es, en: data.content_en ?? '' },
      rating: data.rating,
      photo_url: photoUrl || null,
      is_visible: data.is_visible,
    }
    const { error: err } = testimonio
      ? await supabase.from('testimonials').update(payload).eq('id', testimonio.id)
      : await supabase.from('testimonials').insert(payload)
    if (err) { setError('Error al guardar'); setSaving(false); return }
    router.push('/admin/testimonios'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Nombre del autor</label><input {...register('author_name')} className={inputCls} />{errors.author_name && <p className="text-red-500 text-xs mt-1">{errors.author_name.message}</p>}</div>
        <div><label className={labelCls}>Ubicación</label><input {...register('author_location')} placeholder="Ej: Miami, FL" className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Comentario (Español)</label><textarea {...register('content_es')} rows={4} className={inputCls} />{errors.content_es && <p className="text-red-500 text-xs mt-1">{errors.content_es.message}</p>}</div>
        <div><label className={labelCls}>Comment (English)</label><textarea {...register('content_en')} rows={4} className={inputCls} /></div>
      </div>
      <div className="flex gap-6">
        <div><label className={labelCls}>Calificación (1-5)</label>
          <select {...register('rating')} className="border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm">
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-[#051c33]"><input type="checkbox" {...register('is_visible')} className="w-4 h-4" /> Visible</label></div>
      </div>
      <div><label className={labelCls}>Foto del autor</label><ImageUploader folder="site" currentUrl={photoUrl} onUpload={(url) => setPhotoUrl(url)} /></div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => router.push('/admin/testimonios')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  )
}
