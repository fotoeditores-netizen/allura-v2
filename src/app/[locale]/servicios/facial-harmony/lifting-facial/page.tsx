import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "lifting-facial";

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Lifting Facial",
  description: "Procedimiento quirúrgico que reposiciona los tejidos faciales descendidos para restaurar la definición del óvalo facial, el cuello y el área mandibular sin producir resultados tensos ni artificiales.",
  benefits: [
    "Rejuvenecimiento facial profundo y duradero — resultados de 7 a 15 años",
    "Reposición de tejidos sin el aspecto tenso propio de técnicas antiguas",
    "Mejora simultánea de zona mandibular, mejillas y cuello",
    "Cicatrices ocultas en las líneas naturales del pelo y las orejas",
    "Compatible con procedimientos complementarios (blefaroplastia, lipofilling)",
    "Resultado natural que luce como 'tú, pero 10-15 años antes'",
  ],
  steps: [
    { title: "Evaluación y planificación", description: "Análisis del grado de laxitud facial, calidad de la piel y expectativas del paciente para definir la técnica más adecuada." },
    { title: "Exámenes preoperatorios completos", description: "Laboratorios, evaluación cardiovascular, historial de medicamentos anticoagulantes y preparación preoperatoria." },
    { title: "Cirugía bajo anestesia general", description: "Procedimiento de 3 a 5 horas que puede incluir cuello, mejillas y zona temporal según el plan establecido." },
    { title: "Recuperación supervisada en Medellín", description: "12 a 14 días de recuperación con controles diarios los primeros días, retiro de drenajes y seguimiento del proceso de cicatrización." },
  ],
  candidates: [
    "Adultos de 45 a 65 años con signos avanzados de envejecimiento facial",
    "Personas con pérdida de definición del óvalo facial y papada",
    "Pacientes con buenas condiciones de salud general sin contraindicaciones anestésicas",
    "Casos que desean resultados duraderos superiores a los obtenidos con tratamientos no invasivos",
  ],
  timeline: "La cirugía dura 3-5 horas. Se requieren entre 14 y 18 días en Medellín para la recuperación inicial. El resultado final se estabiliza a los 3-6 meses.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Facelift",
  description: "Surgical procedure that repositions descended facial tissues to restore the definition of the facial oval, neck and mandibular area without producing tight or artificial results.",
  benefits: [
    "Deep and lasting facial rejuvenation — results lasting 7 to 15 years",
    "Tissue repositioning without the tight appearance of old techniques",
    "Simultaneous improvement of the mandibular area, cheeks and neck",
    "Scars hidden in the natural hairline and ear lines",
    "Compatible with complementary procedures (blepharoplasty, lipofilling)",
    "Natural result that looks like 'you, but 10-15 years younger'",
  ],
  steps: [
    { title: "Assessment and planning", description: "Analysis of the degree of facial laxity, skin quality and patient expectations to define the most appropriate technique." },
    { title: "Complete pre-operative tests", description: "Labs, cardiovascular assessment, anticoagulant medication history and pre-operative preparation." },
    { title: "Surgery under general anesthesia", description: "Procedure of 3 to 5 hours that may include the neck, cheeks and temporal area according to the established plan." },
    { title: "Supervised recovery in Medellín", description: "12 to 14 days of recovery with daily check-ups during the first days, drain removal and monitoring of the healing process." },
  ],
  candidates: [
    "Adults aged 45 to 65 with advanced signs of facial aging",
    "People with loss of facial oval definition and jowls",
    "Patients in good general health without anesthetic contraindications",
    "Cases seeking lasting results beyond what non-invasive treatments can achieve",
  ],
  timeline: "Surgery lasts 3-5 hours. Between 14 and 18 days in Medellín are required for initial recovery. The final result stabilizes at 3-6 months.",
  specialty: "facial" as const,
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: `${content.title} — Allura Healthcare`,
    description: content.description,
  };
}

export default async function LiftingFacialPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/facial-harmony/lifting-facial')
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
