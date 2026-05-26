import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { teamMembersQuery, type TeamMemberListItem } from '@/sanity/lib/queries'
import { TeamListTemplate } from '@/components/templates/TeamListTemplate'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'equipo' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
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
