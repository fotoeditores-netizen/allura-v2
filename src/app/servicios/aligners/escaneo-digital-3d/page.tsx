import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Escaneo Digital 3D — Allura Aligners™",
  description: "Diagnóstico y planificación sin impresiones físicas en Medellín. Escáner intraoral de alta precisión para ortodoncia y restauraciones.",
};

export default function EscaneoDigital3DPage() {
  return (
    <ServiceDetailTemplate
      category="Allura Aligners"
      categorySlug="aligners"
      title="Escaneo Digital 3D"
      description="Tecnología de escáner intraoral de última generación que reemplaza las incómodas impresiones de alginato. Captura tu boca con precisión milimétrica en minutos y forma la base digital de todo el tratamiento."
      benefits={[
        "Sin impresiones de alginato ni material en boca",
        "Captura completa en 3-5 minutos con total comodidad",
        "Precisión milimétrica para fabricación de alineadores y restauraciones",
        "Archivo digital permanente para comparar evolución del tratamiento",
        "Compartible remotamente con el especialista antes de viajar",
        "Base para planificación digital de implantes, carillas y coronas",
      ]}
      steps={[
        { title: "Preparación y calibración", description: "El escáner se calibra y el paciente se posiciona cómodamente. No se requiere ninguna preparación previa." },
        { title: "Escaneo completo", description: "El especialista pasa la sonda intraoral por toda la boca capturando la geometría exacta de dientes, encías y oclusión." },
        { title: "Revisión en tiempo real", description: "El modelo digital 3D se visualiza en pantalla al instante. El especialista verifica zonas de detalle y repite si es necesario." },
        { title: "Entrega del modelo digital", description: "El paciente recibe el modelo digital de su boca para revisar y compartir, y el equipo lo usa para planificar el tratamiento." },
      ]}
      candidates={[
        "Todos los pacientes de alineadores o restauraciones dentales se benefician del escáner 3D",
        "Especialmente útil para pacientes con reflejos nauseosos intensos",
        "Indicado para planificación de implantes y cirugías guiadas digitalmente",
        "Pacientes internacionales que desean recibir un plan digital antes de viajar",
      ]}
      timeline="El escaneo se realiza en 5-15 minutos durante la primera cita de diagnóstico. El modelo digital está disponible el mismo día."
      specialty="odontologia"
    />
  );
}
