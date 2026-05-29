"use client";

import { motion } from "framer-motion";
import {
  Award,
  HeartHandshake,
  ShieldCheck,
  Star,
  CheckCircle,
  Heart,
  Globe,
  Clock,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTranslations } from "next-intl";
import type { LocaleString } from "@/types/cms";

interface BenefitsSectionProps {
  sanityData?: {
    eyebrow?: LocaleString;
    title?: LocaleString;
    subtitle?: LocaleString;
    benefits?: Array<{
      icon?: string;
      title?: LocaleString;
      description?: LocaleString;
    }>;
  };
  locale?: string;
}

// Icon lookup map: Lucide icon name string → component
const iconMap: Record<string, LucideIcon> = {
  Award,
  HeartHandshake,
  ShieldCheck,
  Star,
  CheckCircle,
  Heart,
  Globe,
  Clock,
  Shield,
  Zap,
};

// Default icon order for fallback
const defaultIcons: LucideIcon[] = [Award, HeartHandshake, ShieldCheck];

function getIconComponent(iconName?: string, fallbackIndex?: number): LucideIcon {
  // If iconName is provided, try to resolve it from the map
  if (iconName && iconName in iconMap) {
    return iconMap[iconName];
  }
  // Fallback to default icon at index, or Award if no fallback index
  if (fallbackIndex !== undefined && fallbackIndex < defaultIcons.length) {
    return defaultIcons[fallbackIndex];
  }
  return Award;
}

function getLocaleValue(
  localeString: LocaleString | undefined,
  locale: string,
  fallback: string
): string {
  if (!localeString) return fallback;
  return locale === "en" ? localeString.en || fallback : localeString.es || fallback;
}

export function BenefitsSection({ sanityData, locale = "es" }: BenefitsSectionProps) {
  const t = useTranslations("benefits");
  const fallbackItems = t.raw("items") as Array<{ title: string; description: string }>;

  // Determine which benefits to render
  const benefits = sanityData?.benefits && sanityData.benefits.length > 0
    ? sanityData.benefits
    : fallbackItems.map((item) => ({
        icon: undefined,
        title: { es: item.title, en: item.title } as LocaleString,
        description: { es: item.description, en: item.description } as LocaleString,
      }));

  // Determine heading values with Sanity → i18n fallback
  const eyebrow = getLocaleValue(sanityData?.eyebrow, locale, t("eyebrow"));
  const title = getLocaleValue(sanityData?.title, locale, t("title"));
  const subtitle = getLocaleValue(sanityData?.subtitle, locale, t("subtitle"));

  return (
    <section className="bg-brand-light section-padding">
      <div className="container-allura">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {benefits.map((benefit, i) => {
            // Resolve icon: try Sanity icon name, fallback to default at index
            const Icon = getIconComponent(benefit.icon, i);

            // Resolve title and description
            const benefitTitle = getLocaleValue(benefit.title, locale, fallbackItems[i]?.title || "");
            const benefitDescription = getLocaleValue(
              benefit.description,
              locale,
              fallbackItems[i]?.description || ""
            );

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`${i % 2 === 0 ? "bg-white" : "bg-brand-light"} rounded-2xl p-8 shadow-sm border border-brand-navy/20 flex flex-col gap-5`}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center">
                  <Icon size={24} className="text-brand-navy" />
                </div>
                <h3 className="font-heading text-xl text-brand-navy">{benefitTitle}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">
                  {benefitDescription}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
