'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { ImageUploader } from '@/components/admin/ImageUploader'

const schema = z.object({
  name: z.string().min(2, 'Requerido'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  role_es: z.string().optional(),
  role_en: z.string().optional(),
  bio_es: z.string().optional(),
  bio_en: z.string().optional(),
  sort_order: z.coerce.number(),
  is_visible: z.boolean(),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'
const labelCls = 'block text-sm font-medium text-[#051c33] mb-1'

export function EquipoForm({ member, siteId }: { member: any; siteId: string }) {
  const router = useRouter()
  const [photoUrl, setPhotoUrl] = useState<string>(member?.photo_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: member?.name ?? '',
      slug: member?.slug ?? '',
      role_es: member?.role_i18n?.es ?? '',
      role_en: member?.role_i18n?.en ?? '',
      bio_es: member?.bio_i18n?.es ?? '',
      bio_en: member?.bio_i18n?.en ?? '',
      sort_order: member?.sort_order ?? 0,
      is_visible: member?.is_visible ?? true,
    },
  })

  async function onSubmit(data: FormData) {
    setSaving(true); setError(null)
    const supabase = createBrowserSupabaseClient()
    const payload = {
      site_id: siteId,
      name: data.name,
      slug: data.slug,
      role_i18n: { es: data.role_es ?? '', en: data.role_en ?? '' },
      bio_i18n: { es: data.bio_es ?? '', en: data.bio_en ?? '' },
      photo_url: photoUrl || null,
      sort_order: data.sort_order,
      is_visible: data.is_visible,
      updated_at: new Date().toISOString(),
    }
    const { error: err } = member
      ? await supabase.from('team_members').update(payload).eq('id', member.id)
      : await supabase.from('team_members').insert(payload)
    if (err) { setError('Error al guardar'); setSaving(false); return }
    router.push('/admin/equipo'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
      <div><label className={labelCls}>Nombre completo</label><input {...register('name')} className={inputCls} />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}</div>
      <div><label className={labelCls}>URL (slug)</label><input {...register('slug')} className={inputCls} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Cargo (Español)</label><input {...register('role_es')} className={inputCls} /></div>
        <div><label className={labelCls}>Role (English)</label><input {...register('role_en')} className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelCls}>Biografía (Español)</label><textarea {...register('bio_es')} rows={4} className={inputCls} /></div>
        <div><label className={labelCls}>Bio (English)</label><textarea {...register('bio_en')} rows={4} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Foto</label><ImageUploader folder="team" currentUrl={photoUrl} onUpload={(url) => setPhotoUrl(url)} /></div>
      <div className="flex gap-6">
        <div><label className={labelCls}>Orden</label><input type="number" {...register('sort_order')} className="w-20 border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm" /></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-[#051c33] cursor-pointer"><input type="checkbox" {...register('is_visible')} className="w-4 h-4" /> Visible en el sitio</label></div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => router.push('/admin/equipo')} className="border border-[#8b9fb3]/40 text-[#051c33] px-5 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </form>
  )
}
