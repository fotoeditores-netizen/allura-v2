import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Implantes Unitarios y Múltiples — Allura Full Mouth Reconstruction™",
  description: "Reemplazo de piezas dentales con implantes de titanio de alta precisión en Medellín. Resultados duraderos con tecnología de vanguardia.",
};

export default function ImplantesUnitariosPage() {
  return (
    <ServiceDetailTemplate
      category="Full Mouth Reconstruction"
      categorySlug="full-mouth-reconstruction"
      title="Implantes Unitarios y Múltiples"
      description="Recupera cada pieza perdida con implantes de titanio biocompatibles que se integran al hueso y funcionan como dientes naturales, de por vida."
      benefits={[
        "Sustitución permanente de piezas perdidas sin afectar dientes adyacentes",
        "Material de titanio biocompatible con integración ósea garantizada",
        "Resultado estético y funcional idéntico al diente natural",
        "No requiere adhesivos ni prótesis removibles",
        "Previene la reabsorción ósea generada por la pérdida dental",
        "Mantenimiento igual al de los dientes naturales",
      ]}
      steps={[
        { title: "Evaluación y diagnóstico 3D", description: "Tomografía cone beam para analizar volumen óseo disponible y planificar la posición exacta del implante." },
        { title: "Colocación del implante", description: "Cirugía mínimamente invasiva bajo anestesia local para instalar el implante de titanio en el hueso maxilar." },
        { title: "Período de osteointegración", description: "Entre 3 y 6 meses para que el implante se integre completamente al hueso. Se puede hacer remotamente desde tu país." },
        { title: "Corona definitiva", description: "Fabricación e instalación de la corona de porcelana personalizada sobre el implante ya integrado." },
      ]}
      candidates={[
        "Pacientes con una o varias piezas dentales perdidas",
        "Personas con hueso maxilar suficiente para sostener el implante",
        "Pacientes con buena salud general y sin enfermedades no controladas",
        "Adultos que no sean fumadores crónicos o estén dispuestos a dejar de fumar",
      ]}
      timeline="El proceso completo dura entre 4 y 8 meses. La primera fase (cirugía) requiere 3-5 días en Medellín; la segunda fase (corona) puede coordinarse en una segunda visita o remotamente."
      specialty="odontologia"
    />
  );
}
