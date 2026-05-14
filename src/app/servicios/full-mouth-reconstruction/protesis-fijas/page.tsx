import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Prótesis Fijas sobre Implantes — Allura Full Mouth Reconstruction™",
  description: "Coronas y puentes de porcelana fijados sobre implantes en Medellín. Aspecto natural, resistencia total y funcionalidad completa.",
};

export default function ProtesisFijasPage() {
  return (
    <ServiceDetailTemplate
      category="Full Mouth Reconstruction"
      categorySlug="full-mouth-reconstruction"
      title="Prótesis Fijas sobre Implantes"
      description="Coronas y puentes de porcelana o zirconio fijados permanentemente sobre implantes. El resultado es una dentadura que se ve, se siente y funciona exactamente como tus propios dientes."
      benefits={[
        "Resultado estético superior con porcelana o zirconio de alta resistencia",
        "Fijación permanente sin adhesivos ni remoción diaria",
        "Distribución natural de las fuerzas masticatorias",
        "Sin necesidad de limpiar la prótesis fuera de la boca",
        "Mayor comodidad y confianza en la vida diaria",
        "Durabilidad excepcional con cuidado adecuado",
      ]}
      steps={[
        { title: "Selección de material", description: "Elección entre porcelana feldespática, zirconio o combinaciones según la zona de la boca y las exigencias estéticas." },
        { title: "Toma de impresiones digitales", description: "Escáner intraoral 3D para fabricar la prótesis con precisión milimétrica en el laboratorio." },
        { title: "Prueba provisional", description: "Instalación de prótesis provisional para validar estética, oclusión y comodidad antes de la definitiva." },
        { title: "Instalación definitiva", description: "Cementación o atornillado de la prótesis definitiva con control de oclusión y acabado final." },
      ]}
      candidates={[
        "Pacientes con uno o más implantes ya integrados",
        "Personas que desean reemplazar prótesis removibles por una solución fija",
        "Casos que requieren restaurar uno o varios dientes con alto valor estético",
        "Pacientes con implantes previos que necesitan renovar la prótesis",
      ]}
      timeline="Una vez que los implantes están integrados (3-6 meses), la fabricación e instalación de la prótesis definitiva toma entre 2 y 3 semanas y requiere 4-7 días en Medellín."
      specialty="odontologia"
    />
  );
}
