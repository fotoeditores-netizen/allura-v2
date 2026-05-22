"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTranslations } from "next-intl";

export function AboutTeaser() {
  const t = useTranslations("aboutTeaser");

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
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
            <div className="mt-8">
              <Button href="/nosotros" variant="primary">
                {t("cta")}
              </Button>
            </div>
          </motion.div>

          {/* Image — src unchanged, locale-agnostic */}
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
                backgroundImage:
                  "url('/images/imagenes_web/allura-healthcare-medico-paciente.jpg')",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
