import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Reemplazo de Restauraciones Fallidas — Allura Full Mouth Reconstruction™",
  description: "Evaluación y sustitución de restauraciones antiguas, fracturadas o con infiltración en Medellín. Volvemos a empezar sobre una base sana.",
};

export default function ReemplazoCRestauracionesPage() {
  return (
    <ServiceDetailTemplate
      category="Full Mouth Reconstruction"
      categorySlug="full-mouth-reconstruction"
      title="Reemplazo de Restauraciones Fallidas"
      description="Evaluación integral y sustitución de restauraciones antiguas con amalgama, resinas infiltradas, coronas fracturadas o implantes fallidos. Empezamos desde cero con materiales de última generación."
      benefits={[
        "Eliminación de focos de infiltración o infección en restauraciones antiguas",
        "Sustitución de amalgamas por restauraciones libres de metal",
        "Materiales biocompatibles de última generación",
        "Restauración de la estética en zonas anteriores y posteriores",
        "Diagnóstico con tecnología de detección temprana de caries",
        "Plan escalonado para renovar todo en el menor número de visitas",
      ]}
      steps={[
        { title: "Diagnóstico con tecnología de detección temprana", description: "Uso de cámara intraoral, radiografías digitales y transiluminación para detectar infiltración no visible a simple vista." },
        { title: "Retiro de restauraciones existentes", description: "Remoción cuidadosa de resinas, amalgamas o coronas antiguas preservando el máximo tejido dental sano." },
        { title: "Tratamiento del diente subyacente", description: "Endodoncia, reconstrucción o cualquier tratamiento necesario antes de la nueva restauración." },
        { title: "Nueva restauración definitiva", description: "Instalación de resinas compuestas, cerámicas o coronas de porcelana según el caso." },
      ]}
      candidates={[
        "Pacientes con restauraciones antiguas de amalgama que desean reemplazarlas",
        "Personas con sensibilidad dental persistente en zonas restauradas",
        "Casos con coronas fracturadas, levantadas o con caries secundaria",
        "Pacientes con implantes con complicaciones que requieren evaluación",
      ]}
      timeline="El tiempo varía según la cantidad de restauraciones. Una primera visita de 5-7 días en Medellín suele ser suficiente para completar la mayoría de los reemplazos."
      specialty="odontologia"
    />
  );
}
