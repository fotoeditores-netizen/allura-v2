import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Planificación Digital 3D — Allura Full Mouth Reconstruction™",
  description: "Simulación completa de tu caso con tecnología CAD/CAM y escáner intraoral 3D antes de comenzar cualquier procedimiento en Medellín.",
};

export default function PlanificacionDigital3DPage() {
  return (
    <ServiceDetailTemplate
      category="Full Mouth Reconstruction"
      categorySlug="full-mouth-reconstruction"
      title="Planificación Digital 3D"
      description="Antes de cualquier procedimiento, simulamos tu caso completo con tecnología digital de última generación. Ves tu resultado antes de comenzar y el equipo planifica con precisión milimétrica cada paso del tratamiento."
      benefits={[
        "Visualización del resultado final antes del primer procedimiento",
        "Planificación quirúrgica precisa con guías quirúrgicas digitales",
        "Reducción de la incertidumbre y mejora en la comunicación con el paciente",
        "Fabricación de restauraciones a medida con fresado CAD/CAM",
        "Sin impresiones físicas incómodas — solo escáner digital",
        "Documentación digital completa del caso para seguimiento remoto",
      ]}
      steps={[
        { title: "Escáner intraoral 3D", description: "Captura digital de toda la boca en minutos, sin impresiones de alginato. Cómodo, rápido y de alta precisión." },
        { title: "Tomografía cone beam", description: "Imagen tridimensional del hueso maxilar y mandibular para evaluar volumen óseo y estructuras anatómicas clave." },
        { title: "Diseño digital del tratamiento", description: "El equipo diseña el caso en software especializado: posición de implantes, forma de las restauraciones, oclusión y estética." },
        { title: "Presentación al paciente", description: "Revisión conjunta del plan digital antes de comenzar cualquier procedimiento, con opción de ajustes." },
      ]}
      candidates={[
        "Todos los pacientes de Full Mouth Reconstruction se benefician de la planificación 3D",
        "Especialmente valioso para casos con implantes o rehabilitación oral compleja",
        "Pacientes internacionales que viajan una sola vez y necesitan máxima precisión",
        "Casos en que el resultado estético es crítico para el paciente",
      ]}
      timeline="La planificación digital se realiza en la primera visita diagnóstica (1-2 días). El plan digital acompaña todo el tratamiento y se comparte con el paciente de forma remota."
      specialty="odontologia"
    />
  );
}
