"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Stethoscope, Leaf, Plane, Sparkles, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { LocaleString, CtaField } from "@/types/cms";

const icons: LucideIcon[] = [Stethoscope, Leaf, Plane, Sparkles];

const gallery = [
  {
    src: "/images/imagenes_web/medellin-turismo-salud-clima-templado-recuperacion-paciente.jpg",
    alt: "Aerial view of Guatapé — nature and climate for recovery",
  },
  {
    src: "/images/imagenes_web/medellin-turismo-medico-especialista-internacional-tecnologia-avanzada.jpg",
    alt: "Medical specialists with cutting-edge technology in Medellín",
  },
  {
    src: "/images/imagenes_web/medellin-turismo-escaleras-comuna-13.jpg",
    alt: "Stairs of Comuna 13 — urban energy and culture of Medellín",
  },
];

interface MedellinSectionProps {
  locale?: string;
  sanityData?: {
    eyebrow?: LocaleString;
    title?: LocaleString;
    subtitle?: LocaleString;
    blocks?: Array<{
      title?: LocaleString;
      text?: LocaleString;
    }>;
    cta?: CtaField;
  };
  settings?: Record<string, unknown>;
}

/**
 * Helper to get localized string from Sanity data or fallback to next-intl
 */
function getLocalizedText(
  sanityValue: LocaleString | undefined,
  fallbackValue: string,
  locale: string
): string {
  if (sanityValue && sanityValue[locale as keyof LocaleString]) {
    const text = sanityValue[locale as keyof LocaleString];
    if (text && text.trim()) {
      return text;
    }
  }
  return fallbackValue;
}

export function MedellinSection({ locale: localeProp, sanityData, settings }: MedellinSectionProps) {
  const t = useTranslations("medellin");
  const intlLocale = useLocale();
  const locale = localeProp ?? intlLocale;
  const benefits = t.raw("benefits") as Array<{ title: string; description: string }>;

  return (
    <section className="section-padding bg-white">
      <div className="container-allura">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow={(settings?.eyebrow as { es?: string; en?: string })?.[locale as 'es' | 'en'] || getLocalizedText(sanityData?.eyebrow, t("eyebrow"), locale)}
            title={(settings?.title as { es?: string; en?: string })?.[locale as 'es' | 'en'] || getLocalizedText(sanityData?.title, t("title"), locale)}
            subtitle={(settings?.subtitle as { es?: string; en?: string })?.[locale as 'es' | 'en'] || getLocalizedText(sanityData?.subtitle, t("subtitle"), locale)}
            centered
          />
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {(() => {
            const settingsItems = settings?.items as Array<{ icon?: string; title?: { es?: string; en?: string }; description?: { es?: string; en?: string } }> | undefined;
            const blocks = settingsItems && settingsItems.length > 0
              ? settingsItems.map(item => ({ title: item.title as LocaleString | undefined, text: item.description as LocaleString | undefined, icon: item.icon }))
              : sanityData?.blocks && sanityData.blocks.length > 0
                ? sanityData.blocks
                : benefits;

            return blocks.map((block, i) => {
              const Icon = icons[i];

              // Extract title and description, with proper fallback
              const isSanityBlock = sanityData?.blocks && sanityData.blocks.length > 0;

              let blockTitle = "";
              let blockDesc = "";

              if (isSanityBlock && "title" in block && "text" in block) {
                blockTitle = (
                  block.title && block.title[locale as keyof LocaleString]
                    ? block.title[locale as keyof LocaleString]
                    : ""
                ) || benefits[i]?.title || "";
                blockDesc = (
                  block.text && block.text[locale as keyof LocaleString]
                    ? block.text[locale as keyof LocaleString]
                    : ""
                ) || benefits[i]?.description || "";
              } else {
                // Falls back to next-intl benefits
                blockTitle = (block as typeof benefits[0]).title || "";
                blockDesc = (block as typeof benefits[0]).description || "";
              }

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-brand-light"} rounded-2xl p-7 border border-brand-light flex flex-col gap-4`}
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                    <Icon size={22} className="text-brand-navy" />
                  </div>
                  <h3 className="font-heading text-lg text-brand-navy leading-snug">
                    {blockTitle}
                  </h3>
                  <p className="font-body text-sm text-brand-silver leading-relaxed">
                    {blockDesc}
                  </p>
                </motion.div>
              );
            });
          })()}
        </div>

        {/* Image Gallery — src paths are locale-agnostic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12"
        >
          {gallery.map(({ src, alt }) => (
            <div
              key={src}
              className="relative rounded-2xl overflow-hidden aspect-[4/3]"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          {(() => {
            const ctaLabel = sanityData?.cta?.label
              ? getLocalizedText(sanityData.cta.label, t("cta"), locale)
              : t("cta");
            const ctaUrl = sanityData?.cta?.url || "/como-funciona";
            const ctaNewTab = sanityData?.cta?.openInNewTab || false;

            return (
              <Button
                href={ctaUrl}
                variant="primary"
                target={ctaNewTab ? "_blank" : undefined}
                rel={ctaNewTab ? "noopener noreferrer" : undefined}
              >
                {ctaLabel}
              </Button>
            );
          })()}
        </motion.div>

      </div>
    </section>
  );
}
