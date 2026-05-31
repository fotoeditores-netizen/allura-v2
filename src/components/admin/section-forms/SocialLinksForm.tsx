'use client'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

type I18n = { es: string; en: string }
type IconType = 'preset' | 'image' | 'emoji'
type SocialLink = {
  id: string
  iconType: IconType
  preset: string
  iconImageUrl: string
  emoji: string
  label: I18n
  url: string
}
type Settings = {
  internalName: string
  eyebrow: I18n
  title: I18n
  subtitle: I18n
  bg: 'white' | 'light' | 'navy'
  layout: 'row' | 'grid'
  showLabel: boolean
  links: SocialLink[]
}

const PRESETS = [
  { value: 'instagram',  label: 'Instagram',  icon: '📸' },
  { value: 'facebook',   label: 'Facebook',   icon: '👥' },
  { value: 'tiktok',     label: 'TikTok',     icon: '🎵' },
  { value: 'youtube',    label: 'YouTube',    icon: '▶️' },
  { value: 'whatsapp',   label: 'WhatsApp',   icon: '💬' },
  { value: 'linkedin',   label: 'LinkedIn',   icon: '💼' },
  { value: 'twitter',    label: 'X / Twitter',icon: '🐦' },
  { value: 'pinterest',  label: 'Pinterest',  icon: '📌' },
  { value: 'threads',    label: 'Threads',    icon: '🧵' },
  { value: 'website',    label: 'Sitio web',  icon: '🌐' },
]

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33] bg-white'
const labelCls = 'block text-xs font-medium text-gray-500 mb-1'
const uid = () => Math.random().toString(36).slice(2, 8)

const emptyLink = (): SocialLink => ({
  id: uid(), iconType: 'preset', preset: 'instagram',
  iconImageUrl: '', emoji: '⭐',
  label: { es: '', en: '' }, url: '',
})

