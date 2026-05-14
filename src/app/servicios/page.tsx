import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Servicios — Allura Healthcare",
  description: "Odontología premium y medicina facial estética de clase mundial en Medellín para pacientes internacionales.",
};

const categories = [
  {
    id: "full-mouth-reconstruction",
    trademark: "Allura Full Mouth Reconstruction™",
    eyebrow: "Odontología Integral",
    description:
      "Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura. Para pacientes que han perdido piezas, presentan deterioro severo o necesitan rehabilitación completa, diseñamos un plan integral respaldado por tecnología 3D y especialistas de alto nivel.",
    items: [
      "Implantes unitarios y múltiples",
      "Implantes All-on-X",
      "Rehabilitación oral completa",
      "Prótesis fijas sobre implantes",
      "Reemplazo de restauraciones fallidas",
      "Planificación digital 3D",
    ],
    href: "/servicios/full-mouth-reconstruction",
    image: "/images/imagenes_web/Allura-Full-Mouth-Reconstruction.jpg",
  },
  {
    id: "smile-makeover",
    trademark: "Allura Smile Makeover™",
    eyebrow: "Estética Dental",
    description:
      "Tu sonrisa, rediseñada con precisión artística. Combinamos diseño digital, carillas en porcelana y tecnología de vanguardia para que cada sonrisa sea única, natural y proyecte exactamente lo que quieres transmitir.",
    items: [
      "Carillas en porcelana",
      "Diseño digital de sonrisa",
      "Coronas en porcelana",
      "Restauraciones estéticas avanzadas",
      "Blanqueamiento dental profesional",
    ],
    href: "/servicios/smile-makeover",
    image: "/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg",
  },
  {
    id: "aligners",
    trademark: "Allura Aligners™",
    eyebrow: "Ortodoncia Invisible",
    description:
      "Ortodoncia sin brackets, con planificación digital personalizada y seguimiento remoto para pacientes internacionales. Usamos Invisalign y alineadores de última generación para lograr alineaciones precisas con total discreción.",
    items: [
      "Invisalign",
      "Alineadores transparentes",
      "Escaneo digital 3D",
      "Planificación personalizada",
      "Seguimiento remoto internacional",
    ],
    href: "/servicios/aligners",
    image: "/images/imagenes_web/Invisalign_Allurahealthcare_.jpg",
  },
  {
    id: "facial-harmony",
    trademark: "Allura Facial Harmony™",
    eyebrow: "Medicina Facial Estética",
    description:
      "Medicina facial estética de precisión para realzar tus rasgos con naturalidad. Nuestro equipo de especialistas trabaja con técnicas mínimamente invasivas y protocolos internacionales para resultados que se ven auténticos y duraderos.",
    items: [
      "Evaluación facial estructural",
      "Toxina botulínica y rellenos dérmicos",
      "Bioestimuladores y rejuvenecimiento",
      "Blefaroplastia",
      "Rinoplastia",
      "Lifting facial",
      "Mentoplastia",
      "Coordinación con cirugía maxilofacial",
    ],
    href: "/servicios/facial-harmony",
    image: "/images/imagenes_web/cirugia-estetica-facial-allurahealthcare.png",
  },
];

export default function ServiciosPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow="Especialidades"
          title="Servicios de excelencia"
          subtitle="Odontología premium y medicina facial estética para pacientes internacionales que buscan resultados reales."
          centered
          light
        />
      </section>

      {/* Services detail */}
      <section className="section-padding bg-white">
        <div className="container-allura space-y-28">
          {categories.map(({ id, trademark, eyebrow, description, items, image, href }, i) => (
            <div
              key={id}
              id={id}
              className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center"
            >
              <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-3">
                  {eyebrow}
                </p>
                <h2 className="font-heading text-3xl text-brand-navy mb-4">{trademark}</h2>
                <p className="font-body text-brand-silver leading-relaxed mb-6">{description}</p>
                <ul className="space-y-2 mb-8">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-body text-sm text-brand-navy">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 font-body text-sm font-bold text-brand-navy hover:text-brand-blue transition-colors"
                >
                  Explorar tratamientos <ArrowRight size={16} />
                </Link>
              </div>
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
