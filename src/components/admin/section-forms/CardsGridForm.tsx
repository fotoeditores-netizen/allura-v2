'use client'
import { useState } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

type I18n = { es: string; en: string }
type CtaStyle = 'link' | 'button-navy' | 'button-whatsapp' | 'button-outline'
type CtaAlign = 'left' | 'center' | 'right'
type Card = {
  iconType: 'none' | 'emoji' | 'image'
  icon: string
  iconImageUrl: string
  title: I18n
  body: I18n
  imageUrl: string
  ctaLabel: I18n
  ctaUrl: string
  ctaStyle: CtaStyle
  ctaAlign: CtaAlign
  cardBg: 'white' | 'light' | 'navy'
}

const CTA_STYLES: { value: CtaStyle; label: string; preview: string }[] = [
  { value: 'link',            label: 'Enlace',    preview: 'text-[#051c33] underline text-xs' },
  { value: 'button-navy',     label: 'Azul',      preview: 'bg-[#051c33] text-white text-xs px-2 py-0.5 rounded-lg' },
  { value: 'button-whatsapp', label: 'WhatsApp',  preview: 'bg-[#25D366] text-white text-xs px-2 py-0.5 rounded-lg' },
  { value: 'button-outline',  label: 'Borde',     preview: 'border border-[#051c33] text-[#051c33] text-xs px-2 py-0.5 rounded-lg' },
]
type Settings = {
  internalName: string
  eyebrow: I18n
  title: I18n
  subtitle: I18n
  columns: 2 | 3 | 4
  bg: 'white' | 'light' | 'navy'
  cardStyle: 'flat' | 'shadow' | 'bordered' | 'image-top'
  cards: Card[]
}

const CARD_STYLES = [
  { value: 'flat',      label: '⬜ Plana' },
  { value: 'shadow',    label: '🌫️ Con sombra' },
  { value: 'bordered',  label: '🔲 Con borde' },
  { value: 'image-top', label: '🖼️ Imagen arriba' },
]

const ICONS = ['⭐','🏆','❤️','🔬','🌿','✈️','🛡️','💡','🎯','👨‍⚕️','🌍','📋','💎','🤝','🔑','🏥']

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33] bg-white'
const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

const emptyCard = (): Card => ({
  iconType: 'emoji',
  icon: '⭐',
  iconImageUrl: '',
  title: { es: '', en: '' },
  body: { es: '', en: '' },
  imageUrl: '',
  ctaLabel: { es: '', en: '' },
  ctaUrl: '',
  ctaStyle: 'button-navy',
  ctaAlign: 'left',
  cardBg: 'white',
})

