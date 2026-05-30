import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/supabase/blog";
import { BlogPostTemplate } from "@/components/templates/BlogPostTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  const loc = locale as "es" | "en";
  const title = (post.title as { es: string; en: string })?.[loc] || (post.title as { es: string; en: string })?.es;
  const excerpt = (post.excerpt as { es: string; en: string })?.[loc] || (post.excerpt as { es: string; en: string })?.es;
  const seoTitle = (post.seoTitle as { es: string; en: string })?.[loc];
  const seoDesc = (post.seoDescription as { es: string; en: string })?.[loc];

  return {
    title: seoTitle || title || "Blog — Allura Healthcare",
    description: seoDesc || excerpt,
  };
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const mappedPost = {
    _id: post.id,
    title: post.title as { es: string; en: string },
    slug: { current: post.slug },
    excerpt: post.excerpt as { es: string; en: string },
    body: post.body as { es: string; en: string },
    publishedAt: post.publishedAt ?? new Date().toISOString(),
    featuredImage: post.coverImageUrl
      ? {
          asset: { _id: post.id, url: post.coverImageUrl },
          alt: { es: post.coverImageAlt ?? "", en: post.coverImageAlt ?? "" },
        }
      : undefined,
    author: post.author ? { name: post.author } : undefined,
  };

  return <BlogPostTemplate post={mappedPost as any} locale={locale} />;
}
