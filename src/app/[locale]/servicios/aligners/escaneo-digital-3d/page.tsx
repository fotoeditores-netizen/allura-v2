import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "3D Digital Scanning — Allura Aligners™"
      : "Escaneo Digital 3D — Allura Aligners™",
    description: locale === "en"
      ? "Diagnosis and planning without physical impressions in Medellín. High-precision intraoral scanner for orthodontics and restorations."
      : "Diagnóstico y planificación sin impresiones físicas en Medellín. Escáner intraoral de alta precisión para ortodoncia y restauraciones.",
  };
}

const contentEs = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Escaneo Digital 3D",
  description: "Tecnología de escáner intraoral de última generación que reemplaza las incómodas impresiones de alginato. Captura tu boca con precisión milimétrica en minutos y forma la base digital de todo el tratamiento.",
  benefits: [
    "Sin impresiones de alginato ni material en boca",
    "Captura completa en 3-5 minutos con total comodidad",
    "Precisión milimétrica para fabricación de alineadores y restauraciones",
    "Archivo digital permanente para comparar evolución del tratamiento",
    "Compartible remotamente con el especialista antes de viajar",
    "Base para planificación digital de implantes, carillas y coronas",
  ],
  steps: [
    { title: "Preparación y calibración", description: "El escáner se calibra y el paciente se posiciona cómodamente. No se requiere ninguna preparación previa." },
    { title: "Escaneo completo", description: "El especialista pasa la sonda intraoral por toda la boca capturando la geometría exacta de dientes, encías y oclusión." },
    { title: "Revisión en tiempo real", description: "El modelo digital 3D se visualiza en pantalla al instante. El especialista verifica zonas de detalle y repite si es necesario." },
    { title: "Entrega del modelo digital", description: "El paciente recibe el modelo digital de su boca para revisar y compartir, y el equipo lo usa para planificar el tratamiento." },
  ],
  candidates: [
    "Todos los pacientes de alineadores o restauraciones dentales se benefician del escáner 3D",
    "Especialmente útil para pacientes con reflejos nauseosos intensos",
    "Indicado para planificación de implantes y cirugías guiadas digitalmente",
    "Pacientes internacionales que desean recibir un plan digital antes de viajar",
  ],
  timeline: "El escaneo se realiza en 5-15 minutos durante la primera cita de diagnóstico. El modelo digital está disponible el mismo día.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "3D Digital Scanning",
  description: "Next-generation intraoral scanner technology that replaces uncomfortable alginate impressions. Captures your mouth with millimeter precision in minutes and forms the digital foundation of the entire treatment.",
  benefits: [
    "No alginate impressions or material in the mouth",
    "Complete capture in 3-5 minutes with total comfort",
    "Millimeter precision for fabrication of aligners and restorations",
    "Permanent digital file to compare treatment progress",
    "Shareable remotely with the specialist before traveling",
    "Foundation for digital planning of implants, veneers and crowns",
  ],
  steps: [
    { title: "Preparation and calibration", description: "The scanner is calibrated and the patient is positioned comfortably. No prior preparation is required." },
    { title: "Full scan", description: "The specialist passes the intraoral probe through the entire mouth, capturing the exact geometry of teeth, gums and occlusion." },
    { title: "Real-time review", description: "The 3D digital model is displayed on screen instantly. The specialist verifies detailed areas and repeats if necessary." },
    { title: "Digital model delivery", description: "The patient receives the digital model of their mouth to review and share, and the team uses it to plan the treatment." },
  ],
  candidates: [
    "All aligner or dental restoration patients benefit from the 3D scanner",
    "Especially useful for patients with strong gag reflexes",
    "Indicated for implant planning and digitally guided surgeries",
    "International patients who wish to receive a digital plan before traveling",
  ],
  timeline: "The scan is performed in 5-15 minutes during the first diagnostic appointment. The digital model is available the same day.",
  specialty: "odontologia" as const,
};

export default function EscaneoDigital3DPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
