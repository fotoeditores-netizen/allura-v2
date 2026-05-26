import Image from 'next/image'
import { Link } from '@/navigation'
import { CTABanner } from '@/components/sections/CTABanner'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { ChevronLeft, Linkedin } from 'lucide-react'
import type { TeamMemberDetail } from '@/sanity/lib/queries'

interface TeamMemberTemplateProps {
  member: TeamMemberDetail
  locale: string
}

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-heading text-2xl md:text-3xl text-brand-navy mt-10 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-heading text-xl text-brand-navy mt-8 mb-3 leading-tight">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-base text-brand-silver leading-relaxed mb-5">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-brand-blue pl-5 my-6 italic font-body text-brand-silver">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-brand-navy">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-blue underline hover:text-brand-navy transition-colors"
      >
        {children}
      </a>
    ),
  },
}

export function TeamMemberTemplate({ member, locale }: TeamMemberTemplateProps) {
  const loc = locale as 'es' | 'en'
  const role = member.role?.[loc] || member.role?.es || ''
  const shortBio = member.shortBio?.[loc] || member.shortBio?.es || ''
  const fullBioBlocks: PortableTextBlock[] = (member.fullBio?.[loc] ?? []) as PortableTextBlock[]
  const photoUrl = member.photo?.asset?.url
  const photoAlt = member.photo?.alt || member.name

  return (
    <>
      {/* Hero with photo */}
      <section className="relative pt-40 pb-24 overflow-hidden min-h-[420px]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={photoAlt}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/50 to-brand-navy/85" />

        <div className="relative z-10 container-allura px-6 md:px-12">
          <Link
            href="/equipo"
            className="inline-flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft size={16} />
            {loc === 'en' ? 'Back to Team' : 'Volver al Equipo'}
          </Link>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3">
            {member.name}
          </h1>
          <p className="font-body text-base text-brand-blue tracking-wide">
            {role}
          </p>
        </div>
      </section>

      {/* Profile content */}
      <section className="section-padding bg-white">
        <div className="container-allura">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {member.credentials && member.credentials.length > 0 && (
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">
                    {loc === 'en' ? 'Education' : 'Formación'}
                  </p>
                  <ul className="space-y-2">
                    {member.credentials.map((cred) => (
                      <li key={cred} className="font-body text-sm text-brand-silver leading-snug flex gap-2">
                        <span className="text-brand-blue flex-shrink-0 mt-0.5">—</span>
                        <span>{cred}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.specialties && member.specialties.length > 0 && (
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-4">
                    {loc === 'en' ? 'Focus Areas' : 'Enfoque'}
                  </p>
                  <ul className="space-y-2">
                    {member.specialties.map((s) => (
                      <li key={s.es} className="font-body text-sm text-brand-silver leading-snug flex gap-2">
                        <span className="text-brand-blue flex-shrink-0 mt-0.5">—</span>
                        <span>{s[loc] || s.es}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm text-brand-navy hover:text-brand-blue transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              )}
            </aside>

            {/* Main content */}
            <div className="lg:col-span-2">
              {shortBio && (
                <p className="font-body text-lg text-brand-silver leading-relaxed mb-8 pb-8 border-b border-brand-light">
                  {shortBio}
                </p>
              )}

              {fullBioBlocks.length > 0 ? (
                <PortableText
                  value={fullBioBlocks}
                  components={portableTextComponents}
                />
              ) : !shortBio ? (
                <p className="font-body text-brand-silver italic">
                  {loc === 'en' ? 'Profile coming soon.' : 'Perfil próximamente.'}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
