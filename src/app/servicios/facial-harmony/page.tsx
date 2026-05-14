import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const metadata: Metadata = {
  title: "Allura Facial Harmony™ — Allura Healthcare",
  description: "Medicina facial estética de precisión en Medellín: toxina botulínica, rellenos, rejuvenecimiento y cirugía facial mínimamente invasiva.",
};

const subServices = [
  {
    slug: "evaluacion-facial",
    name: "Evaluación Facial Estructural",
    description: "Análisis completo de tus proporciones faciales para diseñar un plan de armonización personalizado y coherente con tus rasgos.",
  },
  {
    slug: "toxina-botulinica",
    name: "Toxina Botulínica y Rellenos Dérmicos",
    description: "Aplicación precisa de toxina botulínica y ácido hialurónico para suavizar expresiones y restaurar volumen con resultados naturales.",
  },
  {
    slug: "bioestimuladores",
    name: "Bioestimuladores y Rejuvenecimiento",
    description: "Tratamientos de última generación que estimulan la producción natural de colágeno para rejuvenecimiento progresivo y duradero.",
  },
  {
    slug: "blefaroplastia",
    name: "Blefaroplastia",
    description: "Cirugía de párpados para eliminar el exceso de piel y grasa, logrando una mirada más descansada y juvenil.",
  },
  {
    slug: "rinoplastia",
    name: "Rinoplastia",
    description: "Refinamiento de la nariz en equilibrio con tus rasgos faciales. Tanto estética como funcional, bajo criterio médico estricto.",
  },
  {
    slug: "lifting-facial",
    name: "Lifting Facial",
    description: "Procedimiento quirúrgico para reposicionar tejidos y restaurar la definición facial sin resultados artificiales.",
  },
  {
    slug: "mentoplastia",
    name: "Mentoplastia",
    description: "Redefinición del mentón para mejorar el perfil y el equilibrio facial. Procedimiento mínimamente invasivo con recuperación rápida.",
  },
  {
    slug: "cirugia-maxilofacial",
    name: "Coordinación con Cirugía Maxilofacial",
    description: "Planificación interdisciplinaria entre odontología y cirugía maxilofacial para casos que requieren corrección ósea facial.",
  },
];

export default function FacialHarmonyPage() {
  return (
    <ServiceCategoryTemplate
      title="Allura Facial Harmony™"
      eyebrow="Medicina Facial Estética"
      subtitle="Medicina facial estética de precisión para realzar tus rasgos con naturalidad y confianza."
      description="Nuestro equipo de especialistas trabaja con técnicas mínimamente invasivas y protocolos internacionales para resultados que se ven y se sienten auténticos. Cada plan de armonización facial es diseñado respetando la identidad y las proporciones únicas de cada paciente."
      categorySlug="facial-harmony"
      heroImage="/images/imagenes_web/cirugia-estetica-facial-allurahealthcare.png"
      subServices={subServices}
    />
  );
}
