import { SectionHeading } from '@/components/ui/SectionHeading'
import { CTABanner } from '@/components/sections/CTABanner'
import { Button } from '@/components/ui/Button'
import { TestimonialsCarousel } from '@/components/ui/TestimonialsCarousel'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { getTranslations } from 'next-intl/server'
import type { TestimonialItem, FaqItem, VideoItem } from '@/sanity/lib/queries'
import { VideoCard } from '@/components/ui/VideoCard'
import { getSiteSettings, buildWhatsAppUrl } from '@/lib/getSiteSettings'

const stepImages = [
  '/images/imagenes_web/allura-healthcare-contacto-inicial-turismo-en-salud-premium.png',
  '/images/imagenes_web/allura-healthcare-consulta-virtual-especialista-turismo-en-salud.jpg',
  '/images/imagenes_web/allura-healthcare-reserva-organizacion-viaje-turismo-en-salud.jpg',
  '/images/imagenes_web/allura-healthcare-tratamiento-acompanamiento-in-situ-turismo-en-salud.png',
]

const faqPortableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-sm text-brand-silver leading-relaxed mb-3 last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-brand-navy">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-blue underline hover:text-brand-navy transition-colors"
      >
        {children}
      </a>
    ),
  },
}

interface ComoFuncionaTemplateProps {
  testimonials: TestimonialItem[]
  faqs: FaqItem[]
  videos: VideoItem[]
  locale: string
}

export async function ComoFuncionaTemplate({
  testimonials,
  faqs,
  videos,
  locale,
}: ComoFuncionaTemplateProps) {
  const t = await getTranslations('comoFunciona')
  const loc = locale as 'es' | 'en'
  const settings = await getSiteSettings()
  const whatsappUrl = buildWhatsAppUrl(settings, loc)

  const steps = t.raw('steps') as Array<{ number: string; title: string; description: string }>
  const hardcodedFaqs = t.raw('faqs') as Array<{ q: string; a: string }>

  const hasSanityFaqs = faqs.length > 0
  const hasTestimonials = testimonials.length > 0
  const hasVideos = videos.length > 0

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t('heroEyebrow')}
          title={t('heroTitle')}
          subtitle={t('heroSubtitle')}
          centered
          light
        />
      </section>

      {/* Steps */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="space-y-16">
            {steps.map(({ number, title, description }, i) => (
              <div
                key={number}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  i % 2 !== 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={i % 2 !== 0 ? 'md:order-2' : ''}>
                  <p className="font-heading text-6xl text-brand-blue/20 mb-4">{number}</p>
                  <h2 className="font-heading text-3xl text-brand-navy mb-4">{title}</h2>
                  <p className="font-body text-brand-silver leading-relaxed">{description}</p>
                </div>
                <div
                  className={`relative aspect-video rounded-2xl overflow-hidden ${
                    i % 2 !== 0 ? 'md:order-1' : ''
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${stepImages[i]}')` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura max-w-3xl">
          <SectionHeading
            eyebrow={t('faqLabel')}
            title={t('faqTitle')}
            centered
          />
          <div className="mt-12 space-y-6">
            {hasSanityFaqs
              ? faqs.map((faq) => {
                  const question = faq.question?.[loc] || faq.question?.es || ''
                  const answerBlocks = (faq.answer?.[loc] ??
                    faq.answer?.es ??
                    []) as PortableTextBlock[]
                  return (
                    <div
                      key={faq._id}
                      className="bg-white rounded-2xl p-7 shadow-sm border border-brand-light"
                    >
                      <h3 className="font-heading text-lg text-brand-navy mb-3">{question}</h3>
                      {answerBlocks.length > 0 && (
                        <PortableText
                          value={answerBlocks}
                          components={faqPortableTextComponents}
                        />
                      )}
                    </div>
                  )
                })
              : hardcodedFaqs.map(({ q, a }) => (
                  <div
                    key={q}
                    className="bg-white rounded-2xl p-7 shadow-sm border border-brand-light"
                  >
                    <h3 className="font-heading text-lg text-brand-navy mb-3">{q}</h3>
                    <p className="font-body text-sm text-brand-silver leading-relaxed">{a}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Testimonios — only rendered when Sanity has data */}
      {hasTestimonials && (
        <section className="section-padding bg-white">
          <div className="container-allura">
            <SectionHeading
              eyebrow={t('testimonialsEyebrow')}
              title={t('testimonialsTitle')}
              centered
            />
            <div className="mt-12">
              <TestimonialsCarousel testimonials={testimonials} locale={locale} />
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {hasVideos && (
        <section className="section-padding bg-brand-light">
          <div className="container-allura">
            <SectionHeading
              eyebrow={locale === 'en' ? 'Watch' : 'Ver'}
              title={locale === 'en' ? 'Videos' : 'Videos'}
              centered
            />
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA inline */}
      <section className="section-padding bg-white">
        <div className="container-allura text-center max-w-xl mx-auto">
          <SectionHeading
            eyebrow={t('ctaEyebrow')}
            title={t('ctaTitle')}
            subtitle={t('ctaSubtitle')}
            centered
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              {t('ctaWhatsapp')}
            </a>
            <Button href="/contacto" variant="primary">
              {t('ctaContact')}
            </Button>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
