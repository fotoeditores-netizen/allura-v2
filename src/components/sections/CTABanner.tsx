"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import type { LocaleString, SanityImage, CtaField } from "@/types/cms";

export interface CTABannerProps {
  sanityData?: {
    eyebrow?: LocaleString;
    title?: LocaleString;
    body?: LocaleString;
    cta?: CtaField;
    backgroundImage?: SanityImage;
  };
  locale?: string;
}

export function CTABanner({ sanityData, locale = "es" }: CTABannerProps = {}) {
  const t = useTranslations("cta");

  // Helper to get locale-aware text with Sanity fallback
  const getText = (sanityValue: LocaleString | undefined, i18nKey: string): string => {
    if (sanityValue && sanityValue[locale as keyof LocaleString]) {
      const value = sanityValue[locale as keyof LocaleString];
      if (value?.trim()) {
        return value;
      }
    }
    return t(i18nKey);
  };

  // Get CTA text and href
  const ctaLabel = sanityData?.cta?.label
    ? sanityData.cta.label[locale as keyof LocaleString] || t("button")
    : t("button");
  const ctaHref = sanityData?.cta?.url || "/contacto";
  const ctaNewTab = sanityData?.cta?.openInNewTab ?? false;

  return (
    <section className="bg-brand-navy section-padding">
      <div className="container-allura text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">
            {getText(sanityData?.eyebrow, "eyebrow")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 max-w-2xl mx-auto leading-tight">
            {getText(sanityData?.title, "title")}
          </h2>
          <p className="font-body text-brand-light/70 text-base mb-10 max-w-lg mx-auto">
            {getText(sanityData?.body, "body")}
          </p>
          <Button href={ctaHref} variant="secondary" target={ctaNewTab ? "_blank" : undefined}>
            {ctaLabel}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
