import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Rinoplastia — Allura Facial Harmony™",
  description: "Refinamiento de la nariz en Medellín en equilibrio con tus rasgos faciales. Rinoplastia estética y funcional bajo criterio médico estricto.",
};

export default function RinoplastiaPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Rinoplastia"
      description="Cirugía de refinamiento nasal orientada a mejorar la armonía del perfil y la estética del rostro en conjunto, siempre respetando la identidad del paciente y priorizando resultados naturales sobre cambios drásticos."
      benefits={[
        "Mejora del equilibrio entre nariz y rasgos faciales",
        "Técnica primaria o de revisión según el historial del paciente",
        "Enfoque en naturalidad y coherencia con la identidad facial del paciente",
        "Combinable con corrección funcional (septum, cornetes) si es necesario",
        "Planificación con morfing fotográfico previo para alineación de expectativas",
        "Seguimiento postoperatorio remoto con nuestro equipo especializado",
      ]}
      steps={[
        { title: "Consulta y morfing fotográfico", description: "Evaluación del caso, análisis de las proporciones nasofaciales y simulación fotográfica del resultado esperado." },
        { title: "Exámenes preoperatorios", description: "Laboratorios, TAC nasal y evaluación médica completa antes de autorizar la cirugía." },
        { title: "Cirugía bajo anestesia general", description: "Procedimiento de 2 a 3 horas bajo anestesia general. Técnica abierta o cerrada según la complejidad del caso." },
        { title: "Recuperación y seguimiento", description: "Reposo de 7 a 10 días en Medellín con retiro de puntos y descangue. Seguimiento remoto hasta los 6-12 meses postoperatorios." },
      ]}
      candidates={[
        "Adultos mayores de 18 años con desarrollo facial completo",
        "Personas con joroba nasal, punta ancha o asimetría que les genera insatisfacción",
        "Pacientes con obstrucción respiratoria que puede corregirse simultáneamente",
        "Casos de rinoplastia de revisión por procedimientos previos insatisfactorios",
      ]}
      timeline="La cirugía dura 2-3 horas. Se requieren 12-14 días en Medellín. El resultado final se evalúa a los 12 meses cuando desaparece el edema residual."
      specialty="facial"
    />
  );
}
