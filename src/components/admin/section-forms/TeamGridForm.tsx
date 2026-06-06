'use client'
import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

type I18n = { es: string; en: string }

interface TeamMember {
  id: string
  name: string
  role: I18n
  imageUrl: string
  formacion: string[]
  enfoque: string[]
  slug?: string
}

interface Settings {
  eyebrow: I18n
  title: I18n
  subtitle: I18n
  showHover: boolean
  ctaLabel: I18n
  ctaUrl: string
  bg: 'white' | 'light'
  members: TeamMember[]
}

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33] bg-white'
const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function emptyMember(): TeamMember {
  return {
    id: uid(),
    name: '',
    role: { es: '', en: '' },
    imageUrl: '',
    formacion: [],
    enfoque: [],
    slug: '',
  }
}

export function TeamGridForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [tab, setTab] = useState<'header' | 'members' | 'style'>('header')
  const [activeMember, setActiveMember] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const s = settings as unknown as Settings

  const upd = (field: string, value: unknown) => onChange({ ...settings, [field]: value })
  const updI18n = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object ?? {}), [lang]: value } })

  const members: TeamMember[] = (s.members ?? [])

  const updMember = (i: number, field: keyof TeamMember, value: unknown) => {
    const updated = members.map((m, idx) => {
      if (idx !== i) return m
      if (field === 'role') {
        return { ...m, role: { ...(m.role ?? {}), [lang]: value } }
      }
      return { ...m, [field]: value }
    })
    upd('members', updated)
  }

  const addMember = () => {
    const updated = [...members, emptyMember()]
    upd('members', updated)
    setActiveMember(updated.length - 1)
  }

  const removeMember = (i: number) => {
    if (members.length <= 1) return
    const updated = members.filter((_, idx) => idx !== i)
    upd('members', updated)
    setActiveMember(Math.min(activeMember, updated.length - 1))
  }

  const updList = (memberIdx: number, field: 'formacion' | 'enfoque', itemIdx: number, value: string) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      const list = [...(m[field] ?? [])]
      list[itemIdx] = value
      return { ...m, [field]: list }
    })
    upd('members', updated)
  }

  const addListItem = (memberIdx: number, field: 'formacion' | 'enfoque') => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      return { ...m, [field]: [...(m[field] ?? []), ''] }
    })
    upd('members', updated)
  }

  const removeListItem = (memberIdx: number, field: 'formacion' | 'enfoque', itemIdx: number) => {
    const updated = members.map((m, i) => {
      if (i !== memberIdx) return m
      return { ...m, [field]: (m[field] ?? []).filter((_, li) => li !== itemIdx) }
    })
    upd('members', updated)
  }

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))

  const cur = members[activeMember]

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {([['header','📝 Encabezado'],['members','👤 Integrantes'],['style','🎨 Estilo']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t ? 'bg-white text-[#051c33] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Lang switcher */}
      {(tab === 'header' || tab === 'members') && (
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
            <input value={s.eyebrow?.[lang] ?? ''} onChange={e => updI18n('eyebrow', e.target.value)} className={inputCls} placeholder="Ej: Nuestro equipo" />
          </div>
          <div>
            <label className={labelCls}>Título</label>
            <input value={s.title?.[lang] ?? ''} onChange={e => updI18n('title', e.target.value)} className={inputCls} placeholder="Conoce nuestro equipo experto" />
          </div>
          <div>
            <label className={labelCls}>Subtítulo</label>
            <textarea value={s.subtitle?.[lang] ?? ''} onChange={e => updI18n('subtitle', e.target.value)} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Texto del botón CTA (opcional)</label>
            <input value={s.ctaLabel?.[lang] ?? ''} onChange={e => updI18n('ctaLabel', e.target.value)} className={inputCls} placeholder="Ver equipo completo" />
          </div>
          <div>
            <label className={labelCls}>URL del botón CTA</label>
            <input value={s.ctaUrl ?? ''} onChange={e => upd('ctaUrl', e.target.value)} className={inputCls} placeholder="/equipo" />
          </div>
        </div>
      )}

      {/* MEMBERS TAB */}
      {tab === 'members' && (
        <div className="space-y-3">
          {/* Member selector */}
          <div className="flex gap-1 flex-wrap">
            {members.map((m, i) => (
              <button key={m.id} onClick={() => setActiveMember(i)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${activeMember === i ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {m.name || `Integrante ${i + 1}`}
              </button>
            ))}
            <button onClick={addMember}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 flex items-center gap-1">
              <Plus size={10} /> Agregar
            </button>
          </div>

          {cur && (
            <div className="border border-gray-200 rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  {cur.name || `Integrante ${activeMember + 1}`}
                </p>
                {members.length > 1 && (
                  <button onClick={() => removeMember(activeMember)} className="text-red-400 hover:text-red-600 p-1" title="Eliminar integrante">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {/* Foto */}
              <div>
                <label className={labelCls}>Foto</label>
                <ImageUploader
                  folder="team"
                  currentUrl={cur.imageUrl ?? ''}
                  onUpload={url => updMember(activeMember, 'imageUrl', url)}
                  label="Subir foto del integrante"
                />
              </div>

              {/* Nombre */}
              <div>
                <label className={labelCls}>Nombre completo</label>
                <input
                  value={cur.name ?? ''}
                  onChange={e => updMember(activeMember, 'name', e.target.value)}
                  className={inputCls}
                  placeholder="Dra. Johanna Jaramillo"
                />
              </div>

              {/* Especialidad */}
              <div>
                <label className={labelCls}>Especialidad / Cargo ({lang.toUpperCase()})</label>
                <input
                  value={cur.role?.[lang] ?? ''}
                  onChange={e => updMember(activeMember, 'role', e.target.value)}
                  className={inputCls}
                  placeholder="Odontóloga especialista en rehabilitación oral"
                />
              </div>

              {/* Slug */}
              <div>
                <label className={labelCls}>Slug (para enlace al perfil, opcional)</label>
                <input
                  value={cur.slug ?? ''}
                  onChange={e => updMember(activeMember, 'slug', e.target.value)}
                  className={inputCls}
                  placeholder="johanna-jaramillo"
                />
              </div>

              {/* Formación (hover) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection(`formacion-${activeMember}`)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase py-1"
                >
                  <span>📚 Formación (hover)</span>
                  {expandedSections[`formacion-${activeMember}`] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {expandedSections[`formacion-${activeMember}`] && (
                  <div className="space-y-1 mt-1">
                    {(cur.formacion ?? []).map((item, li) => (
                      <div key={li} className="flex gap-1">
                        <input
                          value={item}
                          onChange={e => updList(activeMember, 'formacion', li, e.target.value)}
                          className={`${inputCls} flex-1`}
                          placeholder="Ej: Universidad de Antioquia"
                        />
                        <button onClick={() => removeListItem(activeMember, 'formacion', li)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addListItem(activeMember, 'formacion')}
                      className="text-xs text-brand-blue hover:text-brand-navy flex items-center gap-1 py-1">
                      <Plus size={10} /> Agregar título
                    </button>
                  </div>
                )}
              </div>

              {/* Enfoque (hover) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection(`enfoque-${activeMember}`)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase py-1"
                >
                  <span>🎯 Enfoque (hover)</span>
                  {expandedSections[`enfoque-${activeMember}`] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {expandedSections[`enfoque-${activeMember}`] && (
                  <div className="space-y-1 mt-1">
                    {(cur.enfoque ?? []).map((item, li) => (
                      <div key={li} className="flex gap-1">
                        <input
                          value={item}
                          onChange={e => updList(activeMember, 'enfoque', li, e.target.value)}
                          className={`${inputCls} flex-1`}
                          placeholder="Ej: Rehabilitación oral completa"
                        />
                        <button onClick={() => removeListItem(activeMember, 'enfoque', li)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addListItem(activeMember, 'enfoque')}
                      className="text-xs text-brand-blue hover:text-brand-navy flex items-center gap-1 py-1">
                      <Plus size={10} /> Agregar área
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STYLE TAB */}
      {tab === 'style' && (
        <div className="space-y-4">
          {/* Hover toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <div>
              <p className="text-sm font-medium text-[#051c33]">Mostrar hover informativo</p>
              <p className="text-xs text-gray-400 mt-0.5">Muestra formación y enfoque al pasar el cursor</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={s.showHover !== false}
                onChange={e => upd('showHover', e.target.checked)}
              />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#051c33] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>

          {/* Background */}
          <div>
            <label className={labelCls}>Color de fondo de la sección</label>
            <div className="flex gap-3">
              {[
                { value: 'white', label: 'Blanco', cls: 'bg-white border border-gray-200' },
                { value: 'light', label: 'Claro', cls: 'bg-[#eaeeef]' },
              ].map(opt => (
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
