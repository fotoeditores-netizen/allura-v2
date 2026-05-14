import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Blefaroplastia — Allura Facial Harmony™",
  description: "Cirugía de párpados en Medellín para una mirada más descansada y juvenil. Blefaroplastia superior e inferior.",
};

export default function BlefaroplastiaPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Blefaroplastia"
      description="Cirugía de párpados para corregir el exceso de piel, la grasa herniad y la flacidez de la zona periocular, logrando una mirada más fresca, descansada y rejuvenecida sin alterar la expresión característica del paciente."
      benefits={[
        "Corrección del exceso de piel en párpados superiores e inferiores",
        "Eliminación de bolsas de grasa bajo los ojos",
        "Mirada más abierta, descansada y juvenil",
        "Cicatrices mínimas ocultas en los pliegues naturales del párpado",
        "Recuperación relativamente rápida comparada con otras cirugías faciales",
        "Resultado permanente — el tejido extraído no regresa",
      ]}
      steps={[
        { title: "Evaluación oftalmológica y estética", description: "Descarte de condiciones oftalmológicas que puedan contraindicar la cirugía. Fotografía clínica y análisis estético detallado." },
        { title: "Exámenes preoperatorios", description: "Laboratorios, evaluación cardiovascular y cualquier estudio requerido según el estado de salud del paciente." },
        { title: "Cirugía con anestesia local y sedación", description: "Procedimiento bajo sedación consciente y anestesia local. Duración entre 1 y 2 horas según si son párpados superiores, inferiores o ambos." },
        { title: "Recuperación y seguimiento", description: "Reposo de 5 a 7 días en Medellín. Retiro de puntos a los 5-7 días. Seguimiento remoto posterior." },
      ]}
      candidates={[
        "Adultos con exceso de piel en párpados superiores que afecta la visión o la estética",
        "Personas con bolsas grasas persistentes bajo los ojos",
        "Pacientes en buen estado de salud general sin contraindicaciones oftalmológicas",
        "Casos que desean rejuvenecimiento de la mirada sin cambiar la expresión facial",
      ]}
      timeline="La cirugía dura 1-2 horas. Se requieren 10-12 días en Medellín (cirugía + recuperación inicial + retiro de puntos). El resultado final se aprecia completamente a los 3 meses."
      specialty="facial"
    />
  );
}
