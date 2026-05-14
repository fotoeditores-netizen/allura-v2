"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const team = [
  {
    name: "Dra. Johanna Jaramillo",
    specialty: "Odontóloga, Especialista en Prótesis Periodontal",
    image: "/images/equipo/Dra-Johanna-Jaramillo-Allura.avif",
  },
  {
    name: "Dr. Santiago Henao",
    specialty: "Odontólogo y Ortodoncista",
    image: "/images/equipo/Dr-Santiago-Henao-Allura.avif",
  },
  {
    name: "Dra. Daniela Alzate",
    specialty: "Odontóloga, Ortodoncista y MSc.",
    image: "/images/equipo/Dra-Daniela-Alzate-Allura.avif",
  },
  {
    name: "Dr. Iván Darío Jiménez",
    specialty: "Odontólogo, Ortodoncista y MSc.",
    image: "/images/equipo/Dr-Ivan-Jimenez-Allura.avif",
  },
  {
    name: "Dr. Sebastián Muñoz",
    specialty: "Odontólogo, MSc, Especialista en Prótesis Periodontal",
    image: "/images/equipo/Dr-Sebastian-Munoz-Allura.avif",
  },
  {
    name: "Dr. Alejandro Cifuentes",
    specialty: "Odontólogo, Especialista en Rehabilitación Oral",
    image: "/images/equipo/Dr-Alejandro-Cifuentes-Allura.avif",
  },
];

export function TeamPreview() {
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
            eyebrow="Nuestro equipo"
            title="Conoce nuestro equipo experto"
            subtitle="Conoce a los profesionales que acompañan cada proceso con criterio clínico, experiencia internacional y atención personalizada."
            centered
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {team.map(({ name, specialty, image }, i) => (
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
              <div className={`px-6 py-5 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'}`}>
                <h3 className="font-heading text-lg text-brand-navy mb-1 leading-snug">
                  {name}
                </h3>
                <p className="font-body text-xs text-brand-blue tracking-wide leading-relaxed">
                  {specialty}
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
            Conoce más sobre ellos
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
