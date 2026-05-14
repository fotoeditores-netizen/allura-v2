"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutTeaser() {
  return (
    <section className="section-padding bg-brand-light">
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
              eyebrow="Nuestra filosofía"
              title="Medellín como destino, el bienestar como propósito"
              subtitle="Allura nace de la convicción de que la salud y el disfrute no son opuestos. Combinamos la excelencia médica colombiana con la experiencia única de vivir Medellín — su clima, su cultura y su calidez humana."
            />
            <div className="mt-8">
              <Button href="/nosotros" variant="primary">
                Conoce nuestro equipo
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-square rounded-2xl overflow-hidden"
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