export function CardsGridForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [tab, setTab] = useState<'header' | 'cards' | 'style'>('header')
  const [activeCard, setActiveCard] = useState(0)
  const s = settings as Settings

  const upd = (field: string, value: unknown) => onChange({ ...settings, [field]: value })
  const updI18n = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object ?? {}), [lang]: value } })

  const cards: Card[] = s.cards ?? [emptyCard()]

  const updCard = (i: number, field: string, value: unknown) => {
    const updated = cards.map((c, idx) => {
      if (idx !== i) return c
      if (field === 'title' || field === 'body' || field === 'ctaLabel') {
        return { ...c, [field]: { ...(c[field as 'title'|'body'|'ctaLabel'] as object ?? {}), [lang]: value } }
      }
      return { ...c, [field]: value }
    })
    upd('cards', updated)
  }

  const addCard = () => {
    if (cards.length >= 6) return
    upd('cards', [...cards, emptyCard()])
    setActiveCard(cards.length)
  }

  const removeCard = (i: number) => {
    if (cards.length <= 1) return
    const updated = cards.filter((_, idx) => idx !== i)
    upd('cards', updated)
    setActiveCard(Math.min(activeCard, updated.length - 1))
  }

  return (
    <div className="space-y-3">
      {/* Nombre interno */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <label className="block text-xs font-semibold text-amber-700 mb-1">🏷️ Nombre interno (solo admin)</label>
        <input value={s.internalName ?? ''} onChange={e => upd('internalName', e.target.value)} className={inputCls} placeholder="Ej: Grid de beneficios" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {([['header','📝 Encabezado'],['cards','🃏 Tarjetas'],['style','🎨 Estilo']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t ? 'bg-white text-[#051c33] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Lang switcher */}
      {(tab === 'header' || tab === 'cards') && (
        <div className="flex gap-2">
          {(['es', 'en'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
          ))}
        </div>
      )}

      {/* HEADER TAB */}
      {tab === 'header' && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Eyebrow</label>
            <input value={s.eyebrow?.[lang] ?? ''} onChange={e => updI18n('eyebrow', e.target.value)} className={inputCls} placeholder="Ej: Nuestros servicios" />
          </div>
          <div>
            <label className={labelCls}>Título</label>
            <input value={s.title?.[lang] ?? ''} onChange={e => updI18n('title', e.target.value)} className={inputCls} placeholder="Título del grid" />
          </div>
          <div>
            <label className={labelCls}>Subtítulo</label>
            <textarea value={s.subtitle?.[lang] ?? ''} onChange={e => updI18n('subtitle', e.target.value)} rows={2} className={inputCls} placeholder="Descripción opcional" />
          </div>
        </div>
      )}

      {/* CARDS TAB */}
      {tab === 'cards' && (
        <div className="space-y-3">
          {/* Card selector */}
          <div className="flex gap-1 flex-wrap">
            {cards.map((c, i) => (
              <button key={i} onClick={() => setActiveCard(i)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${activeCard === i ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c.title?.[lang] || `Tarjeta ${i + 1}`}
              </button>
            ))}
            {cards.length < 6 && (
              <button onClick={addCard} className="px-3 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 flex items-center gap-1">
                <Plus size={10} /> Agregar
              </button>
            )}
          </div>

          {/* Active card editor */}
          {cards[activeCard] && (
            <div className="border border-gray-200 rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase">Tarjeta {activeCard + 1}</p>
                {cards.length > 1 && (
                  <button onClick={() => removeCard(activeCard)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {/* Icon type selector */}
              <div>
                <label className={labelCls}>Tipo de icono</label>
                <div className="flex gap-2">
                  {([['none','Sin icono'],['emoji','Emoji'],['image','Imagen']] as const).map(([val, lbl]) => (
                    <label key={val} className={`flex-1 text-center px-2 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${(cards[activeCard].iconType ?? 'emoji') === val ? 'border-[#051c33] bg-[#051c33]/5 text-[#051c33] font-medium' : 'border-gray-200 text-gray-500'}`}>
                      <input type="radio" className="sr-only" checked={(cards[activeCard].iconType ?? 'emoji') === val} onChange={() => updCard(activeCard, 'iconType', val)} />
                      {lbl}
                    </label>
                  ))}
                </div>
              </div>

              {/* Emoji picker */}
              {(cards[activeCard].iconType ?? 'emoji') === 'emoji' && (
                <div>
                  <label className={labelCls}>Selecciona emoji</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ICONS.map(icon => (
                      <button key={icon} onClick={() => updCard(activeCard, 'icon', icon)}
                        className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-colors ${cards[activeCard].icon === icon ? 'bg-[#051c33] ring-2 ring-[#051c33] ring-offset-1' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image icon uploader */}
              {(cards[activeCard].iconType ?? 'emoji') === 'image' && (
                <div>
                  <label className={labelCls}>Imagen del icono</label>
                  <ImageUploader folder="site" currentUrl={cards[activeCard].iconImageUrl ?? ''} onUpload={url => updCard(activeCard, 'iconImageUrl', url)} label="Subir imagen (recomendado: cuadrada)" />
                </div>
              )}

              <div>
                <label className={labelCls}>Título</label>
                <input value={cards[activeCard].title?.[lang] ?? ''} onChange={e => updCard(activeCard, 'title', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Texto</label>
                <textarea value={cards[activeCard].body?.[lang] ?? ''} onChange={e => updCard(activeCard, 'body', e.target.value)} rows={3} className={inputCls} />
              </div>

              {(s.cardStyle === 'image-top') && (
                <div>
                  <label className={labelCls}>Imagen</label>
                  <ImageUploader folder="site" currentUrl={cards[activeCard].imageUrl ?? ''} onUpload={url => updCard(activeCard, 'imageUrl', url)} label="Subir imagen" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Botón (texto)</label>
                  <input value={cards[activeCard].ctaLabel?.[lang] ?? ''} onChange={e => updCard(activeCard, 'ctaLabel', e.target.value)} className={inputCls} placeholder="Ver más" />
                </div>
                <div>
                  <label className={labelCls}>URL</label>
                  <input value={cards[activeCard].ctaUrl ?? ''} onChange={e => updCard(activeCard, 'ctaUrl', e.target.value)} className={inputCls} placeholder="/contacto" />
                </div>
              </div>

              {/* Fondo de esta tarjeta */}
              <div>
                <label className={labelCls}>Fondo de la tarjeta</label>
                <div className="flex gap-2">
                  {([{value:'white',label:'Blanco',cls:'bg-white border border-gray-200'},{value:'light',label:'Claro',cls:'bg-[#eaeeef]'},{value:'navy',label:'Oscuro',cls:'bg-[#051c33]'}] as const).map(opt => (
                    <label key={opt.value} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input type="radio" name={`cardBg-${activeCard}`} className="sr-only" checked={(cards[activeCard].cardBg ?? 'white') === opt.value} onChange={() => updCard(activeCard, 'cardBg', opt.value)} />
                      <div className={`w-9 h-9 rounded-lg ${opt.cls} ${(cards[activeCard].cardBg ?? 'white') === opt.value ? 'ring-2 ring-[#051c33] ring-offset-2' : ''}`} />
                      <span className="text-xs text-gray-500">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estilo del botón */}
              <div>
                <label className={labelCls}>Estilo del botón</label>
                <div className="grid grid-cols-2 gap-2">
                  {CTA_STYLES.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updCard(activeCard, 'ctaStyle', opt.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${(cards[activeCard].ctaStyle ?? 'button-navy') === opt.value ? 'border-[#051c33] ring-1 ring-[#051c33] bg-[#051c33]/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className={opt.preview}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alineación del botón */}
              <div>
                <label className={labelCls}>Alineación del botón</label>
                <div className="flex gap-2">
                  {([
                    { value: 'left',   icon: <AlignLeft size={14} />,   label: 'Izq.' },
                    { value: 'center', icon: <AlignCenter size={14} />, label: 'Centro' },
                    { value: 'right',  icon: <AlignRight size={14} />,  label: 'Der.' },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updCard(activeCard, 'ctaAlign', opt.value)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-xs transition-colors ${(cards[activeCard].ctaAlign ?? 'left') === opt.value ? 'border-[#051c33] bg-[#051c33]/5 text-[#051c33] font-semibold' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    >
                      {opt.icon}{opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STYLE TAB */}
      {tab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Columnas</label>
            <div className="flex gap-2">
              {([2, 3, 4] as const).map(n => (
                <label key={n} className={`flex-1 text-center px-2 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${s.columns === n ? 'border-[#051c33] bg-[#051c33]/5 text-[#051c33] font-bold' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="columns" value={n} checked={s.columns === n} onChange={() => upd('columns', n)} className="sr-only" />
                  {n} col
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Estilo de tarjeta</label>
            <div className="space-y-1">
              {CARD_STYLES.map(opt => (
                <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${s.cardStyle === opt.value ? 'border-[#051c33] bg-[#051c33]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="cardStyle" value={opt.value} checked={s.cardStyle === opt.value} onChange={() => upd('cardStyle', opt.value)} className="accent-[#051c33]" />
                  <span className="text-sm text-[#051c33]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Fondo de la sección</label>
            <div className="flex gap-3">
              {[{value:'white',label:'Blanco',cls:'bg-white border border-gray-200'},{value:'light',label:'Claro',cls:'bg-[#eaeeef]'},{value:'navy',label:'Oscuro',cls:'bg-[#051c33]'}].map(opt => (
                <label key={opt.value} className="flex flex-col items-center gap-1 cursor-pointer">
                  <input type="radio" name="bg" value={opt.value} checked={(s.bg ?? 'white') === opt.value} onChange={() => upd('bg', opt.value)} className="sr-only" />
                  <div className={`w-10 h-10 rounded-lg ${opt.cls} ${(s.bg ?? 'white') === opt.value ? 'ring-2 ring-[#051c33] ring-offset-2' : ''}`} />
                  <span className="text-xs text-gray-500">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
