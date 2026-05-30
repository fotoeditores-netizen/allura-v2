import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";
import { getServiceCategories, getServices } from "@/lib/supabase/services";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const CATEGORY_SLUG = "facial-harmony";

const contentEs = {
  title: "Allura Facial Harmony™",
  eyebrow: "Medicina Facial Estética",
  subtitle: "Medicina facial estética de precisión para realzar tus rasgos con naturalidad.",
  description: "Nuestro equipo de especialistas trabaja con técnicas mínimamente invasivas y protocolos internacionales para resultados que se ven auténticos y duraderos. Cada plan facial se diseña tras una evaluación estructural de tus proporciones, tipo de piel y objetivos personales.",
  heroImage: "/images/imagenes_web/cirugia-estetica-facial-allurahealthcare.png",
  subServices: [
    { slug: "evaluacion-facial", name: "Evaluación Facial Estructural", description: "Análisis detallado de proporciones, volúmenes y dinámica facial para diseñar un plan personalizado y natural." },
    { slug: "toxina-botulinica", name: "Toxina Botulínica y Rellenos", description: "Protocolos de aplicación precisa para suavizar líneas de expresión y restaurar volúmenes faciales con aspecto natural." },
    { slug: "bioestimuladores", name: "Bioestimuladores y Rejuvenecimiento", description: "Tratamientos para regenerar colágeno y mejorar la calidad de la piel desde adentro: firmeza, luminosidad y textura." },
    { slug: "blefaroplastia", name: "Blefaroplastia", description: "Corrección quirúrgica de párpados para una mirada más descansada y juvenil, con resultados naturales y recuperación rápida." },
    { slug: "rinoplastia", name: "Rinoplastia", description: "Remodelación nasal con técnica abierta o cerrada, adaptada a cada estructura facial para resultados armoniosos y naturales." },
    { slug: "lifting-facial", name: "Lifting Facial", description: "Rejuvenecimiento facial quirúrgico que reposiciona tejidos y reduce signos visibles de envejecimiento sin aspecto artificial." },
    { slug: "mentoplastia", name: "Mentoplastia", description: "Aumento o reducción del mentón para mejorar las proporciones faciales y fortalecer el perfil mentón-cuello." },
    { slug: "cirugia-maxilofacial", name: "Coordinación con Cirugía Maxilofacial", description: "Coordinación con cirujanos maxilofaciales para casos complejos que combinan correcciones estéticas y funcionales." },
  ],
};

const contentEn = {
  title: "Allura Facial Harmony™",
  eyebrow: "Facial Aesthetic Medicine",
  subtitle: "Precision facial aesthetic medicine to enhance your features naturally.",
  description: "Our team of specialists works with minimally invasive techniques and international protocols for results that look authentic and lasting. Each facial plan is designed after structural evaluation of your proportions, skin type and personal goals.",
  heroImage: "/images/imagenes_web/cirugia-estetica-facial-allurahealthcare.png",
  subServices: [
    { slug: "evaluacion-facial", name: "Structural Facial Assessment", description: "Detailed analysis of proportions, volumes and facial dynamics to design a personalized and natural plan." },
    { slug: "toxina-botulinica", name: "Botulinum Toxin and Fillers", description: "Precise application protocols for softening expression lines and restoring facial volumes with a natural look." },
    { slug: "bioestimuladores", name: "Biostimulators and Rejuvenation", description: "Treatments to regenerate collagen and improve skin quality from within: firmness, luminosity and texture." },
    { slug: "blefaroplastia", name: "Blepharoplasty", description: "Surgical correction of eyelids for a more rested and youthful look, with natural results and fast recovery." },
    { slug: "rinoplastia", name: "Rhinoplasty", description: "Nasal remodeling with open or closed technique, adapted to each facial structure for harmonious and natural results." },
    { slug: "lifting-facial", name: "Facelift", description: "Surgical facial rejuvenation that repositions tissues and reduces visible signs of aging without an artificial look." },
    { slug: "mentoplastia", name: "Mentoplasty", description: "Chin augmentation or reduction to improve facial proportions and strengthen the chin-neck profile." },
    { slug: "cirugia-maxilofacial", name: "Maxillofacial Surgery Coordination", description: "Coordination with maxillofacial surgeons for complex cases combining aesthetic and functional corrections." },
  ],
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const loc = locale as "es" | "en";
  const content = loc === "en" ? contentEn : contentEs;
  return {
    title: `${content.title} — Allura Healthcare`,
    description: content.subtitle,
  };
}

export default async function FacialHarmonyPage({ params: { locale } }: { params: { locale: string } }) {
  const loc = locale as "es" | "en";
  const hardcode = loc === "en" ? contentEn : contentEs;

  const [categories, services] = await Promise.all([getServiceCategories(), getServices()])
  const cat = categories.find(c => c.slug === CATEGORY_SLUG)
  const catServices = cat ? services.filter(s => s.categoryId === cat.id) : []

  const content = {
    ...hardcode,
    ...(cat && {
      title: (cat.title as { es: string; en: string })[loc] || hardcode.title,
      subtitle: (cat.description as { es: string; en: string })[loc] || hardcode.subtitle,
    }),
    subServices: catServices.length > 0
      ? catServices.map(s => ({
          slug: s.slug,
          name: (s.title as { es: string; en: string })[loc] || s.slug,
          description: (s.description as { es: string; en: string })[loc] || '',
        }))
      : hardcode.subServices,
  }
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug={CATEGORY_SLUG}
      locale={locale}
    />
  );
}
