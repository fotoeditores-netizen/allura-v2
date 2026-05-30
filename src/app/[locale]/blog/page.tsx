import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getBlogPosts } from "@/lib/supabase/blog";
import type { BlogPostListItem, BlogCategory } from "@/types/cms";
import { BlogListTemplate } from "@/components/templates/BlogListTemplate";
import { getSiteSettings } from "@/lib/getSiteSettings";

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
}: {
  params: { locale: string };
}) {
  const loc = locale as "es" | "en";
  const posts = await getBlogPosts();

  // Map Supabase BlogPost[] to BlogPostListItem[] (Sanity shape expected by template)
  const mappedPosts: BlogPostListItem[] = posts.map((post) => ({
    _id: post.id,
    title: post.title as { es: string; en: string },
    slug: { current: post.slug },
    excerpt: post.excerpt as { es: string; en: string },
    publishedAt: post.publishedAt ?? new Date().toISOString(),
    featuredImage: post.coverImageUrl
      ? {
          asset: { _id: post.id, url: post.coverImageUrl },
          alt: { es: post.coverImageAlt ?? "", en: post.coverImageAlt ?? "" },
        }
      : undefined,
    author: post.author ? { name: post.author } : undefined,
  }));

  const categories: BlogCategory[] = [];

  return (
    <BlogListTemplate
      posts={mappedPosts}
      categories={categories}
      locale={locale}
    />
  );
}
