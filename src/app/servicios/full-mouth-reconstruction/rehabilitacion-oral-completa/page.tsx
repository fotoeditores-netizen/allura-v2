import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Rehabilitación Oral Completa — Allura Full Mouth Reconstruction™",
  description: "Rehabilitación oral integral en Medellín para casos de deterioro severo. Recupera función, salud periodontal y estética dental.",
};

export default function RehabilitacionOralPage() {
  return (
    <ServiceDetailTemplate
      category="Full Mouth Reconstruction"
      categorySlug="full-mouth-reconstruction"
      title="Rehabilitación Oral Completa"
      description="Tratamiento integral que combina múltiples especialidades odontológicas para restaurar la salud, función y estética de toda la boca en casos de deterioro severo o múltiple."
      benefits={[
        "Tratamiento coordinado por un equipo multidisciplinario de especialistas",
        "Restauración simultánea de función masticatoria, salud gingival y estética",
        "Plan de tratamiento personalizado por fases para mayor comodidad",
        "Tecnología de diagnóstico 3D para planificación precisa",
        "Eliminación de focos infecciosos y restauración de la salud bucal integral",
        "Seguimiento remoto entre fases para pacientes internacionales",
      ]}
      steps={[
        { title: "Diagnóstico integral", description: "Evaluación completa de dientes, encías, oclusión, articulación temporomandibular y tejidos blandos mediante radiografías y escáner 3D." },
        { title: "Fase de saneamiento", description: "Tratamiento periodontal, extracciones necesarias, endodoncias y cualquier procedimiento previo requerido." },
        { title: "Fase protésica", description: "Instalación de implantes, coronas, puentes o combinaciones según el plan diseñado para cada caso." },
        { title: "Mantenimiento y seguimiento", description: "Controles periódicos y protocolo de mantenimiento para garantizar la longevidad de todos los tratamientos realizados." },
      ]}
      candidates={[
        "Pacientes con deterioro dental severo por caries múltiple avanzada",
        "Personas con erosión dental significativa por reflujo o hábitos alimenticios",
        "Casos con pérdida de dimensión vertical o problemas de mordida",
        "Pacientes con múltiples piezas fracturadas, desgastadas o perdidas",
      ]}
      timeline="La rehabilitación oral completa puede tomar entre 6 meses y 2 años según la complejidad. Se planifica en fases coordinadas con las visitas del paciente internacional a Medellín."
      specialty="odontologia"
    />
  );
}
