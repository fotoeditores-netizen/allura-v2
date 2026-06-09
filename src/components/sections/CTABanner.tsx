"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { LocaleString, CtaField } from "@/types/cms";

const DEFAULT_URL = "https://allura-healthcare-v2.vercel.app/es/contacto";

const BUTTON_STYLES: Record<string, { bg: string; hover: string; text: string }> = {
  whatsapp: { bg: '#25D366', hover: '#22c55e', text: 'white' },
  navy:     { bg: '#051c33', hover: '#0a3260', text: 'white' },
  blue:     { bg: '#8b9fb3', hover: '#7a8fa3', text: 'white' },
  white:    { bg: '#ffffff', hover: '#eaeeef', text: '#051c33' },
}

export interface CTABannerProps {
  sanityData?: {
    eyebrow?: LocaleString;
    title?: LocaleString;
    body?: LocaleString;
    cta?: CtaField;
  };
  locale?: string;
  settings?: Record<string, unknown>;
}

export function CTABanner({ sanityData, locale = "es", settings }: CTABannerProps = {}) {
  const t = useTranslations("cta");

  const getText = (sanityValue: LocaleString | undefined, i18nKey: string, settingsKey: string): string => {
    const fromSettings = (settings?.[settingsKey] as { es?: string; en?: string })?.[locale as 'es' | 'en'];
    if (fromSettings && fromSettings.trim()) return fromSettings;
    if (sanityValue && sanityValue[locale as keyof LocaleString]) {
      const value = sanityValue[locale as keyof LocaleString];
      if (value?.trim()) return value;
    }
    return t(i18nKey);
  };

  const ctaLabel = (settings?.buttonLabel as { es?: string; en?: string })?.[locale as 'es' | 'en']
    || (sanityData?.cta?.label
      ? sanityData.cta.label[locale as keyof LocaleString] || t("button")
      : t("button"));

  const colorKey = (settings?.buttonColor as string) || 'white';
  const btnStyle = BUTTON_STYLES[colorKey] ?? BUTTON_STYLES.whatsapp;
  const btnUrl = (settings?.buttonUrl as string)?.trim() || DEFAULT_URL;
  const isExternal = btnUrl.startsWith('http');

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
            {getText(sanityData?.eyebrow, "eyebrow", "eyebrow")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 max-w-2xl mx-auto leading-tight">
            {getText(sanityData?.title, "title", "title")}
          </h2>
          <p className="font-body text-brand-light/70 text-base mb-10 max-w-lg mx-auto">
            {getText(sanityData?.body, "body", "subtitle")}
          </p>
          <a
            href={btnUrl}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-bold text-sm transition-colors"
            style={{ backgroundColor: btnStyle.bg, color: btnStyle.text }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = btnStyle.hover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = btnStyle.bg)}
          >
            {ctaLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
