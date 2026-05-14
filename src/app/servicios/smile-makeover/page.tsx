import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const metadata: Metadata = {
  title: "Allura Smile Makeover™ — Allura Healthcare",
  description: "Diseño personalizado de sonrisa en Medellín: carillas de porcelana, diseño digital y restauraciones estéticas avanzadas.",
};

const subServices = [
  {
    slug: "carillas-porcelana",
    name: "Carillas en Porcelana",
    description: "Láminas ultrafinas de porcelana adheridas a los dientes para transformar color, forma y alineación con resultados ultranatural.",
  },
  {
    slug: "diseno-digital-sonrisa",
    name: "Diseño Digital de Sonrisa",
    description: "Simulación digital de tu nueva sonrisa antes de comenzar. Ves el resultado final y apruebas cada detalle antes del primer procedimiento.",
  },
  {
    slug: "coronas-porcelana",
    name: "Coronas en Porcelana",
    description: "Fundas de porcelana de alta resistencia que restauran dientes dañados devolviéndoles apariencia, función y resistencia totales.",
  },
  {
    slug: "restauraciones-esteticas",
    name: "Restauraciones Estéticas Avanzadas",
    description: "Técnicas adhesivas de última generación para corregir fracturas, manchas, diastemas y deformidades con mínima invasión.",
  },
  {
    slug: "blanqueamiento-dental",
    name: "Blanqueamiento Dental Profesional",
    description: "Protocolo clínico de blanqueamiento supervisado por especialistas para resultados seguros, uniformes y duraderos.",
  },
];

export default function SmileMakeoverPage() {
  return (
    <ServiceCategoryTemplate
      title="Allura Smile Makeover™"
      eyebrow="Estética Dental"
      subtitle="Tu sonrisa, rediseñada con precisión artística. Cada detalle, pensado para ti."
      description="Combinamos diseño digital, carillas en porcelana y tecnología de vanguardia para que cada sonrisa sea única, natural y proyecte exactamente lo que quieres transmitir. Nuestros especialistas en estética dental trabajan con criterio artístico y rigor clínico en cada caso."
      categorySlug="smile-makeover"
      heroImage="/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg"
      subServices={subServices}
    />
  );
}
