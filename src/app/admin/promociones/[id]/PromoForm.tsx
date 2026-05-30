'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'

const schema = z.object({
  title_es: z.string().min(2, 'Requerido'),
  title_en: z.string().optional(),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  cta_label_es: z.string().optional(),
  cta_label_en: z.string().optional(),
  cta_url: z.string().optional(),
  bg_color: z.enum(['navy', 'blue', 'gold']).optional(),
  valid_from: z.string().optional(),
  valid_until: z.string().optional(),
  is_active: z.boolean(),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

const BG_OPTIONS = [
  { value: 'navy', label: 'Azul oscuro', preview: 'bg-[#051c33]' },
  { value: 'blue', label: 'Azul claro', preview: 'bg-[#8b9fb3]' },
  { value: 'gold', label: 'Dorado', preview: 'bg-amber-600' },
]

export function PromoForm({ promo, siteId }: { promo: any; siteId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_es: promo?.title_i18n?.es ?? '',
      title_en: promo?.title_i18n?.en ?? '',
      description_es: promo?.description_i18n?.es ?? '',
      description_en: promo?.description_i18n?.en ?? '',
      cta_label_es: promo?.cta_label_i18n?.es ?? '',
      cta_label_en: promo?.cta_label_i18n?.en ?? '',
      cta_url: promo?.cta_url ?? '',
      bg_color: promo?.bg_color ?? 'navy',
      valid_from: promo?.valid_from ? promo.valid_from.slice(0, 10) : '',
      valid_until: promo?.valid_until ? promo.valid_until.slice(0, 10) : '',
      is_active: promo?.is_active ?? false,
    },
  })

  const bgColor = watch('bg_color')
  const titleEs = watch('title_es')
  const descEs = watch('description_es')
  const ctaEs = watch('cta_label_es')

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      title_i18n: { es: data.title_es, en: data.title_en ?? '' },
      description_i18n: { es: data.description_es ?? '', en: data.description_en ?? '' },
      cta_label_i18n: { es: data.cta_label_es ?? '', en: data.cta_label_en ?? '' },
      cta_url: data.cta_url || null,
      valid_from: data.valid_from || null,
      valid_until: data.valid_until || null,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    }
    if (data.is_active) {
      await supabase
        .from('promotions')
        .update({ is_active: false })
        .eq('site_id', siteId)
        .neq('id', promo?.id ?? '00000000-0000-0000-0000-000000000000')
    }
    const { error: err } = promo
      ? await supabase.from('promotions').update(payload).eq('id', promo.id)
      : await supabase.from('promotions').insert(payload)
    if (err) { setError('Error al guardar: ' + err.message); setSaving(false); return }
    router.push('/admin/promociones'); router.refresh()
  }

  const bgClass = BG_OPTIONS.find(b => b.value === bgColor)?.preview ?? 'bg-[#051c33]'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Vista previa en vivo */}
      <div className="rounded-xl overflow-hidden border border-[#eaeeef]">
        <p className="text-xs font-medium text-[#8b9fb3] px-4 pt-3 pb-1">Vista previa</p>
        <div className={`py-2 px-4 text-center text-sm text-white ${bgClass}`}>
          <span className="font-semibold">{titleEs || 'Título de la promoción'}</span>
          {descEs && <span className="mx-2 opacity-90">{descEs}</span>}
          {ctaEs && <span className="ml-3 underline font-semibold">{ctaEs} →</span>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {/* Títulos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Título (Español) *</label>
            <input {...register('title_es')} className={inputCls} placeholder="Ej: ¡Oferta especial este mes!" />
            {errors.title_es && <p className="text-red-500 text-xs mt-1">{errors.title_es.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Title (English)</label>
            <input {...register('title_en')} className={inputCls} placeholder="Ex: Special offer this month!" />
          </div>
        </div>

        {/* Descripción */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Descripción (Español)</label>
            <input {...register('description_es')} className={inputCls} placeholder="Texto secundario opcional" />
          </div>
          <div>
            <label className={labelCls}>Description (English)</label>
            <input {...register('description_en')} className={inputCls} />
          </div>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Texto del botón (ES)</label>
            <input {...register('cta_label_es')} className={inputCls} placeholder="Ver más" />
          </div>
          <div>
            <label className={labelCls}>Button text (EN)</label>
            <input {...register('cta_label_en')} className={inputCls} placeholder="Learn more" />
          </div>
          <div>
            <label className={labelCls}>URL del enlace</label>
            <input {...register('cta_url')} className={inputCls} placeholder="/contacto" />
          </div>
        </div>

        {/* Color de fondo */}
        <div>
          <label className={labelCls}>Color de fondo</label>
          <div className="flex gap-3 mt-1">
            {BG_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" {...register('bg_color')} value={opt.value} className="sr-only" />
                <span className={`w-6 h-6 rounded-full ${opt.preview} ${bgColor === opt.value ? 'ring-2 ring-offset-2 ring-[#051c33]' : ''}`} />
                <span className="text-sm text-[#051c33]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Vigencia */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Válida desde</label>
            <input type="date" {...register('valid_from')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Válida hasta</label>
            <input type="date" {...register('valid_until')} className={inputCls} />
            <p className="text-xs text-[#8b9fb3] mt-1">Dejar vacío = sin fecha de expiración</p>
          </div>
        </div>

        {/* Activa */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="w-4 h-4 accent-[#051c33]" />
            <span className="text-sm font-medium text-[#051c33]">Activar promoción</span>
          </label>
          <p className="text-xs text-[#8b9fb3] mt-1 ml-7">Solo puede haber una promoción activa a la vez. Activar esta desactivará las demás automáticamente.</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-[#051c33]/90 transition-colors">
            {saving ? 'Guardando...' : 'Guardar promoción'}
          </button>
          <button type="button" onClick={() => router.push('/admin/promociones')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm hover:bg-[#eaeeef] transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </form>
  )
}
