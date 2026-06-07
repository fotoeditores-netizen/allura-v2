import Image from 'next/image'
import { Link } from '@/navigation'

type I18n = { es?: string; en?: string }
type TextAlign = 'left' | 'center' | 'right'
type CtaColor  = 'whatsapp' | 'white' | 'navy' | 'outline'

type Settings = {
  style?: 'dark-centered' | 'dark-image'
  textAlign?: TextAlign
  eyebrow?: I18n
  title?: I18n
  subtitle?: I18n
  imageUrl?: string
  ctaLabel?: I18n
  ctaUrl?: string
  ctaColor?: CtaColor
  breadcrumb?: I18n
}

interface PageHeaderSectionProps {
  locale?: string
  settings?: Record<string, unknown>
}

const ALIGN_CLASS: Record<TextAlign, string> = {
  left:   'text-left  items-start',
  center: 'text-center items-center',
  right:  'text-right  items-end',
}

const CTA_CLASS: Record<CtaColor, string> = {
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1ebe5d]',
  white:    'bg-white text-[#051c33] hover:bg-[#eaeeef]',
  navy:     'bg-[#051c33] text-white hover:bg-[#062a4e]',
  outline:  'bg-transparent text-white border border-white hover:bg-white/10',
}

export function PageHeaderSection({ locale = 'es', settings = {} }: PageHeaderSectionProps) {
  const s = settings as Settings
  const loc = locale as 'es' | 'en'

  const style     = s.style     ?? 'dark-centered'
  const textAlign = s.textAlign ?? (style === 'dark-image' ? 'left' : 'center')
  const ctaColor  = s.ctaColor  ?? 'whatsapp'

  const eyebrow    = s.eyebrow?.[loc]    || s.eyebrow?.es    || ''
  const title      = s.title?.[loc]      || s.title?.es      || ''
  const subtitle   = s.subtitle?.[loc]   || s.subtitle?.es   || ''
  const ctaLabel   = s.ctaLabel?.[loc]   || s.ctaLabel?.es   || ''
  const ctaUrl     = s.ctaUrl || ''
  const breadcrumb = s.breadcrumb?.[loc] || s.breadcrumb?.es || ''

  const alignCls = ALIGN_CLASS[textAlign]
  const ctaCls   = CTA_CLASS[ctaColor]

  if (style === 'dark-image') {
    return (
      <section className="relative pt-40 pb-24 overflow-hidden min-h-[480px]">
        {s.imageUrl ? (
          <Image
            src={s.imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={s.imageUrl.startsWith('http')}
          />
        ) : (
          <div className="absolute inset-0 bg-[#051c33]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#051c33]/90 via-[#051c33]/70 to-[#051c33]/30" />

        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-12">
          {breadcrumb && (
            <p className="font-body text-xs text-white/50 mb-6 tracking-wide">{breadcrumb}</p>
          )}
          <div className={`max-w-2xl flex flex-col ${alignCls} ${textAlign === 'right' ? 'ml-auto' : textAlign === 'center' ? 'mx-auto' : ''}`}>
            {eyebrow && (
              <p className="font-body text-xs tracking-[0.2em] uppercase text-[#8b9fb3] mb-4">{eyebrow}</p>
            )}
            <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="font-body text-base text-white/70 leading-relaxed mb-8">{subtitle}</p>
            )}
            {ctaLabel && ctaUrl && (
              <Link
                href={ctaUrl as `/${string}`}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-normal text-sm transition-colors w-fit ${ctaCls}`}
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  // dark-centered / dark-left / dark-right
  return (
    <section className="bg-[#051c33] pt-40 pb-20 px-6 md:px-12">
      <div className={`container mx-auto max-w-3xl flex flex-col ${alignCls}`}>
        {breadcrumb && (
          <p className="font-body text-xs text-white/40 mb-6 tracking-wide">{breadcrumb}</p>
        )}
        {eyebrow && (
          <p className="font-body text-xs tracking-[0.2em] uppercase text-[#8b9fb3] mb-4">{eyebrow}</p>
        )}
        <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className={`font-body text-base text-white/70 leading-relaxed mb-8 ${textAlign === 'center' ? 'max-w-2xl' : ''}`}>
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl as `/${string}`}
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-normal text-sm transition-colors w-fit ${ctaCls}`}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
