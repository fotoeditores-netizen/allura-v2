"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Stethoscope, Leaf, Plane, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

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

export function MedellinSection() {
  const t = useTranslations("medellin");
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
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            centered
          />
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {benefits.map(({ title, description }, i) => {
            const Icon = icons[i];
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
                  {title}
                </h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">
                  {description}
                </p>
              </motion.div>
            );
          })}
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
          <Button href="/como-funciona" variant="primary">
            {t("cta")}
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
