import { client } from "@/sanity/lib/client"
import {
  homePageQuery,
  siteSettingsQuery,
  type HomePage,
  type SiteSettings,
} from "@/sanity/lib/queries"

import { HeroSection }    from "@/components/sections/HeroSection"
import { BenefitsSection } from "@/components/sections/BenefitsSection"
import { ServicesPreview } from "@/components/sections/ServicesPreview"
import { AboutTeaser }    from "@/components/sections/AboutTeaser"
import { MedellinSection } from "@/components/sections/MedellinSection"
import { TeamPreview }    from "@/components/sections/TeamPreview"
import { ProcessSection } from "@/components/sections/ProcessSection"
import { CTABanner }      from "@/components/sections/CTABanner"

const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const [homePageData, siteSettings] = await Promise.all([
    client.fetch<HomePage | null>(homePageQuery, {}, { next: { revalidate: 3600 } }),
    client.fetch<SiteSettings | null>(siteSettingsQuery, {}, { next: { revalidate: 3600 } }),
  ])

  const locale = params.locale as "es" | "en"
  const seo = homePageData?.seo
  const siteName = siteSettings?.siteName ?? "Allura Healthcare"

  const title =
    seo?.metaTitle?.[locale] ??
    (locale === "en"
      ? "Allura Healthcare — Medical Tourism in Medellín"
      : "Allura Healthcare — Turismo Médico en Medellín")

  const description =
    seo?.metaDescription?.[locale] ??
    (locale === "en"
      ? "Premium dental and aesthetic medicine for international patients in Medellín, Colombia."
      : "Odontología premium y medicina facial estética para pacientes internacionales en Medellín, Colombia.")

  const ogImageUrl = seo?.ogImage?.asset?.url

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

  const [homePageData] = await Promise.all([
    client.fetch<HomePage | null>(
      homePageQuery,
      {},
      { next: { revalidate } }
    ),
  ])

  return (
    <>
      <HeroSection
        sanityData={homePageData?.hero ?? undefined}
        locale={locale}
      />
      <BenefitsSection
        sanityData={homePageData?.benefitsSection ?? undefined}
        locale={locale}
      />
      <ServicesPreview />
      <AboutTeaser
        sanityData={homePageData?.aboutTeaser ?? undefined}
        locale={locale}
      />
      <MedellinSection
        sanityData={homePageData?.medellinSection ?? undefined}
        locale={locale}
      />
      <TeamPreview />
      <ProcessSection
        sanityData={homePageData?.processSection ?? undefined}
        locale={locale}
      />
      <CTABanner
        sanityData={homePageData?.ctaBanner ?? undefined}
        locale={locale}
      />
    </>
  )
}
