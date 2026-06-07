import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "restauraciones-esteticas";

const contentEs = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Restauraciones Estéticas Avanzadas",
  description: "Técnicas adhesivas mínimamente invasivas de última generación para corregir fracturas, manchas, irregularidades y diastemas sin necesidad de coronas ni procedimientos más extensos.",
  benefits: [
    "Mínima o nula reducción del diente natural",
    "Resinas nanocompositas de alta estética con aspecto de porcelana",
    "Corrección de fracturas, manchas, diastemas y formas irregulares",
    "Resultado inmediato en una sola sesión en muchos casos",
    "Técnica reversible en la mayoría de las situaciones",
    "Excelente relación entre resultado estético y costo del tratamiento",
  ],
  steps: [
    { title: "Diagnóstico y plan estético", description: "Evaluación clínica y fotográfica para determinar el mejor enfoque según el tipo y extensión de cada irregularidad." },
    { title: "Selección de color y forma", description: "Elección del tono de resina y diseño de la forma final con la participación activa del paciente." },
    { title: "Restauración directa", description: "Aplicación y modelado de la resina compuesta de alta estética directamente en el diente, capa por capa." },
    { title: "Pulido y acabado final", description: "Pulido con instrumentos especializados para lograr superficie lisa, brillante y armoniosa con los dientes adyacentes." },
  ],
  candidates: [
    "Dientes con fracturas pequeñas o medianas",
    "Manchas superficiales que no responden al blanqueamiento",
    "Diastemas (espacios entre dientes) de tamaño pequeño a moderado",
    "Pacientes que buscan mejoras estéticas conservadoras y económicas",
  ],
  timeline: "La mayoría de las restauraciones estéticas directas se realizan en 1 a 3 sesiones. El tiempo en Medellín puede ser de 2 a 5 días según la cantidad de piezas a tratar.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Advanced Aesthetic Restorations",
  description: "Next-generation minimally invasive adhesive techniques to correct fractures, stains, irregularities and diastemas without the need for crowns or more extensive procedures.",
  benefits: [
    "Minimal or no reduction of the natural tooth",
    "High-aesthetic nanocomposite resins with a porcelain-like appearance",
    "Correction of fractures, stains, diastemas and irregular shapes",
    "Immediate result in a single session in many cases",
    "Reversible technique in most situations",
    "Excellent ratio between aesthetic result and treatment cost",
  ],
  steps: [
    { title: "Diagnosis and aesthetic plan", description: "Clinical and photographic evaluation to determine the best approach based on the type and extent of each irregularity." },
    { title: "Color and shape selection", description: "Choice of resin shade and final shape design with active patient participation." },
    { title: "Direct restoration", description: "Application and sculpting of the high-aesthetic composite resin directly onto the tooth, layer by layer." },
    { title: "Polishing and final finishing", description: "Polishing with specialized instruments to achieve a smooth, bright surface harmonious with adjacent teeth." },
  ],
  candidates: [
    "Teeth with small or medium fractures",
    "Surface stains that do not respond to whitening",
    "Diastemas (gaps between teeth) of small to moderate size",
    "Patients seeking conservative and cost-effective aesthetic improvements",
  ],
  timeline: "Most direct aesthetic restorations are completed in 1 to 3 sessions. Time in Medellín can be 2 to 5 days depending on the number of teeth to treat.",
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

export default async function RestauracionesEsteticasPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/smile-makeover/restauraciones-esteticas')
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
