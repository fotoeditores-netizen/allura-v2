import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Blanqueamiento Dental Profesional — Allura Smile Makeover™",
  description: "Protocolo clínico de blanqueamiento supervisado en Medellín para resultados seguros, uniformes y duraderos.",
};

export default function BlanqueamientoDentalPage() {
  return (
    <ServiceDetailTemplate
      category="Smile Makeover"
      categorySlug="smile-makeover"
      title="Blanqueamiento Dental Profesional"
      description="Protocolo clínico de blanqueamiento supervisado por nuestros especialistas para lograr resultados seguros, uniformes y duraderos que suponen lo que puede lograrse con blanqueamiento casero sin supervisión."
      benefits={[
        "Aclaramiento de hasta 8 tonos en una sola sesión clínica",
        "Control profesional que garantiza resultados uniformes",
        "Protección gingival durante todo el procedimiento",
        "Sin daño al esmalte cuando se realiza bajo supervisión especializada",
        "Protocolo de mantenimiento personalizado para prolongar el resultado",
        "Compatible y previo a otros tratamientos estéticos como carillas",
      ]}
      steps={[
        { title: "Evaluación del estado dental", description: "Limpieza profesional y revisión de obturaciones o zonas sensibles que puedan afectar el resultado o la tolerancia al tratamiento." },
        { title: "Protección gingival", description: "Aplicación de barrera de resina fotopolimerizable en la encía para protegerla completamente durante el blanqueamiento." },
        { title: "Aplicación del gel blanqueador", description: "Aplicación de peróxido de hidrógeno de alta concentración en los dientes y activación con luz de polimerización LED." },
        { title: "Plan de mantenimiento domiciliario", description: "Entrega de cubetas personalizadas y gel de menor concentración para mantener el resultado desde casa." },
      ]}
      candidates={[
        "Pacientes con dientes amarillos, grises o manchados por café, té o tabaco",
        "Personas con pigmentación intrínseca leve a moderada",
        "Pacientes que quieren mejorar su sonrisa antes de un evento importante",
        "Como paso previo a la instalación de carillas o restauraciones estéticas",
      ]}
      timeline="Una sesión de blanqueamiento clínico dura entre 60 y 90 minutos. Se puede complementar con blanqueamiento domiciliario durante 1-2 semanas adicionales desde tu país."
      specialty="odontologia"
    />
  );
}
