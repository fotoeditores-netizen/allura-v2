import Image from 'next/image'
import { Link } from '@/navigation'
import { SectionHeading } from '@/components/ui/SectionHeading'

type I18n = { es?: string; en?: string }
type Card = { iconType?: 'none' | 'emoji' | 'image'; icon?: string; iconImageUrl?: string; title?: I18n; body?: I18n; imageUrl?: string; ctaLabel?: I18n; ctaUrl?: string }
type Settings = {
  eyebrow?: I18n; title?: I18n; subtitle?: I18n
  columns?: 2 | 3 | 4
  bg?: 'white' | 'light' | 'navy'
  cardStyle?: 'flat' | 'shadow' | 'bordered' | 'image-top'
  cards?: Card[]
}

interface CardsGridSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

const BG: Record<string, string> = { white: 'bg-white', light: 'bg-[#eaeeef]', navy: 'bg-[#051c33]' }
const COLS: Record<number, string> = { 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }

const CARD_BASE: Record<string, string> = {
  flat:      'bg-white rounded-2xl p-7 flex flex-col gap-4',
  shadow:    'bg-white rounded-2xl p-7 flex flex-col gap-4 shadow-md',
  bordered:  'bg-white rounded-2xl p-7 flex flex-col gap-4 border border-[#051c33]/10',
  'image-top': 'bg-white rounded-2xl overflow-hidden flex flex-col',
}

export function CardsGridSection({ locale = 'es', settings = {} }: CardsGridSectionProps) {
  const s = settings as Settings
  const loc = locale as 'es' | 'en'
  const isNavy = s.bg === 'navy'

  const eyebrow  = s.eyebrow?.[loc]  || s.eyebrow?.es  || ''
  const title    = s.title?.[loc]    || s.title?.es    || ''
  const subtitle = s.subtitle?.[loc] || s.subtitle?.es || ''
  const cols     = s.columns ?? 3
  const cardStyle = s.cardStyle ?? 'bordered'
  const cards    = (s.cards ?? []) as Card[]

  if (cards.length === 0) return null

  return (
    <section className={`${BG[s.bg ?? 'white']} py-16 px-6 md:px-12`}>
      <div className="container mx-auto max-w-6xl">
        {(eyebrow || title || subtitle) && (
          <div className="mb-12">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
              centered
              light={isNavy}
            />
          </div>
        )}

        <div className={`grid ${COLS[cols] ?? COLS[3]} gap-6`}>
          {cards.map((card, i) => {
            const cardTitle  = card.title?.[loc]    || card.title?.es    || ''
            const cardBody   = card.body?.[loc]     || card.body?.es     || ''
            const ctaLabel   = card.ctaLabel?.[loc] || card.ctaLabel?.es || ''
            const ctaUrl     = card.ctaUrl || ''

            return (
              <div key={i} className={CARD_BASE[cardStyle] ?? CARD_BASE.bordered}>
                {/* Image top style */}
                {cardStyle === 'image-top' && card.imageUrl && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={card.imageUrl}
                      alt={cardTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={card.imageUrl.startsWith('http')}
                    />
                  </div>
                )}

                <div className={cardStyle === 'image-top' ? 'p-6 flex flex-col gap-3 flex-1' : 'flex flex-col gap-3 flex-1'}>
                  {/* Icon */}
                  {(card.iconType ?? 'emoji') === 'emoji' && card.icon && (
                    <div className="w-12 h-12 rounded-xl bg-[#051c33]/5 flex items-center justify-center text-2xl flex-shrink-0">
                      {card.icon}
                    </div>
                  )}
                  {card.iconType === 'image' && card.iconImageUrl && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image src={card.iconImageUrl} alt={cardTitle} fill className="object-cover" unoptimized={card.iconImageUrl.startsWith('http')} />
                    </div>
                  )}

                  {/* Title */}
                  {cardTitle && (
                    <h3 className={`font-heading text-lg leading-snug ${isNavy ? 'text-white' : 'text-[#051c33]'}`}>
                      {cardTitle}
                    </h3>
                  )}

                  {/* Body */}
                  {cardBody && (
                    <p className={`font-body text-sm leading-relaxed flex-1 ${isNavy ? 'text-white/70' : 'text-[#abacae]'}`}>
                      {cardBody}
                    </p>
                  )}

                  {/* CTA */}
                  {ctaLabel && ctaUrl && (
                    <Link
                      href={ctaUrl as `/${string}`}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#051c33] hover:underline"
                    >
                      {ctaLabel} →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
