import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceBySlugQuery, type ServiceDetailData } from "@/sanity/lib/queries";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "bioestimuladores";

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Bioestimuladores y Rejuvenecimiento",
  description: "Tratamientos inyectables de última generación que estimulan el propio organismo para producir colágeno, elastina y otros componentes de la dermis, logrando un rejuvenecimiento progresivo, profundo y de larga duración.",
  benefits: [
    "Estimulación natural de la producción de colágeno y elastina",
    "Mejora progresiva que se intensifica durante meses",
    "Resultados que duran entre 18 meses y 3 años según el producto",
    "Sin aspecto artificial ni aspecto inflado",
    "Compatible con otros procedimientos estéticos faciales",
    "Mejora de la calidad y firmeza de la piel en general",
  ],
  steps: [
    { title: "Evaluación de calidad dérmica", description: "Análisis del estado de la piel, grado de laxitud, volumen y calidad dérmica para seleccionar el bioestimulador más adecuado." },
    { title: "Selección del protocolo", description: "Elección entre Sculptra®, Radiesse®, Ellanse® u otros bioestimuladores disponibles según las necesidades del paciente." },
    { title: "Aplicación con técnica avanzada", description: "Inyección con cánula o aguja según la zona tratada, bajo protocolo de asepsia estricto y mapeo facial previo." },
    { title: "Seguimiento a los 30-90 días", description: "Control del resultado a medio plazo para evaluar la respuesta biológica y planificar sesiones adicionales si corresponde." },
  ],
  candidates: [
    "Adultos de 35 a 65 años con signos de envejecimiento cutáneo progresivo",
    "Pacientes con pérdida de firmeza y tonicidad en piel del rostro y cuello",
    "Personas que buscan resultados naturales y duraderos sin cirugía",
    "Casos donde se quiere mejorar la calidad de la piel más allá del volumen",
  ],
  timeline: "La sesión dura entre 30 y 60 minutos. Se pueden requerir 1 a 3 sesiones. El resultado final se aprecia a los 2-3 meses de la última aplicación y puede durar entre 18 meses y 3 años.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Biostimulators and Rejuvenation",
  description: "Next-generation injectable treatments that stimulate the body to produce collagen, elastin and other dermal components, achieving progressive, deep and long-lasting rejuvenation.",
  benefits: [
    "Natural stimulation of collagen and elastin production",
    "Progressive improvement that intensifies over months",
    "Results lasting between 18 months and 3 years depending on the product",
    "No artificial or inflated appearance",
    "Compatible with other facial aesthetic procedures",
    "Overall improvement in skin quality and firmness",
  ],
  steps: [
    { title: "Dermal quality assessment", description: "Analysis of skin condition, degree of laxity, volume and dermal quality to select the most appropriate biostimulator." },
    { title: "Protocol selection", description: "Choice between Sculptra®, Radiesse®, Ellanse® or other available biostimulators according to the patient's needs." },
    { title: "Application with advanced technique", description: "Injection with cannula or needle depending on the treated area, under strict asepsis protocol and prior facial mapping." },
    { title: "Follow-up at 30-90 days", description: "Mid-term results check to assess the biological response and plan additional sessions if appropriate." },
  ],
  candidates: [
    "Adults aged 35 to 65 with signs of progressive skin aging",
    "Patients with loss of firmness and tone in the facial and neck skin",
    "People seeking natural, long-lasting results without surgery",
    "Cases where improving skin quality beyond volume is the goal",
  ],
  timeline: "The session lasts between 30 and 60 minutes. 1 to 3 sessions may be required. The final result is visible 2-3 months after the last application and can last between 18 months and 3 years.",
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

export default async function BioestimuladoresPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} sanityData={sanityData ?? undefined} locale={locale} />;
}
