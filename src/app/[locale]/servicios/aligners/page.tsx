import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { serviceCategoryBySlugQuery, type ServiceCategoryData } from "@/sanity/lib/queries";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const CATEGORY_SLUG = "aligners";

const contentEs = {
  title: "Allura Aligners™",
  eyebrow: "Ortodoncia Invisible",
  subtitle: "Ortodoncia sin brackets, con planificación digital y seguimiento remoto para pacientes internacionales.",
  description: "Usamos Invisalign y alineadores de última generación para lograr alineaciones precisas con total discreción. Planificación personalizada y seguimiento remoto para pacientes internacionales que no pueden volver a Medellín en cada etapa.",
  heroImage: "/images/imagenes_web/Invisalign_Allurahealthcare_.jpg",
  subServices: [
    { slug: "invisalign", name: "Invisalign", description: "Proveedor oficial Invisalign con especialistas certificados Diamond Top Doctor. Planificación digital precisa para tu caso." },
    { slug: "alineadores-transparentes", name: "Alineadores Transparentes", description: "Ortodoncia con alineadores como alternativa o complemento a Invisalign, personalizada para cada paciente." },
    { slug: "escaneo-digital-3d", name: "Escaneo Digital 3D", description: "Escáner intraoral 3D para tomar impresiones digitales completas: adiós a los moldes tradicionales." },
    { slug: "planificacion-personalizada", name: "Planificación Personalizada", description: "Simulación digital completa del movimiento de tu sonrisa, caso a caso, antes de comenzar el tratamiento." },
    { slug: "seguimiento-remoto", name: "Seguimiento Remoto", description: "Control post-tratamiento internacional mediante fotos, escaneos y videollamadas con tu especialista." },
  ],
};

const contentEn = {
  title: "Allura Aligners™",
  eyebrow: "Invisible Orthodontics",
  subtitle: "Bracket-free orthodontics with digital planning and remote monitoring for international patients.",
  description: "We use Invisalign and next-generation aligners to achieve precise alignments with complete discretion. Personalized digital planning and remote follow-up for international patients who cannot return to Medellín at every stage.",
  heroImage: "/images/imagenes_web/Invisalign_Allurahealthcare_.jpg",
  subServices: [
    { slug: "invisalign", name: "Invisalign", description: "Official Invisalign provider with Diamond Top Doctor-certified specialists. Precise digital planning for your case." },
    { slug: "alineadores-transparentes", name: "Clear Aligners", description: "Clear aligner orthodontics as an alternative or complement to Invisalign, personalized for each patient." },
    { slug: "escaneo-digital-3d", name: "3D Digital Scanning", description: "3D intraoral scanning for complete digital impressions: no more traditional molds." },
    { slug: "planificacion-personalizada", name: "Personalized Planning", description: "Complete digital simulation of your smile movement, case by case, before starting treatment." },
    { slug: "seguimiento-remoto", name: "Remote Monitoring", description: "International post-treatment follow-up via photos, scans and video calls with your specialist." },
  ],
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: sanityData?.seo?.metaTitle?.[loc] ?? `${content.title} — Allura Healthcare`,
    description: sanityData?.seo?.metaDescription?.[loc] ?? content.subtitle,
  };
}

export default async function AlignersPage({ params: { locale } }: { params: { locale: string } }) {
  const sanityData = await client.fetch<ServiceCategoryData | null>(
    serviceCategoryBySlugQuery,
    { slug: CATEGORY_SLUG },
    { next: { revalidate } }
  );
  const content = locale === "en" ? contentEn : contentEs;
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug={CATEGORY_SLUG}
      sanityData={sanityData ?? undefined}
      locale={locale}
    />
  );
}
