import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Seguimiento Remoto Internacional — Allura Aligners™",
  description: "Control de tu tratamiento de ortodoncia desde tu país. Videollamadas y monitoreo digital con tu especialista Allura en Medellín.",
};

export default function SeguimientoRemotoPage() {
  return (
    <ServiceDetailTemplate
      category="Allura Aligners"
      categorySlug="aligners"
      title="Seguimiento Remoto Internacional"
      description="Protocolo diseñado específicamente para pacientes que inician su tratamiento de ortodoncia en Medellín y continúan desde su país de origen. Control profesional a distancia sin sacrificar calidad ni seguridad."
      benefits={[
        "Tratamiento de ortodoncia sin necesidad de vivir en Medellín",
        "Controles periódicos por videollamada con tu especialista",
        "Revisión de fotografías intraorales para evaluar el progreso sin desplazarse",
        "Envío de alineadores por correo internacional según protocolo",
        "Acceso directo al especialista por WhatsApp para consultas urgentes",
        "Visitas presenciales solo en momentos clave del tratamiento",
      ]}
      steps={[
        { title: "Inicio presencial en Medellín", description: "Primera visita para diagnóstico, escáner, aprobación del plan y entrega del primer lote de alineadores." },
        { title: "Protocolo de fotografías remotas", description: "El paciente envía fotografías intraorales estandarizadas periódicamente según el protocolo establecido." },
        { title: "Controles por videollamada", description: "Revisión virtual regular con el especialista para evaluar la evolución, resolver dudas y aprobar el avance al siguiente lote." },
        { title: "Visitas presenciales estratégicas", description: "Visitas a Medellín en puntos clave: cambio de bracket, refinamientos o instalación de la contención final." },
      ]}
      candidates={[
        "Pacientes internacionales que no residen en Colombia",
        "Personas que viajan ocasionalmente a Colombia y pueden hacer visitas puntuales",
        "Casos de moderada a alta complejidad que aceptan el modelo de seguimiento híbrido",
        "Pacientes que ya tuvieron una cita de diagnóstico presencial en Allura",
      ]}
      timeline="La duración total es la misma que el tratamiento presencial. La visita inicial es de 2-3 días; las visitas posteriores (si se requieren) son de 1-2 días cada una."
      specialty="odontologia"
    />
  );
}
