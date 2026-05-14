import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Lifting Facial — Allura Facial Harmony™",
  description: "Cirugía de lifting facial en Medellín para reposicionar tejidos y restaurar la definición facial sin resultados artificiales.",
};

export default function LiftingFacialPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Lifting Facial"
      description="Procedimiento quirúrgico que reposiciona los tejidos faciales descendidos para restaurar la definición del óvalo facial, el cuello y el área mandibular sin producir resultados tensos ni artificiales."
      benefits={[
        "Rejuvenecimiento facial profundo y duradero — resultados de 7 a 15 años",
        "Reposición de tejidos sin el aspecto tenso propio de técnicas antiguas",
        "Mejora simultánea de zona mandibular, mejillas y cuello",
        "Cicatrices ocultas en las líneas naturales del pelo y las orejas",
        "Compatible con procedimientos complementarios (blefaroplastia, lipofilling)",
        "Resultado natural que luce como 'tú, pero 10-15 años antes'",
      ]}
      steps={[
        { title: "Evaluación y planificación", description: "Análisis del grado de laxitud facial, calidad de la piel y expectativas del paciente para definir la técnica más adecuada." },
        { title: "Exámenes preoperatorios completos", description: "Laboratorios, evaluación cardiovascular, historial de medicamentos anticoagulantes y preparación preoperatoria." },
        { title: "Cirugía bajo anestesia general", description: "Procedimiento de 3 a 5 horas que puede incluir cuello, mejillas y zona temporal según el plan establecido." },
        { title: "Recuperación supervisada en Medellín", description: "12 a 14 días de recuperación con controles diarios los primeros días, retiro de drenajes y seguimiento del proceso de cicatrización." },
      ]}
      candidates={[
        "Adultos de 45 a 65 años con signos avanzados de envejecimiento facial",
        "Personas con pérdida de definición del óvalo facial y papada",
        "Pacientes con buenas condiciones de salud general sin contraindicaciones anestésicas",
        "Casos que desean resultados duraderos superiores a los obtenidos con tratamientos no invasivos",
      ]}
      timeline="La cirugía dura 3-5 horas. Se requieren entre 14 y 18 días en Medellín para la recuperación inicial. El resultado final se estabiliza a los 3-6 meses."
      specialty="facial"
    />
  );
}
