"use client";

import { motion } from "framer-motion";
import { Award, HeartHandshake, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const benefits = [
  {
    icon: Award,
    title: "Excelencia Profesional",
    description:
      "Trabajamos con especialistas certificados internacionalmente que combinan rigor científico con una atención cercana y personalizada.",
  },
  {
    icon: HeartHandshake,
    title: "Acompañamiento Personalizado",
    description:
      "Coordinamos cada detalle de tu experiencia: desde la llegada a Medellín hasta el alta médica, para que solo te preocupes por sanar y disfrutar.",
  },
  {
    icon: ShieldCheck,
    title: "Tecnología y Ética",
    description:
      "Utilizamos equipos de última generación bajo protocolos internacionales, con total transparencia en cada etapa de tu tratamiento.",
  },
];

export function BenefitsSection() {
  return (
    <section className="bg-brand-light section-padding">
      <div className="container-allura">
        <SectionHeading
          eyebrow="Por qué elegirnos"
          title="Una experiencia diseñada para ti"
          subtitle="En Allura, tu bienestar es nuestra única prioridad."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {benefits.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'} rounded-2xl p-8 shadow-sm border border-brand-navy/20 flex flex-col gap-5`}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center">
                <Icon size={24} className="text-brand-navy" />
              </div>
              <h3 className="font-heading text-xl text-brand-navy">{title}</h3>
              <p className="font-body text-sm text-brand-silver leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
