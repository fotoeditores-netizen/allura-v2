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
  body_es: z.string().optional(),
  body_en: z.string().optional(),
  cta_label_es: z.string().optional(),
  cta_label_en: z.string().optional(),
  cta_url: z.string().optional(),
  delay_seconds: z.coerce.number().min(0).max(30),
  is_active: z.boolean(),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function PopupForm({ popup, siteId }: { popup: any; siteId: string }) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(popup?.image_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_es: popup?.title_i18n?.es ?? '',
      title_en: popup?.title_i18n?.en ?? '',
      body_es: popup?.body_i18n?.es ?? '',
      body_en: popup?.body_i18n?.en ?? '',
      cta_label_es: popup?.cta_label_i18n?.es ?? '',
      cta_label_en: popup?.cta_label_i18n?.en ?? '',
      cta_url: popup?.cta_url ?? '',
      delay_seconds: popup?.delay_seconds ?? 3,
      is_active: popup?.is_active ?? false,
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      title_i18n: { es: data.title_es, en: data.title_en ?? '' },
      body_i18n: { es: data.body_es ?? '', en: data.body_en ?? '' },
      cta_label_i18n: { es: data.cta_label_es ?? '', en: data.cta_label_en ?? '' },
      cta_url: data.cta_url || null,
      image_url: imageUrl || null,
      delay_seconds: data.delay_seconds,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    }
    if (data.is_active) {
      await supabase
        .from('popups')
        .update({ is_active: false })
        .eq('site_id', siteId)
        .neq('id', popup?.id ?? '00000000-0000-0000-0000-000000000000')
    }
    const { error: err } = popup
      ? await supabase.from('popups').update(payload).eq('id', popup.id)
      : await supabase.from('popups').insert(payload)
    if (err) { setError('Error al guardar: ' + err.message); setSaving(false); return }
    router.push('/admin/popups'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
      {/* Títulos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Título (Español) *</label>
          <input {...register('title_es')} className={inputCls} placeholder="Ej: ¡Consulta gratuita!" />
          {errors.title_es && <p className="text-red-500 text-xs mt-1">{errors.title_es.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Title (English)</label>
          <input {...register('title_en')} className={inputCls} placeholder="Ex: Free consultation!" />
        </div>
      </div>

      {/* Cuerpo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Mensaje (Español)</label>
          <textarea {...register('body_es')} rows={4} className={inputCls} placeholder="Describe la oferta o mensaje..." />
        </div>
        <div>
          <label className={labelCls}>Message (English)</label>
          <textarea {...register('body_en')} rows={4} className={inputCls} />
        </div>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Botón (ES)</label>
          <input {...register('cta_label_es')} className={inputCls} placeholder="Agendar ahora" />
        </div>
        <div>
          <label className={labelCls}>Button (EN)</label>
          <input {...register('cta_label_en')} className={inputCls} placeholder="Book now" />
        </div>
        <div>
          <label className={labelCls}>URL del botón</label>
          <input {...register('cta_url')} className={inputCls} placeholder="/contacto" />
        </div>
      </div>

      {/* Imagen */}
      <div>
        <label className={labelCls}>Imagen (opcional)</label>
        <ImageUploader folder="popups" currentUrl={imageUrl} onUpload={(url) => setImageUrl(url)} label="Subir imagen del popup" />
      </div>

      {/* Demora */}
      <div className="flex items-center gap-4">
        <div>
          <label className={labelCls}>Aparece después de (segundos)</label>
          <input type="number" {...register('delay_seconds')} min={0} max={30} className="w-24 border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="w-4 h-4 accent-[#051c33]" />
            <span className="text-sm font-medium text-[#051c33]">Activar popup</span>
          </label>
        </div>
      </div>
      <p className="text-xs text-[#8b9fb3] -mt-3">Solo puede haber un popup activo. Activar este desactivará los demás.</p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-[#051c33]/90 transition-colors">
          {saving ? 'Guardando...' : 'Guardar popup'}
        </button>
        <button type="button" onClick={() => router.push('/admin/popups')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm hover:bg-[#eaeeef] transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}
