import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceBySlugQuery, type ServiceDetailData } from "@/sanity/lib/queries";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "mentoplastia";

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Mentoplastia",
  description: "Cirugía de redefinición del mentón para mejorar la proyección y el equilibrio del perfil facial. Puede realizarse con implantes de silicona médica o con reposicionamiento óseo según la indicación clínica.",
  benefits: [
    "Mejora significativa del perfil y el equilibrio facial",
    "Procedimiento mínimamente invasivo con cicatriz interna imperceptible",
    "Recuperación más rápida que otros procedimientos quirúrgicos faciales",
    "Compatible con rinoplastia para corrección integral del perfil",
    "Implantes de silicona médica certificados de alta calidad",
    "Resultado permanente y proporcional a los rasgos del paciente",
  ],
  steps: [
    { title: "Análisis de perfil y planificación", description: "Evaluación de la proyección actual del mentón en relación con nariz, labios y frente. Morfing fotográfico del perfil." },
    { title: "Exámenes preoperatorios", description: "Laboratorios y evaluación médica general para autorizar el procedimiento bajo anestesia local con sedación." },
    { title: "Cirugía", description: "Incisión interna (en boca) o submentoniana mínima para insertar el implante en la posición planeada. Duración: 45 a 90 minutos." },
    { title: "Recuperación", description: "Reposo de 5 a 7 días. Dieta blanda la primera semana. El edema disminuye progresivamente durante los primeros 30 días." },
  ],
  candidates: [
    "Adultos con mentón retruido que desequilibra las proporciones faciales",
    "Pacientes que buscan mejorar el perfil facial sin cirugía de mayor complejidad",
    "Casos que se combinan con rinoplastia para corrección integral",
    "Personas con expectativas realistas sobre los resultados alcanzables",
  ],
  timeline: "La cirugía dura entre 45 y 90 minutos. Se requieren entre 7 y 10 días en Medellín. El resultado final se aprecia completamente a los 30-60 días.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Mentoplasty",
  description: "Chin redefinition surgery to improve the projection and balance of the facial profile. Can be performed with medical silicone implants or with bone repositioning depending on the clinical indication.",
  benefits: [
    "Significant improvement of the profile and facial balance",
    "Minimally invasive procedure with imperceptible internal scar",
    "Faster recovery than other facial surgical procedures",
    "Compatible with rhinoplasty for comprehensive profile correction",
    "High-quality certified medical silicone implants",
    "Permanent result proportional to the patient's features",
  ],
  steps: [
    { title: "Profile analysis and planning", description: "Assessment of current chin projection relative to the nose, lips and forehead. Photographic profile morphing." },
    { title: "Pre-operative tests", description: "Labs and general medical assessment to authorize the procedure under local anesthesia with sedation." },
    { title: "Surgery", description: "Internal (intraoral) or minimal submental incision to insert the implant in the planned position. Duration: 45 to 90 minutes." },
    { title: "Recovery", description: "Rest of 5 to 7 days. Soft diet during the first week. Swelling decreases progressively during the first 30 days." },
  ],
  candidates: [
    "Adults with retruded chin that unbalances facial proportions",
    "Patients seeking to improve the facial profile without more complex surgery",
    "Cases combined with rhinoplasty for comprehensive correction",
    "People with realistic expectations about achievable results",
  ],
  timeline: "Surgery lasts between 45 and 90 minutes. Between 7 and 10 days in Medellín are required. The final result is fully visible at 30-60 days.",
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

export default async function MentoplastiaPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} sanityData={sanityData ?? undefined} locale={locale} />;
}
