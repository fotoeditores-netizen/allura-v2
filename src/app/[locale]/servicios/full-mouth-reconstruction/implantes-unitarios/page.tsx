import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "Single and Multiple Implants — Allura Full Mouth Reconstruction™"
      : "Implantes Unitarios y Múltiples — Allura Full Mouth Reconstruction™",
    description: locale === "en"
      ? "Replacement of teeth with high-precision titanium implants in Medellín. Lasting results with cutting-edge technology."
      : "Reemplazo de piezas dentales con implantes de titanio de alta precisión en Medellín. Resultados duraderos con tecnología de vanguardia.",
  };
}

const contentEs = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Implantes Unitarios y Múltiples",
  description: "Recupera cada pieza perdida con implantes de titanio biocompatibles que se integran al hueso y funcionan como dientes naturales, de por vida.",
  benefits: [
    "Sustitución permanente de piezas perdidas sin afectar dientes adyacentes",
    "Material de titanio biocompatible con integración ósea garantizada",
    "Resultado estético y funcional idéntico al diente natural",
    "No requiere adhesivos ni prótesis removibles",
    "Previene la reabsorción ósea generada por la pérdida dental",
    "Mantenimiento igual al de los dientes naturales",
  ],
  steps: [
    { title: "Evaluación y diagnóstico 3D", description: "Tomografía cone beam para analizar volumen óseo disponible y planificar la posición exacta del implante." },
    { title: "Colocación del implante", description: "Cirugía mínimamente invasiva bajo anestesia local para instalar el implante de titanio en el hueso maxilar." },
    { title: "Período de osteointegración", description: "Entre 3 y 6 meses para que el implante se integre completamente al hueso. Se puede hacer remotamente desde tu país." },
    { title: "Corona definitiva", description: "Fabricación e instalación de la corona de porcelana personalizada sobre el implante ya integrado." },
  ],
  candidates: [
    "Pacientes con una o varias piezas dentales perdidas",
    "Personas con hueso maxilar suficiente para sostener el implante",
    "Pacientes con buena salud general y sin enfermedades no controladas",
    "Adultos que no sean fumadores crónicos o estén dispuestos a dejar de fumar",
  ],
  timeline: "El proceso completo dura entre 4 y 8 meses. La primera fase (cirugía) requiere 3-5 días en Medellín; la segunda fase (corona) puede coordinarse en una segunda visita o remotamente.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Single and Multiple Implants",
  description: "Recover each lost tooth with biocompatible titanium implants that integrate into the bone and function like natural teeth, for life.",
  benefits: [
    "Permanent replacement of lost teeth without affecting adjacent teeth",
    "Biocompatible titanium material with guaranteed bone integration",
    "Aesthetic and functional result identical to the natural tooth",
    "No adhesives or removable dentures required",
    "Prevents bone resorption caused by tooth loss",
    "Maintenance identical to natural teeth",
  ],
  steps: [
    { title: "3D evaluation and diagnosis", description: "Cone beam CT scan to analyze available bone volume and plan the exact position of the implant." },
    { title: "Implant placement", description: "Minimally invasive surgery under local anesthesia to install the titanium implant into the jawbone." },
    { title: "Osseointegration period", description: "Between 3 and 6 months for the implant to fully integrate into the bone. This phase can be managed remotely from your country." },
    { title: "Final crown", description: "Fabrication and installation of the custom porcelain crown on the already-integrated implant." },
  ],
  candidates: [
    "Patients with one or more missing teeth",
    "People with sufficient jawbone to support the implant",
    "Patients in good general health without uncontrolled conditions",
    "Adults who do not smoke chronically or are willing to quit smoking",
  ],
  timeline: "The complete process takes between 4 and 8 months. The first phase (surgery) requires 3-5 days in Medellín; the second phase (crown) can be coordinated on a second visit or remotely.",
  specialty: "odontologia" as const,
};

export default function ImplantesUnitariosPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
