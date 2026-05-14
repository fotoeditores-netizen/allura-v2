import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { TeamCard } from "@/components/sections/TeamCard";

export const metadata: Metadata = {
  title: "Equipo — Allura Healthcare",
  description: "Conoce al equipo de especialistas de Allura Healthcare: odontólogos y médicos certificados internacionalmente en Medellín.",
};

const team = [
  {
    name: "Dra. Johanna Jaramillo",
    specialty: "Odontóloga · Especialista en Prótesis Periodontal",
    image: "/images/equipo/Dra-Johanna-Jaramillo-Allura.avif",
    formacion: [
      "Odontóloga – Universidad CES (1999)",
      "Especialista en Prostodoncia Periodontal (2004)",
    ],
    reconocimiento: [
      "Key Opinion Leader en implantología",
      "Miembro de redes internacionales especializadas",
      "Docente universitaria desde 2006",
      "Conferencista nacional e internacional",
    ],
    enfoque: [
      "Implantes dentales y rehabilitaciones complejas",
      "Casos interdisciplinarios",
      "Fotografía clínica digital",
    ],
  },
  {
    name: "Dra. Daniela Alzate",
    specialty: "Odontóloga · Ortodoncista y MSc.",
    image: "/images/equipo/Dra-Daniela-Alzate-Allura.avif",
    formacion: [
      "Odontóloga – Universidad CES (2013)",
      "Especialista en Ortodoncia – Universidad CES (2020)",
      "Magíster en Ciencias Odontológicas – Universidad CES (2020)",
    ],
    reconocimiento: [
      "Coautora de estudio publicado en American Journal of Orthodontics and Dentofacial Orthopedics",
    ],
    enfoque: [
      "Ortodoncia moderna y alineadores transparentes",
      "Armonización facial desde la ortodoncia",
      "Planes de tratamiento basados en evidencia",
    ],
  },
  {
    name: "Dr. Sebastián Muñoz",
    specialty: "Odontólogo MSc · Especialista en Prótesis Periodontal",
    image: "/images/equipo/Dr-Sebastian-Munoz-Allura.avif",
    formacion: [
      "Odontólogo – Universidad CES (2000)",
      "Especialista en Prostodoncia Periodontal (2005)",
      "Magíster en Ciencias Odontológicas (2018)",
      "Máster clínico en odontología estética (gIDE / UCLA)",
    ],
    reconocimiento: [
      "Director de posgrado en rehabilitación oral (CES)",
      "Conferencista internacional",
    ],
    enfoque: [
      "Rehabilitación oral completa",
      "Estética dental avanzada",
      "Casos interdisciplinarios complejos",
    ],
  },
  {
    name: "Dr. Santiago Henao",
    specialty: "Odontólogo · Ortodoncista · Diamond Top Doctor Invisalign",
    image: "/images/equipo/Dr-Santiago-Henao-Allura.avif",
    formacion: [
      "Odontólogo – UAM (2012)",
      "Ortodoncia y Ortopedia Maxilofacial – México (2015)",
    ],
    reconocimiento: [
      "Diamond Top Doctor Invisalign",
      "Key Opinion Leader en alineadores",
    ],
    enfoque: [
      "Tratamientos con Invisalign",
      "Ortodoncia digital",
      "Estética de la sonrisa",
    ],
  },
  {
    name: "Dr. Iván Darío Jiménez",
    specialty: "Odontólogo · Ortodoncista y MSc.",
    image: "/images/equipo/Dr-Ivan-Jimenez-Allura.avif",
    formacion: [
      "Ortodoncia y Maestría – University of Manitoba, Canadá",
      "Certificación American Board of Orthodontics",
    ],
    reconocimiento: [
      "Conferencista internacional en investigación odontológica",
      "Miembro de asociaciones globales de ortodoncia",
    ],
    enfoque: [
      "Crecimiento y desarrollo facial",
      "Ortodoncia avanzada",
      "Equilibrio funcional y estético",
    ],
  },
  {
    name: "Dr. Alejandro Cifuentes",
    specialty: "Odontólogo · Especialista en Rehabilitación Oral",
    image: "/images/equipo/Dr-Alejandro-Cifuentes-Allura.avif",
    formacion: [
      "Odontólogo – Universidad CES (2013)",
      "Especialista en Rehabilitación Oral (Prostodoncia) – Universidad CES (2020)",
    ],
    reconocimiento: [
      "Director técnico de laboratorio dental de alta precisión",
      "Docente en diplomado de estética dental (desde 2022)",
    ],
    enfoque: [
      "Diseño de sonrisa y carillas",
      "Rehabilitación oral completa",
      "Odontología digital",
    ],
  },
];

export default function EquipoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow="Nuestro equipo"
          title="Especialistas de primer nivel"
          subtitle="Un equipo certificado internacionalmente, comprometido con la excelencia y el bienestar de cada paciente."
          centered
          light
        />
      </section>

      {/* Team grid */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <TeamCard key={member.name} {...member} bgLight={i % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura max-w-2xl text-center mx-auto">
          <SectionHeading
            eyebrow="Certificaciones"
            title="Formación de clase mundial"
            subtitle="Nuestros especialistas tienen formación en las mejores instituciones de Colombia, América y Europa, y participan activamente en congresos internacionales de odontología y medicina facial."
            centered
          />
        </div>
      </section>

      <CTABanner />
    </>
  );
}
