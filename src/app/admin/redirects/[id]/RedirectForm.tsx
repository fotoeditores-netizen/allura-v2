'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'

const schema = z.object({
  from_path: z.string().min(1).startsWith('/', 'Debe empezar con /'),
  to_path: z.string().min(1).startsWith('/', 'Debe empezar con /'),
  status_code: z.coerce.number().int(),
})
type FormData = z.infer<typeof schema>
const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33] font-mono'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function RedirectForm({ redirect, siteId }: { redirect: any; siteId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      from_path: redirect?.from_path ?? '/',
      to_path: redirect?.to_path ?? '/',
      status_code: redirect?.status_code ?? 301,
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = { site_id: siteId, ...data }
    const { error: err } = redirect
      ? await supabase.from('redirects').update(payload).eq('id', redirect.id)
      : await supabase.from('redirects').insert(payload)
    if (err) { setError('Error al guardar'); setSaving(false); return }
    router.push('/admin/redirects'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-lg">
      <div><label className={labelCls}>Desde (URL original)</label><input {...register('from_path')} placeholder="/url-antigua" className={inputCls} />{errors.from_path && <p className="text-red-500 text-xs mt-1">{errors.from_path.message}</p>}</div>
      <div><label className={labelCls}>Hacia (URL destino)</label><input {...register('to_path')} placeholder="/url-nueva" className={inputCls} />{errors.to_path && <p className="text-red-500 text-xs mt-1">{errors.to_path.message}</p>}</div>
      <div><label className={labelCls}>Tipo de redirección</label>
        <select {...register('status_code')} className="border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm">
          <option value={301}>301 — Permanente</option>
          <option value={302}>302 — Temporal</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => router.push('/admin/redirects')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  )
}
