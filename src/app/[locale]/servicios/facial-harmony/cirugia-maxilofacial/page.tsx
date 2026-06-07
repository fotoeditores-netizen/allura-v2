import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "cirugia-maxilofacial";

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Coordinación con Cirugía Maxilofacial",
  description: "Planificación interdisciplinaria que integra odontología y cirugía maxilofacial para casos complejos que requieren corrección ósea de la mandíbula, el maxilar superior o las estructuras faciales profundas.",
  benefits: [
    "Coordinación sin costura entre odontología y cirugía maxilofacial",
    "Planificación digital preoperatoria con guías quirúrgicas 3D",
    "Tratamiento de maloclusiones esqueléticas severas no resolubles con ortodoncia",
    "Corrección de asimetrías faciales de base ósea",
    "Equipo interdisciplinario con protocolos internacionales",
    "Seguimiento conjunto durante todo el proceso de recuperación",
  ],
  steps: [
    { title: "Diagnóstico interdisciplinario", description: "Evaluación conjunta entre el ortodoncista y el cirujano maxilofacial de Allura, con cefalometría digital y modelos 3D." },
    { title: "Preparación ortodóncica prequirúrgica", description: "Alineación dental mediante brackets o alineadores para preparar la dentición para la cirugía. Este período puede durar 12-18 meses." },
    { title: "Cirugía ortognática", description: "Procedimiento quirúrgico bajo anestesia general para reposicionar los maxilares y/o la mandíbula según el plan establecido." },
    { title: "Ortodoncia postoperatoria y seguimiento", description: "Finalización del tratamiento ortodóncico tras la cirugía para conseguir la oclusión óptima planificada." },
  ],
  candidates: [
    "Pacientes con maloclusión esquelética severa (clase II o clase III ósea)",
    "Casos con asimetría facial de origen óseo",
    "Personas con apnea obstructiva del sueño relacionada con la morfología maxilofacial",
    "Pacientes que no responden al tratamiento ortodóncico convencional",
  ],
  timeline: "El tratamiento completo puede durar entre 18 y 36 meses, incluyendo las fases de ortodoncia pre y postquirúrgica. La cirugía en sí requiere hospitalización de 1-2 días y recuperación inicial de 10-14 días en Medellín.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Maxillofacial Surgery Coordination",
  description: "Interdisciplinary planning integrating dentistry and maxillofacial surgery for complex cases requiring bone correction of the jaw, upper maxilla or deep facial structures.",
  benefits: [
    "Seamless coordination between dentistry and maxillofacial surgery",
    "Pre-operative digital planning with 3D surgical guides",
    "Treatment of severe skeletal malocclusions not resolvable with orthodontics",
    "Correction of bone-based facial asymmetries",
    "Interdisciplinary team with international protocols",
    "Joint follow-up throughout the entire recovery process",
  ],
  steps: [
    { title: "Interdisciplinary diagnosis", description: "Joint assessment between Allura's orthodontist and maxillofacial surgeon, with digital cephalometry and 3D models." },
    { title: "Pre-surgical orthodontic preparation", description: "Dental alignment using braces or aligners to prepare the dentition for surgery. This period may last 12-18 months." },
    { title: "Orthognathic surgery", description: "Surgical procedure under general anesthesia to reposition the maxillae and/or mandible according to the established plan." },
    { title: "Post-operative orthodontics and follow-up", description: "Completion of orthodontic treatment after surgery to achieve the planned optimal occlusion." },
  ],
  candidates: [
    "Patients with severe skeletal malocclusion (bone class II or class III)",
    "Cases with facial asymmetry of bone origin",
    "People with obstructive sleep apnea related to maxillofacial morphology",
    "Patients who do not respond to conventional orthodontic treatment",
  ],
  timeline: "The complete treatment can last between 18 and 36 months, including the pre- and post-surgical orthodontic phases. The surgery itself requires 1-2 days hospitalization and initial recovery of 10-14 days in Medellín.",
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

export default async function CirugiaMaxilofacialPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/facial-harmony/cirugia-maxilofacial')
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
