import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getBlogPosts } from "@/lib/supabase/blog";
import type { BlogPostListItem, BlogCategory } from "@/types/cms";
import { BlogListTemplate } from "@/components/templates/BlogListTemplate";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { getPageBySlug, getSectionsByPage } from "@/lib/supabase/pages";
import { renderSection } from "@/lib/render-section";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
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

export default async function BlogPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { categoria?: string };
}) {
  const loc = locale as "es" | "en";
  const activeCategory = searchParams?.categoria ?? null;

  // Try to render header/footer sections from CMS, but keep blog list dynamic
  const cmsPage = await getPageBySlug('/blog')
  if (cmsPage) {
    const sections = await getSectionsByPage(cmsPage.id)
    const visible = sections.filter(s => s.is_visible)
    if (visible.length > 0) {
      const posts = await getBlogPosts()
      const mappedPosts: BlogPostListItem[] = posts.map((post) => ({
        _id: post.id,
        title: post.title as { es: string; en: string },
        slug: { current: post.slug },
        excerpt: post.excerpt as { es: string; en: string },
        publishedAt: post.publishedAt ?? new Date().toISOString(),
        featuredImage: post.coverImageUrl
          ? { asset: { _id: post.id, url: post.coverImageUrl }, alt: { es: post.coverImageAlt ?? "", en: post.coverImageAlt ?? "" } }
          : undefined,
        author: post.author ? { name: post.author } : undefined,
        categories: post.category
          ? [{ _id: post.category, title: { es: post.category, en: post.category }, slug: { current: post.category.toLowerCase().replace(/\s+/g, '-') } }]
          : undefined,
      }))

      const categorySet = new Map<string, BlogCategory>()
      posts.forEach(post => {
        if (post.category) {
          const slug = post.category.toLowerCase().replace(/\s+/g, '-')
          categorySet.set(slug, { _id: slug, title: { es: post.category, en: post.category }, slug: { current: slug } })
        }
      })
      const categories: BlogCategory[] = Array.from(categorySet.values())
      const filteredPosts = activeCategory
        ? mappedPosts.filter(p => p.categories?.some(c => c.slug.current === activeCategory))
        : mappedPosts

      // Render: CMS page_header section + blog list + CMS cta section
      const headerSection = visible.find(s => s.type === 'page_header')
      const ctaSection = visible.find(s => s.type === 'cta')

      return (
        <div className="pt-24">
          {headerSection && renderSection(headerSection, locale)}
          <BlogListTemplate
            posts={filteredPosts}
            categories={categories}
            activeCategorySlug={activeCategory ?? undefined}
            locale={locale}
            hideHero
          />
          {ctaSection && renderSection(ctaSection, locale)}
        </div>
      )
    }
  }

  // Fallback: original template
  const posts = await getBlogPosts()
  const mappedPosts: BlogPostListItem[] = posts.map((post) => ({
    _id: post.id,
    title: post.title as { es: string; en: string },
    slug: { current: post.slug },
    excerpt: post.excerpt as { es: string; en: string },
    publishedAt: post.publishedAt ?? new Date().toISOString(),
    featuredImage: post.coverImageUrl
      ? { asset: { _id: post.id, url: post.coverImageUrl }, alt: { es: post.coverImageAlt ?? "", en: post.coverImageAlt ?? "" } }
      : undefined,
    author: post.author ? { name: post.author } : undefined,
    categories: post.category
      ? [{ _id: post.category, title: { es: post.category, en: post.category }, slug: { current: post.category.toLowerCase().replace(/\s+/g, '-') } }]
      : undefined,
  }))

  const categorySet = new Map<string, BlogCategory>()
  posts.forEach(post => {
    if (post.category) {
      const slug = post.category.toLowerCase().replace(/\s+/g, '-')
      categorySet.set(slug, { _id: slug, title: { es: post.category, en: post.category }, slug: { current: slug } })
    }
  })
  const categories: BlogCategory[] = Array.from(categorySet.values())
  const filteredPosts = activeCategory
    ? mappedPosts.filter(p => p.categories?.some(c => c.slug.current === activeCategory))
    : mappedPosts

  return (
    <BlogListTemplate
      posts={filteredPosts}
      categories={categories}
      activeCategorySlug={activeCategory ?? undefined}
      locale={locale}
    />
  )
}
