import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { TeamCard } from "@/components/sections/TeamCard";
import { getTranslations } from "next-intl/server";

const teamImages = [
  "/images/equipo/Dra-Johanna-Jaramillo-Allura.avif",
  "/images/equipo/Dra-Daniela-Alzate-Allura.avif",
  "/images/equipo/Dr-Sebastian-Munoz-Allura.avif",
  "/images/equipo/Dr-Santiago-Henao-Allura.avif",
  "/images/equipo/Dr-Ivan-Jimenez-Allura.avif",
  "/images/equipo/Dr-Alejandro-Cifuentes-Allura.avif",
];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "equipo" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function EquipoPage() {
  const t = await getTranslations("equipo");
  const members = t.raw("members") as Array<{
    name: string;
    specialty: string;
    formacion: string[];
    reconocimiento?: string[];
    enfoque: string[];
  }>;

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

      {/* Team grid */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, i) => (
              <TeamCard
                key={member.name}
                {...member}
                image={teamImages[i]}
                bgLight={i % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-brand-light">
        <div className="container-allura max-w-2xl text-center mx-auto">
          <SectionHeading
            eyebrow={t("certificationsLabel")}
            title={t("certificationsTitle")}
            subtitle={t("certificationsSubtitle")}
            centered
          />
        </div>
      </section>

      <CTABanner />
    </>
  );
}
