import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Coronas en Porcelana — Allura Smile Makeover™",
  description: "Fundas de porcelana de alta resistencia en Medellín. Restaura dientes dañados con apariencia, función y resistencia totales.",
};

export default function CoronasPorcelanaPage() {
  return (
    <ServiceDetailTemplate
      category="Smile Makeover"
      categorySlug="smile-makeover"
      title="Coronas en Porcelana"
      description="Fundas de porcelana o zirconio que recubren completamente el diente dañado, devolviéndole su forma, función, resistencia y una apariencia perfectamente natural."
      benefits={[
        "Restauración completa de dientes muy deteriorados sin extraerlos",
        "Porcelana o zirconio de alta resistencia y aspecto ultranatural",
        "Personalización de color, forma y translucidez para armonizar con los dientes vecinos",
        "Protección completa del diente subyacente",
        "Durabilidad superior a 15 años con cuidado adecuado",
        "Sin necesidad de extracción en la mayoría de los casos",
      ]}
      steps={[
        { title: "Evaluación y preparación dental", description: "El especialista evalúa el estado del diente y realiza la preparación (reducción controlada) para alojar la corona." },
        { title: "Escáner digital e impresión digital", description: "Toma de impresión digital 3D para fabricar la corona con precisión en laboratorio de tecnología CAD/CAM." },
        { title: "Corona provisional", description: "Instalación de corona provisional durante el período de fabricación de la definitiva para proteger el diente y evaluar estética." },
        { title: "Instalación definitiva", description: "Cementación de la corona de porcelana definitiva con ajuste de oclusión y acabado final profesional." },
      ]}
      candidates={[
        "Dientes con fracturas extensas que no pueden restaurarse con resina",
        "Piezas tratadas con endodoncia que requieren protección total",
        "Dientes con gran destrucción por caries avanzada",
        "Casos donde las carillas no son suficientes por el grado de daño",
      ]}
      timeline="La fabricación de coronas toma entre 1 y 2 semanas. El proceso completo (evaluación, preparación, provisional y definitiva) requiere entre 7 y 12 días en Medellín."
      specialty="odontologia"
    />
  );
}
