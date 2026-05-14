import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Mentoplastia — Allura Facial Harmony™",
  description: "Redefinición del mentón en Medellín para mejorar el perfil y el equilibrio facial. Mínimamente invasivo con recuperación rápida.",
};

export default function MentoplastiaPage() {
  return (
    <ServiceDetailTemplate
      category="Facial Harmony"
      categorySlug="facial-harmony"
      title="Mentoplastia"
      description="Cirugía de redefinición del mentón para mejorar la proyección y el equilibrio del perfil facial. Puede realizarse con implantes de silicona médica o con reposicionamiento óseo según la indicación clínica."
      benefits={[
        "Mejora significativa del perfil y el equilibrio facial",
        "Procedimiento mínimamente invasivo con cicatriz interna imperceptible",
        "Recuperación más rápida que otros procedimientos quirúrgicos faciales",
        "Compatible con rinoplastia para corrección integral del perfil",
        "Implantes de silicona médica certificados de alta calidad",
        "Resultado permanente y proporcional a los rasgos del paciente",
      ]}
      steps={[
        { title: "Análisis de perfil y planificación", description: "Evaluación de la proyección actual del mentón en relación con nariz, labios y frente. Morfing fotográfico del perfil." },
        { title: "Exámenes preoperatorios", description: "Laboratorios y evaluación médica general para autorizar el procedimiento bajo anestesia local con sedación." },
        { title: "Cirugía", description: "Incisión interna (en boca) o submentoniana mínima para insertar el implante en la posición planeada. Duración: 45 a 90 minutos." },
        { title: "Recuperación", description: "Reposo de 5 a 7 días. Dieta blanda la primera semana. El edema disminuye progresivamente durante los primeros 30 días." },
      ]}
      candidates={[
        "Adultos con mentón retruido que desequilibra las proporciones faciales",
        "Pacientes que buscan mejorar el perfil facial sin cirugía de mayor complejidad",
        "Casos que se combinan con rinoplastia para corrección integral",
        "Personas con expectativas realistas sobre los resultados alcanzables",
      ]}
      timeline="La cirugía dura entre 45 y 90 minutos. Se requieren entre 7 y 10 días en Medellín. El resultado final se aprecia completamente a los 30-60 días."
      specialty="facial"
    />
  );
}
