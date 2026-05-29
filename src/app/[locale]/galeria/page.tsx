import { client } from '@/sanity/lib/client'
import { galleryItemsQuery } from '@/sanity/lib/queries'
import type { GalleryItemData } from '@/sanity/lib/queries'
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

  const items = await client.fetch<GalleryItemData[]>(
    galleryItemsQuery,
    { category: activeCategory },
    { next: { revalidate } }
  )

  return (
    <GalleryTemplate
      items={items}
      locale={locale}
      activeCategory={activeCategory ?? undefined}
    />
  )
}
