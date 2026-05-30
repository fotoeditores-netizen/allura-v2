'use client'
import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'

type I18n = { es?: string; en?: string }
type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select'
type Field = {
  id: string
  type: FieldType
  label: I18n
  placeholder: I18n
  required: boolean
  options: string
}
type Settings = {
  eyebrow?: I18n; title?: I18n; subtitle?: I18n
  submitLabel?: I18n; successMessage?: I18n
  toEmail?: string; bg?: string; fields?: Field[]
}

interface CustomFormSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

const BG: Record<string, string> = { white: 'bg-white', light: 'bg-[#eaeeef]', navy: 'bg-[#051c33]' }
const inputCls = 'w-full px-4 py-3 border border-[#8b9fb3]/30 rounded-xl text-sm focus:outline-none focus:border-[#051c33] bg-white font-body'

export function CustomFormSection({ locale = 'es', settings = {} }: CustomFormSectionProps) {
  const s = settings as Settings
  const loc = locale as 'es' | 'en'
  const isNavy = s.bg === 'navy'

  const fields = (s.fields ?? []) as Field[]
  const [values, setValues] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eyebrow  = s.eyebrow?.[loc]  || s.eyebrow?.es  || ''
  const title    = s.title?.[loc]    || s.title?.es    || ''
  const subtitle = s.subtitle?.[loc] || s.subtitle?.es || ''
  const submitLabel   = s.submitLabel?.[loc]    || s.submitLabel?.es    || (loc === 'en' ? 'Send message' : 'Enviar mensaje')
  const successMessage = s.successMessage?.[loc] || s.successMessage?.es || (loc === 'en' ? 'Thank you! We will contact you soon.' : '¡Gracias! Te contactaremos pronto.')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/custom-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, values, toEmail: s.toEmail, title: title }),
      })
      if (!res.ok) throw new Error('Error al enviar')
      setSent(true)
    } catch {
      setError(loc === 'en' ? 'Error sending. Please try again.' : 'Error al enviar. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (fields.length === 0) return null

  return (
    <section className={`${BG[s.bg ?? 'white']} py-16 px-6 md:px-12`}>
      <div className="container mx-auto max-w-2xl">
        {(eyebrow || title || subtitle) && (
          <div className="mb-10">
            <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} centered light={isNavy} />
          </div>
        )}

        {sent ? (
          <div className={`text-center py-12 rounded-2xl ${isNavy ? 'bg-white/10' : 'bg-[#051c33]/5'}`}>
            <p className="text-4xl mb-4">✅</p>
            <p className={`font-body text-lg ${isNavy ? 'text-white' : 'text-[#051c33]'}`}>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => {
              const label = field.label?.[loc] || field.label?.es || ''
              const placeholder = field.placeholder?.[loc] || field.placeholder?.es || ''
              const options = field.options ? field.options.split(',').map(o => o.trim()).filter(Boolean) : []

              return (
                <div key={field.id}>
                  {label && (
                    <label className={`block text-sm font-medium mb-1 ${isNavy ? 'text-white/80' : 'text-[#051c33]'}`}>
                      {label}{field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                  )}
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      placeholder={placeholder}
                      required={field.required}
                      value={values[field.id] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                      className={inputCls}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={values[field.id] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                      className={inputCls}
                    >
                      <option value="">{placeholder || (loc === 'en' ? 'Select an option' : 'Selecciona una opción')}</option>
                      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                      placeholder={placeholder}
                      required={field.required}
                      value={values[field.id] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                      className={inputCls}
                    />
                  )}
                </div>
              )
            })}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className={`w-full py-3 font-medium rounded-xl disabled:opacity-60 transition-colors font-body text-sm mt-2 ${isNavy ? 'bg-white text-[#051c33] hover:bg-white/90' : 'bg-[#051c33] text-white hover:bg-[#051c33]/90'}`}
            >
              {sending ? (loc === 'en' ? 'Sending...' : 'Enviando...') : submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
