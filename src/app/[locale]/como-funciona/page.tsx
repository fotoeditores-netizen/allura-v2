import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getTestimonials, getFaqs, getVideos } from '@/lib/supabase/content'
import type { TestimonialItem, FaqItem, VideoItem } from '@/types/cms'
import { ComoFuncionaTemplate } from '@/components/templates/ComoFuncionaTemplate'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'comoFunciona' }),
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

function extractVideoInfo(url: string): { platform: 'youtube' | 'vimeo' | 'instagram'; videoId: string } {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return { platform: 'youtube', videoId: match?.[1] ?? url }
  }
  if (url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return { platform: 'vimeo', videoId: match?.[1] ?? url }
  }
  if (url.includes('instagram.com')) {
    const match = url.match(/\/p\/([^/]+)/)
    return { platform: 'instagram', videoId: match?.[1] ?? url }
  }
  return { platform: 'youtube', videoId: url }
}

export default async function ComoFuncionaPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const [testimonials, faqs, videos] = await Promise.all([
    getTestimonials(),
    getFaqs(),
    getVideos(),
  ])

  // Map Supabase Testimonial[] to TestimonialItem[]
  const mappedTestimonials: TestimonialItem[] = testimonials.map((t) => ({
    _id: t.id,
    patientName: t.authorName,
    patientOrigin: t.authorLocation
      ? { es: t.authorLocation, en: t.authorLocation }
      : undefined,
    quote: t.content as { es: string; en: string },
    rating: t.rating ?? 5,
    photo: t.photoUrl
      ? { asset: { url: t.photoUrl } }
      : undefined,
  }))

  // Map Supabase Faq[] to FaqItem[]
  const mappedFaqs: FaqItem[] = faqs.map((f) => ({
    _id: f.id,
    question: f.question as { es: string; en: string },
    answer: {
      es: [{ _type: 'block', _key: `faq-es-${f.id}`, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: `span-es-${f.id}`, text: (f.answer as { es: string; en: string })?.es || '', marks: [] }] }],
      en: [{ _type: 'block', _key: `faq-en-${f.id}`, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: `span-en-${f.id}`, text: (f.answer as { es: string; en: string })?.en || '', marks: [] }] }],
    },
  }))

  // Map Supabase Video[] to VideoItem[]
  const mappedVideos: VideoItem[] = videos.map((v) => {
    const { platform, videoId } = extractVideoInfo(v.url)
    return {
      _id: v.id,
      title: v.title as { es: string; en: string },
      platform,
      videoId,
      thumbnail: v.thumbnailUrl
        ? { asset: { url: v.thumbnailUrl } }
        : undefined,
    }
  })

  return (
    <ComoFuncionaTemplate
      testimonials={mappedTestimonials}
      faqs={mappedFaqs}
      videos={mappedVideos}
      locale={locale}
    />
  )
}
