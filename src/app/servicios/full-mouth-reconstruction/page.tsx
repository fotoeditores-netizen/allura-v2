import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const metadata: Metadata = {
  title: "Allura Full Mouth Reconstruction™ — Allura Healthcare",
  description: "Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura. Implantes, rehabilitación oral y más en Medellín.",
};

const subServices = [
  {
    slug: "implantes-unitarios",
    name: "Implantes Unitarios y Múltiples",
    description: "Reemplazo de una o varias piezas dentales con implantes de titanio de alta precisión, integrados para durar toda la vida.",
  },
  {
    slug: "implantes-all-on-x",
    name: "Implantes All-on-X",
    description: "Solución completa para pacientes con pérdida total o casi total de piezas: una arcada completa fija sobre 4 o 6 implantes estratégicamente ubicados.",
  },
  {
    slug: "rehabilitacion-oral-completa",
    name: "Rehabilitación Oral Completa",
    description: "Tratamiento integral que restaura función masticatoria, estética y salud periodontal para casos de deterioro severo o múltiple.",
  },
  {
    slug: "protesis-fijas",
    name: "Prótesis Fijas sobre Implantes",
    description: "Coronas y puentes de porcelana fijados permanentemente sobre implantes. Aspecto natural, resistencia total y funcionalidad completa.",
  },
  {
    slug: "reemplazo-restauraciones",
    name: "Reemplazo de Restauraciones Fallidas",
    description: "Evaluación y sustitución de restauraciones antiguas, fracturadas o con infiltración. Volvemos a empezar sobre una base sana.",
  },
  {
    slug: "planificacion-digital-3d",
    name: "Planificación Digital 3D",
    description: "Simulación completa de tu caso con tecnología CAD/CAM y escáner intraoral 3D antes de comenzar cualquier procedimiento.",
  },
];

export default function FullMouthReconstructionPage() {
  return (
    <ServiceCategoryTemplate
      title="Allura Full Mouth Reconstruction™"
      eyebrow="Odontología Integral"
      subtitle="Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura."
      description="Para pacientes que han perdido piezas, presentan deterioro severo o necesitan una rehabilitación completa, diseñamos un plan integral respaldado por tecnología 3D de última generación y un equipo de especialistas altamente certificados. Cada caso es único y cada plan es hecho a medida."
      categorySlug="full-mouth-reconstruction"
      heroImage="/images/imagenes_web/Allura-Full-Mouth-Reconstruction.jpg"
      subServices={subServices}
    />
  );
}
