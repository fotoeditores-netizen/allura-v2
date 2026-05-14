import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export const metadata: Metadata = {
  title: "Allura Aligners™ — Allura Healthcare",
  description: "Ortodoncia invisible de última generación en Medellín. Invisalign, alineadores transparentes y seguimiento remoto para pacientes internacionales.",
};

const subServices = [
  {
    slug: "invisalign",
    name: "Invisalign",
    description: "El sistema de alineadores más reconocido del mundo, disponible con nuestro especialista Diamond Top Doctor certificado por Invisalign.",
  },
  {
    slug: "alineadores-transparentes",
    name: "Alineadores Transparentes",
    description: "Alineadores de alta precisión fabricados a medida mediante escáner digital 3D, sin impresiones incómodas.",
  },
  {
    slug: "escaneo-digital-3d",
    name: "Escaneo Digital 3D",
    description: "Diagnóstico y planificación sin impresiones físicas. El escáner intraoral 3D captura tu boca con precisión milimétrica.",
  },
  {
    slug: "planificacion-personalizada",
    name: "Planificación Personalizada",
    description: "Simulación animada de tu tratamiento para que veas paso a paso cómo se moverán tus dientes antes de comenzar.",
  },
  {
    slug: "seguimiento-remoto",
    name: "Seguimiento Remoto Internacional",
    description: "Control de tu tratamiento desde tu país de origen mediante videollamadas y aplicación móvil con tu especialista Allura.",
  },
];

export default function AlignersPage() {
  return (
    <ServiceCategoryTemplate
      title="Allura Aligners™"
      eyebrow="Ortodoncia Invisible"
      subtitle="Ortodoncia sin brackets, con planificación digital y seguimiento remoto para pacientes internacionales."
      description="Usamos Invisalign y alineadores de última generación con planificación digital completa para lograr alineaciones precisas con total discreción. Nuestro protocolo de seguimiento remoto está diseñado específicamente para pacientes que regresan a su país durante el tratamiento."
      categorySlug="aligners"
      heroImage="/images/imagenes_web/Invisalign_Allurahealthcare_.jpg"
      subServices={subServices}
    />
  );
}
