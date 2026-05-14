"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/imagenes_web/allura-healthcare-medellin-salud-bienestar.png"
        aria-hidden="true"
      >
        <source
          src="/images/imagenes_web/allura-healthcare-medellin-bienestar-salud-turismo.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay — sutil, más aire que antes */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/45 to-brand-navy/75" />

      {/* Content */}
      <div className="relative z-10 container-allura px-6 md:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body text-xs tracking-[0.25em] uppercase text-white/60 mb-6"
        >
          Medellín, Colombia · Pacientes Internacionales
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight mb-6 max-w-4xl mx-auto"
        >
          Salud que inspira,<br className="hidden sm:block" /> viajes que transforman
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Atención médica y odontológica premium en Medellín, con acompañamiento personalizado para pacientes internacionales.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button href="/servicios" variant="secondary">
            Conoce nuestros servicios
          </Button>
          <Button href="/como-funciona" variant="outline" className="border-white/50 hover:border-white">
            ¿Cómo funciona?
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={24} className="text-white/40" />
      </motion.div>
    </section>
  );
}
