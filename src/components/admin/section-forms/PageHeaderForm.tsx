'use client'
import { useState } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'

type I18n = { es: string; en: string }
type Settings = {
  style: 'dark-centered' | 'dark-image'
  eyebrow: I18n
  title: I18n
  subtitle: I18n
  imageUrl: string
  ctaLabel: I18n
  ctaUrl: string
  breadcrumb: I18n
}

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33] bg-white'
const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

const STYLES = [
  {
    value: 'dark-centered',
    label: '🌑 Oscuro centrado',
    desc: 'Como "Cómo funciona" — fondo azul, texto centrado',
  },
  {
    value: 'dark-image',
    label: '🖼️ Oscuro con imagen',
    desc: 'Como servicios — imagen de fondo con texto a la izquierda',
  },
]

export function PageHeaderForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const s = settings as Settings
  const upd = (field: string, value: unknown) => onChange({ ...settings, [field]: value })
  const updI18n = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object ?? {}), [lang]: value } })

  return (
    <div className="space-y-4">
      {/* Style selector */}
      <div>
        <label className={labelCls}>Estilo de cabecera</label>
        <div className="space-y-2">
          {STYLES.map(opt => (
            <label key={opt.value} className={`flex items-start gap-3 px-3 py-3 rounded-xl border cursor-pointer transition-colors ${s.style === opt.value ? 'border-[#051c33] bg-[#051c33]/5' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="style" value={opt.value} checked={s.style === opt.value} onChange={() => upd('style', opt.value)} className="accent-[#051c33] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#051c33]">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Lang switcher */}
      <div className="flex gap-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>

      {/* Content fields */}
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Eyebrow / Categoría</label>
          <input value={s.eyebrow?.[lang] ?? ''} onChange={e => updI18n('eyebrow', e.target.value)} className={inputCls} placeholder="Ej: Smile Makeover" />
        </div>
        <div>
          <label className={labelCls}>Título principal</label>
          <input value={s.title?.[lang] ?? ''} onChange={e => updI18n('title', e.target.value)} className={inputCls} placeholder="Título grande de la página" />
        </div>
        <div>
          <label className={labelCls}>Subtítulo / Descripción</label>
          <textarea value={s.subtitle?.[lang] ?? ''} onChange={e => updI18n('subtitle', e.target.value)} rows={3} className={inputCls} placeholder="Texto descriptivo debajo del título" />
        </div>
        <div>
          <label className={labelCls}>Texto del botón (opcional)</label>
          <input value={s.ctaLabel?.[lang] ?? ''} onChange={e => updI18n('ctaLabel', e.target.value)} className={inputCls} placeholder="Ej: Agenda tu consulta" />
        </div>
        <div>
          <label className={labelCls}>URL del botón</label>
          <input value={s.ctaUrl ?? ''} onChange={e => upd('ctaUrl', e.target.value)} className={inputCls} placeholder="/contacto" />
        </div>
        <div>
          <label className={labelCls}>Breadcrumb (texto de navegación, opcional)</label>
          <input value={s.breadcrumb?.[lang] ?? ''} onChange={e => updI18n('breadcrumb', e.target.value)} className={inputCls} placeholder="Ej: Servicios › Smile Makeover" />
        </div>
      </div>

      {/* Image — only for dark-image style */}
      {s.style === 'dark-image' && (
        <div>
          <label className={labelCls}>Imagen de fondo</label>
          <ImageUploader
            folder="site"
            currentUrl={s.imageUrl ?? ''}
            onUpload={url => upd('imageUrl', url)}
            label="Subir imagen de fondo"
          />
          <p className="text-xs text-gray-400 mt-1">Recomendado: imagen horizontal, mín. 1400×600px</p>
        </div>
      )}
    </div>
  )
}
