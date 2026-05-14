"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Stethoscope, Leaf, Plane, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const benefits = [
  {
    icon: Stethoscope,
    title: "Excelencia médica",
    description:
      "Especialistas, infraestructura moderna y tecnología de última generación.",
  },
  {
    icon: Leaf,
    title: "Recuperación más cómoda",
    description:
      "Clima templado, hospitalidad local y estancias diseñadas para pacientes extranjeros.",
  },
  {
    icon: Plane,
    title: "Conectividad y logística",
    description:
      "Vuelos desde ciudades clave, alojamientos boutique y apoyo durante todo el viaje.",
  },
  {
    icon: Sparkles,
    title: "Bienestar y experiencia",
    description:
      "Paisaje, gastronomía y una energía urbana que acompaña el proceso de transformación.",
  },
];

const gallery = [
  {
    src: "/images/imagenes_web/medellin-turismo-salud-clima-templado-recuperacion-paciente.jpg",
    alt: "Paisaje aéreo de Guatapé — naturaleza y clima para la recuperación",
  },
  {
    src: "/images/imagenes_web/medellin-turismo-medico-especialista-internacional-tecnologia-avanzada.jpg",
    alt: "Especialistas médicos con tecnología de vanguardia en Medellín",
  },
  {
    src: "/images/imagenes_web/medellin-turismo-escaleras-comuna-13.jpg",
    alt: "Escaleras de la Comuna 13 — energía urbana y cultura de Medellín",
  },
];

export function MedellinSection() {
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
            eyebrow="Por qué Medellín"
            title="Medellín como destino, el bienestar como propósito"
            subtitle="Una ciudad moderna, hospitalaria y bien conectada, ideal para pacientes internacionales que buscan atención de alto nivel y una recuperación más cómoda."
            centered
          />
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {benefits.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'} rounded-2xl p-7 border border-brand-light flex flex-col gap-4`}
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
          ))}
        </div>

        {/* Image Gallery */}
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
            Explora Medellín con Allura
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
