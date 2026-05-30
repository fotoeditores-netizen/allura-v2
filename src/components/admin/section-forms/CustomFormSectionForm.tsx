'use client'
import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

type I18n = { es: string; en: string }
type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select'
type Field = {
  id: string
  type: FieldType
  label: I18n
  placeholder: I18n
  required: boolean
  options: string  // comma-separated for select
}
type Settings = {
  internalName: string
  eyebrow: I18n
  title: I18n
  subtitle: I18n
  submitLabel: I18n
  successMessage: I18n
  toEmail: string
  bg: 'white' | 'light' | 'navy'
  fields: Field[]
}

const FIELD_TYPES: { value: FieldType; label: string; icon: string }[] = [
  { value: 'text',     label: 'Texto corto',  icon: '📝' },
  { value: 'email',    label: 'Email',         icon: '📧' },
  { value: 'phone',    label: 'Teléfono',      icon: '📞' },
  { value: 'textarea', label: 'Texto largo',   icon: '📄' },
  { value: 'select',   label: 'Desplegable',   icon: '🔽' },
]

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#051c33] bg-white'
const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

const uid = () => Math.random().toString(36).slice(2, 8)

const emptyField = (type: FieldType = 'text'): Field => ({
  id: uid(),
  type,
  label: { es: '', en: '' },
  placeholder: { es: '', en: '' },
  required: false,
  options: '',
})

