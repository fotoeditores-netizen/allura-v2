import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "carillas-porcelana";

const contentEs = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Carillas en Porcelana",
  description: "Láminas ultrafinas de porcelana adheridas a la superficie de los dientes para transformar radicalmente color, forma, tamaño y alineación sin necesidad de ortodoncia ni procedimientos invasivos.",
  benefits: [
    "Transformación estética radical con mínima reducción del diente",
    "Porcelana translúcida que imita perfectamente el esmalte natural",
    "Resistencia al manchado superior al esmalte natural",
    "Resultado inmediato sin meses de tratamiento de ortodoncia",
    "Personalización total de color, forma y tamaño",
    "Durabilidad de 10 a 20 años con cuidado adecuado",
  ],
  steps: [
    { title: "Diseño digital de sonrisa", description: "Simulación fotorrealista del resultado esperado antes de preparar ningún diente. El paciente aprueba el diseño." },
    { title: "Preparación dental mínima", description: "Reducción mínima del esmalte (0.3-0.7mm) para alojar la carilla. Técnica preservadora que protege el diente." },
    { title: "Prueba en boca (mock-up)", description: "Instalación temporal del diseño para evaluar estética, fonética y comodidad antes de la carilla definitiva." },
    { title: "Adhesión definitiva", description: "Cementación de las carillas de porcelana con sistemas adhesivos de alta resistencia y acabado final." },
  ],
  candidates: [
    "Pacientes con manchas intrínsecas que no responden al blanqueamiento",
    "Personas con dientes pequeños, desgastados o con forma irregular",
    "Casos con pequeños diastemas o leve apiñamiento sin problemas de mordida",
    "Pacientes que buscan una transformación estética completa en poco tiempo",
  ],
  timeline: "El proceso completo dura entre 2 y 3 semanas desde la planificación hasta la instalación definitiva. Requiere entre 7 y 10 días en Medellín.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Porcelain Veneers",
  description: "Ultra-thin porcelain wafers bonded to the tooth surface to radically transform color, shape, size and alignment without the need for orthodontics or invasive procedures.",
  benefits: [
    "Radical aesthetic transformation with minimal tooth reduction",
    "Translucent porcelain that perfectly mimics natural enamel",
    "Stain resistance superior to natural enamel",
    "Immediate result without months of orthodontic treatment",
    "Full customization of color, shape and size",
    "Durability of 10 to 20 years with proper care",
  ],
  steps: [
    { title: "Digital smile design", description: "Photorealistic simulation of the expected result before preparing any tooth. The patient approves the design." },
    { title: "Minimal dental preparation", description: "Minimal enamel reduction (0.3-0.7mm) to accommodate the veneer. Preserving technique that protects the tooth." },
    { title: "In-mouth trial (mock-up)", description: "Temporary installation of the design to evaluate aesthetics, phonetics and comfort before the definitive veneer." },
    { title: "Definitive bonding", description: "Cementation of the porcelain veneers with high-strength adhesive systems and final finishing." },
  ],
  candidates: [
    "Patients with intrinsic stains that do not respond to whitening",
    "People with small, worn or irregularly shaped teeth",
    "Cases with small diastemas or mild crowding without bite problems",
    "Patients seeking a complete aesthetic transformation in a short time",
  ],
  timeline: "The complete process takes between 2 and 3 weeks from planning to definitive installation. It requires between 7 and 10 days in Medellín.",
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

export default async function CarillasPorcelanaPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/smile-makeover/carillas-porcelana')
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
