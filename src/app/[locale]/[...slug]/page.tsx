import { notFound } from 'next/navigation'
import { getPageBySlug, getSectionsByPage, type SectionRow } from '@/lib/supabase/pages'
import { HeroSection } from '@/components/sections/HeroSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { AboutTeaser } from '@/components/sections/AboutTeaser'
import { MedellinSection } from '@/components/sections/MedellinSection'
import { TeamPreview } from '@/components/sections/TeamPreview'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { TextImageSection } from '@/components/sections/TextImageSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { ContactFormSection } from '@/components/sections/ContactFormSection'
import { CustomSection } from '@/components/sections/CustomSection'
import { CardsGridSection } from '@/components/sections/CardsGridSection'
import { CustomFormSection } from '@/components/sections/CustomFormSection'
import { PageHeaderSection } from '@/components/sections/PageHeaderSection'
import { SocialLinksSection } from '@/components/sections/SocialLinksSection'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

function renderSection(section: SectionRow, locale: string) {
  if (!section.is_visible) return null
  const s = section.settings ?? {}
  switch (section.type) {
    case 'hero':          return <HeroSection key={section.id} locale={locale} settings={s} />
    case 'benefits':      return <BenefitsSection key={section.id} locale={locale} settings={s} />
    case 'services_grid': return <ServicesPreview key={section.id} locale={locale} settings={s} />
    case 'about_teaser':  return <AboutTeaser key={section.id} locale={locale} settings={s} />
    case 'medellin':      return <MedellinSection key={section.id} locale={locale} settings={s} />
    case 'team_preview':  return <TeamPreview key={section.id} locale={locale} settings={s} />
    case 'process':       return <ProcessSection key={section.id} locale={locale} settings={s} />
    case 'cta':           return <CTABanner key={section.id} locale={locale} settings={s} />
    case 'text_image':    return <TextImageSection key={section.id} locale={locale} settings={s} />
    case 'testimonials':  return <TestimonialsSection key={section.id} locale={locale} settings={s} />
    case 'faq':           return <FaqSection key={section.id} locale={locale} settings={s} />
    case 'contact_form':  return <ContactFormSection key={section.id} locale={locale} settings={s} />
    case 'cards_grid':    return <CardsGridSection key={section.id} locale={locale} settings={s} />
    case 'custom_form':   return <CustomFormSection key={section.id} locale={locale} settings={s} />
    case 'page_header':   return <PageHeaderSection key={section.id} locale={locale} settings={s} />
    case 'social_links':  return <SocialLinksSection key={section.id} locale={locale} settings={s} />
    case 'custom':        return <CustomSection key={section.id} locale={locale} settings={s} />
    default:              return null
  }
}

export default async function CustomPage({
  params,
}: {
  params: { locale: string; slug: string[] }
}) {
  const locale = params.locale
  const slug = '/' + params.slug.join('/')

  const page = await getPageBySlug(slug)
  if (!page || page.status !== 'published') notFound()

  const sections = await getSectionsByPage(page.id)
  const rendered = sections
    .filter(s => s.is_visible)
    .map(s => renderSection(s, locale))
    .filter(Boolean)

  if (rendered.length === 0) notFound()

  return (
    <div className="pt-24">
      {rendered}
    </div>
  )
}
