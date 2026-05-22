import type { Metadata } from "next";
import { ServiceCategoryTemplate } from "@/components/templates/ServiceCategoryTemplate";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  return {
    title: isEn
      ? "Allura Full Mouth Reconstruction™ — Allura Healthcare"
      : "Allura Full Mouth Reconstruction™ — Allura Healthcare",
    description: isEn
      ? "Comprehensive solution to restore function, stability and a confident smile. Implants, oral rehabilitation and more in Medellín."
      : "Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura. Implantes, rehabilitación oral y más en Medellín.",
  };
}

const contentEs = {
  title: "Allura Full Mouth Reconstruction™",
  eyebrow: "Odontología Integral",
  subtitle: "Solución integral para recuperar función, estabilidad y una sonrisa que vuelva a sentirse segura.",
  description: "Para pacientes que han perdido piezas, presentan deterioro severo o necesitan una rehabilitación completa, diseñamos un plan integral respaldado por tecnología 3D de última generación y un equipo de especialistas altamente certificados. Cada caso es único y cada plan es hecho a medida.",
  subServices: [
    { slug: "implantes-unitarios", name: "Implantes Unitarios y Múltiples", description: "Reemplazo de una o varias piezas dentales con implantes de titanio de alta precisión, integrados para durar toda la vida." },
    { slug: "implantes-all-on-x", name: "Implantes All-on-X", description: "Solución completa para pacientes con pérdida total o casi total de piezas: una arcada completa fija sobre 4 o 6 implantes estratégicamente ubicados." },
    { slug: "rehabilitacion-oral-completa", name: "Rehabilitación Oral Completa", description: "Tratamiento integral que restaura función masticatoria, estética y salud periodontal para casos de deterioro severo o múltiple." },
    { slug: "protesis-fijas", name: "Prótesis Fijas sobre Implantes", description: "Coronas y puentes de porcelana fijados permanentemente sobre implantes. Aspecto natural, resistencia total y funcionalidad completa." },
    { slug: "reemplazo-restauraciones", name: "Reemplazo de Restauraciones Fallidas", description: "Evaluación y sustitución de restauraciones antiguas, fracturadas o con infiltración. Volvemos a empezar sobre una base sana." },
    { slug: "planificacion-digital-3d", name: "Planificación Digital 3D", description: "Simulación completa de tu caso con tecnología CAD/CAM y escáner intraoral 3D antes de comenzar cualquier procedimiento." },
  ],
};

const contentEn = {
  title: "Allura Full Mouth Reconstruction™",
  eyebrow: "Comprehensive Dentistry",
  subtitle: "Comprehensive solution to restore function, stability and a smile that feels secure again.",
  description: "For patients who have lost teeth, have severe deterioration, or need complete rehabilitation, we design a comprehensive plan backed by cutting-edge 3D technology and a team of highly certified specialists. Each case is unique and every plan is made to measure.",
  subServices: [
    { slug: "implantes-unitarios", name: "Single and Multiple Implants", description: "Replacement of one or several teeth with high-precision titanium implants, integrated to last a lifetime." },
    { slug: "implantes-all-on-x", name: "All-on-X Implants", description: "Complete solution for patients with total or near-total tooth loss: a complete fixed arch on 4 or 6 strategically placed implants." },
    { slug: "rehabilitacion-oral-completa", name: "Full Oral Rehabilitation", description: "Comprehensive treatment that restores masticatory function, aesthetics and periodontal health for cases of severe or multiple deterioration." },
    { slug: "protesis-fijas", name: "Fixed Prostheses on Implants", description: "Porcelain crowns and bridges permanently fixed on implants. Natural appearance, total resistance and complete functionality." },
    { slug: "reemplazo-restauraciones", name: "Replacement of Failed Restorations", description: "Evaluation and replacement of old, fractured or infiltrated restorations. Starting over on a healthy foundation." },
    { slug: "planificacion-digital-3d", name: "3D Digital Planning", description: "Complete simulation of your case with CAD/CAM technology and 3D intraoral scanner before starting any procedure." },
  ],
};

export default function FullMouthReconstructionPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = locale === "en" ? contentEn : contentEs;
  return (
    <ServiceCategoryTemplate
      {...content}
      categorySlug="full-mouth-reconstruction"
      heroImage="/images/imagenes_web/Allura-Full-Mouth-Reconstruction.jpg"
    />
  );
}
