import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Carillas en Porcelana — Allura Smile Makeover™",
  description: "Láminas ultrafinas de porcelana en Medellín para transformar color, forma y alineación con resultados ultranatural.",
};

export default function CarillasPorcelanaPage() {
  return (
    <ServiceDetailTemplate
      category="Smile Makeover"
      categorySlug="smile-makeover"
      title="Carillas en Porcelana"
      description="Láminas ultrafinas de porcelana adheridas a la superficie de los dientes para transformar radicalmente color, forma, tamaño y alineación sin necesidad de ortodoncia ni procedimientos invasivos."
      benefits={[
        "Transformación estética radical con mínima reducción del diente",
        "Porcelana translúcida que imita perfectamente el esmalte natural",
        "Resistencia al manchado superior al esmalte natural",
        "Resultado inmediato sin meses de tratamiento de ortodoncia",
        "Personalización total de color, forma y tamaño",
        "Durabilidad de 10 a 20 años con cuidado adecuado",
      ]}
      steps={[
        { title: "Diseño digital de sonrisa", description: "Simulación fotorrealista del resultado esperado antes de preparar ningún diente. El paciente aprueba el diseño." },
        { title: "Preparación dental mínima", description: "Reducción mínima del esmalte (0.3-0.7mm) para alojar la carilla. Técnica preservadora que protege el diente." },
        { title: "Prueba en boca (mock-up)", description: "Instalación temporal del diseño para evaluar estética, fonética y comodidad antes de la carilla definitiva." },
        { title: "Adhesión definitiva", description: "Cementación de las carillas de porcelana con sistemas adhesivos de alta resistencia y acabado final." },
      ]}
      candidates={[
        "Pacientes con manchas intrínsecas que no responden al blanqueamiento",
        "Personas con dientes pequeños, desgastados o con forma irregular",
        "Casos con pequeños diastemas o leve apiñamiento sin problemas de mordida",
        "Pacientes que buscan una transformación estética completa en poco tiempo",
      ]}
      timeline="El proceso completo dura entre 2 y 3 semanas desde la planificación hasta la instalación definitiva. Requiere entre 7 y 10 días en Medellín."
      specialty="odontologia"
    />
  );
}
