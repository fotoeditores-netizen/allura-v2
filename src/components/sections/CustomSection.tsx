import Image from 'next/image'
import { Link } from '@/navigation'

type I18n = { es?: string; en?: string }
type Settings = {
  layout?: string
  bg?: string
  padding?: string
  align?: string
  eyebrow?: I18n
  title?: I18n
  subtitle?: I18n
  body?: I18n
  imageUrl?: string
  ctaLabel?: I18n
  ctaUrl?: string
  ctaStyle?: string
  cta2Label?: I18n
  cta2Url?: string
  cta2Style?: string
}

interface CustomSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

const BG_CLASSES: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-[#eaeeef]',
  navy:  'bg-[#051c33]',
}

const PADDING_CLASSES: Record<string, string> = {
  compact: 'py-5',
  normal:  'py-10',
  wide:    'py-20',
}

const ALIGN_CLASSES: Record<string, string> = {
  left:   'text-left items-start',
  center: 'text-center items-center',
  right:  'text-right items-end',
}

const CTA_CLASSES: Record<string, string> = {
  primary:   'bg-[#051c33] text-white hover:bg-[#051c33]/90',
  secondary: 'border border-white text-white hover:bg-white/10',
  outline:   'border border-[#051c33] text-[#051c33] hover:bg-[#051c33]/5',
  whatsapp:  'bg-[#25D366] text-white hover:bg-[#1ebe5d]',
}

export function CustomSection({ locale = 'es', settings = {} }: CustomSectionProps) {
  const s = settings as Settings
  const loc = locale as 'es' | 'en'
  const isNavy = s.bg === 'navy'

  const bg = BG_CLASSES[s.bg ?? 'white'] ?? BG_CLASSES.white
  const padding = PADDING_CLASSES[s.padding ?? 'normal'] ?? PADDING_CLASSES.normal
  const align = ALIGN_CLASSES[s.align ?? 'center'] ?? ALIGN_CLASSES.center

  const eyebrow = s.eyebrow?.[loc] || s.eyebrow?.es || ''
  const title   = s.title?.[loc]   || s.title?.es   || ''
  const subtitle = s.subtitle?.[loc] || s.subtitle?.es || ''
  const body    = s.body?.[loc]    || s.body?.es    || ''
  const ctaLabel  = s.ctaLabel?.[loc]  || s.ctaLabel?.es  || ''
  const ctaUrl    = s.ctaUrl || ''
  const cta2Label = s.cta2Label?.[loc] || s.cta2Label?.es || ''
  const cta2Url   = s.cta2Url || ''
  const hasImage = !!s.imageUrl && ['text-image-right','text-image-left'].includes(s.layout ?? '')
  const imageLeft = s.layout === 'text-image-left'
  const isHero = s.layout === 'hero-dark'

  const textBlock = (
    <div className={`flex flex-col gap-4 ${align}`}>
      {eyebrow && (
        <p className={`font-body text-xs tracking-[0.2em] uppercase ${isNavy || isHero ? 'text-[#8b9fb3]' : 'text-[#8b9fb3]'}`}>
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className={`font-heading leading-tight ${isNavy || isHero ? 'text-white' : 'text-[#051c33]'} ${isHero ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`font-body text-lg ${isNavy || isHero ? 'text-white/80' : 'text-[#051c33]/80'}`}>
          {subtitle}
        </p>
      )}
      {body && (
        <p className={`font-body text-base leading-relaxed whitespace-pre-line ${isNavy || isHero ? 'text-white/70' : 'text-[#abacae]'}`}>
          {body}
        </p>
      )}
      {(ctaLabel && ctaUrl) || (cta2Label && cta2Url) ? (
        <div className={`pt-2 flex flex-wrap gap-3 ${s.align === 'center' ? 'justify-center' : s.align === 'right' ? 'justify-end' : ''}`}>
          {ctaLabel && ctaUrl && (
            <Link
              href={ctaUrl as `/${string}`}
              className={`inline-block px-6 py-3 rounded-xl text-sm font-normal transition-colors ${CTA_CLASSES[s.ctaStyle ?? 'primary']}`}
            >
              {ctaLabel}
            </Link>
          )}
          {cta2Label && cta2Url && (
            <Link
              href={cta2Url as `/${string}`}
              className={`inline-block px-6 py-3 rounded-xl text-sm font-normal transition-colors ${CTA_CLASSES[s.cta2Style ?? 'whatsapp']}`}
            >
              {cta2Label}
            </Link>
          )}
        </div>
      ) : null}
    </div>
  )

  // Hero dark layout
  if (isHero) {
    return (
      <section className={`bg-[#051c33] ${padding} px-6 md:px-12`}>
        {s.imageUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <Image src={s.imageUrl} alt={title} fill className="object-cover opacity-20" unoptimized={s.imageUrl.startsWith('http')} />
          </div>
        )}
        <div className="container mx-auto max-w-4xl relative z-10">
          {textBlock}
        </div>
      </section>
    )
  }

  // Text + image layouts
  if (hasImage) {
    return (
      <section className={`${bg} ${padding} px-6 md:px-12`}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={imageLeft ? 'lg:order-2' : 'lg:order-1'}>
              {textBlock}
            </div>
            <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] ${imageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
              <Image
                src={s.imageUrl!}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={s.imageUrl!.startsWith('http')}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Text only layouts
  return (
    <section className={`${bg} ${padding} px-6 md:px-12`}>
      <div className={`container mx-auto max-w-4xl`}>
        {textBlock}
      </div>
    </section>
  )
}
