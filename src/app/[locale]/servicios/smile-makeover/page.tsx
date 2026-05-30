import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";
import { getServiceCategories, getServices } from "@/lib/supabase/services";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

const CATEGORY_SLUG = "smile-makeover";

const contentEs = {
  title: "Allura Smile Makeover™",
  eyebrow: "Estética Dental",
  subtitle: "Tu sonrisa, rediseñada con precisión artística. Cada detalle, pensado para ti.",
  description: "Combinamos diseño digital, carillas en porcelana y tecnología de vanguardia para que cada sonrisa sea única, natural y proyecte exactamente lo que quieres transmitir. Nuestros especialistas en estética dental trabajan con criterio artístico y rigor clínico en cada caso.",
  heroImage: "/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg",
  subServices: [
    { slug: "carillas-porcelana", name: "Carillas en Porcelana", description: "Láminas ultrafinas de porcelana adheridas a los dientes para transformar color, forma y alineación con resultados ultranatural." },
    { slug: "diseno-digital-sonrisa", name: "Diseño Digital de Sonrisa", description: "Simulación digital de tu nueva sonrisa antes de comenzar. Ves el resultado final y apruebas cada detalle antes del primer procedimiento." },
    { slug: "coronas-porcelana", name: "Coronas en Porcelana", description: "Fundas de porcelana de alta resistencia que restauran dientes dañados devolviéndoles apariencia, función y resistencia totales." },
    { slug: "restauraciones-esteticas", name: "Restauraciones Estéticas Avanzadas", description: "Técnicas adhesivas de última generación para corregir fracturas, manchas, diastemas y deformidades con mínima invasión." },
    { slug: "blanqueamiento-dental", name: "Blanqueamiento Dental Profesional", description: "Protocolo clínico de blanqueamiento supervisado por especialistas para resultados seguros, uniformes y duraderos." },
  ],
};

const contentEn = {
  title: "Allura Smile Makeover™",
  eyebrow: "Dental Aesthetics",
  subtitle: "Your smile, redesigned with artistic precision. Every detail, crafted for you.",
  description: "We combine digital design, porcelain veneers and cutting-edge technology so that each smile is unique, natural and projects exactly what you want to convey. Our dental aesthetics specialists work with artistic judgment and clinical rigor in every case.",
  heroImage: "/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg",
  subServices: [
    { slug: "carillas-porcelana", name: "Porcelain Veneers", description: "Ultra-thin porcelain wafers bonded to teeth to transform color, shape and alignment with ultra-natural results." },
    { slug: "diseno-digital-sonrisa", name: "Digital Smile Design", description: "Digital simulation of your new smile before you begin. See the final result and approve every detail before the first procedure." },
    { slug: "coronas-porcelana", name: "Porcelain Crowns", description: "High-strength porcelain caps that restore damaged teeth, returning their appearance, function and resistance." },
    { slug: "restauraciones-esteticas", name: "Advanced Aesthetic Restorations", description: "State-of-the-art adhesive techniques to correct fractures, stains, diastemas and deformities with minimal invasion." },
    { slug: "blanqueamiento-dental", name: "Professional Teeth Whitening", description: "Clinical whitening protocol supervised by specialists for safe, uniform and lasting results." },
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

export default async function SmileMakeoverPage({ params: { locale } }: { params: { locale: string } }) {
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
