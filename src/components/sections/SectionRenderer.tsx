import type { SectionRow } from '@/lib/supabase/pages'
import { HeroSection } from './HeroSection'
import { BenefitsSection } from './BenefitsSection'
import { ServicesPreview } from './ServicesPreview'
import { AboutTeaser } from './AboutTeaser'
import { MedellinSection } from './MedellinSection'
import { TeamPreview } from './TeamPreview'
import { ProcessSection } from './ProcessSection'
import { CTABanner } from './CTABanner'

interface SectionRendererProps {
  section: SectionRow
  locale: string
}

function hasContent(settings: Record<string, unknown>): boolean {
  if (!settings || Object.keys(settings).length === 0) return false
  // Check if at least one i18n field has non-empty Spanish content
  return Object.values(settings).some(v => {
    if (typeof v === 'object' && v !== null && 'es' in v) {
      return typeof (v as {es: unknown}).es === 'string' && (v as {es: string}).es.trim() !== ''
    }
    return false
  })
}

export async function SectionRenderer({ section, locale }: SectionRendererProps) {
  if (!section.is_visible) return null
  // If settings are empty or have no real content, skip and let the page fallback handle it
  if (!hasContent(section.settings)) return null
  const s = section.settings

  switch (section.type) {
    case 'hero':
      return <HeroSection locale={locale} settings={s} />
    case 'benefits':
      return <BenefitsSection locale={locale} settings={s} />
    case 'services_grid':
      return <ServicesPreview locale={locale} settings={s} />
    case 'about_teaser':
      return <AboutTeaser locale={locale} settings={s} />
    case 'medellin':
      return <MedellinSection locale={locale} settings={s} />
    case 'team_preview':
      return <TeamPreview locale={locale} settings={s} />
    case 'process':
      return <ProcessSection locale={locale} settings={s} />
    case 'cta':
      return <CTABanner locale={locale} settings={s} />
    default:
      return null
  }
}
