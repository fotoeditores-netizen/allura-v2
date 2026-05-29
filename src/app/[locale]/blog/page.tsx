import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import {
  blogCategoriesQuery,
  blogPostListQuery,
  type BlogCategory,
  type BlogPostListItem,
} from "@/sanity/lib/queries";
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
  searchParams,
}: {
  params: { locale: string };
  searchParams: { categoria?: string };
}) {
  const categorySlug = searchParams.categoria ?? null;

  const [categories, posts] = await Promise.all([
    client.fetch<BlogCategory[]>(blogCategoriesQuery, {}, { next: { revalidate } }),
    client.fetch<BlogPostListItem[]>(
      blogPostListQuery,
      { categorySlug },
      { next: { revalidate } }
    ),
  ]);

  return (
    <BlogListTemplate
      posts={posts ?? []}
      categories={categories ?? []}
      activeCategorySlug={categorySlug ?? undefined}
      locale={locale}
    />
  );
}
