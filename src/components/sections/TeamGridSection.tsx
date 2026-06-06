'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/navigation'

import { normalizeMember, type TeamMember, type RawTeamMember } from '@/lib/team-member'

type I18n = { es?: string; en?: string }

interface TeamGridSettings {
  eyebrow?: I18n
  title?: I18n
  subtitle?: I18n
  showHover?: boolean
  ctaLabel?: I18n
  ctaUrl?: string
  bg?: 'white' | 'light'
  members?: RawTeamMember[]
}

interface Props {
  locale?: string
  settings?: Record<string, unknown>
}

function MemberCard({
  member,
  showHover,
  bgLight,
  locale,
}: {
  member: TeamMember
  showHover: boolean
  bgLight: boolean
  locale: string
}) {
  const [active, setActive] = useState(false)
  const loc = locale as 'es' | 'en'

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      setActive(prev => !prev)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden shadow-sm border border-brand-navy/20 bg-white"
    >
      <div
        className="relative aspect-[3/4] overflow-hidden cursor-pointer select-none"
        onMouseEnter={() => showHover && setActive(true)}
        onMouseLeave={() => showHover && setActive(false)}
        onClick={handleClick}
      >
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-light flex items-center justify-center">
            <span className="text-5xl">👤</span>
          </div>
        )}

        {showHover && (
          <div
            aria-hidden={!active}
            className={[
              'absolute inset-0 bg-brand-navy/[0.93] p-5 overflow-y-auto flex flex-col gap-3',
              'transition-all duration-500 ease-in-out',
              active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
            ].join(' ')}
          >
            <button
              className="md:hidden self-end text-white/50 hover:text-white p-1 -mt-1 -mr-1 flex-shrink-0"
              onClick={e => { e.stopPropagation(); setActive(false) }}
              aria-label="Cerrar"
            >
              <X size={14} />
            </button>

            {member.hoverBlocks.map(block => (
              block.items.length > 0 && (
                <div key={block.id}>
                  <p className="font-body text-[9px] tracking-[0.18em] uppercase text-brand-blue mb-1.5">
                    {block.title[loc] || block.title.es}
                  </p>
                  <ul className="space-y-1">
                    {block.items.map(item => (
                      <li key={item} className="font-body text-[11px] text-white/85 leading-snug flex gap-1.5">
                        <span className="text-brand-blue flex-shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <div className={`p-6 ${bgLight ? 'bg-brand-light' : 'bg-white'}`}>
        {member.slug ? (
          <Link href={`/equipo/${member.slug}` as never}>
            <h3 className="font-heading text-lg text-brand-navy mb-1 hover:text-brand-blue transition-colors">
              {member.name}
            </h3>
          </Link>
        ) : (
          <h3 className="font-heading text-lg text-brand-navy mb-1">{member.name}</h3>
        )}
        <p className="font-body text-xs text-brand-blue tracking-wide leading-relaxed">
          {member.role?.[loc] || member.role?.es || ''}
        </p>
      </div>
    </motion.div>
  )
}

export function TeamGridSection({ locale = 'es', settings = {} }: Props) {
  const s = settings as TeamGridSettings
  const loc = locale as 'es' | 'en'
  const showHover = s.showHover !== false
  const members: TeamMember[] = (s.members ?? []).map(normalizeMember)
  const bg = s.bg === 'light' ? 'bg-brand-light' : 'bg-white'

  const ctaLabel = s.ctaLabel?.[loc] || s.ctaLabel?.es
  const ctaUrl = s.ctaUrl || '/equipo'

  return (
    <section className={`section-padding ${bg}`}>
      <div className="container-allura">
        {(s.eyebrow?.[loc] || s.title?.[loc]) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              eyebrow={s.eyebrow?.[loc] || s.eyebrow?.es || ''}
              title={s.title?.[loc] || s.title?.es || ''}
              subtitle={s.subtitle?.[loc] || s.subtitle?.es || ''}
              centered
            />
          </motion.div>
        )}

        {members.length === 0 ? (
          <p className="text-center font-body text-brand-silver py-12">
            {loc === 'en' ? 'No team members configured yet.' : 'Aún no hay integrantes configurados.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {members.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                showHover={showHover}
                bgLight={i % 2 !== 0}
                locale={locale}
              />
            ))}
          </div>
        )}

        {ctaLabel && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <Link
              href={ctaUrl as never}
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-navy text-white rounded-full font-body text-sm hover:bg-brand-blue transition-colors"
            >
              {ctaLabel}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
