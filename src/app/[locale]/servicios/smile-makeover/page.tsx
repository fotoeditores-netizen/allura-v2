import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  return {
    title: "Allura Smile Makeover™ — Allura Healthcare",
    description: isEn
      ? "Personalized smile design in Medellín: porcelain veneers, digital design and advanced aesthetic restorations."
      : "Diseño personalizado de sonrisa en Medellín: carillas de porcelana, diseño digital y restauraciones estéticas avanzadas.",
  };
}

const contentEs = {
  title: "Allura Smile Makeover™",
  eyebrow: "Estética Dental",
  subtitle: "Tu sonrisa, rediseñada con precisión artística. Cada detalle, pensado para ti.",
  description: "Combinamos diseño digital, carillas en porcelana y tecnología de vanguardia para que cada sonrisa sea única, natural y proyecte exactamente lo que quieres transmitir. Nuestros especialistas en estética dental trabajan con criterio artístico y rigor clínico en cada caso.",
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
  subServices: [
    { slug: "carillas-porcelana", name: "Porcelain Veneers", description: "Ultra-thin porcelain wafers bonded to teeth to transform color, shape and alignment with ultra-natural results." },
    { slug: "diseno-digital-sonrisa", name: "Digital Smile Design", description: "Digital simulation of your new smile before you begin. See the final result and approve every detail before the first procedure." },
    { slug: "coronas-porcelana", name: "Porcelain Crowns", description: "High-strength porcelain caps that restore damaged teeth, returning their appearance, function and resistance." },
    { slug: "restauraciones-esteticas", name: "Advanced Aesthetic Restorations", description: "State-of-the-art adhesive techniques to correct fractures, stains, diastemas and deformities with minimal invasion." },
    { slug: "blanqueamiento-dental", name: "Professional Teeth Whitening", description: "Clinical whitening protocol supervised by specialists for safe, uniform and lasting results." },
  ],
};

export default function SmileMakeoverPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug="smile-makeover"
      heroImage="/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg"
    />
  );
}
