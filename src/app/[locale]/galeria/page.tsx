import { client } from '@/sanity/lib/client'
import { galleryItemsQuery } from '@/sanity/lib/queries'
import type { GalleryItemData } from '@/sanity/lib/queries'
import { GalleryTemplate } from '@/components/templates/GalleryTemplate'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'galeria' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
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
