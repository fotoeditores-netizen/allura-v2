'use client'
import { useState } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'

type I18n = { es: string; en: string }
type Settings = {
  internalName: string
  layout: 'text-center' | 'text-left' | 'text-image-right' | 'text-image-left' | 'hero-dark'
  bg: 'white' | 'light' | 'navy'
  padding: 'compact' | 'normal' | 'wide'
  align: 'left' | 'center' | 'right'
  eyebrow: I18n
  title: I18n
  subtitle: I18n
  body: I18n
  imageUrl: string
  ctaLabel: I18n
  ctaUrl: string
  ctaStyle: 'primary' | 'secondary' | 'outline' | 'whatsapp'
  cta2Label: I18n
  cta2Url: string
  cta2Style: 'primary' | 'secondary' | 'outline' | 'whatsapp'
}

const LAYOUTS = [
  { value: 'text-center',      label: '📄 Texto centrado' },
  { value: 'text-left',        label: '📝 Texto a la izquierda' },
  { value: 'text-image-right', label: '🖼️ Texto + imagen derecha' },
  { value: 'text-image-left',  label: '🖼️ Texto + imagen izquierda' },
  { value: 'hero-dark',        label: '🌃 Hero oscuro' },
]

const BGS = [
  { value: 'white', label: 'Blanco',     cls: 'bg-white border border-gray-200' },
  { value: 'light', label: 'Azul claro', cls: 'bg-[#eaeeef]' },
  { value: 'navy',  label: 'Azul oscuro',cls: 'bg-[#051c33]' },
]

const PADDINGS = [
  { value: 'compact', label: 'Compacto' },
  { value: 'normal',  label: 'Normal' },
  { value: 'wide',    label: 'Amplio' },
]

const ALIGNS = [
  { value: 'left',   label: '← Izquierda' },
  { value: 'center', label: '↔ Centro' },
  { value: 'right',  label: '→ Derecha' },
]

const CTA_STYLES = [
  { value: 'primary',   label: 'Primario (oscuro)' },
  { value: 'secondary', label: 'Secundario (borde blanco)' },
  { value: 'outline',   label: 'Outline (borde oscuro)' },
  { value: 'whatsapp',  label: '💬 WhatsApp (verde)' },
]

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33] bg-white'
const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

