'use client'
import { useState } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'
type I18n = { es: string; en: string }

export function TextImageForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { title: I18n; body: I18n; imageUrl: string; imagePosition: 'left' | 'right' }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object ?? {}), [lang]: v } })

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
        <input value={s.title?.[lang] ?? ''} onChange={e => upd('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Texto</label>
        <textarea value={s.body?.[lang] ?? ''} onChange={e => upd('body', e.target.value)}
          rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Imagen</label>
        <ImageUploader
          folder="site"
          currentUrl={s.imageUrl ?? ''}
          onUpload={(url) => onChange({ ...settings, imageUrl: url })}
          label="Subir imagen"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Posición imagen</label>
        <select value={s.imagePosition ?? 'right'} onChange={e => onChange({ ...settings, imagePosition: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]">
          <option value="right">Derecha</option>
          <option value="left">Izquierda</option>
        </select>
      </div>
    </div>
  )
}
