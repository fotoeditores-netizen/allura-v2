import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  blogPostBySlugQuery,
  blogPostSlugsQuery,
  type BlogPostDetail,
} from "@/sanity/lib/queries";
import { BlogPostTemplate } from "@/components/templates/BlogPostTemplate";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    blogPostSlugsQuery,
    {},
    { next: { revalidate } }
  );
  return (slugs ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await client.fetch<BlogPostDetail | null>(
    blogPostBySlugQuery,
    { slug },
    { next: { revalidate } }
  );

  if (!post) {
    return { title: "Not Found" };
  }

  const loc = locale as "es" | "en";
  return {
    title:
      post.seo?.metaTitle?.[loc] ??
      post.title?.[loc] ??
      post.title?.es ??
      "Blog — Allura Healthcare",
    description:
      post.seo?.metaDescription?.[loc] ??
      post.excerpt?.[loc] ??
      post.excerpt?.es,
    robots: post.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const post = await client.fetch<BlogPostDetail | null>(
    blogPostBySlugQuery,
    { slug },
    { next: { revalidate } }
  );

  if (!post) {
    notFound();
  }

  return <BlogPostTemplate post={post} locale={locale} />;
}
