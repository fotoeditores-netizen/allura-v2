import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Coordinación con Cirugía Maxilofacial — Allura Facial Harmony™",
  description: "Planificación interdisciplinaria en Medellín entre odontología y cirugía maxilofacial para casos que requieren corrección ósea facial.",
};

export default function CirugiaMaxilofacialPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Coordinación con Cirugía Maxilofacial"
      description="Planificación interdisciplinaria que integra odontología y cirugía maxilofacial para casos complejos que requieren corrección ósea de la mandíbula, el maxilar superior o las estructuras faciales profundas."
      benefits={[
        "Coordinación sin costura entre odontología y cirugía maxilofacial",
        "Planificación digital preoperatoria con guías quirúrgicas 3D",
        "Tratamiento de maloclusiones esqueléticas severas no resolubles con ortodoncia",
        "Corrección de asimetrías faciales de base ósea",
        "Equipo interdisciplinario con protocolos internacionales",
        "Seguimiento conjunto durante todo el proceso de recuperación",
      ]}
      steps={[
        { title: "Diagnóstico interdisciplinario", description: "Evaluación conjunta entre el ortodoncista y el cirujano maxilofacial de Allura, con cefalometría digital y modelos 3D." },
        { title: "Preparación ortodóncica prequirúrgica", description: "Alineación dental mediante brackets o alineadores para preparar la dentición para la cirugía. Este período puede durar 12-18 meses." },
        { title: "Cirugía ortognática", description: "Procedimiento quirúrgico bajo anestesia general para reposicionar los maxilares y/o la mandíbula según el plan establecido." },
        { title: "Ortodoncia postoperatoria y seguimiento", description: "Finalización del tratamiento ortodóncico tras la cirugía para conseguir la oclusión óptima planificada." },
      ]}
      candidates={[
        "Pacientes con maloclusión esquelética severa (clase II o clase III ósea)",
        "Casos con asimetría facial de origen óseo",
        "Personas con apnea obstructiva del sueño relacionada con la morfología maxilofacial",
        "Pacientes que no responden al tratamiento ortodóncico convencional",
      ]}
      timeline="El tratamiento completo puede durar entre 18 y 36 meses, incluyendo las fases de ortodoncia pre y postquirúrgica. La cirugía en sí requiere hospitalización de 1-2 días y recuperación inicial de 10-14 días en Medellín."
      specialty="facial"
    />
  );
}
