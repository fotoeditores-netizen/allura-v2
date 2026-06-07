import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "planificacion-personalizada";

const contentEs = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Planificación Personalizada",
  description: "Simulación digital animada y detallada de tu tratamiento completo: ves exactamente cómo se moverá cada diente, en qué orden y cuánto tiempo tomará, antes de que se fabriquen los alineadores.",
  benefits: [
    "Visualización 3D animada del movimiento dental paso a paso",
    "Aprobación del resultado final antes de comenzar el tratamiento",
    "Comunicación precisa de expectativas y objetivos entre especialista y paciente",
    "Ajustes posibles antes de la fabricación definitiva",
    "Estimación precisa de la duración y el número de etapas",
    "Plan compartible por correo electrónico para revisión desde tu país",
  ],
  steps: [
    { title: "Análisis de escáner y registros", description: "El especialista analiza el escáner 3D, fotografías y radiografías para elaborar el plan de tratamiento." },
    { title: "Diseño de la secuencia de movimientos", description: "Diseño etapa por etapa de los movimientos dentales, considerando prioridades clínicas y objetivos estéticos." },
    { title: "Revisión conjunta con el paciente", description: "Presentación del plan animado al paciente en pantalla con explicación de cada fase del tratamiento." },
    { title: "Aprobación y fabricación", description: "Tras la aprobación del paciente, se inicia la fabricación de todos los alineadores del plan de tratamiento." },
  ],
  candidates: [
    "Todos los pacientes de alineadores reciben una planificación personalizada",
    "Pacientes que desean entender completamente su tratamiento antes de comprometerse",
    "Casos internacionales que toman decisiones a distancia antes de viajar",
    "Personas con alta exigencia estética que quieren aprobar el resultado esperado",
  ],
  timeline: "La planificación se presenta en la primera consulta o se envía digitalmente al paciente. La revisión y aprobación pueden hacerse por videollamada desde cualquier país.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Personalized Planning",
  description: "Detailed animated digital simulation of your complete treatment: you see exactly how each tooth will move, in what order and how long it will take, before the aligners are fabricated.",
  benefits: [
    "3D animated visualization of tooth movement step by step",
    "Approval of the final result before starting treatment",
    "Precise communication of expectations and goals between specialist and patient",
    "Adjustments possible before definitive fabrication",
    "Precise estimate of duration and number of stages",
    "Plan shareable by email for review from your country",
  ],
  steps: [
    { title: "Scanner and records analysis", description: "The specialist analyzes the 3D scan, photographs and X-rays to draw up the treatment plan." },
    { title: "Movement sequence design", description: "Stage-by-stage design of tooth movements, considering clinical priorities and aesthetic goals." },
    { title: "Joint review with the patient", description: "Presentation of the animated plan to the patient on screen with explanation of each treatment phase." },
    { title: "Approval and fabrication", description: "After patient approval, fabrication of all aligners in the treatment plan begins." },
  ],
  candidates: [
    "All aligner patients receive a personalized plan",
    "Patients who want to fully understand their treatment before committing",
    "International cases who make decisions remotely before traveling",
    "People with high aesthetic demands who want to approve the expected result",
  ],
  timeline: "The plan is presented at the first consultation or sent digitally to the patient. Review and approval can be done by video call from any country.",
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

export default async function PlanificacionPersonalizadaPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/aligners/planificacion-personalizada')
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
