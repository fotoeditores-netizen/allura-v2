import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const categories = t.raw("categories") as string[];
  const posts = t.raw("posts") as Array<{
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
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

      {/* Category filter */}
      <section className="bg-white border-b border-brand-light">
        <div className="container-allura px-6 md:px-12 py-5 flex flex-wrap gap-3">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-colors ${
                i === 0
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
            {posts.map(({ category, title, excerpt, date, readTime }, i) => (
              <article
                key={title}
                className={`group ${i % 2 === 0 ? 'bg-white' : 'bg-brand-light'} rounded-2xl overflow-hidden border border-brand-light hover:shadow-md hover:border-brand-blue/30 transition-all duration-200 cursor-pointer`}
              >
                <div className="aspect-video bg-brand-light flex items-center justify-center">
                  <p className="font-body text-xs text-brand-silver">{t("imagePlaceholder")}</p>
                </div>
                <div className="p-6">
                  <p className="font-body text-xs tracking-wide uppercase text-brand-blue mb-2">{category}</p>
                  <h3 className="font-heading text-lg text-brand-navy mb-3 leading-snug group-hover:text-brand-blue transition-colors">
                    {title}
                  </h3>
                  <p className="font-body text-sm text-brand-silver leading-relaxed mb-5">{excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-brand-silver">{date}</span>
                    <span className="font-body text-xs text-brand-silver">{readTime} {t("readTimeSuffix")}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="font-body text-sm text-brand-silver">
              {t("comingSoon")}
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
