import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "en"
      ? "Fixed Prostheses on Implants — Allura Full Mouth Reconstruction™"
      : "Prótesis Fijas sobre Implantes — Allura Full Mouth Reconstruction™",
    description: locale === "en"
      ? "Porcelain crowns and bridges fixed on implants in Medellín. Natural appearance, total resistance and complete functionality."
      : "Coronas y puentes de porcelana fijados sobre implantes en Medellín. Aspecto natural, resistencia total y funcionalidad completa.",
  };
}

const contentEs = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Prótesis Fijas sobre Implantes",
  description: "Coronas y puentes de porcelana o zirconio fijados permanentemente sobre implantes. El resultado es una dentadura que se ve, se siente y funciona exactamente como tus propios dientes.",
  benefits: [
    "Resultado estético superior con porcelana o zirconio de alta resistencia",
    "Fijación permanente sin adhesivos ni remoción diaria",
    "Distribución natural de las fuerzas masticatorias",
    "Sin necesidad de limpiar la prótesis fuera de la boca",
    "Mayor comodidad y confianza en la vida diaria",
    "Durabilidad excepcional con cuidado adecuado",
  ],
  steps: [
    { title: "Selección de material", description: "Elección entre porcelana feldespática, zirconio o combinaciones según la zona de la boca y las exigencias estéticas." },
    { title: "Toma de impresiones digitales", description: "Escáner intraoral 3D para fabricar la prótesis con precisión milimétrica en el laboratorio." },
    { title: "Prueba provisional", description: "Instalación de prótesis provisional para validar estética, oclusión y comodidad antes de la definitiva." },
    { title: "Instalación definitiva", description: "Cementación o atornillado de la prótesis definitiva con control de oclusión y acabado final." },
  ],
  candidates: [
    "Pacientes con uno o más implantes ya integrados",
    "Personas que desean reemplazar prótesis removibles por una solución fija",
    "Casos que requieren restaurar uno o varios dientes con alto valor estético",
    "Pacientes con implantes previos que necesitan renovar la prótesis",
  ],
  timeline: "Una vez que los implantes están integrados (3-6 meses), la fabricación e instalación de la prótesis definitiva toma entre 2 y 3 semanas y requiere 4-7 días en Medellín.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Full Mouth Reconstruction",
  categorySlug: "full-mouth-reconstruction",
  title: "Fixed Prostheses on Implants",
  description: "Porcelain or zirconia crowns and bridges permanently fixed on implants. The result is a set of teeth that looks, feels and functions exactly like your own teeth.",
  benefits: [
    "Superior aesthetic result with high-strength porcelain or zirconia",
    "Permanent fixation without adhesives or daily removal",
    "Natural distribution of masticatory forces",
    "No need to clean the prosthesis outside the mouth",
    "Greater comfort and confidence in daily life",
    "Exceptional durability with proper care",
  ],
  steps: [
    { title: "Material selection", description: "Choice between feldspathic porcelain, zirconia or combinations depending on the area of the mouth and aesthetic requirements." },
    { title: "Digital impressions", description: "3D intraoral scanner to fabricate the prosthesis with millimeter precision in the laboratory." },
    { title: "Provisional fitting", description: "Installation of provisional prosthesis to validate aesthetics, occlusion and comfort before the definitive one." },
    { title: "Definitive installation", description: "Cementing or screwing of the definitive prosthesis with occlusion control and final finishing." },
  ],
  candidates: [
    "Patients with one or more already-integrated implants",
    "People who wish to replace removable dentures with a fixed solution",
    "Cases requiring restoration of one or more teeth with high aesthetic value",
    "Patients with prior implants who need to renew the prosthesis",
  ],
  timeline: "Once implants are integrated (3-6 months), fabrication and installation of the definitive prosthesis takes 2 to 3 weeks and requires 4-7 days in Medellín.",
  specialty: "odontologia" as const,
};

export default function ProtesisFijasPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} />;
}
