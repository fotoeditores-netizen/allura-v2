import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Implantes All-on-X — Allura Full Mouth Reconstruction™",
  description: "Arcada completa fija sobre 4 o 6 implantes en Medellín. Solución definitiva para pacientes con pérdida total de piezas dentales.",
};

export default function ImplantesAllOnXPage() {
  return (
    <ServiceDetailTemplate
      category="Full Mouth Reconstruction"
      categorySlug="full-mouth-reconstruction"
      title="Implantes All-on-X"
      description="Una arcada dental completa, fija y permanente sobre solo 4 o 6 implantes estratégicamente posicionados. La solución definitiva cuando la pérdida dental es total o casi total."
      benefits={[
        "Arcada completa fija en un solo procedimiento quirúrgico",
        "Solo 4 o 6 implantes para sostener toda la arcada",
        "Carga inmediata: dientes provisionales el mismo día en muchos casos",
        "Elimina el uso de prótesis removibles para siempre",
        "Mayor preservación del hueso en comparación con prótesis convencionales",
        "Resultados funcionales y estéticos de alta calidad desde el primer día",
      ]}
      steps={[
        { title: "Diagnóstico 3D y planificación quirúrgica", description: "Tomografía cone beam y diseño digital del ángulo y posición óptima de cada implante para maximizar el soporte óseo disponible." },
        { title: "Cirugía de colocación", description: "Instalación de los 4 o 6 implantes bajo sedación o anestesia local. Procedimiento de alta complejidad realizado por nuestro equipo de implantólogos." },
        { title: "Carga provisional inmediata", description: "En la mayoría de los casos, instalamos una prótesis provisional fija el mismo día de la cirugía." },
        { title: "Prótesis definitiva", description: "Entre 6 y 12 meses después, instalamos la prótesis definitiva de porcelana o zirconio, fabricada a medida." },
      ]}
      candidates={[
        "Pacientes con pérdida total o casi total de piezas en una o ambas arcadas",
        "Personas que usan prótesis removibles y desean una solución fija y permanente",
        "Pacientes con reabsorción ósea severa que pueden beneficiarse de ángulos de implante alternativos",
        "Casos que buscan la menor cantidad de procedimientos posible",
      ]}
      timeline="La cirugía requiere 5-7 días en Medellín. La prótesis definitiva se instala en una segunda visita entre 6 y 12 meses después, coordinable de forma separada."
      specialty="odontologia"
    />
  );
}
