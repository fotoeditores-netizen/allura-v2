"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const stepsMeta = [
  {
    image: "/images/imagenes_web/medellin-turismo-medico-paciente-bienestar-allura-healthcare_edited.jpg",
    alt: "Patient researching treatments from home with a view of Medellín",
  },
  {
    image: "/images/imagenes_web/allura-healthcare-seguimiento-remoto-internacional.jpg",
    alt: "Virtual consultation with Allura Healthcare specialist via video call",
  },
  {
    image: "/images/imagenes_web/allura-healthcare-doctor-paciente.jpg",
    alt: "Doctor presenting personalized treatment plan on tablet to patient",
  },
  {
    image: "/images/imagenes_web/allura-healthcare-como-funciona-proceso-acompanamiento_edited_edited.jpg",
    alt: "Expert support and continuous follow-up at Allura Medellín clinic",
  },
];

export function ProcessSection() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Array<{ step: string; title: string; description: string }>;

  return (
    <section className="section-padding bg-brand-light/30">
      <div className="container-allura">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            centered
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map(({ step, title, description }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl overflow-hidden border border-brand-navy/20 shadow-sm"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image
                  src={stepsMeta[i].image}
                  alt={stepsMeta[i].alt}
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div
                className={`px-6 py-5 flex flex-col gap-2 ${i % 2 === 0 ? "bg-white" : "bg-brand-light"}`}
              >
                <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue">
                  {step}
                </p>
                <h3 className="font-heading text-lg text-brand-navy leading-snug">
                  {title}
                </h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">
                  {description}
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
          <Button href="/contacto" variant="primary">
            {t("cta")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
