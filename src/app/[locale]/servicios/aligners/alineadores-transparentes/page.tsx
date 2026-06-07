import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "alineadores-transparentes";

const contentEs = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Alineadores Transparentes",
  description: "Alineadores de alta precisión fabricados a medida mediante escáner intraoral digital, sin impresiones físicas incómodas. Ortodoncia discreta, eficiente y diseñada para la vida de nuestros pacientes internacionales.",
  benefits: [
    "Ortodoncia completamente invisible en la vida diaria",
    "Sin impresiones de alginato — solo escáner digital 3D",
    "Material termoplástico médico de alta resistencia y claridad",
    "Removibles para comer, beber y limpiar los dientes",
    "Sin restricciones alimentarias ni riesgo de fractura de brackets",
    "Seguimiento adaptado a pacientes que viven fuera de Colombia",
  ],
  steps: [
    { title: "Diagnóstico y escáner digital", description: "Evaluación ortodóncica completa y escáner intraoral 3D como base para el diseño del tratamiento." },
    { title: "Planificación digital", description: "Diseño del movimiento dental paso a paso y generación de la simulación del resultado final antes de fabricar." },
    { title: "Fabricación y primera entrega", description: "Los alineadores se fabrican con impresoras 3D de alta precisión y se entregan con el plan de cambio por etapas." },
    { title: "Seguimiento y controles remotos", description: "Monitoreo mediante fotografías y videollamadas con el especialista. Envío de nuevos alineadores por correo internacional si aplica." },
  ],
  candidates: [
    "Adultos y adolescentes con casos de apiñamiento o espaciado",
    "Pacientes con pequeñas recidivas de ortodoncia previa",
    "Personas que desean discreción total durante el tratamiento",
    "Pacientes internacionales que no pueden hacer visitas frecuentes",
  ],
  timeline: "Entre 4 y 18 meses según la complejidad del caso. La visita inicial a Medellín dura 2-3 días y el seguimiento se realiza remotamente en su mayor parte.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Clear Aligners",
  description: "High-precision custom aligners fabricated using a digital intraoral scanner, without uncomfortable physical impressions. Discreet, efficient orthodontics designed for the lives of our international patients.",
  benefits: [
    "Completely invisible orthodontics in daily life",
    "No alginate impressions — digital 3D scanner only",
    "High-strength, clear medical thermoplastic material",
    "Removable for eating, drinking and cleaning teeth",
    "No dietary restrictions or risk of bracket breakage",
    "Follow-up adapted for patients living outside Colombia",
  ],
  steps: [
    { title: "Diagnosis and digital scanner", description: "Complete orthodontic evaluation and 3D intraoral scan as the basis for treatment design." },
    { title: "Digital planning", description: "Step-by-step design of tooth movements and generation of the final result simulation before fabrication." },
    { title: "Fabrication and first delivery", description: "Aligners are fabricated with high-precision 3D printers and delivered with the stage-by-stage change plan." },
    { title: "Follow-up and remote check-ups", description: "Monitoring via photographs and video calls with the specialist. International shipping of new aligners if applicable." },
  ],
  candidates: [
    "Adults and teenagers with crowding or spacing cases",
    "Patients with minor relapses from previous orthodontic treatment",
    "People who want complete discretion during treatment",
    "International patients who cannot make frequent visits",
  ],
  timeline: "Between 4 and 18 months depending on case complexity. The initial visit to Medellín lasts 2-3 days and follow-up is mostly carried out remotely.",
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

export default async function AlineadoresTransparentesPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/aligners/alineadores-transparentes')
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
