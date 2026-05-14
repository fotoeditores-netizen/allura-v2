import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Cómo funciona — Allura Healthcare",
  description: "Descubre el proceso paso a paso para recibir atención médica y odontológica de excelencia en Medellín con Allura Healthcare.",
};

const WHATSAPP_URL =
  "https://wa.me/573001234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

const steps = [
  {
    number: "01",
    title: "Comparte tus necesidades",
    description:
      "Completa nuestro formulario de contacto con tus objetivos de salud y bienestar. El equipo Allura te responde con orientación personalizada en menos de 24 horas, sin compromiso.",
    image: "/images/imagenes_web/allura-healthcare-contacto-inicial-turismo-en-salud-premium.png",
    alt: "Contacto inicial con Allura Healthcare para turismo en salud premium",
  },
  {
    number: "02",
    title: "Consulta virtual con especialistas",
    description:
      "Agenda una reunión segura por videollamada con los médicos u odontólogos certificados de Allura. Recibirás un diagnóstico preliminar, opciones de tratamiento y un presupuesto claro antes de viajar.",
    image: "/images/imagenes_web/allura-healthcare-consulta-virtual-especialista-turismo-en-salud.jpg",
    alt: "Consulta virtual con especialista de Allura Healthcare para turismo en salud",
  },
  {
    number: "03",
    title: "Plan médico y experiencia de viaje",
    description:
      "Nuestro equipo diseña tu plan integral: citas, fechas, alojamiento recomendado y actividades opcionales en Medellín. Todo coordinado para que tu estancia sea cómoda y memorable.",
    image: "/images/imagenes_web/allura-healthcare-reserva-organizacion-viaje-turismo-en-salud.jpg",
    alt: "Reserva y organización del viaje de turismo en salud con Allura Healthcare en Medellín",
  },
  {
    number: "04",
    title: "Procedimiento y acompañamiento total",
    description:
      "Coordinamos tu llegada, los procedimientos clínicos, la recuperación y el seguimiento post-retorno desde tu país de origen. Estamos contigo en cada etapa.",
    image: "/images/imagenes_web/allura-healthcare-tratamiento-acompanamiento-in-situ-turismo-en-salud.png",
    alt: "Acompañamiento in situ durante tratamiento médico en Allura Healthcare Medellín",
  },
];

const faqs = [
  {
    q: "¿Necesito hablar español para recibir atención?",
    a: "No. Contamos con coordinadores bilingües (español e inglés) disponibles durante todo el proceso.",
  },
  {
    q: "¿Qué pasa si necesito seguimiento después de regresar a mi país?",
    a: "Ofrecemos seguimiento remoto con videollamadas y comunicación directa con tu especialista vía WhatsApp.",
  },
  {
    q: "¿Los procedimientos incluyen garantía?",
    a: "Sí. Todos nuestros tratamientos incluyen garantías según el tipo de procedimiento, con protocolos claros de seguimiento.",
  },
  {
    q: "¿Puedo combinar varios tratamientos en un mismo viaje?",
    a: "Absolutamente. De hecho, muchos pacientes optimizan su viaje combinando tratamientos odontológicos y de medicina facial estética.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow="El proceso"
          title="Cómo funciona Allura"
          subtitle="Un proceso diseñado para que tu experiencia de turismo médico sea transparente, segura y sin estrés, desde tu país hasta Medellín."
          centered
          light
        />
      </section>

      {/* Steps */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="space-y-16">
            {steps.map(({ number, title, description, image, alt }, i) => (
              <div
                key={number}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                  <p className="font-heading text-6xl text-brand-blue/20 mb-4">{number}</p>
                  <h2 className="font-heading text-3xl text-brand-navy mb-4">{title}</h2>
                  <p className="font-body text-brand-silver leading-relaxed">{description}</p>
                </div>
                <div className={`relative aspect-video rounded-2xl overflow-hidden ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${image}')` }}
                    role="img"
                    aria-label={alt}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura max-w-3xl">
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            title="Lo que más nos preguntan"
            centered
          />
          <div className="mt-12 space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-7 shadow-sm border border-brand-light">
                <h3 className="font-heading text-lg text-brand-navy mb-3">{q}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section-padding bg-white">
        <div className="container-allura text-center max-w-xl mx-auto">
          <SectionHeading
            eyebrow="¿Listo para comenzar?"
            title="Tu primer paso es una conversación"
            subtitle="Cuéntanos tu caso sin compromiso. Nuestro equipo te orienta de forma gratuita."
            centered
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              Hablar por WhatsApp
            </a>
            <Button href="/contacto" variant="primary">
              Formulario de contacto
            </Button>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