export function CustomSectionForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [tab, setTab] = useState<'content' | 'style' | 'cta'>('content')
  const s = settings as Settings

  const upd = (field: string, value: unknown) => onChange({ ...settings, [field]: value })
  const updI18n = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object ?? {}), [lang]: value } })

  const hasImage = ['text-image-right', 'text-image-left'].includes(s.layout)

  return (
    <div className="space-y-3">

      {/* Nombre interno */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <label className="block text-xs font-semibold text-amber-700 mb-1">🏷️ Nombre interno (solo admin)</label>
        <input
          value={s.internalName ?? ''}
          onChange={e => upd('internalName', e.target.value)}
          className={inputCls}
          placeholder="Ej: Banner de bienvenida junio"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {([['content','✏️ Contenido'],['style','🎨 Estilo'],['cta','🔗 Botón']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t ? 'bg-white text-[#051c33] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Lang switcher */}
      {tab === 'content' && (
        <div className="flex gap-2">
          {(['es', 'en'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
          ))}
        </div>
      )}

      {/* CONTENT TAB */}
      {tab === 'content' && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Eyebrow</label>
            <input value={s.eyebrow?.[lang] ?? ''} onChange={e => updI18n('eyebrow', e.target.value)} className={inputCls} placeholder="Ej: Sobre nosotros" />
          </div>
          <div>
            <label className={labelCls}>Título</label>
            <input value={s.title?.[lang] ?? ''} onChange={e => updI18n('title', e.target.value)} className={inputCls} placeholder="Título principal" />
          </div>
          <div>
            <label className={labelCls}>Subtítulo</label>
            <input value={s.subtitle?.[lang] ?? ''} onChange={e => updI18n('subtitle', e.target.value)} className={inputCls} placeholder="Texto secundario" />
          </div>
          <div>
            <label className={labelCls}>Cuerpo de texto</label>
            <textarea value={s.body?.[lang] ?? ''} onChange={e => updI18n('body', e.target.value)}
              rows={4} className={inputCls} placeholder="Párrafo descriptivo..." />
          </div>
          {hasImage && (
            <div>
              <label className={labelCls}>Imagen</label>
              <ImageUploader
                folder="site"
                currentUrl={s.imageUrl ?? ''}
                onUpload={(url) => upd('imageUrl', url)}
                label="Subir imagen"
              />
            </div>
          )}
        </div>
      )}

      {/* STYLE TAB */}
      {tab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Layout</label>
            <div className="space-y-1">
              {LAYOUTS.map(opt => (
                <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${s.layout === opt.value ? 'border-[#051c33] bg-[#051c33]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="layout" value={opt.value} checked={s.layout === opt.value} onChange={() => upd('layout', opt.value)} className="accent-[#051c33]" />
                  <span className="text-sm text-[#051c33]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Color de fondo</label>
            <div className="flex gap-2">
              {BGS.map(opt => (
                <label key={opt.value} className="flex flex-col items-center gap-1 cursor-pointer">
                  <input type="radio" name="bg" value={opt.value} checked={s.bg === opt.value} onChange={() => upd('bg', opt.value)} className="sr-only" />
                  <div className={`w-10 h-10 rounded-lg ${opt.cls} ${s.bg === opt.value ? 'ring-2 ring-[#051c33] ring-offset-2' : ''}`} />
                  <span className="text-xs text-gray-500">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Espaciado</label>
            <div className="flex gap-2">
              {PADDINGS.map(opt => (
                <label key={opt.value} className={`flex-1 text-center px-2 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${s.padding === opt.value ? 'border-[#051c33] bg-[#051c33]/5 text-[#051c33] font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input type="radio" name="padding" value={opt.value} checked={s.padding === opt.value} onChange={() => upd('padding', opt.value)} className="sr-only" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Alineación del texto</label>
            <div className="flex gap-2">
              {ALIGNS.map(opt => (
                <label key={opt.value} className={`flex-1 text-center px-2 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${s.align === opt.value ? 'border-[#051c33] bg-[#051c33]/5 text-[#051c33] font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input type="radio" name="align" value={opt.value} checked={s.align === opt.value} onChange={() => upd('align', opt.value)} className="sr-only" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA TAB */}
      {tab === 'cta' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 bg-gray-50 rounded p-2">Los botones solo aparecen si completas el texto y la URL.</p>
          <div className="flex gap-2 mb-1">
            {(['es', 'en'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
            ))}
          </div>

          {/* Botón 1 */}
          <div className="border border-gray-200 rounded-lg p-3 space-y-3">
            <p className="text-xs font-semibold text-[#051c33]">Botón 1</p>
            <div>
              <label className={labelCls}>Texto</label>
              <input value={s.ctaLabel?.[lang] ?? ''} onChange={e => updI18n('ctaLabel', e.target.value)} className={inputCls} placeholder="Ej: Ver más" />
            </div>
            <div>
              <label className={labelCls}>URL destino</label>
              <input value={s.ctaUrl ?? ''} onChange={e => upd('ctaUrl', e.target.value)} className={inputCls} placeholder="/contacto" />
            </div>
            <div>
              <label className={labelCls}>Estilo</label>
              <select value={s.ctaStyle ?? 'primary'} onChange={e => upd('ctaStyle', e.target.value)} className={inputCls}>
                {CTA_STYLES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón 2 */}
          <div className="border border-gray-200 rounded-lg p-3 space-y-3">
            <p className="text-xs font-semibold text-[#051c33]">Botón 2 <span className="font-normal text-gray-400">(opcional)</span></p>
            <div>
              <label className={labelCls}>Texto</label>
              <input value={s.cta2Label?.[lang] ?? ''} onChange={e => updI18n('cta2Label', e.target.value)} className={inputCls} placeholder="Ej: WhatsApp" />
            </div>
            <div>
              <label className={labelCls}>URL destino</label>
              <input value={s.cta2Url ?? ''} onChange={e => upd('cta2Url', e.target.value)} className={inputCls} placeholder="https://wa.me/57..." />
            </div>
            <div>
              <label className={labelCls}>Estilo</label>
              <select value={s.cta2Style ?? 'whatsapp'} onChange={e => upd('cta2Style', e.target.value)} className={inputCls}>
                {CTA_STYLES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
