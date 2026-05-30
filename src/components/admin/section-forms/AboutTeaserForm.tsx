'use client'
import { useState } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'
type I18n = { es: string; en: string }

export function AboutTeaserForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; subtitle: I18n; body: I18n; imageUrl: string; ctaLabel: I18n }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object ?? {}), [lang]: v } })

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>
      {[['eyebrow','Eyebrow'],['title','Título'],['subtitle','Subtítulo'],['ctaLabel','Texto botón']].map(([f, label]) => (
        <div key={f}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as 'eyebrow'|'title'|'subtitle'|'ctaLabel'] as I18n)?.[lang] ?? ''} onChange={e => upd(f, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Cuerpo de texto</label>
        <textarea value={s.body?.[lang] ?? ''} onChange={e => upd('body', e.target.value)}
          rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
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
    </div>
  )
}
