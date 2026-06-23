'use client'

import { useState } from 'react'
import { ExternalLink, Check, MessageCircle } from 'lucide-react'
import { SECRET_SET, type AllIntegrations } from '@/lib/integrations'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

type FieldDef = {
  key: string
  label: string
  hint?: string
  doc?: { label: string; url: string }
  placeholder?: string
  secret?: boolean
}

const TRACKING_FIELDS: FieldDef[] = [
  { key: 'gtm_container_id', label: 'Google Tag Manager (GTM-…)', placeholder: 'GTM-XXXXXXX', hint: 'Si lo configuras, tiene prioridad sobre GA4 directo.', doc: { label: 'Tag Manager', url: 'https://tagmanager.google.com/' } },
  { key: 'ga_measurement_id', label: 'Google Analytics 4 (G-…)', placeholder: 'G-XXXXXXXXXX', doc: { label: 'Analytics', url: 'https://analytics.google.com/' } },
  { key: 'google_search_console', label: 'Google Search Console (verificación)', placeholder: 'código content="…"', hint: 'Método "Etiqueta HTML": pega solo el valor de content.', doc: { label: 'Search Console', url: 'https://search.google.com/search-console' } },
  { key: 'google_ads_id', label: 'Google Ads (AW-…)', placeholder: 'AW-XXXXXXXXX', doc: { label: 'Google Ads', url: 'https://ads.google.com/' } },
  { key: 'meta_pixel_id', label: 'Meta Pixel (Facebook/Instagram)', placeholder: 'solo números', doc: { label: 'Meta Events Manager', url: 'https://business.facebook.com/events_manager' } },
  { key: 'tiktok_pixel_id', label: 'TikTok Pixel', placeholder: 'ID del pixel', doc: { label: 'TikTok Ads', url: 'https://ads.tiktok.com/' } },
  { key: 'hotjar_id', label: 'Hotjar ID', placeholder: 'Site ID', doc: { label: 'Hotjar', url: 'https://www.hotjar.com/' } },
  { key: 'clarity_id', label: 'Microsoft Clarity (gratis)', placeholder: 'Project ID', hint: 'Gratis: mapas de calor y grabaciones. Muy recomendado.', doc: { label: 'Clarity', url: 'https://clarity.microsoft.com/' } },
]

const EMAIL_FIELDS: FieldDef[] = [
  { key: 'email_to', label: 'Email(s) de destino', placeholder: 'correo1@…, correo2@…', hint: 'Separa varios correos con coma. Si se deja vacío, se usa el email de contacto del sitio.' },
  { key: 'email_from', label: 'Dirección remitente', placeholder: 'Allura <info@tudominio.com>', hint: 'Con Resend, el dominio debe estar verificado.' },
  { key: 'resend_api_key', label: 'API Key de Resend', placeholder: 're_…', secret: true, hint: 'Si la pones, el sitio enviará con Resend. Si la dejas vacía, sigue usando el SMTP actual.', doc: { label: 'Resend API Keys', url: 'https://resend.com/api-keys' } },
]

const HUBSPOT_FIELDS: FieldDef[] = [
  { key: 'hubspot_portal_id', label: 'Portal ID', placeholder: 'ej: 12345678' },
  { key: 'hubspot_token', label: 'Private App Token', placeholder: 'pat-…', secret: true },
  { key: 'hubspot_owner_medellin', label: 'Owner ID — Medellín', placeholder: 'ID del propietario' },
  { key: 'hubspot_owner_rionegro', label: 'Owner ID — Rionegro', placeholder: 'ID del propietario' },
  { key: 'hubspot_pipeline_id', label: 'Pipeline ID', placeholder: 'ID del pipeline' },
  { key: 'hubspot_stage_id', label: 'Etapa inicial (Stage ID)', placeholder: 'ID de la etapa' },
]

