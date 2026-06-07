import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "coronas-porcelana";

const contentEs = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Coronas en Porcelana",
  description: "Fundas de porcelana o zirconio que recubren completamente el diente dañado, devolviéndole su forma, función, resistencia y una apariencia perfectamente natural.",
  benefits: [
    "Restauración completa de dientes muy deteriorados sin extraerlos",
    "Porcelana o zirconio de alta resistencia y aspecto ultranatural",
    "Personalización de color, forma y translucidez para armonizar con los dientes vecinos",
    "Protección completa del diente subyacente",
    "Durabilidad superior a 15 años con cuidado adecuado",
    "Sin necesidad de extracción en la mayoría de los casos",
  ],
  steps: [
    { title: "Evaluación y preparación dental", description: "El especialista evalúa el estado del diente y realiza la preparación (reducción controlada) para alojar la corona." },
    { title: "Escáner digital e impresión digital", description: "Toma de impresión digital 3D para fabricar la corona con precisión en laboratorio de tecnología CAD/CAM." },
    { title: "Corona provisional", description: "Instalación de corona provisional durante el período de fabricación de la definitiva para proteger el diente y evaluar estética." },
    { title: "Instalación definitiva", description: "Cementación de la corona de porcelana definitiva con ajuste de oclusión y acabado final profesional." },
  ],
  candidates: [
    "Dientes con fracturas extensas que no pueden restaurarse con resina",
    "Piezas tratadas con endodoncia que requieren protección total",
    "Dientes con gran destrucción por caries avanzada",
    "Casos donde las carillas no son suficientes por el grado de daño",
  ],
  timeline: "La fabricación de coronas toma entre 1 y 2 semanas. El proceso completo (evaluación, preparación, provisional y definitiva) requiere entre 7 y 12 días en Medellín.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Porcelain Crowns",
  description: "Porcelain or zirconia caps that completely cover the damaged tooth, restoring its shape, function, resistance and a perfectly natural appearance.",
  benefits: [
    "Complete restoration of severely deteriorated teeth without extracting them",
    "High-strength porcelain or zirconia with ultra-natural appearance",
    "Customization of color, shape and translucency to harmonize with neighboring teeth",
    "Complete protection of the underlying tooth",
    "Durability exceeding 15 years with proper care",
    "No extraction required in most cases",
  ],
  steps: [
    { title: "Evaluation and dental preparation", description: "The specialist evaluates the tooth condition and performs the preparation (controlled reduction) to accommodate the crown." },
    { title: "Digital scanner and impression", description: "3D digital impression for fabricating the crown with precision in a CAD/CAM technology laboratory." },
    { title: "Provisional crown", description: "Installation of a provisional crown during the fabrication period to protect the tooth and evaluate aesthetics." },
    { title: "Definitive installation", description: "Cementation of the definitive porcelain crown with occlusion adjustment and professional final finishing." },
  ],
  candidates: [
    "Teeth with extensive fractures that cannot be restored with resin",
    "Teeth treated with endodontics requiring total protection",
    "Teeth with extensive destruction due to advanced decay",
    "Cases where veneers are insufficient due to the degree of damage",
  ],
  timeline: "Crown fabrication takes between 1 and 2 weeks. The complete process (evaluation, preparation, provisional and definitive) requires between 7 and 12 days in Medellín.",
  specialty: "odontologia" as const,
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: `${content.title} — Allura Healthcare`,
    description: content.description,
  };
}

export default async function CoronasPorcelanaPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/smile-makeover/coronas-porcelana')
  if (page) {
    const sections = await getSectionsByPage(page.id)
    const visible = sections.filter(s => s.is_visible)
    if (visible.length > 0) {
      return (
        <div className="pt-24">
          {visible.map(s => renderSection(s, locale))}
        </div>
      )
    }
  }

  return <ServiceDetailTemplate {...content} sanityData={undefined} locale={locale} />;
}
