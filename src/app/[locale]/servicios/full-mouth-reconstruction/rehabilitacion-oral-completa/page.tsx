import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "Full Oral Rehabilitation — Allura Full Mouth Reconstruction™"
      : "Rehabilitación Oral Completa — Allura Full Mouth Reconstruction™",
    description: locale === "en"
      ? "Comprehensive oral rehabilitation in Medellín for severe deterioration cases. Restore function, periodontal health and dental aesthetics."
      : "Rehabilitación oral integral en Medellín para casos de deterioro severo. Recupera función, salud periodontal y estética dental.",
  };
}

const contentEs = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Rehabilitación Oral Completa",
  description: "Tratamiento integral que combina múltiples especialidades odontológicas para restaurar la salud, función y estética de toda la boca en casos de deterioro severo o múltiple.",
  benefits: [
    "Tratamiento coordinado por un equipo multidisciplinario de especialistas",
    "Restauración simultánea de función masticatoria, salud gingival y estética",
    "Plan de tratamiento personalizado por fases para mayor comodidad",
    "Tecnología de diagnóstico 3D para planificación precisa",
    "Eliminación de focos infecciosos y restauración de la salud bucal integral",
    "Seguimiento remoto entre fases para pacientes internacionales",
  ],
  steps: [
    { title: "Diagnóstico integral", description: "Evaluación completa de dientes, encías, oclusión, articulación temporomandibular y tejidos blandos mediante radiografías y escáner 3D." },
    { title: "Fase de saneamiento", description: "Tratamiento periodontal, extracciones necesarias, endodoncias y cualquier procedimiento previo requerido." },
    { title: "Fase protésica", description: "Instalación de implantes, coronas, puentes o combinaciones según el plan diseñado para cada caso." },
    { title: "Mantenimiento y seguimiento", description: "Controles periódicos y protocolo de mantenimiento para garantizar la longevidad de todos los tratamientos realizados." },
  ],
  candidates: [
    "Pacientes con deterioro dental severo por caries múltiple avanzada",
    "Personas con erosión dental significativa por reflujo o hábitos alimenticios",
    "Casos con pérdida de dimensión vertical o problemas de mordida",
    "Pacientes con múltiples piezas fracturadas, desgastadas o perdidas",
  ],
  timeline: "La rehabilitación oral completa puede tomar entre 6 meses y 2 años según la complejidad. Se planifica en fases coordinadas con las visitas del paciente internacional a Medellín.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Full Oral Rehabilitation",
  description: "Comprehensive treatment combining multiple dental specialties to restore the health, function and aesthetics of the entire mouth in cases of severe or multiple deterioration.",
  benefits: [
    "Treatment coordinated by a multidisciplinary team of specialists",
    "Simultaneous restoration of masticatory function, gingival health and aesthetics",
    "Personalized phased treatment plan for greater comfort",
    "3D diagnostic technology for precise planning",
    "Elimination of infectious foci and restoration of comprehensive oral health",
    "Remote follow-up between phases for international patients",
  ],
  steps: [
    { title: "Comprehensive diagnosis", description: "Complete evaluation of teeth, gums, occlusion, temporomandibular joint and soft tissues using X-rays and 3D scanner." },
    { title: "Sanitation phase", description: "Periodontal treatment, necessary extractions, endodontics and any prior procedures required." },
    { title: "Prosthetic phase", description: "Installation of implants, crowns, bridges or combinations according to the plan designed for each case." },
    { title: "Maintenance and follow-up", description: "Periodic check-ups and maintenance protocol to ensure the longevity of all treatments performed." },
  ],
  candidates: [
    "Patients with severe dental deterioration due to advanced multiple cavities",
    "People with significant dental erosion from reflux or dietary habits",
    "Cases with loss of vertical dimension or bite problems",
    "Patients with multiple fractured, worn or missing teeth",
  ],
  timeline: "Full oral rehabilitation can take between 6 months and 2 years depending on complexity. It is planned in phases coordinated with the international patient's visits to Medellín.",
  specialty: "odontologia" as const,
};

export default function RehabilitacionOralPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
