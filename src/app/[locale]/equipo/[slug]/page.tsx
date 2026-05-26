import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import {
  teamMemberBySlugQuery,
  teamMemberSlugsQuery,
  type TeamMemberDetail,
} from '@/sanity/lib/queries'
import { TeamMemberTemplate } from '@/components/templates/TeamMemberTemplate'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    teamMemberSlugsQuery,
    {},
    { next: { revalidate } }
  )
  return (slugs ?? []).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const member = await client.fetch<TeamMemberDetail | null>(
    teamMemberBySlugQuery,
    { slug },
    { next: { revalidate } }
  )

  if (!member) return { title: 'Not Found' }

  const loc = locale as 'es' | 'en'
  return {
    title: `${member.name} — ${member.role?.[loc] || member.role?.es} | Allura Healthcare`,
    description: member.shortBio?.[loc] || member.shortBio?.es,
  }
}

export default async function TeamMemberPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  const member = await client.fetch<TeamMemberDetail | null>(
    teamMemberBySlugQuery,
    { slug },
    { next: { revalidate } }
  )

  if (!member) notFound()

  return <TeamMemberTemplate member={member} locale={locale} />
}
