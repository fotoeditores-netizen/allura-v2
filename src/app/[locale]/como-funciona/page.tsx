import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import {
  testimonialsQuery,
  faqsQuery,
  videosQuery,
  type TestimonialItem,
  type FaqItem,
  type VideoItem,
} from '@/sanity/lib/queries'
import { ComoFuncionaTemplate } from '@/components/templates/ComoFuncionaTemplate'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'comoFunciona' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  }
}

export default async function ComoFuncionaPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const [testimonials, faqs, videos] = await Promise.all([
    client.fetch<TestimonialItem[]>(testimonialsQuery, {}, { next: { revalidate } }),
    client.fetch<FaqItem[]>(faqsQuery, {}, { next: { revalidate } }),
    client.fetch<VideoItem[]>(videosQuery, {}, { next: { revalidate } }),
  ])

  return (
    <ComoFuncionaTemplate
      testimonials={testimonials ?? []}
      faqs={faqs ?? []}
      videos={videos ?? []}
      locale={locale}
    />
  )
}
