import { getFaqs } from '@/lib/supabase/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getTranslations } from 'next-intl/server'

type I18n = { es?: string; en?: string }

interface FaqSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

export async function FaqSection({ locale = 'es', settings = {} }: FaqSectionProps) {
  const t = await getTranslations({ locale, namespace: 'faq' })
  const faqs = await getFaqs()
  const loc = locale as 'es' | 'en'
  const s = settings as { eyebrow?: I18n; title?: I18n }

  const eyebrow = s.eyebrow?.[loc] || s.eyebrow?.es || t('eyebrow')
  const title = s.title?.[loc] || s.title?.es || t('title')

  if (faqs.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-allura max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={title} centered />
        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-brand-navy/10 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-heading text-brand-navy text-base select-none list-none">
                <span>{locale === 'en' ? (faq.question as any)?.en || faq.question : (faq.question as any)?.es || faq.question}</span>
                <span className="text-brand-blue group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ml-4">▾</span>
              </summary>
              <div className="px-6 pb-5 font-body text-sm text-brand-silver leading-relaxed">
                {locale === 'en' ? (faq.answer as any)?.en || faq.answer : (faq.answer as any)?.es || faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
