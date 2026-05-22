import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "All-on-X Implants — Allura Full Mouth Reconstruction™"
      : "Implantes All-on-X — Allura Full Mouth Reconstruction™",
    description: locale === "en"
      ? "Complete fixed arch on 4 or 6 implants in Medellín. Definitive solution for patients with total tooth loss."
      : "Arcada completa fija sobre 4 o 6 implantes en Medellín. Solución definitiva para pacientes con pérdida total de piezas dentales.",
  };
}

const contentEs = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Implantes All-on-X",
  description: "Una arcada dental completa, fija y permanente sobre solo 4 o 6 implantes estratégicamente posicionados. La solución definitiva cuando la pérdida dental es total o casi total.",
  benefits: [
    "Arcada completa fija en un solo procedimiento quirúrgico",
    "Solo 4 o 6 implantes para sostener toda la arcada",
    "Carga inmediata: dientes provisionales el mismo día en muchos casos",
    "Elimina el uso de prótesis removibles para siempre",
    "Mayor preservación del hueso en comparación con prótesis convencionales",
    "Resultados funcionales y estéticos de alta calidad desde el primer día",
  ],
  steps: [
    { title: "Diagnóstico 3D y planificación quirúrgica", description: "Tomografía cone beam y diseño digital del ángulo y posición óptima de cada implante para maximizar el soporte óseo disponible." },
    { title: "Cirugía de colocación", description: "Instalación de los 4 o 6 implantes bajo sedación o anestesia local. Procedimiento de alta complejidad realizado por nuestro equipo de implantólogos." },
    { title: "Carga provisional inmediata", description: "En la mayoría de los casos, instalamos una prótesis provisional fija el mismo día de la cirugía." },
    { title: "Prótesis definitiva", description: "Entre 6 y 12 meses después, instalamos la prótesis definitiva de porcelana o zirconio, fabricada a medida." },
  ],
  candidates: [
    "Pacientes con pérdida total o casi total de piezas en una o ambas arcadas",
    "Personas que usan prótesis removibles y desean una solución fija y permanente",
    "Pacientes con reabsorción ósea severa que pueden beneficiarse de ángulos de implante alternativos",
    "Casos que buscan la menor cantidad de procedimientos posible",
  ],
  timeline: "La cirugía requiere 5-7 días en Medellín. La prótesis definitiva se instala en una segunda visita entre 6 y 12 meses después, coordinable de forma separada.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "All-on-X Implants",
  description: "A complete, fixed and permanent dental arch on just 4 or 6 strategically positioned implants. The definitive solution when tooth loss is total or near-total.",
  benefits: [
    "Complete fixed arch in a single surgical procedure",
    "Only 4 or 6 implants to support the entire arch",
    "Immediate loading: provisional teeth the same day in many cases",
    "Eliminates removable dentures forever",
    "Greater bone preservation compared to conventional dentures",
    "High-quality functional and aesthetic results from day one",
  ],
  steps: [
    { title: "3D diagnosis and surgical planning", description: "Cone beam CT scan and digital design of the optimal angle and position of each implant to maximize available bone support." },
    { title: "Placement surgery", description: "Installation of the 4 or 6 implants under sedation or local anesthesia. High-complexity procedure performed by our implantology team." },
    { title: "Immediate provisional loading", description: "In most cases, we install a fixed provisional prosthesis the same day as surgery." },
    { title: "Definitive prosthesis", description: "Between 6 and 12 months later, we install the custom-made definitive porcelain or zirconia prosthesis." },
  ],
  candidates: [
    "Patients with total or near-total tooth loss in one or both arches",
    "People who wear removable dentures and want a fixed, permanent solution",
    "Patients with severe bone resorption who may benefit from alternative implant angles",
    "Cases seeking the fewest possible procedures",
  ],
  timeline: "Surgery requires 5-7 days in Medellín. The definitive prosthesis is installed on a second visit between 6 and 12 months later, which can be coordinated separately.",
  specialty: "odontologia" as const,
};

export default function ImplantesAllOnXPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
