import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getTeamMembers } from '@/lib/supabase/team'
import type { TeamMemberListItem } from '@/types/cms'
import { TeamListTemplate } from '@/components/templates/TeamListTemplate'
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
    getTranslations({ locale, namespace: 'equipo' }),
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

export default async function EquipoPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  // Try to render from Supabase CMS sections
  const page = await getPageBySlug('/equipo')
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

  // Fallback: original template with dynamic team data
  const members = await getTeamMembers()
  const mappedMembers: TeamMemberListItem[] = members.map((m) => ({
    _id: m.id,
    name: m.name,
    slug: { current: m.slug },
    role: m.role as { es: string; en: string },
  }))

  return <TeamListTemplate members={mappedMembers} locale={locale} />
}
