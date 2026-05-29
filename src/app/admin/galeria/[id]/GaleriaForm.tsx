'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { ImageUploader } from '@/components/admin/ImageUploader'

const schema = z.object({
  alt_es: z.string().optional(),
  alt_en: z.string().optional(),
  caption_es: z.string().optional(),
  caption_en: z.string().optional(),
  category: z.string().optional(),
  sort_order: z.coerce.number(),
  is_visible: z.boolean(),
})
type FormData = z.infer<typeof schema>
const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function GaleriaForm({ item, siteId }: { item: any; siteId: string }) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(item?.image_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      alt_es: item?.alt_i18n?.es ?? '',
      alt_en: item?.alt_i18n?.en ?? '',
      caption_es: item?.caption_i18n?.es ?? '',
      caption_en: item?.caption_i18n?.en ?? '',
      category: item?.category ?? '',
      sort_order: item?.sort_order ?? 0,
      is_visible: item?.is_visible ?? true,
    },
  })

  async function onSubmit(data: FormData) {
    if (!imageUrl) { setError('Debes subir una imagen'); return }
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      image_url: imageUrl,
      alt_i18n: { es: data.alt_es ?? '', en: data.alt_en ?? '' },
      caption_i18n: { es: data.caption_es ?? '', en: data.caption_en ?? '' },
      category: data.category || null,
      sort_order: data.sort_order,
      is_visible: data.is_visible,
    }
    const { error: err } = item
      ? await supabase.from('gallery_items').update(payload).eq('id', item.id)
      : await supabase.from('gallery_items').insert(payload)
    if (err) { setError('Error al guardar'); setSaving(false); return }
    router.push('/admin/galeria'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
      <div><label className={labelCls}>Imagen *</label><ImageUploader folder="gallery" currentUrl={imageUrl} onUpload={(url) => setImageUrl(url)} label="Subir imagen de galería" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Texto alternativo (Español)</label><input {...register('alt_es')} className={inputCls} /></div>
        <div><label className={labelCls}>Alt text (English)</label><input {...register('alt_en')} className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Descripción (Español)</label><input {...register('caption_es')} className={inputCls} /></div>
        <div><label className={labelCls}>Caption (English)</label><input {...register('caption_en')} className={inputCls} /></div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1"><label className={labelCls}>Categoría</label><input {...register('category')} placeholder="ej: antes-despues" className={inputCls} /></div>
        <div><label className={labelCls}>Orden</label><input type="number" {...register('sort_order')} className="w-20 border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm" /></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-[#051c33]"><input type="checkbox" {...register('is_visible')} className="w-4 h-4" /> Visible</label></div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => router.push('/admin/galeria')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  )
}
