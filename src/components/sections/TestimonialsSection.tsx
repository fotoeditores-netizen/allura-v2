import { getTestimonials } from '@/lib/supabase/content'
import { TestimonialsCarousel } from '@/components/ui/TestimonialsCarousel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getTranslations } from 'next-intl/server'
import type { TestimonialItem } from '@/types/cms'

type I18n = { es?: string; en?: string }

interface TestimonialsSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

export async function TestimonialsSection({ locale = 'es', settings = {} }: TestimonialsSectionProps) {
  const t = await getTranslations({ locale, namespace: 'testimonials' })
  const raw = await getTestimonials()
  const loc = locale as 'es' | 'en'
  const s = settings as { eyebrow?: I18n; title?: I18n }

  const eyebrow = s.eyebrow?.[loc] || s.eyebrow?.es || t('eyebrow')
  const title = s.title?.[loc] || s.title?.es || t('title')

  if (raw.length === 0) return null

  const testimonials: TestimonialItem[] = raw.map(item => ({
    _id: item.id,
    patientName: item.authorName,
    patientOrigin: item.authorLocation ? { es: item.authorLocation, en: item.authorLocation } : undefined,
    quote: item.content as { es: string; en: string },
    rating: item.rating ?? 5,
    photo: item.photoUrl ? { asset: { url: item.photoUrl } } : undefined,
  }))

  return (
    <section className="section-padding bg-brand-light/30">
      <div className="container-allura">
        <SectionHeading eyebrow={eyebrow} title={title} centered />
        <div className="mt-12">
          <TestimonialsCarousel testimonials={testimonials} locale={locale} />
        </div>
      </div>
    </section>
  )
}
