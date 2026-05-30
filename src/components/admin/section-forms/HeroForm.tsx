'use client'
import { useState } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'

type I18n = { es: string; en: string }
type HeroSettings = {
  eyebrow: I18n; headline1: I18n; headline2: I18n
  subtitle: I18n; ctaPrimary: I18n; ctaSecondary: I18n; imageUrl: string
}

export function HeroForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as HeroSettings
  const upd = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object ?? {}), [lang]: value } })

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>
      {[['eyebrow','Eyebrow'],['headline1','Título línea 1'],['headline2','Título línea 2'],['ctaPrimary','Botón primario'],['ctaSecondary','Botón secundario']].map(([field, label]) => (
        <div key={field}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[field as keyof HeroSettings] as I18n)?.[lang] ?? ''}
            onChange={e => upd(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Subtítulo</label>
        <textarea value={s.subtitle?.[lang] ?? ''} onChange={e => upd('subtitle', e.target.value)}
          rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Imagen de fondo</label>
        <ImageUploader
          folder="site"
          currentUrl={s.imageUrl ?? ''}
          onUpload={(url) => onChange({ ...settings, imageUrl: url })}
          label="Subir imagen de fondo"
        />
      </div>
    </div>
  )
}
