import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Alineadores Transparentes — Allura Aligners™",
  description: "Alineadores de alta precisión fabricados a medida con escáner digital 3D en Medellín. Sin impresiones, sin brackets, con resultado visible.",
};

export default function AlineadoresTransparentesPage() {
  return (
    <ServiceDetailTemplate
      category="Allura Aligners"
      categorySlug="aligners"
      title="Alineadores Transparentes"
      description="Alineadores de alta precisión fabricados a medida mediante escáner intraoral digital, sin impresiones físicas incómodas. Ortodoncia discreta, eficiente y diseñada para la vida de nuestros pacientes internacionales."
      benefits={[
        "Ortodoncia completamente invisible en la vida diaria",
        "Sin impresiones de alginato — solo escáner digital 3D",
        "Material termoplástico médico de alta resistencia y claridad",
        "Removibles para comer, beber y limpiar los dientes",
        "Sin restricciones alimentarias ni riesgo de fractura de brackets",
        "Seguimiento adaptado a pacientes que viven fuera de Colombia",
      ]}
      steps={[
        { title: "Diagnóstico y escáner digital", description: "Evaluación ortodóncica completa y escáner intraoral 3D como base para el diseño del tratamiento." },
        { title: "Planificación digital", description: "Diseño del movimiento dental paso a paso y generación de la simulación del resultado final antes de fabricar." },
        { title: "Fabricación y primera entrega", description: "Los alineadores se fabrican con impresoras 3D de alta precisión y se entregan con el plan de cambio por etapas." },
        { title: "Seguimiento y controles remotos", description: "Monitoreo mediante fotografías y videollamadas con el especialista. Envío de nuevos alineadores por correo internacional si aplica." },
      ]}
      candidates={[
        "Adultos y adolescentes con casos de apiñamiento o espaciado",
        "Pacientes con pequeñas recidivas de ortodoncia previa",
        "Personas que desean discreción total durante el tratamiento",
        "Pacientes internacionales que no pueden hacer visitas frecuentes",
      ]}
      timeline="Entre 4 y 18 meses según la complejidad del caso. La visita inicial a Medellín dura 2-3 días y el seguimiento se realiza remotamente en su mayor parte."
      specialty="odontologia"
    />
  );
}
