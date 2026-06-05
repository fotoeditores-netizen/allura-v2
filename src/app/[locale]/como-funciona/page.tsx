import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getTestimonials, getFaqs, getVideos } from '@/lib/supabase/content'
import type { TestimonialItem, FaqItem, VideoItem } from '@/types/cms'
import { ComoFuncionaTemplate } from '@/components/templates/ComoFuncionaTemplate'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getPageBySlug, getSectionsByPage } from '@/lib/supabase/pages'
import { renderSection } from '@/lib/render-section'

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
  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/como-funciona')
  if (page) {
    const sections = await getSectionsByPage(page.id)
    const visible = sections.filter(s => s.is_visible)
    if (visible.length > 0) {
      return (
        <div className="pt-24">
          {visible.map(s => renderSection(s, locale))}
        </div>
      )
    }
  }

  // Fallback: original template with dynamic data
  const [testimonials, faqs, videos] = await Promise.all([
    getTestimonials(),
    getFaqs(),
    getVideos(),
  ])

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

  const mappedFaqs: FaqItem[] = faqs.map((f) => ({
    _id: f.id,
    question: f.question as { es: string; en: string },
    answer: {
      es: [{ _type: 'block', _key: `faq-es-${f.id}`, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: `span-es-${f.id}`, text: (f.answer as { es: string; en: string })?.es || '', marks: [] }] }],
      en: [{ _type: 'block', _key: `faq-en-${f.id}`, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: `span-en-${f.id}`, text: (f.answer as { es: string; en: string })?.en || '', marks: [] }] }],
    },
  }))

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
