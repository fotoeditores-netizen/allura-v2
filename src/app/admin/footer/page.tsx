'use client'
import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { Plus, Trash2, GripVertical } from 'lucide-react'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

// ─── Default values (lo que el footer muestra actualmente hardcodeado) ─────────
const DEFAULTS: Record<string, string> = {
  footer_slogan_es: 'Salud que inspira, Viajes que transforman',
  footer_slogan_en: 'Health that inspires, Journeys that transform',
  footer_brand_text_es: 'Turismo médico de excelencia en Medellín. Odontología premium y medicina facial estética con la calidez de Colombia.',
  footer_brand_text_en: 'Medical tourism excellence in Medellín. Premium dentistry and facial aesthetic medicine with Colombian warmth.',
  footer_wa_heading_es: '¿Podemos ayudarte?',
  footer_wa_heading_en: 'Can we help you?',
  footer_wa_sub_es: 'Nuestro equipo responde en menos de 24 horas.',
  footer_wa_sub_en: 'Our team responds in less than 24 hours.',
  footer_wa_cta_es: 'Hablar por WhatsApp',
  footer_wa_cta_en: 'Chat on WhatsApp',
  footer_nav_section_es: 'Navegación',
  footer_nav_section_en: 'Navigation',
  footer_services_section_es: 'Especialidades',
  footer_services_section_en: 'Specialties',
  footer_contact_section_es: 'Contacto',
  footer_contact_section_en: 'Contact',
  footer_location_es: 'Medellín, Colombia',
  footer_location_en: 'Medellín, Colombia',
  footer_wa_avail_es: 'WhatsApp disponible',
  footer_wa_avail_en: 'WhatsApp available',
  footer_copyright_es: 'Todos los derechos reservados.',
  footer_copyright_en: 'All rights reserved.',
  footer_legal_privacy_es: 'Políticas de privacidad',
  footer_legal_privacy_en: 'Privacy Policy',
  footer_legal_terms_es: 'Términos y Condiciones',
  footer_legal_terms_en: 'Terms & Conditions',
  footer_legal_medical_es: 'Aviso Médico Legal',
  footer_legal_medical_en: 'Medical Disclaimer',
  footer_legal_access_es: 'Declaración de accesibilidad',
  footer_legal_access_en: 'Accessibility Statement',
  footer_nav_items_es: JSON.stringify([
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Sobre nosotros', href: '/nosotros' },
    { label: 'Equipo', href: '/equipo' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contáctanos', href: '/contacto' },
  ]),
  footer_nav_items_en: JSON.stringify([
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/como-funciona' },
    { label: 'Services', href: '/servicios' },
    { label: 'About Us', href: '/nosotros' },
    { label: 'Team', href: '/equipo' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contacto' },
  ]),
  footer_service_items: JSON.stringify([
    { label: 'Full Mouth Reconstruction', href: '/servicios/full-mouth-reconstruction' },
    { label: 'Smile Makeover', href: '/servicios/smile-makeover' },
    { label: 'Allura Aligners', href: '/servicios/aligners' },
    { label: 'Facial Harmony', href: '/servicios/facial-harmony' },
  ]),
  footer_partners: JSON.stringify([
    { src: '/images/imagenes_web/logo-muvon-travel.png', alt: 'Muvon Travel' },
    { src: '/images/imagenes_web/logo-maskart.png', alt: 'Maskart' },
    { src: '/images/imagenes_web/logo-odontologia-de-precision.png', alt: 'Odontología de Precisión' },
    { src: '/images/imagenes_web/logo-orto-rio.png', alt: 'Orto Río' },
  ]),
  footer_quality_logos: JSON.stringify([
    { src: '/images/imagenes_web/ITI-transparent-logo.png', alt: 'ITI – International Team for Implantology' },
    { src: '/images/imagenes_web/sco-sociedad-colombiana-de-ortodoncia.png', alt: 'SCO – Sociedad Colombiana de Ortodoncia' },
    { src: '/images/imagenes_web/asociacion-colombiana-de-prostodoncia.png', alt: 'Asociación Colombiana de Prostodoncia' },
    { src: '/images/imagenes_web/american-association-of-orthodondists.png', alt: 'American Association of Orthodontists' },
    { src: '/images/imagenes_web/world-federation-of-orthodontists.png', alt: 'World Federation of Orthodontists' },
    { src: '/images/imagenes_web/ProColombia.png', alt: 'ProColombia' },
    { src: '/images/imagenes_web/greater-medellin-convention-&-visitors-bureau.png', alt: 'Greater Medellín Convention & Visitors Bureau' },
    { src: '/images/imagenes_web/anato-antioquia-choco.png', alt: 'ANATO Antioquia Chocó' },
    { src: '/images/imagenes_web/marca-pais-colombia.png', alt: 'Marca País Colombia' },
  ]),
}

type LinkItem = { label: string; href: string }
type LogoItem = { src: string; alt: string }

function parseJson<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

// ─── Reusable sub-editors ──────────────────────────────────────────────────────

function LinkEditor({ items, onChange }: { items: LinkItem[]; onChange: (v: LinkItem[]) => void }) {
  const add = () => onChange([...items, { label: '', href: '' }])
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const update = (i: number, field: keyof LinkItem, val: string) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: val }
    onChange(next)
  }
  const inp = 'border border-[#8b9fb3]/40 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#051c33] bg-white'
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
          <input value={item.label} onChange={e => update(i, 'label', e.target.value)} placeholder="Texto" className={inp + ' flex-1'} />
          <input value={item.href} onChange={e => update(i, 'href', e.target.value)} placeholder="/ruta" className={inp + ' flex-1 font-mono text-xs'} />
          <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-[#051c33] hover:underline mt-1">
        <Plus size={13} /> Agregar enlace
      </button>
    </div>
  )
}

