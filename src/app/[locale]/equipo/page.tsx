import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { teamMembersQuery, type TeamMemberListItem } from '@/sanity/lib/queries'
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
  const members = await client.fetch<TeamMemberListItem[]>(
    teamMembersQuery,
    {},
    { next: { revalidate } }
  )

  return <TeamListTemplate members={members ?? []} locale={locale} />
}
