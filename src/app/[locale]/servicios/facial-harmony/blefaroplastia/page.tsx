import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceBySlugQuery, type ServiceDetailData } from "@/sanity/lib/queries";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "blefaroplastia";

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Blefaroplastia",
  description: "Cirugía de párpados para corregir el exceso de piel, la grasa herniada y la flacidez de la zona periocular, logrando una mirada más fresca, descansada y rejuvenecida sin alterar la expresión característica del paciente.",
  benefits: [
    "Corrección del exceso de piel en párpados superiores e inferiores",
    "Eliminación de bolsas de grasa bajo los ojos",
    "Mirada más abierta, descansada y juvenil",
    "Cicatrices mínimas ocultas en los pliegues naturales del párpado",
    "Recuperación relativamente rápida comparada con otras cirugías faciales",
    "Resultado permanente — el tejido extraído no regresa",
  ],
  steps: [
    { title: "Evaluación oftalmológica y estética", description: "Descarte de condiciones oftalmológicas que puedan contraindicar la cirugía. Fotografía clínica y análisis estético detallado." },
    { title: "Exámenes preoperatorios", description: "Laboratorios, evaluación cardiovascular y cualquier estudio requerido según el estado de salud del paciente." },
    { title: "Cirugía con anestesia local y sedación", description: "Procedimiento bajo sedación consciente y anestesia local. Duración entre 1 y 2 horas según si son párpados superiores, inferiores o ambos." },
    { title: "Recuperación y seguimiento", description: "Reposo de 5 a 7 días en Medellín. Retiro de puntos a los 5-7 días. Seguimiento remoto posterior." },
  ],
  candidates: [
    "Adultos con exceso de piel en párpados superiores que afecta la visión o la estética",
    "Personas con bolsas grasas persistentes bajo los ojos",
    "Pacientes en buen estado de salud general sin contraindicaciones oftalmológicas",
    "Casos que desean rejuvenecimiento de la mirada sin cambiar la expresión facial",
  ],
  timeline: "La cirugía dura 1-2 horas. Se requieren 10-12 días en Medellín (cirugía + recuperación inicial + retiro de puntos). El resultado final se aprecia completamente a los 3 meses.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Blepharoplasty",
  description: "Eyelid surgery to correct excess skin, herniated fat and laxity of the periocular area, achieving a fresher, more rested and rejuvenated look without altering the patient's characteristic expression.",
  benefits: [
    "Correction of excess skin on upper and lower eyelids",
    "Removal of fat bags under the eyes",
    "A more open, rested and youthful look",
    "Minimal scars hidden in the natural eyelid folds",
    "Relatively fast recovery compared to other facial surgeries",
    "Permanent result — the removed tissue does not return",
  ],
  steps: [
    { title: "Ophthalmological and aesthetic assessment", description: "Ruling out ophthalmological conditions that may contraindicate surgery. Clinical photography and detailed aesthetic analysis." },
    { title: "Pre-operative tests", description: "Labs, cardiovascular assessment and any studies required based on the patient's health status." },
    { title: "Surgery under local anesthesia and sedation", description: "Procedure under conscious sedation and local anesthesia. Duration between 1 and 2 hours depending on whether upper, lower or both eyelids are treated." },
    { title: "Recovery and follow-up", description: "Rest of 5 to 7 days in Medellín. Suture removal at 5-7 days. Remote follow-up thereafter." },
  ],
  candidates: [
    "Adults with excess skin on upper eyelids affecting vision or aesthetics",
    "People with persistent fat bags under the eyes",
    "Patients in good general health with no ophthalmological contraindications",
    "Cases seeking rejuvenation of the gaze without changing facial expression",
  ],
  timeline: "Surgery lasts 1-2 hours. 10-12 days in Medellín are required (surgery + initial recovery + suture removal). The final result is fully visible at 3 months.",
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

export default async function BlefaroplastiaPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} sanityData={sanityData ?? undefined} locale={locale} />;
}
