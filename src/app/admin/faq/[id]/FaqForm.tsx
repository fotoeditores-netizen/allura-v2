'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'

const schema = z.object({
  question_es: z.string().min(5, 'Requerido'),
  question_en: z.string().min(5, 'Requerido'),
  answer_es: z.string().min(5, 'Requerido'),
  answer_en: z.string().min(5, 'Requerido'),
  sort_order: z.coerce.number(),
  is_visible: z.boolean(),
  is_open_by_default: z.boolean(),
})
type FormData = z.infer<typeof schema>
const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function FaqForm({ faq, siteId }: { faq: any; siteId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      question_es: faq?.question_i18n?.es ?? '',
      question_en: faq?.question_i18n?.en ?? '',
      answer_es: faq?.answer_i18n?.es ?? '',
      answer_en: faq?.answer_i18n?.en ?? '',
      sort_order: faq?.sort_order ?? 0,
      is_visible: faq?.is_visible ?? true,
      is_open_by_default: faq?.is_open_by_default ?? false,
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      question_i18n: { es: data.question_es, en: data.question_en },
      answer_i18n: { es: data.answer_es, en: data.answer_en },
      sort_order: data.sort_order,
      is_visible: data.is_visible,
      is_open_by_default: data.is_open_by_default,
      updated_at: new Date().toISOString(),
    }
    const { error: err } = faq
      ? await supabase.from('faqs').update(payload).eq('id', faq.id)
      : await supabase.from('faqs').insert(payload)
    if (err) { setError('Error al guardar'); setSaving(false); return }
    router.push('/admin/faq'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Pregunta (Español)</label><input {...register('question_es')} className={inputCls} />{errors.question_es && <p className="text-red-500 text-xs mt-1">{errors.question_es.message}</p>}</div>
        <div><label className={labelCls}>Question (English)</label><input {...register('question_en')} className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Respuesta (Español)</label><textarea {...register('answer_es')} rows={4} className={inputCls} />{errors.answer_es && <p className="text-red-500 text-xs mt-1">{errors.answer_es.message}</p>}</div>
        <div><label className={labelCls}>Answer (English)</label><textarea {...register('answer_en')} rows={4} className={inputCls} /></div>
      </div>
      <div className="flex gap-6">
        <div><label className={labelCls}>Orden</label><input type="number" {...register('sort_order')} className="w-20 border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm" /></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-[#051c33]"><input type="checkbox" {...register('is_visible')} className="w-4 h-4" /> Visible</label></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-[#051c33]"><input type="checkbox" {...register('is_open_by_default')} className="w-4 h-4" /> Mostrar respuesta abierta</label></div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => router.push('/admin/faq')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  )
}
