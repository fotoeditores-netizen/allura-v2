import { Link } from "@/navigation";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";
import type { ServiceDetailData } from "@/types/cms";
import { getSiteSettings, buildWhatsAppUrl } from "@/lib/getSiteSettings";

interface Step {
  title: string;
  description: string;
}

interface ServiceDetailTemplateProps {
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  benefits: string[];
  steps: Step[];
  candidates: string[];
  timeline: string;
  specialty: "odontologia" | "facial";
  sanityData?: ServiceDetailData;
  locale?: string;
}

export async function ServiceDetailTemplate({
  category,
  categorySlug,
  title,
  description,
  benefits,
  steps,
  candidates,
  timeline,
  sanityData,
  locale = "es",
}: ServiceDetailTemplateProps) {
  const t = await getTranslations("serviceDetail");
  const loc = locale as "es" | "en";
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(settings, loc);

  const resolvedTitle = sanityData?.title?.[loc] || title;
  const resolvedDescription = sanityData?.shortDescription?.[loc] || description;
  const resolvedCategory =
    sanityData?.category?.title?.[loc] || category;
  const resolvedCategorySlug =
    sanityData?.category?.slug?.current || categorySlug;

  const resolvedBenefits: string[] =
    sanityData?.benefits && sanityData.benefits.length > 0
      ? sanityData.benefits.map((b) => b.title?.[loc] || "")
      : benefits;

  const resolvedSteps: Step[] =
    sanityData?.process && sanityData.process.length > 0
      ? sanityData.process.map((s) => ({
          title: s.title?.[loc] || "",
          description: s.description?.[loc] || "",
        }))
      : steps;

  return (
    <>
      {/* Hero with breadcrumb */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12">
        <div className="container-allura">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-body text-xs text-white/50 mb-8">
            <Link href="/servicios" className="hover:text-white transition-colors">{t("breadcrumbServices")}</Link>
            <ChevronRight size={12} />
            <Link href={`/servicios/${resolvedCategorySlug}`} className="hover:text-white transition-colors">{resolvedCategory}</Link>
            <ChevronRight size={12} />
            <span className="text-white/70">{resolvedTitle}</span>
          </nav>

          <div className="max-w-2xl">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">{resolvedCategory}</p>
            <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">{resolvedTitle}</h1>
            <p className="font-body text-base text-white/70 leading-relaxed mb-10">{resolvedDescription}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              {t("whatsapp")}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <SectionHeading eyebrow={t("benefitsLabel")} title={t("benefitsTitle")} />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {resolvedBenefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                <p className="font-body text-sm text-brand-navy leading-relaxed">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          <SectionHeading eyebrow={t("processLabel")} title={t("processTitle")} centered />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {resolvedSteps.map(({ title: stepTitle, description: stepDesc }, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-brand-light">
                <p className="font-heading text-3xl text-brand-blue/25 mb-3">0{i + 1}</p>
                <h3 className="font-heading text-lg text-brand-navy mb-2">{stepTitle}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{stepDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidates + Timeline */}
      <section className="section-padding bg-white">
        <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-14">
          <div>
            <SectionHeading eyebrow={t("candidatesLabel")} title={t("candidatesTitle")} />
            <ul className="mt-8 space-y-3">
              {candidates.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                  <p className="font-body text-sm text-brand-navy">{c}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow={t("timelineLabel")} title={t("timelineTitle")} />
            <div className="mt-8 bg-brand-light rounded-2xl p-7">
              <p className="font-body text-base text-brand-navy leading-relaxed">{timeline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Allura */}
      <section className="section-padding bg-brand-navy">
        <div className="container-allura text-center max-w-2xl mx-auto">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">{t("whyLabel")}</p>
          <h2 className="font-heading text-3xl text-white mb-6">
            {t("whyTitle")}
          </h2>
          <p className="font-body text-brand-silver leading-relaxed mb-10">
            {t("whyBody")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
          >
            {t("whatsapp")}
          </a>
        </div>
      </section>

      <CTABanner locale={locale} settings={{
        buttonLabel: { es: 'Contactar ahora', en: 'Contact now' },
        buttonUrl: 'https://allura-healthcare-v2.vercel.app/es/contacto',
        buttonColor: 'white',
      }} />
    </>
  );
}
