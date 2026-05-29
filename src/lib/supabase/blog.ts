import { createClient } from './client'
import type { BlogPost } from './types'

const SITE_ID = '00000000-0000-0000-0000-000000000001'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title_i18n ?? {},
    slug: row.slug,
    excerpt: row.excerpt_i18n ?? {},
    body: row.body_i18n ?? {},
    coverImageUrl: row.cover_image_url ?? undefined,
    coverImageAlt: row.cover_image_alt ?? undefined,
    author: row.author ?? undefined,
    status: row.status,
    publishedAt: row.published_at ?? undefined,
    seoTitle: row.seo_title_i18n ?? {},
    seoDescription: row.seo_description_i18n ?? {},
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  return (data ?? []).map(mapPost)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data ? mapPost(data) : null
}
