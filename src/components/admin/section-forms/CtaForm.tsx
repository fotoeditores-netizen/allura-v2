'use client'
import { useState } from 'react'
type I18n = { es: string; en: string }

const BUTTON_COLORS = [
  { label: 'Verde WhatsApp', value: 'whatsapp', bg: '#25D366', hover: '#22c55e', text: 'white' },
  { label: 'Azul marino', value: 'navy', bg: '#051c33', hover: '#0a3260', text: 'white' },
  { label: 'Azul claro', value: 'blue', bg: '#8b9fb3', hover: '#7a8fa3', text: 'white' },
  { label: 'Blanco', value: 'white', bg: '#ffffff', hover: '#eaeeef', text: '#051c33' },
]

export function CtaForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as { eyebrow: I18n; title: I18n; subtitle: I18n; buttonLabel: I18n; buttonColor?: string; buttonUrl?: string }
  const upd = (f: string, v: string) => onChange({ ...settings, [f]: { ...(settings[f] as object ?? {}), [lang]: v } })
  const updDirect = (f: string, v: string) => onChange({ ...settings, [f]: v })

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>

      {[['eyebrow','Eyebrow'],['title','Título'],['subtitle','Subtítulo'],['buttonLabel','Texto del botón']].map(([f, label]) => (
        <div key={f}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input value={(s[f as 'eyebrow'|'title'|'subtitle'|'buttonLabel'] as I18n)?.[lang] ?? ''} onChange={e => upd(f, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33]" />
        </div>
      ))}

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Color del botón</label>
        <div className="flex gap-2 flex-wrap">
          {BUTTON_COLORS.map(({ label, value, bg, text }) => (
            <button
              key={value}
              type="button"
              onClick={() => updDirect('buttonColor', value)}
              title={label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                (s.buttonColor ?? 'whatsapp') === value
                  ? 'border-[#051c33] scale-105 shadow'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: bg, color: text }}
            >
              {(s.buttonColor ?? 'whatsapp') === value && <span>✓</span>}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">URL del botón</label>
        <input
          type="text"
          value={s.buttonUrl ?? ''}
          onChange={e => updDirect('buttonUrl', e.target.value)}
          placeholder="Ej: /contacto  o  https://wa.me/..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33] font-mono"
        />
        <p className="text-xs text-gray-400 mt-1">Deja vacío para usar el link de WhatsApp por defecto</p>
      </div>
    </div>
  )
}
