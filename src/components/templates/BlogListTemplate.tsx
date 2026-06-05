import Image from "next/image";
import { Link } from "@/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";
import { getTranslations } from "next-intl/server";
import type { BlogPostListItem, BlogCategory } from "@/types/cms";

interface BlogListTemplateProps {
  posts: BlogPostListItem[];
  categories: BlogCategory[];
  activeCategorySlug?: string;
  locale: string;
  hideHero?: boolean;
}

function formatDate(isoString: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export async function BlogListTemplate({
  posts,
  categories,
  activeCategorySlug,
  locale,
  hideHero = false,
}: BlogListTemplateProps) {
  const t = await getTranslations("blog");
  const loc = locale as "es" | "en";

  return (
    <>
      {!hideHero && (
        <section className="bg-brand-navy pt-40 pb-20 px-6 md:px-12 text-center">
          <SectionHeading
            eyebrow={t("heroEyebrow")}
            title={t("heroTitle")}
            subtitle={t("heroSubtitle")}
            centered
            light
          />
        </section>
      )}

      {/* Category filter */}
      <section className="bg-white border-b border-brand-light">
        <div className="container-allura px-6 md:px-12 py-5 flex flex-wrap gap-3">
          {/* "All" pill */}
          <Link
            href="/blog"
            className={`px-4 py-1.5 rounded-full font-body text-sm transition-colors ${
              !activeCategorySlug
                ? "bg-brand-navy text-white"
                : "bg-brand-light text-brand-navy hover:bg-brand-blue/20"
            }`}
          >
            {loc === "en" ? "All" : "Todos"}
          </Link>
          {/* Category pills */}
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={{ pathname: "/blog", query: { categoria: cat.slug.current } }}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-colors ${
                activeCategorySlug === cat.slug.current
                  ? "bg-brand-navy text-white"
                  : "bg-brand-light text-brand-navy hover:bg-brand-blue/20"
              }`}
            >
              {cat.title?.[loc] || cat.title?.es}
            </Link>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          {posts.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <p className="font-heading text-2xl text-brand-navy mb-4">
                {loc === "en" ? "No articles found" : "No hay artículos"}
              </p>
              <p className="font-body text-brand-silver mb-8">{t("comingSoon")}</p>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 px-7 py-3 bg-brand-navy text-white rounded-full font-body text-sm hover:bg-brand-blue transition-colors"
              >
                {loc === "en" ? "Explore our services" : "Explorar servicios"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map(({ _id, slug, title, excerpt, publishedAt, featuredImage, categories: postCats, author }, i) => (
                <article
                  key={_id}
                  className="group bg-white rounded-2xl overflow-hidden border border-brand-light hover:shadow-md hover:border-brand-blue/30 transition-all duration-200"
                >
                  {/* Featured image — wrapped in Link */}
                  <Link
                    href={`/blog/${slug.current}`}
                    className="block aspect-video relative bg-brand-light overflow-hidden"
                  >
                    {featuredImage?.asset?.url ? (
                      <Image
                        src={featuredImage.asset.url}
                        alt={featuredImage.alt?.[loc] || featuredImage.alt?.es || title?.[loc] || ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="font-body text-xs text-brand-silver">{t("imagePlaceholder")}</p>
                      </div>
                    )}
                  </Link>

                  <div className="p-6">
                    {/* Category badge */}
                    {postCats && postCats.length > 0 && (
                      <p
                        className="font-body text-xs tracking-wide uppercase mb-2"
                        style={{ color: postCats[0].color || "#8b9fb3" }}
                      >
                        {postCats[0].title?.[loc] || postCats[0].title?.es}
                      </p>
                    )}

                    {/* Title - wrapped in Link */}
                    <h3 className="font-heading text-lg text-brand-navy mb-3 leading-snug group-hover:text-brand-blue transition-colors">
                      <Link
                        href={`/blog/${slug.current}`}
                        className="hover:text-brand-blue transition-colors"
                      >
                        {title?.[loc] || title?.es}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="font-body text-sm text-brand-silver leading-relaxed mb-5">
                      {excerpt?.[loc] || excerpt?.es}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs text-brand-silver">
                        {publishedAt ? formatDate(publishedAt, locale) : ""}
                      </span>
                      {author && (
                        <span className="font-body text-xs text-brand-silver">
                          {author.name}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
