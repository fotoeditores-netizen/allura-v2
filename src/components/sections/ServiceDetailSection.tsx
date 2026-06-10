import { Link } from '@/navigation'
import { ChevronRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CTABanner } from '@/components/sections/CTABanner'
import { getSiteSettings, buildWhatsAppUrl } from '@/lib/getSiteSettings'

type I18n = { es?: string; en?: string }
type Step = { title?: I18n; description?: I18n }
type Settings = {
  category?: I18n
  categorySlug?: string
  title?: I18n
  description?: I18n
  benefits?: I18n[]
  steps?: Step[]
  candidates?: I18n[]
  timeline?: I18n
  whyBody?: I18n
}

interface Props {
  locale?: string
  settings?: Record<string, unknown>
}

export async function ServiceDetailSection({ locale = 'es', settings = {} }: Props) {
  const s = settings as Settings
  const loc = locale as 'es' | 'en'
  const siteSettings = await getSiteSettings()
  const whatsappUrl = buildWhatsAppUrl(siteSettings, loc)

  const category     = s.category?.[loc]     || s.category?.es     || ''
  const categorySlug = s.categorySlug        || ''
  const title        = s.title?.[loc]        || s.title?.es        || ''
  const description  = s.description?.[loc]  || s.description?.es  || ''
  const timeline     = s.timeline?.[loc]     || s.timeline?.es     || ''
  const whyBody      = s.whyBody?.[loc]      || s.whyBody?.es      || ''
  const benefits     = (s.benefits  ?? []) as I18n[]
  const steps        = (s.steps     ?? []) as Step[]
  const candidates   = (s.candidates ?? []) as I18n[]

  return (
    <>
      {/* Hero */}
      <section className="bg-[#051c33] pt-40 pb-20 px-6 md:px-12">
        <div className="container-allura">
          {categorySlug && category && (
            <nav className="flex items-center gap-2 font-body text-xs text-white/50 mb-8">
              <Link href="/servicios" className="hover:text-white transition-colors">{loc === 'en' ? 'Services' : 'Servicios'}</Link>
              <ChevronRight size={12} />
              <Link href={`/servicios/${categorySlug}`} className="hover:text-white transition-colors">{category}</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">{title}</span>
            </nav>
          )}
          <div className="max-w-2xl">
            {category && <p className="font-body text-xs tracking-[0.2em] uppercase text-[#8b9fb3] mb-4">{category}</p>}
            {title && <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">{title}</h1>}
            {description && <p className="font-body text-base text-white/70 leading-relaxed mb-10">{description}</p>}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-normal text-sm hover:bg-[#22c55e] transition-colors">
              {loc === 'en' ? 'Book via WhatsApp' : 'Agenda por WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="container-allura">
            <SectionHeading
              eyebrow={loc === 'en' ? 'Benefits' : 'Beneficios'}
              title={loc === 'en' ? 'What will you achieve with this treatment?' : '¿Qué lograrás con este tratamiento?'}
            />
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              {benefits.map((b, i) => {
                const text = b[loc] || b.es || ''
                return text ? (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[#8b9fb3] flex-shrink-0" />
                    <p className="font-body text-sm text-[#051c33] leading-relaxed">{text}</p>
                  </li>
                ) : null
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Process */}
      {steps.length > 0 && (
        <section className="py-16 px-6 md:px-12 bg-[#eaeeef]">
          <div className="container-allura">
            <SectionHeading
              eyebrow={loc === 'en' ? 'Process' : 'Proceso'}
              title={loc === 'en' ? 'How does it work?' : '¿Cómo funciona?'}
              centered
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {steps.map((step, i) => {
                const stepTitle = step.title?.[loc] || step.title?.es || ''
                const stepDesc  = step.description?.[loc] || step.description?.es || ''
                return (
                  <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-[#eaeeef]">
                    <p className="font-heading text-3xl text-[#8b9fb3]/40 mb-3">0{i + 1}</p>
                    {stepTitle && <h3 className="font-heading text-lg text-[#051c33] mb-2">{stepTitle}</h3>}
                    {stepDesc  && <p className="font-body text-sm text-[#abacae] leading-relaxed">{stepDesc}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Candidates + Timeline */}
      {(candidates.length > 0 || timeline) && (
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-14">
            {candidates.length > 0 && (
              <div>
                <SectionHeading
                eyebrow={loc === 'en' ? 'Who is it for?' : '¿Para quién es?'}
                title={loc === 'en' ? 'Ideal candidates' : 'Candidatos ideales'}
              />
                <ul className="mt-8 space-y-3">
                  {candidates.map((c, i) => {
                    const text = c[loc] || c.es || ''
                    return text ? (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#8b9fb3] flex-shrink-0" />
                        <p className="font-body text-sm text-[#051c33]">{text}</p>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            )}
            {timeline && (
              <div>
                <SectionHeading
                eyebrow={loc === 'en' ? 'Duration' : 'Duración'}
                title={loc === 'en' ? 'How long does it take?' : '¿Cuánto tiempo toma?'}
              />
                <div className="mt-8 bg-[#eaeeef] rounded-2xl p-7">
                  <p className="font-body text-base text-[#051c33] leading-relaxed">{timeline}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why Allura */}
      {whyBody && (
        <section className="py-16 px-6 md:px-12 bg-[#051c33]">
          <div className="container-allura text-center max-w-2xl mx-auto">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-[#8b9fb3] mb-4">{loc === 'en' ? 'Why Allura' : 'Por qué Allura'}</p>
            <h2 className="font-heading text-3xl text-white mb-6">{loc === 'en' ? 'Your health in the best hands' : 'Tu salud en las mejores manos'}</h2>
            <p className="font-body text-[#abacae] leading-relaxed mb-10">{whyBody}</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-normal text-sm hover:bg-[#22c55e] transition-colors">
              {loc === 'en' ? 'Book via WhatsApp' : 'Agenda por WhatsApp'}
            </a>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  )
}
