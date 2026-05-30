import { getGalleryItems } from '@/lib/supabase/content'
import type { GalleryItemData } from '@/types/cms'
import { GalleryTemplate } from '@/components/templates/GalleryTemplate'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'galeria' }),
    getSiteSettings(),
  ])
  const ogImageUrl = settings?.seoImageUrl
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  }
}

export default async function GaleriaPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { categoria?: string }
}) {
  const activeCategory = searchParams.categoria ?? null
  const items = await getGalleryItems()

  // Filter by category if requested
  const filtered = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items

  // Map Supabase GalleryItem[] to GalleryItemData[] (Sanity shape expected by template)
  const mappedItems: GalleryItemData[] = filtered.map((item) => ({
    _id: item.id,
    title: item.alt as { es?: string; en?: string } | undefined,
    category: item.category,
    image: {
      asset: { _id: item.id, url: item.imageUrl },
      alt: item.alt as { es?: string; en?: string },
    },
  }))

  return (
    <GalleryTemplate
      items={mappedItems}
      locale={locale}
      activeCategory={activeCategory ?? undefined}
    />
  )
}
