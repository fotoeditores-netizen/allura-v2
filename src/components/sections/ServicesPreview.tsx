"use client";

import { Link } from "@/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const cardBgStyles = [
  { backgroundColor: "#ffffff" },
  { backgroundColor: "#eaeeef" },
  { backgroundColor: "#ffffff" },
  { backgroundColor: "#eaeeef" },
];

const services = [
  {
    title: "Full Mouth Reconstruction",
    description: "Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura.",
    image: "/images/imagenes_web/Allura-Full-Mouth-Reconstruction.jpg",
    href: "/servicios/full-mouth-reconstruction",
  },
  {
    title: "Smile Makeover",
    description: "Diseño personalizado de sonrisa para transformar la estética dental con precisión y armonía.",
    image: "/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg",
    href: "/servicios/smile-makeover",
  },
  {
    title: "Allura Aligners",
    description: "Ortodoncia invisible de última generación con planificación digital y seguimiento personalizado.",
    image: "/images/imagenes_web/Invisalign_Allurahealthcare_.jpg",
    href: "/servicios/aligners",
  },
  {
    title: "Facial Harmony",
    description: "Medicina facial estética de precisión: toxina botulínica, rellenos y rejuvenecimiento integral.",
    image: "/images/imagenes_web/allura-healthcare-evaluacion-facial-estructural.jpg",
    href: "/servicios/facial-harmony",
  },
];

export function ServicesPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-allura">
        <SectionHeading
          eyebrow="Nuestros servicios"
          title="Especialidades Allura"
          subtitle="Odontología premium y medicina facial estética para pacientes internacionales."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {services.map(({ title, description, image, href }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-brand-navy/20 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image header */}
              <div className="relative h-52 flex-shrink-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              </div>

              {/* Content area */}
              <div
                className="flex flex-col flex-1 p-6"
                style={cardBgStyles[i]}
              >
                <h3 className="font-heading text-xl text-brand-navy mb-2 leading-tight">
                  {title}
                </h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed mb-5 flex-1">
                  {description}
                </p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 self-center font-body text-sm text-[#eaeeef] bg-brand-navy px-6 py-[10px] rounded transition-all duration-300 ease-out hover:bg-brand-blue hover:text-white"
                >
                  Quiero saber más <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
