import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "Digital Smile Design — Allura Smile Makeover™"
      : "Diseño Digital de Sonrisa — Allura Smile Makeover™",
    description: locale === "en"
      ? "Photorealistic simulation of your new smile in Medellín before the first procedure. Approve your result before starting."
      : "Simulación fotorrealista de tu nueva sonrisa en Medellín antes del primer procedimiento. Aprueba tu resultado antes de comenzar.",
  };
}

const contentEs = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Diseño Digital de Sonrisa",
  description: "Simulación fotorrealista de tu nueva sonrisa utilizando fotografías clínicas y software especializado. Ves exactamente cómo quedarás antes de que se toque ningún diente.",
  benefits: [
    "Visualización realista del resultado final antes de cualquier procedimiento",
    "Comunicación precisa entre el paciente y el equipo clínico",
    "Posibilidad de ajustar proporción, color y forma hasta aprobar el diseño",
    "Base para la fabricación digital de restauraciones a medida",
    "Reducción de la ansiedad y sorpresas durante el tratamiento",
    "Archivo digital permanente del caso para seguimiento",
  ],
  steps: [
    { title: "Fotografía clínica estandarizada", description: "Registro fotográfico completo de frente, perfil y sonrisa con iluminación clínica profesional." },
    { title: "Análisis facial y dental", description: "Evaluación de proporciones faciales, línea de la sonrisa, forma y color actual de los dientes." },
    { title: "Diseño digital", description: "El especialista diseña la nueva sonrisa respetando proporciones áureas y los deseos del paciente." },
    { title: "Aprobación y mock-up físico", description: "El paciente aprueba el diseño digital y opcionalmente lo prueba en boca mediante un mock-up de resina temporal." },
  ],
  candidates: [
    "Cualquier paciente que contemple un tratamiento estético dental",
    "Personas que quieren ver el resultado antes de comprometerse con el tratamiento",
    "Casos con múltiples opciones de tratamiento donde la visualización ayuda a decidir",
    "Pacientes que desean transmitir claramente sus expectativas estéticas al equipo",
  ],
  timeline: "El diseño digital se realiza en 1-2 sesiones de 1 a 2 horas cada una y puede entregarse en formato digital para revisar desde tu país antes de viajar.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Digital Smile Design",
  description: "Photorealistic simulation of your new smile using clinical photographs and specialized software. You see exactly what you will look like before any tooth is touched.",
  benefits: [
    "Realistic visualization of the final result before any procedure",
    "Precise communication between the patient and clinical team",
    "Ability to adjust proportion, color and shape until the design is approved",
    "Foundation for digital fabrication of custom restorations",
    "Reduced anxiety and surprises during treatment",
    "Permanent digital case file for follow-up",
  ],
  steps: [
    { title: "Standardized clinical photography", description: "Complete photographic record from the front, profile and smile with professional clinical lighting." },
    { title: "Facial and dental analysis", description: "Evaluation of facial proportions, smile line, current tooth shape and color." },
    { title: "Digital design", description: "The specialist designs the new smile respecting golden proportions and the patient's wishes." },
    { title: "Approval and physical mock-up", description: "The patient approves the digital design and optionally tries it in the mouth via a temporary resin mock-up." },
  ],
  candidates: [
    "Any patient contemplating a dental aesthetic treatment",
    "People who want to see the result before committing to treatment",
    "Cases with multiple treatment options where visualization helps decide",
    "Patients who want to clearly convey their aesthetic expectations to the team",
  ],
  timeline: "The digital design is carried out in 1-2 sessions of 1 to 2 hours each and can be delivered in digital format to review from your country before traveling.",
  specialty: "odontologia" as const,
};

export default function DisenoDigitalSonrisaPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
