import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getTeamMembers } from '@/lib/supabase/team'
import type { TeamMemberListItem } from '@/types/cms'
import { TeamListTemplate } from '@/components/templates/TeamListTemplate'
import { getSiteSettings } from '@/lib/getSiteSettings'

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
  const members = await getTeamMembers()

  // Map Supabase TeamMember[] to TeamMemberListItem[] (Sanity shape expected by template)
  // photo intentionally omitted — TeamListTemplate uses its local teamImages[] array as fallback
  const mappedMembers: TeamMemberListItem[] = members.map((m) => ({
    _id: m.id,
    name: m.name,
    slug: { current: m.slug },
    role: m.role as { es: string; en: string },
  }))

  return <TeamListTemplate members={mappedMembers} locale={locale} />
}
