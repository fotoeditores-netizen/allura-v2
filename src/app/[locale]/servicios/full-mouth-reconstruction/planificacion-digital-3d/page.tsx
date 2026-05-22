import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "3D Digital Planning — Allura Full Mouth Reconstruction™"
      : "Planificación Digital 3D — Allura Full Mouth Reconstruction™",
    description: locale === "en"
      ? "Complete simulation of your case with CAD/CAM technology and 3D intraoral scanner before starting any procedure in Medellín."
      : "Simulación completa de tu caso con tecnología CAD/CAM y escáner intraoral 3D antes de comenzar cualquier procedimiento en Medellín.",
  };
}

const contentEs = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Planificación Digital 3D",
  description: "Antes de cualquier procedimiento, simulamos tu caso completo con tecnología digital de última generación. Ves tu resultado antes de comenzar y el equipo planifica con precisión milimétrica cada paso del tratamiento.",
  benefits: [
    "Visualización del resultado final antes del primer procedimiento",
    "Planificación quirúrgica precisa con guías quirúrgicas digitales",
    "Reducción de la incertidumbre y mejora en la comunicación con el paciente",
    "Fabricación de restauraciones a medida con fresado CAD/CAM",
    "Sin impresiones físicas incómodas — solo escáner digital",
    "Documentación digital completa del caso para seguimiento remoto",
  ],
  steps: [
    { title: "Escáner intraoral 3D", description: "Captura digital de toda la boca en minutos, sin impresiones de alginato. Cómodo, rápido y de alta precisión." },
    { title: "Tomografía cone beam", description: "Imagen tridimensional del hueso maxilar y mandibular para evaluar volumen óseo y estructuras anatómicas clave." },
    { title: "Diseño digital del tratamiento", description: "El equipo diseña el caso en software especializado: posición de implantes, forma de las restauraciones, oclusión y estética." },
    { title: "Presentación al paciente", description: "Revisión conjunta del plan digital antes de comenzar cualquier procedimiento, con opción de ajustes." },
  ],
  candidates: [
    "Todos los pacientes de Full Mouth Reconstruction se benefician de la planificación 3D",
    "Especialmente valioso para casos con implantes o rehabilitación oral compleja",
    "Pacientes internacionales que viajan una sola vez y necesitan máxima precisión",
    "Casos en que el resultado estético es crítico para el paciente",
  ],
  timeline: "La planificación digital se realiza en la primera visita diagnóstica (1-2 días). El plan digital acompaña todo el tratamiento y se comparte con el paciente de forma remota.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "3D Digital Planning",
  description: "Before any procedure, we simulate your complete case with next-generation digital technology. You see your result before starting and the team plans every step of the treatment with millimeter precision.",
  benefits: [
    "Visualization of the final result before the first procedure",
    "Precise surgical planning with digital surgical guides",
    "Reduced uncertainty and improved communication with the patient",
    "Custom restoration fabrication with CAD/CAM milling",
    "No uncomfortable physical impressions — digital scanner only",
    "Complete digital case documentation for remote follow-up",
  ],
  steps: [
    { title: "3D intraoral scanner", description: "Digital capture of the entire mouth in minutes, without alginate impressions. Comfortable, fast and highly precise." },
    { title: "Cone beam CT scan", description: "Three-dimensional image of the upper and lower jawbone to evaluate bone volume and key anatomical structures." },
    { title: "Digital treatment design", description: "The team designs the case in specialized software: implant positions, restoration shapes, occlusion and aesthetics." },
    { title: "Patient presentation", description: "Joint review of the digital plan before starting any procedure, with the option for adjustments." },
  ],
  candidates: [
    "All Full Mouth Reconstruction patients benefit from 3D planning",
    "Especially valuable for cases involving implants or complex oral rehabilitation",
    "International patients who travel once and need maximum precision",
    "Cases where the aesthetic result is critical for the patient",
  ],
  timeline: "Digital planning is carried out at the first diagnostic visit (1-2 days). The digital plan accompanies the entire treatment and is shared with the patient remotely.",
  specialty: "odontologia" as const,
};

export default function PlanificacionDigital3DPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
