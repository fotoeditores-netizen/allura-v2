import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";

const WHATSAPP_URL =
  "https://wa.me/573001234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

interface Step {
  title: string;
  description: string;
}

interface ServiceDetailTemplateProps {
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  benefits: string[];
  steps: Step[];
  candidates: string[];
  timeline: string;
  specialty: "odontologia" | "facial";
}

export function ServiceDetailTemplate({
  category,
  categorySlug,
  title,
  description,
  benefits,
  steps,
  candidates,
  timeline,
}: ServiceDetailTemplateProps) {
  return (
    <>
      {/* Hero with breadcrumb */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12">
        <div className="container-allura">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-body text-xs text-white/50 mb-8">
            <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
            <ChevronRight size={12} />
            <Link href={`/servicios/${categorySlug}`} className="hover:text-white transition-colors">{category}</Link>
            <ChevronRight size={12} />
            <span className="text-white/70">{title}</span>
          </nav>

          <div className="max-w-2xl">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">{category}</p>
            <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">{title}</h1>
            <p className="font-body text-base text-white/70 leading-relaxed mb-10">{description}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <SectionHeading eyebrow="Beneficios" title="¿Qué lograrás con este tratamiento?" />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                <p className="font-body text-sm text-brand-navy leading-relaxed">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          <SectionHeading eyebrow="Proceso" title="Paso a paso del tratamiento" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {steps.map(({ title: stepTitle, description: stepDesc }, i) => (
              <div key={stepTitle} className="bg-white rounded-2xl p-7 shadow-sm border border-brand-light">
                <p className="font-heading text-3xl text-brand-blue/25 mb-3">0{i + 1}</p>
                <h3 className="font-heading text-lg text-brand-navy mb-2">{stepTitle}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{stepDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidates + Timeline */}
      <section className="section-padding bg-white">
        <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-14">
          <div>
            <SectionHeading eyebrow="Candidatos" title="¿Para quién es este tratamiento?" />
            <ul className="mt-8 space-y-3">
              {candidates.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                  <p className="font-body text-sm text-brand-navy">{c}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Duración estimada" title="¿Cuánto tiempo toma?" />
            <div className="mt-8 bg-brand-light rounded-2xl p-7">
              <p className="font-body text-base text-brand-navy leading-relaxed">{timeline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Allura */}
      <section className="section-padding bg-brand-navy">
        <div className="container-allura text-center max-w-2xl mx-auto">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">Por qué Allura</p>
          <h2 className="font-heading text-3xl text-white mb-6">
            Excelencia, tecnología y acompañamiento total
          </h2>
          <p className="font-body text-brand-silver leading-relaxed mb-10">
            En Allura combinamos especialistas certificados internacionalmente, tecnología de diagnóstico 3D y un modelo de atención diseñado especialmente para pacientes que viajan desde el exterior. Tu bienestar comienza antes de llegar y continúa mucho después de regresar.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
