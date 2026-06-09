'use client'
import { useState, useEffect } from 'react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'
const FIELDS = [
  { key: 'site_name', label: 'Nombre del sitio', type: 'text' },
  { key: 'contact_email', label: 'Email de contacto', type: 'text' },
  { key: 'whatsapp_number', label: 'WhatsApp (+57...)', type: 'text' },
  { key: 'address', label: 'Dirección', type: 'text' },
  { key: 'social_instagram', label: 'Instagram URL', type: 'text' },
  { key: 'social_facebook', label: 'Facebook URL', type: 'text' },
  { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text' },
  { key: 'social_youtube', label: 'YouTube URL', type: 'text' },
  { key: 'social_tiktok', label: 'TikTok URL', type: 'text' },
  { key: 'social_x', label: 'X (Twitter) URL', type: 'text' },
  { key: 'ga_measurement_id', label: 'Google Analytics ID (G-...)', type: 'text' },
  { key: 'gtm_container_id', label: 'Google Tag Manager (GTM-...)', type: 'text' },
  { key: 'meta_pixel_id', label: 'Meta Pixel ID', type: 'text' },
]

export default function ConfiguracionPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/footer')
      .then(r => r.json())
      .then(({ data }) => {
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
    setSaveError(null)
    const upserts = FIELDS
      .filter(({ key }) => values[key] !== undefined)
      .map(({ key }) => ({ site_id: SITE_ID, key, value: values[key], updated_at: new Date().toISOString() }))
    const res = await fetch('/api/admin/footer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ upserts }),
    })
    const json = await res.json()
    if (!res.ok || json.error) {
      setSaveError(`Error: ${json.error ?? 'Error desconocido'}`)
      setSaving(false)
      return
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33]'

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#051c33] mb-6">Configuración del sitio</h1>
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-4 max-w-xl">
        {FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-[#051c33] mb-1">{label}</label>
            <input type="text" value={values[key] ?? ''} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className={inputCls} />
          </div>
        ))}
        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <button type="submit" disabled={saving} className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && <span className="text-green-600 text-sm">✅ Guardado y sitio actualizado</span>}
          {saveError && <span className="text-red-600 text-sm">{saveError}</span>}
        </div>
      </form>
    </div>
  )
}
