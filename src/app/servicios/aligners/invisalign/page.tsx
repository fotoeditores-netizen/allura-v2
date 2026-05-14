import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Invisalign — Allura Aligners™",
  description: "Invisalign con especialista Diamond Top Doctor en Medellín. El sistema de alineadores más avanzado del mundo con seguimiento remoto.",
};

export default function InvisalignPage() {
  return (
    <ServiceDetailTemplate
      category="Allura Aligners"
      categorySlug="aligners"
      title="Invisalign"
      description="El sistema de alineadores más reconocido mundialmente, disponible en Allura con el Dr. Santiago Henao, especialista certificado con distinción Diamond Top Doctor — uno de los niveles más altos otorgados por Invisalign a nivel global."
      benefits={[
        "Sistema de alineadores número 1 en el mundo con millones de casos tratados",
        "Especialista Diamond Top Doctor — el nivel más alto de certificación Invisalign",
        "Planificación digital con Clincheck® para visualizar tu resultado final",
        "Removibles para comer, beber y cepillarse con total comodidad",
        "Prácticamente invisibles en la vida cotidiana",
        "Protocolo de seguimiento remoto para pacientes internacionales",
      ]}
      steps={[
        { title: "Escáner intraoral y diagnóstico", description: "El especialista realiza un escáner digital 3D completo para planificar tu caso en la plataforma Clincheck® de Invisalign." },
        { title: "Simulación con Clincheck®", description: "Ves en 3D la animación de cómo se moverán tus dientes, paso a paso, hasta el resultado final. Apruebas el plan antes de fabricar." },
        { title: "Fabricación y primera entrega", description: "Se fabrican tus alineadores personalizados y te los entregamos con instrucciones completas de uso y cuidado." },
        { title: "Seguimiento remoto internacional", description: "Controles periódicos mediante fotografías intraorales y videollamadas con tu especialista desde tu país." },
      ]}
      candidates={[
        "Adultos y adolescentes con apiñamiento leve, moderado o severo",
        "Casos con mordidas abiertas, cruzadas o profundas según evaluación",
        "Pacientes que rechazaron el tratamiento con brackets por razones estéticas",
        "Personas que buscan ortodoncia discreta con seguimiento profesional a distancia",
      ]}
      timeline="La duración varía entre 6 meses y 2 años según la complejidad. La visita inicial a Medellín dura 2-3 días; el resto del tratamiento se gestiona de forma remota con visitas esporádicas."
      specialty="odontologia"
    />
  );
}
