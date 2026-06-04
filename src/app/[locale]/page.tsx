import { getSiteSettings } from "@/lib/getSiteSettings"
import { getPageBySlug, getSectionsByPage } from "@/lib/supabase/pages"
import { renderSection } from "@/lib/render-section"
import { HeroSection }    from "@/components/sections/HeroSection"
import { BenefitsSection } from "@/components/sections/BenefitsSection"
import { ServicesPreview } from "@/components/sections/ServicesPreview"
import { AboutTeaser }    from "@/components/sections/AboutTeaser"
import { MedellinSection } from "@/components/sections/MedellinSection"
import { TeamPreview }    from "@/components/sections/TeamPreview"
import { ProcessSection } from "@/components/sections/ProcessSection"
import { CTABanner }      from "@/components/sections/CTABanner"

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600

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

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/')
  if (page) {
    const sections = await getSectionsByPage(page.id)
    const visible = sections.filter(s => s.is_visible)
    if (visible.length > 0) {
      return (
        <>
          {visible.map(s => renderSection(s, locale))}
        </>
      )
    }
  }

  // Fallback: hardcoded sections (used when no CMS sections exist yet)
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
