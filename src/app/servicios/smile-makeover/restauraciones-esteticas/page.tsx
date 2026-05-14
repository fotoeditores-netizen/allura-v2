import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Restauraciones Estéticas Avanzadas — Allura Smile Makeover™",
  description: "Técnicas adhesivas de última generación en Medellín para corregir fracturas, manchas y diastemas con mínima invasión.",
};

export default function RestauracionesEsteticasPage() {
  return (
    <ServiceDetailTemplate
      category="Smile Makeover"
      categorySlug="smile-makeover"
      title="Restauraciones Estéticas Avanzadas"
      description="Técnicas adhesivas mínimamente invasivas de última generación para corregir fracturas, manchas, irregularidades y diastemas sin necesidad de coronas ni procedimientos más extensos."
      benefits={[
        "Mínima o nula reducción del diente natural",
        "Resinas nanocompositas de alta estética con aspecto de porcelana",
        "Corrección de fracturas, manchas, diastemas y formas irregulares",
        "Resultado inmediato en una sola sesión en muchos casos",
        "Técnica reversible en la mayoría de las situaciones",
        "Excelente relación entre resultado estético y costo del tratamiento",
      ]}
      steps={[
        { title: "Diagnóstico y plan estético", description: "Evaluación clínica y fotográfica para determinar el mejor enfoque según el tipo y extensión de cada irregularidad." },
        { title: "Selección de color y forma", description: "Elección del tono de resina y diseño de la forma final con la participación activa del paciente." },
        { title: "Restauración directa", description: "Aplicación y modelado de la resina compuesta de alta estética directamente en el diente, capa por capa." },
        { title: "Pulido y acabado final", description: "Pulido con instrumentos especializados para lograr superficie lisa, brillante y armoniosa con los dientes adyacentes." },
      ]}
      candidates={[
        "Dientes con fracturas pequeñas o medianas",
        "Manchas superficiales que no responden al blanqueamiento",
        "Diastemas (espacios entre dientes) de tamaño pequeño a moderado",
        "Pacientes que buscan mejoras estéticas conservadoras y económicas",
      ]}
      timeline="La mayoría de las restauraciones estéticas directas se realizan en 1 a 3 sesiones. El tiempo en Medellín puede ser de 2 a 5 días según la cantidad de piezas a tratar."
      specialty="odontologia"
    />
  );
}
