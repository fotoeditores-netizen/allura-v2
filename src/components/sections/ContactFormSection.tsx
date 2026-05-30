import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContactForm } from '@/app/[locale]/contacto/ContactForm'
import { getSiteSettings, buildWhatsAppUrl } from '@/lib/getSiteSettings'
import { getTranslations } from 'next-intl/server'

type I18n = { es?: string; en?: string }

interface ContactFormSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

export async function ContactFormSection({ locale = 'es', settings = {} }: ContactFormSectionProps) {
  const t = await getTranslations({ locale, namespace: 'contacto' })
  const siteSettings = await getSiteSettings()
  const loc = locale as 'es' | 'en'
  const s = settings as { eyebrow?: I18n; title?: I18n; subtitle?: I18n }

  const eyebrow = s.eyebrow?.[loc] || s.eyebrow?.es || t('heroEyebrow')
  const title = s.title?.[loc] || s.title?.es || t('heroTitle')
  const contactEmail = siteSettings?.contactEmail || 'contact@allurahealthcare.com'
  const whatsappUrl = buildWhatsAppUrl(siteSettings, loc)

  return (
    <section className="section-padding bg-brand-light/30">
      <div className="container-allura">
        <SectionHeading eyebrow={eyebrow} title={title} centered />
        <div className="mt-12">
          <ContactForm contactEmail={contactEmail} whatsappUrl={whatsappUrl} />
        </div>
      </div>
    </section>
  )
}
