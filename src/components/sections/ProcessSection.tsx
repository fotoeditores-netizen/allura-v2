"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import type { LocaleString, CtaField } from "@/sanity/lib/queries";

const stepsMeta = [
  {
    image: "/images/imagenes_web/medellin-turismo-medico-paciente-bienestar-allura-healthcare_edited.jpg",
    alt: "Patient researching treatments from home with a view of Medellín",
  },
  {
    image: "/images/imagenes_web/allura-healthcare-seguimiento-remoto-internacional.jpg",
    alt: "Virtual consultation with Allura Healthcare specialist via video call",
  },
  {
    image: "/images/imagenes_web/allura-healthcare-doctor-paciente.jpg",
    alt: "Doctor presenting personalized treatment plan on tablet to patient",
  },
  {
    image: "/images/imagenes_web/allura-healthcare-como-funciona-proceso-acompanamiento_edited_edited.jpg",
    alt: "Expert support and continuous follow-up at Allura Medellín clinic",
  },
];

interface ProcessSectionProps {
  sanityData?: {
    eyebrow?: LocaleString
    title?: LocaleString
    steps?: Array<{
      stepNumber?: number
      title?: LocaleString
      description?: LocaleString
    }>
    cta?: CtaField
  }
  locale?: string
}

export function ProcessSection({
  sanityData,
  locale = "es",
}: ProcessSectionProps = {}) {
  const t = useTranslations("process");
  const fallbackSteps = t.raw("steps") as Array<{
    step: string
    title: string
    description: string
  }>;

  // Determine which values to use (Sanity or fallback)
  const displayEyebrow =
    sanityData?.eyebrow && Object.values(sanityData.eyebrow).some(v => v?.trim())
      ? sanityData.eyebrow[locale as keyof LocaleString] ||
        sanityData.eyebrow.es
      : t("eyebrow");

  const displayTitle =
    sanityData?.title && Object.values(sanityData.title).some(v => v?.trim())
      ? sanityData.title[locale as keyof LocaleString] || sanityData.title.es
      : t("title");

  const displaySteps =
    sanityData?.steps && sanityData.steps.length > 0
      ? sanityData.steps
      : fallbackSteps;

  const displayCtaLabel = sanityData?.cta?.label
    ? sanityData.cta.label[locale as keyof LocaleString] ||
      sanityData.cta.label.es
    : t("cta");

  const displayCtaHref = sanityData?.cta?.url || "/contacto";

  return (
    <section className="section-padding bg-brand-light/30">
      <div className="container-allura">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading eyebrow={displayEyebrow} title={displayTitle} centered />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {displaySteps.map((step, i) => {
            // Extract step label, title, and description based on data source
            let stepLabel: string;
            let stepTitle: string;
            let stepDescription: string;

            const isFromSanity =
              sanityData?.steps &&
              sanityData.steps.length > 0 &&
              "stepNumber" in step;

            if (isFromSanity) {
              // From Sanity — type-guarded
              const sanityStep = step as {
                stepNumber?: number
                title?: LocaleString
                description?: LocaleString
              };
              stepLabel = String(sanityStep.stepNumber ?? i + 1).padStart(2, "0");
              stepTitle =
                sanityStep.title?.[locale as keyof LocaleString] ||
                sanityStep.title?.es ||
                "";
              stepDescription =
                sanityStep.description?.[locale as keyof LocaleString] ||
                sanityStep.description?.es ||
                "";
            } else {
              // From i18n fallback
              const i18nStep = step as {
                step: string
                title: string
                description: string
              };
              stepLabel = i18nStep.step;
              stepTitle = i18nStep.title;
              stepDescription = i18nStep.description;
            }

            // Use the last stepsMeta entry if we exceed length
            const metaIdx = i < stepsMeta.length ? i : stepsMeta.length - 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col rounded-2xl overflow-hidden border border-brand-navy/20 shadow-sm"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <Image
                    src={stepsMeta[metaIdx].image}
                    alt={stepsMeta[metaIdx].alt}
                    fill
                    className="object-cover object-top transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div
                  className={`px-6 py-5 flex flex-col gap-2 ${
                    i % 2 === 0 ? "bg-white" : "bg-brand-light"
                  }`}
                >
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue">
                    {stepLabel}
                  </p>
                  <h3 className="font-heading text-lg text-brand-navy leading-snug">
                    {stepTitle}
                  </h3>
                  <p className="font-body text-sm text-brand-silver leading-relaxed">
                    {stepDescription}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Button href={displayCtaHref} variant="primary">
            {displayCtaLabel}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
