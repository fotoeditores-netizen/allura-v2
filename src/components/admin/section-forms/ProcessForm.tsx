'use client'
import { useState } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'
type I18n = { es: string; en: string }
type Step = { number: string; title: I18n; description: I18n; imageUrl?: string }

export function ProcessForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; steps: Step[] }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object ?? {}), [lang]: v } })

  const updStep = (i: number, field: string, value: string) => {
    const steps = [...(s.steps ?? [])]
    if (field === 'imageUrl') {
      steps[i] = { ...steps[i], imageUrl: value }
    } else {
      steps[i] = { ...steps[i], [field]: { ...(steps[i][field as 'title' | 'description'] as object ?? {}), [lang]: value } }
    }
    onChange({ ...settings, steps })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>
      {[['eyebrow','Eyebrow'],['title','Título']].map(([f, label]) => (
        <div key={f}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as 'eyebrow'|'title'] as I18n)?.[lang] ?? ''} onChange={e => upd(f, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
        </div>
      ))}
      <p className="text-xs font-semibold text-gray-500 uppercase mt-2">Pasos</p>
      {(s.steps ?? []).map((step, i) => (
        <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium">Paso {step.number}</p>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Título</label>
            <input value={step.title?.[lang] ?? ''} onChange={e => updStep(i, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#051c33] bg-white" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Descripción</label>
            <textarea value={step.description?.[lang] ?? ''} onChange={e => updStep(i, 'description', e.target.value)}
              rows={2} className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#051c33] bg-white" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Imagen del paso</label>
            <ImageUploader
              folder="site"
              currentUrl={step.imageUrl ?? ''}
              onUpload={(url) => updStep(i, 'imageUrl', url)}
              label="Subir imagen"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
