import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "Invisalign — Allura Aligners™"
      : "Invisalign — Allura Aligners™",
    description: locale === "en"
      ? "Invisalign with a Diamond Top Doctor specialist in Medellín. The world's most advanced aligner system with remote monitoring."
      : "Invisalign con especialista Diamond Top Doctor en Medellín. El sistema de alineadores más avanzado del mundo con seguimiento remoto.",
  };
}

const contentEs = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Invisalign",
  description: "El sistema de alineadores más reconocido mundialmente, disponible en Allura con el Dr. Santiago Henao, especialista certificado con distinción Diamond Top Doctor — uno de los niveles más altos otorgados por Invisalign a nivel global.",
  benefits: [
    "Sistema de alineadores número 1 en el mundo con millones de casos tratados",
    "Especialista Diamond Top Doctor — el nivel más alto de certificación Invisalign",
    "Planificación digital con Clincheck® para visualizar tu resultado final",
    "Removibles para comer, beber y cepillarse con total comodidad",
    "Prácticamente invisibles en la vida cotidiana",
    "Protocolo de seguimiento remoto para pacientes internacionales",
  ],
  steps: [
    { title: "Escáner intraoral y diagnóstico", description: "El especialista realiza un escáner digital 3D completo para planificar tu caso en la plataforma Clincheck® de Invisalign." },
    { title: "Simulación con Clincheck®", description: "Ves en 3D la animación de cómo se moverán tus dientes, paso a paso, hasta el resultado final. Apruebas el plan antes de fabricar." },
    { title: "Fabricación y primera entrega", description: "Se fabrican tus alineadores personalizados y te los entregamos con instrucciones completas de uso y cuidado." },
    { title: "Seguimiento remoto internacional", description: "Controles periódicos mediante fotografías intraorales y videollamadas con tu especialista desde tu país." },
  ],
  candidates: [
    "Adultos y adolescentes con apiñamiento leve, moderado o severo",
    "Casos con mordidas abiertas, cruzadas o profundas según evaluación",
    "Pacientes que rechazaron el tratamiento con brackets por razones estéticas",
    "Personas que buscan ortodoncia discreta con seguimiento profesional a distancia",
  ],
  timeline: "La duración varía entre 6 meses y 2 años según la complejidad. La visita inicial a Medellín dura 2-3 días; el resto del tratamiento se gestiona de forma remota con visitas esporádicas.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Invisalign",
  description: "The world's most recognized aligner system, available at Allura with Dr. Santiago Henao, a specialist certified with Diamond Top Doctor distinction — one of the highest levels awarded by Invisalign globally.",
  benefits: [
    "World's #1 aligner system with millions of treated cases",
    "Diamond Top Doctor specialist — the highest level of Invisalign certification",
    "Digital planning with Clincheck® to visualize your final result",
    "Removable for eating, drinking and brushing with total comfort",
    "Virtually invisible in everyday life",
    "Remote monitoring protocol for international patients",
  ],
  steps: [
    { title: "Intraoral scanner and diagnosis", description: "The specialist performs a complete 3D digital scan to plan your case on Invisalign's Clincheck® platform." },
    { title: "Clincheck® simulation", description: "You see a 3D animation of how your teeth will move, step by step, up to the final result. You approve the plan before fabrication." },
    { title: "Fabrication and first delivery", description: "Your personalized aligners are fabricated and delivered to you with complete instructions for use and care." },
    { title: "International remote monitoring", description: "Periodic check-ups via intraoral photographs and video calls with your specialist from your country." },
  ],
  candidates: [
    "Adults and teenagers with mild, moderate or severe crowding",
    "Cases with open, cross or deep bites subject to evaluation",
    "Patients who declined bracket treatment for aesthetic reasons",
    "People seeking discreet orthodontics with professional remote follow-up",
  ],
  timeline: "Duration varies between 6 months and 2 years depending on complexity. The initial visit to Medellín lasts 2-3 days; the rest of the treatment is managed remotely with occasional visits.",
  specialty: "odontologia" as const,
};

export default function InvisalignPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
