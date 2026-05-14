import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Planificación Personalizada — Allura Aligners™",
  description: "Simulación animada de tu tratamiento de ortodoncia en Medellín. Ve paso a paso cómo se moverán tus dientes antes de comenzar.",
};

export default function PlanificacionPersonalizadaPage() {
  return (
    <ServiceDetailTemplate
      category="Allura Aligners"
      categorySlug="aligners"
      title="Planificación Personalizada"
      description="Simulación digital animada y detallada de tu tratamiento completo: ves exactamente cómo se moverá cada diente, en qué orden y cuánto tiempo tomará, antes de que se fabriquen los alineadores."
      benefits={[
        "Visualización 3D animada del movimiento dental paso a paso",
        "Aprobación del resultado final antes de comenzar el tratamiento",
        "Comunicación precisa de expectativas y objetivos entre especialista y paciente",
        "Ajustes posibles antes de la fabricación definitiva",
        "Estimación precisa de la duración y el número de etapas",
        "Plan compartible por correo electrónico para revisión desde tu país",
      ]}
      steps={[
        { title: "Análisis de escáner y registros", description: "El especialista analiza el escáner 3D, fotografías y radiografías para elaborar el plan de tratamiento." },
        { title: "Diseño de la secuencia de movimientos", description: "Diseño etapa por etapa de los movimientos dentales, considerando prioridades clínicas y objetivos estéticos." },
        { title: "Revisión conjunta con el paciente", description: "Presentación del plan animado al paciente en pantalla con explicación de cada fase del tratamiento." },
        { title: "Aprobación y fabricación", description: "Tras la aprobación del paciente, se inicia la fabricación de todos los alineadores del plan de tratamiento." },
      ]}
      candidates={[
        "Todos los pacientes de alineadores reciben una planificación personalizada",
        "Pacientes que desean entender completamente su tratamiento antes de comprometerse",
        "Casos internacionales que toman decisiones a distancia antes de viajar",
        "Personas con alta exigencia estética que quieren aprobar el resultado esperado",
      ]}
      timeline="La planificación se presenta en la primera consulta o se envía digitalmente al paciente. La revisión y aprobación pueden hacerse por videollamada desde cualquier país."
      specialty="odontologia"
    />
  );
}
