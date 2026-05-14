"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    step: "PASO 01",
    title: "Cuéntanos tu objetivo",
    description: "Te guiaremos en los primeros pasos",
    image: "/images/imagenes_web/medellin-turismo-medico-paciente-bienestar-allura-healthcare_edited.jpg",
    alt: "Paciente investigando tratamientos desde casa con vista a Medellín",
  },
  {
    step: "PASO 02",
    title: "Consulta virtual",
    description: "Evaluación inicial con un especialista",
    image: "/images/imagenes_web/allura-healthcare-seguimiento-remoto-internacional.jpg",
    alt: "Consulta virtual con especialista Allura Healthcare por videollamada",
  },
  {
    step: "PASO 03",
    title: "Plan personalizado",
    description: "Recibe un itinerario y plan detallado",
    image: "/images/imagenes_web/allura-healthcare-doctor-paciente.jpg",
    alt: "Doctor presentando plan de tratamiento personalizado en tablet a paciente",
  },
  {
    step: "PASO 04",
    title: "Tratamiento experto",
    description: "Atención de excelencia y seguimiento continuo",
    image: "/images/imagenes_web/allura-healthcare-como-funciona-proceso-acompanamiento_edited_edited.jpg",
    alt: "Acompañamiento experto y seguimiento continuo en clínica Allura Medellín",
  },
];

export function ProcessSection() {
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
            eyebrow="Cómo funciona"
            title="Tu proceso con Allura: simple, seguro y humano"
            centered
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map(({ step, title, description, image, alt }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl overflow-hidden border border-brand-navy/20 shadow-sm"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className={`px-6 py-5 flex flex-col gap-2 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'}`}>
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
            Comienza tu consulta personalizada
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
