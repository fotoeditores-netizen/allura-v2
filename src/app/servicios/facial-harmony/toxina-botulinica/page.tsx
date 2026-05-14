import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Toxina Botulínica y Rellenos Dérmicos — Allura Facial Harmony™",
  description: "Aplicación precisa de toxina botulínica y ácido hialurónico en Medellín para resultados faciales naturales y duraderos.",
};

export default function ToxinaBotulinicaPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Toxina Botulínica y Rellenos Dérmicos"
      description="Aplicación de toxina botulínica y ácido hialurónico con criterio médico y visión artística para suavizar expresiones, restaurar volumen y armonizar el rostro con resultados naturales que no se notan pero se perciben."
      benefits={[
        "Resultados visibles desde las 72 horas para la toxina botulínica",
        "Sin cirugía, sin anestesia general, sin período de recuperación significativo",
        "Técnicas de inyección avanzadas para resultados naturales y simétricos",
        "Productos de marca reconocida con registro sanitario INVIMA",
        "Planificación por zonas: frente, entrecejo, patas de gallo, pómulos, labios",
        "Resultado reversible con hialuronidasa en el caso de rellenos con ácido hialurónico",
      ]}
      steps={[
        { title: "Evaluación y mapeo facial", description: "El especialista analiza la musculatura facial, volúmenes y asimetrías para diseñar el plan de aplicación zona a zona." },
        { title: "Planificación del tratamiento", description: "Definición de los productos, dosis y puntos de aplicación exactos según el objetivo de cada zona." },
        { title: "Aplicación del tratamiento", description: "Inyecciones precisas con agujas ultrafinas o cánulas bajo protocolo de asepsia estricto. El procedimiento dura 20-45 minutos." },
        { title: "Control y seguimiento", description: "Control a los 14 días para evaluar el resultado y realizar ajustes si fuera necesario." },
      ]}
      candidates={[
        "Adultos con líneas de expresión o arrugas dinámicas",
        "Personas que desean restaurar volumen facial perdido con el envejecimiento",
        "Casos de asimetría labial o facial que se benefician de corrección con rellenos",
        "Pacientes que buscan resultados naturales sin cirugía",
      ]}
      timeline="El procedimiento dura entre 30 y 60 minutos. El resultado de la toxina botulínica aparece en 3-7 días y dura 4-6 meses. Los rellenos de ácido hialurónico duran entre 9 y 18 meses según la zona."
      specialty="facial"
    />
  );
}
