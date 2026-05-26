import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceBySlugQuery, type ServiceDetailData } from "@/sanity/lib/queries";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "rinoplastia";

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Rinoplastia",
  description: "Cirugía de refinamiento nasal orientada a mejorar la armonía del perfil y la estética del rostro en conjunto, siempre respetando la identidad del paciente y priorizando resultados naturales sobre cambios drásticos.",
  benefits: [
    "Mejora del equilibrio entre nariz y rasgos faciales",
    "Técnica primaria o de revisión según el historial del paciente",
    "Enfoque en naturalidad y coherencia con la identidad facial del paciente",
    "Combinable con corrección funcional (septum, cornetes) si es necesario",
    "Planificación con morfing fotográfico previo para alineación de expectativas",
    "Seguimiento postoperatorio remoto con nuestro equipo especializado",
  ],
  steps: [
    { title: "Consulta y morfing fotográfico", description: "Evaluación del caso, análisis de las proporciones nasofaciales y simulación fotográfica del resultado esperado." },
    { title: "Exámenes preoperatorios", description: "Laboratorios, TAC nasal y evaluación médica completa antes de autorizar la cirugía." },
    { title: "Cirugía bajo anestesia general", description: "Procedimiento de 2 a 3 horas bajo anestesia general. Técnica abierta o cerrada según la complejidad del caso." },
    { title: "Recuperación y seguimiento", description: "Reposo de 7 a 10 días en Medellín con retiro de puntos y descangue. Seguimiento remoto hasta los 6-12 meses postoperatorios." },
  ],
  candidates: [
    "Adultos mayores de 18 años con desarrollo facial completo",
    "Personas con joroba nasal, punta ancha o asimetría que les genera insatisfacción",
    "Pacientes con obstrucción respiratoria que puede corregirse simultáneamente",
    "Casos de rinoplastia de revisión por procedimientos previos insatisfactorios",
  ],
  timeline: "La cirugía dura 2-3 horas. Se requieren 12-14 días en Medellín. El resultado final se evalúa a los 12 meses cuando desaparece el edema residual.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Rhinoplasty",
  description: "Nasal refinement surgery aimed at improving profile harmony and overall facial aesthetics, always respecting the patient's identity and prioritizing natural results over drastic changes.",
  benefits: [
    "Improved balance between nose and facial features",
    "Primary or revision technique depending on patient history",
    "Focus on naturalness and consistency with the patient's facial identity",
    "Combinable with functional correction (septum, turbinates) if needed",
    "Planning with prior photographic morphing for expectation alignment",
    "Remote post-operative follow-up with our specialized team",
  ],
  steps: [
    { title: "Consultation and photographic morphing", description: "Case assessment, nasofacial proportion analysis and photographic simulation of the expected result." },
    { title: "Pre-operative tests", description: "Labs, nasal CT scan and complete medical evaluation before authorizing surgery." },
    { title: "Surgery under general anesthesia", description: "Procedure of 2 to 3 hours under general anesthesia. Open or closed technique depending on case complexity." },
    { title: "Recovery and follow-up", description: "Rest of 7 to 10 days in Medellín with suture and cast removal. Remote follow-up up to 6-12 months post-operatively." },
  ],
  candidates: [
    "Adults over 18 years of age with complete facial development",
    "People with nasal hump, wide tip or asymmetry causing dissatisfaction",
    "Patients with respiratory obstruction that can be corrected simultaneously",
    "Revision rhinoplasty cases due to unsatisfactory prior procedures",
  ],
  timeline: "Surgery lasts 2-3 hours. 12-14 days in Medellín are required. The final result is assessed at 12 months when residual swelling disappears.",
  specialty: "facial" as const,
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: sanityData?.seo?.metaTitle?.[loc] ?? `${content.title} — Allura Healthcare`,
    description: sanityData?.seo?.metaDescription?.[loc] ?? content.description,
  };
}

export default async function RinoplastiaPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} sanityData={sanityData ?? undefined} locale={locale} />;
}
