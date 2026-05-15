import { Link } from "@/navigation";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";

const WHATSAPP_URL =
  "https://wa.me/573001234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

export interface SubService {
  slug: string;
  name: string;
  description: string;
}

interface ServiceCategoryTemplateProps {
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  categorySlug: string;
  heroImage: string;
  subServices: SubService[];
}

export function ServiceCategoryTemplate({
  title,
  eyebrow,
  subtitle,
  description,
  categorySlug,
  heroImage,
  subServices,
}: ServiceCategoryTemplateProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/60 to-brand-navy/85" />
        <div className="relative z-10 container-allura px-6 md:px-12 text-center">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-blue mb-4">{eyebrow}</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 max-w-3xl mx-auto">
            {title}
          </h1>
          <p className="font-body text-base md:text-lg text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
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

      {/* Description */}
      <section className="section-padding bg-white">
        <div className="container-allura max-w-3xl">
          <p className="font-body text-lg text-brand-silver leading-relaxed">{description}</p>
        </div>
      </section>

      {/* Sub-services grid */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura">
          <SectionHeading
            eyebrow="Tratamientos"
            title="Nuestras soluciones especializadas"
            subtitle="Cada tratamiento es diseñado según tu caso particular."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {subServices.map(({ slug, name, description: desc }, i) => (
              <Link
                key={slug}
                href={`/servicios/${categorySlug}/${slug}`}
                className={`group flex flex-col ${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'} rounded-2xl p-7 shadow-sm border border-brand-navy/20 hover:shadow-md hover:border-brand-blue/40 transition-all duration-200`}
              >
                <h3 className="font-heading text-xl text-brand-navy mb-3 group-hover:text-brand-blue transition-colors">
                  {name}
                </h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed flex-1 mb-5">{desc}</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 font-body text-sm text-[#eaeeef] bg-brand-navy px-6 py-[10px] rounded transition-all duration-300 ease-out group-hover:bg-brand-blue group-hover:text-white">
                    Quiero saber más <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
