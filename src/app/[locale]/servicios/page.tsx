import type { Metadata } from "next";
import { Link } from "@/navigation";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";

const categoryImages = [
  "/images/imagenes_web/Allura-Full-Mouth-Reconstruction.jpg",
  "/images/imagenes_web/Cosmetic_dentistry_allurahealthcare.jpg",
  "/images/imagenes_web/Invisalign_Allurahealthcare_.jpg",
  "/images/imagenes_web/cirugia-estetica-facial-allurahealthcare.png",
];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "serviciosPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function ServiciosPage() {
  const t = await getTranslations("serviciosPage");
  const categories = t.raw("categories") as Array<{
    eyebrow: string;
    trademark: string;
    description: string;
    items: string[];
    href: string;
  }>;

  return (
    <>
      {/* Page hero */}
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          centered
          light
        />
      </section>

      {/* Services detail */}
      <section className="section-padding bg-white">
        <div className="container-allura space-y-28">
          {categories.map(({ eyebrow, trademark, description, items, href }, i) => (
            <div
              key={trademark}
              className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center"
            >
              <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-3">
                  {eyebrow}
                </p>
                <h2 className="font-heading text-3xl text-brand-navy mb-4">{trademark}</h2>
                <p className="font-body text-brand-silver leading-relaxed mb-6">{description}</p>
                <ul className="space-y-2 mb-8">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-body text-sm text-brand-navy">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 font-body text-sm font-bold text-brand-navy hover:text-brand-blue transition-colors"
                >
                  {t("exploreLabel")} <ArrowRight size={16} />
                </Link>
              </div>
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{ backgroundImage: `url('${categoryImages[i]}')` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
