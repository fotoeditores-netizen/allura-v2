import type { Metadata } from "next";
import { ServiceDetailTemplate } from "@/components/templates/ServiceDetailTemplate";
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages';
import { renderSection } from '@/lib/render-section';

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const SERVICE_SLUG = "blanqueamiento-dental";

const contentEs = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Blanqueamiento Dental Profesional",
  description: "Protocolo clínico de blanqueamiento supervisado por nuestros especialistas para lograr resultados seguros, uniformes y duraderos que superan lo que puede lograrse con blanqueamiento casero sin supervisión.",
  benefits: [
    "Aclaramiento de hasta 8 tonos en una sola sesión clínica",
    "Control profesional que garantiza resultados uniformes",
    "Protección gingival durante todo el procedimiento",
    "Sin daño al esmalte cuando se realiza bajo supervisión especializada",
    "Protocolo de mantenimiento personalizado para prolongar el resultado",
    "Compatible y previo a otros tratamientos estéticos como carillas",
  ],
  steps: [
    { title: "Evaluación del estado dental", description: "Limpieza profesional y revisión de obturaciones o zonas sensibles que puedan afectar el resultado o la tolerancia al tratamiento." },
    { title: "Protección gingival", description: "Aplicación de barrera de resina fotopolimerizable en la encía para protegerla completamente durante el blanqueamiento." },
    { title: "Aplicación del gel blanqueador", description: "Aplicación de peróxido de hidrógeno de alta concentración en los dientes y activación con luz de polimerización LED." },
    { title: "Plan de mantenimiento domiciliario", description: "Entrega de cubetas personalizadas y gel de menor concentración para mantener el resultado desde casa." },
  ],
  candidates: [
    "Pacientes con dientes amarillos, grises o manchados por café, té o tabaco",
    "Personas con pigmentación intrínseca leve a moderada",
    "Pacientes que quieren mejorar su sonrisa antes de un evento importante",
    "Como paso previo a la instalación de carillas o restauraciones estéticas",
  ],
  timeline: "Una sesión de blanqueamiento clínico dura entre 60 y 90 minutos. Se puede complementar con blanqueamiento domiciliario durante 1-2 semanas adicionales desde tu país.",
  specialty: "odontologia" as const,
};

const contentEn = {
  category: "Smile Makeover",
  categorySlug: "smile-makeover",
  title: "Professional Teeth Whitening",
  description: "Clinical whitening protocol supervised by our specialists to achieve safe, uniform and lasting results that surpass what can be achieved with unsupervised home whitening.",
  benefits: [
    "Lightening of up to 8 shades in a single clinical session",
    "Professional control that ensures uniform results",
    "Gingival protection throughout the procedure",
    "No enamel damage when performed under specialized supervision",
    "Personalized maintenance protocol to prolong the result",
    "Compatible with and prior to other aesthetic treatments such as veneers",
  ],
  steps: [
    { title: "Dental condition evaluation", description: "Professional cleaning and review of fillings or sensitive areas that may affect the result or treatment tolerance." },
    { title: "Gingival protection", description: "Application of a light-cured resin barrier on the gum to completely protect it during whitening." },
    { title: "Whitening gel application", description: "Application of high-concentration hydrogen peroxide on the teeth and activation with LED polymerization light." },
    { title: "Home maintenance plan", description: "Delivery of custom trays and lower-concentration gel to maintain the result from home." },
  ],
  candidates: [
    "Patients with yellow, grey or stained teeth from coffee, tea or tobacco",
    "People with mild to moderate intrinsic pigmentation",
    "Patients who want to improve their smile before an important event",
    "As a prior step before installing veneers or aesthetic restorations",
  ],
  timeline: "A clinical whitening session lasts between 60 and 90 minutes. It can be complemented with home whitening for 1-2 additional weeks from your country.",
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

export default async function BlanqueamientoDentalPage({ params: { locale } }: { params: { locale: string } }) {
  const content = locale === "en" ? contentEn : contentEs;

  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/servicios/smile-makeover/blanqueamiento-dental')
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