export function SocialLinksForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [tab, setTab] = useState<'header' | 'links' | 'style'>('links')
  const [activeLink, setActiveLink] = useState(0)
  const s = settings as Settings

  const upd = (field: string, value: unknown) => onChange({ ...settings, [field]: value })
  const updI18n = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object ?? {}), [lang]: value } })

  const links: SocialLink[] = s.links ?? [emptyLink()]

  const updLink = (i: number, key: string, value: unknown) => {
    const updated = links.map((l, idx) => {
      if (idx !== i) return l
      if (key === 'label') return { ...l, label: { ...(l.label as object ?? {}), [lang]: value } }
      return { ...l, [key]: value }
    })
    upd('links', updated)
  }

  const addLink = () => { upd('links', [...links, emptyLink()]); setActiveLink(links.length) }
  const removeLink = (i: number) => {
    if (links.length <= 1) return
    const updated = links.filter((_, idx) => idx !== i)
    upd('links', updated)
    setActiveLink(Math.min(activeLink, updated.length - 1))
  }

  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <label className="block text-xs font-semibold text-amber-700 mb-1">🏷️ Nombre interno</label>
        <input value={s.internalName ?? ''} onChange={e => upd('internalName', e.target.value)} className={inputCls} placeholder="Ej: Redes sociales" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {([['header','📝 Encabezado'],['links','🔗 Redes'],['style','🎨 Estilo']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t ? 'bg-white text-[#051c33] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>

      {/* HEADER */}
      {tab === 'header' && (
        <div className="space-y-3">
          <div><label className={labelCls}>Eyebrow</label><input value={s.eyebrow?.[lang] ?? ''} onChange={e => updI18n('eyebrow', e.target.value)} className={inputCls} placeholder="Síguenos" /></div>
          <div><label className={labelCls}>Título</label><input value={s.title?.[lang] ?? ''} onChange={e => updI18n('title', e.target.value)} className={inputCls} placeholder="Encuéntranos en redes sociales" /></div>
          <div><label className={labelCls}>Subtítulo</label><textarea value={s.subtitle?.[lang] ?? ''} onChange={e => updI18n('subtitle', e.target.value)} rows={2} className={inputCls} /></div>
        </div>
      )}

      {/* LINKS */}
      {tab === 'links' && (
        <div className="space-y-3">
          {/* Link list */}
          <div className="space-y-1">
            {links.map((l, i) => {
              const preset = PRESETS.find(p => p.value === l.preset)
              return (
                <div key={l.id}
                  onClick={() => setActiveLink(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${activeLink === i ? 'border-[#051c33] bg-[#051c33]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-base flex-shrink-0">
                    {l.iconType === 'preset' ? preset?.icon : l.iconType === 'emoji' ? l.emoji : '🖼️'}
                  </span>
                  <span className="text-sm flex-1 truncate text-[#051c33]">
                    {l.label?.[lang] || preset?.label || 'Red social'}
                  </span>
                  {links.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); removeLink(i) }} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <button onClick={addLink} className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-[#051c33] hover:text-[#051c33] transition-colors">
            <Plus size={12} /> Agregar red social
          </button>

          {/* Active link editor */}
          {links[activeLink] && (
            <div className="border border-gray-200 rounded-xl p-3 space-y-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase">Editar enlace</p>

              {/* Icon type */}
              <div>
                <label className={labelCls}>Tipo de icono</label>
                <div className="flex gap-2">
                  {([['preset','Red conocida'],['emoji','Emoji'],['image','Imagen']] as const).map(([val, lbl]) => (
                    <button key={val} type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => updLink(activeLink, 'iconType', val)}
                      className={`flex-1 text-center px-2 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${(links[activeLink].iconType ?? 'preset') === val ? 'border-[#051c33] bg-[#051c33]/5 text-[#051c33] font-medium' : 'border-gray-200 text-gray-500'}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset selector */}
              {(links[activeLink].iconType ?? 'preset') === 'preset' && (
                <div>
                  <label className={labelCls}>Red social</label>
                  <div className="grid grid-cols-5 gap-1">
                    {PRESETS.map(p => (
                      <button key={p.value} onClick={() => { updLink(activeLink, 'preset', p.value); updLink(activeLink, 'label', p.label) }}
                        title={p.label}
                        className={`flex flex-col items-center gap-0.5 p-2 rounded-lg text-xs transition-colors ${links[activeLink].preset === p.value ? 'bg-[#051c33] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-[9px] truncate w-full text-center">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Emoji */}
              {links[activeLink].iconType === 'emoji' && (
                <div><label className={labelCls}>Emoji</label><input value={links[activeLink].emoji ?? ''} onChange={e => updLink(activeLink, 'emoji', e.target.value)} className={inputCls} placeholder="⭐" /></div>
              )}

              {/* Image */}
              {links[activeLink].iconType === 'image' && (
                <div><label className={labelCls}>Imagen del icono</label>
                  <ImageUploader folder="site" currentUrl={links[activeLink].iconImageUrl ?? ''} onUpload={url => updLink(activeLink, 'iconImageUrl', url)} label="Subir icono (PNG transparente ideal)" />
                </div>
              )}

              <div><label className={labelCls}>Etiqueta (texto visible)</label><input value={links[activeLink].label?.[lang] ?? ''} onChange={e => updLink(activeLink, 'label', e.target.value)} className={inputCls} placeholder="Instagram" /></div>
              <div><label className={labelCls}>URL</label><input value={links[activeLink].url ?? ''} onChange={e => updLink(activeLink, 'url', e.target.value)} className={inputCls} placeholder="https://instagram.com/allura" /></div>
            </div>
          )}
        </div>
      )}

      {/* STYLE */}
      {tab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Disposición</label>
            <div className="flex gap-2">
              {([['row','↔ Fila'],['grid','⊞ Grid']] as const).map(([val, lbl]) => (
                <button key={val} type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => upd('layout', val)}
                  className={`flex-1 text-center px-3 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${s.layout === val ? 'border-[#051c33] bg-[#051c33]/5 text-[#051c33] font-medium' : 'border-gray-200 text-gray-500'}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Mostrar etiqueta</label>
            <button type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => upd('showLabel', !(s.showLabel ?? true))}
              className="flex items-center gap-2 cursor-pointer">
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${s.showLabel !== false ? 'bg-[#051c33] border-[#051c33]' : 'border-gray-300'}`}>
                {s.showLabel !== false && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-sm text-[#051c33]">Mostrar nombre de la red debajo del icono</span>
            </button>
          </div>
          <div>
            <label className={labelCls}>Color de fondo</label>
            <div className="flex gap-3">
              {[{value:'white',label:'Blanco',cls:'bg-white border border-gray-200'},{value:'light',label:'Claro',cls:'bg-[#eaeeef]'},{value:'navy',label:'Oscuro',cls:'bg-[#051c33]'}].map(opt => (
                <button key={opt.value} type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => upd('bg', opt.value)}
                  className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg ${opt.cls} ${s.bg === opt.value ? 'ring-2 ring-[#051c33] ring-offset-2' : ''}`} />
                  <span className="text-xs text-gray-500">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