function flatten(initial: AllIntegrations): Record<string, string> {
  const t = initial.tracking
  const w = initial.whatsapp
  const e = initial.email
  const h = initial.hubspot
  return {
    gtm_container_id: t.gtmContainerId,
    ga_measurement_id: t.gaMeasurementId,
    google_search_console: t.googleSearchConsole,
    google_ads_id: t.googleAdsId,
    meta_pixel_id: t.metaPixelId,
    tiktok_pixel_id: t.tiktokPixelId,
    hotjar_id: t.hotjarId,
    clarity_id: t.clarityId,
    whatsapp_number: w.number,
    whatsapp_message: w.message,
    email_to: e.to,
    email_from: e.from,
    resend_api_key: e.resendApiKey,
    hubspot_portal_id: h.portalId,
    hubspot_token: h.token,
    hubspot_owner_medellin: h.ownerMedellin,
    hubspot_owner_rionegro: h.ownerRionegro,
    hubspot_pipeline_id: h.pipelineId,
    hubspot_stage_id: h.stageId,
  }
}

const SECRET_KEYS = ['resend_api_key', 'hubspot_token']

export function IntegracionesEditor({ initial }: { initial: AllIntegrations }) {
  const flat = flatten(initial)
  // Recuerda que secretos llegaban configurados (valor SECRET_SET), luego los limpia del estado.
  const [secretSet] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECRET_KEYS.map(k => [k, flat[k] === SECRET_SET]))
  )
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v = { ...flat }
    SECRET_KEYS.forEach(k => { if (v[k] === SECRET_SET) v[k] = '' })
    return v
  })
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const [errorSection, setErrorSection] = useState<{ section: string; msg: string } | null>(null)

  function setVal(key: string, v: string) {
    setValues(prev => ({ ...prev, [key]: v }))
  }

  async function saveSection(section: string, keys: string[]) {
    setSavingSection(section)
    setErrorSection(null)
    const upserts = keys
      // Para secretos ya configurados: si el usuario no escribio uno nuevo, no lo sobrescribas.
      .filter(key => !(SECRET_KEYS.includes(key) && secretSet[key] && (values[key] ?? '') === ''))
      .map(key => ({
        site_id: SITE_ID,
        key,
        value: values[key] ?? '',
        updated_at: new Date().toISOString(),
      }))
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upserts }),
      })
      const json = await res.json()
      if (!res.ok || json.error) {
        setErrorSection({ section, msg: json.error ?? 'Error desconocido' })
        setSavingSection(null)
        return
      }
      setSavingSection(null)
      setSavedSection(section)
      setTimeout(() => setSavedSection(s => (s === section ? null : s)), 3000)
    } catch (err) {
      setErrorSection({ section, msg: String(err) })
      setSavingSection(null)
    }
  }

  const filled = (key: string) => {
    if (SECRET_KEYS.includes(key) && secretSet[key]) return true
    return (values[key] ?? '').trim().length > 0
  }

  function Field({ f }: { f: FieldDef }) {
    const has = filled(f.key)
    const isConfiguredSecret = f.secret && secretSet[f.key]
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-[#051c33]">{f.label}</label>
          <Badge active={has} />
        </div>
        <input
          type={f.secret ? 'password' : 'text'}
          value={values[f.key] ?? ''}
          placeholder={isConfiguredSecret ? '•••••••• ya configurado (escribe para cambiar)' : f.placeholder}
          onChange={e => setVal(f.key, e.target.value)}
          className={
            'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ' +
            (has
              ? 'border-[#051c33] focus:border-[#051c33]'
              : 'border-[#8b9fb3]/40 focus:border-[#051c33]')
          }
        />
        <div className="flex items-center gap-3 mt-1">
          {f.hint && <p className="text-xs text-[#8b9fb3]">{f.hint}</p>}
          {f.doc && (
            <a
              href={f.doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#051c33] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            >
              {f.doc.label} <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    )
  }

  function SaveBar({ section, keys }: { section: string; keys: string[] }) {
    return (
      <div className="flex items-center gap-3 pt-2 flex-wrap border-t border-[#eaeeef] mt-2">
        <button
          type="button"
          onClick={() => saveSection(section, keys)}
          disabled={savingSection === section}
          className="bg-[#051c33] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50 mt-3"
        >
          {savingSection === section ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {savedSection === section && <span className="text-green-600 text-sm mt-3">✅ Guardado y sitio actualizado</span>}
        {errorSection?.section === section && <span className="text-red-600 text-sm mt-3">Error: {errorSection.msg}</span>}
      </div>
    )
  }

  // ── WhatsApp test link ──
  const waNumberClean = (values.whatsapp_number ?? '').replace(/\D/g, '')
  const waTestUrl = waNumberClean
    ? `https://wa.me/${waNumberClean}${values.whatsapp_message ? `?text=${encodeURIComponent(values.whatsapp_message)}` : ''}`
    : ''

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#051c33] mb-1">Centro de integraciones</h1>
      <p className="text-sm text-[#8b9fb3] mb-6">Conecta los servicios externos del sitio sin tocar código. Cada sección se guarda por separado.</p>

      <div className="space-y-6">
        {/* 📡 Analytics y tracking */}
        <Card title="📡 Analytics y tracking" subtitle="Códigos de medición. Se inyectan automáticamente en todas las páginas (solo en el sitio publicado).">
          {TRACKING_FIELDS.map(f => <Field key={f.key} f={f} />)}
          <SaveBar section="tracking" keys={TRACKING_FIELDS.map(f => f.key)} />
        </Card>

        {/* 💬 WhatsApp */}
        <Card title="💬 WhatsApp" subtitle="Número de contacto y mensaje prellenado.">
          <Field f={{ key: 'whatsapp_number', label: 'Número de WhatsApp', placeholder: '573001234567', hint: 'Formato internacional sin + ni espacios. Ej: 573001234567' }} />
          <Field f={{ key: 'whatsapp_message', label: 'Mensaje de bienvenida', placeholder: 'Hola, quiero información sobre…' }} />
          <div className="pt-1">
            {waTestUrl ? (
              <a
                href={waTestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm border border-[#051c33] text-[#051c33] rounded-lg px-4 py-2 hover:bg-[#051c33] hover:text-white transition-colors"
              >
                <MessageCircle size={15} /> Probar enlace de WhatsApp
              </a>
            ) : (
              <span className="text-xs text-[#8b9fb3]">Ingresa un número para probar el enlace.</span>
            )}
          </div>
          <SaveBar section="whatsapp" keys={['whatsapp_number', 'whatsapp_message']} />
        </Card>

        {/* ✉️ Email / Resend */}
        <Card title="✉️ Notificaciones por email" subtitle="A dónde llegan los leads del formulario. Si configuras Resend, se usa Resend; si no, sigue el envío actual por SMTP.">
          {EMAIL_FIELDS.map(f => <Field key={f.key} f={f} />)}
          <SaveBar section="email" keys={EMAIL_FIELDS.map(f => f.key)} />
        </Card>

        {/* 🟠 HubSpot CRM */}
        <Card title="🟠 HubSpot CRM" subtitle="Datos de conexión con HubSpot. (Por ahora se guardan; la sincronización automática de leads se activa en una fase posterior.)">
          {HUBSPOT_FIELDS.map(f => <Field key={f.key} f={f} />)}
          <SaveBar section="hubspot" keys={HUBSPOT_FIELDS.map(f => f.key)} />
        </Card>
      </div>
    </div>
  )
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="border-b border-[#eaeeef] pb-2">
        <h2 className="text-base font-semibold text-[#051c33]">{title}</h2>
        <p className="text-xs text-[#8b9fb3] mt-0.5">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function Badge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-100 rounded-full px-2 py-0.5">
      <Check size={11} /> Activo
    </span>
  ) : (
    <span className="inline-flex items-center text-[11px] font-medium text-[#8b9fb3] bg-[#eaeeef] rounded-full px-2 py-0.5">
      Sin configurar
    </span>
  )
}
