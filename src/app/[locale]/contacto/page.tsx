import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { getTranslations } from "next-intl/server";
import { getSiteSettings, buildWhatsAppUrl } from "@/lib/getSiteSettings";
import { getPageBySlug, getSectionsByPage } from "@/lib/supabase/pages";
import { renderSection } from "@/lib/render-section";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: "contacto" }),
    getSiteSettings(),
  ]);
  const ogImageUrl = settings?.seoImageUrl;
  const title = t("metaTitle");
  const description = t("metaDesc");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  };
}

export default async function ContactoPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/contacto')
  if (page) {
    const sections = await getSectionsByPage(page.id)
    const visible = sections.filter(s => s.is_visible)
    if (visible.length > 0) {
      return (
        <div className="pt-24">
          {visible.map(s => renderSection(s, locale))}
        </div>
      )
    }
  }

  // Fallback: hardcoded content
  const t = await getTranslations("contacto");
  const settings = await getSiteSettings();
  const contactEmail = settings?.contactEmail || "contact@allurahealthcare.com";
  const whatsappUrl = buildWhatsAppUrl(settings, locale as "es" | "en");

  return (
    <>
      <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
        <SectionHeading
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          centered
          light
        />
      </section>
      <ContactForm contactEmail={contactEmail} whatsappUrl={whatsappUrl} />
    </>
  );
}
