import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Blog — Allura Healthcare",
  description: "Artículos y recursos sobre odontología premium, medicina facial estética y turismo médico en Medellín.",
};

const categories = [
  "Todos",
  "Odontología",
  "Medicina Facial",
  "Turismo Médico",
  "Consejos de Bienestar",
];

const placeholderPosts = [
  {
    category: "Odontología",
    title: "Implantes dentales: qué esperar antes, durante y después del procedimiento",
    excerpt: "Una guía completa para pacientes internacionales que consideran un tratamiento de implantología en Medellín.",
    date: "Mayo 2026",
    readTime: "5 min",
  },
  {
    category: "Medicina Facial",
    title: "Toxina botulínica: mitos y realidades desde la perspectiva médica",
    excerpt: "Resolvemos las dudas más frecuentes sobre el uso de toxina botulínica y cuándo es la opción adecuada.",
    date: "Abril 2026",
    readTime: "4 min",
  },
  {
    category: "Turismo Médico",
    title: "Por qué Medellín se convirtió en el destino favorito para el turismo dental",
    excerpt: "Calidad internacional, costos competitivos y una ciudad vibrante: las razones detrás del crecimiento del turismo médico en Colombia.",
    date: "Marzo 2026",
    readTime: "6 min",
  },
  {
    category: "Odontología",
    title: "Allura Aligners vs. Invisalign: guía para elegir el mejor alineador para ti",
    excerpt: "Comparamos las opciones de ortodoncia invisible más avanzadas y te ayudamos a entender cuál se adapta mejor a tu caso.",
    date: "Febrero 2026",
    readTime: "5 min",
  },
  {
    category: "Consejos de Bienestar",
    title: "Cómo preparar tu viaje médico a Medellín: lista de verificación completa",
    excerpt: "Documentos, cuidados pre-operatorios, alojamiento y actividades: todo lo que necesitas saber antes de volar.",
    date: "Enero 2026",
    readTime: "7 min",
  },
  {
    category: "Medicina Facial",
    title: "Diseño de sonrisa digital: así transformamos tu sonrisa antes del primer procedimiento",
    excerpt: "Tecnología de simulación facial que te permite ver tu resultado final antes de comenzar cualquier tratamiento.",
    date: "Diciembre 2025",
    readTime: "4 min",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow="Recursos"
          title="Blog Allura"
          subtitle="Información clara y confiable sobre odontología, medicina facial estética y turismo médico en Medellín."
          centered
          light
        />
      </section>

      {/* Category filter */}
      <section className="bg-white border-b border-brand-light">
        <div className="container-allura px-6 md:px-12 py-5 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-colors ${
                cat === "Todos"
                  ? "bg-brand-navy text-white"
                  : "bg-brand-light text-brand-navy hover:bg-brand-blue/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {placeholderPosts.map(({ category, title, excerpt, date, readTime }, i) => (
              <article
                key={title}
                className={`group ${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'} rounded-2xl overflow-hidden border border-brand-light hover:shadow-md hover:border-brand-blue/30 transition-all duration-200 cursor-pointer`}
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-brand-light flex items-center justify-center">
                  <p className="font-body text-xs text-brand-silver">Imagen próximamente</p>
                </div>
                <div className="p-6">
                  <p className="font-body text-xs tracking-wide uppercase text-brand-blue mb-2">{category}</p>
                  <h3 className="font-heading text-lg text-brand-navy mb-3 leading-snug group-hover:text-brand-blue transition-colors">
                    {title}
                  </h3>
                  <p className="font-body text-sm text-brand-silver leading-relaxed mb-5">{excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-brand-silver">{date}</span>
                    <span className="font-body text-xs text-brand-silver">{readTime} lectura</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="font-body text-sm text-brand-silver">
              Más artículos próximamente. Suscríbete para recibir novedades.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
