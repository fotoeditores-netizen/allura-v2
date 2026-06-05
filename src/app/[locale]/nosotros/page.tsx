import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { Award, HeartHandshake, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getPageBySlug, getSectionsByPage } from "@/lib/supabase/pages";
import { renderSection } from "@/lib/render-section";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const valueIcons = [Award, HeartHandshake, ShieldCheck];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nosotros" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function NosotrosPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/nosotros')
  if (page) {
    const sections = await getSectionsByPage(page.id)
    const visible = sections.filter(s => s.is_visible)
    if (visible.length > 0) {
      return (
        <div className="pt-24">
          {visible.map(s => renderSection(s, locale))}
        </div>
      )
    }
  }

  // Fallback: hardcoded content
  const t = await getTranslations("nosotros");
  const pillars = t.raw("pillars") as Array<{ number: string; title: string; description: string }>;
  const values = t.raw("values") as Array<{ title: string; description: string }>;

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          centered
          light
        />
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('/images/imagenes_web/allura-healthcare-doctor-paciente.jpg')",
              }}
            />
          </div>
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-3">
              {t("missionLabel")}
            </p>
            <h2 className="font-heading text-3xl text-brand-navy mb-5">
              {t("missionTitle")}
            </h2>
            <p className="font-body text-brand-silver leading-relaxed mb-4">
              {t("missionBody1")}
            </p>
            <p className="font-body text-brand-silver leading-relaxed">
              {t("missionBody2")}
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          <SectionHeading
            eyebrow={t("pillarsLabel")}
            title={t("pillarsTitle")}
            subtitle={t("pillarsSubtitle")}
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {pillars.map(({ number, title, description }) => (
              <div key={number} className="bg-white rounded-2xl p-8 shadow-sm border border-brand-light">
                <p className="font-heading text-4xl text-brand-blue/30 mb-4">{number}</p>
                <h3 className="font-heading text-xl text-brand-navy mb-3">{title}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <SectionHeading eyebrow={t("valuesLabel")} title={t("valuesTitle")} centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {values.map(({ title, description }, i) => {
              const Icon = valueIcons[i];
              return (
                <div key={title} className="text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-brand-navy/5 flex items-center justify-center mx-auto mb-5">
                    <Icon size={26} className="text-brand-navy" />
                  </div>
                  <h3 className="font-heading text-xl text-brand-navy mb-2">{title}</h3>
                  <p className="font-body text-sm text-brand-silver leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
