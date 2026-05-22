import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "Structural Facial Assessment — Allura Facial Harmony™"
      : "Evaluación Facial Estructural — Allura Facial Harmony™",
    description: locale === "en"
      ? "Complete facial proportion analysis in Medellín to design a personalized harmonization plan."
      : "Análisis completo de proporciones faciales en Medellín para diseñar un plan de armonización personalizado.",
  };
}

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Evaluación Facial Estructural",
  description: "Análisis detallado de tus proporciones faciales, estructura ósea, volúmenes y rasgos característicos para diseñar un plan de armonización coherente con tu identidad. La evaluación es el primer paso de cualquier tratamiento facial en Allura.",
  benefits: [
    "Análisis facial basado en proporciones áureas y criterios médicos",
    "Plan de tratamiento personalizado sin procedimientos innecesarios",
    "Fotografía clínica estandarizada de frente, perfil y 3/4",
    "Discusión abierta de expectativas y posibilidades reales",
    "Sin compromiso posterior a la evaluación",
    "Disponible como consulta virtual previa al viaje a Medellín",
  ],
  steps: [
    { title: "Historia clínica y objetivos", description: "Conversación amplia sobre motivaciones, expectativas, historial de procedimientos previos y estado de salud general." },
    { title: "Fotografía clínica estandarizada", description: "Registro fotográfico profesional en múltiples ángulos para análisis de proporciones y asimetrías." },
    { title: "Análisis de proporciones faciales", description: "Evaluación de tercios faciales, ángulos nasofaciales, nasolabiales, proyección del mentón y armonía general." },
    { title: "Plan y recomendaciones", description: "Presentación de opciones de tratamiento con expectativas realistas, orden de procedimientos recomendado y presupuesto." },
  ],
  candidates: [
    "Cualquier paciente interesado en procedimientos de medicina facial estética",
    "Personas que desean orientación antes de decidir qué procedimiento realizarse",
    "Pacientes que han tenido procedimientos previos y buscan una segunda opinión",
    "Quienes quieren resultados naturales y coherentes con sus rasgos",
  ],
  timeline: "La evaluación se realiza en una sola cita de 60 a 90 minutos. También puede hacerse como consulta virtual previa antes de viajar a Medellín.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Structural Facial Assessment",
  description: "Detailed analysis of your facial proportions, bone structure, volumes and characteristic features to design a harmonization plan consistent with your identity. The assessment is the first step of any facial treatment at Allura.",
  benefits: [
    "Facial analysis based on golden proportions and medical criteria",
    "Personalized treatment plan without unnecessary procedures",
    "Standardized clinical photography from the front, profile and 3/4 angle",
    "Open discussion of expectations and realistic possibilities",
    "No commitment required after the assessment",
    "Available as a virtual consultation before traveling to Medellín",
  ],
  steps: [
    { title: "Clinical history and goals", description: "Comprehensive conversation about motivations, expectations, history of prior procedures and general health status." },
    { title: "Standardized clinical photography", description: "Professional photography at multiple angles for analysis of proportions and asymmetries." },
    { title: "Facial proportion analysis", description: "Assessment of facial thirds, nasofacial angles, nasolabial angles, chin projection and overall harmony." },
    { title: "Plan and recommendations", description: "Presentation of treatment options with realistic expectations, recommended procedure sequence and budget." },
  ],
  candidates: [
    "Any patient interested in facial aesthetic medicine procedures",
    "People who want guidance before deciding which procedure to undergo",
    "Patients who have had previous procedures and are looking for a second opinion",
    "Those who want natural results consistent with their features",
  ],
  timeline: "The assessment is conducted in a single appointment of 60 to 90 minutes. It can also be done as a virtual consultation before traveling to Medellín.",
  specialty: "facial" as const,
};

export default function EvaluacionFacialPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
