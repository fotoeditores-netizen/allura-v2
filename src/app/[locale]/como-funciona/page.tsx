import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { Button } from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

const WHATSAPP_URL =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

const stepImages = [
  "/images/imagenes_web/allura-healthcare-contacto-inicial-turismo-en-salud-premium.png",
  "/images/imagenes_web/allura-healthcare-consulta-virtual-especialista-turismo-en-salud.jpg",
  "/images/imagenes_web/allura-healthcare-reserva-organizacion-viaje-turismo-en-salud.jpg",
  "/images/imagenes_web/allura-healthcare-tratamiento-acompanamiento-in-situ-turismo-en-salud.png",
];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "comoFunciona" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function ComoFuncionaPage() {
  const t = await getTranslations("comoFunciona");
  const steps = t.raw("steps") as Array<{ number: string; title: string; description: string }>;
  const faqs = t.raw("faqs") as Array<{ q: string; a: string }>;

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          centered
          light
        />
      </section>

      {/* Steps */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="space-y-16">
            {steps.map(({ number, title, description }, i) => (
              <div
                key={number}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                  <p className="font-heading text-6xl text-brand-blue/20 mb-4">{number}</p>
                  <h2 className="font-heading text-3xl text-brand-navy mb-4">{title}</h2>
                  <p className="font-body text-brand-silver leading-relaxed">{description}</p>
                </div>
                <div className={`relative aspect-video rounded-2xl overflow-hidden ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${stepImages[i]}')` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura max-w-3xl">
          <SectionHeading
            eyebrow={t("faqLabel")}
            title={t("faqTitle")}
            centered
          />
          <div className="mt-12 space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-7 shadow-sm border border-brand-light">
                <h3 className="font-heading text-lg text-brand-navy mb-3">{q}</h3>
                <p className="font-body text-sm text-brand-silver leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section-padding bg-white">
        <div className="container-allura text-center max-w-xl mx-auto">
          <SectionHeading
            eyebrow={t("ctaEyebrow")}
            title={t("ctaTitle")}
            subtitle={t("ctaSubtitle")}
            centered
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              {t("ctaWhatsapp")}
            </a>
            <Button href="/contacto" variant="primary">
              {t("ctaContact")}
            </Button>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
