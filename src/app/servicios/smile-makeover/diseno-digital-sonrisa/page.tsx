import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Diseño Digital de Sonrisa — Allura Smile Makeover™",
  description: "Simulación fotorrealista de tu nueva sonrisa en Medellín antes del primer procedimiento. Aprueba tu resultado antes de comenzar.",
};

export default function DisenoDigitalSonrisaPage() {
  return (
    <ServiceDetailTemplate
      category="Smile Makeover"
      categorySlug="smile-makeover"
      title="Diseño Digital de Sonrisa"
      description="Simulación fotorrealista de tu nueva sonrisa utilizando fotografías clínicas y software especializado. Ves exactamente cómo quedarás antes de que se toque ningún diente."
      benefits={[
        "Visualización realista del resultado final antes de cualquier procedimiento",
        "Comunicación precisa entre el paciente y el equipo clínico",
        "Posibilidad de ajustar proporción, color y forma hasta aprobar el diseño",
        "Base para la fabricación digital de restauraciones a medida",
        "Reducción de la ansiedad y sorpresas durante el tratamiento",
        "Archivo digital permanente del caso para seguimiento",
      ]}
      steps={[
        { title: "Fotografía clínica estandarizada", description: "Registro fotográfico completo de frente, perfil y sonrisa con iluminación clínica profesional." },
        { title: "Análisis facial y dental", description: "Evaluación de proporciones faciales, línea de la sonrisa, forma y color actual de los dientes." },
        { title: "Diseño digital", description: "El especialista diseña la nueva sonrisa respetando proporciones áureas y los deseos del paciente." },
        { title: "Aprobación y mock-up físico", description: "El paciente aprueba el diseño digital y opcionalmente lo prueba en boca mediante un mock-up de resina temporal." },
      ]}
      candidates={[
        "Cualquier paciente que contemple un tratamiento estético dental",
        "Personas que quieren ver el resultado antes de comprometerse con el tratamiento",
        "Casos con múltiples opciones de tratamiento donde la visualización ayuda a decidir",
        "Pacientes que desean transmitir claramente sus expectativas estéticas al equipo",
      ]}
      timeline="El diseño digital se realiza en 1-2 sesiones de 1 a 2 horas cada una y puede entregarse en formato digital para revisar desde tu país antes de viajar."
      specialty="odontologia"
    />
  );
}