export function CustomFormSectionForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [tab, setTab] = useState<'header' | 'fields' | 'style'>('header')
  const [activeField, setActiveField] = useState(0)
  const s = settings as Settings

  const upd = (field: string, value: unknown) => onChange({ ...settings, [field]: value })
  const updI18n = (field: string, value: string) =>
    onChange({ ...settings, [field]: { ...(settings[field] as object ?? {}), [lang]: value } })

  const fields: Field[] = s.fields ?? [emptyField('text'), emptyField('email')]

  const updField = (i: number, key: string, value: unknown) => {
    const updated = fields.map((f, idx) => {
      if (idx !== i) return f
      if (key === 'label' || key === 'placeholder') {
        return { ...f, [key]: { ...(f[key as 'label'|'placeholder'] as object ?? {}), [lang]: value } }
      }
      return { ...f, [key]: value }
    })
    upd('fields', updated)
  }

  const addField = (type: FieldType) => {
    upd('fields', [...fields, emptyField(type)])
    setActiveField(fields.length)
  }

  const removeField = (i: number) => {
    if (fields.length <= 1) return
    const updated = fields.filter((_, idx) => idx !== i)
    upd('fields', updated)
    setActiveField(Math.min(activeField, updated.length - 1))
  }

  return (
    <div className="space-y-3">
      {/* Nombre interno */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <label className="block text-xs font-semibold text-amber-700 mb-1">🏷️ Nombre interno (solo admin)</label>
        <input value={s.internalName ?? ''} onChange={e => upd('internalName', e.target.value)} className={inputCls} placeholder="Ej: Formulario de contacto personalizado" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {([['header','📝 Encabezado'],['fields','📋 Campos'],['style','🎨 Estilo']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t ? 'bg-white text-[#051c33] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Lang switcher */}
      <div className="flex gap-2">
        {(['es', 'en'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase ${lang === l ? 'bg-[#051c33] text-white' : 'bg-gray-100 text-gray-500'}`}>{l}</button>
        ))}
      </div>

      {/* HEADER TAB */}
      {tab === 'header' && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Eyebrow</label>
            <input value={s.eyebrow?.[lang] ?? ''} onChange={e => updI18n('eyebrow', e.target.value)} className={inputCls} placeholder="Ej: Contáctanos" />
          </div>
          <div>
            <label className={labelCls}>Título</label>
            <input value={s.title?.[lang] ?? ''} onChange={e => updI18n('title', e.target.value)} className={inputCls} placeholder="Título del formulario" />
          </div>
          <div>
            <label className={labelCls}>Subtítulo</label>
            <textarea value={s.subtitle?.[lang] ?? ''} onChange={e => updI18n('subtitle', e.target.value)} rows={2} className={inputCls} placeholder="Texto descriptivo opcional" />
          </div>
          <div>
            <label className={labelCls}>Texto del botón enviar</label>
            <input value={s.submitLabel?.[lang] ?? ''} onChange={e => updI18n('submitLabel', e.target.value)} className={inputCls} placeholder="Enviar mensaje" />
          </div>
          <div>
            <label className={labelCls}>Mensaje de éxito</label>
            <input value={s.successMessage?.[lang] ?? ''} onChange={e => updI18n('successMessage', e.target.value)} className={inputCls} placeholder="¡Gracias! Te contactaremos pronto." />
          </div>
          <div>
            <label className={labelCls}>Email destino</label>
            <input type="email" value={s.toEmail ?? ''} onChange={e => upd('toEmail', e.target.value)} className={inputCls} placeholder="contacto@allura.co" />
            <p className="text-xs text-gray-400 mt-1">Las respuestas del formulario llegarán a este email.</p>
          </div>
        </div>
      )}

      {/* FIELDS TAB */}
      {tab === 'fields' && (
        <div className="space-y-3">
          {/* Field list */}
          <div className="space-y-1">
            {fields.map((f, i) => (
              <div key={f.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${activeField === i ? 'border-[#051c33] bg-[#051c33]/5' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setActiveField(i)}>
                <GripVertical size={12} className="text-gray-300 flex-shrink-0" />
                <span className="text-sm flex-shrink-0">{FIELD_TYPES.find(t => t.value === f.type)?.icon}</span>
                <span className="text-sm flex-1 truncate text-[#051c33]">{f.label?.[lang] || FIELD_TYPES.find(t => t.value === f.type)?.label}</span>
                {f.required && <span className="text-xs text-red-400">*</span>}
                {fields.length > 1 && (
                  <button onClick={e => { e.stopPropagation(); removeField(i) }} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add field buttons */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Agregar campo:</p>
            <div className="flex flex-wrap gap-1">
              {FIELD_TYPES.map(ft => (
                <button key={ft.value} onClick={() => addField(ft.value)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-[#051c33]/10 text-xs text-gray-600 transition-colors">
                  <Plus size={10} /> {ft.icon} {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active field editor */}
          {fields[activeField] && (
            <div className="border border-gray-200 rounded-xl p-3 space-y-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase">Editar campo</p>
              <div>
                <label className={labelCls}>Tipo</label>
                <select value={fields[activeField].type} onChange={e => updField(activeField, 'type', e.target.value)} className={inputCls}>
                  {FIELD_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.icon} {ft.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Etiqueta</label>
                <input value={fields[activeField].label?.[lang] ?? ''} onChange={e => updField(activeField, 'label', e.target.value)} className={inputCls} placeholder="Ej: Tu nombre" />
              </div>
              <div>
                <label className={labelCls}>Placeholder</label>
                <input value={fields[activeField].placeholder?.[lang] ?? ''} onChange={e => updField(activeField, 'placeholder', e.target.value)} className={inputCls} placeholder="Ej: Juan Pérez" />
              </div>
              {fields[activeField].type === 'select' && (
                <div>
                  <label className={labelCls}>Opciones (separadas por coma)</label>
                  <input value={fields[activeField].options ?? ''} onChange={e => updField(activeField, 'options', e.target.value)} className={inputCls} placeholder="Opción 1, Opción 2, Opción 3" />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={fields[activeField].required} onChange={e => updField(activeField, 'required', e.target.checked)} className="w-4 h-4 accent-[#051c33]" />
                <span className="text-xs text-[#051c33] font-medium">Campo obligatorio</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* STYLE TAB */}
      {tab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Color de fondo</label>
            <div className="flex gap-3">
              {[{value:'white',label:'Blanco',cls:'bg-white border border-gray-200'},{value:'light',label:'Claro',cls:'bg-[#eaeeef]'},{value:'navy',label:'Oscuro',cls:'bg-[#051c33]'}].map(opt => (
                <label key={opt.value} className="flex flex-col items-center gap-1 cursor-pointer">
                  <input type="radio" name="bg" value={opt.value} checked={s.bg === opt.value} onChange={() => upd('bg', opt.value)} className="sr-only" />
                  <div className={`w-10 h-10 rounded-lg ${opt.cls} ${s.bg === opt.value ? 'ring-2 ring-[#051c33] ring-offset-2' : ''}`} />
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
