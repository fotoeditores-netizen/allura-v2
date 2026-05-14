import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Evaluación Facial Estructural — Allura Facial Harmony™",
  description: "Análisis completo de proporciones faciales en Medellín para diseñar un plan de armonización personalizado.",
};

export default function EvaluacionFacialPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Evaluación Facial Estructural"
      description="Análisis detallado de tus proporciones faciales, estructura ósea, volúmenes y rasgos característicos para diseñar un plan de armonización coherente con tu identidad. La evaluación es el primer paso de cualquier tratamiento facial en Allura."
      benefits={[
        "Análisis facial basado en proporciones áureas y criterios médicos",
        "Plan de tratamiento personalizado sin procedimientos innecesarios",
        "Fotografía clínica estandarizada de frente, perfil y 3/4",
        "Discusión abierta de expectativas y posibilidades reales",
        "Sin compromiso posterior a la evaluación",
        "Disponible como consulta virtual previa al viaje a Medellín",
      ]}
      steps={[
        { title: "Historia clínica y objetivos", description: "Conversación amplia sobre motivaciones, expectativas, historial de procedimientos previos y estado de salud general." },
        { title: "Fotografía clínica estandarizada", description: "Registro fotográfico profesional en múltiples ángulos para análisis de proporciones y asimetrías." },
        { title: "Análisis de proporciones faciales", description: "Evaluación de tercios faciales, ángulos nasofaciales, nasolabiales, proyección del mentón y armonía general." },
        { title: "Plan y recomendaciones", description: "Presentación de opciones de tratamiento con expectativas realistas, orden de procedimientos recomendado y presupuesto." },
      ]}
      candidates={[
        "Cualquier paciente interesado en procedimientos de medicina facial estética",
        "Personas que desean orientación antes de decidir qué procedimiento realizarse",
        "Pacientes que han tenido procedimientos previos y buscan una segunda opinión",
        "Quienes quieren resultados naturales y coherentes con sus rasgos",
      ]}
      timeline="La evaluación se realiza en una sola cita de 60 a 90 minutos. También puede hacerse como consulta virtual previa antes de viajar a Medellín."
      specialty="facial"
    />
  );
}
