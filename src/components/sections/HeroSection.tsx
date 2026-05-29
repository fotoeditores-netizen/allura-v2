"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import type { LocaleString, SanityImage, CtaField } from "@/types/cms";

interface HeroSectionProps {
  sanityData?: {
    eyebrow?: LocaleString;
    headlinePart1?: LocaleString;
    headlinePart2?: LocaleString;
    subtext?: LocaleString;
    ctaPrimary?: CtaField;
    ctaSecondary?: CtaField;
    backgroundImage?: SanityImage;
  };
  locale?: string;
  settings?: Record<string, unknown>;
}

export function HeroSection({ sanityData, locale = "es", settings }: HeroSectionProps) {
  const t = useTranslations("hero");

  // Helper to get text from settings, then Sanity data, then fall back to next-intl
  const getText = (sanityValue: LocaleString | undefined, i18nKey: string, settingsKey: string): string => {
    const fromSettings = (settings?.[settingsKey] as { es?: string; en?: string })?.[locale as 'es' | 'en'];
    if (fromSettings && fromSettings.trim()) return fromSettings;
    if (sanityValue?.[locale as keyof LocaleString]) {
      const value = sanityValue[locale as keyof LocaleString];
      if (value && typeof value === "string" && value.trim()) {
        return value;
      }
    }
    return t(i18nKey);
  };

  // Helper to get CTA data with fallbacks
  const getCtaData = (
    sanityCta: CtaField | undefined,
    defaultUrl: string,
    fallbackKey: string,
    settingsKey: string
  ): { label: string; href: string } => {
    const fromSettings = (settings?.[settingsKey] as { es?: string; en?: string })?.[locale as 'es' | 'en'];
    if (fromSettings && fromSettings.trim()) {
      return { label: fromSettings, href: sanityCta?.url || defaultUrl };
    }
    const label = sanityCta?.label?.[locale as keyof LocaleString];
    return {
      label: label && typeof label === "string" && label.trim() ? label : t(fallbackKey),
      href: sanityCta?.url || defaultUrl,
    };
  };

  const posterUrl = (settings?.imageUrl as string) || "/images/imagenes_web/allura-healthcare-medellin-salud-bienestar.png";

  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
        aria-hidden="true"
      >
        <source
          src="/images/imagenes_web/allura-healthcare-medellin-bienestar-salud-turismo.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/45 to-brand-navy/75" />

      {/* Content */}
      <div className="relative z-10 container-allura px-6 md:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body text-xs tracking-[0.25em] uppercase text-white/60 mb-6"
        >
          {getText(sanityData?.eyebrow, "eyebrow", "eyebrow")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight mb-6 max-w-4xl mx-auto"
        >
          {getText(sanityData?.headlinePart1, "headlinePart1", "headline1")}
          <br className="hidden sm:block" />
          {" "}{getText(sanityData?.headlinePart2, "headlinePart2", "headline2")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {getText(sanityData?.subtext, "subtext", "subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {(() => {
            const primaryCta = getCtaData(sanityData?.ctaPrimary, "/servicios", "ctaPrimary", "ctaPrimary");
            return (
              <Button href={primaryCta.href} variant="secondary">
                {primaryCta.label}
              </Button>
            );
          })()}
          {(() => {
            const secondaryCta = getCtaData(sanityData?.ctaSecondary, "/como-funciona", "ctaSecondary", "ctaSecondary");
            return (
              <Button href={secondaryCta.href} variant="outline" className="border-white/50 hover:border-white">
                {secondaryCta.label}
              </Button>
            );
          })()}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={24} className="text-white/40" />
      </motion.div>
    </section>
  );
}
