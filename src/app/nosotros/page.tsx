import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { Award, HeartHandshake, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre nosotros — Allura Healthcare",
  description: "Conoce la filosofía y el equipo detrás de Allura Healthcare, turismo médico de excelencia en Medellín.",
};

const values = [
  { icon: Award,          title: "Excelencia",    description: "Cada tratamiento sigue los más altos estándares internacionales, con especialistas certificados y tecnología de vanguardia." },
  { icon: HeartHandshake, title: "Empatía",        description: "Escuchamos y entendemos tu historia antes de cualquier recomendación. Tu bienestar es nuestra única prioridad." },
  { icon: ShieldCheck,    title: "Transparencia",  description: "Información clara, precios reales y procesos éticos en todo momento. Sin sorpresas, sin compromisos ocultos." },
];

const pillars = [
  { number: "01", title: "Diagnóstico honesto", description: "Evaluamos cada caso sin apresuramiento, con diagnóstico digital 3D y opinión de especialistas." },
  { number: "02", title: "Plan personalizado",  description: "Diseñamos una hoja de ruta exclusiva para ti: tratamiento, alojamiento y experiencia en Medellín." },
  { number: "03", title: "Acompañamiento total", description: "Coordinamos llegada, procedimientos, recuperación y seguimiento post-retorno desde tu país." },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow="Quiénes somos"
          title="Personas que cuidan personas"
          subtitle="Allura nace de la pasión por la odontología y la medicina estética de excelencia, y del orgullo de mostrar lo mejor de Medellín al mundo."
          centered
          light
        />
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('/images/imagenes_web/allura-healthcare-doctor-paciente.jpg')",
              }}
            />
          </div>
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-3">
              Nuestra misión
            </p>
            <h2 className="font-heading text-3xl text-brand-navy mb-5">
              El bienestar como propósito
            </h2>
            <p className="font-body text-brand-silver leading-relaxed mb-4">
              En Allura creemos que la salud y el disfrute no son opuestos. Somos un destino de turismo médico especializado en odontología premium y medicina facial estética, donde cada paciente internacional recibe atención de clase mundial respaldada por tecnología de vanguardia y la calidez de Medellín.
            </p>
            <p className="font-body text-brand-silver leading-relaxed">
              Cada persona que llega a Allura no solo recupera su sonrisa o armoniza su rostro — vive una experiencia única en una de las ciudades más vibrantes de América Latina.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          <SectionHeading
            eyebrow="Cómo trabajamos"
            title="Los pilares de Allura"
            subtitle="Tres principios que guían cada decisión que tomamos con nuestros pacientes."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {pillars.map(({ number, title, description }) => (
              <div key={number} className="bg-white rounded-2xl p-8 shadow-sm border border-brand-light">
                <p className="font-heading text-4xl text-brand-blue/30 mb-4">{number}</p>
                <h3 className="font-heading text-xl text-brand-navy mb-3">{title}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <SectionHeading eyebrow="Nuestros valores" title="Lo que nos define" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center px-4">
                <div className="w-14 h-14 rounded-full bg-brand-navy/5 flex items-center justify-center mx-auto mb-5">
                  <Icon size={26} className="text-brand-navy" />
                </div>
                <h3 className="font-heading text-xl text-brand-navy mb-2">{title}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
