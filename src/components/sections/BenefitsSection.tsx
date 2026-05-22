"use client";

import { motion } from "framer-motion";
import { Award, HeartHandshake, ShieldCheck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTranslations } from "next-intl";

const icons: LucideIcon[] = [Award, HeartHandshake, ShieldCheck];

export function BenefitsSection() {
  const t = useTranslations("benefits");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="bg-brand-light section-padding">
      <div className="container-allura">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {items.map(({ title, description }, i) => {
            const Icon = icons[i];
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
                <h3 className="font-heading text-xl text-brand-navy">{title}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">
                  {description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
