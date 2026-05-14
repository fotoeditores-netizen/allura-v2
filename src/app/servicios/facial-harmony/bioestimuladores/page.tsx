import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Bioestimuladores y Rejuvenecimiento — Allura Facial Harmony™",
  description: "Tratamientos de última generación en Medellín que estimulan la producción natural de colágeno para un rejuvenecimiento progresivo y duradero.",
};

export default function BioestimuldadoresPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Bioestimuladores y Rejuvenecimiento"
      description="Tratamientos inyectables de última generación que estimulan el propio organismo para producir colágeno, elastina y otros componentes de la dermis, logrando un rejuvenecimiento progresivo, profundo y de larga duración."
      benefits={[
        "Estimulación natural de la producción de colágeno y elastina",
        "Mejora progresiva que se intensifica durante meses",
        "Resultados que duran entre 18 meses y 3 años según el producto",
        "Sin aspecto artificial ni aspecto inflado",
        "Compatible con otros procedimientos estéticos faciales",
        "Mejora de la calidad y firmeza de la piel en general",
      ]}
      steps={[
        { title: "Evaluación de calidad dérmica", description: "Análisis del estado de la piel, grado de laxitud, volumen y calidad dérmica para seleccionar el bioestimulador más adecuado." },
        { title: "Selección del protocolo", description: "Elección entre Sculptra®, Radiesse®, Ellanse® u otros bioestimuladores disponibles según las necesidades del paciente." },
        { title: "Aplicación con técnica avanzada", description: "Inyección con cánula o aguja según la zona tratada, bajo protocolo de asepsia estricto y mapeo facial previo." },
        { title: "Seguimiento a los 30-90 días", description: "Control del resultado a medio plazo para evaluar la respuesta biológica y planificar sesiones adicionales si corresponde." },
      ]}
      candidates={[
        "Adultos de 35 a 65 años con signos de envejecimiento cutáneo progresivo",
        "Pacientes con pérdida de firmeza y tonicidad en piel del rostro y cuello",
        "Personas que buscan resultados naturales y duraderos sin cirugía",
        "Casos donde se quiere mejorar la calidad de la piel más allá del volumen",
      ]}
      timeline="La sesión dura entre 30 y 60 minutos. Se pueden requerir 1 a 3 sesiones. El resultado final se aprecia a los 2-3 meses de la última aplicación y puede durar entre 18 meses y 3 años."
      specialty="facial"
    />
  );
}
