import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/supabase/blog";
import type { BlogPostDetail } from "@/types/cms";
import { BlogPostTemplate } from "@/components/templates/BlogPostTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export async function generateStaticParams() {
  // Return empty array — pages are rendered dynamically on first request
  return [];
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  const loc = locale as "es" | "en";
  const titleField = post.title as { es: string; en: string };
  const excerptField = post.excerpt as { es: string; en: string };
  const seoTitleField = post.seoTitle as { es: string; en: string };
  const seoDescField = post.seoDescription as { es: string; en: string };

  return {
    title: seoTitleField?.[loc] || titleField?.[loc] || titleField?.es || "Blog — Allura Healthcare",
    description: seoDescField?.[loc] || excerptField?.[loc] || excerptField?.es,
  };
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const loc = locale as "es" | "en";
  const bodyText = (post.body as { es: string; en: string })?.[loc] || (post.body as { es: string; en: string })?.es || "";

  // Map Supabase BlogPost to BlogPostDetail shape expected by template
  const mappedPost: BlogPostDetail = {
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
    body: bodyText
      ? {
          es: [{ _type: "block", _key: "body-es", style: "normal", markDefs: [], children: [{ _type: "span", _key: "span-es", text: (post.body as { es: string; en: string })?.es || "", marks: [] }] }],
          en: [{ _type: "block", _key: "body-en", style: "normal", markDefs: [], children: [{ _type: "span", _key: "span-en", text: (post.body as { es: string; en: string })?.en || "", marks: [] }] }],
        }
      : undefined,
    author: post.author ? { name: post.author } : undefined,
  };

  return <BlogPostTemplate post={mappedPost} locale={locale} />;
}
