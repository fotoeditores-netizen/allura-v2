'use client'
import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'

const SITE_ID = '00000000-0000-0000-0000-000000000001'
const FIELDS = [
  { key: 'site_name', label: 'Nombre del sitio', type: 'text' },
  { key: 'contact_email', label: 'Email de contacto', type: 'email' },
  { key: 'whatsapp_number', label: 'WhatsApp (+57...)', type: 'text' },
  { key: 'address', label: 'Dirección', type: 'text' },
  { key: 'social_instagram', label: 'Instagram URL', type: 'url' },
  { key: 'social_facebook', label: 'Facebook URL', type: 'url' },
  { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url' },
  { key: 'social_youtube', label: 'YouTube URL', type: 'url' },
  { key: 'social_tiktok', label: 'TikTok URL', type: 'url' },
  { key: 'ga_measurement_id', label: 'Google Analytics ID (G-...)', type: 'text' },
  { key: 'gtm_container_id', label: 'Google Tag Manager (GTM-...)', type: 'text' },
  { key: 'meta_pixel_id', label: 'Meta Pixel ID', type: 'text' },
]

export default function ConfiguracionPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    supabase.from('site_settings').select('key, value').eq('site_id', SITE_ID).then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((r: any) => { map[r.key] = typeof r.value === 'string' ? r.value : String(r.value ?? '') })
        setValues(map)
      }
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createBrowserSupabaseClient()
    const upserts = Object.entries(values).map(([key, value]) => ({
      site_id: SITE_ID, key, value, updated_at: new Date().toISOString(),
    }))
    await supabase.from('site_settings').upsert(upserts, { onConflict: 'site_id,key' })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">Configuración del sitio</h1>
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-4 max-w-xl">
        {FIELDS.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-[#051c33] mb-1">{label}</label>
            <input type={type} value={values[key] ?? ''} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className={inputCls} />
          </div>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
          {saved && <span className="text-green-600 text-sm">Guardado</span>}
        </div>
      </form>
    </div>
  )
}
