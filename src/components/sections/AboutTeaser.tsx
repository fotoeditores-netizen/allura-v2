"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTranslations } from "next-intl";
import type { LocaleString, SanityImageLocaleAlt, CtaField } from "@/types/cms";

interface AboutTeaserProps {
  sanityData?: {
    eyebrow?: LocaleString
    title?: LocaleString
    body?: LocaleString
    cta?: CtaField
    image?: SanityImageLocaleAlt
  }
  locale?: string
  settings?: Record<string, unknown>
}

export function AboutTeaser({ sanityData, locale = "es", settings }: AboutTeaserProps = {}) {
  const t = useTranslations("aboutTeaser");

  // Helper to get locale-specific value with settings → Sanity → i18n fallback
  const getTextValue = (sanityValue: LocaleString | undefined, fallbackKey: string, settingsKey: string): string => {
    const fromSettings = (settings?.[settingsKey] as { es?: string; en?: string })?.[locale as 'es' | 'en'];
    if (fromSettings && fromSettings.trim()) return fromSettings;
    if (sanityValue?.[locale as keyof LocaleString]) {
      return sanityValue[locale as keyof LocaleString];
    }
    return t(fallbackKey);
  };

  // Determine image URL: settings > Sanity > hardcoded default
  const imageUrl = (settings?.imageUrl as string)
    || sanityData?.image?.asset?.url
    || '/images/imagenes_web/allura-healthcare-medico-paciente.jpg';

  // CTA button logic
  const ctaLabel = (settings?.ctaLabel as { es?: string; en?: string })?.[locale as 'es' | 'en']
    || sanityData?.cta?.label?.[locale as keyof LocaleString]
    || t("cta");
  const ctaUrl = sanityData?.cta?.url || "/nosotros";
  const ctaNewTab = sanityData?.cta?.openInNewTab || false;

  return (
    <section className="section-padding bg-brand-light overflow-hidden">
      <div className="container-allura">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              eyebrow={getTextValue(sanityData?.eyebrow, "eyebrow", "eyebrow")}
              title={getTextValue(sanityData?.title, "title", "title")}
              subtitle={getTextValue(sanityData?.body, "subtitle", "subtitle")}
            />
            <div className="mt-8">
              <Button
                href={ctaUrl}
                variant="primary"
                target={ctaNewTab ? "_blank" : undefined}
                rel={ctaNewTab ? "noopener noreferrer" : undefined}
              >
                {ctaLabel}
              </Button>
            </div>
          </motion.div>

          {/* Image — renders Sanity image if available, otherwise hardcoded default */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-square rounded-2xl overflow-hidden min-w-0 w-full"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${imageUrl}')`,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
