"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export function CTABanner() {
  const t = useTranslations("cta");

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
            {t("eyebrow")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 max-w-2xl mx-auto leading-tight">
            {t("title")}
          </h2>
          <p className="font-body text-brand-light/70 text-base mb-10 max-w-lg mx-auto">
            {t("body")}
          </p>
          <Button href="/contacto" variant="secondary">
            {t("button")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
