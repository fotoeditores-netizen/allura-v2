"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const teamMeta = [
  { name: "Dra. Johanna Jaramillo", image: "/images/equipo/Dra-Johanna-Jaramillo-Allura.avif" },
  { name: "Dr. Santiago Henao",     image: "/images/equipo/Dr-Santiago-Henao-Allura.avif" },
  { name: "Dra. Daniela Alzate",    image: "/images/equipo/Dra-Daniela-Alzate-Allura.avif" },
  { name: "Dr. Iván Darío Jiménez", image: "/images/equipo/Dr-Ivan-Jimenez-Allura.avif" },
  { name: "Dr. Sebastián Muñoz",    image: "/images/equipo/Dr-Sebastian-Munoz-Allura.avif" },
  { name: "Dr. Alejandro Cifuentes",image: "/images/equipo/Dr-Alejandro-Cifuentes-Allura.avif" },
];

interface TeamPreviewProps {
  locale?: string;
  settings?: Record<string, unknown>;
}

export function TeamPreview({ locale = "es", settings }: TeamPreviewProps = {}) {
  const t = useTranslations("teamPreview");
  const members = t.raw("members") as Array<{ specialty: string }>;

  return (
    <section className="section-padding bg-white">
      <div className="container-allura">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow={(settings?.eyebrow as { es?: string; en?: string })?.[locale as 'es' | 'en'] || t("eyebrow")}
            title={(settings?.title as { es?: string; en?: string })?.[locale as 'es' | 'en'] || t("title")}
            subtitle={(settings?.subtitle as { es?: string; en?: string })?.[locale as 'es' | 'en'] || t("subtitle")}
            centered
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {teamMeta.map(({ name, image }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl overflow-hidden border border-brand-light shadow-sm"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-top transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              </div>
              <div className={`px-6 py-5 ${i % 2 === 0 ? "bg-white" : "bg-brand-light"}`}>
                <h3 className="font-heading text-lg text-brand-navy mb-1 leading-snug">
                  {name}
                </h3>
                <p className="font-body text-xs text-brand-blue tracking-wide leading-relaxed">
                  {members[i]?.specialty}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Button href="/equipo" variant="primary">
            {t("cta")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
