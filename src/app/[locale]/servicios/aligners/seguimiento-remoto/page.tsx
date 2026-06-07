import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "seguimiento-remoto";

const contentEs = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "Seguimiento Remoto Internacional",
  description: "Protocolo diseñado específicamente para pacientes que inician su tratamiento de ortodoncia en Medellín y continúan desde su país de origen. Control profesional a distancia sin sacrificar calidad ni seguridad.",
  benefits: [
    "Tratamiento de ortodoncia sin necesidad de vivir en Medellín",
    "Controles periódicos por videollamada con tu especialista",
    "Revisión de fotografías intraorales para evaluar el progreso sin desplazarse",
    "Envío de alineadores por correo internacional según protocolo",
    "Acceso directo al especialista por WhatsApp para consultas urgentes",
    "Visitas presenciales solo en momentos clave del tratamiento",
  ],
  steps: [
    { title: "Inicio presencial en Medellín", description: "Primera visita para diagnóstico, escáner, aprobación del plan y entrega del primer lote de alineadores." },
    { title: "Protocolo de fotografías remotas", description: "El paciente envía fotografías intraorales estandarizadas periódicamente según el protocolo establecido." },
    { title: "Controles por videollamada", description: "Revisión virtual regular con el especialista para evaluar la evolución, resolver dudas y aprobar el avance al siguiente lote." },
    { title: "Visitas presenciales estratégicas", description: "Visitas a Medellín en puntos clave: cambio de bracket, refinamientos o instalación de la contención final." },
  ],
  candidates: [
    "Pacientes internacionales que no residen en Colombia",
    "Personas que viajan ocasionalmente a Colombia y pueden hacer visitas puntuales",
    "Casos de moderada a alta complejidad que aceptan el modelo de seguimiento híbrido",
    "Pacientes que ya tuvieron una cita de diagnóstico presencial en Allura",
  ],
  timeline: "La duración total es la misma que el tratamiento presencial. La visita inicial es de 2-3 días; las visitas posteriores (si se requieren) son de 1-2 días cada una.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Allura Aligners",
  categorySlug: "aligners",
  title: "International Remote Monitoring",
  description: "Protocol designed specifically for patients who begin their orthodontic treatment in Medellín and continue from their home country. Professional distance monitoring without sacrificing quality or safety.",
  benefits: [
    "Orthodontic treatment without needing to live in Medellín",
    "Periodic check-ups by video call with your specialist",
    "Intraoral photograph review to assess progress without traveling",
    "International shipping of aligners per protocol",
    "Direct access to the specialist via WhatsApp for urgent queries",
    "In-person visits only at key moments of the treatment",
  ],
  steps: [
    { title: "In-person start in Medellín", description: "First visit for diagnosis, scan, plan approval and delivery of the first batch of aligners." },
    { title: "Remote photograph protocol", description: "The patient sends standardized intraoral photographs periodically according to the established protocol." },
    { title: "Video call check-ups", description: "Regular virtual review with the specialist to assess progress, resolve questions and approve advancement to the next batch." },
    { title: "Strategic in-person visits", description: "Visits to Medellín at key points: attachment changes, refinements or installation of the final retainer." },
  ],
  candidates: [
    "International patients who do not reside in Colombia",
    "People who travel occasionally to Colombia and can make targeted visits",
    "Moderate to high complexity cases that accept the hybrid monitoring model",
    "Patients who have already had an in-person diagnostic appointment at Allura",
  ],
  timeline: "Total duration is the same as in-person treatment. The initial visit is 2-3 days; subsequent visits (if required) are 1-2 days each.",
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

export default async function SeguimientoRemotoPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/aligners/seguimiento-remoto')
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
