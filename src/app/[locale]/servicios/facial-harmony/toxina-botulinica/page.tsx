import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceBySlugQuery, type ServiceDetailData } from "@/sanity/lib/queries";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "toxina-botulinica";

const contentEs = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Toxina Botulínica y Rellenos Dérmicos",
  description: "Aplicación de toxina botulínica y ácido hialurónico con criterio médico y visión artística para suavizar expresiones, restaurar volumen y armonizar el rostro con resultados naturales que no se notan pero se perciben.",
  benefits: [
    "Resultados visibles desde las 72 horas para la toxina botulínica",
    "Sin cirugía, sin anestesia general, sin período de recuperación significativo",
    "Técnicas de inyección avanzadas para resultados naturales y simétricos",
    "Productos de marca reconocida con registro sanitario INVIMA",
    "Planificación por zonas: frente, entrecejo, patas de gallo, pómulos, labios",
    "Resultado reversible con hialuronidasa en el caso de rellenos con ácido hialurónico",
  ],
  steps: [
    { title: "Evaluación y mapeo facial", description: "El especialista analiza la musculatura facial, volúmenes y asimetrías para diseñar el plan de aplicación zona a zona." },
    { title: "Planificación del tratamiento", description: "Definición de los productos, dosis y puntos de aplicación exactos según el objetivo de cada zona." },
    { title: "Aplicación del tratamiento", description: "Inyecciones precisas con agujas ultrafinas o cánulas bajo protocolo de asepsia estricto. El procedimiento dura 20-45 minutos." },
    { title: "Control y seguimiento", description: "Control a los 14 días para evaluar el resultado y realizar ajustes si fuera necesario." },
  ],
  candidates: [
    "Adultos con líneas de expresión o arrugas dinámicas",
    "Personas que desean restaurar volumen facial perdido con el envejecimiento",
    "Casos de asimetría labial o facial que se benefician de corrección con rellenos",
    "Pacientes que buscan resultados naturales sin cirugía",
  ],
  timeline: "El procedimiento dura entre 30 y 60 minutos. El resultado de la toxina botulínica aparece en 3-7 días y dura 4-6 meses. Los rellenos de ácido hialurónico duran entre 9 y 18 meses según la zona.",
  specialty: "facial" as const,
};

const contentEn = {
  category: "Facial Harmony",
  categorySlug: "facial-harmony",
  title: "Botulinum Toxin and Dermal Fillers",
  description: "Application of botulinum toxin and hyaluronic acid with medical judgment and artistic vision to soften expressions, restore volume and harmonize the face with natural results that are not noticed but are felt.",
  benefits: [
    "Visible results within 72 hours for botulinum toxin",
    "No surgery, no general anesthesia, no significant recovery period",
    "Advanced injection techniques for natural and symmetrical results",
    "Brand-name products with INVIMA health registry",
    "Zone-by-zone planning: forehead, frown lines, crow's feet, cheekbones, lips",
    "Reversible results with hyaluronidase in the case of hyaluronic acid fillers",
  ],
  steps: [
    { title: "Facial assessment and mapping", description: "The specialist analyzes facial musculature, volumes and asymmetries to design the zone-by-zone application plan." },
    { title: "Treatment planning", description: "Definition of products, doses and exact application points according to each zone's objective." },
    { title: "Treatment application", description: "Precise injections with ultra-fine needles or cannulas under strict asepsis protocol. The procedure takes 20-45 minutes." },
    { title: "Follow-up check", description: "Check-up at 14 days to assess the result and make adjustments if necessary." },
  ],
  candidates: [
    "Adults with expression lines or dynamic wrinkles",
    "People who wish to restore facial volume lost with aging",
    "Cases of lip or facial asymmetry that benefit from filler correction",
    "Patients seeking natural results without surgery",
  ],
  timeline: "The procedure takes between 30 and 60 minutes. Botulinum toxin results appear in 3-7 days and last 4-6 months. Hyaluronic acid fillers last between 9 and 18 months depending on the area.",
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

export default async function ToxinaBotulinicaPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceDetailData | null>(
    serviceBySlugQuery,
    { slug: SERVICE_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return <ServiceDetailTemplate {...content} sanityData={sanityData ?? undefined} locale={locale} />;
}
