import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "Replacement of Failed Restorations — Allura Full Mouth Reconstruction™"
      : "Reemplazo de Restauraciones Fallidas — Allura Full Mouth Reconstruction™",
    description: locale === "en"
      ? "Evaluation and replacement of old, fractured or infiltrated restorations in Medellín. Starting over on a healthy foundation."
      : "Evaluación y sustitución de restauraciones antiguas, fracturadas o con infiltración en Medellín. Volvemos a empezar sobre una base sana.",
  };
}

const contentEs = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Reemplazo de Restauraciones Fallidas",
  description: "Evaluación integral y sustitución de restauraciones antiguas con amalgama, resinas infiltradas, coronas fracturadas o implantes fallidos. Empezamos desde cero con materiales de última generación.",
  benefits: [
    "Eliminación de focos de infiltración o infección en restauraciones antiguas",
    "Sustitución de amalgamas por restauraciones libres de metal",
    "Materiales biocompatibles de última generación",
    "Restauración de la estética en zonas anteriores y posteriores",
    "Diagnóstico con tecnología de detección temprana de caries",
    "Plan escalonado para renovar todo en el menor número de visitas",
  ],
  steps: [
    { title: "Diagnóstico con tecnología de detección temprana", description: "Uso de cámara intraoral, radiografías digitales y transiluminación para detectar infiltración no visible a simple vista." },
    { title: "Retiro de restauraciones existentes", description: "Remoción cuidadosa de resinas, amalgamas o coronas antiguas preservando el máximo tejido dental sano." },
    { title: "Tratamiento del diente subyacente", description: "Endodoncia, reconstrucción o cualquier tratamiento necesario antes de la nueva restauración." },
    { title: "Nueva restauración definitiva", description: "Instalación de resinas compuestas, cerámicas o coronas de porcelana según el caso." },
  ],
  candidates: [
    "Pacientes con restauraciones antiguas de amalgama que desean reemplazarlas",
    "Personas con sensibilidad dental persistente en zonas restauradas",
    "Casos con coronas fracturadas, levantadas o con caries secundaria",
    "Pacientes con implantes con complicaciones que requieren evaluación",
  ],
  timeline: "El tiempo varía según la cantidad de restauraciones. Una primera visita de 5-7 días en Medellín suele ser suficiente para completar la mayoría de los reemplazos.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Replacement of Failed Restorations",
  description: "Comprehensive evaluation and replacement of old amalgam restorations, infiltrated composites, fractured crowns or failed implants. Starting fresh with next-generation materials.",
  benefits: [
    "Elimination of infiltration or infection foci in old restorations",
    "Replacement of amalgams with metal-free restorations",
    "Next-generation biocompatible materials",
    "Restoration of aesthetics in anterior and posterior areas",
    "Diagnosis with early cavity detection technology",
    "Phased plan to renew everything in the fewest number of visits",
  ],
  steps: [
    { title: "Diagnosis with early detection technology", description: "Use of intraoral camera, digital X-rays and transillumination to detect infiltration not visible to the naked eye." },
    { title: "Removal of existing restorations", description: "Careful removal of old composites, amalgams or crowns preserving the maximum amount of healthy dental tissue." },
    { title: "Treatment of the underlying tooth", description: "Endodontics, reconstruction or any necessary treatment before the new restoration." },
    { title: "New definitive restoration", description: "Installation of composite resins, ceramics or porcelain crowns depending on the case." },
  ],
  candidates: [
    "Patients with old amalgam restorations who wish to replace them",
    "People with persistent dental sensitivity in restored areas",
    "Cases with fractured, dislodged crowns or secondary decay",
    "Patients with implant complications requiring evaluation",
  ],
  timeline: "Time varies depending on the number of restorations. A first visit of 5-7 days in Medellín is usually sufficient to complete most replacements.",
  specialty: "odontologia" as const,
};

export default function ReemplazoCRestauracionesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
