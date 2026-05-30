import { getSiteSettings } from "@/lib/getSiteSettings"
import { HeroSection }    from "@/components/sections/HeroSection"
import { BenefitsSection } from "@/components/sections/BenefitsSection"
import { ServicesPreview } from "@/components/sections/ServicesPreview"
import { AboutTeaser }    from "@/components/sections/AboutTeaser"
import { MedellinSection } from "@/components/sections/MedellinSection"
import { TeamPreview }    from "@/components/sections/TeamPreview"
import { ProcessSection } from "@/components/sections/ProcessSection"
import { CTABanner }      from "@/components/sections/CTABanner"
import { getPageBySlug, getSectionsByPage, type SectionRow } from "@/lib/supabase/pages"

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600

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
    default:              return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const settings = await getSiteSettings()
  const locale = params.locale as "es" | "en"
  const siteName = settings?.siteName ?? "Allura Healthcare"

  const title =
    settings?.seoTitle?.[locale] ??
    (locale === "en"
      ? "Allura Healthcare — Medical Tourism in Medellín"
      : "Allura Healthcare — Turismo Médico en Medellín")

  const description =
    settings?.seoDescription?.[locale] ??
    (locale === "en"
      ? "Premium dental and aesthetic medicine for international patients in Medellín, Colombia."
      : "Odontología premium y medicina facial estética para pacientes internacionales en Medellín, Colombia.")

  const ogImageUrl = settings?.seoImageUrl

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName,
      locale: locale === "en" ? "en_US" : "es_CO",
      type: "website",
      ...(ogImageUrl
        ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }
        : {}),
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale as "es" | "en"

  // Render from CMS only if published and has sections that actually produce output
  const page = await getPageBySlug('/')
  if (page && page.status === 'published') {
    const sections = await getSectionsByPage(page.id)
    const rendered = sections
      .filter(s => s.is_visible)
      .map(s => renderSection(s, locale))
      .filter(Boolean)
    if (rendered.length > 0) {
      return <>{rendered}</>
    }
  }

  // Fallback: hardcoded sections
  return (
    <>
      <HeroSection locale={locale} />
      <BenefitsSection locale={locale} />
      <ServicesPreview locale={locale} />
      <AboutTeaser locale={locale} />
      <MedellinSection locale={locale} />
      <TeamPreview locale={locale} />
      <ProcessSection locale={locale} />
      <CTABanner locale={locale} />
    </>
  )
}