function LogoEditor({ items, onChange }: { items: LogoItem[]; onChange: (v: LogoItem[]) => void }) {
  const add = () => onChange([...items, { src: '', alt: '' }])
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const update = (i: number, field: keyof LogoItem, val: string) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: val }
    onChange(next)
  }
  const inp = 'border border-[#8b9fb3]/40 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#051c33] bg-white'
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Logo {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
              <Trash2 size={13} />
            </button>
          </div>
          {item.src && (
            <img src={item.src} alt={item.alt || 'logo'} className="h-10 object-contain mb-1" onError={e => (e.currentTarget.style.display = 'none')} />
          )}
          <input value={item.src} onChange={e => update(i, 'src', e.target.value)} placeholder="/images/logo.png" className={inp + ' w-full font-mono text-xs'} />
          <input value={item.alt} onChange={e => update(i, 'alt', e.target.value)} placeholder="Nombre del aliado" className={inp + ' w-full'} />
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-[#051c33] hover:underline">
        <Plus size={13} /> Agregar logo
      </button>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function FooterEditorPage() {
  const [values, setValues] = useState<Record<string, string>>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    supabase
      .from('site_settings')
      .select('key, value')
      .eq('site_id', SITE_ID)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = { ...DEFAULTS }
          data.forEach((r: any) => {
            const v = typeof r.value === 'string' ? r.value : JSON.stringify(r.value)
            if (v && v !== '' && v !== 'null') map[r.key] = v
          })
          setValues(map)
        }
        setLoading(false)
      })
  }, [])

  const set = (key: string, val: string) => setValues(v => ({ ...v, [key]: val }))
  const setJson = (key: string, val: unknown) => set(key, JSON.stringify(val))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createBrowserSupabaseClient()
    // Only upsert entries that have a non-empty value to avoid wiping existing DB data
    const upserts = Object.entries(values)
      .filter(([, value]) => value !== '' && value !== null && value !== undefined)
      .map(([key, value]) => ({
        site_id: SITE_ID,
        key,
        value,
        updated_at: new Date().toISOString(),
      }))
    await supabase.from('site_settings').upsert(upserts, { onConflict: 'site_id,key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inp = 'w-full border border-[#8b9fb3]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#051c33] bg-white'
  const label = (txt: string) => <label className="block text-sm font-medium text-[#051c33] mb-1">{txt}</label>
  const hint = (txt: string) => <p className="text-xs text-gray-400 mb-1">{txt}</p>

  if (loading) {
    return <div className="text-sm text-gray-400 p-8">Cargando configuración del footer...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#051c33]">Editor de Footer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edita todos los textos, enlaces, contacto e imágenes del pie de página del sitio.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl pb-12">

        {/* ── MARCA Y SLOGAN ── */}
        <Section title="Marca y Slogan">
          <Field label="Slogan (español)">
            <input value={values.footer_slogan_es ?? ''} onChange={e => set('footer_slogan_es', e.target.value)} className={inp} />
          </Field>
          <Field label="Slogan (inglés)">
            <input value={values.footer_slogan_en ?? ''} onChange={e => set('footer_slogan_en', e.target.value)} className={inp} />
          </Field>
          <Field label="Texto de marca (español)">
            <textarea value={values.footer_brand_text_es ?? ''} onChange={e => set('footer_brand_text_es', e.target.value)} rows={3} className={inp + ' resize-none'} />
          </Field>
          <Field label="Texto de marca (inglés)">
            <textarea value={values.footer_brand_text_en ?? ''} onChange={e => set('footer_brand_text_en', e.target.value)} rows={3} className={inp + ' resize-none'} />
          </Field>
        </Section>

        {/* ── CONTACTO Y REDES ── */}
        <Section title="Contacto y Redes Sociales">
          <Field label="Email de contacto">
            <input type="email" value={values.contact_email ?? ''} onChange={e => set('contact_email', e.target.value)} className={inp} />
          </Field>
          <Field label="WhatsApp (+57... o +1...)" hint="Solo el número, sin espacios ni guiones">
            <input value={values.whatsapp_number ?? ''} onChange={e => set('whatsapp_number', e.target.value)} className={inp} />
          </Field>
          <Field label="Dirección / Ciudad (español)">
            <input value={values.footer_location_es ?? ''} onChange={e => set('footer_location_es', e.target.value)} className={inp} />
          </Field>
          <Field label="Dirección / Ciudad (inglés)">
            <input value={values.footer_location_en ?? ''} onChange={e => set('footer_location_en', e.target.value)} className={inp} />
          </Field>
          <Field label="Texto disponibilidad WhatsApp (español)">
            <input value={values.footer_wa_avail_es ?? ''} onChange={e => set('footer_wa_avail_es', e.target.value)} className={inp} />
          </Field>
          <Field label="Texto disponibilidad WhatsApp (inglés)">
            <input value={values.footer_wa_avail_en ?? ''} onChange={e => set('footer_wa_avail_en', e.target.value)} className={inp} />
          </Field>
          <Field label="Instagram URL" hint="Ej: https://www.instagram.com/allurahealthcare">
            <input type="text" value={values.social_instagram ?? ''} onChange={e => set('social_instagram', e.target.value)} placeholder="https://www.instagram.com/..." className={inp} />
          </Field>
          <Field label="Facebook URL" hint="Ej: https://www.facebook.com/allurahealthcare">
            <input type="text" value={values.social_facebook ?? ''} onChange={e => set('social_facebook', e.target.value)} placeholder="https://www.facebook.com/..." className={inp} />
          </Field>
          <Field label="LinkedIn URL" hint="Ej: https://www.linkedin.com/company/allura">
            <input type="text" value={values.social_linkedin ?? ''} onChange={e => set('social_linkedin', e.target.value)} placeholder="https://www.linkedin.com/..." className={inp} />
          </Field>
        </Section>

        {/* ── BANNER WHATSAPP ── */}
        <Section title="Banner de WhatsApp (parte superior del footer)">
          <Field label="Título del banner (español)">
            <input value={values.footer_wa_heading_es ?? ''} onChange={e => set('footer_wa_heading_es', e.target.value)} className={inp} />
          </Field>
          <Field label="Título del banner (inglés)">
            <input value={values.footer_wa_heading_en ?? ''} onChange={e => set('footer_wa_heading_en', e.target.value)} className={inp} />
          </Field>
          <Field label="Subtítulo (español)">
            <input value={values.footer_wa_sub_es ?? ''} onChange={e => set('footer_wa_sub_es', e.target.value)} className={inp} />
          </Field>
          <Field label="Subtítulo (inglés)">
            <input value={values.footer_wa_sub_en ?? ''} onChange={e => set('footer_wa_sub_en', e.target.value)} className={inp} />
          </Field>
          <Field label="Texto del botón (español)">
            <input value={values.footer_wa_cta_es ?? ''} onChange={e => set('footer_wa_cta_es', e.target.value)} className={inp} />
          </Field>
          <Field label="Texto del botón (inglés)">
            <input value={values.footer_wa_cta_en ?? ''} onChange={e => set('footer_wa_cta_en', e.target.value)} className={inp} />
          </Field>
        </Section>

        {/* ── TÍTULOS DE COLUMNAS ── */}
        <Section title="Títulos de columnas del footer">
          <div className="grid grid-cols-2 gap-3">
            <Field label="'Navegación' (español)">
              <input value={values.footer_nav_section_es ?? ''} onChange={e => set('footer_nav_section_es', e.target.value)} className={inp} />
            </Field>
            <Field label="'Navigation' (inglés)">
              <input value={values.footer_nav_section_en ?? ''} onChange={e => set('footer_nav_section_en', e.target.value)} className={inp} />
            </Field>
            <Field label="'Especialidades' (español)">
              <input value={values.footer_services_section_es ?? ''} onChange={e => set('footer_services_section_es', e.target.value)} className={inp} />
            </Field>
            <Field label="'Specialties' (inglés)">
              <input value={values.footer_services_section_en ?? ''} onChange={e => set('footer_services_section_en', e.target.value)} className={inp} />
            </Field>
            <Field label="'Contacto' (español)">
              <input value={values.footer_contact_section_es ?? ''} onChange={e => set('footer_contact_section_es', e.target.value)} className={inp} />
            </Field>
            <Field label="'Contact' (inglés)">
              <input value={values.footer_contact_section_en ?? ''} onChange={e => set('footer_contact_section_en', e.target.value)} className={inp} />
            </Field>
          </div>
        </Section>

        {/* ── NAVEGACIÓN ── */}
        <Section title="Links de Navegación (español)">
          <LinkEditor
            items={parseJson<LinkItem[]>(values.footer_nav_items_es, [])}
            onChange={v => setJson('footer_nav_items_es', v)}
          />
        </Section>
        <Section title="Links de Navegación (inglés)">
          <LinkEditor
            items={parseJson<LinkItem[]>(values.footer_nav_items_en, [])}
            onChange={v => setJson('footer_nav_items_en', v)}
          />
        </Section>

        {/* ── ESPECIALIDADES ── */}
        <Section title="Links de Especialidades (mismo en ambos idiomas)">
          <LinkEditor
            items={parseJson<LinkItem[]>(values.footer_service_items, [])}
            onChange={v => setJson('footer_service_items', v)}
          />
        </Section>

        {/* ── LEGAL / PIE DE PÁGINA ── */}
        <Section title="Pie de página y Legal">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Copyright (español)">
              <input value={values.footer_copyright_es ?? ''} onChange={e => set('footer_copyright_es', e.target.value)} className={inp} />
            </Field>
            <Field label="Copyright (inglés)">
              <input value={values.footer_copyright_en ?? ''} onChange={e => set('footer_copyright_en', e.target.value)} className={inp} />
            </Field>
            <Field label="'Políticas de privacidad' (español)">
              <input value={values.footer_legal_privacy_es ?? ''} onChange={e => set('footer_legal_privacy_es', e.target.value)} className={inp} />
            </Field>
            <Field label="'Privacy Policy' (inglés)">
              <input value={values.footer_legal_privacy_en ?? ''} onChange={e => set('footer_legal_privacy_en', e.target.value)} className={inp} />
            </Field>
            <Field label="'Términos y Condiciones' (español)">
              <input value={values.footer_legal_terms_es ?? ''} onChange={e => set('footer_legal_terms_es', e.target.value)} className={inp} />
            </Field>
            <Field label="'Terms & Conditions' (inglés)">
              <input value={values.footer_legal_terms_en ?? ''} onChange={e => set('footer_legal_terms_en', e.target.value)} className={inp} />
            </Field>
            <Field label="'Aviso Médico Legal' (español)">
              <input value={values.footer_legal_medical_es ?? ''} onChange={e => set('footer_legal_medical_es', e.target.value)} className={inp} />
            </Field>
            <Field label="'Medical Disclaimer' (inglés)">
              <input value={values.footer_legal_medical_en ?? ''} onChange={e => set('footer_legal_medical_en', e.target.value)} className={inp} />
            </Field>
            <Field label="'Declaración de accesibilidad' (español)">
              <input value={values.footer_legal_access_es ?? ''} onChange={e => set('footer_legal_access_es', e.target.value)} className={inp} />
            </Field>
            <Field label="'Accessibility Statement' (inglés)">
              <input value={values.footer_legal_access_en ?? ''} onChange={e => set('footer_legal_access_en', e.target.value)} className={inp} />
            </Field>
          </div>
        </Section>

        {/* ── ALIADOS (logos fijos) ── */}
        <Section title="Nuestros Aliados (logos fijos)" hint="Ruta de imagen relativa a /public, ej: /images/imagenes_web/logo.png">
          <LogoEditor
            items={parseJson<LogoItem[]>(values.footer_partners, [])}
            onChange={v => setJson('footer_partners', v)}
          />
        </Section>

        {/* ── SLIDER CALIDAD ── */}
        <Section title="Comprometidos con la Calidad (slider animado)" hint="Ruta de imagen relativa a /public, ej: /images/imagenes_web/logo.png">
          <LogoEditor
            items={parseJson<LogoItem[]>(values.footer_quality_logos, [])}
            onChange={v => setJson('footer_quality_logos', v)}
          />
        </Section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#051c33] text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#051c33]/90 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">✅ Guardado correctamente</span>}
        </div>
      </form>
    </div>
  )
}

// ─── Layout helpers ────────────────────────────────────────────────────────────
function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-semibold text-[#051c33] uppercase tracking-wide">{title}</h2>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label: lbl, hint: h, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#051c33] mb-1">{lbl}</label>
      {h && <p className="text-xs text-gray-400 mb-1">{h}</p>}
      {children}
    </div>
  )
}
