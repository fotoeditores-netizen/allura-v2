import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

/**
 * Claves de site_settings usadas por el Centro de Integraciones.
 * Una fila por clave (mismo patron que el resto del admin).
 */
export const INTEGRATION_KEYS = {
  // Analytics y tracking
  gtm_container_id: '',
  ga_measurement_id: '',
  google_search_console: '',
  google_ads_id: '',
  meta_pixel_id: '',
  tiktok_pixel_id: '',
  hotjar_id: '',
  clarity_id: '',
  // WhatsApp (un solo numero, como esta hoy)
  whatsapp_number: '',
  whatsapp_message: '',
  // Email / Resend (SMTP sigue via env vars como respaldo)
  email_to: '',
  email_from: '',
  resend_api_key: '',
  // HubSpot CRM (Fase 1: solo se guardan; conexion real pendiente)
  hubspot_portal_id: '',
  hubspot_token: '',
  hubspot_owner_medellin: '',
  hubspot_owner_rionegro: '',
  hubspot_pipeline_id: '',
  hubspot_stage_id: '',
} as const

export type IntegrationKey = keyof typeof INTEGRATION_KEYS

export interface TrackingConfig {
  gtmContainerId: string
  gaMeasurementId: string
  googleSearchConsole: string
  googleAdsId: string
  metaPixelId: string
  tiktokPixelId: string
  hotjarId: string
  clarityId: string
}

export interface WhatsAppConfig {
  number: string
  message: string
}

export interface EmailConfig {
  to: string
  from: string
  resendApiKey: string
}

export interface HubSpotConfig {
  portalId: string
  token: string
  ownerMedellin: string
  ownerRionegro: string
  pipelineId: string
  stageId: string
}

export interface AllIntegrations {
  tracking: TrackingConfig
  whatsapp: WhatsAppConfig
  email: EmailConfig
  hubspot: HubSpotConfig
}

function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/** Lee todas las claves de integraciones desde site_settings. */
async function readSettings(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('site_id', SITE_ID)
    .in('key', Object.keys(INTEGRATION_KEYS))

  if (error || !data) return {}
  return Object.fromEntries(
    data.map((r: { key: string; value: unknown }) => [
      r.key,
      typeof r.value === 'string' ? r.value : String(r.value ?? ''),
    ])
  )
}

/** Marcador para secretos ya configurados: no se expone el valor real al cliente. */
export const SECRET_SET = '__SET__'

export async function getAllIntegrations(): Promise<AllIntegrations> {
  const m = await readSettings()
  const redact = (v: string | undefined) => (v && v.length > 0 ? SECRET_SET : '')
  return {
    tracking: {
      gtmContainerId: m.gtm_container_id ?? '',
      gaMeasurementId: m.ga_measurement_id ?? '',
      googleSearchConsole: m.google_search_console ?? '',
      googleAdsId: m.google_ads_id ?? '',
      metaPixelId: m.meta_pixel_id ?? '',
      tiktokPixelId: m.tiktok_pixel_id ?? '',
      hotjarId: m.hotjar_id ?? '',
      clarityId: m.clarity_id ?? '',
    },
    whatsapp: {
      number: m.whatsapp_number ?? '',
      message: m.whatsapp_message ?? '',
    },
    email: {
      to: m.email_to ?? '',
      from: m.email_from ?? '',
      resendApiKey: redact(m.resend_api_key),
    },
    hubspot: {
      portalId: m.hubspot_portal_id ?? '',
      token: redact(m.hubspot_token),
      ownerMedellin: m.hubspot_owner_medellin ?? '',
      ownerRionegro: m.hubspot_owner_rionegro ?? '',
      pipelineId: m.hubspot_pipeline_id ?? '',
      stageId: m.hubspot_stage_id ?? '',
    },
  }
}

/** Helper enfocado para el envio de correo (usado por /api/contact). */
export async function getEmailConfig(): Promise<EmailConfig> {
  const m = await readSettings()
  return {
    to: m.email_to ?? '',
    from: m.email_from ?? '',
    resendApiKey: m.resend_api_key ?? '',
  }
}
